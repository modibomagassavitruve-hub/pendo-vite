import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('pendo_token'));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('pendo_refresh_token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:3001/api/auth';

  // Charger le profil utilisateur au démarrage
  useEffect(() => {
    if (token) {
      loadUserProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  // Charger le profil
  const loadUserProfile = async () => {
    try {
      const response = await fetch(`${API_URL}/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.data);
      } else {
        // Token invalide, déconnexion
        logout();
      }
    } catch (error) {
      console.error('Erreur chargement profil:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Inscription
  const register = async (userData) => {
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (data.success) {
        return { success: true, data: data.data };
      } else {
        setError(data.error);
        return { success: false, error: data.error };
      }
    } catch (error) {
      const errorMsg = 'Erreur lors de l\'inscription';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Connexion
  const login = async (email, password) => {
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        const { token, refreshToken, user } = data.data;

        // Sauvegarder les tokens
        localStorage.setItem('pendo_token', token);
        localStorage.setItem('pendo_refresh_token', refreshToken);

        setToken(token);
        setRefreshToken(refreshToken);
        setUser(user);

        return { success: true };
      } else {
        setError(data.error);
        return { success: false, error: data.error };
      }
    } catch (error) {
      const errorMsg = 'Erreur lors de la connexion';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Déconnexion
  const logout = async () => {
    try {
      if (token) {
        await fetch(`${API_URL}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Erreur déconnexion:', error);
    } finally {
      // Nettoyer l'état local
      localStorage.removeItem('pendo_token');
      localStorage.removeItem('pendo_refresh_token');
      setToken(null);
      setRefreshToken(null);
      setUser(null);
      setError(null);
    }
  };

  // Mettre à jour le profil
  const updateProfile = async (updates) => {
    setError(null);

    try {
      const response = await fetch(`${API_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.data);
        return { success: true };
      } else {
        setError(data.error);
        return { success: false, error: data.error };
      }
    } catch (error) {
      const errorMsg = 'Erreur lors de la mise à jour du profil';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Changer le mot de passe
  const changePassword = async (currentPassword, newPassword) => {
    setError(null);

    try {
      const response = await fetch(`${API_URL}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await response.json();

      if (data.success) {
        return { success: true };
      } else {
        setError(data.error);
        return { success: false, error: data.error };
      }
    } catch (error) {
      const errorMsg = 'Erreur lors du changement de mot de passe';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  // Mettre à jour les préférences
  const updatePreferences = async (preferences) => {
    setError(null);

    try {
      const response = await fetch(`${API_URL}/preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(preferences)
      });

      const data = await response.json();

      if (data.success) {
        await loadUserProfile(); // Recharger le profil
        return { success: true };
      } else {
        setError(data.error);
        return { success: false, error: data.error };
      }
    } catch (error) {
      const errorMsg = 'Erreur lors de la mise à jour des préférences';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    updatePreferences,
    clearError: () => setError(null)
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;

import React, { useState } from 'react';
import axios from 'axios';
import { X, User } from 'lucide-react';

const API_URL = 'http://localhost:3001/api';

const NewConversationModal = ({ onClose, onConversationCreated }) => {
  const { t } = useTranslation();
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!userId || isNaN(userId)) {
      setError('Veuillez entrer un ID utilisateur valide');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('pendo_token');
      const response = await axios.post(
        `${API_URL}/chat/conversations`,
        {
          participant_ids: [parseInt(userId)],
          type: 'private'
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        onConversationCreated(response.data.data);
      }
    } catch (err) {
      console.error('Erreur création conversation:', err);
      setError(err.response?.data?.error || 'Erreur lors de la création de la conversation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Nouvelle conversation</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID de l'utilisateur
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="number"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Ex: 2"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={loading}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Entrez l'ID de l'utilisateur avec qui vous souhaitez discuter
            </p>
          </div>

          {/* Note d'aide */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-blue-800">
              <strong>Comment trouver un ID utilisateur ?</strong>
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Pour l'instant, vous devez connaître l'ID de l'utilisateur.
              Une fonctionnalité de recherche d'utilisateurs sera ajoutée prochainement.
            </p>
          </div>

          {/* Erreur */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Boutons */}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Création...' : 'Créer la conversation'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewConversationModal;

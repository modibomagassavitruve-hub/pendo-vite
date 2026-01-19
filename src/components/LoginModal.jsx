import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  X,
  Mail,
  Lock,
  User,
  Phone,
  Globe,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Shield,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

const LoginModal = ({ isOpen, onClose }) => {
  const { login, register, error, clearError } = useAuth();
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');

  // Animation d'entrée
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setAnimateIn(true), 50);
    } else {
      setAnimateIn(false);
    }
  }, [isOpen]);

  // Password strength indicator
  const getPasswordStrength = () => {
    if (!password) return { level: 0, text: '', color: '' };
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const levels = [
      { level: 0, text: '', color: '' },
      { level: 1, text: 'Faible', color: 'bg-red-500' },
      { level: 2, text: 'Moyen', color: 'bg-yellow-500' },
      { level: 3, text: 'Bon', color: 'bg-blue-500' },
      { level: 4, text: 'Excellent', color: 'bg-emerald-500' }
    ];
    return levels[strength];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    clearError();

    try {
      if (isLogin) {
        const result = await login(email, password);
        if (result.success) {
          setSuccess(true);
          setTimeout(() => {
            onClose();
            resetForm();
          }, 1500);
        }
      } else {
        const result = await register({
          email,
          password,
          first_name: firstName,
          last_name: lastName,
          phone,
          country
        });

        if (result.success) {
          setSuccess(true);
          setTimeout(() => {
            setIsLogin(true);
            resetForm();
            setSuccess(false);
          }, 2000);
        }
      }
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
    setPhone('');
    setCountry('');
    setSuccess(false);
    clearError();
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  const handleClose = () => {
    setAnimateIn(false);
    setTimeout(onClose, 200);
  };

  if (!isOpen) return null;

  const passwordStrength = getPasswordStrength();

  // Features list
  const features = [
    { icon: TrendingUp, text: 'Accès aux 17 bourses africaines' },
    { icon: Shield, text: 'Portefeuille sécurisé' },
    { icon: Sparkles, text: 'Alertes personnalisées' },
  ];

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300
        ${animateIn ? 'bg-black/70 backdrop-blur-sm' : 'bg-transparent'}`}
      onClick={handleClose}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      <div
        className={`relative w-full max-w-md transform transition-all duration-300
          ${animateIn ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Card principale */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#1a2744] to-[#0f172a] border border-white/10 shadow-2xl shadow-black/50">
          {/* Gradient border effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/20 via-transparent to-emerald-500/20 pointer-events-none" />

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header avec illustration */}
          <div className="relative px-8 pt-8 pb-6">
            {/* Icon animée */}
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full blur-xl opacity-50 animate-pulse" />
                <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                  {success ? (
                    <CheckCircle className="w-8 h-8 text-white animate-scale-in" />
                  ) : (
                    <User className="w-8 h-8 text-white" />
                  )}
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white text-center mb-2">
              {success
                ? (isLogin ? 'Connexion réussie!' : 'Compte créé!')
                : (isLogin ? 'Bon retour!' : 'Créer un compte')}
            </h2>
            <p className="text-white/60 text-center text-sm">
              {success
                ? 'Redirection en cours...'
                : (isLogin
                    ? 'Connectez-vous pour accéder à votre portefeuille'
                    : 'Rejoignez la communauté PENDO')}
            </p>
          </div>

          {/* Success state */}
          {success ? (
            <div className="px-8 pb-8 text-center">
              <div className="w-12 h-12 mx-auto bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
                <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
              </div>
            </div>
          ) : (
            <>
              {/* Error message */}
              {error && (
                <div className="mx-8 mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="px-8 pb-6 space-y-4">
                {!isLogin && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/70">Prénom</label>
                      <div className="relative group">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-blue-400 transition-colors" />
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all duration-200"
                          placeholder={t('placeholders.firstName')}
                          required={!isLogin}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/70">Nom</label>
                      <div className="relative group">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-blue-400 transition-colors" />
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all duration-200"
                          placeholder={t('placeholders.lastName')}
                          required={!isLogin}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-blue-400 transition-colors" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all duration-200"
                      placeholder={t('placeholders.email')}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Mot de passe</label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-blue-400 transition-colors" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-11 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all duration-200"
                      placeholder={t('placeholders.password')}
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/30 hover:text-white/70 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Password strength indicator */}
                  {!isLogin && password && (
                    <div className="space-y-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                              level <= passwordStrength.level
                                ? passwordStrength.color
                                : 'bg-white/10'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-white/50">
                        Force: <span className={`font-medium ${passwordStrength.level >= 3 ? 'text-emerald-400' : passwordStrength.level >= 2 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {passwordStrength.text}
                        </span>
                      </p>
                    </div>
                  )}
                </div>

                {!isLogin && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/70">Téléphone (optionnel)</label>
                      <div className="relative group">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-blue-400 transition-colors" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all duration-200"
                          placeholder="+225 XX XX XX XX XX"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/70">Pays</label>
                      <div className="relative group">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-blue-400 transition-colors z-10" />
                        <select
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all duration-200 appearance-none cursor-pointer"
                        >
                          <option value="" className="bg-[#1a2744]">Sélectionner un pays</option>
                          <option value="CI" className="bg-[#1a2744]">Côte d'Ivoire</option>
                          <option value="SN" className="bg-[#1a2744]">Sénégal</option>
                          <option value="ML" className="bg-[#1a2744]">Mali</option>
                          <option value="BF" className="bg-[#1a2744]">Burkina Faso</option>
                          <option value="BJ" className="bg-[#1a2744]">Bénin</option>
                          <option value="TG" className="bg-[#1a2744]">Togo</option>
                          <option value="NE" className="bg-[#1a2744]">Niger</option>
                          <option value="GW" className="bg-[#1a2744]">Guinée-Bissau</option>
                          <option value="CM" className="bg-[#1a2744]">Cameroun</option>
                          <option value="GH" className="bg-[#1a2744]">Ghana</option>
                          <option value="NG" className="bg-[#1a2744]">Nigeria</option>
                          <option value="KE" className="bg-[#1a2744]">Kenya</option>
                          <option value="ZA" className="bg-[#1a2744]">Afrique du Sud</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="
                    group relative w-full py-3.5 mt-6
                    bg-gradient-to-r from-blue-500 to-emerald-500
                    hover:from-blue-400 hover:to-emerald-400
                    text-white font-semibold rounded-xl
                    transition-all duration-300
                    shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40
                    disabled:opacity-50 disabled:cursor-not-allowed
                    overflow-hidden
                  "
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Chargement...
                      </>
                    ) : (
                      <>
                        {isLogin ? 'Se connecter' : "S'inscrire"}
                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                </button>
              </form>

              {/* Features (login only) */}
              {isLogin && (
                <div className="px-8 pb-6">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <p className="text-xs text-white/40 uppercase tracking-wider mb-3">Avantages membres</p>
                    <div className="space-y-2">
                      {features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3 text-sm text-white/70">
                          <feature.icon className="w-4 h-4 text-emerald-400" />
                          <span>{feature.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Switch mode */}
              <div className="px-8 pb-8 text-center">
                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />
                <p className="text-white/50 text-sm">
                  {isLogin ? t('messages.noAccount') : t('messages.haveAccount')}{' '}
                  <button
                    onClick={switchMode}
                    className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                  >
                    {isLogin ? 'Créer un compte' : 'Se connecter'}
                  </button>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;

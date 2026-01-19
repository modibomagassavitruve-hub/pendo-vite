import React, { useState } from 'react';
import { X, Send, Bug, Lightbulb, TrendingUp, MessageCircle, Star } from 'lucide-react';

const FeedbackModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    type: 'feature',
    category: '',
    title: '',
    description: '',
    rating: 0,
    email: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const feedbackTypes = [
    { value: 'bug', label: 'Signaler un bug', icon: Bug, color: 'text-red-600 bg-red-50' },
    { value: 'feature', label: 'Suggérer une fonctionnalité', icon: Lightbulb, color: 'text-yellow-600 bg-yellow-50' },
    { value: 'improvement', label: 'Proposer une amélioration', icon: TrendingUp, color: 'text-blue-600 bg-blue-50' },
    { value: 'other', label: 'Autre', icon: MessageCircle, color: 'text-gray-600 bg-gray-50' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          pageUrl: window.location.href,
          browserInfo: navigator.userAgent
        }),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setTimeout(() => {
          onClose();
          setSubmitSuccess(false);
          setFormData({
            type: 'feature',
            category: '',
            title: '',
            description: '',
            rating: 0,
            email: ''
          });
        }, 2000);
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du feedback:', error);
      alert('Erreur lors de l\'envoi du feedback. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl text-gray-900">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Donnez votre avis</h2>
            <p className="text-sm text-gray-500 mt-1">
              Votre feedback nous aide à améliorer PENDO
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {submitSuccess ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Merci pour votre feedback !</h3>
            <p className="text-gray-600">Nous l'examinerons bientôt et vous tiendrons informé.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Type de feedback */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Type de feedback *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {feedbackTypes.map(({ value, label, icon: Icon, color }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: value })}
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                      formData.type === value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-gray-900">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Titre */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-900 mb-2">
                Titre *
              </label>
              <input
                type="text"
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="Résumé en quelques mots..."
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900"
                placeholder="Décrivez votre feedback en détail..."
              />
            </div>

            {/* Évaluation */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Évaluation générale (optionnel)
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= formData.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                Email (optionnel)
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="votre@email.com"
              />
              <p className="text-xs text-gray-500 mt-1">
                Pour que nous puissions vous répondre
              </p>
            </div>

            {/* Boutons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Envoi...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Envoyer
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default FeedbackModal;

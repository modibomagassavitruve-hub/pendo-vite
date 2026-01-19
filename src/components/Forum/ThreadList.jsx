import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft, Plus, Eye, MessageSquare } from 'lucide-react';

const API_URL = 'http://localhost:3001/api';

const ThreadList = ({ category, onThreadSelect, onBack }) => {
  const { t } = useTranslation();
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewThread, setShowNewThread] = useState(false);
  const [newThread, setNewThread] = useState({ title: '', content: '' });

  useEffect(() => {
    if (category) {
      loadThreads();
    }
  }, [category]);

  const loadThreads = async () => {
    try {
      const token = localStorage.getItem('pendo_token');
      const response = await axios.get(
        `${API_URL}/forum/categories/${category.id}/threads`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      if (response.data.success) {
        setThreads(response.data.threads);
      }
    } catch (error) {
      console.error('Erreur chargement threads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateThread = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('pendo_token');
      if (!token) {
        alert('Vous devez être connecté pour créer une discussion');
        return;
      }

      const response = await axios.post(
        `${API_URL}/forum/threads`,
        {
          category_id: category.id,
          title: newThread.title,
          content: newThread.content
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setShowNewThread(false);
        setNewThread({ title: '', content: '' });
        loadThreads();
      }
    } catch (error) {
      console.error('Erreur création thread:', error);
      alert(error.response?.data?.error || 'Erreur lors de la création');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour aux catégories
        </button>

        <button
          onClick={() => setShowNewThread(!showNewThread)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nouvelle discussion
        </button>
      </div>

      <div className="bg-white rounded-lg border p-4">
        <h2 className="text-xl font-bold">{category.name}</h2>
        <p className="text-gray-600 text-sm">{category.description}</p>
      </div>

      {/* Formulaire nouvelle discussion */}
      {showNewThread && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Nouvelle discussion</h3>
          <form onSubmit={handleCreateThread}>
            <input
              type="text"
              placeholder="Titre de la discussion"
              value={newThread.title}
              onChange={(e) => setNewThread({ ...newThread, title: e.target.value })}
              className="w-full border rounded-lg px-4 py-2 mb-4"
              required
              minLength="5"
              maxLength="200"
            />
            <textarea
              placeholder="Contenu de votre message..."
              value={newThread.content}
              onChange={(e) => setNewThread({ ...newThread, content: e.target.value })}
              className="w-full border rounded-lg px-4 py-2 mb-4 h-32"
              required
              minLength="10"
              maxLength="10000"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Publier
              </button>
              <button
                type="button"
                onClick={() => setShowNewThread(false)}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste des threads */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : threads.length === 0 ? (
        <div className="bg-white rounded-lg border p-12 text-center">
          <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Aucune discussion pour le moment</p>
          <p className="text-gray-400 text-sm">Soyez le premier à lancer une discussion !</p>
        </div>
      ) : (
        <div className="space-y-2">
          {threads.map((thread) => (
            <div
              key={thread.id}
              onClick={() => onThreadSelect(thread)}
              className="bg-white rounded-lg border hover:border-blue-500 hover:shadow-md transition-all cursor-pointer p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {thread.is_pinned === 1 && (
                    <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded mb-2">
                      Épinglé
                    </span>
                  )}
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {thread.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {thread.content}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Par {thread.author_name}</span>
                    <span>{formatDate(thread.created_at)}</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {thread.views_count || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      {thread.posts_count || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThreadList;

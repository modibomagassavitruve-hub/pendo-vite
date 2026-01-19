import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft, MessageSquare, Eye, ThumbsUp } from 'lucide-react';

const API_URL = 'http://localhost:3001/api';

const ThreadDetail = ({ thread, onBack }) => {
  const { t } = useTranslation();
  const [threadData, setThreadData] = useState(thread);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [userLikes, setUserLikes] = useState([]);

  useEffect(() => {
    if (thread) {
      loadThreadDetails();
      loadPosts();
    }
  }, [thread]);

  const loadThreadDetails = async () => {
    try {
      const token = localStorage.getItem('pendo_token');
      const response = await axios.get(
        `${API_URL}/forum/threads/${thread.id}`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      if (response.data.success) {
        setThreadData(response.data.data);
      }
    } catch (error) {
      console.error('Erreur chargement thread:', error);
    }
  };

  const loadPosts = async () => {
    try {
      const token = localStorage.getItem('pendo_token');
      const response = await axios.get(
        `${API_URL}/forum/threads/${thread.id}/posts`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      if (response.data.success) {
        setPosts(response.data.posts);
        // Extraire les IDs des posts likés par l'utilisateur
        const liked = response.data.posts
          .filter(p => p.liked_by_user)
          .map(p => p.id);
        setUserLikes(liked);
      }
    } catch (error) {
      console.error('Erreur chargement posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('pendo_token');
      if (!token) {
        alert('Vous devez être connecté pour répondre');
        return;
      }

      const response = await axios.post(
        `${API_URL}/forum/threads/${thread.id}/posts`,
        { content: newPost },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setNewPost('');
        loadPosts();
        loadThreadDetails(); // Recharger pour mettre à jour le compteur
      }
    } catch (error) {
      console.error('Erreur création post:', error);
      alert(error.response?.data?.error || 'Erreur lors de la création');
    }
  };

  const handleLike = async (postId) => {
    try {
      const token = localStorage.getItem('pendo_token');
      if (!token) {
        alert('Vous devez être connecté pour liker');
        return;
      }

      const response = await axios.post(
        `${API_URL}/forum/posts/${postId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        // Mettre à jour l'état local
        if (response.data.liked) {
          setUserLikes([...userLikes, postId]);
        } else {
          setUserLikes(userLikes.filter(id => id !== postId));
        }
        // Recharger les posts pour mettre à jour les compteurs
        loadPosts();
      }
    } catch (error) {
      console.error('Erreur like:', error);
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
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-5 h-5" />
        Retour à la liste
      </button>

      {/* Thread principal */}
      <div className="bg-white rounded-lg border p-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {threadData.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>Par {threadData.author_name}</span>
            <span>{formatDate(threadData.created_at)}</span>
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {threadData.views_count || 0} vues
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              {threadData.replies_count || 0} réponses
            </span>
          </div>
        </div>

        <div className="prose max-w-none">
          <p className="text-gray-700 whitespace-pre-wrap">{threadData.content}</p>
        </div>

        {threadData.is_locked === 1 && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
            Cette discussion est verrouillée. Vous ne pouvez plus y répondre.
          </div>
        )}
      </div>

      {/* Posts */}
      <div className="space-y-3">
        <h2 className="text-xl font-bold text-gray-900">
          Réponses ({posts.length})
        </h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-lg border p-8 text-center">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Aucune réponse pour le moment</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg border p-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                    {post.author_name.charAt(0)}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-gray-900">
                      {post.author_name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatDate(post.created_at)}
                    </span>
                    {post.is_edited === 1 && (
                      <span className="text-xs text-gray-400 italic">
                        (modifié)
                      </span>
                    )}
                  </div>

                  <p className="text-gray-700 whitespace-pre-wrap mb-3">
                    {post.content}
                  </p>

                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-1 text-sm ${
                      userLikes.includes(post.id)
                        ? 'text-blue-600'
                        : 'text-gray-500 hover:text-blue-600'
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>{post.likes_count || 0}</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Formulaire de réponse */}
      {threadData.is_locked !== 1 && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">Répondre à la discussion</h3>
          <form onSubmit={handleCreatePost}>
            <textarea
              placeholder="Votre réponse..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 mb-4 h-32"
              required
              minLength="10"
              maxLength="10000"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Publier la réponse
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ThreadDetail;

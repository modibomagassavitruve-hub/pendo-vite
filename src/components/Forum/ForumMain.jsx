import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, TrendingUp, Users, Clock } from 'lucide-react';
import ForumCategories from './ForumCategories';
import ThreadList from './ThreadList';
import ThreadDetail from './ThreadDetail';

const API_URL = 'http://localhost:3001/api';

const ForumMain = () => {
  const [activeView, setActiveView] = useState('categories'); // categories, threads, thread
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedThread, setSelectedThread] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('pendo_token');
      const response = await axios.get(`${API_URL}/forum/stats`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setActiveView('threads');
  };

  const handleThreadSelect = (thread) => {
    setSelectedThread(thread);
    setActiveView('thread');
  };

  const handleBack = () => {
    if (activeView === 'thread') {
      setActiveView('threads');
      setSelectedThread(null);
    } else if (activeView === 'threads') {
      setActiveView('categories');
      setSelectedCategory(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <MessageSquare className="w-8 h-8 text-blue-600" />
                Forum PENDO
              </h1>
              <p className="text-gray-600 mt-1">
                Échangez et partagez avec la communauté d'investisseurs
              </p>
            </div>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-4 gap-4 mt-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Discussions</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total_threads}</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Réponses</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total_posts}</p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Contributeurs</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total_authors}</p>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-8 h-8 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-600">Vues totales</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total_views || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeView === 'categories' && (
          <ForumCategories onCategorySelect={handleCategorySelect} />
        )}

        {activeView === 'threads' && (
          <ThreadList
            category={selectedCategory}
            onThreadSelect={handleThreadSelect}
            onBack={handleBack}
          />
        )}

        {activeView === 'thread' && (
          <ThreadDetail
            thread={selectedThread}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  );
};

export default ForumMain;

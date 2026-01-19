import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageSquare, ChevronRight } from 'lucide-react';

const API_URL = 'http://localhost:3001/api';

const ForumCategories = ({ onCategorySelect }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const token = localStorage.getItem('pendo_token');
      const response = await axios.get(`${API_URL}/forum/categories`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Erreur chargement catégories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Catégories</h2>

      <div className="grid gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => onCategorySelect(category)}
            className="bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="text-4xl">{category.icon}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {category.description}
                  </p>
                  <div className="flex gap-6 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      {category.threads_count || 0} discussions
                    </span>
                    <span>
                      {category.posts_count || 0} messages
                    </span>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-gray-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForumCategories;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageCircle, Plus } from 'lucide-react';
import socketService from '../../services/socketService';
import ConversationList from './ConversationList';
import ChatWindow from './ChatWindow';
import NewConversationModal from './NewConversationModal';

const API_URL = 'http://localhost:3001/api';

const ChatMain = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('pendo_token');
    if (!token) {
      alert('Vous devez être connecté pour accéder au chat');
      return;
    }

    // Connecter au WebSocket
    socketService.connect(token);

    // Charger les conversations
    loadConversations();
    loadUnreadCount();

    // Écouter les nouveaux messages
    socketService.onNewMessage((message) => {
      // Recharger les conversations pour mettre à jour les aperçus
      loadConversations();
      loadUnreadCount();
    });

    return () => {
      socketService.disconnect();
    };
  }, []);

  const loadConversations = async () => {
    try {
      const token = localStorage.getItem('pendo_token');
      const response = await axios.get(`${API_URL}/chat/conversations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setConversations(response.data.data);
      }
    } catch (error) {
      console.error('Erreur chargement conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const token = localStorage.getItem('pendo_token');
      const response = await axios.get(`${API_URL}/chat/unread`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setUnreadCount(response.data.count);
      }
    } catch (error) {
      console.error('Erreur chargement non lus:', error);
    }
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    socketService.joinConversation(conversation.id);
  };

  const handleNewConversation = (conversation) => {
    setConversations([conversation, ...conversations]);
    setSelectedConversation(conversation);
    setShowNewConversation(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <MessageCircle className="w-8 h-8 text-blue-600" />
                Chat PENDO
              </h1>
              <p className="text-gray-600 mt-1">
                Messagerie instantanée avec la communauté
                {unreadCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {unreadCount} non lu{unreadCount > 1 ? 's' : ''}
                  </span>
                )}
              </p>
            </div>

            <button
              onClick={() => setShowNewConversation(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Nouvelle conversation
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Liste des conversations */}
          <div className="col-span-1">
            <ConversationList
              conversations={conversations}
              selectedConversation={selectedConversation}
              onSelectConversation={handleSelectConversation}
              loading={loading}
            />
          </div>

          {/* Fenêtre de chat */}
          <div className="col-span-2">
            {selectedConversation ? (
              <ChatWindow
                conversation={selectedConversation}
                onConversationUpdate={loadConversations}
              />
            ) : (
              <div className="bg-white rounded-lg border h-full flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>Sélectionnez une conversation</p>
                  <p className="text-sm">ou créez-en une nouvelle</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal nouvelle conversation */}
      {showNewConversation && (
        <NewConversationModal
          onClose={() => setShowNewConversation(false)}
          onConversationCreated={handleNewConversation}
        />
      )}
    </div>
  );
};

export default ChatMain;

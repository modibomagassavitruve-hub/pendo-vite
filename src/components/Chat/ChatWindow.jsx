import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import socketService from '../../services/socketService';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const API_URL = 'http://localhost:3001/api';

const ChatWindow = ({ conversation, onConversationUpdate }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typingUsers, setTypingUsers] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (conversation) {
      loadMessages();
      markAsRead();

      // Écouter les nouveaux messages
      socketService.onNewMessage((message) => {
        if (message.conversation_id === conversation.id) {
          setMessages((prev) => [...prev, message]);
          scrollToBottom();
          markAsRead();
        }
      });

      // Écouter l'indicateur de frappe
      socketService.onTyping((data) => {
        if (data.conversationId === conversation.id) {
          if (data.isTyping) {
            if (!typingUsers.includes(data.userId)) {
              setTypingUsers((prev) => [...prev, data.userId]);
            }
          } else {
            setTypingUsers((prev) => prev.filter((id) => id !== data.userId));
          }

          // Retirer automatiquement après 3 secondes
          setTimeout(() => {
            setTypingUsers((prev) => prev.filter((id) => id !== data.userId));
          }, 3000);
        }
      });
    }
  }, [conversation]);

  const loadMessages = async () => {
    try {
      const token = localStorage.getItem('pendo_token');
      const response = await axios.get(
        `${API_URL}/chat/conversations/${conversation.id}/messages`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setMessages(response.data.data);
        setTimeout(scrollToBottom, 100);
      }
    } catch (error) {
      console.error('Erreur chargement messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async () => {
    try {
      const token = localStorage.getItem('pendo_token');
      await axios.post(
        `${API_URL}/chat/conversations/${conversation.id}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onConversationUpdate();
    } catch (error) {
      console.error('Erreur marquage comme lu:', error);
    }
  };

  const handleSendMessage = async (content) => {
    try {
      const token = localStorage.getItem('pendo_token');
      const response = await axios.post(
        `${API_URL}/chat/conversations/${conversation.id}/messages`,
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        // Le message sera ajouté via WebSocket
        onConversationUpdate();
        return true;
      }
    } catch (error) {
      console.error('Erreur envoi message:', error);
      alert(error.response?.data?.error || 'Erreur lors de l\'envoi');
      return false;
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-white rounded-lg border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="font-semibold text-gray-900">
          {conversation.name || conversation.participants_names || 'Conversation'}
        </h2>
        {conversation.type === 'group' && (
          <p className="text-sm text-gray-500">
            {conversation.participants?.length || 0} participants
          </p>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <MessageList messages={messages} conversationId={conversation.id} />
            <div ref={messagesEndRef} />

            {/* Indicateur de frappe */}
            {typingUsers.length > 0 && (
              <div className="text-sm text-gray-500 italic mt-2">
                {typingUsers.length === 1 ? 'Quelqu\'un' : `${typingUsers.length} personnes`} est en train d'écrire...
              </div>
            )}
          </>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <MessageInput
          conversationId={conversation.id}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
};

export default ChatWindow;

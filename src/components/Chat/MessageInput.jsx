import React, { useState, useCallback } from 'react';
import { Send } from 'lucide-react';
import socketService from '../../services/socketService';

// Fonction debounce simple
const debounce = (func, wait) => {
  const { t } = useTranslation();
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const MessageInput = ({ conversationId, onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Gérer l'indicateur de frappe avec debounce
  const handleTypingStart = useCallback(
    debounce(() => {
      if (!isTyping) {
        setIsTyping(true);
        socketService.sendTyping(conversationId, true);
      }
    }, 300),
    [conversationId, isTyping]
  );

  const handleTypingStop = useCallback(
    debounce(() => {
      setIsTyping(false);
      socketService.sendTyping(conversationId, false);
    }, 1000),
    [conversationId]
  );

  const handleChange = (e) => {
    setMessage(e.target.value);

    if (e.target.value.trim()) {
      handleTypingStart();
      handleTypingStop();
    } else {
      socketService.sendTyping(conversationId, false);
      setIsTyping(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim() || sending) return;

    setSending(true);
    socketService.sendTyping(conversationId, false);
    setIsTyping(false);

    const success = await onSendMessage(message.trim());

    if (success) {
      setMessage('');
    }

    setSending(false);
  };

  const handleKeyDown = (e) => {
    // Envoyer avec Enter (sans Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <textarea
        value={message}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Votre message... (Enter pour envoyer, Shift+Enter pour nouvelle ligne)"
        className="flex-1 border rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows="1"
        style={{
          minHeight: '40px',
          maxHeight: '120px',
          height: 'auto'
        }}
        disabled={sending}
      />
      <button
        type="submit"
        disabled={!message.trim() || sending}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <Send className="w-5 h-5" />
        {sending ? 'Envoi...' : 'Envoyer'}
      </button>
    </form>
  );
};

export default MessageInput;

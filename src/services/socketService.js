import io from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  connect(token) {
    if (this.socket && this.connected) {
      console.log('Socket already connected');
      return;
    }

    this.socket = io('http://localhost:3001', {
      auth: { token }
    });

    this.socket.on('connect', () => {
      console.log('✅ Connecté au chat WebSocket');
      this.connected = true;
      this.socket.emit('join_conversations');
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Déconnecté du chat WebSocket');
      this.connected = false;
    });

    this.socket.on('conversations_joined', (data) => {
      console.log(`Rejoint ${data.count} conversations`);
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  // Écouter les nouveaux messages
  onNewMessage(callback) {
    if (this.socket) {
      this.socket.on('new_message', callback);
    }
  }

  // Écouter les messages modifiés
  onMessageEdited(callback) {
    if (this.socket) {
      this.socket.on('message_edited', callback);
    }
  }

  // Écouter les messages supprimés
  onMessageDeleted(callback) {
    if (this.socket) {
      this.socket.on('message_deleted', callback);
    }
  }

  // Écouter l'indicateur de frappe
  onTyping(callback) {
    if (this.socket) {
      this.socket.on('user_typing', callback);
    }
  }

  // Écouter les réactions
  onReaction(callback) {
    if (this.socket) {
      this.socket.on('message_reaction', callback);
    }
  }

  // Envoyer l'état de frappe
  sendTyping(conversationId, isTyping) {
    if (this.socket && this.connected) {
      this.socket.emit('typing', { conversationId, isTyping });
    }
  }

  // Rejoindre une conversation
  joinConversation(conversationId) {
    if (this.socket && this.connected) {
      this.socket.emit('join_conversation', conversationId);
    }
  }

  // Quitter une conversation
  leaveConversation(conversationId) {
    if (this.socket && this.connected) {
      this.socket.emit('leave_conversation', conversationId);
    }
  }

  // Vérifier si connecté
  isConnected() {
    return this.connected;
  }
}

export default new SocketService();

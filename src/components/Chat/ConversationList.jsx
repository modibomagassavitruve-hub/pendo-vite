import React from 'react';
import { MessageCircle, Users } from 'lucide-react';

const ConversationList = ({ conversations, selectedConversation, onSelectConversation, loading }) => {
  const { t } = useTranslation();
  const formatDate = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;

    // Moins d'une journée
    if (diff < 86400000) {
      return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    }

    // Moins d'une semaine
    if (diff < 604800000) {
      return d.toLocaleDateString('fr-FR', { weekday: 'short' });
    }

    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border p-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="bg-white rounded-lg border p-8 text-center">
        <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">Aucune conversation</p>
        <p className="text-sm text-gray-400">Commencez une nouvelle discussion</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-gray-900">Messages</h2>
      </div>

      <div className="overflow-y-auto h-[calc(100vh-280px)]">
        {conversations.map((conv) => {
          const isSelected = selectedConversation?.id === conv.id;
          const unread = conv.unread_count > 0;

          return (
            <div
              key={conv.id}
              onClick={() => onSelectConversation(conv)}
              className={`p-4 border-b cursor-pointer transition-colors ${
                isSelected
                  ? 'bg-blue-50 border-l-4 border-l-blue-600'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {conv.type === 'group' ? (
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                      {conv.participants_names?.charAt(0) || '?'}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-semibold truncate ${unread ? 'text-gray-900' : 'text-gray-700'}`}>
                      {conv.name || conv.participants_names || 'Conversation'}
                    </h3>
                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                      {formatDate(conv.last_message_at)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className={`text-sm truncate ${unread ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
                      {conv.last_message || 'Aucun message'}
                    </p>
                    {unread && (
                      <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full flex-shrink-0 ml-2">
                        {conv.unread_count}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConversationList;

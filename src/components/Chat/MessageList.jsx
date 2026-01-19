import React from 'react';

const MessageList = ({ messages, conversationId }) => {
  const { t } = useTranslation();
  const currentUserId = getUserIdFromToken();

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) {
      return t('messages.today');
    } else if (d.toDateString() === yesterday.toDateString()) {
      return 'Hier';
    } else {
      return d.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
  };

  // Grouper les messages par date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = new Date(message.created_at).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <div className="space-y-4">
      {Object.entries(groupedMessages).map(([date, msgs]) => (
        <div key={date}>
          {/* Séparateur de date */}
          <div className="flex items-center justify-center my-4">
            <div className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
              {formatDate(msgs[0].created_at)}
            </div>
          </div>

          {/* Messages */}
          {msgs.map((message, index) => {
            const isOwn = message.user_id === currentUserId;
            const showAvatar = index === 0 || msgs[index - 1].user_id !== message.user_id;

            return (
              <div
                key={message.id}
                className={`flex items-end gap-2 mb-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                {showAvatar && !isOwn ? (
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm flex-shrink-0">
                    {message.author_name?.charAt(0) || '?'}
                  </div>
                ) : (
                  <div className="w-8" />
                )}

                {/* Message */}
                <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
                  {showAvatar && !isOwn && (
                    <span className="text-xs text-gray-500 mb-1 ml-2">
                      {message.author_name}
                    </span>
                  )}

                  <div
                    className={`rounded-2xl px-4 py-2 ${
                      isOwn
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{message.content}</p>

                    {message.is_edited === 1 && (
                      <span className={`text-xs italic ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
                        {' '}(modifié)
                      </span>
                    )}
                  </div>

                  {/* Timestamp */}
                  <span className={`text-xs text-gray-400 mt-1 ${isOwn ? 'mr-2' : 'ml-2'}`}>
                    {formatTime(message.created_at)}
                  </span>

                  {/* Réactions (si présentes) */}
                  {message.reactions && Object.keys(message.reactions).length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {Object.entries(message.reactions).map(([emoji, count]) => (
                        <div
                          key={emoji}
                          className="bg-white border rounded-full px-2 py-0.5 text-xs flex items-center gap-1"
                        >
                          <span>{emoji}</span>
                          <span className="text-gray-600">{count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// Helper pour extraire l'ID utilisateur du token
function getUserIdFromToken() {
  try {
    const token = localStorage.getItem('pendo_token');
    if (!token) return null;

    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userId;
  } catch (error) {
    return null;
  }
}

export default MessageList;

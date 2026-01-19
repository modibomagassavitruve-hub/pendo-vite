import { useTranslation } from 'react-i18next';
import { API_URL } from '../config';
import React, { useState, useEffect } from 'react';

const ArticleDetail = ({ article, onClose }) => {
  const { t, i18n } = useTranslation();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const params = new URLSearchParams();
        params.append('lang', i18n.language);
        const response = await fetch(`${API_URL}/news/article/${article.id}?${params}`);
        const data = await response.json();
        if (data.success && data.data) {
          setContent(data.data);
        } else {
          setContent(article);
        }
      } catch (error) {
        console.error('Erreur:', error);
        setContent(article);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [article, i18n.language]);

  const flags = { ZA: '🇿🇦', NG: '🇳🇬', EG: '🇪🇬', KE: '🇰🇪', MA: '🇲🇦', GH: '🇬🇭', CI: '🇨🇮', TN: '🇹🇳' };
  
  const marketNames = {
    jse: 'Johannesburg Stock Exchange',
    nse_ng: 'Nigerian Exchange',
    egx: 'Egyptian Exchange',
    masi: 'Bourse de Casablanca',
    brvm: 'BRVM (Bourse Régionale)',
    gse: 'Ghana Stock Exchange',
    nse_ke: 'Nairobi Securities Exchange'
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryColor = (cat) => {
    const colors = {
      'IPO': 'bg-purple-500',
      'M&A': 'bg-blue-600',
      'Earnings': 'bg-green-500',
      'Banking': 'bg-indigo-500',
      'Technology': 'bg-cyan-500',
      'Commodities': 'bg-yellow-600',
      'Market Update': 'bg-emerald-500',
      'Investment': 'bg-teal-500',
      'Regulation': 'bg-red-500',
    };
    return colors[cat] || 'bg-blue-500';
  };

  const displayContent = content || article;

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-gray-800 rounded-2xl max-w-4xl w-full my-8 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-gray-800 to-gray-900 rounded-t-2xl border-b border-gray-700 p-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-3xl">{flags[displayContent.country] || '🌍'}</span>
              <span className={`${getCategoryColor(displayContent.category)} px-4 py-1.5 rounded-full text-sm font-medium text-white`}>
                {displayContent.category || 'General'}
              </span>
              {displayContent.market_id && (
                <span className="bg-orange-500 px-4 py-1.5 rounded-full text-sm font-medium text-white">
                  {displayContent.market_id.toUpperCase()}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-3xl font-light hover:bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mb-4"></div>
              <p className="text-gray-400">Chargement de l'article...</p>
            </div>
          ) : (
            <>
              {/* Title */}
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-6 leading-tight">
                {displayContent.title}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm mb-8 pb-6 border-b border-gray-700">
                <span className="flex items-center gap-2">
                  <span className="text-lg">📰</span> {displayContent.source}
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-lg">🕐</span> {formatDate(displayContent.published_at)}
                </span>
                {displayContent.market_id && (
                  <span className="flex items-center gap-2">
                    <span className="text-lg">📈</span> {marketNames[displayContent.market_id] || displayContent.market_id.toUpperCase()}
                  </span>
                )}
              </div>

              {/* Summary */}
              {displayContent.summary && (
                <div className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border-l-4 border-orange-500 rounded-r-lg p-5 mb-8">
                  <p className="text-gray-200 text-lg leading-relaxed italic">
                    {displayContent.summary}
                  </p>
                </div>
              )}

              {/* Full Content */}
              <div className="prose prose-lg prose-invert max-w-none">
                {displayContent.content ? (
                  <div className="text-gray-300 leading-relaxed space-y-6">
                    {displayContent.content.split('\n\n').map((paragraph, i) => {
                      // Détecter les titres (lignes commençant par **)
                      if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                        return (
                          <h3 key={i} className="text-xl font-semibold text-orange-400 mt-8 mb-4">
                            {paragraph.replace(/\*\*/g, '')}
                          </h3>
                        );
                      }
                      // Détecter les listes
                      if (paragraph.startsWith('- ')) {
                        const items = paragraph.split('\n').filter(line => line.startsWith('- '));
                        return (
                          <ul key={i} className="list-disc list-inside space-y-2 ml-4">
                            {items.map((item, j) => (
                              <li key={j} className="text-gray-300">{item.replace('- ', '')}</li>
                            ))}
                          </ul>
                        );
                      }
                      // Paragraphe normal
                      return (
                        <p key={i} className="text-gray-300 text-lg leading-relaxed">
                          {paragraph}
                        </p>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-400 text-lg">
                    {displayContent.summary || {t('messages.contentUnavailable')}}
                  </p>
                )}
              </div>

              {/* Market Info Card */}
              {displayContent.market_id && (
                <div className="mt-10 bg-gradient-to-r from-gray-700/50 to-gray-800/50 rounded-xl p-6 border border-gray-600">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="text-2xl">📊</span> Marché associé
                  </h3>
                  <p className="text-gray-300 mb-4">
                    {marketNames[displayContent.market_id] || displayContent.market_id.toUpperCase()}
                  </p>
                  <button 
                    onClick={onClose}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
                  >
                    Voir les données du marché →
                  </button>
                </div>
              )}

              {/* Source Link */}
              {displayContent.url && (
                <div className="mt-8 pt-6 border-t border-gray-700">
                  <a
                    href={displayContent.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl"
                  >
                    🔗 {t('news.readFullArticle')} {displayContent.source}
                  </a>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;

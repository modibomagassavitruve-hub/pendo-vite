import { useTranslation } from 'react-i18next';
import { API_URL } from '../config';
import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { Newspaper, Clock, TrendingUp, Globe, RefreshCw, ChevronRight, X, ExternalLink, Link2 } from 'lucide-react';

const NewsSection = () => {
  const { t, i18n } = useTranslation();

  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [scraping, setScraping] = useState(false);

  // Fonction pour nettoyer le HTML des articles
  const cleanHtmlContent = (html) => {
    if (!html) return '';
    // Retirer les balises HTML et ne garder que le texte
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

  // Scraper automatiquement à l'ouverture d'un article sans contenu
  useEffect(() => {
    if (selectedArticle && !selectedArticle.content && !selectedArticle.summary && selectedArticle.id) {
      scrapeArticleContent(selectedArticle.id);
    }
  }, [selectedArticle]);

  // Fonction pour scraper le contenu complet d'un article
  const scrapeArticleContent = async (articleId) => {
    setScraping(true);
    try {
      const params = new URLSearchParams();
      params.append('lang', i18n.language);
      const response = await fetch(`${API_URL}/news/scrape/${articleId}?${params}`, {
        method: 'POST'
      });
      const data = await response.json();

      if (data.success && data.data) {
        // Mettre à jour l'article sélectionné
        setSelectedArticle(data.data);

        // Mettre à jour dans la liste des articles
        setNews(prevNews =>
          prevNews.map(article =>
            article.id === articleId ? data.data : article
          )
        );
      }
      return data;
    } catch (error) {
      console.error('Erreur scraping:', error);
      return { success: false, error: error.message };
    } finally {
      setScraping(false);
    }
  };

  const fetchNews = async (lang) => {
    try {
      const params = new URLSearchParams();
      params.append('limit', '200');
      params.append('lang', lang || i18n.language);
      const response = await fetch(`${API_URL}/news/latest?${params}`);
      const data = await response.json();
      if (data.success) {
        setNews(data.data);
      }
    } catch (error) {
      console.error('Erreur chargement actualités:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(i18n.language);
    // Rafraîchir toutes les 5 minutes
    const interval = setInterval(() => fetchNews(i18n.language), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Re-fetch news when language changes
  useEffect(() => {
    setLoading(true);
    fetchNews(i18n.language);
  }, [i18n.language]);


  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetch(`${API_URL}/news/refresh`, { method: 'POST' });
      await fetchNews();
    } catch (error) {
      console.error('Erreur rafraîchissement:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return t('time.minutesAgo', { minutes: diffMins });
    if (diffHours < 24) return t('time.hoursAgo', { hours: diffHours });
    if (diffDays < 7) return t('time.daysAgo', { days: diffDays });

    // Use locale-aware date formatting
    const locale = i18n.language === 'fr' ? 'fr-FR' :
                   i18n.language === 'de' ? 'de-DE' :
                   i18n.language === 'es' ? 'es-ES' :
                   i18n.language === 'pt' ? 'pt-PT' :
                   i18n.language === 'ar' ? 'ar-SA' : 'en-US';
    return date.toLocaleDateString(locale);
  };

  const getCategoryColor = (category) => {
    const colors = {
      'IPO': 'bg-purple-500',
      'M&A': 'bg-blue-500',
      'Earnings': 'bg-green-500',
      'Monetary Policy': 'bg-yellow-500',
      'Regulation': 'bg-red-500',
      'Commodities': 'bg-orange-500',
      'Technology': 'bg-cyan-500',
      'Banking': 'bg-indigo-500',
      'Market Update': 'bg-emerald-500',
      'Investment': 'bg-teal-500',
    };
    return colors[category] || 'bg-gray-500';
  };

  const getCategoryLabel = (category) => {
    const categoryMap = {
      'IPO': t('categories.ipo'),
      'M&A': t('categories.ma'),
      'Earnings': t('categories.earnings'),
      'Monetary Policy': t('categories.monetaryPolicy'),
      'Regulation': t('categories.regulation'),
      'Commodities': t('categories.commodities'),
      'Technology': t('categories.technology'),
      'Banking': t('categories.banking'),
      'Market Update': t('categories.marketUpdate'),
      'Investment': t('categories.investment'),
      'Markets': t('categories.markets'),
    };
    return categoryMap[category] || category;
  };

  const getCountryFlag = (countryCode) => {
    const flags = {
      'ZA': '🇿🇦', 'NG': '🇳🇬', 'EG': '🇪🇬', 'KE': '🇰🇪',
      'MA': '🇲🇦', 'GH': '🇬🇭', 'CI': '🇨🇮', 'SN': '🇸🇳',
      'TN': '🇹🇳', 'BW': '🇧🇼', 'MU': '🇲🇺', 'TZ': '🇹🇿',
      'UG': '🇺🇬', 'ZM': '🇿🇲', 'ZW': '🇿🇼', 'NA': '🇳🇦',
      'RW': '🇷🇼', 'MW': '🇲🇼'
    };
    return flags[countryCode] || '🌍';
  };

  const filteredNews = filter === 'all'
    ? news
    : news.filter(n => n.market_id === filter || n.country === filter);

  const categories = ['all', ...new Set(news.map(n => n.category).filter(Boolean))];

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Newspaper className="w-6 h-6 text-orange-500" />
          <h2 className="text-xl font-bold text-white">{t('news.financialNews')}</h2>
        </div>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Newspaper className="w-6 h-6 text-orange-500" />
          <h2 className="text-xl font-bold text-white">{t('news.financialNews')}</h2>
          <span className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full text-xs">
            {news.length} {t('market.articles')}
          </span>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-gray-300 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          {t('buttons.refresh')}
        </button>
      </div>

      {/* Filtres */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['all', 'jse', 'nse_ng', 'egx', 'masi', 'brvm', 'gse'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
              filter === f
                ? 'bg-orange-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {f === 'all' ? t('common.all') : f.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Liste des actualités */}
      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
        {filteredNews.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            {t('news.noNewsAvailable')}
          </div>
        ) : (
          filteredNews.map((article, index) => (
            <button
              key={index}
              onClick={() => setSelectedArticle(article)}
              className="block w-full bg-gray-700/50 hover:bg-gray-700 rounded-lg p-4 transition-colors group text-left"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Badges */}
                  <div className="flex items-center gap-2 mb-2">
                    {article.country && (
                      <span className="text-lg">{getCountryFlag(article.country)}</span>
                    )}
                    {article.category && (
                      <span className={`${getCategoryColor(article.category)} px-2 py-0.5 rounded text-xs text-white`}>
                        {getCategoryLabel(article.category)}
                      </span>
                    )}
                    <span className="text-xs text-gray-400">{article.source}</span>
                  </div>

                  {/* Titre */}
                  <h3 className="text-white font-medium mb-2 line-clamp-2 group-hover:text-orange-400 transition-colors">
                    {article.title}
                  </h3>

                  {/* Résumé */}
                  {article.summary && (
                    <p className="text-gray-400 text-sm line-clamp-2 mb-2">
                      {article.summary}
                    </p>
                  )}

                  {/* Footer */}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(article.published_at)}
                    </span>
                    {article.market_id && (
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {article.market_id.toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Source link */}
                  {article.url && (
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-600">
                      <Link2 className="w-3 h-3 text-gray-500" />
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-orange-400 hover:text-orange-300 text-xs font-medium flex items-center gap-1 truncate hover:underline"
                      >
                        {article.source || (() => { try { return new URL(article.url).hostname.replace('www.', ''); } catch { return 'Source'; } })()}
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      </a>
                    </div>
                  )}
                </div>

                <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-orange-400 transition-colors flex-shrink-0" />
              </div>
            </button>
          ))
        )}
      </div>

      {/* Modal de détails */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex justify-between items-start">
              <div className="flex-1 pr-4">
                <div className="flex items-center gap-2 mb-3">
                  {selectedArticle.country && (
                    <span className="text-2xl">{getCountryFlag(selectedArticle.country)}</span>
                  )}
                  {selectedArticle.category && (
                    <span className={`${getCategoryColor(selectedArticle.category)} px-3 py-1 rounded text-xs text-white font-medium`}>
                      {getCategoryLabel(selectedArticle.category)}
                    </span>
                  )}
                  {selectedArticle.market_id && (
                    <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded text-xs font-medium">
                      {selectedArticle.market_id.toUpperCase()}
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">{selectedArticle.title}</h2>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatDate(selectedArticle.published_at)}
                  </span>
                  <span>{selectedArticle.source}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="text-gray-400 hover:text-white transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Contenu */}
            <div className="p-6">
              {/* Afficher le summary en premier si disponible */}
              {selectedArticle.summary && (
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 mb-6">
                  <h3 className="text-orange-400 font-semibold mb-2">
                    {selectedArticle.content ? t('news.summary') : t('news.description')}
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-base">
                    {selectedArticle.summary}
                  </p>
                </div>
              )}

              {/* Afficher le contenu complet si disponible */}
              {selectedArticle.content && (
                <div className="prose prose-invert max-w-none">
                  <div className="text-gray-300 leading-relaxed space-y-4">
                    {cleanHtmlContent(selectedArticle.content).split('\n\n').map((paragraph, idx) => (
                      paragraph.trim() && (
                        <p key={idx} className="text-base">
                          {paragraph}
                        </p>
                      )
                    ))}
                  </div>
                </div>
              )}

              {/* Message de chargement si scraping en cours */}
              {!selectedArticle.content && !selectedArticle.summary && scraping && (
                <div className="text-center py-8">
                  <RefreshCw className="w-12 h-12 mx-auto mb-3 text-orange-500 animate-spin" />
                  <p className="text-gray-300 mb-2">{t('messages.loadingContent')}</p>
                  <p className="text-sm text-gray-500">{t('messages.pleaseWait')}</p>
                </div>
              )}

              {/* Message si aucun contenu après scraping */}
              {!selectedArticle.content && !selectedArticle.summary && !scraping && (
                <div className="text-center py-8">
                  <Newspaper className="w-12 h-12 mx-auto mb-3 opacity-50 text-gray-400" />
                  <p className="text-gray-400 mb-2">{t('messages.contentNotAvailable')}</p>
                  <p className="text-sm text-gray-500">{t('messages.clickToRead')}</p>
                </div>
              )}

              {selectedArticle.url && (
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <a
                    href={selectedArticle.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition"
                  >
                    <Globe className="w-4 h-4" />
                    {t('buttons.readFullArticle')}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(NewsSection);

import { useTranslation } from 'react-i18next';
import React, { useState, useEffect, useRef } from 'react';
import {
  Search, Filter, TrendingUp, TrendingDown, Building2, Heart,
  Cpu, Zap, Mountain, ShoppingBag, DollarSign, Globe, AlertCircle,
  Star, Eye, ArrowRight, ChevronDown, ExternalLink, Link2
} from 'lucide-react';
import {
  companySizeMap,
  stageMap,
  horizonMap,
  riskLevelMap,
  regionMap,
  mapValue
} from '../utils/opportunityMappings';
import { API_URL } from '../config';

const AUTO_REFRESH_INTERVAL = 60000; // 1 minute

const OpportunitiesTab = () => {
  const { t, i18n } = useTranslation();
  const [opportunities, setOpportunities] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOpp, setSelectedOpp] = useState(null);
  const intervalRef = useRef(null);

  // Filtres
  const [filters, setFilters] = useState({
    sector: '',
    country: '',
    risk_level: '',
    search: '',
    sort: 'newest'
  });

  const [showFilters, setShowFilters] = useState(false);

  // Charger les opportunités
  useEffect(() => {
    fetchOpportunities();
    fetchStats();
  }, [filters]);

  // Auto-refresh effect
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Set up auto-refresh
    intervalRef.current = setInterval(() => {
      console.log('Auto-refreshing opportunities...');
      fetchOpportunities();
      fetchStats();
    }, AUTO_REFRESH_INTERVAL);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [filters]);

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.sector) params.append('sector', filters.sector);
      if (filters.country) params.append('country', filters.country);
      if (filters.risk_level) params.append('risk_level', filters.risk_level);
      if (filters.search) params.append('search', filters.search);
      params.append('sort', filters.sort);
      params.append('limit', '100'); // Obtenir toutes les opportunités (44 actuellement)
      params.append('lang', i18n.language); // Ajouter le paramètre de langue

      const res = await fetch(`${API_URL}/opportunities?${params}`);
      const data = await res.json();

      if (data.success) {
        setOpportunities(data.data);
      }
    } catch (error) {
      console.error('Erreur chargement opportunités:', error);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch opportunities when language changes
  useEffect(() => {
    fetchOpportunities();
  }, [i18n.language]);


  const fetchStats = async () => {
    try {
      const params = new URLSearchParams();
      params.append('lang', i18n.language);
      const res = await fetch(`${API_URL}/opportunities/stats?${params}`);
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ sector: '', country: '', risk_level: '', search: '', sort: 'newest' });
  };

  const getRiskColor = (risk) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      very_high: 'bg-red-100 text-red-800'
    };
    return colors[risk] || 'bg-gray-100 text-gray-800';
  };

  const getRiskLabel = (risk) => {
    const labels = {
      low: t('opportunities.riskLow'),
      medium: t('opportunities.riskMedium'),
      high: t('opportunities.riskHigh'),
      very_high: t('opportunities.riskVeryHigh')
    };
    return labels[risk] || risk;
  };

  const getHorizonLabel = (horizon) => {
    const labels = {
      short: t('opportunities.horizonShort'),
      medium: t('opportunities.horizonMedium'),
      long: t('opportunities.horizonLong')
    };
    return labels[horizon] || horizon;
  };

  const getOpportunityTypeLabel = (type) => {
    const labels = {
      company: t('opportunities.company'),
      project: t('opportunities.project'),
      other: t('opportunities.other')
    };
    return labels[type] || type;
  };

  const getSectorIcon = (sector) => {
    const icons = {
      'Finance': DollarSign,
      'Énergie': Zap,
      'Tech': Cpu,
      'Santé': Heart,
      'Mines': Mountain,
      'Commerce': ShoppingBag,
      'Immobilier': Building2,
      'Agriculture': '🌾'
    };
    return icons[sector] || Globe;
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M USD`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K USD`;
    return `${amount} USD`;
  };

  if (loading && opportunities.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec stats */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">
          {t('opportunities.title')}
        </h2>
        <p className="text-gray-400">
          {t('opportunities.subtitle')}
        </p>
      </div>

      {/* Statistiques rapides */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="text-gray-400 text-sm mb-1">{t('opportunities.totalOpportunities')}</div>
            <div className="text-2xl font-bold text-white">{stats.total}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="text-gray-400 text-sm mb-1">{t('opportunities.totalMarkets')}</div>
            <div className="text-2xl font-bold text-green-400">
              {formatCurrency(stats.total_market_size)}
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="text-gray-400 text-sm mb-1">{t('opportunities.avgROI')}</div>
            <div className="text-2xl font-bold text-orange-400">
              {stats.avg_return?.toFixed(1)}%
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="text-gray-400 text-sm mb-1">{t('opportunities.countriesCovered')}</div>
            <div className="text-2xl font-bold text-blue-400">
              {stats.by_country?.length || 0}
            </div>
          </div>
        </div>
      )}

      {/* Barre de recherche et filtres */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Recherche */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={t('placeholders.searchOpportunity')}
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Bouton filtres */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white flex items-center gap-2 hover:bg-gray-700"
          >
            <Filter className="w-5 h-5" />
            <span>{t('common.filters')}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          {/* Tri */}
          <select
            value={filters.sort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
          >
            <option value="newest">{t('filters.newest')}</option>
            <option value="oldest">{t('filters.oldest')}</option>
            <option value="return_high">{t('filters.roiHigh')}</option>
            <option value="return_low">{t('filters.roiLow')}</option>
            <option value="investment_low">{t('filters.investmentLow')}</option>
            <option value="investment_high">{t('filters.investmentHigh')}</option>
          </select>
        </div>

        {/* Panneau de filtres */}
        {showFilters && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Filtre secteur */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{t('filters.sector')}</label>
                <select
                  value={filters.sector}
                  onChange={(e) => handleFilterChange('sector', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="">{t('filters.allSectors')}</option>
                  {stats?.by_sector.map(s => (
                    <option key={s.sector} value={s.sector}>{s.sector} ({s.count})</option>
                  ))}
                </select>
              </div>

              {/* Filtre pays */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{t('filters.country')}</label>
                <select
                  value={filters.country}
                  onChange={(e) => handleFilterChange('country', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="">{t('filters.allCountries')}</option>
                  {stats?.by_country.map(c => (
                    <option key={c.country} value={c.country}>{t(`countries.${c.country}`, c.country_name)} ({c.count})</option>
                  ))}
                </select>
              </div>

              {/* Filtre risque */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">{t('filters.riskLevel')}</label>
                <select
                  value={filters.risk_level}
                  onChange={(e) => handleFilterChange('risk_level', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="">{t('filters.allLevels')}</option>
                  <option value="low">{t('opportunities.riskLow')}</option>
                  <option value="medium">{t('opportunities.riskMedium')}</option>
                  <option value="high">{t('opportunities.riskHigh')}</option>
                  <option value="very_high">{t('opportunities.riskVeryHigh')}</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white"
              >
                {t('common.resetFilters')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Liste des opportunités */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {opportunities.map((opp) => {
          const SectorIcon = getSectorIcon(opp.sector);

          return (
            <div
              key={opp.id}
              onClick={() => setSelectedOpp(opp)}
              className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden hover:border-orange-500 transition cursor-pointer group"
            >
              {/* Header avec secteur */}
              <div className="bg-gradient-to-r from-orange-600 to-orange-500 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {typeof SectorIcon === 'string' ? (
                    <span className="text-3xl">{SectorIcon}</span>
                  ) : (
                    <SectorIcon className="w-8 h-8 text-white" />
                  )}
                  <div>
                    <h3 className="font-bold text-white text-lg">{opp.sector}</h3>
                    <p className="text-orange-100 text-sm">{opp.country_name}</p>
                  </div>
                </div>
                {opp.is_verified === 1 && (
                  <div className="bg-white/20 px-2 py-1 rounded text-xs font-medium">
                    ✓ {t('opportunities.verified')}
                  </div>
                )}
              </div>

              {/* Contenu */}
              <div className="p-4 space-y-4">
                <div>
                  <h4 className="text-white font-semibold text-lg mb-2 group-hover:text-orange-400 transition">
                    {opp.title}
                  </h4>
                  <p className="text-gray-400 text-sm line-clamp-3">{opp.summary}</p>
                </div>

                {/* Métriques clés */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-700/50 rounded p-3">
                    <div className="text-gray-400 text-xs mb-1">{t('opportunities.investment')}</div>
                    <div className="text-white font-semibold text-sm">
                      {formatCurrency(opp.min_investment)} - {formatCurrency(opp.max_investment)}
                    </div>
                  </div>
                  <div className="bg-gray-700/50 rounded p-3">
                    <div className="text-gray-400 text-xs mb-1">{t('opportunities.expectedROI')}</div>
                    <div className="text-green-400 font-semibold text-sm flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      {opp.expected_return_min}% - {opp.expected_return_max}%
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(opp.risk_level)}`}>
                    {getRiskLabel(opp.risk_level)}
                  </span>
                  <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    {getHorizonLabel(opp.investment_horizon)}
                  </span>
                  {opp.opportunity_type === 'company' && (
                    <span className="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
                      {t('opportunities.company')}
                    </span>
                  )}
                </div>

                {/* Source link */}
                {opp.source_url && (
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-700">
                    <Link2 className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-500 text-xs">{t('opportunities.source')}:</span>
                    <a
                      href={opp.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-blue-400 hover:text-blue-300 text-xs font-medium flex items-center gap-1 truncate flex-1 hover:underline"
                    >
                      {opp.source_name || new URL(opp.source_url).hostname.replace('www.', '')}
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </a>
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {opp.views || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      {opp.saves || 0}
                    </span>
                  </div>
                  <button className="text-orange-400 hover:text-orange-300 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                    {t('opportunities.viewDetails')}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Message si aucun résultat */}
      {!loading && opportunities.length === 0 && (
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">
            {t('messages.noOpportunity')}
          </h3>
          <p className="text-gray-500">
            {t('opportunities.tryModifyFilters')}
          </p>
        </div>
      )}

      {/* Modal détail - à implémenter */}
      {selectedOpp && (
        <OpportunityDetailModal
          opportunity={selectedOpp}
          onClose={() => setSelectedOpp(null)}
        />
      )}
    </div>
  );
};

// Modal de détail d'opportunité
const OpportunityDetailModal = ({ opportunity, onClose }) => {
  const { t, i18n } = useTranslation();
  const [fullDetails, setFullDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFullDetails = async () => {
      try {
        const res = await fetch(`${API_URL}/opportunities/${opportunity.slug}?lang=${i18n.language}`);
        const data = await res.json();
        if (data.success) {
          setFullDetails(data.data);
        }
      } catch (error) {
        console.error('Erreur chargement détails:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFullDetails();
  }, [opportunity.slug, i18n.language]);

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    if (amount >= 1000000000) return `${(amount / 1000000000).toFixed(1)}Mds USD`;
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M USD`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K USD`;
    return `${amount} USD`;
  };

  const getRiskColor = (risk) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      very_high: 'bg-red-100 text-red-800'
    };
    return colors[risk] || 'bg-gray-100 text-gray-800';
  };

  const getRiskLabel = (risk) => {
    const labels = {
      low: t('opportunities.riskLow'),
      medium: t('opportunities.riskMedium'),
      high: t('opportunities.riskHigh'),
      very_high: t('opportunities.riskVeryHigh')
    };
    return labels[risk] || risk;
  };

  const getHorizonLabel = (horizon) => {
    // Map French values to keys
    const key = mapValue(horizon, horizonMap);
    const labels = {
      short: t('opportunities.horizonShort'),
      medium: t('opportunities.horizonMedium'),
      long: t('opportunities.horizonLong')
    };
    return labels[key] || horizon;
  };

  const getCompanySizeLabel = (size) => {
    // Map French values to keys
    const key = mapValue(size, companySizeMap);
    const labels = {
      startup: t('opportunities.startup'),
      sme: t('opportunities.sme'),
      large: t('opportunities.largeCompany')
    };
    return labels[key] || size;
  };

  const getStageLabel = (stage) => {
    // Map French values to keys
    const key = mapValue(stage, stageMap);
    const labels = {
      early: t('opportunities.early'),
      growth: t('opportunities.growth'),
      mature: t('opportunities.mature')
    };
    return labels[key] || stage;
  };

  const getRegionLabel = (region) => {
    // Map French values to keys
    const key = mapValue(region, regionMap);
    const labels = {
      north_africa: t('regions.northAfrica'),
      west_africa: t('regions.westAfrica'),
      central_africa: t('regions.centralAfrica'),
      east_africa: t('regions.eastAfrica'),
      southern_africa: t('regions.southernAfrica')
    };
    return labels[key] || region;
  };

  const getHighlightTypeLabel = (type) => {
    const labels = {
      strength: t('opportunities.strength'),
      risk: t('opportunities.risk'),
      milestone: t('opportunities.milestone'),
      market_insight: t('opportunities.marketInsight')
    };
    return labels[type] || type;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-orange-600 to-orange-500 p-6 flex justify-between items-start">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-white mb-2">{opportunity.title}</h2>
            <div className="flex flex-wrap items-center gap-4 text-orange-100">
              <span className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                {opportunity.country_name}
              </span>
              <span>•</span>
              <span>{opportunity.sector} {opportunity.subsector && `• ${opportunity.subsector}`}</span>
              {opportunity.is_verified === 1 && (
                <>
                  <span>•</span>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">✓ {t('opportunities.verified')}</span>
                </>
              )}
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200 text-4xl leading-none ml-4">×</button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : fullDetails ? (
          <div className="p-6 space-y-8">
            {/* Résumé */}
            <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/30 rounded-lg p-6">
              <p className="text-lg text-white leading-relaxed">{fullDetails.summary}</p>
            </div>

            {/* Métriques principales */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                <div className="text-gray-400 text-sm mb-1">{t('opportunities.investment')} min.</div>
                <div className="text-white font-bold text-lg">{formatCurrency(fullDetails.min_investment)}</div>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                <div className="text-gray-400 text-sm mb-1">{t('opportunities.investment')} max.</div>
                <div className="text-white font-bold text-lg">{formatCurrency(fullDetails.max_investment)}</div>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                <div className="text-gray-400 text-sm mb-1">{t('opportunities.expectedROI')}</div>
                <div className="text-green-400 font-bold text-lg flex items-center gap-1">
                  <TrendingUp className="w-5 h-5" />
                  {fullDetails.expected_return_min}% - {fullDetails.expected_return_max}%
                </div>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                <div className="text-gray-400 text-sm mb-1">Horizon</div>
                <div className="text-white font-bold text-lg capitalize">
                  {getHorizonLabel(fullDetails.investment_horizon)}
                </div>
              </div>
            </div>

            {/* Description détaillée */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-1 h-8 bg-orange-500 rounded"></span>
                {t('opportunities.detailedDescription')}
              </h3>
              <div className="bg-gray-700/30 rounded-lg p-6 border border-gray-700">
                <p className="text-gray-300 text-base leading-relaxed whitespace-pre-line">{fullDetails.description}</p>
              </div>
            </div>

            {/* Points clés / Highlights */}
            {fullDetails.highlights && fullDetails.highlights.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="w-1 h-8 bg-orange-500 rounded"></span>
                  {t('opportunities.keyPoints')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fullDetails.highlights.map((highlight, idx) => (
                    <div key={idx} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                      <div className="flex items-start gap-3">
                        {highlight.icon && <span className="text-2xl">{highlight.icon}</span>}
                        <div className="flex-1">
                          <div className="text-orange-400 font-semibold mb-1">{highlight.title}</div>
                          <div className="text-gray-300 text-sm">{highlight.description}</div>
                          <div className="mt-2">
                            <span className={`text-xs px-2 py-1 rounded ${
                              highlight.highlight_type === 'strength' ? 'bg-green-100 text-green-800' :
                              highlight.highlight_type === 'risk' ? 'bg-red-100 text-red-800' :
                              highlight.highlight_type === 'milestone' ? 'bg-blue-100 text-blue-800' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {getHighlightTypeLabel(highlight.highlight_type)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Informations supplémentaires */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-1 h-8 bg-orange-500 rounded"></span>
                {t('opportunities.additionalInfo')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                  <div className="text-gray-400 text-sm mb-1">{t('opportunities.opportunityType')}</div>
                  <div className="text-white font-medium">
                    {fullDetails.opportunity_type === 'company' ? t('opportunities.company') :
                     fullDetails.opportunity_type === 'project' ? t('opportunities.project') : t('opportunities.other')}
                  </div>
                </div>

                <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                  <div className="text-gray-400 text-sm mb-1">{t('opportunities.riskLevel')}</div>
                  <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${getRiskColor(fullDetails.risk_level)}`}>
                    {getRiskLabel(fullDetails.risk_level)}
                  </span>
                </div>

                {fullDetails.company_name && (
                  <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                    <div className="text-gray-400 text-sm mb-1">{t('opportunities.companyName')}</div>
                    <div className="text-white font-medium">{fullDetails.company_name}</div>
                  </div>
                )}

                {fullDetails.company_size && (
                  <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                    <div className="text-gray-400 text-sm mb-1">{t('opportunities.companySize')}</div>
                    <div className="text-white font-medium capitalize">
                      {getCompanySizeLabel(fullDetails.company_size)}
                    </div>
                  </div>
                )}

                {fullDetails.stage && (
                  <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                    <div className="text-gray-400 text-sm mb-1">{t('opportunities.developmentStage')}</div>
                    <div className="text-white font-medium capitalize">
                      {getStageLabel(fullDetails.stage)}
                    </div>
                  </div>
                )}

                {fullDetails.market_size_usd && (
                  <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                    <div className="text-gray-400 text-sm mb-1">{t('opportunities.marketSize')}</div>
                    <div className="text-white font-medium">{formatCurrency(fullDetails.market_size_usd)}</div>
                  </div>
                )}

                {fullDetails.region && (
                  <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                    <div className="text-gray-400 text-sm mb-1">{t('opportunities.region')}</div>
                    <div className="text-white font-medium">{getRegionLabel(fullDetails.region)}</div>
                  </div>
                )}

                {fullDetails.deadline && (
                  <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                    <div className="text-gray-400 text-sm mb-1">{t('opportunities.deadline')}</div>
                    <div className="text-white font-medium">{formatDate(fullDetails.deadline)}</div>
                  </div>
                )}

                <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                  <div className="text-gray-400 text-sm mb-1">{t('opportunities.viewsFavorites')}</div>
                  <div className="text-white font-medium flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {fullDetails.views || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      {fullDetails.saves || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            {fullDetails.tags && fullDetails.tags.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">{t('opportunities.tags')}</h3>
                <div className="flex flex-wrap gap-2">
                  {fullDetails.tags.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Source */}
            <div className="bg-gray-700/30 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-3">{t('opportunities.infoSource')}</h3>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-gray-400 text-sm mb-1">{t('opportunities.publishedBy')}</div>
                  <div className="text-white font-medium">{fullDetails.source_name}</div>
                </div>
                {fullDetails.source_url ? (
                  <a
                    href={fullDetails.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium flex items-center gap-2 transition"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {t('opportunities.viewSource')}
                  </a>
                ) : (
                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(fullDetails.source_name + ' ' + fullDetails.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium flex items-center gap-2 transition"
                  >
                    <Globe className="w-4 h-4" />
                    {t('opportunities.searchSource') || 'Rechercher la source'}
                  </a>
                )}
              </div>
              {fullDetails.published_at && (
                <div className="mt-3 text-gray-400 text-sm">
                  {t('opportunities.publishedOn')} {formatDate(fullDetails.published_at)}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-400">
            {t('opportunities.unableToLoad')}
          </div>
        )}
      </div>
    </div>
  );
};

export default OpportunitiesTab;

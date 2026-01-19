import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AlertCircle,
  Globe,
  Clock,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Filter,
  ArrowUpDown,
  Activity,
  Zap
} from 'lucide-react';
import MarketCard from './MarketCard';
import ExchangeDetail from './ExchangeDetail';
import { EXCHANGES_BY_MARKET_CAP, TRADING_HOURS_UTC } from '../data/africanExchanges';

const MarketsTab = ({ markets, lastUpdate, apiStatus, openAdmin }) => {
  const { t } = useTranslation();
  const [selectedExchange, setSelectedExchange] = useState(null);
  const [sortBy, setSortBy] = useState('default');
  const [hoveredStat, setHoveredStat] = useState(null);

  // Trier les marchés
  const sortedMarkets = [...markets].sort((a, b) => {
    if (sortBy === 'marketCap') {
      const indexA = EXCHANGES_BY_MARKET_CAP.indexOf(a.id);
      const indexB = EXCHANGES_BY_MARKET_CAP.indexOf(b.id);
      return indexA - indexB;
    }
    if (sortBy === 'change') {
      return (b.changePercent || 0) - (a.changePercent || 0);
    }
    return 0;
  });

  // Calculer les stats globales
  const stats = {
    total: markets.length,
    positive: markets.filter(m => m.positive).length,
    negative: markets.filter(m => !m.positive).length
  };

  // Trouver le marché sélectionné pour le modal
  const selectedMarketData = selectedExchange
    ? markets.find(m => m.id === selectedExchange)
    : null;

  return (
    <div className="space-y-8">
      {/* Warning banner when in demo mode - avec design glassmorphism */}
      {!apiStatus.connected && (
        <div className="relative overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20" />
          <div className="absolute inset-0 backdrop-blur-xl" />
          <div className="relative p-6 border border-amber-500/30">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-500/20 rounded-xl border border-amber-500/30">
                <AlertCircle className="w-6 h-6 text-amber-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-amber-200 mb-1">
                  {t('markets.demoMode')}
                </h3>
                <p className="text-sm text-amber-200/70 mb-4">
                  {t('markets.backendNotStarted')}
                </p>
                <button
                  onClick={openAdmin}
                  className="
                    group relative px-5 py-2.5
                    bg-gradient-to-r from-amber-500 to-orange-500
                    hover:from-amber-400 hover:to-orange-400
                    text-white font-semibold rounded-xl
                    transition-all duration-300
                    shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50
                    hover:-translate-y-0.5
                  "
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    {t('markets.configureBackend')}
                  </span>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header avec stats - Glassmorphism design */}
      <div className="relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a2744]/90 to-[#0f172a]/90" />
        <div className="absolute inset-0 backdrop-blur-xl" />

        {/* Background effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl" />

        <div className="relative p-6 border border-white/10">
          {/* Top section */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/30 rounded-xl blur-lg" />
                <div className="relative p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg shadow-blue-500/30">
                  <Globe className="w-7 h-7 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                  {t('markets.africanStockMarkets')}
                  <span className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-full border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    LIVE
                  </span>
                </h2>
                <p className="text-white/50 mt-1">
                  {t('markets.activeExchanges', { count: markets.length })}
                </p>
              </div>
            </div>

            {/* Stats cards */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Hausse */}
              <div
                className={`
                  relative overflow-hidden px-4 py-3 rounded-xl cursor-default
                  bg-emerald-500/10 border border-emerald-500/20
                  transition-all duration-300
                  ${hoveredStat === 'positive' ? 'scale-105 shadow-lg shadow-emerald-500/20' : ''}
                `}
                onMouseEnter={() => setHoveredStat('positive')}
                onMouseLeave={() => setHoveredStat(null)}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/20 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-emerald-400">{stats.positive}</p>
                    <p className="text-xs text-emerald-400/70">{t('markets.increase', { count: stats.positive })}</p>
                  </div>
                </div>
              </div>

              {/* Baisse */}
              <div
                className={`
                  relative overflow-hidden px-4 py-3 rounded-xl cursor-default
                  bg-red-500/10 border border-red-500/20
                  transition-all duration-300
                  ${hoveredStat === 'negative' ? 'scale-105 shadow-lg shadow-red-500/20' : ''}
                `}
                onMouseEnter={() => setHoveredStat('negative')}
                onMouseLeave={() => setHoveredStat(null)}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/20 rounded-lg">
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-400">{stats.negative}</p>
                    <p className="text-xs text-red-400/70">{t('markets.decrease', { count: stats.negative })}</p>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="hidden md:block w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent" />

              {/* Sort dropdown */}
              <div className="relative">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-white/5 rounded-xl border border-white/10">
                  <ArrowUpDown className="w-4 h-4 text-white/50" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent text-white/80 text-sm font-medium cursor-pointer focus:outline-none"
                  >
                    <option value="default" className="bg-[#1a2744]">{t('markets.defaultSort')}</option>
                    <option value="marketCap" className="bg-[#1a2744]">{t('markets.byCapitalization')}</option>
                    <option value="change" className="bg-[#1a2744]">{t('markets.byPerformance')}</option>
                  </select>
                </div>
              </div>

              {/* Timestamp */}
              {lastUpdate && (
                <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-xl border border-white/10">
                  <Clock className="w-4 h-4 text-white/40" />
                  <span className="text-xs text-white/50">
                    {lastUpdate.toLocaleString('fr-FR')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Trading hours bar */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-white/40" />
              <p className="text-sm text-white/40 font-medium">{t('markets.tradingHoursUTC')}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(TRADING_HOURS_UTC).map(([id, hours]) => {
                const market = markets.find(m => m.id === id);
                return (
                  <span
                    key={id}
                    className="
                      px-3 py-1.5
                      bg-white/5 hover:bg-white/10
                      rounded-lg text-xs
                      border border-white/5 hover:border-white/10
                      transition-all duration-300 cursor-default
                    "
                  >
                    <span className="font-semibold text-white/80">{market?.name?.split(' ')[0] || id.toUpperCase()}</span>
                    <span className="text-white/40 ml-1">{hours.open}-{hours.close}</span>
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Markets grid with stagger animation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedMarkets.map((market, index) => (
          <div
            key={market.id}
            onClick={() => setSelectedExchange(market.id)}
            className="cursor-pointer animate-fade-in-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <MarketCard market={market} />
          </div>
        ))}
      </div>

      {/* Légende étendue - Glassmorphism */}
      <div className="relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a2744]/80 to-[#0f172a]/80" />
        <div className="absolute inset-0 backdrop-blur-xl" />

        <div className="relative p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
            <p className="font-semibold text-white/80">
              {t('markets.legendActiveExchanges', { count: markets.length })}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {[
              { code: 'JSE', country: 'Afrique du Sud', flag: '🇿🇦' },
              { code: 'MASI', country: 'Maroc', flag: '🇲🇦' },
              { code: 'NGX', country: 'Nigeria', flag: '🇳🇬' },
              { code: 'EGX', country: 'Égypte', flag: '🇪🇬' },
              { code: 'NSE', country: 'Kenya', flag: '🇰🇪' },
              { code: 'BRVM', country: 'UEMOA (8 pays)', flag: '🌍' },
              { code: 'GSE', country: 'Ghana', flag: '🇬🇭' },
              { code: 'BSE', country: 'Botswana', flag: '🇧🇼' },
              { code: 'LuSE', country: 'Zambie', flag: '🇿🇲' },
              { code: 'ZSE', country: 'Zimbabwe', flag: '🇿🇼' },
              { code: 'SEM', country: 'Maurice', flag: '🇲🇺' },
              { code: 'DSE', country: 'Tanzanie', flag: '🇹🇿' },
              { code: 'USE', country: 'Ouganda', flag: '🇺🇬' },
              { code: 'RSE', country: 'Rwanda', flag: '🇷🇼' },
              { code: 'BVMT', country: 'Tunisie', flag: '🇹🇳' },
              { code: 'NSX', country: 'Namibie', flag: '🇳🇦' },
              { code: 'MSE', country: 'Malawi', flag: '🇲🇼' },
            ].map((exchange, index) => (
              <div
                key={exchange.code}
                className="
                  flex items-center gap-2 px-3 py-2
                  bg-white/5 hover:bg-white/10
                  rounded-xl border border-white/5 hover:border-white/10
                  transition-all duration-300 cursor-default
                  group
                "
              >
                <span className="text-lg group-hover:scale-110 transition-transform">{exchange.flag}</span>
                <div>
                  <span className="font-bold text-white/90 text-sm">{exchange.code}</span>
                  <p className="text-xs text-white/40">{exchange.country}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal de détail */}
      {selectedExchange && (
        <ExchangeDetail
          exchangeId={selectedExchange}
          marketData={selectedMarketData}
          onClose={() => setSelectedExchange(null)}
        />
      )}
    </div>
  );
};

export default MarketsTab;

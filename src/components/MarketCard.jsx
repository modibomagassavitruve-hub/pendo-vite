import React, { useState, memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  TrendingUp,
  TrendingDown,
  Info,
  Clock,
  Building2,
  Globe,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Zap,
  BarChart3,
  Activity
} from 'lucide-react';
import { getExchange, isMarketOpen } from '../data/africanExchanges';

const MarketCard = ({ market, onShowDetails }) => {
  const { t } = useTranslation();
  const { id, name, country, value, change, positive, volume, source } = market;
  const [expanded, setExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Récupérer les infos enrichies de la bourse
  const exchangeInfo = getExchange(id);
  const marketOpen = exchangeInfo ? isMarketOpen(id) : null;

  // Extraire le pourcentage de changement pour l'animation
  const changePercent = change ? parseFloat(change.replace(/[^0-9.-]/g, '')) : 0;

  return (
    <div
      className={`
        group relative overflow-hidden rounded-2xl
        bg-gradient-to-br from-[#1a2744]/90 to-[#0f172a]/90
        border border-white/10
        backdrop-blur-xl
        transition-all duration-500 ease-out
        hover:border-white/20
        hover:shadow-2xl hover:shadow-blue-500/10
        ${isHovered ? 'scale-[1.02]' : 'scale-100'}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient glow effect on hover */}
      <div className={`
        absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500
        bg-gradient-to-r ${positive ? 'from-emerald-500/20 via-transparent to-emerald-500/10' : 'from-red-500/20 via-transparent to-red-500/10'}
      `} />

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }} />
      </div>

      {/* Top accent bar */}
      <div className={`
        h-1 w-full bg-gradient-to-r transition-all duration-300
        ${exchangeInfo?.gradient || (positive ? 'from-emerald-500 to-emerald-400' : 'from-red-500 to-red-400')}
        ${isHovered ? 'h-1.5' : 'h-1'}
      `} />

      <div className="relative p-5">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-start gap-3">
            {/* Flag with glow */}
            {exchangeInfo && (
              <div className="relative">
                <div className={`absolute inset-0 blur-lg opacity-50 transition-opacity duration-300 ${isHovered ? 'opacity-70' : 'opacity-30'}`}>
                  <span className="text-3xl">{exchangeInfo.flag}</span>
                </div>
                <span className="relative text-3xl drop-shadow-lg" title={exchangeInfo.country}>
                  {exchangeInfo.flag}
                </span>
              </div>
            )}
            <div>
              <h3 className="font-bold text-lg text-white group-hover:text-white/90 transition-colors">
                {name}
              </h3>
              <p className="text-sm text-white/50">{country}</p>
            </div>
          </div>

          {/* Status indicators */}
          <div className="flex items-center gap-2">
            {marketOpen !== null && (
              <span className={`
                flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
                transition-all duration-300
                ${marketOpen
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-white/5 text-white/40 border border-white/10'
                }
              `}>
                <span className={`w-1.5 h-1.5 rounded-full ${marketOpen ? 'bg-emerald-400 animate-pulse' : 'bg-white/30'}`} />
                {marketOpen ? t('card.open') : t('card.closed')}
              </span>
            )}
          </div>
        </div>

        {/* Value section */}
        <div className="mt-4 space-y-3">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-white tracking-tight">
                {value}
              </p>

              {/* Change indicator */}
              <div className="flex items-center gap-3 mt-2">
                <span className={`
                  inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold
                  transition-all duration-300
                  ${positive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                    : 'bg-red-500/15 text-red-400 border border-red-500/20'
                  }
                `}>
                  {positive ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {change}
                </span>

                {volume && volume !== 'N/A' && (
                  <span className="flex items-center gap-1.5 text-xs text-white/40">
                    <Activity className="w-3 h-3" />
                    Vol: {volume}
                  </span>
                )}
              </div>
            </div>

            {/* Trend icon */}
            <div className={`
              p-3 rounded-xl transition-all duration-300
              ${positive
                ? 'bg-emerald-500/10 text-emerald-400'
                : 'bg-red-500/10 text-red-400'
              }
              ${isHovered ? 'scale-110' : 'scale-100'}
            `}>
              {positive ? (
                <TrendingUp className="w-6 h-6" />
              ) : (
                <TrendingDown className="w-6 h-6" />
              )}
            </div>
          </div>

          {/* Mini progress bar for change visualization */}
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${positive ? 'bg-emerald-500' : 'bg-red-500'}`}
              style={{ width: `${Math.min(Math.abs(changePercent) * 10, 100)}%` }}
            />
          </div>
        </div>

        {/* Expandable details */}
        {exchangeInfo && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
              className={`
                mt-4 w-full flex items-center justify-center gap-2 py-2.5 px-4
                rounded-xl text-sm font-medium
                bg-white/5 hover:bg-white/10 text-white/60 hover:text-white
                border border-white/5 hover:border-white/10
                transition-all duration-300
              `}
            >
              <Info className="w-4 h-4" />
              {expanded ? t('card.lessDetails') : t('card.moreDetails')}
              <div className={`transform transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}>
                <ChevronDown className="w-4 h-4" />
              </div>
            </button>

            {/* Expanded content with animation */}
            <div className={`
              overflow-hidden transition-all duration-500 ease-out
              ${expanded ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0'}
            `}>
              <div className="space-y-3 pt-4 border-t border-white/10">
                {/* Trading hours */}
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Clock className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-wider">Horaires</p>
                    <p className="text-sm text-white/80">
                      {exchangeInfo.tradingHours.open} - {exchangeInfo.tradingHours.close}
                      <span className="text-white/40 ml-1">({exchangeInfo.tradingHours.timezone})</span>
                    </p>
                  </div>
                </div>

                {/* Market cap */}
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                  <div className="p-2 bg-emerald-500/20 rounded-lg">
                    <Building2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-wider">Capitalisation</p>
                    <p className="text-sm text-white/80">
                      {exchangeInfo?.marketCap?.usdDisplay || "N/A"}
                      <span className="text-white/40 ml-2">|</span>
                      <span className="text-emerald-400 ml-2">{exchangeInfo.listedCompanies}</span>
                      <span className="text-white/40 ml-1">{t('card.companies')}</span>
                    </p>
                  </div>
                </div>

                {/* Mechanism */}
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Zap className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-wider">Trading</p>
                    <p className="text-sm text-white/80">
                      {exchangeInfo.mechanism}
                      <span className="text-white/40 mx-2">|</span>
                      {exchangeInfo.settlement}
                      <span className="text-white/40 mx-2">|</span>
                      <span className="text-amber-400">{exchangeInfo.currency.code}</span>
                    </p>
                  </div>
                </div>

                {/* Primary index */}
                <div className="p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-blue-400" />
                    <span className="text-xs text-white/40 uppercase tracking-wider">Indice Principal</span>
                  </div>
                  <p className="text-white font-medium">
                    {exchangeInfo.primaryIndex.name}
                    <span className="text-white/40 ml-2">({exchangeInfo.primaryIndex.code})</span>
                  </p>
                </div>

                {/* Top sectors */}
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Secteurs Clés</p>
                  <div className="flex flex-wrap gap-2">
                    {exchangeInfo.topSectors.slice(0, 4).map((sector, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 bg-white/5 text-white/70 rounded-lg text-xs font-medium border border-white/5 hover:bg-white/10 hover:text-white transition-colors"
                      >
                        {sector}
                      </span>
                    ))}
                  </div>
                </div>

                {/* BRVM member countries */}
                {exchangeInfo.memberCountries && (
                  <div className="p-3 bg-white/5 rounded-xl">
                    <p className="text-xs text-white/40 uppercase tracking-wider mb-2">
                      {t('card.memberCountries')}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {exchangeInfo.memberCountries.map((c, i) => (
                        <span
                          key={i}
                          title={c.name}
                          className="text-xl hover:scale-125 transition-transform cursor-default"
                        >
                          {c.flag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Website link */}
                <a
                  href={exchangeInfo.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    flex items-center justify-center gap-2 p-3
                    bg-blue-500/10 hover:bg-blue-500/20
                    text-blue-400 hover:text-blue-300
                    rounded-xl transition-all duration-300
                    border border-blue-500/20 hover:border-blue-500/30
                  "
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {exchangeInfo.website.replace('https://', '').replace('www.', '').split('/')[0]}
                  </span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </>
        )}

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
          <span className="text-xs text-white/30 flex items-center gap-1.5">
            <Activity className="w-3 h-3" />
            {source}
          </span>
          {exchangeInfo && (
            <span className="text-xs text-white/30 flex items-center gap-1">
              <span className="text-amber-400">#{exchangeInfo.rankAfrica}</span>
              {t('card.africa')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// Comparaison personnalisée pour éviter les re-renders inutiles
const areEqual = (prevProps, nextProps) => {
  return (
    prevProps.market.id === nextProps.market.id &&
    prevProps.market.value === nextProps.market.value &&
    prevProps.market.change === nextProps.market.change &&
    prevProps.market.positive === nextProps.market.positive
  );
};

export default memo(MarketCard, areEqual);

import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, Globe, Clock, Building2, ExternalLink, DollarSign, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import { getExchange } from '../data/africanExchanges';
import StockChart from './StockChart';

const ExchangeDetail = ({ exchangeId, onClose, marketData }) => {
  const { t } = useTranslation();
  const exchange = getExchange(exchangeId);

  if (!exchange) return null;

  const positive = marketData?.positive ?? true;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto border border-gray-700 my-4">
        {/* Header */}
        <div className={`bg-gradient-to-r ${exchange.gradient || 'from-gray-600 to-gray-800'} p-6 text-white relative rounded-t-2xl`}>
          <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition">
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-4">
            <span className="text-5xl">{exchange.flag}</span>
            <div>
              <h2 className="text-2xl font-bold">{exchange.fullName}</h2>
              <p className="text-white/80">{exchange.city}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-1 bg-white/20 rounded text-sm">
                  #{exchange.rankAfrica} {t('exchange.africa')}
                </span>
                <span className="px-2 py-1 bg-white/20 rounded text-sm">
                  {exchange.code}
                </span>
              </div>
            </div>
          </div>

          {/* Prix actuel */}
          {marketData && (
            <div className="mt-4 p-4 bg-white/10 rounded-lg backdrop-blur">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-white/70 text-sm">{t('exchange.currentValue')}</p>
                  <p className="text-4xl font-bold">{marketData.value}</p>
                </div>
                <div className={`text-right flex items-center gap-2 ${positive ? 'text-green-300' : 'text-red-300'}`}>
                  {positive ? <TrendingUp className="w-8 h-8" /> : <TrendingDown className="w-8 h-8" />}
                  <div>
                    <p className="text-3xl font-bold">{marketData.change}</p>
                    <p className="text-sm opacity-80">{t('exchange.today')}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 text-white space-y-6">
          {/* Graphique */}
          <StockChart 
            marketId={exchangeId}
            currentValue={marketData?.value}
            change={marketData?.change}
            positive={positive}
          />

          {/* Infos principales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <DollarSign className="w-5 h-5" />
                <span className="text-sm">{t('exchange.capitalization')}</span>
              </div>
              <p className="text-2xl font-bold">{exchange.marketCap?.usdDisplay || 'N/A'}</p>
              <p className="text-sm text-gray-500">{exchange.marketCap?.display || ''}</p>
            </div>

            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Building2 className="w-5 h-5" />
                <span className="text-sm">{t('exchange.listedCompanies')}</span>
              </div>
              <p className="text-2xl font-bold">{exchange.listedCompanies || 'N/A'}</p>
              <p className="text-sm text-gray-500">{t('exchange.companiesListed')}</p>
            </div>

            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Clock className="w-5 h-5" />
                <span className="text-sm">{t('exchange.tradingHours')}</span>
              </div>
              <p className="text-2xl font-bold">{exchange.tradingHours?.open} - {exchange.tradingHours?.close}</p>
              <p className="text-sm text-gray-500">{exchange.tradingHours?.timezone}</p>
            </div>
          </div>

          {/* Indices */}
          {exchange.indices && exchange.indices.length > 0 && (
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center gap-2 text-gray-400 mb-3">
                <BarChart3 className="w-5 h-5" />
                <span className="font-medium">{t('exchange.mainIndices')}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {exchange.indices.map((index, i) => (
                  <span
                    key={i}
                    className={`px-3 py-2 rounded-lg text-sm ${
                      index.primary 
                        ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' 
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    {index.name} ({index.code})
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Secteurs et entreprises */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exchange.topSectors && (
              <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                <h3 className="text-gray-400 font-medium mb-3">🏭 {t('exchange.topSectors')}</h3>
                <div className="flex flex-wrap gap-2">
                  {exchange.topSectors.map((sector, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                      {sector}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {exchange.topCompanies && (
              <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                <h3 className="text-gray-400 font-medium mb-3">🏢 {t('exchange.largeCapitalizations')}</h3>
                <div className="flex flex-wrap gap-2">
                  {exchange.topCompanies.map((company, i) => (
                    <span key={i} className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                      {company}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bouton site officiel */}
          {exchange.website && (
            <a
              href={exchange.website}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r ${exchange.gradient} rounded-xl hover:opacity-90 transition font-semibold`}
            >
              <Globe className="w-5 h-5" />
              {t('exchange.visitOfficialSite')}
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExchangeDetail;

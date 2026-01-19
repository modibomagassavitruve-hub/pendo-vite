import { useTranslation } from 'react-i18next';
import { API_URL } from '../config';
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Loader2, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';

const StockChart = ({ marketId, currentValue, change, positive }) => {
  const { t } = useTranslation();
  const [period, setPeriod] = useState('1mo');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'API_URL';

  // Charger les données historiques
  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`${API_URL}/markets/${marketId}/history?period=${period}`);
        const result = await response.json();
        
        if (result.success && result.data && result.data.length > 0) {
          // Formater les données pour le graphique
          const formattedData = result.data.map(item => ({
            timestamp: item.timestamp,
            date: new Date(item.timestamp),
            value: item.close,
            open: item.open,
            high: item.high,
            low: item.low,
            volume: item.volume,
            displayValue: item.close?.toLocaleString('fr-FR', { maximumFractionDigits: 2 }),
            displayDate: formatDate(new Date(item.timestamp), period)
          }));
          
          setData(formattedData);
          
          // Calculer les stats
          const values = formattedData.map(d => d.value).filter(v => v);
          setStats({
            min: Math.min(...values),
            max: Math.max(...values),
            open: formattedData[0]?.value,
            close: formattedData[formattedData.length - 1]?.value,
            change: ((formattedData[formattedData.length - 1]?.value - formattedData[0]?.value) / formattedData[0]?.value * 100).toFixed(2)
          });
        } else {
          setError(result.error || 'Données non disponibles');
          setData([]);
        }
      } catch (err) {
        console.error('Erreur chargement historique:', err);
        setError('Impossible de charger les données');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    if (marketId) {
      fetchHistory();
    }
  }, [marketId, period, API_URL]);

  // Formater la date selon la période
  const formatDate = (date, period) => {
    if (!date) return '';
    
    switch (period) {
      case '1d':
        return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      case '5d':
        return date.toLocaleDateString('fr-FR', { weekday: 'short', hour: '2-digit', minute: '2-digit' });
      case '1mo':
      case '3mo':
        return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
      case '6mo':
      case '1y':
        return date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
      case '5y':
        return date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
      default:
        return date.toLocaleDateString('fr-FR');
    }
  };

  const color = positive ? '#10B981' : '#EF4444';
  const gradientId = `gradient-${marketId}`;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-xl">
          <p className="text-gray-400 text-xs mb-1">{item.displayDate}</p>
          <p className="text-white font-bold text-lg">{item.displayValue}</p>
          {item.high && item.low && (
            <div className="text-xs mt-1 space-y-0.5">
              <p className="text-green-400">H: {item.high?.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}</p>
              <p className="text-red-400">B: {item.low?.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}</p>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const periods = [
    { value: '1d', label: '1J' },
    { value: '5d', label: '5J' },
    { value: '1mo', label: '1M' },
    { value: '3mo', label: '3M' },
    { value: '6mo', label: '6M' },
    { value: '1y', label: '1A' },
    { value: '5y', label: '5A' }
  ];

  return (
    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
      {/* Header avec sélecteur de période */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-white font-semibold">{t('chart.priceEvolution')}</h3>
          {data.length > 0 && (
            <span className="text-xs text-gray-500">
              ({t('chart.points', { count: data.length })})
            </span>
          )}
        </div>
        <div className="flex gap-1">
          {periods.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-2 py-1 rounded text-xs font-medium transition ${
                period === p.value
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Graphique */}
      <div className="h-64">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            <span className="ml-2 text-gray-400">{t('chart.loadingData')}</span>
          </div>
        ) : error ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <AlertCircle className="w-10 h-10 mb-2 text-yellow-500" />
            <p className="text-sm">{error}</p>
            <p className="text-xs mt-1">{t('chart.yahooFinanceUnavailable')}</p>
          </div>
        ) : data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            <p>{t('chart.noDataAvailable')}</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
              <XAxis 
                dataKey="displayDate" 
                stroke="#6B7280" 
                tick={{ fill: '#9CA3AF', fontSize: 10 }}
                axisLine={{ stroke: '#374151' }}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis 
                stroke="#6B7280"
                tick={{ fill: '#9CA3AF', fontSize: 10 }}
                axisLine={{ stroke: '#374151' }}
                tickLine={false}
                tickFormatter={(value) => value?.toLocaleString('fr-FR', { notation: 'compact', maximumFractionDigits: 0 })}
                domain={['auto', 'auto']}
                width={60}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                fill={`url(#${gradientId})`}
                dot={false}
                activeDot={{ r: 4, fill: color }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Stats rapides */}
      {stats && !loading && !error && (
        <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-700">
          <div className="text-center">
            <p className="text-gray-400 text-xs">{t('chart.opening')}</p>
            <p className="text-white font-medium text-sm">
              {stats.open?.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-xs">{t('chart.highest')}</p>
            <p className="text-green-400 font-medium text-sm">
              {stats.max?.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-xs">{t('chart.lowest')}</p>
            <p className="text-red-400 font-medium text-sm">
              {stats.min?.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-xs">{t('exchange.variation')}</p>
            <p className={`font-medium text-sm flex items-center justify-center gap-1 ${
              parseFloat(stats.change) >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {parseFloat(stats.change) >= 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {stats.change}%
            </p>
          </div>
        </div>
      )}

      {/* Source */}
      <div className="mt-3 text-center">
        <p className="text-xs text-gray-500">
          📊 {t('chart.historicalDataYahooFinance')}
        </p>
      </div>
    </div>
  );
};

export default StockChart;

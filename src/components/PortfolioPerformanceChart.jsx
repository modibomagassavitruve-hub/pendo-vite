import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Activity, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PortfolioPerformanceChart = () => {
  const { token } = useAuth();
  const [period, setPeriod] = useState('30');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchPerformanceData();
  }, [period, token]);

  const fetchPerformanceData = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/portfolio/performance?days=${period}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();

      if (result.success && result.data) {
        const formattedData = result.data.map(item => ({
          date: item.date,
          displayDate: formatDate(item.date),
          totalValue: item.total_value,
          cashBalance: item.cash_balance,
          gain: item.total_gain_loss,
          gainPercent: item.total_gain_loss_percent
        }));

        setData(formattedData);

        // Calculer les statistiques
        if (formattedData.length > 0) {
          const firstValue = formattedData[0].totalValue;
          const lastValue = formattedData[formattedData.length - 1].totalValue;
          const maxValue = Math.max(...formattedData.map(d => d.totalValue));
          const minValue = Math.min(...formattedData.map(d => d.totalValue));
          const totalGain = lastValue - firstValue;
          const totalGainPercent = ((totalGain / firstValue) * 100).toFixed(2);

          setStats({
            firstValue,
            lastValue,
            maxValue,
            minValue,
            totalGain,
            totalGainPercent,
            isPositive: totalGain >= 0
          });
        }
      }
    } catch (error) {
      console.error('Erreur chargement performance:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      maximumFractionDigits: 0
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-xl">
          <p className="text-gray-400 text-xs mb-2">{data.displayDate}</p>
          <div className="space-y-1">
            <div className="flex justify-between gap-4">
              <span className="text-gray-400 text-sm">Valeur totale:</span>
              <span className="text-white font-semibold">{formatCurrency(data.totalValue)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-400 text-sm">Liquidités:</span>
              <span className="text-blue-400">{formatCurrency(data.cashBalance)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-400 text-sm">Gain/Perte:</span>
              <span className={data.gain >= 0 ? 'text-green-400' : 'text-red-400'}>
                {data.gain >= 0 ? '+' : ''}{formatCurrency(data.gain)} ({data.gainPercent}%)
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const periods = [
    { value: '7', label: '7J' },
    { value: '30', label: '1M' },
    { value: '90', label: '3M' },
    { value: '180', label: '6M' },
    { value: '365', label: '1A' }
  ];

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <span className="ml-2 text-gray-400">Chargement des données...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Activity className="w-6 h-6 text-orange-500" />
          <h3 className="text-lg sm:text-xl font-bold text-white">Performance du Portefeuille</h3>
        </div>

        {/* Sélecteur de période */}
        <div className="flex gap-2">
          {periods.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition ${
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

      {/* Statistiques rapides */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-gray-700/50 rounded-lg p-3">
            <p className="text-gray-400 text-xs mb-1">Valeur actuelle</p>
            <p className="text-white font-bold text-sm sm:text-base">
              {formatCurrency(stats.lastValue)}
            </p>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-3">
            <p className="text-gray-400 text-xs mb-1">Variation période</p>
            <p className={`font-bold text-sm sm:text-base flex items-center gap-1 ${
              stats.isPositive ? 'text-green-400' : 'text-red-400'
            }`}>
              {stats.isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {stats.totalGainPercent}%
            </p>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-3">
            <p className="text-gray-400 text-xs mb-1">Plus haut</p>
            <p className="text-green-400 font-bold text-sm sm:text-base">
              {formatCurrency(stats.maxValue)}
            </p>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-3">
            <p className="text-gray-400 text-xs mb-1">Plus bas</p>
            <p className="text-red-400 font-bold text-sm sm:text-base">
              {formatCurrency(stats.minValue)}
            </p>
          </div>
        </div>
      )}

      {/* Graphique */}
      <div className="h-64 sm:h-80">
        {data.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <Calendar className="w-12 h-12 mb-2 text-gray-600" />
            <p className="text-sm">Aucune donnée d'historique disponible</p>
            <p className="text-xs mt-1">Effectuez des transactions pour voir votre performance</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorCash" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
              <XAxis
                dataKey="displayDate"
                stroke="#6B7280"
                tick={{ fill: '#9CA3AF', fontSize: 11 }}
                axisLine={{ stroke: '#374151' }}
                tickLine={false}
              />
              <YAxis
                stroke="#6B7280"
                tick={{ fill: '#9CA3AF', fontSize: 11 }}
                axisLine={{ stroke: '#374151' }}
                tickLine={false}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                width={50}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="line"
              />
              <Area
                type="monotone"
                dataKey="totalValue"
                name={t('performance.totalValue')}
                stroke="#f97316"
                strokeWidth={2}
                fill="url(#colorValue)"
                dot={false}
                activeDot={{ r: 5, fill: '#f97316' }}
              />
              <Area
                type="monotone"
                dataKey="cashBalance"
                name={t('performance.cash')}
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#colorCash)"
                dot={false}
                activeDot={{ r: 5, fill: '#3b82f6' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default PortfolioPerformanceChart;

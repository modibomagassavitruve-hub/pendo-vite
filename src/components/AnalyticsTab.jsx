import { useTranslation } from 'react-i18next';
import { API_URL } from '../config';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  TrendingUp, TrendingDown, Activity, PieChart as PieChartIcon,
  BarChart3, Download, Calendar, Filter, FileSpreadsheet
} from 'lucide-react';
import { exportAnalyticsPDF } from '../utils/exportUtils';

const AnalyticsTab = () => {
  const { token, isAuthenticated } = useAuth();
  const [performanceData, setPerformanceData] = useState([]);
  const [portfolioSummary, setPortfolioSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(30); // jours

  useEffect(() => {
    if (isAuthenticated) {
      loadAnalytics();
    }
  }, [isAuthenticated, timeRange]);

  const loadAnalytics = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${token}` };

      const [summaryRes, performanceRes] = await Promise.all([
        fetch(`${API_URL}/portfolio/summary`, { headers }),
        fetch(`${API_URL}/portfolio/performance?days=${timeRange}`, { headers })
      ]);

      const [summaryData, performanceData] = await Promise.all([
        summaryRes.json(),
        performanceRes.json()
      ]);

      if (summaryData.success) setPortfolioSummary(summaryData.data);
      if (performanceData.success) setPerformanceData(performanceData.data);
    } catch (error) {
      console.error('Erreur chargement analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    if (!value) return '0 XOF';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(value);
  };

  const formatPercent = (value) => {
    if (!value) return '0%';
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  // Calculer les statistiques
  const calculateStats = () => {
    if (!portfolioSummary) return null;

    const { summary, holdings } = portfolioSummary;

    // Répartition par secteur
    const sectorAllocation = {};
    holdings.forEach(h => {
      const sector = h.sector || 'Autres';
      if (!sectorAllocation[sector]) {
        sectorAllocation[sector] = { value: 0, count: 0 };
      }
      sectorAllocation[sector].value += h.current_value || 0;
      sectorAllocation[sector].count += 1;
    });

    // Top performers
    const topPerformers = [...holdings]
      .sort((a, b) => (b.gain_loss_percent || 0) - (a.gain_loss_percent || 0))
      .slice(0, 5);

    // Worst performers
    const worstPerformers = [...holdings]
      .sort((a, b) => (a.gain_loss_percent || 0) - (b.gain_loss_percent || 0))
      .slice(0, 5);

    return {
      sectorAllocation,
      topPerformers,
      worstPerformers,
      totalPositions: holdings.length,
      averageReturn: summary.totalGainLossPercent
    };
  };

  const stats = calculateStats();

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Activity className="w-16 h-16 text-gray-600 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Connexion requise</h2>
        <p className="text-gray-400">Connectez-vous pour voir vos analyses</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Analyses & Rapports</h2>
          <p className="text-gray-400">Vue détaillée de vos performances</p>
        </div>
        <div className="flex gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(parseInt(e.target.value))}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
          >
            <option value={7}>7 jours</option>
            <option value={30}>30 jours</option>
            <option value={90}>90 jours</option>
            <option value={365}>1 an</option>
          </select>
          <button
            onClick={() => portfolioSummary && exportAnalyticsPDF(portfolioSummary, performanceData, timeRange)}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold flex items-center gap-2 transition disabled:opacity-50"
            disabled={!portfolioSummary}
          >
            <Download className="w-5 h-5" />
            Exporter PDF
          </button>
        </div>
      </div>

      {/* Statistiques clés */}
      {stats && (
        <>
          {/* Performance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Rendement moyen</span>
                <TrendingUp className={`w-5 h-5 ${stats.averageReturn >= 0 ? 'text-green-400' : 'text-red-400'}`} />
              </div>
              <div className={`text-3xl font-bold ${stats.averageReturn >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatPercent(stats.averageReturn)}
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Positions actives</span>
                <PieChartIcon className="w-5 h-5 text-gray-400" />
              </div>
              <div className="text-3xl font-bold text-white">
                {stats.totalPositions}
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Secteurs</span>
                <BarChart3 className="w-5 h-5 text-gray-400" />
              </div>
              <div className="text-3xl font-bold text-white">
                {Object.keys(stats.sectorAllocation).length}
              </div>
            </div>
          </div>

          {/* Répartition par secteur */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <PieChartIcon className="w-6 h-6 text-orange-500" />
              Répartition par secteur
            </h3>
            <div className="space-y-3">
              {Object.entries(stats.sectorAllocation).map(([sector, data]) => {
                const percentage = (data.value / portfolioSummary.summary.totalValue * 100);
                return (
                  <div key={sector}>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-300">{sector}</span>
                      <span className="text-white font-semibold">
                        {formatCurrency(data.value)} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-orange-600 to-orange-400 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top & Worst Performers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Top Performers */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-green-400" />
                Meilleures performances
              </h3>
              <div className="space-y-3">
                {stats.topPerformers.map((holding, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <div>
                      <div className="font-semibold text-white">{holding.market_id}</div>
                      <div className="text-sm text-gray-400">{holding.stock_name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-bold">
                        {formatPercent(holding.gain_loss_percent)}
                      </div>
                      <div className="text-sm text-green-400">
                        {formatCurrency(holding.gain_loss)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Worst Performers */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <TrendingDown className="w-6 h-6 text-red-400" />
                Moins bonnes performances
              </h3>
              <div className="space-y-3">
                {stats.worstPerformers.map((holding, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <div>
                      <div className="font-semibold text-white">{holding.market_id}</div>
                      <div className="text-sm text-gray-400">{holding.stock_name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-red-400 font-bold">
                        {formatPercent(holding.gain_loss_percent)}
                      </div>
                      <div className="text-sm text-red-400">
                        {formatCurrency(holding.gain_loss)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Historique de performance (graphique simplifié) */}
          {performanceData.length > 0 && (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Activity className="w-6 h-6 text-orange-500" />
                Évolution de la valeur
              </h3>
              <div className="h-64 flex items-end gap-2">
                {performanceData.map((point, idx) => {
                  const maxValue = Math.max(...performanceData.map(p => p.total_value));
                  const height = (point.total_value / maxValue) * 100;
                  const isPositive = point.total_gain_loss >= 0;

                  return (
                    <div
                      key={idx}
                      className="flex-1 flex flex-col justify-end group relative"
                    >
                      <div
                        className={`w-full transition-all ${
                          isPositive ? 'bg-green-500 hover:bg-green-400' : 'bg-red-500 hover:bg-red-400'
                        } rounded-t`}
                        style={{ height: `${height}%` }}
                      >
                        <div className="invisible group-hover:visible absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                          <div>{new Date(point.date).toLocaleDateString('fr-FR')}</div>
                          <div className="font-bold">{formatCurrency(point.total_value)}</div>
                          <div className={isPositive ? 'text-green-400' : 'text-red-400'}>
                            {formatPercent(point.total_gain_loss_percent)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 flex justify-between text-sm text-gray-400">
                <span>{performanceData[0] && new Date(performanceData[0].date).toLocaleDateString('fr-FR')}</span>
                <span>{performanceData[performanceData.length - 1] && new Date(performanceData[performanceData.length - 1].date).toLocaleDateString('fr-FR')}</span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AnalyticsTab;

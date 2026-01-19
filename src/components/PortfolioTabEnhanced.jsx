import { useTranslation } from 'react-i18next';
import { API_URL } from '../config';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  TrendingUp, TrendingDown, DollarSign, PieChart, Plus,
  ArrowUpRight, ArrowDownRight, AlertCircle, Star, Eye, Clock,
  Download, FileSpreadsheet
} from 'lucide-react';
import { exportPortfolioPDF, exportPortfolioExcel, exportTransactionsExcel } from '../utils/exportUtils';
import TransactionModal from './TransactionModal';
import PortfolioPerformanceChart from './PortfolioPerformanceChart';
import StopLossManager from './StopLossManager';
import TechnicalIndicators from './TechnicalIndicators';
import PositionSizingCalculator from './PositionSizingCalculator';

const PortfolioTabEnhanced = () => {
  const { token, isAuthenticated } = useAuth();
  const [portfolioData, setPortfolioData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadPortfolioData();
    }
  }, [isAuthenticated]);

  const loadPortfolioData = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${token}` };

      const [summaryRes, transactionsRes, watchlistRes] = await Promise.all([
        fetch(`${API_URL}/portfolio/summary`, { headers }),
        fetch(`${API_URL}/portfolio/transactions?limit=10`, { headers }),
        fetch(`${API_URL}/portfolio/watchlist`, { headers })
      ]);

      const [summaryData, transactionsData, watchlistData] = await Promise.all([
        summaryRes.json(),
        transactionsRes.json(),
        watchlistRes.json()
      ]);

      if (summaryData.success) setPortfolioData(summaryData.data);
      if (transactionsData.success) setTransactions(transactionsData.data);
      if (watchlistData.success) setWatchlist(watchlistData.data);
    } catch (error) {
      console.error('Erreur chargement portfolio:', error);
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

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="w-16 h-16 text-gray-600 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Connexion requise</h2>
        <p className="text-gray-400">Connectez-vous pour accéder à votre portefeuille</p>
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

  const summary = portfolioData?.summary || {};
  const holdings = portfolioData?.holdings || [];
  const portfolio = portfolioData?.portfolio || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Mon Portefeuille</h2>
          <p className="text-gray-400">Suivez vos investissements en temps réel</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => exportPortfolioPDF(holdings, summary)}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold flex items-center gap-2 transition"
            disabled={holdings.length === 0}
          >
            <Download className="w-5 h-5" />
            PDF
          </button>
          <button
            onClick={() => exportPortfolioExcel(holdings, summary)}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold flex items-center gap-2 transition"
            disabled={holdings.length === 0}
          >
            <FileSpreadsheet className="w-5 h-5" />
            Excel
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white rounded-lg font-semibold flex items-center gap-2 transition"
          >
            <Plus className="w-5 h-5" />
            Nouvelle transaction
          </button>
        </div>
      </div>

      {/* Résumé - Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Valeur totale */}
        <div className="bg-gradient-to-br from-orange-600 to-orange-500 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-orange-100">Valeur totale</span>
            <DollarSign className="w-5 h-5 text-orange-100" />
          </div>
          <div className="text-3xl font-bold mb-1">{formatCurrency(summary.portfolioValue)}</div>
          <div className="text-sm text-orange-100">
            Solde: {formatCurrency(summary.cashBalance)}
          </div>
        </div>

        {/* Gain/Perte */}
        <div className={`rounded-lg p-6 ${summary.totalGainLoss >= 0 ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Gain/Perte</span>
            {summary.totalGainLoss >= 0 ? (
              <TrendingUp className="w-5 h-5 text-green-400" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-400" />
            )}
          </div>
          <div className={`text-3xl font-bold mb-1 ${summary.totalGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {formatCurrency(summary.totalGainLoss)}
          </div>
          <div className={`text-sm ${summary.totalGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {formatPercent(summary.totalGainLossPercent)}
          </div>
        </div>

        {/* Coût total */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Investissement</span>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {formatCurrency(summary.totalCost)}
          </div>
          <div className="text-sm text-gray-400">
            Coût d'acquisition
          </div>
        </div>

        {/* Nombre d'actions */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Positions</span>
            <Star className="w-5 h-5 text-gray-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {summary.numberOfHoldings || 0}
          </div>
          <div className="text-sm text-gray-400">
            Actions détenues
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-4 border-b border-gray-700 overflow-x-auto">
        {['overview', 'transactions', 'watchlist', 'trading-tools'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 font-medium transition whitespace-nowrap ${
              activeTab === tab
                ? 'text-orange-500 border-b-2 border-orange-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab === 'overview' ? 'Vue d\'ensemble' :
             tab === 'transactions' ? 'Transactions' :
             tab === 'watchlist' ? 'Watchlist' :
             'Outils de Trading'}
          </button>
        ))}
      </div>

      {/* Content based on active tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Performance Chart */}
          <PortfolioPerformanceChart />

          {/* Holdings */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Mes positions</h3>
            {holdings.length === 0 ? (
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-12 text-center">
                <PieChart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">
                  Aucune position
                </h3>
                <p className="text-gray-500 mb-4">
                  Commencez à investir en ajoutant votre première transaction
                </p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition"
                >
                  Ajouter une transaction
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {holdings.map((holding, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-orange-500 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-bold text-white">
                            {holding.market_id}
                          </h4>
                          <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
                            {holding.stock_name || 'N/A'}
                          </span>
                          {holding.sector && (
                            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                              {holding.sector}
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Quantité</span>
                            <div className="text-white font-semibold">{holding.quantity}</div>
                          </div>
                          <div>
                            <span className="text-gray-400">Prix moyen</span>
                            <div className="text-white font-semibold">{formatCurrency(holding.average_price)}</div>
                          </div>
                          <div>
                            <span className="text-gray-400">Prix actuel</span>
                            <div className="text-white font-semibold">{formatCurrency(holding.current_price)}</div>
                          </div>
                          <div>
                            <span className="text-gray-400">Valeur</span>
                            <div className="text-white font-semibold">{formatCurrency(holding.current_value)}</div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className={`text-2xl font-bold ${holding.gain_loss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {formatCurrency(holding.gain_loss)}
                        </div>
                        <div className={`flex items-center justify-end gap-1 ${holding.gain_loss_percent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {holding.gain_loss_percent >= 0 ? (
                            <ArrowUpRight className="w-4 h-4" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4" />
                          )}
                          <span>{formatPercent(holding.gain_loss_percent)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'transactions' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white">Historique des transactions</h3>
            <button
              onClick={() => exportTransactionsExcel(transactions)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold flex items-center gap-2 transition"
              disabled={transactions.length === 0}
            >
              <FileSpreadsheet className="w-5 h-5" />
              Exporter Excel
            </button>
          </div>
          {transactions.length === 0 ? (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-12 text-center">
              <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Aucune transaction</p>
            </div>
          ) : (
            <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-gray-300 font-semibold">Date</th>
                    <th className="px-4 py-3 text-left text-gray-300 font-semibold">Type</th>
                    <th className="px-4 py-3 text-left text-gray-300 font-semibold">Ticker</th>
                    <th className="px-4 py-3 text-right text-gray-300 font-semibold">Quantité</th>
                    <th className="px-4 py-3 text-right text-gray-300 font-semibold">Prix</th>
                    <th className="px-4 py-3 text-right text-gray-300 font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {transactions.map((tx, idx) => (
                    <tr key={idx} className="hover:bg-gray-700/50">
                      <td className="px-4 py-3 text-gray-300">
                        {new Date(tx.transaction_date).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          tx.transaction_type === 'buy'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {tx.transaction_type === 'buy' ? 'Achat' : 'Vente'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-white font-medium">{tx.ticker}</td>
                      <td className="px-4 py-3 text-right text-gray-300">{tx.quantity}</td>
                      <td className="px-4 py-3 text-right text-gray-300">{formatCurrency(tx.price)}</td>
                      <td className="px-4 py-3 text-right text-white font-semibold">
                        {formatCurrency(tx.total_amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'watchlist' && (
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Liste de suivi</h3>
          {watchlist.length === 0 ? (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-12 text-center">
              <Eye className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Aucune action suivie</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {watchlist.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-orange-500 transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-white mb-1">{item.ticker}</h4>
                      <p className="text-gray-400 text-sm">{item.stock_name}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-white">
                        {formatCurrency(item.current_price)}
                      </div>
                      {item.daily_change !== null && (
                        <div className={`flex items-center justify-end gap-1 ${item.daily_change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {item.daily_change >= 0 ? (
                            <ArrowUpRight className="w-4 h-4" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4" />
                          )}
                          <span>{formatPercent(item.daily_change)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {item.target_price && (
                    <div className="mt-3 pt-3 border-t border-gray-700">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Prix cible</span>
                        <span className="text-white font-medium">{formatCurrency(item.target_price)}</span>
                      </div>
                      {item.distance_to_target && (
                        <div className="flex items-center justify-between text-sm mt-1">
                          <span className="text-gray-400">Distance</span>
                          <span className={item.distance_to_target >= 0 ? 'text-green-400' : 'text-red-400'}>
                            {formatPercent(item.distance_to_target)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Outils de Trading */}
      {activeTab === 'trading-tools' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Outils de Trading Avancés</h3>
            <p className="text-gray-400 mb-6">
              Gérez vos stop loss, analysez les indicateurs techniques et calculez vos positions
            </p>
          </div>

          {/* Stop Loss Manager */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-orange-500" />
              Stop Loss & Take Profit
            </h4>
            <StopLossManager />
          </div>

          {/* Technical Indicators */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-orange-500" />
              Indicateurs Techniques
            </h4>
            <TechnicalIndicators />
          </div>

          {/* Position Sizing Calculator */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <PieChart className="w-6 h-6 text-orange-500" />
              Calculateur de Position
            </h4>
            <PositionSizingCalculator />
          </div>
        </div>
      )}

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={loadPortfolioData}
      />
    </div>
  );
};

export default PortfolioTabEnhanced;

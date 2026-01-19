import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { useTranslation } from 'react-i18next';
import { Shield, Target, TrendingDown, TrendingUp, X, Plus, AlertCircle } from 'lucide-react';

const StopLossManager = ({ portfolioId = 1 }) => {
  const { t } = useTranslation();
  const [activeOrders, setActiveOrders] = useState([]);
  const [executions, setExecutions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState('bracket'); // bracket, stop_loss, take_profit
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    ticker: '',
    quantity: '',
    entryPrice: '',
    stopLossPercent: '5',
    takeProfitPercent: '10'
  });

  useEffect(() => {
    fetchOrders();
    fetchExecutions();

    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(() => {
      fetchOrders();
      fetchExecutions();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${API_URL}/stop-loss/orders?status=active`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setActiveOrders(data.data);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  const fetchExecutions = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${API_URL}/stop-loss/executions?limit=10`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setExecutions(data.data);
      }
    } catch (err) {
      console.error('Error fetching executions:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const createBracketOrder = async () => {
    if (!formData.ticker || !formData.quantity || !formData.entryPrice) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/stop-loss/bracket`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          portfolioId,
          ticker: formData.ticker.toUpperCase(),
          quantity: parseFloat(formData.quantity),
          entryPrice: parseFloat(formData.entryPrice),
          stopLossPercent: parseFloat(formData.stopLossPercent),
          takeProfitPercent: parseFloat(formData.takeProfitPercent)
        })
      });

      const data = await response.json();

      if (data.success) {
        setShowForm(false);
        setFormData({
          ticker: '',
          quantity: '',
          entryPrice: '',
          stopLossPercent: '5',
          takeProfitPercent: '10'
        });
        fetchOrders();
      } else {
        setError(data.message || 'Erreur lors de la création de l\'ordre');
      }
    } catch (err) {
      setError('Impossible de créer l\'ordre');
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/stop-loss/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        fetchOrders();
      }
    } catch (err) {
      console.error('Error cancelling order:', err);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Shield className="w-6 h-6 text-blue-400" />
            Stop Loss / Take Profit
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Protection automatique de vos positions
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Annuler' : 'Nouvel Ordre'}
        </button>
      </div>

      {/* Formulaire de création */}
      {showForm && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Créer un Bracket Order (SL + TP)</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Ticker *
              </label>
              <input
                type="text"
                name="ticker"
                value={formData.ticker}
                onChange={handleInputChange}
                placeholder="SNTS"
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 uppercase"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Quantité *
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                placeholder="100"
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Prix d'Entrée (FCFA) *
              </label>
              <input
                type="number"
                name="entryPrice"
                value={formData.entryPrice}
                onChange={handleInputChange}
                placeholder="50000"
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Stop Loss (%) *
              </label>
              <select
                name="stopLossPercent"
                value={formData.stopLossPercent}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              >
                <option value="2">-2%</option>
                <option value="3">-3%</option>
                <option value="5">-5%</option>
                <option value="7">-7%</option>
                <option value="10">-10%</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Take Profit (%) *
              </label>
              <select
                name="takeProfitPercent"
                value={formData.takeProfitPercent}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              >
                <option value="5">+5%</option>
                <option value="10">+10%</option>
                <option value="15">+15%</option>
                <option value="20">+20%</option>
                <option value="25">+25%</option>
                <option value="30">+30%</option>
              </select>
            </div>

            <div className="flex items-end">
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ratio R/R
                </label>
                <div className="bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2">
                  1:{(parseFloat(formData.takeProfitPercent) / parseFloat(formData.stopLossPercent)).toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          {/* Aperçu des prix */}
          {formData.entryPrice && (
            <div className="mt-4 bg-gray-700/50 rounded-lg p-4">
              <p className="text-gray-300 text-sm mb-2">Aperçu des seuils:</p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-red-400 text-xs mb-1">Stop Loss</p>
                  <p className="text-white font-semibold">
                    {formatCurrency(parseFloat(formData.entryPrice) * (1 - parseFloat(formData.stopLossPercent) / 100))} FCFA
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Entrée</p>
                  <p className="text-white font-semibold">{formatCurrency(formData.entryPrice)} FCFA</p>
                </div>
                <div>
                  <p className="text-green-400 text-xs mb-1">Take Profit</p>
                  <p className="text-white font-semibold">
                    {formatCurrency(parseFloat(formData.entryPrice) * (1 + parseFloat(formData.takeProfitPercent) / 100))} FCFA
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 bg-red-900/30 border border-red-600 text-red-400 px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          )}

          <button
            onClick={createBracketOrder}
            disabled={loading}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            {loading ? 'Création en cours...' : 'Créer les Ordres SL/TP'}
          </button>
        </div>
      )}

      {/* Ordres actifs */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Ordres Actifs ({activeOrders.length})
        </h3>

        {activeOrders.length === 0 ? (
          <p className="text-gray-400 text-center py-8">Aucun ordre actif</p>
        ) : (
          <div className="space-y-3">
            {activeOrders.map(order => (
              <div key={order.id} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {order.order_type === 'stop_loss' ? (
                      <TrendingDown className="w-5 h-5 text-red-400" />
                    ) : (
                      <TrendingUp className="w-5 h-5 text-green-400" />
                    )}
                    <div>
                      <p className="text-white font-semibold">{order.ticker}</p>
                      <p className="text-gray-400 text-xs">
                        {order.order_type === 'stop_loss' ? 'Stop Loss' : 'Take Profit'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => cancelOrder(order.id)}
                    className="text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-gray-400 text-xs">Quantité</p>
                    <p className="text-white font-semibold">{order.quantity}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Prix Déclencheur</p>
                    <p className="text-white font-semibold">{formatCurrency(order.trigger_price)} FCFA</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Créé le</p>
                    <p className="text-white text-xs">{formatDate(order.created_at)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Historique d'exécution */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Historique d'Exécution (10 derniers)
        </h3>

        {executions.length === 0 ? (
          <p className="text-gray-400 text-center py-8">Aucune exécution récente</p>
        ) : (
          <div className="space-y-3">
            {executions.map(exec => (
              <div key={exec.id} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {exec.order_type === 'stop_loss' ? (
                      <Shield className="w-5 h-5 text-red-400" />
                    ) : (
                      <Target className="w-5 h-5 text-green-400" />
                    )}
                    <div>
                      <p className="text-white font-semibold">{exec.ticker}</p>
                      <p className="text-gray-400 text-xs">
                        {exec.order_type === 'stop_loss' ? 'Stop Loss Exécuté' : 'Take Profit Exécuté'}
                      </p>
                    </div>
                  </div>
                  {exec.profit_loss !== null && (
                    <div className={`text-right ${exec.profit_loss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      <p className="font-bold">
                        {exec.profit_loss >= 0 ? '+' : ''}{formatCurrency(exec.profit_loss)} FCFA
                      </p>
                      <p className="text-xs">
                        ({exec.profit_loss_percent >= 0 ? '+' : ''}{exec.profit_loss_percent.toFixed(2)}%)
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-4 gap-3 text-sm">
                  <div>
                    <p className="text-gray-400 text-xs">Quantité</p>
                    <p className="text-white">{exec.quantity}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Prix Cible</p>
                    <p className="text-white">{formatCurrency(exec.trigger_price)} FCFA</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Prix Réel</p>
                    <p className="text-white">{formatCurrency(exec.actual_price)} FCFA</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Exécuté le</p>
                    <p className="text-white text-xs">{formatDate(exec.executed_at)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StopLossManager;

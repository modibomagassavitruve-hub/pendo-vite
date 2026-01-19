import { useTranslation } from 'react-i18next';
import { API_URL } from '../config';
import React, { useState, useEffect } from 'react';
import { X, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const TransactionModal = ({ isOpen, onClose, onSuccess }) => {
  const { token } = useAuth();
  const { t } = useTranslation();
  const [type, setType] = useState('buy'); // 'buy' or 'sell'
  const [formData, setFormData] = useState({
    ticker: '',
    quantity: '',
    price: '',
    date: new Date().toISOString().split('T')[0],
    fees: '',
    notes: ''
  });
  const [stocks, setStocks] = useState([]);
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen && token) {
      loadData();
    }
  }, [isOpen, token]);

  const loadData = async () => {
    try {
      const headers = { 'Authorization': `Bearer ${token}` };

      // Charger les actions disponibles et les holdings
      const [stocksRes, portfolioRes] = await Promise.all([
        fetch(`${API_URL}/stocks?limit=100`, { headers }),
        fetch(`${API_URL}/portfolio/summary`, { headers })
      ]);

      const stocksData = await stocksRes.json();
      const portfolioData = await portfolioRes.json();

      if (stocksData.success) setStocks(stocksData.data || []);
      if (portfolioData.success) setHoldings(portfolioData.data?.holdings || []);
    } catch (err) {
      console.error('Erreur chargement données:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.ticker || !formData.quantity || !formData.price) {
      setError('Veuillez remplir tous les champs obligatoires');
      setLoading(false);
      return;
    }

    if (parseFloat(formData.quantity) <= 0) {
      setError('La quantité doit être supérieure à 0');
      setLoading(false);
      return;
    }

    if (parseFloat(formData.price) <= 0) {
      setError('Le prix doit être supérieur à 0');
      setLoading(false);
      return;
    }

    // Vérifier pour les ventes
    if (type === 'sell') {
      const holding = holdings.find(h => h.market_id === formData.ticker);
      if (!holding) {
        setError('Vous ne possédez pas cette action');
        setLoading(false);
        return;
      }
      if (holding.quantity < parseFloat(formData.quantity)) {
        setError(`Quantité insuffisante. Vous avez ${holding.quantity} actions.`);
        setLoading(false);
        return;
      }
    }

    try {
      const response = await fetch(`${API_URL}/portfolio/transaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ticker: formData.ticker,
          type,
          quantity: parseFloat(formData.quantity),
          price: parseFloat(formData.price),
          date: formData.date,
          fees: formData.fees ? parseFloat(formData.fees) : 0,
          notes: formData.notes
        })
      });

      const data = await response.json();

      if (data.success) {
        // Réinitialiser le formulaire
        setFormData({
          ticker: '',
          quantity: '',
          price: '',
          date: new Date().toISOString().split('T')[0],
          fees: '',
          notes: ''
        });

        if (onSuccess) onSuccess();
        onClose();
      } else {
        setError(data.error || 'Erreur lors de la transaction');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
      console.error('Erreur transaction:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredStocks = stocks.filter(stock =>
    stock.ticker?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedStock = stocks.find(s => s.ticker === formData.ticker);
  const selectedHolding = holdings.find(h => h.market_id === formData.ticker);

  const calculateTotal = () => {
    const quantity = parseFloat(formData.quantity) || 0;
    const price = parseFloat(formData.price) || 0;
    const fees = parseFloat(formData.fees) || 0;
    const subtotal = quantity * price;
    return type === 'buy' ? subtotal + fees : subtotal - fees;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-4 sm:p-6 flex justify-between items-center">
          <h2 className="text-xl sm:text-2xl font-bold text-white">Nouvelle Transaction</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Type de transaction */}
          <div>
            <label className="block text-gray-300 mb-2 font-medium">Type de transaction</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType('buy')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  type === 'buy'
                    ? 'bg-green-500/20 border-green-500 text-green-400'
                    : 'bg-gray-700 border-gray-600 text-gray-400 hover:border-gray-500'
                }`}
              >
                <TrendingUp className="w-6 h-6 mx-auto mb-2" />
                <span className="font-semibold">Achat</span>
              </button>
              <button
                type="button"
                onClick={() => setType('sell')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  type === 'sell'
                    ? 'bg-red-500/20 border-red-500 text-red-400'
                    : 'bg-gray-700 border-gray-600 text-gray-400 hover:border-gray-500'
                }`}
              >
                <TrendingDown className="w-6 h-6 mx-auto mb-2" />
                <span className="font-semibold">Vente</span>
              </button>
            </div>
          </div>

          {/* Sélection de l'action */}
          <div>
            <label className="block text-gray-300 mb-2 font-medium">
              Action <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder={t('placeholders.searchTickerName')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={(e) => {
                // Afficher toutes les actions si le champ est vide au focus
                if (!searchTerm) {
                  setSearchTerm(' ');
                  setTimeout(() => setSearchTerm(''), 0);
                }
              }}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 mb-2"
            />

            {/* Afficher les suggestions quand on tape OU quand le champ est vide et qu'il y a des stocks */}
            {((searchTerm && filteredStocks.length > 0) || (!searchTerm && !formData.ticker && stocks.length > 0)) && (
              <div className="bg-gray-700 border border-gray-600 rounded-lg max-h-48 overflow-y-auto">
                {(searchTerm ? filteredStocks : stocks).slice(0, 10).map(stock => (
                  <button
                    key={stock.ticker}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, ticker: stock.ticker, price: stock.price || '' });
                      setSearchTerm('');
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-600 transition flex justify-between items-center"
                  >
                    <div>
                      <div className="text-white font-medium">{stock.ticker}</div>
                      <div className="text-gray-400 text-sm">{stock.name}</div>
                    </div>
                    {stock.price && (
                      <div className="text-orange-400 font-semibold">
                        {stock.price.toLocaleString('fr-FR')} XOF
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {formData.ticker && selectedStock && (
              <div className="mt-2 p-3 bg-gray-700/50 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-white font-semibold">{selectedStock.ticker}</div>
                    <div className="text-gray-400 text-sm">{selectedStock.name}</div>
                  </div>
                  {selectedStock.price && (
                    <div className="text-right">
                      <div className="text-white font-semibold">
                        {selectedStock.price.toLocaleString('fr-FR')} XOF
                      </div>
                      {selectedStock.change_percent !== undefined && (
                        <div className={`text-sm ${selectedStock.change_percent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {selectedStock.change_percent >= 0 ? '+' : ''}{selectedStock.change_percent.toFixed(2)}%
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {type === 'sell' && formData.ticker && selectedHolding && (
              <div className="mt-2 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <div className="text-blue-400 text-sm">
                  Quantité disponible: <span className="font-semibold">{selectedHolding.quantity}</span> actions
                </div>
              </div>
            )}
          </div>

          {/* Quantité et Prix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-gray-300 mb-2 font-medium">
                Quantité <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
                placeholder="0"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-medium">
                Prix unitaire (XOF) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          {/* Date et Frais */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-gray-300 mb-2 font-medium">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-medium">Frais (XOF)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.fees}
                onChange={(e) => setFormData({ ...formData, fees: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-gray-300 mb-2 font-medium">Notes (optionnel)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 resize-none"
              rows="3"
              placeholder={t('placeholders.addNotes')}
            />
          </div>

          {/* Résumé */}
          {formData.quantity && formData.price && (
            <div className="bg-gray-700/50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-gray-300">
                <span>Sous-total:</span>
                <span>{((parseFloat(formData.quantity) || 0) * (parseFloat(formData.price) || 0)).toLocaleString('fr-FR')} XOF</span>
              </div>
              {formData.fees && (
                <div className="flex justify-between text-gray-300">
                  <span>Frais:</span>
                  <span>{parseFloat(formData.fees).toLocaleString('fr-FR')} XOF</span>
                </div>
              )}
              <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-gray-600">
                <span>Total:</span>
                <span className={type === 'buy' ? 'text-red-400' : 'text-green-400'}>
                  {type === 'buy' ? '-' : '+'}{calculateTotal().toLocaleString('fr-FR')} XOF
                </span>
              </div>
            </div>
          )}

          {/* Erreur */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition text-sm sm:text-base"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold transition text-sm sm:text-base ${
                type === 'buy'
                  ? 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600'
                  : 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600'
              } text-white disabled:opacity-50`}
            >
              {loading ? 'En cours...' : type === 'buy' ? 'Acheter' : 'Vendre'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;

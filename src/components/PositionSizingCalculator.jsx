import React, { useState } from 'react';
import { API_URL } from '../config';
import { useTranslation } from 'react-i18next';
import { Calculator, DollarSign, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

const PositionSizingCalculator = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    accountBalance: '',
    riskPercentage: '2',
    entryPrice: '',
    stopLoss: '',
    takeProfit: '',
    atr: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculatePosition = async () => {
    // Validation
    if (!formData.accountBalance || !formData.entryPrice || !formData.stopLoss) {
      setError('Veuillez remplir au minimum: Capital, Prix d\'entrée et Stop Loss');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/position-sizing/comprehensive`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          accountBalance: parseFloat(formData.accountBalance),
          riskPercentage: parseFloat(formData.riskPercentage),
          entryPrice: parseFloat(formData.entryPrice),
          stopLoss: parseFloat(formData.stopLoss),
          takeProfit: formData.takeProfit ? parseFloat(formData.takeProfit) : null,
          atr: formData.atr ? parseFloat(formData.atr) : null
        })
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.message || 'Erreur lors du calcul');
      }
    } catch (err) {
      setError('Impossible de calculer la taille de position');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="w-6 h-6 text-blue-400" />
        <h2 className="text-2xl font-bold text-white">Calculateur de Position</h2>
      </div>

      {/* Formulaire */}
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Capital du compte */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Capital Total (FCFA) *
            </label>
            <input
              type="number"
              name="accountBalance"
              value={formData.accountBalance}
              onChange={handleInputChange}
              placeholder="100000000"
              className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Risque % */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Risque par Trade (%) *
            </label>
            <select
              name="riskPercentage"
              value={formData.riskPercentage}
              onChange={handleInputChange}
              className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value="0.5">0.5% (Très conservateur)</option>
              <option value="1">1% (Conservateur)</option>
              <option value="2">2% (Recommandé)</option>
              <option value="3">3% (Modéré)</option>
              <option value="5">5% (Agressif)</option>
            </select>
          </div>

          {/* Prix d'entrée */}
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

          {/* Stop Loss */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Stop Loss (FCFA) *
            </label>
            <input
              type="number"
              name="stopLoss"
              value={formData.stopLoss}
              onChange={handleInputChange}
              placeholder="47500"
              className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Take Profit */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Take Profit (FCFA)
              <span className="text-gray-500 ml-1 text-xs">(optionnel)</span>
            </label>
            <input
              type="number"
              name="takeProfit"
              value={formData.takeProfit}
              onChange={handleInputChange}
              placeholder="60000"
              className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* ATR */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              ATR (Average True Range)
              <span className="text-gray-500 ml-1 text-xs">(optionnel)</span>
            </label>
            <input
              type="number"
              name="atr"
              value={formData.atr}
              onChange={handleInputChange}
              placeholder="2500"
              className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-600 text-red-400 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        )}

        <button
          onClick={calculatePosition}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Calcul en cours...
            </>
          ) : (
            <>
              <Calculator className="w-5 h-5" />
              Calculer la Taille de Position
            </>
          )}
        </button>
      </div>

      {/* Résultats */}
      {result && (
        <div className="space-y-4 border-t border-gray-700 pt-6">
          {/* Recommandation finale */}
          <div className="bg-gradient-to-r from-blue-900/50 to-blue-800/50 rounded-lg p-6 border border-blue-700">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <h3 className="text-xl font-bold text-white">Recommandation</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-1">Nombre d'Actions</p>
                <p className="text-3xl font-bold text-white">{result.finalRecommendation.recommendedShares}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-1">Investissement</p>
                <p className="text-2xl font-bold text-blue-400">{formatCurrency(result.finalRecommendation.investment)} FCFA</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-1">Risque Maximum</p>
                <p className="text-2xl font-bold text-red-400">{formatCurrency(result.finalRecommendation.riskAmount)} FCFA</p>
              </div>
            </div>

            <p className="text-gray-300 text-sm">{result.finalRecommendation.reason}</p>
          </div>

          {/* Risk-Reward si disponible */}
          {result.riskReward && (
            <div className="bg-gray-700/50 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-3">Ratio Risque / Récompense</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-red-400 text-sm">Risque</p>
                  <p className="text-xl font-bold text-white">{result.riskReward.riskPercent.toFixed(2)}%</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Ratio</p>
                  <p className="text-3xl font-bold text-blue-400">1:{result.riskReward.ratio}</p>
                </div>
                <div>
                  <p className="text-green-400 text-sm">Récompense</p>
                  <p className="text-xl font-bold text-white">{result.riskReward.rewardPercent.toFixed(2)}%</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  result.riskReward.rating === 'Excellent' ? 'bg-green-600 text-white' :
                  result.riskReward.rating === 'Good' ? 'bg-blue-600 text-white' :
                  result.riskReward.rating === 'Acceptable' ? 'bg-yellow-600 text-white' :
                  'bg-red-600 text-white'
                }`}>
                  {result.riskReward.rating}
                </span>
                <p className="text-gray-300 text-sm">{result.riskReward.recommendation}</p>
              </div>
            </div>
          )}

          {/* Détails de la méthode principale */}
          <div className="bg-gray-700/50 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-3">Détails du Calcul (Fixed Percentage Risk)</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Capital total:</span>
                <span className="text-white font-semibold">{formatCurrency(result.accountBalance)} FCFA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Risque %:</span>
                <span className="text-white font-semibold">{result.fixedPercentageRisk.riskPercentage}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Prix d'entrée:</span>
                <span className="text-white font-semibold">{formatCurrency(result.entryPrice)} FCFA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Stop Loss:</span>
                <span className="text-white font-semibold">{formatCurrency(result.stopLoss)} FCFA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Risque par action:</span>
                <span className="text-white font-semibold">{formatCurrency(result.fixedPercentageRisk.riskPerShare)} FCFA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">% du portefeuille:</span>
                <span className="text-white font-semibold">{result.fixedPercentageRisk.positionPercent.toFixed(2)}%</span>
              </div>
            </div>

            {result.fixedPercentageRisk.recommendation && (
              <div className={`mt-3 p-3 rounded-lg ${
                result.fixedPercentageRisk.recommendation.level === 'good' ? 'bg-green-900/30 border border-green-600' :
                result.fixedPercentageRisk.recommendation.level === 'caution' ? 'bg-yellow-900/30 border border-yellow-600' :
                'bg-red-900/30 border border-red-600'
              }`}>
                <p className={`text-sm ${
                  result.fixedPercentageRisk.recommendation.level === 'good' ? 'text-green-400' :
                  result.fixedPercentageRisk.recommendation.level === 'caution' ? 'text-yellow-400' :
                  'text-red-400'
                }`}>
                  {result.fixedPercentageRisk.recommendation.message}
                </p>
              </div>
            )}
          </div>

          {/* Position maximale */}
          <div className="bg-gray-700/50 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-2">Règle de Diversification</h4>
            <p className="text-sm text-gray-300 mb-2">
              Maximum recommandé par position: <span className="font-bold text-white">{result.maxPosition.maxShares} actions</span>
              {' '}({result.maxPosition.maxPositionPercent}% du portefeuille)
            </p>
            <p className="text-xs text-gray-400">
              Limitez chaque position à 5-10% maximum de votre capital total pour une bonne diversification.
            </p>
          </div>

          {/* Méthode ATR si disponible */}
          {result.atrBased && (
            <div className="bg-gray-700/50 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-3">Méthode ATR (Volatilité)</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">ATR:</span>
                  <span className="text-white font-semibold">{result.atrBased.atr} FCFA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Multiplicateur:</span>
                  <span className="text-white font-semibold">{result.atrBased.atrMultiplier}x</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Stop suggéré:</span>
                  <span className="text-white font-semibold">{formatCurrency(result.atrBased.stopLoss)} FCFA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Position (ATR):</span>
                  <span className="text-white font-semibold">{result.atrBased.positionSize} actions</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Guide des bonnes pratiques */}
      <div className="mt-6 bg-gray-700/30 rounded-lg p-4 border border-gray-600">
        <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-yellow-400" />
          Bonnes Pratiques de Gestion du Risque
        </h4>
        <ul className="space-y-1 text-sm text-gray-300">
          <li>• Ne risquez jamais plus de 1-2% de votre capital par trade</li>
          <li>• Utilisez toujours un Stop Loss sur chaque position</li>
          <li>• Visez un ratio risque/récompense minimum de 2:1</li>
          <li>• Limitez chaque position à 5-10% maximum de votre portefeuille</li>
          <li>• Diversifiez vos investissements sur plusieurs actions et secteurs</li>
        </ul>
      </div>
    </div>
  );
};

export default PositionSizingCalculator;

import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { useTranslation } from 'react-i18next';
import { TrendingUp, TrendingDown, Activity, BarChart3, AlertCircle } from 'lucide-react';

const TechnicalIndicators = ({ ticker }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (ticker) {
      fetchAnalysis();
    }
  }, [ticker]);

  const fetchAnalysis = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/indicators/${ticker}/complete`);
      const data = await response.json();

      if (data.success) {
        setAnalysis(data.data);
      } else {
        setError(data.message || 'Erreur lors du chargement des indicateurs');
      }
    } catch (err) {
      setError('Impossible de charger les indicateurs techniques');
    } finally {
      setLoading(false);
    }
  };

  if (!ticker) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center">
        <BarChart3 className="w-12 h-12 text-gray-500 mx-auto mb-3" />
        <p className="text-gray-400">Sélectionnez une action pour voir les indicateurs techniques</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          <div className="h-4 bg-gray-700 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center gap-3 text-red-400">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getRecommendationBadge = (recommendation) => {
    const badges = {
      BUY: 'bg-green-600 text-white',
      SELL: 'bg-red-600 text-white',
      HOLD: 'bg-yellow-600 text-white',
      STRONG_BUY: 'bg-green-700 text-white',
      STRONG_SELL: 'bg-red-700 text-white'
    };

    return badges[recommendation] || 'bg-gray-600 text-white';
  };

  const getSignalIcon = (signal) => {
    if (signal === 'bullish' || signal === 'bullish_cross' || signal === 'oversold') {
      return <TrendingUp className="w-4 h-4 text-green-400" />;
    }
    if (signal === 'bearish' || signal === 'bearish_cross' || signal === 'overbought') {
      return <TrendingDown className="w-4 h-4 text-red-400" />;
    }
    return <Activity className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="space-y-4">
      {/* En-tête avec score global */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">{ticker}</h3>
            <p className="text-gray-400 text-sm">Analyse Technique Complète</p>
          </div>
          <div className="text-right">
            <div className={`text-4xl font-bold ${getScoreColor(analysis.overallScore)}`}>
              {analysis.overallScore}
            </div>
            <p className="text-gray-400 text-sm">Score / 100</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-4 py-2 rounded-full font-semibold text-sm ${getRecommendationBadge(analysis.recommendation)}`}>
            {analysis.recommendation}
          </span>
          <p className="text-gray-300 text-sm">{analysis.interpretation}</p>
        </div>
      </div>

      {/* Indicateurs individuels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* RSI */}
        {analysis.rsi && (
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-white">RSI ({analysis.rsi.period})</h4>
              {getSignalIcon(analysis.rsi.signal)}
            </div>
            <div className="mb-2">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-400">Valeur</span>
                <span className="text-white font-semibold">{analysis.rsi.current.toFixed(2)}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    analysis.rsi.current > 70
                      ? 'bg-red-500'
                      : analysis.rsi.current < 30
                      ? 'bg-green-500'
                      : 'bg-yellow-500'
                  }`}
                  style={{ width: `${analysis.rsi.current}%` }}
                ></div>
              </div>
            </div>
            <p className="text-xs text-gray-400">{analysis.rsi.interpretation}</p>
          </div>
        )}

        {/* MACD */}
        {analysis.macd && (
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-white">MACD</h4>
              {getSignalIcon(analysis.macd.signal)}
            </div>
            <div className="space-y-1 text-sm mb-2">
              <div className="flex justify-between">
                <span className="text-gray-400">MACD</span>
                <span className="text-white font-mono">{analysis.macd.current.MACD.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Signal</span>
                <span className="text-white font-mono">{analysis.macd.current.signal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Histogramme</span>
                <span className={`font-mono ${analysis.macd.current.histogram >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {analysis.macd.current.histogram.toFixed(2)}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-400">{analysis.macd.interpretation}</p>
          </div>
        )}

        {/* Bollinger Bands */}
        {analysis.bollingerBands && (
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-white">Bollinger Bands</h4>
              {getSignalIcon(analysis.bollingerBands.signal)}
            </div>
            <div className="space-y-1 text-sm mb-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Bande Sup.</span>
                <span className="text-white font-mono">{analysis.bollingerBands.current.upper.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Moyenne</span>
                <span className="text-white font-mono">{analysis.bollingerBands.current.middle.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Bande Inf.</span>
                <span className="text-white font-mono">{analysis.bollingerBands.current.lower.toFixed(2)}</span>
              </div>
            </div>
            <p className="text-xs text-gray-400">{analysis.bollingerBands.interpretation}</p>
          </div>
        )}

        {/* Moving Averages */}
        {analysis.movingAverages && (
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-white">Moyennes Mobiles</h4>
              {getSignalIcon(analysis.movingAverages.signal)}
            </div>
            <div className="space-y-1 text-sm mb-2">
              {Object.entries(analysis.movingAverages.sma).map(([period, value]) => (
                <div key={period} className="flex justify-between">
                  <span className="text-gray-400">SMA {period}</span>
                  <span className="text-white font-mono">{value.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400">{analysis.movingAverages.interpretation}</p>
          </div>
        )}

        {/* ATR */}
        {analysis.atr && (
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-white">ATR - Volatilité</h4>
              <Activity className="w-4 h-4 text-blue-400" />
            </div>
            <div className="space-y-1 text-sm mb-2">
              <div className="flex justify-between">
                <span className="text-gray-400">ATR</span>
                <span className="text-white font-mono">{analysis.atr.current.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">ATR %</span>
                <span className="text-white font-mono">{analysis.atr.percentOfPrice.toFixed(2)}%</span>
              </div>
            </div>
            <p className="text-xs text-gray-400">{analysis.atr.interpretation}</p>
          </div>
        )}

        {/* Stochastic */}
        {analysis.stochastic && (
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-white">Stochastic</h4>
              {getSignalIcon(analysis.stochastic.signal)}
            </div>
            <div className="space-y-1 text-sm mb-2">
              <div className="flex justify-between">
                <span className="text-gray-400">%K</span>
                <span className="text-white font-mono">{analysis.stochastic.current.k.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">%D</span>
                <span className="text-white font-mono">{analysis.stochastic.current.d.toFixed(2)}</span>
              </div>
            </div>
            <p className="text-xs text-gray-400">{analysis.stochastic.interpretation}</p>
          </div>
        )}
      </div>

      {/* Bouton de rafraîchissement */}
      <button
        onClick={fetchAnalysis}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
      >
        Rafraîchir l'analyse
      </button>
    </div>
  );
};

export default TechnicalIndicators;

import React, { useState, useEffect } from 'react';
import { Clock, Moon, Sun, Calendar, Bell, Globe, TrendingUp } from 'lucide-react';
import { AFRICAN_EXCHANGES } from '../data/africanExchanges';

const MarketClosedPage = ({ markets, onSetAlert }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedExchange, setSelectedExchange] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculer le prochain marché à ouvrir
  const getNextOpeningMarket = () => {
    const now = new Date();
    const day = now.getUTCDay();
    const isWeekend = day === 0 || day === 6;

    if (isWeekend) {
      return {
        name: 'Tous les marchés',
        opensIn: 'Lundi à 07:00 UTC',
        isWeekend: true
      };
    }

    // Trouver le prochain marché à ouvrir
    const exchanges = Object.values(AFRICAN_EXCHANGES);
    let nextOpening = null;
    let minTime = Infinity;

    exchanges.forEach(exchange => {
      if (exchange.tradingHours?.utcOpen) {
        const [hours, minutes] = exchange.tradingHours.utcOpen.split(':').map(Number);
        const openTime = new Date(now);
        openTime.setUTCHours(hours, minutes, 0, 0);

        if (openTime > now) {
          const diff = openTime - now;
          if (diff < minTime) {
            minTime = diff;
            nextOpening = {
              name: exchange.fullName,
              flag: exchange.flag,
              opensIn: exchange.tradingHours.utcOpen + ' UTC',
              timeLeft: diff
            };
          }
        }
      }
    });

    return nextOpening || { name: 'Demain', opensIn: '07:00 UTC', isNextDay: true };
  };

  const nextMarket = getNextOpeningMarket();

  // Formater le temps restant
  const formatTimeLeft = (ms) => {
    if (!ms) return '';
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}min`;
  };

  // Liste des bourses avec leurs horaires
  const exchangesList = Object.values(AFRICAN_EXCHANGES).slice(0, 10);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <div className="text-center pt-12 pb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-orange-500 to-red-500 mb-6">
          <Moon className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-bold mb-2">Marchés Fermés</h1>
        <p className="text-gray-400 text-lg">
          {currentTime.toLocaleDateString('fr-FR', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long',
            year: 'numeric'
          })}
        </p>
        <p className="text-2xl font-mono text-orange-400 mt-2">
          {currentTime.toLocaleTimeString('fr-FR')} (Heure locale)
        </p>
      </div>

      {/* Prochain marché à ouvrir */}
      <div className="max-w-4xl mx-auto px-4 mb-12">
        <div className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 rounded-2xl p-6 border border-green-500/30">
          <div className="flex items-center gap-3 mb-4">
            <Sun className="w-6 h-6 text-green-400" />
            <h2 className="text-xl font-semibold text-green-400">Prochaine ouverture</h2>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">
                {nextMarket.flag} {nextMarket.name}
              </p>
              <p className="text-gray-400">Ouverture à {nextMarket.opensIn}</p>
            </div>
            {nextMarket.timeLeft && (
              <div className="text-right">
                <p className="text-3xl font-bold text-green-400">
                  {formatTimeLeft(nextMarket.timeLeft)}
                </p>
                <p className="text-gray-400">restantes</p>
              </div>
            )}
          </div>
          {nextMarket.isWeekend && (
            <div className="mt-4 p-3 bg-yellow-900/30 rounded-lg border border-yellow-500/30">
              <p className="text-yellow-400 text-sm">
                📅 C'est le weekend ! Les marchés rouvrent lundi.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Horaires des marchés */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <div className="flex items-center gap-3 mb-6">
          <Clock className="w-6 h-6 text-orange-400" />
          <h2 className="text-2xl font-bold">Horaires des Bourses Africaines</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {exchangesList.map((exchange) => (
            <div
              key={exchange.id}
              className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 hover:border-orange-500/50 transition-all cursor-pointer"
              onClick={() => setSelectedExchange(exchange)}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{exchange.flag}</span>
                <div>
                  <h3 className="font-bold">{exchange.code}</h3>
                  <p className="text-sm text-gray-400">{exchange.country}</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Ouverture</span>
                  <span className="font-mono text-green-400">
                    {exchange.tradingHours?.open || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Fermeture</span>
                  <span className="font-mono text-red-400">
                    {exchange.tradingHours?.close || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Fuseau</span>
                  <span className="font-mono text-gray-300">
                    {exchange.tradingHours?.timezone || 'N/A'}
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-700">
                <div className="flex flex-wrap gap-1">
                  {exchange.tradingDays?.map((day, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-gray-700 rounded text-xs"
                    >
                      {day}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dernières données disponibles */}
      {markets && markets.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 pb-12">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-bold">Dernières Cotations (Clôture)</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {markets.slice(0, 8).map((market) => (
              <div
                key={market.id}
                className="bg-gray-800/50 rounded-xl p-4 border border-gray-700"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold">{market.name}</h3>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    market.positive 
                      ? 'bg-green-900/50 text-green-400' 
                      : 'bg-red-900/50 text-red-400'
                  }`}>
                    {market.change}
                  </span>
                </div>
                <p className="text-2xl font-bold">{market.value}</p>
                <p className="text-sm text-gray-400">{market.country}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA - Configurer des alertes */}
      <div className="max-w-4xl mx-auto px-4 pb-12">
        <div className="bg-gradient-to-r from-orange-900/50 to-red-900/50 rounded-2xl p-6 border border-orange-500/30 text-center">
          <Bell className="w-12 h-12 text-orange-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Ne manquez pas l'ouverture !</h2>
          <p className="text-gray-400 mb-4">
            Configurez des alertes pour être notifié à l'ouverture des marchés
          </p>
          <button
            onClick={onSetAlert}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Configurer les alertes
          </button>
        </div>
      </div>

      {/* Footer info */}
      <div className="text-center pb-8 text-gray-500 text-sm">
        <p>Les horaires sont indicatifs et peuvent varier les jours fériés.</p>
        <p className="mt-1">© 2024 PENDO - African Financial Markets</p>
      </div>
    </div>
  );
};

export default MarketClosedPage;

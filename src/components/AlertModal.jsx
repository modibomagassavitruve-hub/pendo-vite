import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import { X, Bell, BellRing, Clock, TrendingUp, TrendingDown, Mail, Smartphone } from 'lucide-react';
import { AFRICAN_EXCHANGES } from '../data/africanExchanges';

const AlertModal = ({ onClose }) => {
  const { t } = useTranslation();
  const [alerts, setAlerts] = useState([]);
  const [newAlert, setNewAlert] = useState({
    exchange: '',
    type: 'opening', // opening, price_above, price_below
    value: '',
    notification: 'browser' // browser, email
  });

  const exchanges = Object.values(AFRICAN_EXCHANGES);

  const addAlert = () => {
    if (!newAlert.exchange) return;
    
    const exchange = exchanges.find(e => e.id === newAlert.exchange);
    setAlerts([...alerts, {
      ...newAlert,
      id: Date.now(),
      exchangeName: exchange?.fullName,
      exchangeFlag: exchange?.flag
    }]);
    
    setNewAlert({
      exchange: '',
      type: 'opening',
      value: '',
      notification: 'browser'
    });

    // Demander la permission pour les notifications
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const removeAlert = (id) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  const getAlertTypeLabel = (type) => {
    switch (type) {
      case 'opening': return "À l'ouverture";
      case 'closing': return 'À la fermeture';
      case 'price_above': return 'Prix au-dessus de';
      case 'price_below': return 'Prix en-dessous de';
      default: return type;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <BellRing className="w-6 h-6 text-orange-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Configurer les Alertes</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Créer une alerte */}
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Nouvelle alerte</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sélection de la bourse */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Bourse</label>
              <select
                value={newAlert.exchange}
                onChange={(e) => setNewAlert({...newAlert, exchange: e.target.value})}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none"
              >
                <option value="">Sélectionner une bourse</option>
                {exchanges.map(ex => (
                  <option key={ex.id} value={ex.id}>
                    {ex.flag} {ex.code} - {ex.country}
                  </option>
                ))}
              </select>
            </div>

            {/* Type d'alerte */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Type d'alerte</label>
              <select
                value={newAlert.type}
                onChange={(e) => setNewAlert({...newAlert, type: e.target.value})}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none"
              >
                <option value="opening">À l'ouverture du marché</option>
                <option value="closing">À la fermeture du marché</option>
                <option value="price_above">Prix au-dessus de...</option>
                <option value="price_below">Prix en-dessous de...</option>
              </select>
            </div>

            {/* Valeur (pour les alertes de prix) */}
            {(newAlert.type === 'price_above' || newAlert.type === 'price_below') && (
              <div>
                <label className="block text-sm text-gray-400 mb-2">Valeur seuil</label>
                <input
                  type="number"
                  value={newAlert.value}
                  onChange={(e) => setNewAlert({...newAlert, value: e.target.value})}
                  placeholder="Ex: 75000"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-orange-500 focus:outline-none"
                />
              </div>
            )}

            {/* Méthode de notification */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Notification</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setNewAlert({...newAlert, notification: 'browser'})}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition ${
                    newAlert.notification === 'browser'
                      ? 'border-orange-500 bg-orange-500/20 text-orange-400'
                      : 'border-gray-700 text-gray-400 hover:border-gray-600'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                  Navigateur
                </button>
                <button
                  onClick={() => setNewAlert({...newAlert, notification: 'email'})}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition ${
                    newAlert.notification === 'email'
                      ? 'border-orange-500 bg-orange-500/20 text-orange-400'
                      : 'border-gray-700 text-gray-400 hover:border-gray-600'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  Email
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={addAlert}
            disabled={!newAlert.exchange}
            className="mt-4 w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg font-semibold text-white hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Ajouter l'alerte
          </button>
        </div>

        {/* Liste des alertes */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Mes alertes ({alerts.length})
          </h3>

          {alerts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Aucune alerte configurée</p>
              <p className="text-sm">Créez votre première alerte ci-dessus</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{alert.exchangeFlag}</span>
                    <div>
                      <p className="font-medium text-white">{alert.exchangeName}</p>
                      <p className="text-sm text-gray-400">
                        {getAlertTypeLabel(alert.type)}
                        {alert.value && ` ${alert.value}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">
                      {alert.notification === 'browser' ? '🔔 Navigateur' : '📧 Email'}
                    </span>
                    <button
                      onClick={() => removeAlert(alert.id)}
                      className="p-2 hover:bg-gray-700 rounded-lg transition text-gray-400 hover:text-red-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertModal;

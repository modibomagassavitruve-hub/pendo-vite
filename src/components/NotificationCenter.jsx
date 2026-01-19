import { useTranslation } from 'react-i18next';
import { API_URL } from '../config';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const NotificationCenter = ({ isOpen, onClose }) => {
  const { token, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('notifications');
  const [showAlertForm, setShowAlertForm] = useState(false);
  const [newAlert, setNewAlert] = useState({ ticker: '', alertType: 'price_above', targetValue: '' });

  const fetchData = async () => {
    if (!token) return;

    try {
      const headers = { 'Authorization': `Bearer ${token}` };

      const [notifRes, alertsRes] = await Promise.all([
        fetch(`${API_URL}/notifications`, { headers }),
        fetch(`${API_URL}/portfolio/alerts`, { headers })
      ]);
      const notifData = await notifRes.json();
      const alertsData = await alertsRes.json();

      if (notifData.success) setNotifications(notifData.data);
      if (alertsData.success) setAlerts(alertsData.data);
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchData();
  }, [isOpen]);

  const markAsRead = async (id) => {
    if (!token) return;
    await fetch(`${API_URL}/notifications/${id}/read`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: 1 } : n));
  };

  const markAllRead = async () => {
    if (!token) return;
    await fetch(`${API_URL}/notifications/read-all`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
  };

  const createAlert = async () => {
    if (!newAlert.ticker || !newAlert.targetValue || !token) return;

    const res = await fetch(`${API_URL}/portfolio/alerts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        ticker: newAlert.ticker,
        alertType: newAlert.alertType,
        targetValue: parseFloat(newAlert.targetValue)
      })
    });

    if (res.ok) {
      fetchData();
      setShowAlertForm(false);
      setNewAlert({ ticker: '', alertType: 'price_above', targetValue: '' });
    }
  };

  const deleteAlert = async (id) => {
    if (!token) return;
    await fetch(`${API_URL}/portfolio/alerts/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const getIcon = (type) => {
    const icons = {
      price_alert: '🔔',
      market_news: '📰',
      portfolio_update: '💼',
      market_open: '🟢',
      market_close: '🔴',
      significant_change: '📈'
    };
    return icons[type] || '📌';
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = Math.floor((now - d) / 60000);
    if (diff < 60) return `Il y a ${diff} min`;
    if (diff < 1440) return `Il y a ${Math.floor(diff/60)}h`;
    return d.toLocaleDateString('fr-FR');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex justify-end">
      <div className="w-full max-w-md bg-gray-800 h-full overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">🔔 Notifications</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">×</button>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex-1 py-2 rounded-lg font-medium ${activeTab === 'notifications' ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              Notifications ({notifications.filter(n => !n.is_read).length})
            </button>
            <button
              onClick={() => setActiveTab('alerts')}
              className={`flex-1 py-2 rounded-lg font-medium ${activeTab === 'alerts' ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300'}`}
            >
              Alertes ({alerts.length})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          ) : activeTab === 'notifications' ? (
            <>
              {notifications.length > 0 && (
                <button onClick={markAllRead} className="text-sm text-orange-400 hover:text-orange-300 mb-4">
                  Tout marquer comme lu
                </button>
              )}
              
              <div className="space-y-3">
                {notifications.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">Aucune notification</p>
                ) : (
                  notifications.map(notif => (
                    <div
                      key={notif.id}
                      onClick={() => markAsRead(notif.id)}
                      className={`p-4 rounded-lg cursor-pointer transition-colors ${notif.is_read ? 'bg-gray-700/50' : 'bg-gray-700 border-l-4 border-orange-500'}`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{getIcon(notif.type)}</span>
                        <div className="flex-1">
                          <h4 className="text-white font-medium">{notif.title}</h4>
                          <p className="text-gray-400 text-sm mt-1">{notif.message}</p>
                          <p className="text-gray-500 text-xs mt-2">{formatDate(notif.created_at)}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => setShowAlertForm(!showAlertForm)}
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium mb-4"
              >
                + Nouvelle alerte de prix
              </button>

              {showAlertForm && (
                <div className="bg-gray-700 rounded-lg p-4 mb-4 space-y-3">
                  <input
                    type="text"
                    placeholder="Ticker (ex: AGL pour Anglo American)"
                    value={newAlert.ticker}
                    onChange={e => setNewAlert({ ...newAlert, ticker: e.target.value.toUpperCase() })}
                    className="w-full bg-gray-600 text-white rounded p-2"
                  />

                  <select
                    value={newAlert.alertType}
                    onChange={e => setNewAlert({ ...newAlert, alertType: e.target.value })}
                    className="w-full bg-gray-600 text-white rounded p-2"
                  >
                    <option value="price_above">Prix au-dessus de</option>
                    <option value="price_below">Prix en-dessous de</option>
                  </select>

                  <input
                    type="number"
                    step="0.01"
                    placeholder="Prix cible (XOF)"
                    value={newAlert.targetValue}
                    onChange={e => setNewAlert({ ...newAlert, targetValue: e.target.value })}
                    className="w-full bg-gray-600 text-white rounded p-2"
                  />
                  
                  <button onClick={createAlert} className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded font-medium">
                    Créer l'alerte
                  </button>
                </div>
              )}

              <div className="space-y-3">
                {alerts.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">Aucune alerte configurée</p>
                ) : (
                  alerts.map(alert => (
                    <div key={alert.id} className="bg-gray-700 rounded-lg p-4 flex justify-between items-center">
                      <div>
                        <h4 className="text-white font-medium">{alert.ticker}</h4>
                        <p className="text-gray-400 text-sm">
                          {alert.alert_type === 'price_above' ? '📈 Au-dessus de' : '📉 En-dessous de'} {alert.target_value.toLocaleString('fr-FR')} XOF
                        </p>
                        {alert.triggered_at && (
                          <p className="text-green-400 text-xs mt-1">✓ Déclenchée</p>
                        )}
                      </div>
                      <button onClick={() => deleteAlert(alert.id)} className="text-red-400 hover:text-red-300">
                        🗑️
                      </button>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;

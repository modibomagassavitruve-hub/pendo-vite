import { useTranslation } from 'react-i18next';
import { API_URL } from '../config';
import React from 'react';
import { 
  Server, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Download, 
  Database 
} from 'lucide-react';

const AdminPanel = ({
  apiStatus,
  apiUrl,
  setApiUrl,
  checkApiStatus,
  refreshMarkets,
  loadFallbackData,
  loading,
  markets,
  onClose
}) => {
  
  const exportData = () => {
    const json = JSON.stringify(markets, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pendo_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-5xl w-full my-4 max-h-[calc(100vh-2rem)] flex flex-col">
        {/* Header - Fixed at top */}
        <div className="bg-orange-600 text-white p-4 flex justify-between items-center rounded-t-lg flex-shrink-0">
          <h2 className="text-xl font-bold flex items-center">
            <Server className="w-6 h-6 mr-2" />
            Centre de Contrôle PENDO
          </h2>
          <button
            onClick={onClose}
            className="text-2xl hover:bg-orange-700 px-3 py-1 rounded font-bold"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Backend Status */}
          <div className={`border-l-4 p-4 rounded ${
            apiStatus.connected 
              ? 'bg-green-50 border-green-500' 
              : 'bg-red-50 border-red-500'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {apiStatus.connected ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600" />
                )}
                <div>
                  <h3 className="font-bold text-lg">Statut Backend</h3>
                  <p className="text-sm">{apiStatus.message}</p>
                  {apiStatus.data && (
                    <p className="text-xs mt-1 opacity-75">
                      Uptime: {Math.floor(apiStatus.data.uptime / 60)}min | 
                      Marchés: {apiStatus.data.marketsCount}
                    </p>
                  )}
                </div>
              </div>
              <button 
                onClick={checkApiStatus} 
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
              >
                Vérifier
              </button>
            </div>
          </div>

          {/* Setup Instructions (when backend not connected) */}
          {!apiStatus.connected && (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
              <h3 className="font-bold mb-2">⚠️ Backend non démarré</h3>
              <p className="text-sm mb-3">
                Pour activer la collecte automatique, suivez ces étapes :
              </p>
              <div className="bg-white rounded p-4 font-mono text-xs space-y-2">
                <div># 1. Ouvrir un nouveau terminal</div>
                <div className="text-blue-600">cd ~/PENDO/backend</div>
                <div className="mt-2"># 2. Démarrer le serveur</div>
                <div className="text-blue-600">node server.js</div>
              </div>
            </div>
          )}

          {/* API Configuration */}
          <div>
            <h3 className="font-bold mb-3">⚙️ Configuration API</h3>
            <div className="flex gap-3">
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                className="flex-1 px-4 py-2 border rounded"
                placeholder="API_URL"
              />
              <button 
                onClick={checkApiStatus} 
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Tester
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={refreshMarkets}
              disabled={loading || !apiStatus.connected}
              className="flex items-center space-x-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-400 font-semibold"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Collecte en cours...' : 'Collecter les données'}</span>
            </button>

            <button 
              onClick={exportData} 
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
            >
              <Download className="w-5 h-5" />
              <span>Exporter JSON</span>
            </button>

            <button 
              onClick={loadFallbackData} 
              className="flex items-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-semibold"
            >
              <Database className="w-5 h-5" />
              <span>Charger démo</span>
            </button>
          </div>

          {/* Current Data */}
          <div>
            <h3 className="font-bold mb-3">📊 Données des marchés</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
              {markets.map(m => (
                <div key={m.id} className="bg-gray-50 border rounded p-3 text-sm">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-bold">{m.name}</div>
                      <div className="text-xs text-gray-500">{m.country}</div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      m.source === 'Demo' 
                        ? 'bg-yellow-100 text-yellow-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {m.source || 'API'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-lg font-bold">{m.value}</div>
                    <div className={`font-semibold ${
                      m.positive ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {m.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Architecture Overview */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-lg p-4">
            <h3 className="font-bold mb-3">🏗️ Architecture PENDO</h3>
            <div className="grid md:grid-cols-3 gap-3 text-xs">
              <div className="bg-white bg-opacity-10 rounded p-3">
                <div className="font-bold text-blue-400 mb-1">Frontend (React)</div>
                <div className="space-y-1 opacity-90">
                  <div>✓ Interface utilisateur</div>
                  <div>✓ Affichage temps réel</div>
                  <div>✓ Export/Import</div>
                </div>
              </div>
              <div className="bg-white bg-opacity-10 rounded p-3">
                <div className="font-bold text-green-400 mb-1">Backend (Node.js)</div>
                <div className="space-y-1 opacity-90">
                  <div>→ Collecte automatique</div>
                  <div>→ Multi-sources (Yahoo, Investing)</div>
                  <div>→ API REST</div>
                </div>
              </div>
              <div className="bg-white bg-opacity-10 rounded p-3">
                <div className="font-bold text-purple-400 mb-1">Prochaine étape</div>
                <div className="space-y-1 opacity-90">
                  <div>→ Base de données</div>
                  <div>→ Historique</div>
                  <div>→ Monétisation</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

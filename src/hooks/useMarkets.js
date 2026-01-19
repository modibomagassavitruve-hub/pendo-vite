import { useState, useEffect, useRef } from 'react';
import { FALLBACK_MARKETS } from '../data/fallbackData';
import { API_URL } from '../config';

// API_URL déjà inclut /api, donc on l'utilise directement
const AUTO_REFRESH_INTERVAL = 30000; // 30 seconds

export const useMarkets = () => {
  const [markets, setMarkets] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState({ connected: false, message: '' });
  const [autoRefresh, setAutoRefresh] = useState(true);
  const intervalRef = useRef(null);

  const checkApiStatus = async () => {
    const maxRetries = 3;
    const timeout = 30000; // 30 secondes pour Render cold start

    console.log('🔍 PENDO API Check - Starting diagnostic...');
    console.log('  - API URL:', `${API_URL}/status`);
    console.log('  - Origin:', window.location.origin);
    console.log('  - Max retries:', maxRetries);
    console.log('  - Timeout:', timeout + 'ms');

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`\n🔄 Tentative ${attempt}/${maxRetries}...`);
        const startTime = Date.now();

        // Créer un AbortController pour le timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          console.warn(`⏱️ Timeout après ${timeout}ms`);
          controller.abort();
        }, timeout);

        const response = await fetch(`${API_URL}/status`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal
        });

        clearTimeout(timeoutId);
        const duration = Date.now() - startTime;

        console.log(`📡 Response reçue en ${duration}ms`);
        console.log('  - Status:', response.status);
        console.log('  - OK:', response.ok);
        console.log('  - CORS headers:', {
          'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
          'access-control-allow-credentials': response.headers.get('access-control-allow-credentials')
        });

        if (response.ok) {
          const result = await response.json();
          console.log('✅ Status data:', result);

          if (result.success) {
            setApiStatus({
              connected: true,
              message: 'Backend connecté',
              data: result.data,
              responseTime: duration
            });
            console.log('✅ Backend connecté avec succès!');
            console.log(`⚡ Temps de réponse: ${duration}ms`);
            return; // Succès, on sort
          } else {
            console.warn('⚠️ Backend retourné success=false');
            setApiStatus({ connected: false, message: 'Backend inaccessible' });
          }
        } else {
          console.warn('⚠️ Response not OK:', response.status);

          // Si c'est la dernière tentative
          if (attempt === maxRetries) {
            setApiStatus({ connected: false, message: `Erreur HTTP ${response.status}` });
          }
        }
      } catch (error) {
        const errorType = error.name;
        const errorMsg = error.message;

        console.error(`❌ Tentative ${attempt} échouée:`, {
          type: errorType,
          message: errorMsg,
          isAbort: errorType === 'AbortError',
          isNetwork: errorMsg.includes('fetch'),
          isCORS: errorMsg.includes('CORS') || errorMsg.includes('cors')
        });

        // Si c'est la dernière tentative
        if (attempt === maxRetries) {
          console.error('❌ Toutes les tentatives ont échoué');
          console.error('➡️ Activation du Mode Démo');

          let userMessage = 'Backend offline - Mode démo';
          if (errorType === 'AbortError') {
            userMessage = `Timeout après ${timeout}ms - Mode démo (Render en démarrage?)`;
          } else if (errorMsg.includes('CORS')) {
            userMessage = 'Erreur CORS - Mode démo';
          } else if (errorMsg.includes('fetch')) {
            userMessage = 'Erreur réseau - Mode démo';
          }

          setApiStatus({ connected: false, message: userMessage });
          console.log('📋 Loading fallback data...');
          loadFallbackData();
        } else {
          // Attendre avant de réessayer
          const waitTime = 2000 * attempt; // Backoff progressif: 2s, 4s, 6s
          console.log(`⏳ Attente de ${waitTime}ms avant nouvelle tentative...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
    }
  };

  const loadMarkets = async () => {
    try {
      console.log('Loading markets from:', `${API_URL}/markets`);
      const response = await fetch(`${API_URL}/markets`);
      console.log('Response status:', response.status);
      if (response.ok) {
        const result = await response.json();
        console.log('API Response:', result);
        // Backend returns {success: true, data: {markets: [...], lastUpdate: "..."}}
        if (result.success && result.data) {
          console.log('Setting markets:', result.data.markets);
          setMarkets(result.data.markets);
          setLastUpdate(new Date(result.data.lastUpdate));
          setApiStatus({ connected: true, message: 'Données chargées' });
        } else {
          console.log('Invalid API response format');
          loadFallbackData();
        }
      } else {
        console.log('Response not OK, loading fallback');
        loadFallbackData();
      }
    } catch (error) {
      console.error('Error loading markets:', error);
      loadFallbackData();
    }
  };

  const loadFallbackData = () => {
    setMarkets(FALLBACK_MARKETS);
    setLastUpdate(new Date());
  };

  const refreshMarkets = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        const result = await response.json();
        setMarkets(result.data.markets);
        setLastUpdate(new Date(result.data.lastUpdate));
        setApiStatus({ connected: true, message: 'Collecte réussie !' });
      } else {
        setApiStatus({ connected: false, message: 'Erreur de collecte' });
      }
    } catch (error) {
      setApiStatus({ connected: false, message: 'Backend inaccessible' });
      loadFallbackData();
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh effect
  useEffect(() => {
    if (autoRefresh && apiStatus.connected) {
      intervalRef.current = setInterval(() => {
        console.log('Auto-refreshing markets...');
        loadMarkets();
      }, AUTO_REFRESH_INTERVAL);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [autoRefresh, apiStatus.connected]);

  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
  };

  return {
    markets,
    lastUpdate,
    loading,
    apiStatus,
    checkApiStatus,
    loadMarkets,
    refreshMarkets,
    loadFallbackData,
    autoRefresh,
    toggleAutoRefresh
  };
};

/**
 * Outil de diagnostic API pour PENDO
 * Aide à identifier les problèmes de connexion backend
 */

import { API_URL } from '../config';

export const runApiDiagnostic = async () => {
  console.group('🔧 PENDO API Diagnostic');

  const results = {
    timestamp: new Date().toISOString(),
    config: {},
    tests: {}
  };

  // 1. Configuration
  console.log('📋 Configuration:');
  results.config = {
    apiUrl: API_URL,
    hostname: window.location.hostname,
    protocol: window.location.protocol,
    isDev: window.location.hostname === 'localhost'
  };
  console.table(results.config);

  // 2. Test de connectivité basique
  console.log('\n🌐 Test de connectivité:');
  try {
    const statusUrl = API_URL.replace('/api', '/api/status');
    console.log(`Tentative: ${statusUrl}`);

    const startTime = Date.now();
    const response = await fetch(statusUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const duration = Date.now() - startTime;

    results.tests.status = {
      url: statusUrl,
      status: response.status,
      ok: response.ok,
      duration: `${duration}ms`
    };

    if (response.ok) {
      const data = await response.json();
      results.tests.status.data = data;
      console.log('✅ Backend accessible!', data);
    } else {
      console.error('❌ Backend non accessible:', response.status);
    }
  } catch (error) {
    results.tests.status = {
      error: error.message,
      stack: error.stack
    };
    console.error('❌ Erreur de connexion:', error);
  }

  // 3. Test CORS
  console.log('\n🔐 Test CORS:');
  try {
    const marketsUrl = `${API_URL}/markets`;
    console.log(`Tentative: ${marketsUrl}`);

    const response = await fetch(marketsUrl);
    results.tests.cors = {
      url: marketsUrl,
      status: response.status,
      ok: response.ok,
      headers: {
        'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
        'access-control-allow-credentials': response.headers.get('access-control-allow-credentials')
      }
    };

    if (response.ok) {
      const data = await response.json();
      console.log('✅ CORS OK! Marchés récupérés:', data.data?.markets?.length || 0);
      results.tests.cors.marketsCount = data.data?.markets?.length || 0;
    } else {
      console.error('❌ CORS bloqué:', response.status);
    }
  } catch (error) {
    results.tests.cors = {
      error: error.message,
      isCorsError: error.message.includes('CORS') || error.message.includes('NetworkError')
    };
    console.error('❌ Erreur CORS:', error);
  }

  // 4. Résumé
  console.log('\n📊 Résumé:');
  const isHealthy = results.tests.status?.ok && results.tests.cors?.ok;
  console.log(isHealthy ? '✅ API fonctionnelle!' : '❌ Problèmes détectés');

  console.groupEnd();

  return results;
};

// Exécuter automatiquement en dev
if (process.env.NODE_ENV === 'development') {
  window.runApiDiagnostic = runApiDiagnostic;
  console.log('💡 Utilisez window.runApiDiagnostic() pour diagnostiquer l\'API');
}

export default { runApiDiagnostic };

/**
 * Configuration centralisée de PENDO
 * Utilise les variables d'environnement pour la configuration
 */

// Détecter si on est en développement local uniquement
const isDev = window.location.hostname === 'localhost' ||
              window.location.hostname.startsWith('192.168') ||
              window.location.hostname.startsWith('127.0.0.1');

// URL de l'API backend - TOUJOURS utiliser Render en production
const API_BASE_URL = isDev
  ? 'http://localhost:3001'
  : 'https://pendo-backend.onrender.com';

console.log('🔧 PENDO Config Debug:');
console.log('  - NODE_ENV:', process.env.NODE_ENV);
console.log('  - REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
console.log('  - isDev:', isDev);
console.log('  - API_BASE_URL:', API_BASE_URL);

export const API_URL = `${API_BASE_URL}/api`;
export const SOCKET_URL = API_BASE_URL;

// Configuration de l'application
export const APP_CONFIG = {
  name: process.env.REACT_APP_NAME || 'PENDO',
  version: process.env.REACT_APP_VERSION || '1.0.0',
  env: process.env.REACT_APP_ENV || (isDev ? 'development' : 'production'),
  enableAnalytics: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
  enablePWA: process.env.REACT_APP_ENABLE_PWA === 'true',
};

// Helper pour savoir si on est en production
export const isProduction = () => APP_CONFIG.env === 'production';
export const isDevelopment = () => isDev;

export default {
  API_URL,
  SOCKET_URL,
  ...APP_CONFIG,
};

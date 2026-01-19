/**
 * Configuration PENDO pour Vite
 * Utilise import.meta.env au lieu de process.env
 */

// Détecter si on est en développement
const isDev = import.meta.env.DEV;

// URL du backend - TOUJOURS Render en production
const API_BASE_URL = isDev
  ? 'http://localhost:3001'
  : 'https://pendo-backend.onrender.com';

console.log('🔧 PENDO Vite Config:');
console.log('  - Mode:', import.meta.env.MODE);
console.log('  - isDev:', isDev);
console.log('  - API_BASE_URL:', API_BASE_URL);

// Export de l'URL API complète (avec /api)
export const API_URL = `${API_BASE_URL}/api`;
export const SOCKET_URL = API_BASE_URL;

// Configuration de l'application
export const APP_CONFIG = {
  name: import.meta.env.VITE_APP_NAME || 'PENDO',
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  env: import.meta.env.VITE_APP_ENV || (isDev ? 'development' : 'production'),
  enableAnalytics: import.meta.env.VITE_APP_ENABLE_ANALYTICS === 'true',
  enablePWA: import.meta.env.VITE_APP_ENABLE_PWA === 'true',
};

// Helpers
export const isProduction = () => APP_CONFIG.env === 'production';
export const isDevelopment = () => isDev;

export default {
  API_URL,
  SOCKET_URL,
  ...APP_CONFIG,
};

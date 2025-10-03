// Environment configuration - SINGLE SOURCE OF TRUTH for API URL
// To change API URL: Update REACT_APP_API_BASE_URL in Vercel environment variables
const resolvedApiBaseUrl = 'https://9c544eaf310d.ngrok-free.app';

// Force cache refresh
console.log('🔄 Environment loaded at:', new Date().toISOString());
console.log('🌐 API Base URL:', resolvedApiBaseUrl);
console.log('🔧 Environment:', process.env.NODE_ENV);

export const config = {
  apiBaseUrl: 'https://9c544eaf310d.ngrok-free.app',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};

// Validate API URL format
if (!resolvedApiBaseUrl.startsWith('http')) {
  console.warn('⚠️ API Base URL should start with http:// or https://');
}

export default config;

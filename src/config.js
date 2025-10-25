// Google OAuth Client ID
// Get your Client ID from https://console.cloud.google.com/
export const GOOGLE_CLIENT_ID = '244981719047-6kfvoouada3ep8c880ub18jo9br66srs.apps.googleusercontent.com';

// Microsoft OAuth Configuration
// Get your credentials from https://portal.azure.com/
export const MICROSOFT_CONFIG = {
  clientId: 'YOUR_MICROSOFT_CLIENT_ID_HERE',
  redirectUri: window.location.origin + '/login',
  authority: 'https://login.microsoftonline.com/common',
};

// Apple OAuth Configuration
// Get your credentials from https://developer.apple.com/
export const APPLE_CONFIG = {
  clientId: 'YOUR_APPLE_CLIENT_ID_HERE',
  redirectUri: window.location.origin + '/login',
  scope: 'name email',
  usePopup: true,
};

// API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://value-aim-backend.onrender.com/api';

// App Configuration
export const APP_CONFIG = {
  name: 'Value Aim',
  version: '1.0.0',
  environment: import.meta.env.MODE || 'development'
};

import stripTrailingSlash from 'lib/stripTrailingSlash';

import { getEnvValue } from './utils';
const authUrl = getEnvValue('NEXT_PUBLIC_AUTH_URL');
const apiHost = getEnvValue('NEXT_PUBLIC_API_HOST');
const apiSchema = getEnvValue('NEXT_PUBLIC_API_PROTOCOL') || 'https';
const apiPort = getEnvValue('NEXT_PUBLIC_API_PORT');
const apiEndpoint = [
  apiSchema || 'https',
  '://',
  apiHost,
  apiPort && ':' + apiPort,
].filter(Boolean).join('');

const socketSchema = getEnvValue('NEXT_PUBLIC_API_WEBSOCKET_PROTOCOL') || 'wss';
const socketEndpoint = [
  socketSchema,
  '://',
  apiHost,
  apiPort && ':' + apiPort,
].filter(Boolean).join('');

const api = Object.freeze({
  authUrl: authUrl,
  host: apiHost,
  protocol: apiSchema,
  port: apiPort,
  endpoint: apiEndpoint,
  socket: socketEndpoint,
  basePath: stripTrailingSlash(getEnvValue('NEXT_PUBLIC_API_BASE_PATH') || ''),
});

export default api;

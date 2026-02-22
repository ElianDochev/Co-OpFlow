import api from './api';
import mockApi from './mockApi';

// Use mock API in development, real API in production
const isDevelopment = process.env.NODE_ENV === 'development';
const useMockApi = process.env.REACT_APP_USE_MOCK_API === 'true' || isDevelopment;

// Export the appropriate API service
export default useMockApi ? mockApi : api;

// Also export individual services for convenience
export { default as api } from './api';
export { default as mockApi } from './mockApi';
export * from './mockData';
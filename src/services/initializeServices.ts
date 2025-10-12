// src/services/initializeServices.ts
import { apiClient } from './api/api.client';
import { requestQueue } from './api/RequestQueue';

/**
 * Initialize all services and set up dependencies
 * Call this once in your App.tsx
 */
export const initializeServices = () => {
  // Connect RequestQueue with ApiClient
  requestQueue.setApiClient(apiClient);
  
  console.log('✅ Services initialized successfully');
};

export default initializeServices;
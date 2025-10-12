// src/services/api/RequestQueue.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { networkMonitor } from '../network/NetworkMonitor';

interface QueuedRequest {
  id: string;
  endpoint: string;
  method: string;
  data?: any;
  timestamp: number;
  retryCount: number;
}

class RequestQueue {
  private static instance: RequestQueue;
  private queue: QueuedRequest[] = [];
  private isProcessing = false;
  private readonly QUEUE_KEY = 'api_request_queue';
  private readonly MAX_RETRIES = 3;
  // Store reference to avoid circular dependency
  private apiClientRef: any = null;

  private constructor() {
    this.loadQueue();
    this.setupNetworkListener();
  }

  static getInstance(): RequestQueue {
    if (!RequestQueue.instance) {
      RequestQueue.instance = new RequestQueue();
    }
    return RequestQueue.instance;
  }

  // NEW: Set API client reference after initialization
  setApiClient(apiClient: any) {
    this.apiClientRef = apiClient;
  }

  private async loadQueue() {
    try {
      const stored = await AsyncStorage.getItem(this.QUEUE_KEY);
      if (stored) {
        this.queue = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load request queue:', error);
    }
  }

  private async saveQueue() {
    try {
      await AsyncStorage.setItem(this.QUEUE_KEY, JSON.stringify(this.queue));
    } catch (error) {
      console.error('Failed to save request queue:', error);
    }
  }

  private setupNetworkListener() {
    networkMonitor.onStatusChange((status) => {
      if (status.isConnected && status.isInternetReachable) {
        this.processQueue();
      }
    });
  }

  async addRequest(
    endpoint: string,
    method: string,
    data?: any
  ): Promise<void> {
    const request: QueuedRequest = {
      id: `${Date.now()}_${Math.random()}`,
      endpoint,
      method,
      data,
      timestamp: Date.now(),
      retryCount: 0,
    };

    this.queue.push(request);
    await this.saveQueue();

    if (networkMonitor.isOnline()) {
      this.processQueue();
    }
  }

  private async processQueue() {
    // Check if apiClient is set
    if (this.isProcessing || this.queue.length === 0 || !this.apiClientRef) {
      return;
    }

    this.isProcessing = true;

    while (this.queue.length > 0) {
      const request = this.queue[0];

      try {
        await this.executeRequest(request);
        this.queue.shift();
      } catch (error) {
        request.retryCount++;

        if (request.retryCount >= this.MAX_RETRIES) {
          console.error('Request failed after max retries:', request);
          this.queue.shift();
        } else {
          break;
        }
      }

      await this.saveQueue();
    }

    this.isProcessing = false;
  }

  private async executeRequest(request: QueuedRequest): Promise<void> {
    // Use the injected reference instead of dynamic import
    if (!this.apiClientRef) {
      throw new Error('API client not initialized');
    }

    switch (request.method.toUpperCase()) {
      case 'POST':
        await this.apiClientRef.post(request.endpoint, request.data);
        break;
      case 'PUT':
        await this.apiClientRef.put(request.endpoint, request.data);
        break;
      case 'PATCH':
        await this.apiClientRef.patch(request.endpoint, request.data);
        break;
      case 'DELETE':
        await this.apiClientRef.delete(request.endpoint);
        break;
      default:
        throw new Error(`Unsupported method: ${request.method}`);
    }
  }

  getQueueSize(): number {
    return this.queue.length;
  }

  async clearQueue(): Promise<void> {
    this.queue = [];
    await this.saveQueue();
  }
}

export const requestQueue = RequestQueue.getInstance();
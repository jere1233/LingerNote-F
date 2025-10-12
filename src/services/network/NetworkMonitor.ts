// src/services/network/NetworkMonitor.ts
import NetInfo from '@react-native-community/netinfo';
import { EventEmitter } from 'events';

export type NetworkStatus = {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  type: string;
};

class NetworkMonitor extends EventEmitter {
  private static instance: NetworkMonitor;
  private currentStatus: NetworkStatus = {
    isConnected: true,
    isInternetReachable: null,
    type: 'unknown',
  };

  private constructor() {
    super();
    this.initialize();
  }

  static getInstance(): NetworkMonitor {
    if (!NetworkMonitor.instance) {
      NetworkMonitor.instance = new NetworkMonitor();
    }
    return NetworkMonitor.instance;
  }

  private initialize() {
    NetInfo.addEventListener((state) => {
      const newStatus: NetworkStatus = {
        isConnected: state.isConnected ?? false,
        isInternetReachable: state.isInternetReachable,
        type: state.type,
      };

      const statusChanged =
        this.currentStatus.isConnected !== newStatus.isConnected ||
        this.currentStatus.isInternetReachable !== newStatus.isInternetReachable;

      this.currentStatus = newStatus;

      if (statusChanged) {
        this.emit('statusChange', newStatus);
      }
    });
  }

  getStatus(): NetworkStatus {
    return this.currentStatus;
  }

  async checkConnection(): Promise<NetworkStatus> {
    const state = await NetInfo.fetch();
    return {
      isConnected: state.isConnected ?? false,
      isInternetReachable: state.isInternetReachable,
      type: state.type,
    };
  }

  isOnline(): boolean {
    return this.currentStatus.isConnected;
  }

  onStatusChange(callback: (status: NetworkStatus) => void) {
    this.on('statusChange', callback);
    return () => this.off('statusChange', callback);
  }
}

export const networkMonitor = NetworkMonitor.getInstance();
import type { WebSocketMessage, Message, TypingIndicator } from '../types';

export type ConnectionState = 'connecting' | 'connected' | 'disconnected' | 'error';

export type MessageHandler = (message: Message) => void;
export type TypingHandler = (indicator: TypingIndicator) => void;
export type OnlineStatusHandler = (userId: string, isOnline: boolean) => void;
export type ConnectionStateHandler = (state: ConnectionState) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectDelay = 1000; // Start with 1 second
  private reconnectTimer: NodeJS.Timeout | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private isManualClose = false;

  private messageHandlers: Set<MessageHandler> = new Set();
  private typingHandlers: Set<TypingHandler> = new Set();
  private onlineStatusHandlers: Set<OnlineStatusHandler> = new Set();
  private connectionStateHandlers: Set<ConnectionStateHandler> = new Set();

  private connectionState: ConnectionState = 'disconnected';

  constructor(url: string) {
    this.url = url;
  }

  /**
   * Connect to WebSocket server
   */
  connect(userId: string, token?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      this.isManualClose = false;
      this.setConnectionState('connecting');

      try {
        // Add authentication to URL if token provided
        const wsUrl = token ? `${this.url}?userId=${userId}&token=${token}` : `${this.url}?userId=${userId}`;
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          this.reconnectAttempts = 0;
          this.reconnectDelay = 1000;
          this.setConnectionState('connected');
          this.startHeartbeat();
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const data: WebSocketMessage = JSON.parse(event.data);
            this.handleMessage(data);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.setConnectionState('error');
          reject(error);
        };

        this.ws.onclose = () => {
          this.stopHeartbeat();
          this.setConnectionState('disconnected');

          // Attempt to reconnect if not manually closed
          if (!this.isManualClose && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.scheduleReconnect(userId, token);
          }
        };
      } catch (error) {
        this.setConnectionState('error');
        reject(error);
      }
    });
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    this.isManualClose = true;
    this.stopHeartbeat();
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.setConnectionState('disconnected');
  }

  /**
   * Send a message through WebSocket
   */
  sendMessage(chatId: string, content: string, type: string = 'text'): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage = {
        type: 'message',
        payload: {
          chatId,
          content,
          type,
        },
        timestamp: new Date().toISOString(),
        chatId,
      };
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected. Message not sent.');
    }
  }

  /**
   * Send typing indicator
   */
  sendTyping(chatId: string, isTyping: boolean): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage = {
        type: 'typing',
        payload: {
          chatId,
          isTyping,
        },
        timestamp: new Date().toISOString(),
        chatId,
      };
      this.ws.send(JSON.stringify(message));
    }
  }

  /**
   * Send read receipt
   */
  sendReadReceipt(chatId: string, messageIds: string[]): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage = {
        type: 'read',
        payload: {
          chatId,
          messageIds,
        },
        timestamp: new Date().toISOString(),
        chatId,
      };
      this.ws.send(JSON.stringify(message));
    }
  }

  /**
   * Subscribe to message events
   */
  onMessage(handler: MessageHandler): () => void {
    this.messageHandlers.add(handler);
    return () => {
      this.messageHandlers.delete(handler);
    };
  }

  /**
   * Subscribe to typing indicator events
   */
  onTyping(handler: TypingHandler): () => void {
    this.typingHandlers.add(handler);
    return () => {
      this.typingHandlers.delete(handler);
    };
  }

  /**
   * Subscribe to online status events
   */
  onOnlineStatus(handler: OnlineStatusHandler): () => void {
    this.onlineStatusHandlers.add(handler);
    return () => {
      this.onlineStatusHandlers.delete(handler);
    };
  }

  /**
   * Subscribe to connection state changes
   */
  onConnectionStateChange(handler: ConnectionStateHandler): () => void {
    this.connectionStateHandlers.add(handler);
    // Immediately call with current state
    handler(this.connectionState);
    return () => {
      this.connectionStateHandlers.delete(handler);
    };
  }

  /**
   * Get current connection state
   */
  getConnectionState(): ConnectionState {
    return this.connectionState;
  }

  /**
   * Check if WebSocket is connected
   */
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  /**
   * Handle incoming WebSocket messages
   */
  private handleMessage(data: WebSocketMessage): void {
    switch (data.type) {
      case 'message':
        if (data.payload) {
          this.messageHandlers.forEach((handler) => handler(data.payload as Message));
        }
        break;

      case 'typing':
        if (data.payload) {
          this.typingHandlers.forEach((handler) => handler(data.payload as TypingIndicator));
        }
        break;

      case 'online':
        if (data.userId) {
          this.onlineStatusHandlers.forEach((handler) => handler(data.userId!, true));
        }
        break;

      case 'offline':
        if (data.userId) {
          this.onlineStatusHandlers.forEach((handler) => handler(data.userId!, false));
        }
        break;

      case 'connected':
        this.setConnectionState('connected');
        break;

      case 'error':
        console.error('WebSocket error message:', data.payload);
        this.setConnectionState('error');
        break;

      default:
        console.warn('Unknown WebSocket message type:', data.type);
    }
  }

  /**
   * Schedule reconnection with exponential backoff
   */
  private scheduleReconnect(userId: string, token?: string): void {
    this.reconnectAttempts++;
    const delay = Math.min(this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1), 30000); // Max 30 seconds

    this.reconnectTimer = setTimeout(() => {
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      this.connect(userId, token).catch(() => {
        // Reconnection failed, will try again
      });
    }, delay);
  }

  /**
   * Start heartbeat to keep connection alive
   */
  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping', timestamp: new Date().toISOString() }));
      }
    }, 30000); // Send ping every 30 seconds
  }

  /**
   * Stop heartbeat
   */
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * Update connection state and notify handlers
   */
  private setConnectionState(state: ConnectionState): void {
    if (this.connectionState !== state) {
      this.connectionState = state;
      this.connectionStateHandlers.forEach((handler) => handler(state));
    }
  }
}

// Create singleton instance
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3001/ws';
export const websocketService = new WebSocketService(WS_URL);


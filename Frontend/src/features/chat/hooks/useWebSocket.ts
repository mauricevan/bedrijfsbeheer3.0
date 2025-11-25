import React, { useEffect, useRef, useCallback } from 'react';
import { websocketService, type ConnectionState } from '../services/websocketService';
import type { Message, TypingIndicator } from '../types';

interface UseWebSocketOptions {
  userId: string;
  token?: string;
  enabled?: boolean;
  onMessage?: (message: Message) => void;
  onTyping?: (indicator: TypingIndicator) => void;
  onOnlineStatus?: (userId: string, isOnline: boolean) => void;
}

interface UseWebSocketReturn {
  connectionState: ConnectionState;
  isConnected: boolean;
  sendMessage: (chatId: string, content: string, type?: string) => void;
  sendTyping: (chatId: string, isTyping: boolean) => void;
  sendReadReceipt: (chatId: string, messageIds: string[]) => void;
  reconnect: () => Promise<void>;
}

export const useWebSocket = (options: UseWebSocketOptions): UseWebSocketReturn => {
  const {
    userId,
    token,
    enabled = true,
    onMessage,
    onTyping,
    onOnlineStatus,
  } = options;

  const [connectionState, setConnectionState] = React.useState<ConnectionState>(
    websocketService.getConnectionState()
  );
  const onMessageRef = useRef(onMessage);
  const onTypingRef = useRef(onTyping);
  const onOnlineStatusRef = useRef(onOnlineStatus);

  // Keep refs updated
  useEffect(() => {
    onMessageRef.current = onMessage;
    onTypingRef.current = onTyping;
    onOnlineStatusRef.current = onOnlineStatus;
  }, [onMessage, onTyping, onOnlineStatus]);

  // Connect on mount
  useEffect(() => {
    if (!enabled || !userId) {
      return;
    }

    let messageUnsubscribe: (() => void) | undefined;
    let typingUnsubscribe: (() => void) | undefined;
    let onlineStatusUnsubscribe: (() => void) | undefined;
    let connectionStateUnsubscribe: (() => void) | undefined;

    const connect = async () => {
      try {
        await websocketService.connect(userId, token);

        // Subscribe to events
        messageUnsubscribe = websocketService.onMessage((message) => {
          onMessageRef.current?.(message);
        });

        typingUnsubscribe = websocketService.onTyping((indicator) => {
          onTypingRef.current?.(indicator);
        });

        onlineStatusUnsubscribe = websocketService.onOnlineStatus((userId, isOnline) => {
          onOnlineStatusRef.current?.(userId, isOnline);
        });

        connectionStateUnsubscribe = websocketService.onConnectionStateChange((state) => {
          setConnectionState(state);
        });
      } catch (error) {
        console.error('Failed to connect WebSocket:', error);
      }
    };

    connect();

    // Cleanup on unmount
    return () => {
      messageUnsubscribe?.();
      typingUnsubscribe?.();
      onlineStatusUnsubscribe?.();
      connectionStateUnsubscribe?.();
      websocketService.disconnect();
    };
  }, [enabled, userId, token]);

  const sendMessage = useCallback((chatId: string, content: string, type = 'text') => {
    websocketService.sendMessage(chatId, content, type);
  }, []);

  const sendTyping = useCallback((chatId: string, isTyping: boolean) => {
    websocketService.sendTyping(chatId, isTyping);
  }, []);

  const sendReadReceipt = useCallback((chatId: string, messageIds: string[]) => {
    websocketService.sendReadReceipt(chatId, messageIds);
  }, []);

  const reconnect = useCallback(async () => {
    websocketService.disconnect();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await websocketService.connect(userId, token);
  }, [userId, token]);

  return {
    connectionState,
    isConnected: websocketService.isConnected(),
    sendMessage,
    sendTyping,
    sendReadReceipt,
    reconnect,
  };
};


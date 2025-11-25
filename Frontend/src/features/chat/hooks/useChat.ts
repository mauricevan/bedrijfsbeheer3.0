import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useWebSocket } from './useWebSocket';
import {
  getChats,
  getChatMessages,
  getAvailableUsers,
  createChat,
  sendMessage as sendMessageAPI,
  markChatAsRead,
} from '../services/chatService';
import type {
  Chat,
  Message,
  ChatParticipant,
  CreateChatInput,
  SendMessageInput,
  TypingIndicator,
} from '../types';

interface UseChatOptions {
  enabled?: boolean;
}

interface UseChatReturn {
  // Chats
  chats: Chat[];
  currentChat: Chat | null;
  setCurrentChat: (chat: Chat | null) => void;
  isLoadingChats: boolean;

  // Messages
  messages: Map<string, Message[]>; // Map of chatId -> messages
  isLoadingMessages: boolean;
  loadMoreMessages: (chatId: string) => Promise<void>;

  // Users
  availableUsers: ChatParticipant[];
  isLoadingUsers: boolean;

  // Actions
  createNewChat: (input: CreateChatInput) => Promise<Chat>;
  sendMessage: (input: SendMessageInput) => Promise<void>;
  markAsRead: (chatId: string) => Promise<void>;
  refreshChats: () => Promise<void>;

  // Typing indicators
  typingIndicators: Map<string, TypingIndicator>; // Map of chatId -> typing indicator

  // WebSocket
  isConnected: boolean;
  connectionState: string;
}

export const useChat = (options: UseChatOptions = {}): UseChatReturn => {
  const { enabled = true } = options;
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Map<string, Message[]>>(new Map());
  const [availableUsers, setAvailableUsers] = useState<ChatParticipant[]>([]);
  const [isLoadingChats, setIsLoadingChats] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [typingIndicators, setTypingIndicators] = useState<Map<string, TypingIndicator>>(new Map());
  const [messageOffsets, setMessageOffsets] = useState<Map<string, number>>(new Map());
  const typingTimeoutRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // WebSocket integration
  const handleMessage = useCallback(
    (message: Message) => {
      setMessages((prev) => {
        const chatMessages = prev.get(message.chatId) || [];
        // Avoid duplicates
        if (chatMessages.some((m) => m.id === message.id)) {
          return prev;
        }
        const updated = new Map(prev);
        updated.set(message.chatId, [...chatMessages, message]);
        return updated;
      });

      // Update chat's last message
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === message.chatId
            ? {
                ...chat,
                lastMessage: message,
                unreadCount: chat.id === currentChat?.id ? 0 : chat.unreadCount + 1,
                updatedAt: message.timestamp,
              }
            : chat
        )
      );

      // Auto-mark as read if current chat
      if (currentChat?.id === message.chatId) {
        markChatAsRead(message.chatId).catch(console.error);
      }
    },
    [currentChat]
  );

  const handleTyping = useCallback((indicator: TypingIndicator) => {
    setTypingIndicators((prev) => {
      const updated = new Map(prev);
      if (indicator.isTyping) {
        updated.set(indicator.chatId, indicator);
      } else {
        updated.delete(indicator.chatId);
      }
      return updated;
    });

    // Auto-clear typing indicator after 3 seconds
    if (indicator.isTyping) {
      const timeoutId = setTimeout(() => {
        setTypingIndicators((prev) => {
          const updated = new Map(prev);
          updated.delete(indicator.chatId);
          return updated;
        });
      }, 3000);

      // Clear existing timeout for this chat
      const existingTimeout = typingTimeoutRef.current.get(indicator.chatId);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }
      typingTimeoutRef.current.set(indicator.chatId, timeoutId);
    }
  }, []);

  const handleOnlineStatus = useCallback((userId: string, isOnline: boolean) => {
    setChats((prev) =>
      prev.map((chat) => ({
        ...chat,
        participants: chat.participants.map((p) =>
          p.userId === userId ? { ...p, onlineStatus: isOnline ? 'online' : 'offline' } : p
        ),
      }))
    );

    setAvailableUsers((prev) =>
      prev.map((user) =>
        user.userId === userId ? { ...user, onlineStatus: isOnline ? 'online' : 'offline' } : user
      )
    );
  }, []);

  const { isConnected, connectionState, sendMessage: sendWSMessage, sendTyping } = useWebSocket({
    userId: user?.id || '',
    enabled: enabled && !!user,
    onMessage: handleMessage,
    onTyping: handleTyping,
    onOnlineStatus: handleOnlineStatus,
  });

  // Load chats on mount
  useEffect(() => {
    if (!enabled || !user) return;

    const loadChats = async () => {
      setIsLoadingChats(true);
      try {
        const chatsData = await getChats();
        setChats(chatsData);
      } catch (error) {
        console.error('Failed to load chats:', error);
      } finally {
        setIsLoadingChats(false);
      }
    };

    loadChats();
  }, [enabled, user]);

  // Load available users
  useEffect(() => {
    if (!enabled || !user) return;

    const loadUsers = async () => {
      setIsLoadingUsers(true);
      try {
        const users = await getAvailableUsers();
        // Filter out current user
        setAvailableUsers(users.filter((u) => u.userId !== user.id));
      } catch (error) {
        console.error('Failed to load users:', error);
      } finally {
        setIsLoadingUsers(false);
      }
    };

    loadUsers();
  }, [enabled, user]);

  // Load messages when chat is selected
  useEffect(() => {
    if (!currentChat) return;

    const loadMessages = async () => {
      setIsLoadingMessages(true);
      try {
        const chatMessages = await getChatMessages(currentChat.id);
        setMessages((prev) => {
          const updated = new Map(prev);
          updated.set(currentChat.id, chatMessages);
          return updated;
        });
        setMessageOffsets((prev) => {
          const updated = new Map(prev);
          updated.set(currentChat.id, chatMessages.length);
          return updated;
        });

        // Mark as read
        await markChatAsRead(currentChat.id);
        setChats((prev) =>
          prev.map((chat) =>
            chat.id === currentChat.id ? { ...chat, unreadCount: 0 } : chat
          )
        );
      } catch (error) {
        console.error('Failed to load messages:', error);
      } finally {
        setIsLoadingMessages(false);
      }
    };

    loadMessages();
  }, [currentChat?.id]);

  const loadMoreMessages = useCallback(async (chatId: string) => {
    const offset = messageOffsets.get(chatId) || 0;
    try {
      const newMessages = await getChatMessages(chatId, 50, offset);
      if (newMessages.length > 0) {
        setMessages((prev) => {
          const updated = new Map(prev);
          const existing = updated.get(chatId) || [];
          updated.set(chatId, [...newMessages, ...existing]);
          return updated;
        });
        setMessageOffsets((prev) => {
          const updated = new Map(prev);
          updated.set(chatId, offset + newMessages.length);
          return updated;
        });
      }
    } catch (error) {
      console.error('Failed to load more messages:', error);
    }
  }, [messageOffsets]);

  const createNewChat = useCallback(
    async (input: CreateChatInput): Promise<Chat> => {
      const newChat = await createChat(input);
      setChats((prev) => [newChat, ...prev]);
      setCurrentChat(newChat);
      return newChat;
    },
    []
  );

  const sendMessage = useCallback(
    async (input: SendMessageInput) => {
      if (!currentChat) return;

      // Optimistic update
      const optimisticMessage: Message = {
        id: `temp-${Date.now()}`,
        chatId: input.chatId,
        senderId: user?.id || '',
        senderName: user?.name || '',
        content: input.content,
        timestamp: new Date().toISOString(),
        type: input.type || 'text',
        readBy: [],
      };

      setMessages((prev) => {
        const updated = new Map(prev);
        const chatMessages = updated.get(input.chatId) || [];
        updated.set(input.chatId, [...chatMessages, optimisticMessage]);
        return updated;
      });

      try {
        // Try WebSocket first
        if (isConnected) {
          sendWSMessage(input.chatId, input.content, input.type);
        } else {
          // Fallback to REST API
          const sentMessage = await sendMessageAPI(input);
          // Replace optimistic message with real one
          setMessages((prev) => {
            const updated = new Map(prev);
            const chatMessages = updated.get(input.chatId) || [];
            const filtered = chatMessages.filter((m) => m.id !== optimisticMessage.id);
            updated.set(input.chatId, [...filtered, sentMessage]);
            return updated;
          });
        }
      } catch (error) {
        console.error('Failed to send message:', error);
        // Remove optimistic message on error
        setMessages((prev) => {
          const updated = new Map(prev);
          const chatMessages = updated.get(input.chatId) || [];
          updated.set(input.chatId, chatMessages.filter((m) => m.id !== optimisticMessage.id));
          return updated;
        });
        throw error;
      }
    },
    [currentChat, user, isConnected, sendWSMessage]
  );

  const markAsRead = useCallback(async (chatId: string) => {
    await markChatAsRead(chatId);
    setChats((prev) =>
      prev.map((chat) => (chat.id === chatId ? { ...chat, unreadCount: 0 } : chat))
    );
  }, []);

  const refreshChats = useCallback(async () => {
    setIsLoadingChats(true);
    try {
      const chatsData = await getChats();
      setChats(chatsData);
    } catch (error) {
      console.error('Failed to refresh chats:', error);
    } finally {
      setIsLoadingChats(false);
    }
  }, []);

  return {
    chats,
    currentChat,
    setCurrentChat,
    isLoadingChats,
    messages,
    isLoadingMessages,
    loadMoreMessages,
    availableUsers,
    isLoadingUsers,
    createNewChat,
    sendMessage,
    markAsRead,
    refreshChats,
    typingIndicators,
    isConnected,
    connectionState,
  };
};


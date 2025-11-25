import type {
  Chat,
  Message,
  ChatParticipant,
  CreateChatInput,
  SendMessageInput,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Helper to get current user ID from localStorage
const getCurrentUserId = (): string | null => {
  try {
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      return user.id || null;
    }
  } catch {
    // Ignore errors
  }
  return null;
};

/**
 * Fetch all chats for the current user
 */
export const getChats = async (): Promise<Chat[]> => {
  try {
    const userId = getCurrentUserId();
    const url = userId
      ? `${API_BASE_URL}/api/chat/chats?userId=${userId}`
      : `${API_BASE_URL}/api/chat/chats`;
    const response = await fetch(url, {
      credentials: 'include',
      headers: userId ? { 'x-user-id': userId } : {},
    });

    if (!response.ok) {
      throw new Error('Failed to fetch chats');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching chats:', error);
    // Return empty array as fallback
    return [];
  }
};

/**
 * Fetch messages for a specific chat
 */
export const getChatMessages = async (chatId: string, limit = 50, offset = 0): Promise<Message[]> => {
  try {
    const userId = getCurrentUserId();
    const url = userId
      ? `${API_BASE_URL}/api/chat/chats/${chatId}/messages?limit=${limit}&offset=${offset}&userId=${userId}`
      : `${API_BASE_URL}/api/chat/chats/${chatId}/messages?limit=${limit}&offset=${offset}`;
    const response = await fetch(url, {
      credentials: 'include',
      headers: userId ? { 'x-user-id': userId } : {},
    });

    if (!response.ok) {
      throw new Error('Failed to fetch messages');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
};

/**
 * Fetch available users for starting a new chat
 */
export const getAvailableUsers = async (): Promise<ChatParticipant[]> => {
  try {
    const userId = getCurrentUserId();
    const url = userId
      ? `${API_BASE_URL}/api/chat/users?userId=${userId}`
      : `${API_BASE_URL}/api/chat/users`;
    const response = await fetch(url, {
      credentials: 'include',
      headers: userId ? { 'x-user-id': userId } : {},
    });

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

/**
 * Create a new chat (private or group)
 */
export const createChat = async (input: CreateChatInput): Promise<Chat> => {
  try {
    const userId = getCurrentUserId();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (userId) {
      headers['x-user-id'] = userId;
    }
    const url = userId
      ? `${API_BASE_URL}/api/chat/chats?userId=${userId}`
      : `${API_BASE_URL}/api/chat/chats`;
    const response = await fetch(url, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      throw new Error('Failed to create chat');
    }

    return response.json();
  } catch (error) {
    console.error('Error creating chat:', error);
    throw error;
  }
};

/**
 * Send a message via REST API (fallback when WebSocket is unavailable)
 */
export const sendMessage = async (input: SendMessageInput): Promise<Message> => {
  try {
    const userId = getCurrentUserId();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (userId) {
      headers['x-user-id'] = userId;
    }
    const url = userId
      ? `${API_BASE_URL}/api/chat/chats/${input.chatId}/messages?userId=${userId}`
      : `${API_BASE_URL}/api/chat/chats/${input.chatId}/messages`;
    const response = await fetch(url, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify({
        content: input.content,
        type: input.type || 'text',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    return response.json();
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

/**
 * Mark messages in a chat as read
 */
export const markChatAsRead = async (chatId: string): Promise<void> => {
  try {
    const userId = getCurrentUserId();
    const url = userId
      ? `${API_BASE_URL}/api/chat/chats/${chatId}/read?userId=${userId}`
      : `${API_BASE_URL}/api/chat/chats/${chatId}/read`;
    const response = await fetch(url, {
      method: 'PUT',
      credentials: 'include',
      headers: userId ? { 'x-user-id': userId } : {},
    });

    if (!response.ok) {
      throw new Error('Failed to mark chat as read');
    }
  } catch (error) {
    console.error('Error marking chat as read:', error);
  }
};


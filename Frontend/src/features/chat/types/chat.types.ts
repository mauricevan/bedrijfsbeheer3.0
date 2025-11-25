export type ChatType = 'private' | 'group';

export type MessageType = 'text' | 'image' | 'file';

export type OnlineStatus = 'online' | 'offline' | 'away';

export interface ChatParticipant {
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'employee';
  onlineStatus: OnlineStatus;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  type: MessageType;
  readBy: string[]; // Array of user IDs who have read this message
  editedAt?: string;
  deletedAt?: string;
}

export interface Chat {
  id: string;
  type: ChatType;
  name: string; // For group chats, this is the group name. For private chats, it's the other participant's name
  participants: ChatParticipant[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
  avatar?: string; // Group chat avatar or other participant's avatar
}

export interface WebSocketMessage {
  type: 'message' | 'typing' | 'read' | 'online' | 'offline' | 'error' | 'connected';
  payload: any;
  timestamp: string;
  chatId?: string;
  userId?: string;
}

export interface TypingIndicator {
  chatId: string;
  userId: string;
  userName: string;
  isTyping: boolean;
}

export interface CreateChatInput {
  type: ChatType;
  participantIds: string[];
  name?: string; // Required for group chats
}

export interface SendMessageInput {
  chatId: string;
  content: string;
  type?: MessageType;
}


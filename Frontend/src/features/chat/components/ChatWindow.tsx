import React from 'react';
import { X, Users, MoreVertical } from 'lucide-react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { Button } from '@/components/common/Button';
import { cn } from '@/utils/cn';
import type { Chat, Message, TypingIndicator } from '../types';

interface ChatWindowProps {
  chat: Chat | null;
  messages: Message[];
  typingIndicator?: TypingIndicator;
  onClose?: () => void;
  onSendMessage: (content: string) => void;
  onTyping?: (isTyping: boolean) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  disabled?: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  chat,
  messages,
  typingIndicator,
  onClose,
  onSendMessage,
  onTyping,
  onLoadMore,
  hasMore = false,
  disabled = false,
}) => {
  if (!chat) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-slate-500 dark:text-slate-400 p-8">
        <div className="text-center">
          <Users className="h-12 w-12 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
          <p className="text-sm">Selecteer een chat om te beginnen</p>
        </div>
      </div>
    );
  }

  const typingUserName = typingIndicator?.isTyping
    ? chat.participants.find((p) => p.userId === typingIndicator.userId)?.name
    : undefined;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 px-4 py-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {chat.type === 'group' ? (
              <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium">
                <Users className="h-5 w-5" />
              </div>
            ) : (
              <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium">
                {chat.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Chat info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
              {chat.name}
            </h3>
            {chat.type === 'group' && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {chat.participants.length} deelnemers
              </p>
            )}
            {chat.type === 'private' && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {chat.participants.find((p) => p.onlineStatus === 'online')
                  ? 'Online'
                  : 'Offline'}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
          {onClose && (
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      <MessageList
        messages={messages}
        typingIndicator={
          typingUserName
            ? {
                userName: typingUserName,
                isTyping: true,
              }
            : undefined
        }
        onLoadMore={onLoadMore}
        hasMore={hasMore}
      />

      {/* Input */}
      <MessageInput
        onSend={onSendMessage}
        onTyping={onTyping}
        disabled={disabled}
        placeholder={`Bericht naar ${chat.name}...`}
      />
    </div>
  );
};


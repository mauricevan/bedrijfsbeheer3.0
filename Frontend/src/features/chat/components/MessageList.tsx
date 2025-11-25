import React, { useEffect, useRef } from 'react';
import { formatMessageTimestamp, shouldShowTimestamp, shouldShowSender } from '../utils/messageUtils';
import type { Message } from '../types';
import { cn } from '@/utils/cn';
import { useAuth } from '@/features/auth/hooks/useAuth';

interface MessageListProps {
  messages: Message[];
  typingIndicator?: {
    userName: string;
    isTyping: boolean;
  };
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  typingIndicator,
  onLoadMore,
  hasMore = false,
}) => {
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const prevMessagesLengthRef = useRef(messages.length);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > prevMessagesLengthRef.current) {
      // New message added
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    prevMessagesLengthRef.current = messages.length;
  }, [messages.length]);

  // Scroll to bottom on mount
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  }, []);

  const handleScroll = () => {
    if (!listRef.current || !onLoadMore || !hasMore) return;

    const { scrollTop } = listRef.current;
    if (scrollTop === 0) {
      onLoadMore();
    }
  };

  return (
    <div
      ref={listRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
    >
      {hasMore && (
        <div className="flex justify-center">
          <button
            onClick={onLoadMore}
            className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            Laad meer berichten...
          </button>
        </div>
      )}

      {messages.map((message, index) => {
        const isOwnMessage = message.senderId === user?.id;
        const previousMessage = index > 0 ? messages[index - 1] : undefined;
        const showTimestamp = shouldShowTimestamp(message, previousMessage);
        const showSender = shouldShowSender(message, previousMessage);

        return (
          <div
            key={message.id}
            className={cn(
              'flex gap-3',
              isOwnMessage ? 'flex-row-reverse' : 'flex-row'
            )}
          >
            {/* Avatar */}
            {showSender && !isOwnMessage && (
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-medium">
                  {message.senderName.charAt(0).toUpperCase()}
                </div>
              </div>
            )}
            {showSender && isOwnMessage && <div className="flex-shrink-0 w-8" />}

            {/* Message content */}
            <div
              className={cn(
                'flex flex-col max-w-[70%] sm:max-w-[60%]',
                isOwnMessage ? 'items-end' : 'items-start'
              )}
            >
              {/* Sender name */}
              {showSender && !isOwnMessage && (
                <span className="text-xs text-slate-600 dark:text-slate-400 mb-1 px-1">
                  {message.senderName}
                </span>
              )}

              {/* Message bubble */}
              <div
                className={cn(
                  'rounded-lg px-4 py-2 break-words',
                  isOwnMessage
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100'
                )}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>

              {/* Timestamp */}
              {showTimestamp && (
                <span
                  className={cn(
                    'text-xs mt-1 px-1',
                    isOwnMessage
                      ? 'text-slate-500 dark:text-slate-400'
                      : 'text-slate-500 dark:text-slate-400'
                  )}
                >
                  {formatMessageTimestamp(message.timestamp)}
                </span>
              )}
            </div>
          </div>
        );
      })}

      {/* Typing indicator */}
      {typingIndicator?.isTyping && (
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 text-sm font-medium">
              {typingIndicator.userName.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-600 dark:text-slate-400 mb-1 px-1">
              {typingIndicator.userName}
            </span>
            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg px-4 py-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};


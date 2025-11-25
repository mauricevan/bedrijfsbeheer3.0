import React, { useState, useCallback, useEffect } from 'react';
import { MessageCircle, X, Search, Plus, Users } from 'lucide-react';
import { useChat } from '../hooks/useChat';
import { ChatWindow } from './ChatWindow';
import { UserList } from './UserList';
import { GroupChatList } from './GroupChatList';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { cn } from '@/utils/cn';
import type { Chat, ChatParticipant } from '../types';

type ViewMode = 'list' | 'chat' | 'new-chat' | 'new-group';

interface ChatWidgetProps {
  className?: string;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const {
    chats,
    currentChat,
    setCurrentChat,
    messages,
    availableUsers,
    createNewChat,
    sendMessage,
    typingIndicators,
    isConnected,
  } = useChat();

  // Calculate total unread count
  const totalUnread = chats.reduce((sum, chat) => sum + chat.unreadCount, 0);

  // Handle chat selection
  const handleSelectChat = useCallback(
    (chat: Chat) => {
      setCurrentChat(chat);
      setViewMode('chat');
    },
    [setCurrentChat]
  );

  // Handle user selection for new chat
  const handleSelectUser = useCallback(
    async (user: ChatParticipant) => {
      try {
        // Check if chat already exists
        const existingChat = chats.find(
          (chat) =>
            chat.type === 'private' &&
            chat.participants.some((p) => p.userId === user.userId)
        );

        if (existingChat) {
          handleSelectChat(existingChat);
        } else {
          const newChat = await createNewChat({
            type: 'private',
            participantIds: [user.userId],
          });
          handleSelectChat(newChat);
        }
      } catch (error) {
        console.error('Failed to create chat:', error);
      }
    },
    [chats, createNewChat, handleSelectChat]
  );

  // Handle send message
  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!currentChat) return;

      try {
        await sendMessage({
          chatId: currentChat.id,
          content,
        });
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    },
    [currentChat, sendMessage]
  );

  // Handle typing
  const handleTyping = useCallback(
    (isTyping: boolean) => {
      if (!currentChat) return;
      // Typing is handled by MessageInput component
    },
    [currentChat]
  );

  // Filter chats by search query
  const filteredChats = chats.filter(
    (chat) =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage?.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const privateChats = filteredChats.filter((chat) => chat.type === 'private');
  const groupChats = filteredChats.filter((chat) => chat.type === 'group');

  const currentMessages = currentChat ? messages.get(currentChat.id) || [] : [];
  const currentTypingIndicator = currentChat
    ? typingIndicators.get(currentChat.id)
    : undefined;

  // Keyboard shortcut: Ctrl+K to toggle chat
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'fixed bottom-6 right-24 z-50',
          'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600',
          'text-white p-4 rounded-full shadow-lg',
          'transform transition-all duration-200',
          'hover:scale-110 active:scale-95',
          'flex items-center justify-center',
          className
        )}
        aria-label="Open chat"
      >
        <MessageCircle className="h-6 w-6" />
        {totalUnread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {totalUnread > 9 ? '9+' : totalUnread}
          </span>
        )}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div
            className={cn(
              'fixed bottom-6 right-24 z-50',
              'w-full max-w-md h-[600px] max-h-[calc(100vh-3rem)]',
              'bg-white dark:bg-slate-900 rounded-lg shadow-2xl',
              'flex flex-col overflow-hidden',
              'lg:w-[400px]'
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 px-4 py-3">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {viewMode === 'chat' && currentChat
                  ? currentChat.name
                  : viewMode === 'new-chat'
                    ? 'Nieuwe chat'
                    : viewMode === 'new-group'
                      ? 'Nieuwe groep'
                      : 'Chats'}
              </h2>
              <div className="flex items-center gap-2">
                {!isConnected && (
                  <div className="h-2 w-2 rounded-full bg-red-500" title="Niet verbonden" />
                )}
                {viewMode === 'chat' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setViewMode('list');
                      setCurrentChat(null);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
                {(viewMode === 'list' || viewMode === 'new-chat' || viewMode === 'new-group') && (
                  <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              {viewMode === 'list' && (
                <div className="flex flex-col h-full">
                  {/* Search */}
                  <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Zoek chats..."
                      leftIcon={<Search className="h-4 w-4" />}
                    />
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2 p-4 border-b border-slate-200 dark:border-slate-700">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setViewMode('new-chat')}
                      className="flex-1"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Nieuwe chat
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setViewMode('new-group')}
                      className="flex-1"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Nieuwe groep
                    </Button>
                  </div>

                  {/* Chat list */}
                  <div className="flex-1 overflow-y-auto">
                    {privateChats.length === 0 && groupChats.length === 0 ? (
                      <div className="flex flex-col items-center justify-center p-8 text-slate-500 dark:text-slate-400">
                        <MessageCircle className="h-8 w-8 mb-2 text-slate-300 dark:text-slate-600" />
                        <p className="text-sm">Geen chats</p>
                      </div>
                    ) : (
                      <>
                        {privateChats.length > 0 && (
                          <div className="divide-y divide-slate-200 dark:divide-slate-700">
                            {privateChats.map((chat) => (
                              <button
                                key={chat.id}
                                onClick={() => handleSelectChat(chat)}
                                className={cn(
                                  'w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left',
                                  currentChat?.id === chat.id &&
                                    'bg-indigo-50 dark:bg-indigo-900/20'
                                )}
                              >
                                <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium flex-shrink-0">
                                  {chat.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-1">
                                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                                      {chat.name}
                                    </p>
                                    {chat.unreadCount > 0 && (
                                      <span className="flex-shrink-0 ml-2 bg-indigo-600 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                                        {chat.unreadCount}
                                      </span>
                                    )}
                                  </div>
                                  {chat.lastMessage && (
                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                      {chat.lastMessage.content}
                                    </p>
                                  )}
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                        {groupChats.length > 0 && (
                          <div className="mt-4">
                            <GroupChatList
                              groupChats={groupChats}
                              onSelectChat={handleSelectChat}
                              selectedChatId={currentChat?.id}
                            />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}

              {viewMode === 'chat' && (
                <ChatWindow
                  chat={currentChat}
                  messages={currentMessages}
                  typingIndicator={currentTypingIndicator}
                  onClose={() => {
                    setViewMode('list');
                    setCurrentChat(null);
                  }}
                  onSendMessage={handleSendMessage}
                  onTyping={handleTyping}
                />
              )}

              {viewMode === 'new-chat' && (
                <UserList
                  users={availableUsers}
                  onSelectUser={async (user) => {
                    await handleSelectUser(user);
                    setViewMode('chat');
                  }}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                />
              )}

              {viewMode === 'new-group' && (
                <div className="flex flex-col items-center justify-center p-8 text-slate-500 dark:text-slate-400">
                  <Users className="h-8 w-8 mb-2 text-slate-300 dark:text-slate-600" />
                  <p className="text-sm mb-4">Groepschats komen binnenkort beschikbaar</p>
                  <Button variant="outline" size="sm" onClick={() => setViewMode('list')}>
                    Terug
                  </Button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};


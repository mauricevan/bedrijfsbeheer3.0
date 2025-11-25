import React from 'react';
import { Users, Plus } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { cn } from '@/utils/cn';
import type { Chat } from '../types';

interface GroupChatListProps {
  groupChats: Chat[];
  onSelectChat: (chat: Chat) => void;
  onCreateGroup?: () => void;
  selectedChatId?: string;
}

export const GroupChatList: React.FC<GroupChatListProps> = ({
  groupChats,
  onSelectChat,
  onCreateGroup,
  selectedChatId,
}) => {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Groepschats</h3>
        {onCreateGroup && (
          <Button variant="ghost" size="sm" onClick={onCreateGroup} title="Nieuwe groep">
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Group list */}
      <div className="flex-1 overflow-y-auto">
        {groupChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-slate-500 dark:text-slate-400">
            <Users className="h-8 w-8 mb-2 text-slate-300 dark:text-slate-600" />
            <p className="text-sm text-center mb-2">Geen groepschats</p>
            {onCreateGroup && (
              <Button variant="outline" size="sm" onClick={onCreateGroup}>
                Maak groep aan
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {groupChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => onSelectChat(chat)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors',
                  'text-left',
                  selectedChatId === chat.id && 'bg-indigo-50 dark:bg-indigo-900/20'
                )}
              >
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {chat.avatar ? (
                    <img
                      src={chat.avatar}
                      alt={chat.name}
                      className="h-10 w-10 rounded-full"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                      <Users className="h-5 w-5" />
                    </div>
                  )}
                </div>

                {/* Chat info */}
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
                      {chat.lastMessage.senderName}: {chat.lastMessage.content}
                    </p>
                  )}
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    {chat.participants.length} deelnemers
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


import React from 'react';
import { Search, UserPlus } from 'lucide-react';
import { Input } from '@/components/common/Input';
import { cn } from '@/utils/cn';
import type { ChatParticipant } from '../types';

interface UserListProps {
  users: ChatParticipant[];
  onSelectUser: (user: ChatParticipant) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  isLoading?: boolean;
}

export const UserList: React.FC<UserListProps> = ({
  users,
  onSelectUser,
  searchQuery = '',
  onSearchChange,
  isLoading = false,
}) => {
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      {onSearchChange && (
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Zoek gebruikers..."
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>
      )}

      {/* User list */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-slate-500 dark:text-slate-400">
            <UserPlus className="h-8 w-8 mb-2 text-slate-300 dark:text-slate-600" />
            <p className="text-sm">Geen gebruikers gevonden</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {filteredUsers.map((user) => (
              <button
                key={user.userId}
                onClick={() => onSelectUser(user)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors',
                  'text-left'
                )}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  {/* Online status */}
                  {user.onlineStatus === 'online' && (
                    <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-slate-900" />
                  )}
                </div>

                {/* User info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {user.email}
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


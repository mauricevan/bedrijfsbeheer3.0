import React, { useState } from 'react';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { NotificationDropdown } from '@/components/common/NotificationDropdown';
import { LogOut, ChevronDown, Menu } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { UnifiedSearch } from '@/components/UnifiedSearch';
import { useAccounting } from '@/features/accounting/hooks/useAccounting';
import { useCRM } from '@/features/crm/hooks/useCRM';
import { useWorkOrders } from '@/features/work-orders/hooks/useWorkOrders';

interface HeaderProps {
  onMenuClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // Fetch data for unified search
  const { quotes, invoices } = useAccounting();
  const { customers } = useCRM();
  const { workOrders } = useWorkOrders();

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    const parts = user.name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return user.name.charAt(0).toUpperCase();
  };

  const getUserFirstName = () => {
    if (!user?.name) return 'Gebruiker';
    return user.name.split(' ')[0];
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur-lg dark:border-slate-700 dark:bg-slate-900/80">
      <div className="flex w-full max-w-3xl items-center gap-4">
        {/* Hamburger menu button for mobile */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuClick}
          className="lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="flex-shrink-0">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Welkom, {getUserFirstName()}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Bedrijfsbeheer Dashboard</p>
        </div>
        <UnifiedSearch
          quotes={quotes}
          invoices={invoices}
          workOrders={workOrders}
          customers={customers}
        />
      </div>
      
      <div className="flex items-center gap-4">
        <NotificationDropdown />
        {user?.role === 'admin' && (
          <span className="px-2 py-1 text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded">
            Admin
          </span>
        )}
        <ThemeToggle />
        
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 p-1 pr-3 transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-medium text-sm">
              {getUserInitials()}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.name || 'User'}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{user?.role || 'Gebruiker'}</p>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-500 dark:text-slate-400 hidden sm:block" />
          </button>

          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-50">
                <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
                  {user?.role && (
                    <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded">
                      {user.role}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    logout();
                    setShowUserMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

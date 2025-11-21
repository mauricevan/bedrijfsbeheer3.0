import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  ClipboardList, 
  FileText, 
  Users, 
  Calendar, 
  BarChart3, 
  Settings,
  Briefcase,
  BookOpen,
  Store
} from 'lucide-react';
import { cn } from '@/utils/cn';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/' },
  { icon: Package, label: 'Inventory', to: '/inventory' },
  { icon: ShoppingCart, label: 'POS', to: '/pos' },
  { icon: ClipboardList, label: 'Work Orders', to: '/work-orders' },
  { icon: FileText, label: 'Accounting', to: '/accounting' },
  { icon: BookOpen, label: 'Bookkeeping', to: '/bookkeeping' },
  { icon: Users, label: 'CRM', to: '/crm' },
  { icon: Briefcase, label: 'HRM', to: '/hrm' },
  { icon: Calendar, label: 'Planning', to: '/planning' },
  { icon: BarChart3, label: 'Reports', to: '/reports' },
  { icon: Store, label: 'Webshop', to: '/webshop' },
  { icon: Settings, label: 'Settings', to: '/settings' },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 transition-transform lg:translate-x-0">
      <div className="flex h-16 items-center border-b border-slate-200 px-6 dark:border-slate-700">
        <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
          Bedrijfsbeheer
        </span>
      </div>
      
      <div className="h-[calc(100vh-4rem)] overflow-y-auto py-4 flex flex-col">
        <nav className="space-y-1 px-3 flex-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400'
                    : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                )
              }
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        
        {/* Version Display */}
        <div className="px-3 py-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>Versie</span>
            <span className="font-medium text-slate-700 dark:text-slate-300">4.5.0</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

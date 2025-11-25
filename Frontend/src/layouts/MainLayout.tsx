import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { FloatingActionButton } from '@/components/common/FloatingActionButton';
import { ChatWidget } from '@/features/chat/components/ChatWidget';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

export const MainLayout: React.FC = () => {
  // Enable global keyboard shortcuts
  useKeyboardShortcuts();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Backdrop overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-64">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
      <FloatingActionButton />
      <ChatWidget />
    </div>
  );
};

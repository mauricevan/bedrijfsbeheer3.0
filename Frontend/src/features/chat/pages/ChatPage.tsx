import React from 'react';
import { ChatWidget } from '../components/ChatWidget';

export const ChatPage: React.FC = () => {
  return (
    <div className="h-[calc(100vh-8rem)]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Chat</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Communiceer met je collega's via real-time chat
        </p>
      </div>
      <div className="h-full">
        <ChatWidget />
      </div>
    </div>
  );
};


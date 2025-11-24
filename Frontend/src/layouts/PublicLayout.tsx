import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { FloatingDock } from '@/components/landing/FloatingDock';

export const PublicLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen font-sans text-slate-900 bg-white">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <FloatingDock />
    </div>
  );
};


import React, { useState, useEffect } from 'react';
import { Phone, MessageSquare, X, Mail } from 'lucide-react';
import { CONTACT_INFO } from '@/data/landingData';

export const FloatingDock: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling down 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setIsExpanded(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center">
      {/* Expanded Menu */}
      <div 
        className={`bg-white/90 backdrop-blur-xl border border-slate-200 shadow-2xl rounded-2xl mb-3 overflow-hidden transition-all duration-300 origin-bottom ${
          isExpanded ? 'opacity-100 scale-100 max-h-60 w-64' : 'opacity-0 scale-95 max-h-0 w-64'
        }`}
      >
        <div className="p-4 space-y-3">
           <a href={`tel:${CONTACT_INFO.phone}`} className="flex items-center p-3 rounded-xl hover:bg-slate-50 transition-colors group">
              <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                 <Phone size={20} />
              </div>
              <div>
                 <div className="font-bold text-slate-900 text-sm">Bel Direct</div>
                 <div className="text-[10px] text-slate-500">24/7 voor spoed</div>
              </div>
           </a>
           <a href={`mailto:${CONTACT_INFO.email}`} className="flex items-center p-3 rounded-xl hover:bg-slate-50 transition-colors group">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                 <Mail size={20} />
              </div>
              <div>
                 <div className="font-bold text-slate-900 text-sm">Stuur Email</div>
                 <div className="text-[10px] text-slate-500">Reactie binnen 4 uur</div>
              </div>
           </a>
        </div>
      </div>

      {/* Main Bar */}
      <div className="bg-slate-900/90 backdrop-blur-md p-1.5 rounded-full shadow-2xl border border-white/10 flex items-center space-x-1 scale-100 hover:scale-105 transition-transform duration-200">
         <button 
           onClick={() => setIsExpanded(!isExpanded)}
           className={`p-3 rounded-full transition-all duration-300 ${isExpanded ? 'bg-slate-700 text-white rotate-180' : 'bg-transparent text-slate-300 hover:text-white'}`}
         >
            {isExpanded ? <X size={20} /> : <MessageSquare size={20} />}
         </button>

         <div className="h-6 w-px bg-white/10 mx-1"></div>

         <a 
           href={`tel:${CONTACT_INFO.phone}`}
           className="flex items-center px-4 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-full font-bold text-sm transition-colors shadow-lg shadow-primary-500/20"
         >
            <Phone size={16} className="mr-2 animate-pulse" />
            <span className="mr-1">Spoed?</span>
            <span className="font-mono opacity-80">{CONTACT_INFO.phone}</span>
         </a>
      </div>
    </div>
  );
};


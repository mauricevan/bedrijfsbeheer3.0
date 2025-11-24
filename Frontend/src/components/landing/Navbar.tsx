import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ShieldCheck, Phone, Clock, Mail, ShoppingCart, User } from 'lucide-react';
import { LandingButton } from './LandingButton';
import { CONTACT_INFO } from '@/data/landingData';
import { useAuth } from '@/features/auth/hooks/useAuth';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const isHome = location.pathname === '/';
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Autosleutels', path: '/services/autosleutels' },
    { name: 'Sleutels', path: '/services/sleutels' },
    { name: 'Sloten', path: '/services/sloten' },
    { name: 'Sluitsystemen', path: '/services/sluitsystemen' },
    { name: 'Over Ons', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleNav = (path: string) => {
    navigate(path);
  };

  const isTransparent = isHome && !scrolled;

  return (
    <div className="fixed w-full z-50 font-sans">
      {/* Top Utility Bar - Trust Signal */}
      <div className={`hidden lg:block transition-all duration-300 ${scrolled ? 'h-0 overflow-hidden opacity-0' : 'h-10 bg-slate-900 text-slate-300'}`}>
         <div className="max-w-7xl mx-auto px-4 h-full flex justify-between items-center text-xs font-medium tracking-wide">
            <div className="flex space-x-6">
               <span className="flex items-center hover:text-white transition-colors"><ShieldCheck size={14} className="mr-2 text-primary-500" /> VEB Erkend Beveiligingsbedrijf</span>
               <span className="flex items-center hover:text-white transition-colors"><Clock size={14} className="mr-2 text-primary-500" /> 24/7 Service voor Abonnementhouders</span>
            </div>
            <div className="flex space-x-6">
               <a href={`tel:${CONTACT_INFO.phone}`} className="flex items-center hover:text-white transition-colors"><Phone size={14} className="mr-2" /> {CONTACT_INFO.phone}</a>
               <a href={`mailto:${CONTACT_INFO.email}`} className="flex items-center hover:text-white transition-colors"><Mail size={14} className="mr-2" /> {CONTACT_INFO.email}</a>
            </div>
         </div>
      </div>

      {/* Main Navbar */}
      <nav 
        className={`transition-all duration-300 ease-in-out border-b
        ${scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-md py-3 border-slate-200/50' 
          : `py-5 ${isHome ? 'bg-transparent border-transparent' : 'bg-white border-slate-100 shadow-sm'}`
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center cursor-pointer group" onClick={() => handleNav('/')}>
              <div className={`mr-3 transition-transform duration-300 group-hover:scale-110 text-primary-600`}>
                 <ShieldCheck size={40} strokeWidth={2} />
              </div>
              <div className={`flex flex-col text-slate-900`}>
                <span className="font-extrabold text-xl leading-none tracking-tight">BTD</span>
                <span className={`font-semibold text-[10px] tracking-[0.2em] uppercase mt-0.5 text-slate-500`}>Beveiliging</span>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) => 
                    `px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200
                    ${isActive 
                      ? 'text-primary-600 bg-primary-50' 
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/50'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              <div className="ml-4 pl-4 border-l border-slate-200 flex items-center space-x-3">
                {isAuthenticated ? (
                  <LandingButton 
                    size="sm"
                    variant="ghost"
                    onClick={() => handleNav('/dashboard')}
                    className="text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-transparent hover:border-slate-200"
                  >
                    <User size={16} className="mr-2" />
                    Dashboard
                  </LandingButton>
                ) : (
                  <LandingButton 
                    size="sm"
                    variant="ghost"
                    onClick={() => handleNav('/login')}
                    className="text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-transparent hover:border-slate-200"
                  >
                    <User size={16} className="mr-2" />
                    Login
                  </LandingButton>
                )}
                <LandingButton 
                  size="sm" 
                  onClick={() => handleNav('/bestellen')}
                  className="bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-500/20"
                >
                  <ShoppingCart size={16} className="mr-2" />
                  Bestel Direct
                </LandingButton>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-md transition-colors text-slate-900 hover:bg-slate-100`}
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div className={`lg:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-slate-100 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[40rem] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="px-6 py-6 space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-xl text-base font-bold transition-colors ${
                    isActive ? 'bg-primary-50 text-primary-600' : 'text-slate-700 hover:bg-slate-50 hover:text-primary-600'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            <div className="pt-4 px-4 border-t border-slate-100 mt-4 space-y-3">
               <div className="flex items-center text-slate-500 text-sm mb-4">
                  <Phone size={14} className="mr-2" /> {CONTACT_INFO.phone}
               </div>
               <div className="grid grid-cols-2 gap-3">
                  {isAuthenticated ? (
                    <LandingButton variant="secondary" className="w-full justify-center" onClick={() => { handleNav('/dashboard'); setIsOpen(false); }}>
                      <User size={18} className="mr-2" /> Dashboard
                    </LandingButton>
                  ) : (
                    <LandingButton variant="secondary" className="w-full justify-center" onClick={() => { handleNav('/login'); setIsOpen(false); }}>
                      <User size={18} className="mr-2" /> Login
                    </LandingButton>
                  )}
                  <LandingButton className="w-full justify-center bg-green-600 hover:bg-green-700" onClick={() => { handleNav('/bestellen'); setIsOpen(false); }}>
                    <ShoppingCart size={18} className="mr-2" /> Bestellen
                  </LandingButton>
               </div>
               <LandingButton variant="outline" className="w-full justify-center" onClick={() => { handleNav('/contact'); setIsOpen(false); }}>
                Bezoek onze Winkel
              </LandingButton>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};


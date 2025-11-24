import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight } from 'lucide-react';
import { LandingButton as Button } from '@/components/landing/LandingButton';
import { Reveal } from '@/components/landing/Reveal';
import { useAuth } from '@/features/auth/hooks/useAuth';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate('/dashboard'); // Redirect to dashboard home
    } catch (err) {
      setError('Ongeldige email of wachtwoord');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans py-24 px-4">
      <Reveal>
        <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden relative p-8 md:p-12">
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -mr-10 -mt-10"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-slate-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -ml-10 -mb-10"></div>

          <div className="relative z-10">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-50 text-primary-600 mb-6">
                <ShieldCheck size={32} />
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Welkom terug</h1>
              <p className="text-slate-500">Log in op uw BTD account</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2" htmlFor="email">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Mail size={18} />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading || authLoading}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-50 transition-all outline-none text-slate-900 font-medium disabled:opacity-50"
                    placeholder="naam@bedrijf.nl"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-bold text-slate-700" htmlFor="password">Wachtwoord</label>
                  <a href="#" className="text-xs font-bold text-primary-600 hover:text-primary-700">Wachtwoord vergeten?</a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Lock size={18} />
                  </div>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading || authLoading}
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-50 transition-all outline-none text-slate-900 font-medium disabled:opacity-50"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200">
                  <p className="text-sm text-red-600 font-medium">{error}</p>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full justify-center py-4 text-lg shadow-lg shadow-primary-500/20"
                disabled={isLoading || authLoading}
              >
                {isLoading || authLoading ? 'Inloggen...' : (
                  <>
                    Inloggen <ArrowRight size={18} className="ml-2" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-slate-500 text-sm">
                Nog geen account?{' '}
                <a href="#" className="font-bold text-primary-600 hover:text-primary-700 transition-colors">
                  Registreer hier
                </a>
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
};


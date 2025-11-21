import React, { useState, useEffect } from 'react';
import { LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Card } from '@/components/common/Card';

export const LoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (userEmail: string, userPassword: string) => {
    setEmail(userEmail);
    setPassword(userPassword);
    setError('');
    setIsLoading(true);

    try {
      await login(userEmail, userPassword);
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/20 mb-4">
            <LogIn className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Bedrijfsbeheer
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
            required
            disabled={isLoading}
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            disabled={isLoading}
          />

          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            size="lg"
            isLoading={isLoading}
            leftIcon={!isLoading ? <LogIn className="h-4 w-4" /> : undefined}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-4 flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => handleQuickLogin('admin@example.com', 'admin123')}
            disabled={isLoading}
          >
            Quick Login (Admin)
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => handleQuickLogin('john@example.com', 'john123')}
            disabled={isLoading}
          >
            Quick Login (Employee)
          </Button>
        </div>

        <div className="mt-6 p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold mb-2">Demo Credentials:</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            <strong>Admin:</strong> admin@example.com / admin123
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            <strong>Employee:</strong> john@example.com / john123
          </p>
        </div>
      </Card>
    </div>
  );
};

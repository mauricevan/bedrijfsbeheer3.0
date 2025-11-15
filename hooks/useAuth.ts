// useAuth Hook - Authentication utilities
import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { User } from '../types';

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (authService.isAuthenticated()) {
        try {
          const user = await authService.getProfile();
          setCurrentUser(user);
        } catch (err: any) {
          console.error('Failed to load user:', err);
          // Token might be invalid, clear it
          authService.logout();
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login({ email, password });
      setCurrentUser(response.user);
      return response.user;
    } catch (err: any) {
      const errorMessage = err.error || 'Login mislukt';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, password: string, name: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.register({ email, password, name });
      setCurrentUser(response.user);
      return response.user;
    } catch (err: any) {
      const errorMessage = err.error || 'Registratie mislukt';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setCurrentUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    currentUser,
    isLoading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!currentUser,
  };
}

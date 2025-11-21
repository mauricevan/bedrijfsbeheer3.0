export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee';
  permissions: string[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

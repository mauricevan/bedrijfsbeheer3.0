---
description: ERROR HANDLING PATTERNS
---

# Error Handling Patterns
**Versie:** 1.0.0
**Laatst bijgewerkt:** November 2024

---

## 📋 Inhoudsopgave

1. [Error Handling Strategy](#error-handling-strategy)
2. [React Error Boundaries](#react-error-boundaries)
3. [Async Error Handling](#async-error-handling)
4. [API Error Handling](#api-error-handling)
5. [Form Error Handling](#form-error-handling)
6. [Error Logging & Monitoring](#error-logging--monitoring)
7. [User-Facing Error Messages](#user-facing-error-messages)

---

## 🎯 Error Handling Strategy

### Error Categories

```typescript
// 1. User Errors (Recoverable)
- Validation errors → Show in form
- Network timeouts → Retry + show message
- 404 Not Found → Show fallback UI

// 2. Application Errors (Log & Recover)
- Unexpected API responses → Log + fallback
- State corruption → Reset state + log
- Component crashes → Error boundary

// 3. Fatal Errors (Log & Alert)
- Authentication failures → Logout + redirect
- Critical API failures → Maintenance mode
- Unhandled exceptions → Error page + alert team
```

### Error Handling Principles

```typescript
// ✅ DO: Fail gracefully
try {
  await riskyOperation();
} catch (error) {
  logError(error);
  showUserMessage('Something went wrong. Please try again.');
  // App continues functioning
}

// ❌ DON'T: Let errors crash the app
await riskyOperation(); // No try-catch - app crashes!

// ✅ DO: Provide context
throw new Error(`Failed to fetch user ${userId}: ${error.message}`);

// ❌ DON'T: Generic errors
throw new Error('Error'); // Useless!

// ✅ DO: Handle errors at appropriate level
// - Form validation → Component level
// - API errors → Service level
// - Render errors → Error Boundary

// ❌ DON'T: Catch all errors in one place
window.addEventListener('error', () => {
  // Too broad!
});
```

---

## 🛡️ React Error Boundaries

### Basic Error Boundary

```typescript
// ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to error reporting service
    console.error('ErrorBoundary caught:', error, errorInfo);

    // Optional callback
    this.props.onError?.(error, errorInfo);

    // Send to monitoring service (Sentry, etc.)
    if (process.env.NODE_ENV === 'production') {
      logErrorToService(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback
      return (
        <div className="error-boundary">
          <h1>Something went wrong</h1>
          <p>We're sorry for the inconvenience. Please refresh the page.</p>
          <button onClick={() => window.location.reload()}>
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Error Boundary Usage

```typescript
// App.tsx
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary
      fallback={<ErrorFallback />}
      onError={(error, errorInfo) => {
        console.error('App error:', error);
      }}
    >
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={
            <ErrorBoundary fallback={<DashboardError />}>
              <Dashboard />
            </ErrorBoundary>
          } />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}
```

### Granular Error Boundaries

```typescript
// Wrap critical sections
function Dashboard() {
  return (
    <div>
      <Header />

      {/* Isolate chart errors */}
      <ErrorBoundary fallback={<ChartError />}>
        <Chart data={data} />
      </ErrorBoundary>

      {/* Isolate table errors */}
      <ErrorBoundary fallback={<TableError />}>
        <DataTable data={data} />
      </ErrorBoundary>

      <Footer />
    </div>
  );
}

// Custom fallbacks
const ChartError = () => (
  <div className="chart-error">
    <p>Unable to load chart. Showing table instead.</p>
  </div>
);
```

### Reset Error Boundary

```typescript
// ErrorBoundary with reset functionality
export class ErrorBoundary extends Component<Props, State> {
  // ... previous code ...

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Something went wrong</h1>
          <p>{this.state.error?.message}</p>
          <button onClick={this.resetError}>
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

---

## ⏳ Async Error Handling

### Async/Await with Try-Catch

```typescript
// ✅ GOOD: Proper async error handling
const fetchUserData = async (userId: string) => {
  try {
    const response = await fetch(`/api/users/${userId}`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    // Log error
    console.error('Failed to fetch user:', error);

    // Re-throw with context
    throw new Error(`Failed to load user ${userId}: ${error.message}`);
  }
};

// Usage in component
const UserProfile = ({ userId }: { userId: string }) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        setError(null);

        const userData = await fetchUserData(userId);
        setUser(userData);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');

      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [userId]);

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!user) return <NotFound />;

  return <UserCard user={user} />;
};
```

### Retry Logic

```typescript
// Retry with exponential backoff
const fetchWithRetry = async <T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    initialDelay?: number;
    maxDelay?: number;
  } = {}
): Promise<T> => {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000
  } = options;

  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();

    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Don't retry on final attempt
      if (attempt === maxRetries) {
        break;
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(
        initialDelay * Math.pow(2, attempt),
        maxDelay
      );

      console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`);

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
};

// Usage
const loadData = async () => {
  try {
    const data = await fetchWithRetry(
      () => fetch('/api/data').then(r => r.json()),
      { maxRetries: 3, initialDelay: 1000 }
    );
    return data;
  } catch (error) {
    console.error('Failed after retries:', error);
    throw error;
  }
};
```

### Promise Error Handling

```typescript
// ✅ GOOD: Always catch promises
fetch('/api/data')
  .then(response => response.json())
  .then(data => setData(data))
  .catch(error => {
    console.error('Fetch failed:', error);
    setError(error.message);
  });

// ❌ BAD: Unhandled promise rejection
fetch('/api/data')
  .then(response => response.json())
  .then(data => setData(data));
// No .catch() - unhandled rejection!

// ✅ GOOD: Handle Promise.all errors
const loadAll = async () => {
  try {
    const [users, posts, comments] = await Promise.all([
      fetchUsers(),
      fetchPosts(),
      fetchComments()
    ]);

    return { users, posts, comments };

  } catch (error) {
    // If ANY promise fails, all fail
    console.error('Failed to load data:', error);
    throw error;
  }
};

// ✅ BETTER: Handle Promise.allSettled for partial success
const loadAllSettled = async () => {
  const results = await Promise.allSettled([
    fetchUsers(),
    fetchPosts(),
    fetchComments()
  ]);

  const users = results[0].status === 'fulfilled' ? results[0].value : [];
  const posts = results[1].status === 'fulfilled' ? results[1].value : [];
  const comments = results[2].status === 'fulfilled' ? results[2].value : [];

  // Log failures
  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      console.error(`Request ${index} failed:`, result.reason);
    }
  });

  return { users, posts, comments };
};
```

---

## 🌐 API Error Handling

### API Client with Error Handling

```typescript
// api/client.ts
export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data?: any
  ) {
    super(`API Error ${status}: ${statusText}`);
    this.name = 'ApiError';
  }
}

export class ApiClient {
  private baseURL: string;
  private defaultHeaders: HeadersInit;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.defaultHeaders,
          ...options.headers,
        },
      });

      // Handle different status codes
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = await response.text();
        }

        throw new ApiError(
          response.status,
          response.statusText,
          errorData
        );
      }

      // Handle empty responses
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        return await response.json();
      }

      return await response.text() as unknown as T;

    } catch (error) {
      // Network errors
      if (error instanceof TypeError) {
        throw new Error('Network error. Please check your connection.');
      }

      // Re-throw API errors
      if (error instanceof ApiError) {
        throw error;
      }

      // Unknown errors
      throw new Error(`Request failed: ${error}`);
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}
```

### Using API Client

```typescript
// services/userService.ts
import { ApiClient, ApiError } from './api/client';

const api = new ApiClient(process.env.API_URL!);

export const userService = {
  async getUser(id: string): Promise<User> {
    try {
      return await api.get<User>(`/users/${id}`);
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 404) {
          throw new Error('User not found');
        }
        if (error.status === 401) {
          throw new Error('Unauthorized. Please login again.');
        }
        if (error.status >= 500) {
          throw new Error('Server error. Please try again later.');
        }
      }
      throw error;
    }
  },

  async createUser(data: CreateUserInput): Promise<User> {
    try {
      return await api.post<User>('/users', data);
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 400) {
          // Validation errors from server
          throw new Error(error.data?.message || 'Invalid user data');
        }
        if (error.status === 409) {
          throw new Error('User with this email already exists');
        }
      }
      throw error;
    }
  },
};
```

### React Query Error Handling

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';

// Query with error handling
const UserProfile = ({ userId }: { userId: string }) => {
  const {
    data: user,
    error,
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => userService.getUser(userId),
    retry: (failureCount, error) => {
      // Don't retry on 404
      if (error instanceof ApiError && error.status === 404) {
        return false;
      }
      // Retry up to 3 times for other errors
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  if (isLoading) return <Spinner />;

  if (isError) {
    return (
      <ErrorMessage
        message={error instanceof Error ? error.message : 'Failed to load user'}
        onRetry={refetch}
      />
    );
  }

  return <UserCard user={user!} />;
};

// Mutation with error handling
const CreateUserForm = () => {
  const [formError, setFormError] = useState<string | null>(null);

  const createUserMutation = useMutation({
    mutationFn: userService.createUser,
    onSuccess: (user) => {
      toast.success(`User ${user.name} created!`);
      navigate(`/users/${user.id}`);
    },
    onError: (error) => {
      const message = error instanceof Error
        ? error.message
        : 'Failed to create user';
      setFormError(message);
      toast.error(message);
    },
  });

  const handleSubmit = (data: CreateUserInput) => {
    setFormError(null);
    createUserMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      {formError && <Alert type="error">{formError}</Alert>}
      {/* Form fields */}
      <button
        type="submit"
        disabled={createUserMutation.isPending}
      >
        {createUserMutation.isPending ? 'Creating...' : 'Create User'}
      </button>
    </form>
  );
};
```

---

## 📝 Form Error Handling

### Form with Validation

```typescript
// useForm hook with validation
const useForm = <T extends Record<string, any>>(
  initialValues: T,
  validate: (values: T) => Record<string, string>
) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = (name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as string]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as string];
        return newErrors;
      });
    }
  };

  const handleBlur = (name: keyof T) => {
    setTouched(prev => ({ ...prev, [name]: true }));

    // Validate single field on blur
    const fieldErrors = validate(values);
    if (fieldErrors[name as string]) {
      setErrors(prev => ({
        ...prev,
        [name]: fieldErrors[name as string]
      }));
    }
  };

  const handleSubmit = (onSubmit: (values: T) => void) => {
    return (e: React.FormEvent) => {
      e.preventDefault();

      // Validate all fields
      const validationErrors = validate(values);
      setErrors(validationErrors);

      // Mark all as touched
      const allTouched = Object.keys(values).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {}
      );
      setTouched(allTouched);

      // Submit if no errors
      if (Object.keys(validationErrors).length === 0) {
        onSubmit(values);
      }
    };
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
  };
};

// Usage
const LoginForm = () => {
  const form = useForm(
    { email: '', password: '' },
    (values) => {
      const errors: Record<string, string> = {};

      if (!values.email) {
        errors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(values.email)) {
        errors.email = 'Invalid email format';
      }

      if (!values.password) {
        errors.password = 'Password is required';
      } else if (values.password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
      }

      return errors;
    }
  );

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await login(values);
      navigate('/dashboard');
    } catch (error) {
      toast.error('Login failed. Please try again.');
    }
  });

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={form.values.email}
          onChange={(e) => form.handleChange('email', e.target.value)}
          onBlur={() => form.handleBlur('email')}
        />
        {form.touched.email && form.errors.email && (
          <span className="error">{form.errors.email}</span>
        )}
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={form.values.password}
          onChange={(e) => form.handleChange('password', e.target.value)}
          onBlur={() => form.handleBlur('password')}
        />
        {form.touched.password && form.errors.password && (
          <span className="error">{form.errors.password}</span>
        )}
      </div>

      <button type="submit">Login</button>
    </form>
  );
};
```

---

## 📊 Error Logging & Monitoring

### Sentry Integration

```typescript
// sentry.ts
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

export const initSentry = () => {
  if (process.env.NODE_ENV === 'production') {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV,
      integrations: [new BrowserTracing()],
      tracesSampleRate: 0.1, // 10% of transactions

      beforeSend(event, hint) {
        // Filter out errors from browser extensions
        if (event.exception) {
          const error = hint.originalException;
          if (error && error.toString().includes('chrome-extension://')) {
            return null;
          }
        }

        // Add user context
        if (getCurrentUser()) {
          event.user = {
            id: getCurrentUser().id,
            email: getCurrentUser().email,
          };
        }

        return event;
      },

      ignoreErrors: [
        // Browser extensions
        'top.GLOBALS',
        // Network errors that are user's responsibility
        'NetworkError',
        'Failed to fetch',
      ],
    });
  }
};

// Usage in app
export const logError = (
  error: Error,
  context?: Record<string, any>
) => {
  console.error('Error:', error, context);

  if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(error, {
      extra: context,
    });
  }
};
```

### Custom Error Logger

```typescript
// logger.ts
type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  error?: Error;
  userId?: string;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  private createEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    error?: Error
  ): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error,
      userId: getCurrentUser()?.id,
    };
  }

  info(message: string, context?: Record<string, any>) {
    const entry = this.createEntry('info', message, context);
    this.logs.push(entry);
    console.info(message, context);
    this.trimLogs();
  }

  warn(message: string, context?: Record<string, any>) {
    const entry = this.createEntry('warn', message, context);
    this.logs.push(entry);
    console.warn(message, context);
    this.trimLogs();
  }

  error(message: string, error?: Error, context?: Record<string, any>) {
    const entry = this.createEntry('error', message, context, error);
    this.logs.push(entry);
    console.error(message, error, context);

    // Send to monitoring service
    if (process.env.NODE_ENV === 'production') {
      this.sendToService(entry);
    }

    this.trimLogs();
  }

  debug(message: string, context?: Record<string, any>) {
    if (process.env.NODE_ENV !== 'production') {
      const entry = this.createEntry('debug', message, context);
      this.logs.push(entry);
      console.debug(message, context);
      this.trimLogs();
    }
  }

  private trimLogs() {
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
  }

  private async sendToService(entry: LogEntry) {
    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
    } catch (error) {
      console.error('Failed to send log:', error);
    }
  }

  getLogs(level?: LogLevel): LogEntry[] {
    if (level) {
      return this.logs.filter(log => log.level === level);
    }
    return [...this.logs];
  }

  clear() {
    this.logs = [];
  }
}

export const logger = new Logger();
```

---

## 💬 User-Facing Error Messages

### Error Message Component

```typescript
// ErrorMessage.tsx
type ErrorMessageProps = {
  message: string;
  type?: 'error' | 'warning' | 'info';
  onRetry?: () => void;
  onDismiss?: () => void;
};

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  type = 'error',
  onRetry,
  onDismiss,
}) => {
  const icons = {
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  };

  return (
    <div className={`alert alert-${type}`} role="alert">
      <span className="icon">{icons[type]}</span>
      <span className="message">{message}</span>
      <div className="actions">
        {onRetry && (
          <button onClick={onRetry} className="btn-retry">
            Try Again
          </button>
        )}
        {onDismiss && (
          <button onClick={onDismiss} className="btn-dismiss">
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
};
```

### Toast Notifications

```typescript
// toast.ts
type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

class ToastManager {
  private toasts: Toast[] = [];
  private listeners: Array<(toasts: Toast[]) => void> = [];

  show(type: ToastType, message: string, duration = 5000) {
    const toast: Toast = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      message,
      duration,
    };

    this.toasts.push(toast);
    this.notify();

    if (duration > 0) {
      setTimeout(() => this.remove(toast.id), duration);
    }
  }

  success(message: string, duration?: number) {
    this.show('success', message, duration);
  }

  error(message: string, duration?: number) {
    this.show('error', message, duration);
  }

  warning(message: string, duration?: number) {
    this.show('warning', message, duration);
  }

  info(message: string, duration?: number) {
    this.show('info', message, duration);
  }

  remove(id: string) {
    this.toasts = this.toasts.filter(t => t.id !== id);
    this.notify();
  }

  subscribe(listener: (toasts: Toast[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(listener => listener([...this.toasts]));
  }
}

export const toast = new ToastManager();
```

### User-Friendly Error Messages

```typescript
// Map technical errors to user-friendly messages
const ERROR_MESSAGES: Record<string, string> = {
  // Network errors
  'NetworkError': 'Unable to connect. Please check your internet connection.',
  'Failed to fetch': 'Unable to connect to the server. Please try again.',

  // Authentication errors
  'Unauthorized': 'Your session has expired. Please login again.',
  'Forbidden': 'You don\'t have permission to perform this action.',

  // Validation errors
  'ValidationError': 'Please check your input and try again.',

  // Server errors
  'InternalServerError': 'Something went wrong on our end. We\'re looking into it.',

  // Default
  'default': 'An unexpected error occurred. Please try again.',
};

export const getUserFriendlyMessage = (error: unknown): string => {
  if (error instanceof Error) {
    // Check if we have a friendly message for this error
    return ERROR_MESSAGES[error.message] || ERROR_MESSAGES.default;
  }

  if (typeof error === 'string') {
    return ERROR_MESSAGES[error] || error;
  }

  return ERROR_MESSAGES.default;
};
```

---

## ✅ Error Handling Checklist

```markdown
### For Every Component
- [ ] Error boundaries wrap component tree
- [ ] Loading states shown during async operations
- [ ] Error states shown when operations fail
- [ ] User-friendly error messages (not technical)
- [ ] Retry functionality where appropriate

### For Every API Call
- [ ] Try-catch around async operations
- [ ] Specific error handling for different status codes
- [ ] Network error handling
- [ ] Timeout handling
- [ ] Retry logic for transient failures

### For Every Form
- [ ] Client-side validation
- [ ] Show errors inline (field-level)
- [ ] Clear errors when user fixes input
- [ ] Handle server validation errors
- [ ] Disable submit during submission

### For Production
- [ ] Error logging configured (Sentry, etc.)
- [ ] Error monitoring alerts set up
- [ ] User error reporting mechanism
- [ ] Error logs include context
- [ ] Sensitive data filtered from logs
```

---

## 📚 Resources

- [Error Boundaries - React Docs](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [Sentry Documentation](https://docs.sentry.io/)
- [Error Handling Best Practices](https://kentcdodds.com/blog/use-react-error-boundary-to-handle-errors-in-react)


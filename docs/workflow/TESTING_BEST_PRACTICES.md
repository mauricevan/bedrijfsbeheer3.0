# Testing Best Practices
**Versie:** 1.0.0
**Laatst bijgewerkt:** November 2024

---

## 📋 Inhoudsopgave

1. [Testing Strategy](#testing-strategy)
2. [Unit Testing](#unit-testing)
3. [Integration Testing](#integration-testing)
4. [E2E Testing](#e2e-testing)
5. [Test Organization](#test-organization)
6. [Mocking Strategies](#mocking-strategies)
7. [Coverage & Quality](#coverage--quality)

---

## 🎯 Testing Strategy

### Testing Pyramid

```
        /\
       /E2E\         10% - End-to-End (Slow, Expensive)
      /------\
     /  INT   \      20% - Integration (Medium)
    /----------\
   /    UNIT    \    70% - Unit Tests (Fast, Cheap)
  /--------------\
```

**Principles:**
- ✅ **70% Unit Tests** - Fast, isolated, test single functions/components
- ✅ **20% Integration Tests** - Test component interactions
- ✅ **10% E2E Tests** - Test critical user flows
- ✅ **Write tests BEFORE fixing bugs** (TDD for bug fixes)
- ✅ **Test behavior, not implementation** (avoid brittle tests)

### Test Stack

```json
{
  "devDependencies": {
    "vitest": "^1.0.0",                    // Test runner (faster than Jest)
    "@testing-library/react": "^14.0.0",   // React testing utilities
    "@testing-library/jest-dom": "^6.0.0", // Custom matchers
    "@testing-library/user-event": "^14.0.0", // User interaction simulation
    "msw": "^2.0.0",                       // API mocking
    "playwright": "^1.40.0",               // E2E testing
    "@vitest/coverage-v8": "^1.0.0"        // Coverage reporting
  }
}
```

---

## 🧪 Unit Testing

### Component Testing

```typescript
// Button.tsx
type ButtonProps = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
};

export const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled = false,
  variant = 'primary'
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {label}
    </button>
  );
};
```

```typescript
// Button.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('renders with correct label', () => {
    render(<Button label="Click Me" onClick={() => {}} />);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    render(<Button label="Click" onClick={handleClick} />);

    await userEvent.click(screen.getByText('Click'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', async () => {
    const handleClick = vi.fn();
    render(<Button label="Click" onClick={handleClick} disabled />);

    await userEvent.click(screen.getByText('Click'));

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies correct variant class', () => {
    const { rerender } = render(
      <Button label="Test" onClick={() => {}} variant="primary" />
    );
    expect(screen.getByRole('button')).toHaveClass('btn-primary');

    rerender(<Button label="Test" onClick={() => {}} variant="secondary" />);
    expect(screen.getByRole('button')).toHaveClass('btn-secondary');
  });
});
```

### Hook Testing

```typescript
// useCounter.ts
import { useState, useCallback } from 'react';

export const useCounter = (initialValue = 0) => {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);

  const decrement = useCallback(() => {
    setCount(prev => prev - 1);
  }, []);

  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);

  return { count, increment, decrement, reset };
};
```

```typescript
// useCounter.test.ts
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('initializes with default value', () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  it('initializes with custom value', () => {
    const { result } = renderHook(() => useCounter(10));
    expect(result.current.count).toBe(10);
  });

  it('increments counter', () => {
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });

  it('decrements counter', () => {
    const { result } = renderHook(() => useCounter(5));

    act(() => {
      result.current.decrement();
    });

    expect(result.current.count).toBe(4);
  });

  it('resets to initial value', () => {
    const { result } = renderHook(() => useCounter(10));

    act(() => {
      result.current.increment();
      result.current.increment();
    });
    expect(result.current.count).toBe(12);

    act(() => {
      result.current.reset();
    });
    expect(result.current.count).toBe(10);
  });
});
```

### Service/Utility Testing

```typescript
// validators.ts
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): {
  valid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain lowercase letter');
  }
  if (!/\d/.test(password)) {
    errors.push('Password must contain number');
  }

  return { valid: errors.length === 0, errors };
};
```

```typescript
// validators.test.ts
import { describe, it, expect } from 'vitest';
import { validateEmail, validatePassword } from './validators';

describe('validateEmail', () => {
  it('accepts valid email addresses', () => {
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('test.user@domain.co.uk')).toBe(true);
    expect(validateEmail('name+tag@example.com')).toBe(true);
  });

  it('rejects invalid email addresses', () => {
    expect(validateEmail('invalid')).toBe(false);
    expect(validateEmail('missing@domain')).toBe(false);
    expect(validateEmail('@example.com')).toBe(false);
    expect(validateEmail('user@')).toBe(false);
  });
});

describe('validatePassword', () => {
  it('accepts strong password', () => {
    const result = validatePassword('Strong123');
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('rejects short password', () => {
    const result = validatePassword('Short1');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Password must be at least 8 characters');
  });

  it('rejects password without uppercase', () => {
    const result = validatePassword('lowercase123');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Password must contain uppercase letter');
  });

  it('rejects password without lowercase', () => {
    const result = validatePassword('UPPERCASE123');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Password must contain lowercase letter');
  });

  it('rejects password without number', () => {
    const result = validatePassword('NoNumbers');
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Password must contain number');
  });

  it('returns all errors for weak password', () => {
    const result = validatePassword('weak');
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(3);
  });
});
```

---

## 🔗 Integration Testing

### Testing Component Interactions

```typescript
// UserForm.tsx
import { useState } from 'react';
import { validateEmail } from './validators';

type UserFormProps = {
  onSubmit: (data: { name: string; email: string }) => void;
};

export const UserForm: React.FC<UserFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name) newErrors.name = 'Name is required';
    if (!email) newErrors.email = 'Email is required';
    else if (!validateEmail(email)) newErrors.email = 'Invalid email';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({ name, email });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errors.name && <span role="alert">{errors.name}</span>}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <span role="alert">{errors.email}</span>}
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};
```

```typescript
// UserForm.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserForm } from './UserForm';

describe('UserForm Integration', () => {
  it('submits form with valid data', async () => {
    const handleSubmit = vi.fn();
    render(<UserForm onSubmit={handleSubmit} />);

    // Fill form
    await userEvent.type(screen.getByLabelText(/name/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');

    // Submit
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Verify submission
    expect(handleSubmit).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com'
    });
  });

  it('shows validation errors for empty fields', async () => {
    const handleSubmit = vi.fn();
    render(<UserForm onSubmit={handleSubmit} />);

    // Submit empty form
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Verify errors shown
    expect(screen.getByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Email is required')).toBeInTheDocument();

    // Verify form not submitted
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('shows error for invalid email', async () => {
    const handleSubmit = vi.fn();
    render(<UserForm onSubmit={handleSubmit} />);

    await userEvent.type(screen.getByLabelText(/name/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/email/i), 'invalid-email');
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.getByText('Invalid email')).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('clears errors when fixed', async () => {
    const handleSubmit = vi.fn();
    render(<UserForm onSubmit={handleSubmit} />);

    // Submit empty to trigger errors
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));
    expect(screen.getByText('Name is required')).toBeInTheDocument();

    // Fix errors
    await userEvent.type(screen.getByLabelText(/name/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Errors should be gone
    expect(screen.queryByText('Name is required')).not.toBeInTheDocument();
    expect(handleSubmit).toHaveBeenCalled();
  });
});
```

### API Integration Testing (with MSW)

```typescript
// api/users.ts
export const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch('/api/users');
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return response.json();
};

export const createUser = async (data: CreateUserInput): Promise<User> => {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    throw new Error('Failed to create user');
  }
  return response.json();
};
```

```typescript
// mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  // GET /api/users
  http.get('/api/users', () => {
    return HttpResponse.json([
      { id: '1', name: 'John Doe', email: 'john@example.com' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com' }
    ]);
  }),

  // POST /api/users
  http.post('/api/users', async ({ request }) => {
    const data = await request.json();
    return HttpResponse.json({
      id: '3',
      ...data
    }, { status: 201 });
  }),

  // Error scenario
  http.get('/api/users/error', () => {
    return HttpResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  })
];
```

```typescript
// setupTests.ts
import { beforeAll, afterEach, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { handlers } from './mocks/handlers';

const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

```typescript
// users.test.ts
import { describe, it, expect } from 'vitest';
import { fetchUsers, createUser } from './users';

describe('User API Integration', () => {
  it('fetches users successfully', async () => {
    const users = await fetchUsers();

    expect(users).toHaveLength(2);
    expect(users[0]).toEqual({
      id: '1',
      name: 'John Doe',
      email: 'john@example.com'
    });
  });

  it('creates user successfully', async () => {
    const newUser = await createUser({
      name: 'New User',
      email: 'new@example.com'
    });

    expect(newUser).toEqual({
      id: '3',
      name: 'New User',
      email: 'new@example.com'
    });
  });

  it('handles API errors', async () => {
    await expect(
      fetch('/api/users/error').then(r => r.json())
    ).rejects.toThrow();
  });
});
```

---

## 🌐 E2E Testing

### Playwright Setup

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // Mobile
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

### E2E Test Examples

```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('user can login successfully', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');

    // Fill login form
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'Test123!');

    // Submit form
    await page.click('button[type="submit"]');

    // Verify redirect to dashboard
    await expect(page).toHaveURL('/dashboard');

    // Verify user is logged in
    await expect(page.locator('text=Welcome')).toBeVisible();
  });

  test('shows error for invalid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[name="email"]', 'wrong@example.com');
    await page.fill('input[name="password"]', 'wrongpass');
    await page.click('button[type="submit"]');

    // Verify error message
    await expect(page.locator('text=Invalid credentials')).toBeVisible();

    // Verify still on login page
    await expect(page).toHaveURL('/login');
  });

  test('user can logout', async ({ page }) => {
    // Login first (helper function)
    await login(page, 'test@example.com', 'Test123!');

    // Click logout
    await page.click('button:has-text("Logout")');

    // Verify redirect to login
    await expect(page).toHaveURL('/login');
  });
});

// Helper function
async function login(page, email: string, password: string) {
  await page.goto('/login');
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL('/dashboard');
}
```

```typescript
// e2e/user-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('User Management Flow', () => {
  test('complete user creation flow', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.fill('input[name="password"]', 'Admin123!');
    await page.click('button[type="submit"]');

    // Navigate to users page
    await page.click('a:has-text("Users")');
    await expect(page).toHaveURL('/users');

    // Open create user modal
    await page.click('button:has-text("Add User")');
    await expect(page.locator('role=dialog')).toBeVisible();

    // Fill form
    await page.fill('input[name="name"]', 'New User');
    await page.fill('input[name="email"]', 'newuser@example.com');
    await page.fill('input[name="password"]', 'NewUser123!');
    await page.selectOption('select[name="role"]', 'user');

    // Submit
    await page.click('button:has-text("Create")');

    // Verify success
    await expect(page.locator('text=User created successfully')).toBeVisible();

    // Verify user in list
    await expect(page.locator('text=newuser@example.com')).toBeVisible();
  });

  test('search and filter users', async ({ page }) => {
    await page.goto('/users');

    // Search
    await page.fill('input[placeholder*="Search"]', 'john');

    // Verify filtered results
    await expect(page.locator('text=john@example.com')).toBeVisible();
    await expect(page.locator('text=jane@example.com')).not.toBeVisible();

    // Clear search
    await page.fill('input[placeholder*="Search"]', '');

    // Filter by role
    await page.selectOption('select[name="roleFilter"]', 'admin');

    // Verify only admins shown
    const adminBadges = page.locator('span:has-text("Admin")');
    await expect(adminBadges).toHaveCount(await adminBadges.count());
  });
});
```

---

## 📁 Test Organization

### Co-located Tests (Recommended)

```
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx       ← Co-located
│   │   └── index.ts
│   └── UserForm/
│       ├── UserForm.tsx
│       ├── UserForm.test.tsx     ← Co-located
│       └── index.ts
│
├── hooks/
│   ├── useCounter.ts
│   └── useCounter.test.ts        ← Co-located
│
└── utils/
    ├── validators.ts
    └── validators.test.ts        ← Co-located
```

**Advantages:**
- ✅ Easy to find tests
- ✅ Easy to refactor (move file + test together)
- ✅ Clear 1:1 mapping

### Separate Test Directory

```
src/
├── components/
│   └── Button.tsx
├── hooks/
│   └── useCounter.ts
└── utils/
    └── validators.ts

tests/
├── unit/
│   ├── components/
│   │   └── Button.test.tsx
│   ├── hooks/
│   │   └── useCounter.test.ts
│   └── utils/
│       └── validators.test.ts
├── integration/
│   └── UserFlow.test.tsx
└── e2e/
    └── auth.spec.ts
```

**Use when:**
- Large codebase (100+ files)
- Need to separate test infrastructure
- Different teams own tests vs code

---

## 🎭 Mocking Strategies

### Mock Functions

```typescript
import { vi } from 'vitest';

// Create mock
const mockFn = vi.fn();

// Mock implementation
const mockFn = vi.fn((x: number) => x * 2);

// Mock return value
mockFn.mockReturnValue(42);
mockFn.mockResolvedValue({ data: 'async result' });

// Mock implementation once
mockFn.mockImplementationOnce(() => 'first call')
      .mockImplementationOnce(() => 'second call');

// Assertions
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
expect(mockFn).toHaveBeenCalledTimes(2);
expect(mockFn).toHaveReturnedWith(42);

// Reset
mockFn.mockClear();      // Clear call history
mockFn.mockReset();      // Clear + remove implementation
mockFn.mockRestore();    // Restore original implementation
```

### Mock Modules

```typescript
// Mock entire module
vi.mock('./api/users', () => ({
  fetchUsers: vi.fn(() => Promise.resolve([
    { id: '1', name: 'John' }
  ])),
  createUser: vi.fn()
}));

// Partial mock (keep some real implementations)
vi.mock('./utils/validators', async () => {
  const actual = await vi.importActual('./utils/validators');
  return {
    ...actual,
    validateEmail: vi.fn(() => true) // Mock only this function
  };
});

// Mock with factory
vi.mock('./config', () => ({
  API_URL: 'http://test-api.com',
  API_KEY: 'test-key'
}));
```

### Mock timers

```typescript
import { vi, beforeEach, afterEach } from 'vitest';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.restoreAllMocks();
});

test('debounced function', () => {
  const callback = vi.fn();
  const debounced = debounce(callback, 1000);

  debounced();
  debounced();
  debounced();

  // Fast-forward time
  vi.advanceTimersByTime(1000);

  // Callback called only once
  expect(callback).toHaveBeenCalledTimes(1);
});

test('scheduled task', () => {
  const task = vi.fn();

  setTimeout(task, 5000);

  vi.advanceTimersByTime(4999);
  expect(task).not.toHaveBeenCalled();

  vi.advanceTimersByTime(1);
  expect(task).toHaveBeenCalled();
});
```

### Mock localStorage

```typescript
// setupTests.ts
class LocalStorageMock {
  private store: Record<string, string> = {};

  getItem(key: string): string | null {
    return this.store[key] || null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = value;
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  clear(): void {
    this.store = {};
  }
}

global.localStorage = new LocalStorageMock();

// Usage in tests
beforeEach(() => {
  localStorage.clear();
});

test('saves to localStorage', () => {
  localStorage.setItem('token', 'abc123');
  expect(localStorage.getItem('token')).toBe('abc123');
});
```

---

## 📊 Coverage & Quality

### Coverage Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './setupTests.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
        '**/types.ts',
        '**/*.d.ts',
        'vite.config.ts',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80
      }
    }
  }
});
```

### Run Tests with Coverage

```bash
# Run all tests
npm run test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch

# Run specific test file
npm run test Button.test.tsx

# Run E2E tests
npm run test:e2e
```

```json
// package.json scripts
{
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage",
    "test:ui": "vitest --ui",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

### Coverage Thresholds

| Metric | Minimum | Target | Critical Paths |
|--------|---------|--------|----------------|
| **Statements** | 80% | 90% | 100% |
| **Branches** | 75% | 85% | 100% |
| **Functions** | 80% | 90% | 100% |
| **Lines** | 80% | 90% | 100% |

**Critical Paths** (require 100%):
- Authentication logic
- Payment processing
- Data validation
- Security functions

---

## ✅ Testing Checklist

### Before Committing

```markdown
- [ ] All tests pass (`npm run test`)
- [ ] Coverage thresholds met
- [ ] No console errors/warnings
- [ ] E2E tests pass for critical flows
- [ ] Added tests for new features
- [ ] Added tests for bug fixes
```

### For New Features

```markdown
- [ ] Unit tests for components (70% coverage)
- [ ] Unit tests for hooks/utils (90% coverage)
- [ ] Integration tests for component interactions
- [ ] E2E test for happy path
- [ ] Error scenarios tested
- [ ] Edge cases covered
```

### For Bug Fixes

```markdown
- [ ] Test reproduces bug (fails before fix)
- [ ] Test passes after fix
- [ ] Related scenarios tested
- [ ] Regression test added
```

---

## 🎯 Best Practices Summary

```typescript
// ✅ DO: Test behavior, not implementation
test('shows welcome message after login', async () => {
  await login('user@example.com', 'password');
  expect(screen.getByText(/welcome/i)).toBeVisible();
});

// ❌ DON'T: Test internal state
test('sets isLoggedIn to true', () => {
  // Testing implementation details - brittle!
});

// ✅ DO: Use semantic queries
screen.getByRole('button', { name: /submit/i });
screen.getByLabelText(/email/i);
screen.getByText(/welcome/i);

// ❌ DON'T: Use className or testId unless necessary
screen.getByClassName('submit-btn');
screen.getByTestId('submit-button');

// ✅ DO: Test user interactions
await userEvent.click(submitButton);
await userEvent.type(emailInput, 'test@example.com');

// ❌ DON'T: Directly manipulate DOM
emailInput.value = 'test@example.com';

// ✅ DO: Async properly
await waitFor(() => {
  expect(screen.getByText(/success/i)).toBeInTheDocument();
});

// ❌ DON'T: Use arbitrary waits
await sleep(1000); // Flaky!
```

---

## 📚 Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
- [MSW Documentation](https://mswjs.io/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

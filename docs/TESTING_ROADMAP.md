# Testing Roadmap - Bedrijfsbeheer 3.0

**Versie:** 1.0.0
**Aangemaakt:** 2025-01-16
**Status:** 🔵 In Progress (50% Complete)
**Target:** 80% Code Coverage

---

## 📋 Executive Summary

### Current Status
- ✅ Testing framework configured (Jest + React Testing Library)
- ✅ 67 test files created (30,462 lines of test code)
- 🔵 Coverage assessment needed
- ⬜ E2E tests not implemented
- ⬜ Integration tests partial

### Goals
1. **Unit Tests**: 80% coverage for all hooks, services, and utilities
2. **Integration Tests**: Critical cross-module workflows
3. **E2E Tests**: Key user journeys (5-10 scenarios)
4. **Performance Tests**: Load testing for critical operations
5. **CI/CD Integration**: Automated testing in pipeline

---

## 🎯 Testing Strategy

### Testing Pyramid

```
        /\
       /E2E\        5-10 tests (User journeys)
      /------\
     /  INT   \     20-30 tests (Cross-module flows)
    /----------\
   /   UNIT     \   300+ tests (Functions, hooks, services)
  /--------------\
```

### Test Categories

**1. Unit Tests (80% of test effort)**
- All hooks (custom React hooks)
- All services (data operations)
- All utilities (helper functions)
- All validators
- All calculations

**2. Integration Tests (15% of test effort)**
- Cross-module workflows
- API integration (when backend ready)
- State management flows
- Form submissions

**3. E2E Tests (5% of test effort)**
- Critical user journeys
- Full application flows
- Multi-step processes
- Error scenarios

---

## 📊 Current Test Coverage

### Existing Tests (67 files, 30,462 lines)

#### Accounting Module (Best Coverage)
```
features/accounting/
├── hooks/__tests__/
│   ├── useQuotes.test.tsx (246 lines)
│   └── useInvoices.test.tsx (262 lines)
└── services/__tests__/
    ├── quoteService.test.ts (312 lines)
    ├── invoiceService.test.ts (394 lines)
    └── transactionService.test.ts (218 lines)

Total: 1,653 lines of tests
Coverage: ~70% (estimated)
```

#### Other Modules
- Inventory: Tests exist (need verification)
- WorkOrders: Tests exist (need verification)
- CRM: Tests exist (need verification)
- Other modules: Partial or missing

### Coverage Gaps

**Missing Tests:**
- [ ] Dashboard hooks (useAnalytics, useDashboard)
- [ ] POS services (cartService, checkoutService)
- [ ] HRM utilities (employee calculations)
- [ ] Planning components (Calendar, EventForm)
- [ ] Reports aggregation functions
- [ ] Webshop integration flows
- [ ] Cross-module integration tests
- [ ] E2E tests (all)

---

## 🗓️ Testing Roadmap (1-2 weeks)

### Phase 1: Assessment (Week 1, Days 1-2)

**Day 1: Coverage Analysis**
- [x] Count existing test files (67 files ✅)
- [ ] Run coverage report: `npm run test:coverage`
- [ ] Analyze coverage by module
- [ ] Identify critical gaps
- [ ] Prioritize missing tests

**Day 2: Test Audit**
- [ ] Review existing test quality
- [ ] Check test assertions (meaningful vs shallow)
- [ ] Verify test data (realistic scenarios)
- [ ] Update test documentation
- [ ] Create test improvement backlog

### Phase 2: Unit Test Completion (Week 1, Days 3-5)

**Day 3: Core Services**
```
Priority: HIGH
Target: 90% coverage

Tests to write:
- [ ] inventoryService.ts (stock operations)
- [ ] posService.ts (cart & checkout)
- [ ] dashboardService.ts (analytics)
- [ ] crmService.ts (pipeline operations)
- [ ] workOrderService.ts (Kanban operations)

Estimated: 15-20 test files, ~3,000 lines
```

**Day 4: Hooks & State**
```
Priority: HIGH
Target: 85% coverage

Tests to write:
- [ ] useInventory hook
- [ ] usePOS hook
- [ ] useDashboard hook
- [ ] useWorkOrders hook
- [ ] useCRM hook
- [ ] useHRM hook
- [ ] usePlanning hook
- [ ] useReports hook
- [ ] useWebshop hook

Estimated: 10-15 test files, ~2,500 lines
```

**Day 5: Utils & Validators**
```
Priority: MEDIUM
Target: 95% coverage (utils should be easiest to test)

Tests to write:
- [ ] Validation functions (all modules)
- [ ] Calculation functions (BTW, totals, discounts)
- [ ] Filter functions (search, sort, filter)
- [ ] Date/time utilities
- [ ] Formatting utilities
- [ ] Helper functions

Estimated: 15-20 test files, ~2,000 lines
```

### Phase 3: Integration Tests (Week 2, Days 1-2)

**Day 1: Cross-Module Workflows**
```
Priority: HIGH
Target: 20 integration tests

Workflows to test:
- [ ] POS → Inventory sync (product sale updates stock)
- [ ] WorkOrder → Inventory (material depletion)
- [ ] Quote → Invoice conversion
- [ ] Invoice → Bookkeeping transaction
- [ ] CRM Lead → Quote → Invoice flow
- [ ] Employee → WorkOrder assignment
- [ ] Dashboard data aggregation
- [ ] WebShop → Inventory sync
- [ ] Calendar → WorkOrder integration
- [ ] Report generation workflows

Estimated: 10 test files, ~3,000 lines
```

**Day 2: State Management Integration**
```
Priority: MEDIUM
Target: 10 integration tests

State flows to test:
- [ ] Authentication state (login, logout, RBAC)
- [ ] Global state updates (cross-module)
- [ ] Notifications system
- [ ] Settings persistence
- [ ] Module enable/disable
- [ ] User preferences
- [ ] Cache invalidation
- [ ] Optimistic updates
- [ ] Error recovery
- [ ] Concurrent operations

Estimated: 5 test files, ~1,500 lines
```

### Phase 4: E2E Tests (Week 2, Days 3-4)

**Day 3: Setup E2E Framework**
```
Tools: Playwright or Cypress

Tasks:
- [ ] Install Playwright
- [ ] Configure test environment
- [ ] Setup test database
- [ ] Create page objects
- [ ] Setup CI/CD integration
- [ ] Write first E2E test (smoke test)

Estimated: 1 day setup
```

**Day 4: Critical User Journeys**
```
Priority: HIGH
Target: 5-10 E2E tests

Journeys to test:
1. [ ] User Login → Dashboard → Logout
2. [ ] Create Quote → Convert to Invoice → View in Accounting
3. [ ] Add Product → Sell in POS → Verify Stock Update
4. [ ] Create WorkOrder → Assign Employee → Complete
5. [ ] Add CRM Lead → Move through Pipeline → Convert
6. [ ] Create Employee → Assign to WorkOrder → View in Planning
7. [ ] Generate Report → Export → Verify Data
8. [ ] WebShop Order → Process → Inventory Update
9. [ ] Email Integration → Create WorkOrder → Track
10. [ ] Settings → Toggle Module → Verify UI Update

Estimated: 5-8 test files, ~2,000 lines
```

### Phase 5: Review & Optimization (Week 2, Day 5)

**Final Day: QA & Documentation**
- [ ] Run full test suite
- [ ] Fix flaky tests
- [ ] Optimize slow tests
- [ ] Review coverage report (target: 80%)
- [ ] Document test patterns
- [ ] Update README with test instructions
- [ ] Create test contribution guide
- [ ] CI/CD pipeline integration
- [ ] Performance baseline measurements

---

## 📝 Test Writing Guidelines

### Unit Test Template

```typescript
// features/[module]/services/__tests__/exampleService.test.ts

import { describe, it, expect, beforeEach } from '@jest/globals';
import { exampleService } from '../exampleService';

describe('exampleService', () => {
  describe('functionName', () => {
    it('should handle normal case', () => {
      // Arrange
      const input = { /* test data */ };

      // Act
      const result = exampleService.functionName(input);

      // Assert
      expect(result).toEqual({ /* expected output */ });
    });

    it('should handle edge cases', () => {
      // Test empty input, null, undefined, etc.
    });

    it('should throw error for invalid input', () => {
      expect(() => exampleService.functionName(null))
        .toThrow('Expected error message');
    });
  });
});
```

### React Hook Test Template

```typescript
// features/[module]/hooks/__tests__/useExample.test.tsx

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import { useExample } from '../useExample';

describe('useExample', () => {
  it('should initialize with correct state', () => {
    const { result } = renderHook(() => useExample());

    expect(result.current.data).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it('should update state correctly', () => {
    const { result } = renderHook(() => useExample());

    act(() => {
      result.current.updateData({ /* new data */ });
    });

    expect(result.current.data).toHaveLength(1);
  });
});
```

### Integration Test Template

```typescript
// __tests__/integration/pos-inventory.test.ts

import { describe, it, expect, beforeEach } from '@jest/globals';
import { posService } from '@/features/pos/services/posService';
import { inventoryService } from '@/features/inventory/services/inventoryService';

describe('POS → Inventory Integration', () => {
  beforeEach(() => {
    // Reset state
  });

  it('should update inventory when product is sold', async () => {
    // Arrange
    const product = { id: '1', name: 'Test', stock: 10 };
    await inventoryService.addProduct(product);

    // Act
    await posService.sellProduct('1', 2);

    // Assert
    const updatedProduct = await inventoryService.getProduct('1');
    expect(updatedProduct.stock).toBe(8);
  });
});
```

### E2E Test Template (Playwright)

```typescript
// e2e/critical-flows/quote-to-invoice.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Quote to Invoice Flow', () => {
  test('should create quote and convert to invoice', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('[name="email"]', 'admin@example.com');
    await page.fill('[name="password"]', 'password');
    await page.click('button[type="submit"]');

    // Create quote
    await page.goto('/accounting');
    await page.click('text=Nieuwe Offerte');
    await page.fill('[name="customerName"]', 'Test Customer');
    await page.fill('[name="amount"]', '1000');
    await page.click('button:has-text("Opslaan")');

    // Verify quote created
    await expect(page.locator('text=Test Customer')).toBeVisible();

    // Convert to invoice
    await page.click('button:has-text("Maak Factuur")');
    await expect(page.locator('text=Factuur aangemaakt')).toBeVisible();

    // Verify invoice exists
    await page.click('text=Facturen');
    await expect(page.locator('text=Test Customer')).toBeVisible();
  });
});
```

---

## 🔧 Testing Tools & Setup

### Required Dependencies

```json
{
  "devDependencies": {
    "@testing-library/react": "^16.1.0",
    "@testing-library/dom": "^10.4.0",
    "@types/jest": "^29.5.14",
    "jest": "^30.1.3",
    "jest-environment-jsdom": "^30.1.3",
    "ts-jest": "^29.2.5",
    "@playwright/test": "^1.40.0",  // Add for E2E
    "supertest": "^7.1.4"  // Already installed (API testing)
  }
}
```

### Jest Configuration (jest.config.cjs)

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>'],
  testMatch: ['**/__tests__/**/*.test.ts?(x)'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'features/**/*.{ts,tsx}',
    'hooks/**/*.{ts,tsx}',
    'services/**/*.{ts,tsx}',
    'utils/**/*.{ts,tsx}',
    '!**/__tests__/**',
    '!**/node_modules/**',
    '!**/*.d.ts',
  ],
  coverageThresholds: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

### Playwright Configuration

```typescript
// playwright.config.ts (to be created)

import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  retries: 2,
  use: {
    baseURL: 'http://localhost:5173',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
    {
      name: 'firefox',
      use: { browserName: 'firefox' },
    },
  ],
});
```

---

## 📈 Success Metrics

### Coverage Targets

| Category | Target | Current | Gap |
|----------|--------|---------|-----|
| Overall | 80% | TBD | TBD |
| Services | 90% | ~70% | ~20% |
| Hooks | 85% | ~50% | ~35% |
| Utils | 95% | ~60% | ~35% |
| Components | 70% | ~30% | ~40% |
| Integration | 20 tests | 0 | 20 |
| E2E | 10 tests | 0 | 10 |

### Quality Metrics

**Test Quality Indicators:**
- [ ] All tests pass (0 failures)
- [ ] No flaky tests (99% reliability)
- [ ] Test execution < 2 minutes (unit tests)
- [ ] Meaningful assertions (not just smoke tests)
- [ ] Realistic test data
- [ ] Edge cases covered
- [ ] Error scenarios tested
- [ ] Performance baselines established

---

## 🚀 CI/CD Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml (to be created)

name: Tests

on:
  push:
    branches: [main, develop, claude/*]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '22'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json

      - name: Run E2E tests
        run: npx playwright test

      - name: Upload E2E results
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

---

## 📚 Test Documentation

### Required Documentation

1. **README.md** - Add testing section:
   ```markdown
   ## Testing

   ### Run all tests
   npm test

   ### Run with coverage
   npm run test:coverage

   ### Run E2E tests
   npx playwright test

   ### Watch mode
   npm run test:watch
   ```

2. **TESTING_GUIDE.md** - Detailed guide:
   - How to write tests
   - Test patterns
   - Mocking strategies
   - Best practices
   - Troubleshooting

3. **Test Coverage Report** - Generate HTML report:
   ```bash
   npm run test:coverage
   # Open coverage/lcov-report/index.html
   ```

---

## 🎯 Next Steps

### Immediate Actions (This Week)

1. [ ] Run coverage analysis: `npm run test:coverage`
2. [ ] Review coverage report
3. [ ] Prioritize missing critical tests
4. [ ] Write 5-10 high-priority tests
5. [ ] Setup CI/CD pipeline

### Short Term (2 Weeks)

1. [ ] Complete all unit tests (80% coverage)
2. [ ] Write integration tests (20 tests)
3. [ ] Setup E2E framework
4. [ ] Write critical E2E tests (5-10)
5. [ ] Document testing process

### Long Term (1 Month)

1. [ ] Maintain 80%+ coverage
2. [ ] Expand E2E test suite
3. [ ] Add performance tests
4. [ ] Continuous improvement
5. [ ] Test automation excellence

---

**Status:** 🔵 IN PROGRESS
**Last Updated:** 2025-01-16
**Next Review:** After Phase 1 completion
**Target Completion:** 2025-01-30

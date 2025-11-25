# Employee Experience User Stories
## Bedrijfsbeheer Dashboard 2.0

---

## 🎭 User Personas

### 1. **Sarah - Production Worker**
- Age: 28
- Role: Production/Field Technician
- Tech Savvy: Medium
- Primary Tasks: Complete work orders, log time, check materials
- Devices: Desktop at office, mobile in field
- Pain Points: Too many clicks, hard to find her work, forgets to log time

### 2. **Mark - Sales Representative**
- Age: 35
- Role: Sales
- Tech Savvy: High
- Primary Tasks: Create quotes, manage customers, track leads
- Devices: Laptop, mobile
- Pain Points: Slow quote creation, no templates, missing customer context

### 3. **Lisa - Accountant**
- Age: 42
- Role: Financial Administration
- Tech Savvy: Medium
- Primary Tasks: Process invoices, VAT reporting, bookkeeping
- Devices: Desktop
- Pain Points: Can't make manual entries, hard to find transactions

### 4. **Tom - Warehouse Worker**
- Age: 31
- Role: Warehouse/Inventory
- Tech Savvy: Low
- Primary Tasks: Stock management, picking orders, receiving goods
- Devices: Tablet in warehouse
- Pain Points: No barcode scanner, slow stock adjustments

### 5. **Emma - HR Manager**
- Age: 38
- Role: Human Resources
- Tech Savvy: Medium
- Primary Tasks: Employee management, leave approval, payroll
- Devices: Desktop
- Pain Points: Employees constantly asking for payslips, manual leave tracking

---

## 📋 User Stories with Acceptance Criteria

### Epic 1: Personal Dashboard & Navigation

#### Story 1.1: Personal Dashboard Widget
**As** Sarah (Production Worker)  
**I want** to see my assigned work orders on the dashboard  
**So that** I can quickly see what I need to work on today

**Acceptance Criteria:**
- [ ] Dashboard shows "My Today" widget
- [ ] Widget displays my work orders count by status
- [ ] Widget displays my tasks count (todo, overdue)
- [ ] Widget displays my appointments for today
- [ ] Widget has quick action buttons: "Log Time", "New Work Order"
- [ ] Widget only shows items assigned to me
- [ ] Widget updates in real-time when I complete tasks
- [ ] Widget is collapsible/expandable

**Technical Notes:**
```typescript
interface MyTodayWidget {
  workOrders: {
    inProgress: number;
    toDo: number;
    pending: number;
  };
  tasks: {
    todo: number;
    overdue: number;
    dueToday: number;
  };
  appointments: Appointment[];
}
```

---

#### Story 1.2: Global Search
**As** Mark (Sales Rep)  
**I want** to search across all modules from one search bar  
**So that** I can quickly find customers, products, or invoices without navigating

**Acceptance Criteria:**
- [ ] Search bar visible in top navigation
- [ ] Search bar has placeholder: "Search customers, products, invoices..."
- [ ] Search works across: customers, products, invoices, quotes, work orders
- [ ] Results are grouped by type
- [ ] Results show relevant info (name, ID, amount, etc.)
- [ ] Clicking result navigates to detail page
- [ ] Search supports partial matches
- [ ] Search is case-insensitive
- [ ] Search shows "No results" message when empty
- [ ] Keyboard shortcut: Ctrl+F opens search

**Technical Notes:**
```typescript
interface SearchResult {
  type: 'customer' | 'product' | 'invoice' | 'quote' | 'workorder';
  id: string;
  title: string;
  subtitle: string;
  url: string;
}
```

---

#### Story 1.3: Employee Profile Section
**As** any employee  
**I want** to see my profile and role in the sidebar  
**So that** I know who I'm logged in as and can access my settings

**Acceptance Criteria:**
- [ ] Profile section visible at top/bottom of sidebar
- [ ] Shows profile picture (or initials if no picture)
- [ ] Shows full name
- [ ] Shows role/job title
- [ ] Has "My Profile" button
- [ ] Has "Logout" button
- [ ] Clicking "My Profile" opens profile page
- [ ] Clicking "Logout" logs out and redirects to login

---

### Epic 2: Work Orders Optimization

#### Story 2.1: My Work Orders Filter
**As** Sarah (Production Worker)  
**I want** to filter work orders to show only mine  
**So that** I'm not overwhelmed by everyone else's work

**Acceptance Criteria:**
- [ ] Toggle button: "All Work Orders" / "My Work Orders"
- [ ] "My Work Orders" shows only work orders assigned to me
- [ ] Filter persists across page refreshes (localStorage)
- [ ] Badge shows count: "My Work Orders (5)"
- [ ] Works with existing status filters
- [ ] Works with search functionality
- [ ] Default view is "My Work Orders" for non-admin users

---

#### Story 2.2: Quick Time Entry
**As** Sarah (Production Worker)  
**I want** to log time directly from the work order card  
**So that** I don't have to open the full work order

**Acceptance Criteria:**
- [ ] Each work order card has "Log Time" button
- [ ] Clicking opens quick modal
- [ ] Modal shows work order title
- [ ] Modal has hours input field
- [ ] Modal has "Start Timer" / "Stop Timer" buttons
- [ ] Timer tracks time in real-time
- [ ] Saving updates work order hours
- [ ] Success toast shown after saving
- [ ] Modal closes after saving
- [ ] Can log time in increments of 0.25 hours

**Technical Notes:**
```typescript
interface TimeEntry {
  workOrderId: string;
  hours: number;
  startTime?: Date;
  endTime?: Date;
  employeeId: string;
  notes?: string;
}
```

---

#### Story 2.3: Mobile List View
**As** Sarah (Production Worker)  
**I want** a list view option for work orders on mobile  
**So that** I can easily view and update work orders in the field

**Acceptance Criteria:**
- [ ] Toggle button: "Kanban" / "List"
- [ ] List view shows work orders as cards
- [ ] Each card shows: title, status badge, due date, customer
- [ ] Each card has quick actions: "Update Status", "Log Time"
- [ ] Cards are swipeable for quick actions
- [ ] List is sorted by due date (earliest first)
- [ ] Works on mobile and tablet
- [ ] View preference persists

---

### Epic 3: Notifications & Feedback

#### Story 3.1: Toast Notification System
**As** any employee  
**I want** to see confirmation messages when I perform actions  
**So that** I know my actions succeeded or failed

**Acceptance Criteria:**
- [ ] Toast appears in top-right corner
- [ ] 4 types: success (green), error (red), info (blue), warning (yellow)
- [ ] Toast shows for 3 seconds (configurable)
- [ ] Toast has close button
- [ ] Multiple toasts stack vertically
- [ ] Toast has icon matching type
- [ ] Toast auto-dismisses after timeout
- [ ] Toast is accessible (screen reader support)

**Examples:**
- Success: "Work order created successfully!"
- Error: "Failed to save. Please try again."
- Info: "Invoice sent to customer"
- Warning: "Low stock alert for Product X"

**Technical Notes:**
```typescript
interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number; // milliseconds
}

function showToast(message: string, type: ToastType, duration?: number): void;
```

---

#### Story 3.2: Confirmation Dialogs
**As** any employee  
**I want** to confirm before deleting important data  
**So that** I don't accidentally lose information

**Acceptance Criteria:**
- [ ] Confirmation dialog appears before delete actions
- [ ] Dialog shows what will be deleted
- [ ] Dialog has "Cancel" and "Delete" buttons
- [ ] "Delete" button is red/destructive
- [ ] Pressing Esc cancels
- [ ] Clicking outside dialog cancels
- [ ] Confirmation required for: delete work order, customer, invoice, quote, product
- [ ] Optional: "Don't ask again" checkbox for power users

**Example:**
```
Delete Work Order?

Are you sure you want to delete "Install New System"?
This action cannot be undone.

[Cancel] [Delete]
```

---

#### Story 3.3: Loading States
**As** any employee  
**I want** to see when the system is saving or loading  
**So that** I know to wait and don't click multiple times

**Acceptance Criteria:**
- [ ] Save buttons show "Saving..." when processing
- [ ] Save buttons show checkmark when saved
- [ ] Forms disable during save
- [ ] Loading spinner shows for async operations
- [ ] "Saved" indicator shows for 2 seconds
- [ ] Error state shows if save fails

**Example:**
```
[Save] → [Saving...] → [Saved ✓] → [Save]
```

---

### Epic 4: POS Improvements

#### Story 4.1: Fix Payment Modal Bug
**As** Tom (Cashier)  
**I want** the payment modal to close after payment  
**So that** I can process the next customer

**Acceptance Criteria:**
- [ ] Clicking "Confirm Payment" processes payment
- [ ] Modal closes after successful payment
- [ ] Cart clears after successful payment
- [ ] Success toast shows: "Payment successful!"
- [ ] Receipt auto-prints (if enabled)
- [ ] Inventory updates immediately
- [ ] Transaction recorded in system
- [ ] Can process next transaction immediately

**Bug Fix Notes:**
```typescript
// Current bug: Modal stays open, cart not cleared
// Fix: Ensure handlePaymentComplete calls:
// 1. clearCart()
// 2. closeModal()
// 3. showToast()
// 4. printReceipt() (optional)
```

---

#### Story 4.2: Transaction History
**As** Tom (Cashier)  
**I want** to view today's transactions  
**So that** I can void or reprint receipts if needed

**Acceptance Criteria:**
- [ ] "View Today's Sales" button in POS
- [ ] Shows list of transactions with: time, items, total, payment method
- [ ] Each transaction has actions: "Void", "Reprint Receipt", "Refund"
- [ ] Can filter by payment method
- [ ] Shows running total for cash drawer
- [ ] Can search by customer or item
- [ ] Voiding requires confirmation
- [ ] Voided transactions marked clearly

---

#### Story 4.3: Keyboard Shortcuts
**As** Tom (Cashier)  
**I want** keyboard shortcuts for payment methods  
**So that** I can process transactions faster

**Acceptance Criteria:**
- [ ] F1 = Cash payment
- [ ] F2 = PIN payment
- [ ] F3 = iDEAL payment
- [ ] F4 = Credit Card payment
- [ ] Enter = Checkout
- [ ] Esc = Cancel/Clear cart
- [ ] F12 = Open cash drawer
- [ ] Shortcuts shown in UI (tooltips)
- [ ] Shortcuts work when modal open
- [ ] Shortcuts documented in help

---

### Epic 5: Inventory Optimization

#### Story 5.1: Quick Stock Adjustment
**As** Tom (Warehouse Worker)  
**I want** to quickly adjust stock quantities  
**So that** I can do stock counts efficiently

**Acceptance Criteria:**
- [ ] Each inventory item has "Adjust Stock" button
- [ ] Clicking opens quick modal
- [ ] Modal shows current stock
- [ ] Has +/- buttons for quick adjustments
- [ ] Has custom input field
- [ ] Has reason dropdown: Received, Sold, Damaged, Count Correction
- [ ] Has optional notes field
- [ ] Saves adjustment to history
- [ ] Shows who made adjustment and when
- [ ] Success toast after saving

**Technical Notes:**
```typescript
interface StockAdjustment {
  itemId: string;
  previousQuantity: number;
  newQuantity: number;
  adjustment: number; // +/- amount
  reason: 'received' | 'sold' | 'damaged' | 'correction';
  notes?: string;
  employeeId: string;
  timestamp: Date;
}
```

---

#### Story 5.2: Barcode Scanner Support
**As** Tom (Warehouse Worker)  
**I want** to scan barcodes to find products  
**So that** I can work faster and avoid typing errors

**Acceptance Criteria:**
- [ ] Inventory items have barcode field
- [ ] Search supports barcode lookup
- [ ] Camera icon to scan with device camera
- [ ] Supports USB barcode scanners
- [ ] Beep sound on successful scan
- [ ] Error message if barcode not found
- [ ] Can add barcode when creating item
- [ ] Supports multiple barcode formats (EAN-13, UPC, etc.)

---

#### Story 5.3: Stock Movement History
**As** Tom (Warehouse Worker)  
**I want** to see stock movement history  
**So that** I can track where inventory went

**Acceptance Criteria:**
- [ ] Each item has "History" tab
- [ ] Shows all stock changes with: date, type, quantity, employee, reason
- [ ] Can filter by date range
- [ ] Can filter by type (in/out)
- [ ] Can export to CSV
- [ ] Shows running balance
- [ ] Color-coded: green for increases, red for decreases

---

### Epic 6: CRM Enhancements

#### Story 6.1: Quick Interaction Logging
**As** Mark (Sales Rep)  
**I want** to quickly log a call or email  
**So that** I don't have to fill out a long form

**Acceptance Criteria:**
- [ ] "Quick Log" button in CRM
- [ ] Modal with minimal fields: Type, Customer, Note
- [ ] Type dropdown: Call, Email, Meeting, Note
- [ ] Customer search/dropdown
- [ ] Note field (required)
- [ ] Optional: Schedule follow-up checkbox
- [ ] Saves interaction
- [ ] Success toast
- [ ] Can expand to full form if needed

---

#### Story 6.2: Context Panel
**As** Mark (Sales Rep)  
**I want** to see customer context when creating interactions  
**So that** I don't duplicate efforts

**Acceptance Criteria:**
- [ ] Right sidebar shows customer info
- [ ] Shows: name, company, phone, email
- [ ] Shows last 3 interactions
- [ ] Shows outstanding tasks
- [ ] Shows recent quotes/invoices
- [ ] Updates when customer selected
- [ ] Collapsible to save space

---

#### Story 6.3: My Tasks Dashboard
**As** Mark (Sales Rep)  
**I want** to see my tasks on the CRM home page  
**So that** I know what to do today

**Acceptance Criteria:**
- [ ] CRM home shows "My Tasks" widget
- [ ] Shows tasks due today
- [ ] Shows overdue tasks (highlighted)
- [ ] Shows my leads by status
- [ ] Has quick actions: "New Task", "New Lead"
- [ ] Can mark tasks complete from widget
- [ ] Can click task to see details

---

### Epic 7: Accounting Efficiency

#### Story 7.1: Quote Creation Wizard
**As** Mark (Sales Rep)  
**I want** a step-by-step wizard for creating quotes  
**So that** I don't miss important information

**Acceptance Criteria:**
- [ ] "Create Quote" opens wizard
- [ ] Step 1: Customer & Basic Info
- [ ] Step 2: Add Items
- [ ] Step 3: Add Labor (optional)
- [ ] Step 4: Review & Pricing
- [ ] Step 5: Terms & Notes
- [ ] Progress indicator shows current step
- [ ] Can go back to previous steps
- [ ] Can save as draft at any step
- [ ] Validation at each step
- [ ] Final review before creating

---

#### Story 7.2: Quote Templates
**As** Mark (Sales Rep)  
**I want** to save quotes as templates  
**So that** I can reuse common quotes

**Acceptance Criteria:**
- [ ] "Save as Template" button on quote
- [ ] Template name input
- [ ] Template saved with all items and settings
- [ ] "Use Template" button when creating quote
- [ ] Template library shows all templates
- [ ] Can edit templates
- [ ] Can delete templates
- [ ] Using template pre-fills quote form

---

#### Story 7.3: Payment Recording
**As** Lisa (Accountant)  
**I want** to record payment details when marking invoice paid  
**So that** I have complete financial records

**Acceptance Criteria:**
- [ ] "Mark as Paid" opens modal
- [ ] Modal has: payment date, amount, method, reference, notes
- [ ] Payment date defaults to today
- [ ] Amount defaults to invoice total
- [ ] Payment method dropdown: Bank Transfer, Cash, PIN, iDEAL, Credit Card
- [ ] Reference field for transaction ID
- [ ] Saves payment record
- [ ] Links payment to invoice
- [ ] Shows payment info on invoice

**Technical Notes:**
```typescript
interface Payment {
  id: string;
  invoiceId: string;
  date: Date;
  amount: number;
  method: PaymentMethod;
  reference?: string;
  notes?: string;
  recordedBy: string;
}
```

---

### Epic 8: Bookkeeping Completeness

#### Story 8.1: Manual Journal Entry Form
**As** Lisa (Accountant)  
**I want** to create manual journal entries  
**So that** I can make corrections and adjustments

**Acceptance Criteria:**
- [ ] "New Journal Entry" button
- [ ] Form has: date, description, reference
- [ ] Can add multiple lines
- [ ] Each line has: account dropdown, debit, credit
- [ ] Account dropdown searchable
- [ ] Shows running total of debits and credits
- [ ] Validates debits = credits before saving
- [ ] Shows error if unbalanced
- [ ] Saves entry with source type "manual"
- [ ] Shows in journal list
- [ ] Can edit manual entries (auto-generated are read-only)

**Validation:**
```typescript
// Must validate:
// 1. At least 2 lines
// 2. Total debits = Total credits
// 3. All accounts selected
// 4. At least one debit and one credit
```

---

#### Story 8.2: Journal Search & Filter
**As** Lisa (Accountant)  
**I want** to search and filter journal entries  
**So that** I can find specific transactions

**Acceptance Criteria:**
- [ ] Search bar for description/reference
- [ ] Date range filter
- [ ] Account filter dropdown
- [ ] Source type filter: All, Invoice, POS, Manual, Packing Slip
- [ ] Filters work together (AND logic)
- [ ] Results update in real-time
- [ ] Can clear all filters
- [ ] Can export filtered results

---

#### Story 8.3: Clickable Financial Overview
**As** Lisa (Accountant)  
**I want** to click on items in financial overview  
**So that** I can see details without searching

**Acceptance Criteria:**
- [ ] Invoice numbers are clickable
- [ ] Clicking invoice number opens invoice detail
- [ ] Customer names are clickable
- [ ] Clicking customer opens customer dossier
- [ ] Product names are clickable
- [ ] Clicking product opens product detail
- [ ] Hover shows tooltip with quick info
- [ ] Links open in same page (not new tab)

---

### Epic 9: HRM Self-Service

#### Story 9.1: Employee Self-Service Portal
**As** any employee  
**I want** to view my personal information  
**So that** I don't have to ask HR for basic info

**Acceptance Criteria:**
- [ ] "My Profile" page accessible to all employees
- [ ] Shows personal info (read-only)
- [ ] Shows contact info (editable)
- [ ] Shows emergency contacts (editable)
- [ ] Shows leave balance
- [ ] Shows employment details (read-only)
- [ ] Can update own contact info
- [ ] Changes require HR approval
- [ ] Success toast after saving

---

#### Story 9.2: Leave Request Workflow
**As** any employee  
**I want** to request leave through the system  
**So that** I don't have to email my manager

**Acceptance Criteria:**
- [ ] "Request Leave" button in My Profile
- [ ] Form has: type, from date, to date, reason
- [ ] Auto-calculates number of days
- [ ] Shows remaining leave balance
- [ ] Validates sufficient balance
- [ ] Submits for manager approval
- [ ] Email sent to manager
- [ ] Manager can approve/reject
- [ ] Email sent back to employee
- [ ] Approved leave shows on calendar
- [ ] Can view leave request status

**Technical Notes:**
```typescript
interface LeaveRequest {
  id: string;
  employeeId: string;
  type: 'vacation' | 'sick' | 'personal' | 'parental';
  startDate: Date;
  endDate: Date;
  days: number;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedDate: Date;
  reviewedBy?: string;
  reviewedDate?: Date;
  reviewNotes?: string;
}
```

---

#### Story 9.3: Team Leave Calendar
**As** Emma (HR Manager)  
**I want** to see who's off when  
**So that** I can avoid scheduling conflicts

**Acceptance Criteria:**
- [ ] Calendar view in HRM
- [ ] Shows all approved leave
- [ ] Color-coded by leave type
- [ ] Can filter by department/team
- [ ] Can filter by leave type
- [ ] Shows employee name on calendar
- [ ] Can export to iCal
- [ ] Can print calendar

---

### Epic 10: Planning Enhancements

#### Story 10.1: Personal Calendar Filter
**As** Sarah (Production Worker)  
**I want** to see only my calendar events  
**So that** I'm not overwhelmed

**Acceptance Criteria:**
- [ ] Filter checkboxes: My Events, Team Events, Company Events
- [ ] "My Events" shows only events assigned to me
- [ ] Filters work together
- [ ] Filter state persists
- [ ] Badge shows count per filter

---

#### Story 10.2: Drag-and-Drop Rescheduling
**As** Sarah (Production Worker)  
**I want** to drag events to reschedule them  
**So that** I don't have to edit the form

**Acceptance Criteria:**
- [ ] Can drag events to new time slots
- [ ] Shows preview while dragging
- [ ] Validates no conflicts
- [ ] Shows warning if conflict
- [ ] Saves new time on drop
- [ ] Success toast after rescheduling
- [ ] Updates related work orders

---

#### Story 10.3: Calendar Sync
**As** any employee  
**I want** to sync calendar to Google/Outlook  
**So that** I have one calendar

**Acceptance Criteria:**
- [ ] Settings page has calendar sync section
- [ ] Can generate iCal feed URL
- [ ] Can copy URL to clipboard
- [ ] Instructions for Google Calendar
- [ ] Instructions for Outlook
- [ ] Sync is one-way (read-only)
- [ ] Updates every 15 minutes

---

## 🎯 Definition of Done

For each user story to be considered complete:

- [ ] Code implemented and tested
- [ ] All acceptance criteria met
- [ ] Unit tests written (if applicable)
- [ ] Manual testing completed
- [ ] Responsive design verified (mobile, tablet, desktop)
- [ ] Accessibility checked (keyboard navigation, screen reader)
- [ ] Browser compatibility tested (Chrome, Firefox, Edge)
- [ ] Code reviewed by peer
- [ ] Documentation updated
- [ ] Deployed to staging environment
- [ ] Product owner approval
- [ ] No critical bugs

---

## 📊 Story Point Estimates

| Epic | Stories | Total Points | Priority |
|------|---------|--------------|----------|
| Personal Dashboard & Navigation | 3 | 13 | HIGH |
| Work Orders Optimization | 3 | 13 | HIGH |
| Notifications & Feedback | 3 | 8 | CRITICAL |
| POS Improvements | 3 | 8 | CRITICAL |
| Inventory Optimization | 3 | 13 | MEDIUM |
| CRM Enhancements | 3 | 8 | MEDIUM |
| Accounting Efficiency | 3 | 13 | MEDIUM |
| Bookkeeping Completeness | 3 | 13 | HIGH |
| HRM Self-Service | 3 | 21 | HIGH |
| Planning Enhancements | 3 | 8 | MEDIUM |

**Total:** 30 stories, 118 story points

**Sprint Planning:**
- Sprint 1 (Critical): 16 points
- Sprint 2 (High Priority): 52 points
- Sprint 3 (Medium Priority): 50 points

---

## 🚀 Release Plan

### Release 1.0 (Week 1) - Critical Fixes
- Fix POS payment modal bug
- Toast notification system
- Confirmation dialogs
- Loading states

### Release 1.1 (Week 2) - Personalization
- Personal dashboard widget
- Employee profile section
- Global search
- My Work Orders filter

### Release 1.2 (Week 3) - Workflow Efficiency
- Quick time entry
- Quick interaction logging
- Manual journal entry
- Keyboard shortcuts

### Release 2.0 (Week 4) - Self-Service
- Employee self-service portal
- Leave request workflow
- Team leave calendar

### Release 2.1 (Month 2) - Advanced Features
- Barcode scanner
- Quote templates
- Calendar sync
- Payment recording

---

**Document Version:** 1.0  
**Last Updated:** November 23, 2025  
**Next Review:** After Sprint 1

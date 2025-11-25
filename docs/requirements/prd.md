# Product Requirements Document (PRD)
## Bedrijfsbeheer Dashboard 2.0

**Version:** 5.8.0  
**Document Date:** December 2024  
**Status:** Production Ready  
**Target Audience:** Business Management System for Small to Medium Enterprises (MKB)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [System Overview](#system-overview)
3. [Core Modules](#core-modules)
4. [Technical Architecture](#technical-architecture)
5. [User Roles & Permissions](#user-roles--permissions)
6. [Detailed Feature Specifications](#detailed-feature-specifications)
7. [Workflows & Integrations](#workflows--integrations)
8. [Data Models](#data-models)
9. [User Interface & Experience](#user-interface--experience)
10. [Security & Compliance](#security--compliance)
11. [Performance Requirements](#performance-requirements)
12. [Future Roadmap](#future-roadmap)

---

## 1. Executive Summary

### 1.1 Product Vision
Bedrijfsbeheer Dashboard 2.0 is a comprehensive, integrated business management system designed for small to medium enterprises (MKB) in the Netherlands. The system provides a unified platform for managing all aspects of business operations including inventory, sales, accounting, customer relationships, human resources, and production workflows.

### 1.2 Key Value Propositions
- **Unified Platform**: All business functions integrated in one system
- **Dutch Compliance**: NL-compliant accounting, BTW (VAT) handling, and financial reporting
- **Email Integration**: Automated workflow creation from email drag-and-drop
- **Real-time Visibility**: Dashboard with KPIs and real-time notifications
- **Mobile-First Design**: Fully responsive interface for all devices
- **Role-Based Access**: Granular permissions for different user roles
- **Workflow Automation**: Seamless conversion between quotes, work orders, and invoices

### 1.3 Target Users
- **Admin/Manager**: Full system access, module configuration, employee management
- **Employees**: Task-specific access, personal workboard, time tracking
- **Accountants**: Financial reporting, bookkeeping, VAT declarations
- **Sales Team**: CRM, lead management, quote generation
- **Production Team**: Work order management, inventory tracking

---

## 2. System Overview

### 2.1 Architecture Pattern
- **Frontend**: React 19 with TypeScript
- **State Management**: React Hooks (useState, useMemo) with centralized state in App component
- **Styling**: Tailwind CSS 4
- **Routing**: React Router 7
- **Build Tool**: Vite 6
- **Testing**: Jest with React Testing Library
- **Deployment**: Electron support for desktop application

### 2.2 Module Structure
The system consists of 12 core modules:
1. Dashboard
2. Inventory Management
3. Point of Sale (POS)
4. Work Orders
5. Accounting (Quotes & Invoices)
6. Bookkeeping & Dossier
7. CRM (Customer Relationship Management)
8. HRM (Human Resource Management)
9. Planning & Calendar
10. Reports & Analytics
11. Webshop Management
12. Admin Settings

### 2.3 Data Flow
- Centralized state management in App.tsx
- Immutable state updates using spread operators
- Feature-based module organization (features/accounting, features/crm, etc.)
- Service layer for business logic
- Utility functions for calculations and formatting

---

## 3. Core Modules

### 3.1 Dashboard Module
**Purpose**: Central overview of business activities with real-time KPIs and email integration.

**Key Features**:
- **KPI Cards**: Display total sales, low stock items, orders in progress, pending orders
- **Email Drop Zone**: Drag-and-drop .eml files from Outlook for automatic processing
- **Email Preview Modal**: Review parsed email content, select customer, create quote/work order
- **Notifications Panel**: Real-time alerts for important events
- **Low Stock Warnings**: Visual alerts for items below reorder level
- **Recent Work Orders**: Quick view of latest work orders with status

**Email Integration Workflow**:
1. User drags .eml file to drop zone
2. System parses email content (subject, body, sender, date)
3. System attempts automatic customer matching via email address
4. User reviews parsed email in preview modal
5. User selects customer (or confirms auto-match)
6. User can create quote + work order directly
7. System creates quote and work order with email context
8. Email-customer mapping is saved for future automatic matching

**Technical Implementation**:
- Email parsing via `emlParser.ts`
- Customer matching via `emailCustomerMapping.ts`
- Quote parsing via `emailQuoteParser.ts`
- Persistent storage of email-customer mappings in localStorage

---

### 3.2 Inventory Management Module
**Purpose**: Comprehensive inventory tracking with multiple SKU types, categories, and supplier management.

**Key Features**:

#### 3.2.1 SKU Management (3 Types)
- **Supplier SKU**: SKU from supplier (e.g., "SUP-12345")
- **Auto SKU**: System-generated SKU (format: "INV-XXXX")
- **Custom SKU**: User-defined SKU

#### 3.2.2 Category System
- **Category Creation**: Name, description, color badge
- **Category Filtering**: Filter inventory by category
- **Category Search**: Search categories by name/description
- **Visual Indicators**: Color-coded category badges

#### 3.2.3 Inventory Item Properties
- **Basic Info**: Name, SKU (all types), quantity, reorder level
- **Supplier Info**: Supplier ID, supplier SKU, average lead time
- **Pricing**: Purchase price (excl. VAT), sale price (excl. VAT), margin calculation
- **VAT Settings**: 21%, 9%, 0%, or custom rate per item
- **Location**: Storage location
- **Unit**: Measurement unit (stuk, meter, kg, etc.)
- **Webshop Sync**: Enable/disable sync with webshop
- **POS Alert Note**: Alert message shown when item added to POS cart

#### 3.2.4 Inventory Operations
- **Add Item**: Create new inventory item with all properties
- **Edit Item**: Update item details (double-click to edit)
- **Delete Item**: Remove item with confirmation
- **Stock Adjustment**: Manual quantity updates
- **Search & Filter**: Search by name, SKU (all types), category
- **CSV Upload**: Bulk import inventory items
- **Low Stock Alerts**: Automatic notifications when quantity ≤ reorder level

#### 3.2.5 Supplier Management
- **Supplier CRUD**: Create, read, update, delete suppliers
- **Supplier Properties**: Name, contact person, email, phone, address, notes, average lead time
- **Supplier Linking**: Link inventory items to suppliers

**Technical Implementation**:
- Feature module: `features/inventory/`
- Hooks: `useInventory`, `useCategories`, `useSuppliers`, `useFilteredInventory`
- Services: `inventoryOperations.ts`, `categoryService.ts`, `supplierService.ts`
- Utils: `filters.ts`, `formatters.ts`, `calculations.ts`

---

### 3.3 Point of Sale (POS) Module
**Purpose**: B2C and B2B sales processing with real-time inventory updates.

**Key Features**:

#### 3.3.1 Dual Mode Operation
- **B2C Mode (Kassa)**: Direct sales to consumers, immediate payment
- **B2B Mode (Pakbon)**: Delivery notes for businesses, payment on invoice

#### 3.3.2 Product Selection
- **Favorites Bar**: Quick access to frequently used items (configurable, max 8)
- **Category Filter**: Filter products by inventory category
- **Search**: Search by name, SKU (all types), category name
- **Manual Items**: Add custom items not in inventory
- **POS Alerts**: Show alert notes when items added to cart

#### 3.3.3 Shopping Cart
- **Cart Items**: Name, quantity, price (excl. VAT), VAT rate, discount, total
- **Quantity Adjustment**: Increase/decrease quantities
- **Remove Items**: Remove items from cart
- **Discount Application**: Percentage discount per item
- **VAT Calculation**: Automatic VAT calculation per item
- **Cart Totals**: Subtotal (excl. VAT), total VAT, total (incl. VAT)
- **VAT Breakdown**: Breakdown by VAT rate (21%, 9%, 0%)

#### 3.3.4 Payment Processing (B2C Mode)
- **Payment Methods**: Cash, PIN, iDEAL, Credit Card
- **Payment Modal**: Select payment method, enter amount
- **Change Calculation**: Automatic change calculation
- **Receipt Generation**: Generate receipt/invoice
- **Inventory Update**: Automatic stock reduction
- **Transaction Recording**: Record transaction in accounting

#### 3.3.5 Packing Slip Generation (B2B Mode)
- **Customer Selection**: Select business customer
- **Shipping Address**: Enter/select shipping address
- **Due Date**: Set payment due date
- **Packing Slip Number**: Auto-generated (format: PKB-YYYY-XXX)
- **Packing Slip Creation**: Create packing slip with items
- **Invoice Link**: Option to create invoice from packing slip

#### 3.3.6 Favorites Management
- **Add to Favorites**: Star icon to add item to favorites
- **Remove from Favorites**: Unstar to remove
- **Favorites Settings**: Configure max number of favorites (default: 8)
- **Persistent Storage**: Favorites saved in localStorage

**Technical Implementation**:
- Cart state management with React hooks
- Real-time inventory updates
- VAT calculations per item
- Payment method tracking
- Transaction recording

---

### 3.4 Work Orders Module
**Purpose**: Production workflow management with Kanban board, time tracking, and quote/invoice integration.

**Key Features**:

#### 3.4.1 Kanban Board View
- **Status Columns**: To Do, Pending, In Progress, Completed
- **Drag & Drop**: Move work orders between statuses
- **Status Colors**: Visual color coding per status
- **Filtering**: Filter by status, assignee, customer
- **Search**: Search by title, description, customer

#### 3.4.2 Work Order Properties
- **Basic Info**: Title, description, status, assigned employee
- **Customer Link**: Link to customer
- **Location**: Work location
- **Scheduled Date**: Planned execution date
- **Required Inventory**: List of materials needed with quantities
- **Estimated Hours**: Estimated work hours
- **Estimated Cost**: Estimated total cost
- **Hours Spent**: Actual hours worked (editable)
- **Completed Date**: Date of completion
- **Notes**: Additional notes
- **Pending Reason**: Reason if status is "Pending"
- **Sort Index**: Priority/order index

#### 3.4.3 Work Order Creation
- **Manual Creation**: Create work order from scratch
- **From Quote**: Convert approved quote to work order
- **From Invoice**: Convert invoice to work order
- **From Email**: Create work order from email parsing
- **Material Selection**: Select required inventory items
- **Employee Assignment**: Assign to employee
- **Customer Selection**: Link to customer

#### 3.4.4 Work Order Operations
- **Edit**: Update work order details
- **Status Update**: Change status (with validation)
- **Hours Tracking**: Update hours spent
- **Material Updates**: Add/remove required materials
- **Reassignment**: Change assigned employee
- **Complete**: Mark as completed
- **Delete**: Remove work order (with confirmation)
- **Clone**: Duplicate work order

#### 3.4.5 Work Order History & Audit Trail
- **History Entries**: Complete audit trail of changes
- **Action Types**: created, converted, assigned, status_changed, updated, completed
- **Timestamps**: Created, converted, assigned, started, completed
- **Performed By**: Employee ID who performed action
- **Details**: Description of change
- **Status Transitions**: From/to status tracking

#### 3.4.6 Work Order Detail View
- **Full Details**: All work order information
- **Related Quote**: Link to source quote
- **Related Invoice**: Link to source invoice
- **Material List**: Required materials with quantities
- **History Timeline**: Chronological history view
- **Edit Actions**: Quick edit buttons

#### 3.4.7 Work Order Statistics
- **By Status**: Count per status
- **By Employee**: Work orders per employee
- **Completion Rate**: Percentage completed
- **Average Hours**: Average hours per work order
- **Pending Count**: Number of pending work orders

**Technical Implementation**:
- Feature module: `features/workorders/`
- Hooks: `useWorkOrders`, `useWorkOrderState`, `useFilteredWorkOrders`, `useMaterialSelection`
- Services: `workOrderOperations.ts`, `conversionService.ts`, `materialService.ts`
- Utils: `calculations.ts`, `formatters.ts`

---

### 3.5 Accounting Module (Quotes & Invoices)
**Purpose**: Quote generation, invoice management, and financial tracking.

**Key Features**:

#### 3.5.1 Quote Management

**Quote Properties**:
- **Quote ID**: Auto-generated (format: QXXX)
- **Customer**: Link to customer
- **Items**: List of items (description, quantity, price per unit, total)
- **Labor**: Optional labor items (description, hours, hourly rate, total)
- **Subtotal**: Total excl. VAT
- **VAT Rate**: 21%, 9%, 0%, or custom
- **VAT Amount**: Calculated VAT
- **Total**: Total incl. VAT
- **Status**: draft, sent, approved, rejected, expired
- **Created Date**: Creation date
- **Valid Until**: Expiration date
- **Notes**: Additional notes
- **Location**: Work location
- **Scheduled Date**: Planned execution date
- **Work Order Link**: Link to work order if converted

**Quote Operations**:
- **Create**: Create new quote
- **Edit**: Update quote details
- **Send**: Mark as sent
- **Approve**: Mark as approved
- **Reject**: Mark as rejected
- **Expire**: Mark as expired
- **Clone**: Duplicate quote
- **Convert to Invoice**: Create invoice from quote
- **Convert to Work Order**: Create work order from quote
- **Delete**: Remove quote

**Quote Form**:
- **Customer Selection**: Dropdown with search
- **Item Management**: Add inventory items or custom items
- **Labor Management**: Add labor items
- **VAT Rate Selection**: Choose VAT rate
- **Automatic Calculations**: Subtotal, VAT, total calculated automatically
- **Inventory Integration**: Select items from inventory

#### 3.5.2 Invoice Management

**Invoice Properties**:
- **Invoice Number**: Auto-generated (format: YYYY-XXX)
- **Customer**: Link to customer
- **Quote Link**: Optional link to source quote
- **Items**: List of items (same as quote)
- **Labor**: Optional labor items
- **Subtotal**: Total excl. VAT
- **VAT Rate**: 21%, 9%, 0%, or custom
- **VAT Amount**: Calculated VAT
- **Total**: Total incl. VAT
- **Status**: draft, sent, paid, overdue, cancelled
- **Issue Date**: Invoice date
- **Due Date**: Payment due date
- **Paid Date**: Date of payment (if paid)
- **Payment Terms**: Payment terms (e.g., "14 dagen")
- **Notes**: Additional notes
- **Location**: Work location
- **Scheduled Date**: Planned execution date
- **Work Order Link**: Link to work order if converted
- **Reminders**: Reminder tracking (reminder1Date, reminder2Date)

**Invoice Operations**:
- **Create**: Create new invoice
- **Edit**: Update invoice details
- **Send**: Mark as sent (with validation modal for auto-generated invoices)
- **Mark Paid**: Mark as paid
- **Mark Overdue**: Automatic overdue detection
- **Cancel**: Cancel invoice
- **Clone**: Duplicate invoice
- **Convert to Work Order**: Create work order from invoice
- **Send Reminder**: Send payment reminder (2 reminders: +7 days, +14 days after due date)
- **Delete**: Remove invoice

**Invoice Validation Modal**:
- **Checklist**: Hours checked, materials checked, extra work added
- **Validation**: Required checks before sending
- **Auto-Generated Detection**: Special validation for auto-generated invoices
- **Reminder Planning**: Automatic reminder date calculation

**Invoice Form**:
- **Customer Selection**: Dropdown with search
- **Item Management**: Add inventory items or custom items
- **Labor Management**: Add labor items
- **Date Selection**: Issue date, due date
- **Payment Terms**: Set payment terms
- **Automatic Calculations**: Subtotal, VAT, total calculated automatically

#### 3.5.3 Accounting Dashboard
- **Financial Overview**: Total income, expenses, net profit
- **Invoice Statistics**: Total invoiced, paid, outstanding, overdue
- **Quote Statistics**: Total quoted, approved, sent, expired
- **Charts**: Visual representation of financial data
- **Quick Actions**: Navigate to invoices, quotes, transactions
- **Period Selection**: Filter by date range

#### 3.5.4 Transaction Management
- **Transaction Types**: Income, Expense
- **Transaction Properties**: Type, description, amount, date, related entity
- **Transaction List**: View all transactions
- **Filtering**: Filter by type, date range
- **Statistics**: Total income, total expenses, net profit

**Technical Implementation**:
- Feature module: `features/accounting/`
- Hooks: `useQuotes`, `useInvoices`, `useTransactions`, `useAccountingDashboard`, `useQuoteForm`, `useInvoiceForm`
- Services: `quoteService.ts`, `invoiceService.ts`, `transactionService.ts`
- Utils: `calculations.ts`, `formatters.ts`, `validators.ts`, `filters.ts`, `helpers.ts`

---

### 3.6 Bookkeeping & Dossier Module
**Purpose**: NL-compliant bookkeeping with ledger accounts, journal entries, VAT reporting, and customer/supplier dossiers.

**Key Features**:

#### 3.6.1 Grootboek (Ledger Accounts)
- **Standard Accounts**: Pre-configured MKB ledger accounts
  - **Assets**: Debiteuren (1300), Voorraad (1400)
  - **Liabilities**: Crediteuren (1600), BTW hoog 21% (2200), BTW laag 9% (2210)
  - **Revenue**: Omzet goederen 21% (8000), Omzet diensten 9% (8010), Omzet vrijgesteld 0% (8020)
  - **Expenses**: Inkoop grondstoffen (4000), Inkoop diensten (4400)
- **Account Properties**: Account number, name, type, category, description
- **Account View**: Table view of all accounts
- **Export**: Export to CSV

#### 3.6.2 Journaal (Journal Entries)
- **Automatic Generation**: Auto-generated from invoices, POS transactions, packing slips
- **Entry Number**: Auto-generated (format: JRN-YYYY-XXX)
- **Entry Properties**: Date, description, reference, source type, source ID
- **Journal Lines**: Debit/credit lines per account
- **Double-Entry**: Proper double-entry bookkeeping
- **Source Tracking**: Link to source (invoice, POS, packing slip, manual)

**Journal Entry Structure**:
- **Debit Lines**: Asset/expense increases
- **Credit Lines**: Liability/revenue increases
- **Balancing**: Debits = Credits
- **Account Linking**: Link to ledger accounts

#### 3.6.3 BTW-Overzicht (VAT Report)
- **Period Selection**: Month, quarter, year
- **Revenue by VAT Rate**:
  - Revenue 21% BTW
  - VAT 21% (amount to pay)
  - Revenue 9% BTW
  - VAT 9% (amount to pay)
  - Revenue 0% BTW (exempt)
- **Purchase VAT (Voorbelasting)**:
  - Purchase VAT 21%
  - Purchase VAT 9%
  - Total purchase VAT
- **Total VAT to Pay**: Revenue VAT - Purchase VAT
- **Export**: Export to XML (for tax declaration)
- **Print**: Print PDF report

#### 3.6.4 Factuur Archief (Invoice Archive)
- **Archive View**: List view of all invoices
- **Archive Properties**: Invoice number, date, customer, total, status, PDF link
- **Status Filtering**: Filter by paid, outstanding, overdue
- **Search**: Search by number, customer, date
- **Detail View**: View invoice details
- **Clone Actions**: Clone to invoice or quote
- **Mark Paid**: Mark invoice as paid
- **Send Reminder**: Send payment reminder

#### 3.6.5 Kassa Verkopen (POS Sales)
- **POS Invoice List**: List of all POS transactions
- **Financial Overview**: Excel-like table view
- **Period Filtering**: Today, week, quarter, year, custom
- **Payment Method Breakdown**: Revenue by payment method (PIN, cash, iDEAL, credit card)
- **Item-Level Detail**: Each item in each transaction
- **Totals**: Total items, quantity, revenue, VAT
- **Export**: Export to CSV

**Financial Overview Table**:
- Columns: Date, Invoice, Customer, Payment Method, Product, Quantity, Price per Unit, VAT %, VAT Amount, Total (incl. VAT)
- Totals Row: Summary totals
- Sorting: Sort by date, amount, etc.

#### 3.6.6 Facturen Financieel Overzicht (Invoices Financial Overview)
- **Excel-like Table**: Detailed item-level view
- **Period Filtering**: All, today, week, quarter, year, custom
- **Customer Filtering**: Filter by customer name
- **Status Breakdown**: Revenue by status (paid, outstanding, overdue, draft)
- **Item-Level Detail**: Each item in each invoice
- **Totals**: Total items, quantity, revenue, VAT, unique invoices, unique products, unique customers
- **Export**: Export to CSV

#### 3.6.7 Dossiers (Customer & Supplier Dossiers)
- **Customer Dossier**:
  - Customer information (address, KvK, VAT number)
  - Financial summary (outstanding balance, credit limit, payment terms)
  - Related documents (invoices, packing slips, quotes, work orders)
  - Notes (general, payment, reminder, warning)
- **Supplier Dossier**:
  - Supplier information
  - Financial summary (outstanding balance, payment terms)
  - Related documents (purchase invoices)
  - Notes

**Technical Implementation**:
- Automatic journal entry generation from invoices
- VAT calculation per invoice
- Period-based filtering
- CSV export functionality

---

### 3.7 CRM Module (Customer Relationship Management)
**Purpose**: Comprehensive customer and lead management with interaction tracking, task management, and email integration.

**Key Features**:

#### 3.7.1 Customer Management

**Customer Properties**:
- **Basic Info**: Name, email, phone, address
- **Business Info**: Company name, type (business/private/individual)
- **Financial**: Credit limit, payment terms, outstanding balance
- **Metadata**: Since date, source, notes
- **Email Addresses**: Multiple email addresses per customer

**Customer Operations**:
- **Create**: Add new customer
- **Edit**: Update customer details
- **Delete**: Remove customer
- **Search**: Search by name, email, company
- **Filter**: Filter by type, source

**Customer Dashboard**:
- **Sales Summary**: Total sales, average sale, last sale
- **Financial Summary**: Outstanding balance, credit limit, payment terms
- **Related Documents**: Invoices, quotes, work orders, packing slips
- **Customer Journey**: Timeline of interactions, quotes, invoices, work orders
- **Finances View**: Detailed financial overview

#### 3.7.2 Lead Management

**Lead Properties**:
- **Basic Info**: Name, email, phone, company
- **Status**: new, contacted, qualified, proposal, negotiation, won, lost
- **Source**: website, referral, cold-call, advertisement, etc.
- **Estimated Value**: Potential deal value
- **Notes**: Additional information
- **Dates**: Created date, last contact date, next follow-up date

**Lead Pipeline**:
- **7-Stage Pipeline**: Visual representation of lead stages
- **Status Colors**: Color-coded status badges
- **Status Transitions**: Move leads between stages
- **Conversion**: Convert lead to customer

**Lead Operations**:
- **Create**: Add new lead
- **Update Status**: Change lead status
- **Convert to Customer**: Convert lead to customer
- **Delete**: Remove lead
- **Search**: Search by name, email, company
- **Filter**: Filter by status, source

**Lead Statistics**:
- **By Status**: Count per status
- **Conversion Rate**: Percentage converted to customers
- **Total Value**: Total estimated value
- **Source Breakdown**: Leads by source

#### 3.7.3 Interaction Management

**Interaction Types**: call, email, meeting, note, sms

**Interaction Properties**:
- **Type**: Interaction type
- **Subject**: Interaction subject
- **Description**: Detailed description
- **Date**: Interaction date
- **Employee**: Employee who performed interaction
- **Customer/Lead Link**: Link to customer or lead
- **Follow-up**: Follow-up required flag, follow-up date

**Interaction Operations**:
- **Create**: Add new interaction
- **View**: View interaction details
- **Edit**: Update interaction
- **Delete**: Remove interaction
- **Filter**: Filter by type, customer, employee, date

**Interaction Statistics**:
- **By Type**: Count per interaction type
- **By Employee**: Interactions per employee
- **Recent Interactions**: Latest interactions

#### 3.7.4 Task Management

**Task Properties**:
- **Basic Info**: Title, description
- **Priority**: low, medium, high
- **Status**: todo, in_progress, done
- **Due Date**: Task due date
- **Customer Link**: Optional link to customer
- **Employee Assignment**: Assigned employee
- **Created Date**: Creation date

**Task Operations**:
- **Create**: Add new task
- **Update Status**: Change task status
- **Update Priority**: Change priority
- **Assign**: Assign to employee
- **Complete**: Mark as done
- **Delete**: Remove task

**Task Statistics**:
- **By Status**: Count per status
- **By Priority**: Count per priority
- **Overdue**: Overdue tasks count
- **By Employee**: Tasks per employee

#### 3.7.5 Email Integration

**Email Features**:
- **Email Drop Zone**: Drag-and-drop .eml files
- **Email Parsing**: Parse email content
- **Customer Matching**: Automatic customer matching
- **Quote Creation**: Create quote from email
- **Task Creation**: Create task from email
- **Interaction Creation**: Create interaction from email

**Email Templates**:
- **Template Types**: quote, invoice, followup, general, custom
- **Template Properties**: Name, subject, body, HTML body
- **Default Templates**: Pre-configured templates
- **Template Management**: Create, edit, delete templates

**Technical Implementation**:
- Feature module: `features/crm/`
- Hooks: `useCustomers`, `useLeads`, `useInteractions`, `useTasks`, `useDashboard`, `useCRMState`
- Services: `customerService.ts`, `leadService.ts`, `invoiceService.ts`
- Utils: `filters.ts`, `formatters.ts`, `statusColors.ts`, `calculations.ts`

---

### 3.8 HRM Module (Human Resource Management)
**Purpose**: Comprehensive human resource management covering the entire employee lifecycle, from recruitment to offboarding, including payroll integration, leave management, and development.

**Key Features**:

#### 3.8.1 Organizational Structure & Basic Data
- **Organogram**: Hierarchy, departments, teams, and reporting lines
- **Locations**: Management of branches and office locations
- **Job Profiles**: Job titles, descriptions, responsibilities, competencies, and KPIs
- **Job Grading**: Salary scales, job levels, and CLA (CAO) classifications
- **Cost Centers**: Cost center allocation and distribution

#### 3.8.2 Employee Basic Dossier (Personal Data)
- **Personal Data**: Name, address, BSN/SSN, nationality, date of birth, gender, marital status
- **Contact Info**: Contact details and emergency contacts
- **Identity Documents**: Copies of ID/passport, work permits, residence permits
- **Financial Data**: Bank account numbers (IBAN)
- **Profile Photo**: Employee photo
- **Employment Details**: Start/end dates, probation period, contract type (permanent, temp, on-call, freelance)
- **Work Schedule**: FTE percentage and hours per week
- **Regulations**: Applicable CLA or company regulations
- **Pension**: Pension scheme details
- **Employee ID**: Unique employee identification number

#### 3.8.3 Contracts & Employment Conditions
- **Contract History**: Management of multiple contracts over time
- **Digital Signing**: Integrated digital signing for contracts and conditions
- **Attachments**: Storage for contracts, addendums, and correspondence
- **Mutation History**: Track changes in salary, role, or hours

#### 3.8.4 Salary & Compensation (Payroll Integration)
- **Salary Administration**: Gross/net calculations, scales, steps, periodic increases
- **Wage Components**: Fixed and variable components (bonus, commission, 13th month)
- **Reimbursements**: Expense management (travel, WFH, phone)
- **Allowances**: Irregular hours, overtime, shift allowances
- **Financial Obligations**: Garnishments and employee loans
- **Payroll Tax Link**: Integration with tax authorities (Belastingdienst, UWV, Pension Fund)

#### 3.8.5 Leave & Absence
- **Leave Administration**: Statutory, non-statutory, special, parental, and care leave
- **Balance Management**: Accrual and settlement of leave balances
- **Request Workflow**: Leave requests with approval workflow
- **Absence Registration**: Sick reporting and recovery registration
- **Health Service Link**: Integration with occupational health services (Arbodienst)
- **Signalization**: Alerts for frequent absence
- **Re-integration**: Dossier management for long-term illness (Wet Poortwachter)

#### 3.8.6 Competencies & Development
- **Competency Profiles**: Defined competencies per job function
- **Review Cycles**: Annual reviews, performance appraisals, and evaluation conversations
- **360-Degree Feedback**: Multi-source feedback mechanisms
- **Training**: History and planning of training/education
- **Certifications**: Tracking of certificates and diplomas with expiry dates (e.g., BHV, VCA)
- **Development Plans**: Personal Development Plans (POP)
- **Skills Matrix**: Language skills and skill scoring

#### 3.8.7 Recruitment & Selection
- **Vacancy Management**: Manage open positions
- **Applicant Portal**: Link to website/portal
- **Applicant Database**: CV parsing and candidate storage
- **Recruitment Workflow**: Screening → Interviews → Rejection/Hiring
- **Onboarding Checklist**: Preparation for new hires

#### 3.8.8 Onboarding & Offboarding
- **Onboarding Workflow**: Digital checklist (laptop, account, intro day, etc.)
- **Offboarding Checklist**: Asset return, account blocking, exit interview

#### 3.8.9 Time & Planning
- **Time Tracking**: Hours registration and clocking
- **Shift Planning**: Rostering (especially for shifts or flexible hours)
- **Flexible Hours**: Plus/minus hours tracking
- **Project Link**: Integration with project planning (PSA)

#### 3.8.10 Documents & Digital Signature
- **Document Management**: Centralized document storage per employee
- **Document Generation**: Standard templates (contracts, salary changes, leave confirmations)
- **Digital Signature**: Integration with providers (DocuSign, CM Sign, SignRequest)

#### 3.8.11 Self-Service Portal (ESS/MSS)
- **Employee Self Service (ESS)**:
  - Request leave
  - Download payslips and annual statements
  - Update personal data (address, bank account)
  - Enter hours
  - Submit expense declarations
- **Manager Self Service (MSS)**:
  - Approve leave and declarations
  - View team calendars

#### 3.8.12 Reports & Dashboards
- **Standard Reports**: Age structure, leave %, absence %, diversity, cost per FTE
- **Flexible Reporting**: Custom report builder
- **Exports**: Export to Excel/PDF
- **Real-time Dashboards**: Visual insights into HR metrics

#### 3.8.13 Integrations
- **Payroll Software**: Nmbrs, Loket.nl, Exact Online, AFAS
- **Occupational Health**: VerzuimXpert, ArboNed
- **Pension Providers**: Data exchange
- **Identity Management**: Active Directory / Azure AD (SSO)
- **Time Tracking**: External time systems
- **Assessments**: Assessment tools

#### 3.8.14 Compliance & Privacy (GDPR/AVG)
- **Consent Management**: GDPR consent tracking
- **Retention Policy**: Management of document retention periods
- **Audit Logs**: Log of who viewed/changed data and when
- **Access Control**: Role-based access (HR, Manager, Employee, Finance)

#### 3.8.15 Nice-to-Have Features
- **Digital Personnel File**: Advanced versioning
- **Surveys**: Employee satisfaction surveys
- **Talent Management**: Succession planning / 9-grid matrix
- **Benefits Portal**: Cafeteria model (bike plan, gym, etc.)
- **Fleet Management**: Lease car administration

**Technical Implementation**:
- Feature module: `features/hrm/`
- Hooks: `useEmployees`, `useLeave`, `useContracts`, `useRecruitment`, `usePayroll`
- Services: `employeeService.ts`, `leaveService.ts`, `documentService.ts`, `integrationService.ts`
- Utils: `permissions.ts`, `validators.ts`, `gdprUtils.ts`

---

### 3.9 Planning & Calendar Module
**Purpose**: Calendar-based planning for work orders, meetings, vacations, and other events.

**Key Features**:

#### 3.9.1 Calendar Views
- **Day View**: Single day view with hourly slots
- **Week View**: 7-day week view (Monday-Sunday)
- **Month View**: Full month calendar

#### 3.9.2 Event Types
- **Work Order**: Link to work order
- **Meeting**: General meeting
- **Vacation**: Employee vacation
- **Other**: Other events

#### 3.9.3 Event Properties
- **Basic Info**: Title, description
- **Type**: Event type
- **Start/End**: Start and end datetime
- **Employee**: Assigned employee
- **Customer**: Optional customer link
- **Related Entity**: Link to work order, etc.

#### 3.9.4 Event Operations
- **Create**: Add new event
- **Edit**: Update event
- **Delete**: Remove event
- **View**: View event details
- **Filter**: Filter by type, employee, date

#### 3.9.5 Calendar Navigation
- **Date Selection**: Select specific date
- **Previous/Next**: Navigate weeks/months
- **Today**: Jump to today
- **View Toggle**: Switch between day/week/month

**Technical Implementation**:
- Calendar state management
- Date calculations
- Event filtering
- Visual calendar rendering

---

### 3.10 Reports & Analytics Module
**Purpose**: Comprehensive reporting and analytics for sales, inventory, quotes, and work orders.

**Key Features**:

#### 3.10.1 Sales Reports
- **Total Revenue**: Sum of all sales
- **Average Sale**: Average sale amount
- **Total Items Sold**: Total quantity sold
- **Top Products**: Top 5 products by revenue
- **Sales Timeline**: Sales per date
- **Product Breakdown**: Revenue by product

#### 3.10.2 Inventory Reports
- **Total Inventory Value**: Estimated total value
- **Low Stock Items**: Items below reorder level
- **Out of Stock**: Items with zero quantity
- **Inventory Overview**: Full inventory table
- **Category Breakdown**: Inventory by category

#### 3.10.3 Quote Reports
- **Total Quote Value**: Sum of all quotes
- **Approved Value**: Value of approved quotes
- **Conversion Rate**: Percentage approved
- **Status Breakdown**: Quotes by status
- **Quote Timeline**: Quotes over time

#### 3.10.4 Work Order Reports
- **Completed Orders**: Count of completed work orders
- **In Progress**: Count in progress
- **Pending**: Count pending
- **Total Hours**: Total hours spent
- **Average Hours**: Average hours per order
- **Completion Rate**: Percentage completed
- **By Employee**: Work orders per employee

**Technical Implementation**:
- Data aggregation
- Statistical calculations
- Chart generation (using Recharts)
- Export functionality

---

### 3.11 Webshop Management Module
**Purpose**: E-commerce product management, category management, and order processing.

**Key Features**:

#### 3.11.1 Product Management

**Product Properties**:
- **Basic Info**: Name, slug, description, short description
- **SKU**: Stock Keeping Unit
- **Pricing**: Price, compare at price, cost price
- **Inventory**: Stock quantity, low stock threshold, track inventory flag
- **Inventory Link**: Link to inventory item
- **Categories**: Multiple category assignment, featured category
- **Variants**: Product variants (colors, sizes, etc.)
- **Images**: Product images, featured image
- **Status**: draft, active, archived
- **Visibility**: public, private, hidden
- **SEO**: Meta title, meta description, tags
- **Shipping**: Weight, dimensions, shipping class, shipping required
- **Tax**: Tax class (standard, reduced, zero, exempt)
- **Digital Product**: Flag for digital products
- **Reviews**: Allow reviews flag, average rating, review count
- **Statistics**: View count, purchase count, wishlist count
- **Admin Notes**: Internal notes

**Product Operations**:
- **Create**: Add new product
- **Edit**: Update product
- **Delete**: Remove product
- **Duplicate**: Clone product
- **Search**: Search by name, SKU, description, tags
- **Filter**: Filter by status, category
- **View Modes**: Grid view, list view

#### 3.11.2 Category Management

**Category Properties**:
- **Basic Info**: Name, slug, description
- **Parent Category**: Hierarchical categories
- **Image**: Category image
- **Order**: Sort order
- **Active**: Active flag
- **SEO**: Meta title, meta description
- **Product Count**: Number of products in category

**Category Operations**:
- **Create**: Add new category
- **Edit**: Update category
- **Delete**: Remove category
- **Hierarchy**: Parent-child relationships
- **Sort**: Reorder categories

#### 3.11.3 Order Management

**Order Properties**:
- **Order Number**: Auto-generated (format: ORD-YYYY-XXX)
- **Customer**: Customer information
- **Shipping Address**: Delivery address
- **Billing Address**: Billing address
- **Items**: Ordered items with quantities and prices
- **Pricing**: Subtotal, tax, shipping, discount, total
- **Status**: pending, processing, shipped, delivered, cancelled, refunded
- **Payment Status**: pending, paid, failed, refunded, partially_refunded
- **Payment Method**: Credit card, bank transfer, iDEAL, PayPal, cash, other
- **Payment Reference**: Transaction reference
- **Tracking**: Tracking number, carrier, shipped date, delivered date
- **Notes**: Customer notes, admin notes

**Order Operations**:
- **View**: View order details
- **Update Status**: Change order status
- **Update Payment Status**: Change payment status
- **Add Tracking**: Add tracking information
- **Cancel**: Cancel order
- **Refund**: Process refund
- **Search**: Search by order number, customer, email
- **Filter**: Filter by status, payment status

**Order Statistics**:
- **Total Orders**: Count of all orders
- **Pending Orders**: Count pending
- **Total Revenue**: Revenue from paid orders
- **By Status**: Orders per status

**Technical Implementation**:
- Product state management
- Category hierarchy
- Order processing
- Inventory synchronization

---

### 3.12 Admin Settings Module
**Purpose**: System configuration, module management, analytics, and diagnostics.

**Key Features**:

#### 3.12.1 Module Management
- **Module Toggle**: Enable/disable modules
- **Module List**: All available modules
- **Module Status**: Active/inactive status
- **Module Description**: Description per module

#### 3.12.2 Analytics Dashboard
- **Usage Statistics**: Module usage stats
  - Total sessions
  - Total time
  - Average session duration
  - Unique users
  - Actions count
  - Error count
- **User Activity**: User activity stats
  - Total sessions per user
  - Modules used
  - Most used module
  - Efficiency score
- **Process Metrics**: Process performance
  - Average cycle time
  - Average steps
  - Completion rate
  - Error rate
  - Rework rate
  - Bottleneck steps
- **Optimization Recommendations**: AI-generated recommendations
  - Priority (high, medium, low)
  - Category (process, feature, usability, automation, quality)
  - Impact description
  - Effort estimate
  - ROI score
  - Recommended actions

#### 3.12.3 Database Diagnostics
- **Issue Categories**: Performance, connectivity, data integrity, etc.
- **Issue Severity**: High, medium, low
- **Issue Details**: Description, diagnostic steps, suggested fixes
- **Test Actions**: Actions to test fixes
- **Vendor Info**: Database-specific information
- **Statistics**: Total issues, by severity, by category, average latency

#### 3.12.4 Email Mappings Management
- **Mapping List**: All email-customer mappings
- **Mapping Properties**: Email, customer ID, created by, created at, notes
- **Add Mapping**: Create new mapping
- **Delete Mapping**: Remove mapping
- **Mapping Statistics**: Total mappings, by customer

**Technical Implementation**:
- Analytics tracking: `utils/analytics.ts`
- Email mapping: `utils/emailCustomerMapping.ts`
- Database diagnostics: JSON data file
- Chart rendering: Recharts library

---

## 4. Technical Architecture

### 4.1 Frontend Stack
- **React 19**: Latest React version with concurrent features
- **TypeScript**: Type-safe development
- **Tailwind CSS 4**: Utility-first CSS framework
- **React Router 7**: Client-side routing
- **Vite 6**: Fast build tool and dev server
- **Jest**: Testing framework
- **Recharts**: Chart library for analytics

### 4.2 State Management
- **Centralized State**: All state in App.tsx component
- **React Hooks**: useState, useMemo, useEffect
- **Immutable Updates**: Spread operators for state updates
- **Feature Modules**: Organized by feature (accounting, crm, inventory, workorders)

### 4.3 Code Organization

**Directory Structure**:
```
bedrijfsbeheer/
├── components/          # Reusable React components
│   ├── accounting/     # Accounting-specific components
│   ├── common/         # Shared components
│   └── icons/          # Icon components
├── pages/              # Full page components
├── features/           # Feature modules
│   ├── accounting/    # Accounting feature
│   ├── crm/           # CRM feature
│   ├── inventory/     # Inventory feature
│   └── workorders/    # Work orders feature
├── utils/              # Utility functions
│   ├── email/          # Email parsing utilities
│   └── outlookHelper/ # Outlook integration
├── data/               # Mock data and initial data
├── docs/               # Documentation
└── types.ts            # TypeScript type definitions
```

**Feature Module Structure**:
```
features/[feature-name]/
├── hooks/              # Custom React hooks
├── services/           # Business logic services
├── types/              # TypeScript types
└── utils/              # Feature-specific utilities
```

### 4.4 Data Flow
1. **User Action**: User interacts with UI
2. **Event Handler**: Component event handler called
3. **Service Call**: Service function called (if needed)
4. **State Update**: State updated via setState
5. **Re-render**: Component re-renders with new state
6. **UI Update**: UI reflects new state

### 4.5 Integration Points
- **Email Integration**: .eml file parsing, Outlook drag-and-drop
- **Inventory Integration**: Shared inventory across POS, Work Orders, Accounting
- **Customer Integration**: Shared customer data across CRM, Accounting, Work Orders
- **Work Order Integration**: Links between Quotes, Invoices, and Work Orders

---

## 5. User Roles & Permissions

### 5.1 Role Types

#### 5.1.1 Admin (Manager Productie)
**Full Access**:
- All modules accessible
- Module enable/disable
- Employee management
- All CRUD operations
- System configuration
- Analytics access

**Permissions**:
- `full_admin`: All admin rights

#### 5.1.2 User (Medewerker)
**Limited Access**:
- Personal workboard
- Own work orders
- Time tracking
- Limited module access based on permissions

**Common Permissions**:
- `manage_workorders`: Manage work orders
- `view_reports`: View reports (if granted)

### 5.2 Permission System

**Granular Permissions**:
- `full_admin`: Complete admin access
- `manage_modules`: Module configuration
- `manage_inventory`: Inventory CRUD
- `manage_crm`: CRM operations
- `manage_accounting`: Accounting operations
- `manage_workorders`: Work order management
- `manage_employees`: Employee management
- `view_all_workorders`: View all work orders
- `view_reports`: Reports access
- `manage_planning`: Planning management
- `manage_pos`: POS management

**Permission Checks**:
- All create/edit/delete operations check `isAdmin` or specific permission
- UI elements hidden/shown based on permissions
- API calls validated by permissions

---

## 6. Detailed Feature Specifications

### 6.1 Email Integration Workflow

#### 6.1.1 Email Drop Zone
**Location**: Dashboard module

**Functionality**:
1. Visual drop zone area
2. Accepts .eml files (Outlook format)
3. Drag-and-drop support
4. File input fallback
5. Visual feedback on drag over
6. Multiple file support

**Technical Details**:
- File parsing via `emlParser.ts`
- Email content extraction (subject, body, from, to, date)
- Customer matching via `emailCustomerMapping.ts`

#### 6.1.2 Email Preview Modal
**Functionality**:
1. Display parsed email content
2. Show email details (from, subject, date)
3. Customer selection dropdown
4. Auto-match indicator
5. Remember mapping checkbox
6. Workflow options (create quote + work order)
7. Email body preview

**User Actions**:
- Select customer (or confirm auto-match)
- Toggle "Remember mapping"
- Toggle "Create quote + work order"
- Confirm or cancel

#### 6.1.3 Email-Customer Mapping
**Storage**: localStorage (persistent)

**Mapping Properties**:
- Email address
- Customer ID
- Created by (user/system)
- Created at (timestamp)
- Notes (optional)

**Operations**:
- Save mapping
- Update mapping
- Delete mapping
- Get customer by email
- Get all mappings

**Auto-Matching Logic**:
1. Check persistent mapping (localStorage)
2. Check customer primary email
3. Check customer emailAddresses array
4. Check lead email
5. Return match or null

### 6.2 Quote-to-Work-Order Conversion

#### 6.2.1 Conversion Workflow
1. User selects approved quote
2. Clicks "Convert to Work Order"
3. System validates quote status
4. System checks material availability
5. User selects employee for assignment
6. System creates work order
7. System links quote to work order
8. System updates quote with workOrderId

#### 6.2.2 Work Order Creation from Quote
**Properties Copied**:
- Customer ID
- Location
- Scheduled date
- Required inventory (from quote items)
- Estimated hours (from quote labor)
- Estimated cost (from quote total)
- Notes (from quote notes)

**New Properties**:
- Work order ID
- Status: "To Do"
- Assigned employee
- Created timestamp
- Conversion timestamp

#### 6.2.3 Bidirectional Sync
**Quote → Work Order**:
- Item changes sync to work order
- Labor changes sync to work order
- Status changes trigger notifications

**Work Order → Quote**:
- Hours spent can update quote
- Completion status can update quote

**Validation**:
- Cannot edit quote if work order is completed
- Warning if work order is in progress

### 6.3 Invoice Validation Workflow

#### 6.3.1 Auto-Generated Invoice Detection
**Criteria**:
- Invoice created from work order
- Invoice has workOrderId
- Invoice status is "draft"

#### 6.3.2 Validation Modal
**Checklist Items**:
- Hours checked
- Materials checked
- Extra work added

**Validation Rules**:
- Minimum: Hours and materials must be checked
- Extra work is optional
- Cannot send without minimum checks

#### 6.3.3 Reminder Planning
**Automatic Calculation**:
- Reminder 1: Due date + 7 days
- Reminder 2: Due date + 14 days

**Reminder Properties**:
- Reminder date
- Sent flag
- Sent date

**Reminder Actions**:
- Send reminder manually
- Track reminder status
- Show reminder dates in invoice view

### 6.4 Inventory Stock Management

#### 6.4.1 Stock Updates
**Automatic Updates**:
- POS sale: Reduce stock
- Work order completion: Reduce stock (if materials used)
- Manual adjustment: User updates quantity

**Stock Checks**:
- Before POS sale: Check availability
- Before work order: Check material availability
- Low stock alerts: Quantity ≤ reorder level

#### 6.4.2 Reorder Level Management
**Properties**:
- Reorder level per item
- Alert when quantity ≤ reorder level
- Dashboard warning display

**Operations**:
- Set reorder level
- Update reorder level
- View low stock items

### 6.5 Work Order Kanban Board

#### 6.5.1 Board Structure
**Columns**:
- To Do
- Pending
- In Progress
- Completed

**Card Properties**:
- Title
- Customer name
- Assigned employee
- Status badge
- Priority indicator
- Hours spent
- Due date

#### 6.5.2 Drag & Drop
**Functionality**:
- Drag work order card
- Drop in different status column
- Update status on drop
- Visual feedback during drag

**Validation**:
- Cannot move completed work orders
- Admin can move any work order
- Users can only move assigned work orders

#### 6.5.3 Filtering & Search
**Filters**:
- By status
- By employee
- By customer
- By date range

**Search**:
- By title
- By description
- By customer name

---

## 7. Workflows & Integrations

### 7.1 Quote → Work Order → Invoice Workflow

**Complete Flow**:
1. **Quote Creation**: Sales creates quote for customer
2. **Quote Approval**: Customer approves quote
3. **Work Order Creation**: Convert approved quote to work order
4. **Work Order Assignment**: Assign to employee
5. **Work Order Execution**: Employee completes work, tracks hours
6. **Work Order Completion**: Mark work order as completed
7. **Invoice Creation**: Convert completed work order to invoice
8. **Invoice Validation**: Validate invoice (hours, materials, extra work)
9. **Invoice Sending**: Send invoice to customer
10. **Payment Tracking**: Mark invoice as paid

**Bidirectional Sync**:
- Quote changes sync to work order (if linked)
- Work order changes can update quote
- Invoice changes sync to work order (if linked)

### 7.2 Email → Quote → Work Order Workflow

**Complete Flow**:
1. **Email Received**: Customer sends email with request
2. **Email Parsing**: System parses email content
3. **Customer Matching**: Auto-match or manual selection
4. **Quote Creation**: Create quote from email content
5. **Quote Approval**: Approve quote
6. **Work Order Creation**: Convert to work order
7. **Work Order Assignment**: Assign to employee
8. **Execution**: Complete work order

**Email Context Preservation**:
- Email subject in quote notes
- Email body in work order description
- Email sender in customer link
- Email date in timestamps

### 7.3 POS → Inventory → Accounting Workflow

**Complete Flow**:
1. **Product Selection**: Select products in POS
2. **Stock Check**: Verify availability
3. **Sale Processing**: Process payment
4. **Inventory Update**: Reduce stock quantities
5. **Transaction Recording**: Record transaction
6. **Journal Entry**: Create journal entry (if enabled)
7. **Invoice Creation**: Create invoice for B2B sales

**Inventory Integration**:
- Real-time stock checks
- Automatic stock reduction
- Low stock alerts
- Stock history tracking

### 7.4 CRM → Accounting → Work Orders Integration

**Customer Data Sharing**:
- Customer created in CRM
- Available in Accounting for quotes/invoices
- Available in Work Orders for assignment
- Customer journey tracks all interactions

**Lead Conversion**:
- Lead created in CRM
- Lead qualified
- Convert to customer
- Create quote for customer
- Convert quote to work order

---

## 8. Data Models

### 8.1 Core Entities

#### 8.1.1 Customer
```typescript
{
  id: string
  name: string
  email: string
  emailAddresses?: string[]
  phone: string
  since: string
  type?: "business" | "private" | "individual"
  address?: string
  notes?: string
  source?: string
  company?: string
  creditLimit?: number
  paymentTerms?: number
}
```

#### 8.1.2 InventoryItem
```typescript
{
  id: string
  name: string
  sku: string (legacy)
  supplierSku?: string
  autoSku?: string
  customSku?: string
  quantity: number
  reorderLevel: number
  supplierId?: string
  categoryId?: string
  purchasePrice?: number
  salePrice: number
  margin?: number
  vatRate: "21" | "9" | "0" | "custom"
  customVatRate?: number
  syncEnabled: boolean
  unit?: string
  location?: string
  posAlertNote?: string
}
```

#### 8.1.3 WorkOrder
```typescript
{
  id: string
  title: string
  description: string
  status: "To Do" | "Pending" | "In Progress" | "Completed"
  assignedTo: string
  requiredInventory: { itemId: string; quantity: number }[]
  createdDate: string
  customerId?: string
  location?: string
  scheduledDate?: string
  completedDate?: string
  hoursSpent?: number
  estimatedHours?: number
  estimatedCost?: number
  quoteId?: string
  invoiceId?: string
  notes?: string
  pendingReason?: string
  timestamps?: {
    created: string
    converted?: string
    assigned?: string
    started?: string
    completed?: string
  }
  history?: WorkOrderHistoryEntry[]
}
```

#### 8.1.4 Quote
```typescript
{
  id: string
  customerId: string
  items: QuoteItem[]
  labor?: QuoteLabor[]
  subtotal: number
  vatRate: number
  vatAmount: number
  total: number
  status: "draft" | "sent" | "approved" | "rejected" | "expired"
  createdDate: string
  validUntil: string
  notes?: string
  location?: string
  scheduledDate?: string
  workOrderId?: string
  timestamps?: {
    created: string
    sent?: string
    approved?: string
    convertedToInvoice?: string
    convertedToWorkOrder?: string
  }
  history?: QuoteHistoryEntry[]
}
```

#### 8.1.5 Invoice
```typescript
{
  id: string
  invoiceNumber: string
  customerId: string
  quoteId?: string
  items: QuoteItem[]
  labor?: QuoteLabor[]
  subtotal: number
  vatRate: number
  vatAmount: number
  total: number
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled"
  issueDate: string
  dueDate: string
  paidDate?: string
  notes?: string
  paymentTerms?: string
  location?: string
  scheduledDate?: string
  workOrderId?: string
  reminders?: {
    reminder1Date?: string
    reminder1Sent?: boolean
    reminder2Date?: string
    reminder2Sent?: boolean
  }
  timestamps?: {
    created: string
    sent?: string
    paid?: string
    convertedToWorkOrder?: string
  }
  history?: InvoiceHistoryEntry[]
}
```

### 8.2 Relationship Models

**Quote ↔ Work Order**:
- Quote.workOrderId → WorkOrder.id
- WorkOrder.quoteId → Quote.id
- Bidirectional sync

**Invoice ↔ Work Order**:
- Invoice.workOrderId → WorkOrder.id
- WorkOrder.invoiceId → Invoice.id
- Bidirectional sync

**Quote → Invoice**:
- Invoice.quoteId → Quote.id
- One-way conversion

**Customer → All**:
- Customer.id referenced in Quotes, Invoices, Work Orders, Interactions, Tasks

---

## 9. User Interface & Experience

### 9.1 Design Principles
- **Mobile-First**: Responsive design for all screen sizes
- **Dutch Language**: All UI text in Dutch
- **Consistent Styling**: Tailwind CSS utility classes
- **Visual Feedback**: Loading states, success/error messages
- **Accessibility**: Keyboard navigation, screen reader support

### 9.2 Component Patterns

#### 9.2.1 Forms
- Consistent form styling
- Validation messages
- Required field indicators
- Submit/cancel buttons

#### 9.2.2 Modals
- Centered modal overlay
- Close button (X)
- Action buttons (bottom)
- Scrollable content

#### 9.2.3 Tables
- Sortable columns
- Filterable rows
- Pagination (if needed)
- Responsive design

#### 9.2.4 Cards
- Shadow effects
- Hover states
- Click actions
- Status badges

### 9.3 Navigation
- **Sidebar**: Module navigation (collapsible on mobile)
- **Header**: User info, notifications, logout
- **Breadcrumbs**: Current location (where applicable)
- **Tabs**: Module sub-sections

### 9.4 Notifications
- **Notification Bell**: Badge with unread count
- **Notification Types**: info, warning, error, success
- **Notification Actions**: Quick actions from notifications
- **Auto-Dismiss**: Some notifications auto-dismiss

---

## 10. Security & Compliance

### 10.1 Authentication
- **Simple Password**: Basic password authentication
- **Session Management**: User session in state
- **Logout**: Clear session on logout

### 10.2 Authorization
- **Permission Checks**: All operations check permissions
- **Role-Based Access**: Different access per role
- **UI Hiding**: Hide UI elements based on permissions

### 10.3 Data Protection
- **Local Storage**: Email mappings in localStorage
- **No Sensitive Data**: No passwords stored in plain text (basic implementation)
- **Input Validation**: All user inputs validated

### 10.4 Dutch Compliance
- **BTW Handling**: Proper VAT calculation (21%, 9%, 0%)
- **Financial Reporting**: NL-compliant financial reports
- **Date Formats**: Dutch date formats (DD-MM-YYYY)
- **Currency**: Euro (€) formatting

---

## 11. Performance Requirements

### 11.1 Response Times
- **Page Load**: < 2 seconds
- **Action Response**: < 500ms
- **Search Results**: < 300ms
- **Filter Updates**: < 200ms

### 11.2 Optimization
- **Code Splitting**: Feature-based code splitting
- **Memoization**: useMemo for expensive calculations
- **Lazy Loading**: Lazy load components where possible
- **Debouncing**: Debounce search inputs

### 11.3 Scalability
- **State Management**: Efficient state updates
- **Data Structures**: Optimized data structures
- **Rendering**: Minimize re-renders

---

## 12. Future Roadmap

### 12.1 Planned Features
- **Backend API**: RESTful API backend
- **Database Integration**: Real database (PostgreSQL/MySQL)
- **Advanced Analytics**: More detailed analytics
- **Mobile App**: Native mobile application
- **Multi-language**: English language support
- **Advanced Permissions**: More granular permissions
- **API Integrations**: Third-party integrations (accounting software, etc.)

### 12.2 Improvements
- **Performance**: Further optimization
- **UX**: Enhanced user experience
- **Testing**: More comprehensive test coverage
- **Documentation**: Expanded documentation

---

## Appendix A: Glossary

- **BTW**: Belasting Toegevoegde Waarde (VAT)
- **MKB**: Midden- en Kleinbedrijf (SME)
- **SKU**: Stock Keeping Unit
- **POS**: Point of Sale
- **CRM**: Customer Relationship Management
- **HRM**: Human Resource Management
- **KvK**: Kamer van Koophandel (Chamber of Commerce)

## Appendix B: Version History

- **v5.8.0**: Email integration & automatic quote creation
- **v5.7.0**: Inventory categories & 3 SKU types
- **v5.6.0**: Invoice reminders & validation
- **v5.2.0**: MKB-ready bookkeeping with NL-compliant VAT
- **v4.x**: Work order integration & mobile optimization
- **v3.x**: Earlier versions

---

**End of PRD Document**


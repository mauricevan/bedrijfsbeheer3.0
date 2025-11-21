# Product Requirements Document 0.2
## Additional Functionality Analysis: Bedrijfsbeheer vs Google_ai_test

**Date:** 2025-01-XX  
**Source Application:** http://localhost:5174/bedrijfsbeheer  
**Target Application:** Google_ai_test (d:\code projects\Google_ai_test)  
**Version:** 4.5.0 (Bedrijfsbeheer)

---

## Executive Summary

This document provides a comprehensive analysis of additional functionality found in the Bedrijfsbeheer application (v4.5.0) compared to the Google_ai_test project. The analysis covers all modules and features discovered through extensive browser exploration.

---

## 1. WORK ORDERS MODULE - Advanced Features

### 1.1 Workboard View (Personalized Dashboard)
**Location:** `#/work_orders`

**Features:**
- **Personalized Workboard**: "Workboard - [User Name]" - Shows user-specific tasks and work assignments
- **Employee Filter Dropdown**: 
  - "Bekijk werkorders van:" dropdown
  - Options: "Mijn werkorders", "Alle medewerkers", individual employee names
  - Allows managers to view work orders assigned to specific employees
- **View Mode Toggle**:
  - "Uitgebreid" (Extended) view mode
  - "Compact" view mode
  - Toggle buttons with icons (📋 Uitgebreid, 📝 Compact)
- **Status Filter Buttons**:
  - "To Do 👆" button with count
  - "0 In Wacht 👆" button with count
  - "0 Bezig 👆" button with count
  - "0 Afgerond 👆" button with count
  - Each button filters the view by status
- **Total Hours Display**: "Totaal uren" (Total hours) metric display
- **Kanban-Style Columns**:
  - "To Do" column with count badge
  - "In Wacht" (On Hold) column with count badge
  - "In Uitvoering" (In Progress) column with count badge
  - "Afgerond" (Completed) column with count badge
  - Empty state messages for each column
- **Quick Actions**: "+ Nieuwe Werkorder" button prominently displayed

**Current Project Status:** Basic work orders list view exists, but lacks:
- Personalized workboard
- Employee filtering
- View mode toggle
- Kanban board layout
- Status filter buttons with counts
- Total hours tracking

---

## 2. DASHBOARD MODULE - Enhanced Features

### 2.1 Email Integration (.eml File Support)
**Location:** `#/dashboard`

**Features:**
- **Drag-and-Drop Email Zone**:
  - "Sleep hier je .eml bestanden" (Drag .eml files here)
  - Supports multiple .eml files
  - Visual drop zone with email icon (📧)
  - File selection button: "📁 Selecteer .eml Bestand"
- **Email Processing Tips**:
  - Instructions for extracting emails from Outlook
  - Mentions Electron app for direct Outlook integration
  - User guidance displayed in the interface

**Current Project Status:** Not implemented

### 2.2 Dashboard Metrics Cards
**Features:**
- **Totale Verkopen** (Total Sales): €838.50
- **Lage Voorraad** (Low Stock): 0 items
- **Orders In Uitvoering** (Orders In Progress): 1
- **Orders In Wacht** (Orders On Hold): 1
- Each card displays with icons and values

**Current Project Status:** Basic metrics exist, but may lack specific calculations

### 2.3 Notifications System
**Features:**
- **Notification Counter**: "3 nieuw" (3 new) badge
- **Notification List**:
  - Stock warnings: "Verfspuit voorraad onder herbestel niveau (12/5)"
  - Quote acceptance: "Offerte Q001 door TechBouw B.V. geaccepteerd"
  - Task reminders: "Taak 'Follow-up offerte TechBouw' vervalt over 4 dagen"
- **Dismiss Functionality**: Each notification has a "✓" button to mark as read
- **Timestamp Display**: Shows date and time for each notification
- **Sidebar Counter**: "Nieuwe meldingen: 3" displayed in sidebar

**Current Project Status:** Basic notification system may exist, but lacks:
- Dismiss functionality
- Categorized notifications
- Sidebar counter integration

### 2.4 Recent Work Orders Widget
**Features:**
- **List Display**: Shows recent work orders with:
  - Title
  - Description
  - Status badges (In Progress, Pending, Completed, To Do)
- **Status Indicators**: Color-coded status badges

**Current Project Status:** May exist but needs verification

### 2.5 Low Stock Warnings Section
**Features:**
- **Dedicated Section**: "Lage Voorraad Waarschuwingen"
- **Status Message**: "Alle voorraad niveaus zijn voldoende" when no warnings

**Current Project Status:** May exist but needs enhancement

---

## 3. ACCOUNTING MODULE - Advanced Analytics

### 3.1 Tab Navigation
**Location:** `#/accounting`

**Features:**
- **Tab System**:
  - "📊 Dashboard" tab
  - "💰 Transacties" (Transactions) tab
  - "📋 Offertes" (Quotes) tab
  - "🧾 Facturen" (Invoices) tab
- **Tab Icons**: Each tab has an emoji icon

**Current Project Status:** Basic accounting exists, but may lack tab navigation

### 3.2 Financial Metrics Dashboard
**Features:**
- **Clickable Metric Cards**:
  - "Totale Omzet" (Total Revenue): €1766.60 - "Klik voor details →"
  - "Totaal Gefactureerd" (Total Invoiced): €3295.74 - "Klik voor details →"
  - "Openstaand" (Outstanding): €1529.14 - "Klik voor details →"
  - "Openstaande Offertes" (Open Quotes): €2.00 - "Klik voor details →"
  - "Verlopen" (Expired): €741.13 - "Klik voor details →"
- **Non-Clickable Metrics**:
  - "Gem. Betalingstermijn" (Avg. Payment Term): 7 dagen
- **Interactive Elements**: Cards are clickable and show "Klik voor details →" hint

**Current Project Status:** Basic metrics exist, but lacks:
- Clickable cards with detail views
- Average payment term calculation
- Expired invoices tracking

### 3.3 Advanced Charts & Visualizations
**Features:**
- **Omzet per Maand** (Revenue per Month):
  - Line/bar chart showing monthly revenue
  - Legend: "Omzet (€)"
  - Shows data for multiple months (12/24 through 11/25)
- **Openstaand per Klant** (Outstanding per Customer):
  - Bar chart showing outstanding amounts per customer
  - Y-axis: 0-800 range
  - Shows: IndustriaalPartners, MetaalConstructies
- **Top 5 Klanten** (Top 5 Customers):
  - Chart showing top customers
  - Legend: "TechBouw B.V."
- **Offertes per Status** (Quotes per Status):
  - Chart showing quote distribution by status
  - Multiple status categories with counts
- **Betaalgedrag per Maand** (Payment Behavior per Month):
  - Stacked bar chart
  - Categories: "Op tijd" (On time), "Te laat" (Late)
  - Shows payment patterns over time

**Current Project Status:** Charts may exist but need verification for:
- Revenue per month chart
- Outstanding per customer chart
- Top customers chart
- Payment behavior analysis

### 3.4 Insights & Recommendations Engine
**Features:**
- **Section Title**: "💡 Inzichten & Aanbevelingen"
- **Automated Insights**:
  - "⚠️ Er zijn 1 verlopen facturen met een totaalbedrag van €741.13."
  - "💡 Klant Industriaal Partners heeft openstaande facturen van €788.01 die gemiddeld 410 dagen oud zijn."
  - "💡 Klant Metaal Constructies heeft openstaande facturen van €741.13 die gemiddeld 431 dagen oud zijn."
- **Intelligent Analysis**: System calculates:
  - Overdue invoices count and amounts
  - Average age of outstanding invoices per customer
  - Customer-specific payment behavior insights

**Current Project Status:** Not implemented - This is a significant feature

---

## 4. INVENTORY MODULE - Enhanced Features

### 4.1 BTW (VAT) Overview Section
**Location:** `#/inventory`

**Features:**
- **Monthly BTW Summary**:
  - "💰 BTW Overzicht Deze Maand" (VAT Overview This Month)
  - Breakdown by VAT rate:
    - BTW 21%: €67.76
    - BTW 9%: €0.00
    - BTW Vrij (VAT Free): €0.00
    - Totaal BTW: €67.76
- **Compliance Status**: "✅ Klaar voor BTW-aangifte - Alle bedragen zijn berekend conform NL-regels"
- **NL-Compliant**: Specifically designed for Dutch tax regulations

**Current Project Status:** May exist but needs verification for NL-specific compliance

### 4.2 Multiple SKU Types
**Features:**
- **SKU (Auto)**: Auto-generated SKU
- **SKU (Leverancier)**: Supplier SKU
- **SKU (Aangepast)**: Custom SKU
- **Table Columns**: All three SKU types displayed in separate columns
- **Display**: Shows "-" when SKU type is not used

**Current Project Status:** Basic SKU exists, but may lack multiple SKU type support

### 4.3 Advanced Inventory Calculations
**Features:**
- **Margin Percentage**: Automatically calculated and displayed (e.g., 30%, 43.75%, 50%)
- **BTW Percentage**: Displayed per item (21%, 9%, etc.)
- **Price Including BTW**: "Incl. BTW" column showing final price (e.g., €55.05)
- **Purchase Price**: "Aankoop €" column
- **Sale Price**: "Verkoop €" column

**Current Project Status:** Basic pricing exists, but may lack:
- Automatic margin calculation
- BTW-inclusive price display
- Multiple BTW rate support

### 4.4 Quick Stock Adjustment
**Features:**
- **Quick Action Buttons**: 
  - "+10" button to add 10 units
  - "-10" button to subtract 10 units
  - Displayed in each row's action column
- **Edit Button**: "✏️" for full item editing
- **Delete Button**: "🗑️" for item deletion

**Current Project Status:** Basic CRUD exists, but may lack quick adjustment buttons

### 4.5 Webshop Sync Integration
**Features:**
- **Sync Button**: "Sync" button in each row
- **Sync Status Indicator**: "🔗 Sync" indicator when synced
- **Sync Functionality**: Individual item sync to webshop module
- **Status Display**: Visual indicator of sync status

**Current Project Status:** Webshop module exists, but sync integration may be missing

### 4.6 Enhanced Search & Filtering
**Features:**
- **Comprehensive Search**: "Zoek op naam, SKU, locatie, leverancier, categorie, prijs, etc..."
- **Category Filter Dropdown**: "🏷️ Filter op categorie... ▼"
- **Multi-field Search**: Searches across multiple fields simultaneously

**Current Project Status:** Basic search exists, but may lack:
- Multi-field search capability
- Category filter dropdown
- Price-based search

### 4.7 Tab Navigation
**Features:**
- **Tab Buttons**:
  - "📦 Items (5)" - Shows item count
  - "🏢 Leveranciers (0)" - Shows supplier count
  - "📊 Rapportages" - Reports tab
  - "🏷️ Categorieën (0)" - Categories tab
- **Count Badges**: Each tab shows count of items in that category

**Current Project Status:** May exist but needs verification

### 4.8 CSV Import
**Features:**
- **CSV Import Button**: "📄 CSV Import" button prominently displayed
- **Import Functionality**: Bulk import of inventory items via CSV

**Current Project Status:** CSV Upload component exists (from prd0.1.md), but may need integration

---

## 5. ADMIN SETTINGS - Module Management

### 5.1 Module Management System
**Location:** `#/admin_settings`

**Features:**
- **Module Enable/Disable**:
  - Each module has an "Uitschakelen" (Disable) button
  - Modules can be individually enabled/disabled
  - Disabled modules are hidden from navigation
- **Module Cards Display**:
  - Each module shown as a card with:
    - Icon
    - Title
    - Description
    - Disable button
- **Modules Listed**:
  - Dashboard
  - Voorraadbeheer (Inventory)
  - Kassasysteem (POS)
  - Werkorders (Work Orders)
  - Facturen en Offerte (Accounting)
  - Boekhouding & Dossier (Bookkeeping)
  - Klantenbeheer (CRM)
  - Personeelsbeheer (HRM)
  - Planning & Agenda (Planning)
  - Rapportages (Reports)
  - Webshop
- **Warning Message**: "Let op: Uitgeschakelde modules zijn niet zichtbaar in de navigatie en zijn niet toegankelijk voor gebruikers."

**Current Project Status:** Basic settings exist, but lacks:
- Module enable/disable functionality
- Dynamic navigation based on enabled modules
- Module management UI

### 5.2 Admin Settings Tabs
**Features:**
- **Tab Navigation**:
  - "📦 Module Beheer" (Module Management)
  - "📊 Systeem Analytics" (System Analytics)
  - "🗄️ Database Diagnostics" (Database Diagnostics)
  - "📧 Email Koppelingen" (Email Connections)
- **Tab Icons**: Each tab has an emoji icon

**Current Project Status:** Analytics and Database Diagnostics exist (from prd0.1.md), but may lack:
- Email Connections tab
- Module Management tab

---

## 6. GLOBAL FEATURES

### 6.1 Notifications System (Global)
**Features:**
- **Header Notification Button**: 
  - "Meldingen" button with badge showing count (e.g., "3")
  - Bell icon
  - Clickable to view notifications
- **Sidebar Notification Counter**: 
  - "Nieuwe meldingen: 3" displayed in sidebar
  - Always visible indicator
- **Notification Types**:
  - Stock warnings
  - Quote/invoice status changes
  - Task reminders
  - System alerts

**Current Project Status:** Basic notification system may exist, but needs:
- Header notification button with badge
- Sidebar counter
- Categorized notifications

### 6.2 Unified Search (Global Header)
**Features:**
- **Search Bar**: "🔍 Zoek offerte, factuur, werkorder of klant..."
  - Located in header
  - Cross-module search functionality
  - Search icon displayed
- **Search Scope**: Searches across:
  - Quotes
  - Invoices
  - Work orders
  - Customers

**Current Project Status:** Unified Search component exists (from prd0.1.md), but may need:
- Header integration
- Enhanced search scope

### 6.3 User Menu & Role Display
**Features:**
- **User Menu Button**: "Gebruikersmenu" (User Menu)
  - Shows user initials (e.g., "SV")
  - User name and role displayed
  - Dropdown arrow icon
- **Role Badge**: "Admin" badge displayed in header
- **User Information Display**:
  - Full name: "Sophie van Dam"
  - Role: "Manager Productie"
  - Visual avatar with initials

**Current Project Status:** Basic user menu exists, but may lack:
- Role badge display
- Enhanced user information display
- Initials avatar

### 6.4 Version Display
**Features:**
- **Version Information**: "Versie 4.5.0" displayed in sidebar
- **Version Format**: Semantic versioning (major.minor.patch)
- **Always Visible**: Version shown in sidebar footer

**Current Project Status:** May not exist

### 6.5 Welcome Message
**Features:**
- **Personalized Greeting**: "Welkom, Sophie" (Welcome, Sophie)
  - Uses user's first name
  - Displayed in header
- **Subtitle**: "Bedrijfsbeheer Dashboard"

**Current Project Status:** Basic header exists, but may lack personalized greeting

---

## 7. AUTHENTICATION & USER MANAGEMENT

### 7.1 Demo Accounts System
**Features:**
- **Multiple Demo Accounts**:
  - Jan de Vries - Productiemedewerker (Production Worker)
  - Maria Jansen - Lasser (Welder)
  - Peter Bakker - Spuiter (Painter)
  - Sophie van Dam - Manager Productie, Admin
- **Quick Login**: Click demo account button to auto-fill credentials
- **Password Display**: "Wachtwoord voor alle accounts: '1234'"
- **Role-Based Access**: Different roles have different permissions

**Current Project Status:** Basic auth exists, but may lack:
- Demo accounts system
- Quick login functionality
- Role-based UI differences

---

## 8. UI/UX ENHANCEMENTS

### 8.1 Visual Indicators
**Features:**
- **Status Badges**: Color-coded status indicators throughout
- **Icons**: Extensive use of emoji icons for visual clarity
- **Count Badges**: Numbers displayed on buttons/tabs (e.g., "Items (5)")
- **Empty States**: Helpful messages when no data exists
- **Loading States**: Visual feedback during operations

**Current Project Status:** Basic UI exists, but may need:
- More visual indicators
- Enhanced empty states
- Better loading feedback

### 8.2 Navigation Enhancements
**Features:**
- **Active State Indicators**: Current page highlighted in sidebar
- **Module Icons**: Each navigation item has an icon
- **Grouped Navigation**: Logical grouping of related modules
- **Collapsible Sections**: Potential for expandable navigation

**Current Project Status:** Basic navigation exists, but may need:
- Enhanced active states
- Module icons
- Better visual hierarchy

---

## 9. DATA & ANALYTICS FEATURES

### 9.1 Advanced Calculations
**Features:**
- **Margin Calculations**: Automatic margin percentage calculation
- **BTW Calculations**: NL-compliant VAT calculations
- **Aging Analysis**: Invoice aging (e.g., "410 dagen oud")
- **Average Calculations**: Average payment terms, etc.
- **Trend Analysis**: Month-over-month comparisons

**Current Project Status:** Basic calculations exist, but may lack:
- Advanced financial calculations
- Aging analysis
- Trend calculations

### 9.2 Reporting Features
**Features:**
- **Multiple Chart Types**: Line charts, bar charts, pie charts
- **Interactive Charts**: Clickable chart elements
- **Data Export**: Potential for exporting chart data
- **Custom Date Ranges**: Time-based filtering

**Current Project Status:** Basic reports may exist, but needs verification

---

## 10. INTEGRATION FEATURES

### 10.1 Email Integration
**Features:**
- **.eml File Support**: Drag-and-drop .eml email files
- **Outlook Integration**: Instructions for Outlook email extraction
- **Electron App**: Mentioned for direct Outlook integration
- **Email Processing**: Parse and process email content

**Current Project Status:** Not implemented (explicitly excluded in prd0.1.md)

### 10.2 Webshop Sync
**Features:**
- **Individual Item Sync**: Sync button per inventory item
- **Sync Status**: Visual indicator of sync status
- **Bidirectional Sync**: Potential for two-way synchronization

**Current Project Status:** Webshop module exists, but sync may be missing

---

## 11. SUMMARY OF MISSING FEATURES

### High Priority Features:
1. **Workboard View** - Personalized Kanban board for work orders
2. **Employee Filtering** - Filter work orders by assigned employee
3. **View Mode Toggle** - Extended/Compact view modes
4. **Status Filter Buttons** - Quick status filtering with counts
5. **Email Integration** - .eml file drag-and-drop (if not excluded)
6. **Insights & Recommendations Engine** - Automated business insights
7. **Module Management** - Enable/disable modules dynamically
8. **BTW Overview** - NL-compliant VAT overview section
9. **Multiple SKU Types** - Auto, Supplier, Custom SKUs
10. **Quick Stock Adjustment** - +10/-10 buttons for rapid updates
11. **Advanced Charts** - Multiple chart types with interactive elements
12. **Notification System** - Global notification system with dismiss
13. **Clickable Metric Cards** - Interactive dashboard cards
14. **Payment Behavior Analysis** - Track on-time vs late payments
15. **Invoice Aging Analysis** - Track age of outstanding invoices

### Medium Priority Features:
1. **Version Display** - Show application version
2. **Personalized Greeting** - Welcome message with user name
3. **Role Badge** - Display user role in header
4. **Demo Accounts** - Quick login with demo accounts
5. **Enhanced Search** - Multi-field search capabilities
6. **Category Filter Dropdown** - Filter by category
7. **Tab Navigation** - Tab-based navigation within modules
8. **Count Badges** - Display counts on buttons/tabs
9. **Empty State Messages** - Helpful messages when no data
10. **Sync Status Indicators** - Visual sync status

### Low Priority Features:
1. **Module Icons** - Icons for each navigation item
2. **Enhanced Visual Indicators** - More badges and status indicators
3. **Improved Empty States** - Better UX for empty data
4. **Loading States** - Enhanced loading feedback

---

## 12. IMPLEMENTATION RECOMMENDATIONS

### Phase 1: Core Work Orders Enhancements
- Implement Workboard view with Kanban columns
- Add employee filtering
- Add view mode toggle
- Add status filter buttons

### Phase 2: Dashboard & Analytics
- Implement Insights & Recommendations engine
- Add clickable metric cards
- Enhance charts with interactivity
- Add payment behavior analysis

### Phase 3: Inventory Enhancements
- Add BTW overview section
- Implement multiple SKU types
- Add quick stock adjustment buttons
- Enhance search and filtering

### Phase 4: Admin & System Features
- Implement module management
- Add global notification system
- Enhance user menu and role display
- Add version display

### Phase 5: UI/UX Polish
- Add visual indicators and badges
- Improve empty states
- Enhance navigation
- Add loading states

---

## 13. TECHNICAL NOTES

### Data Requirements:
- User role and permissions system
- Module enable/disable configuration
- Notification storage and management
- Analytics data aggregation
- Chart data formatting

### Integration Points:
- Email processing (if implemented)
- Webshop sync API
- Analytics tracking
- Notification system

### Performance Considerations:
- Chart rendering performance
- Large dataset filtering
- Real-time notification updates
- Module loading optimization

---

## END OF DOCUMENT

**Note:** This analysis is based on browser exploration of http://localhost:5174/bedrijfsbeheer. Some features may require backend implementation, which should be coordinated with the backend team when ready.


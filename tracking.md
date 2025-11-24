# Tracking & Numbering System Documentation

## Overview

This document outlines the comprehensive tracking and numbering system for the Bedrijfsbeheer application. The system provides complete audit trails, activity tracking, and document numbering for Facturen (Invoices), Werkorders (Work Orders), and Offertes (Quotes).

---

## 1. Activity Tracking System

### 1.1 Purpose
Provide administrators with a complete overview of all user activities across the entire system, enabling them to track who did what and when.

### 1.2 Activity Types

The system tracks the following activity types:

#### Document Activities
- **Factuur (Invoice)**: Created, Updated, Sent, Paid, Cancelled, Deleted
- **Werkorder (Work Order)**: Created, Updated, Assigned, Status Changed, Completed, Deleted
- **Offerte (Quote)**: Created, Updated, Sent, Accepted, Rejected, Converted to Invoice, Converted to Work Order, Deleted

#### General Activities
- **Customer**: Created, Updated, Deleted
- **Inventory**: Item Created, Updated, Stock Adjusted, Deleted
- **Employee**: Created, Updated, Deleted
- **Settings**: Changed, Module Toggled
- **Login/Logout**: User logged in, User logged out
- **Data Export**: Reports generated, Data exported

### 1.3 Activity Data Structure

```typescript
interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  activityType: ActivityType;
  entityType: 'factuur' | 'werkorder' | 'offerte' | 'customer' | 'inventory' | 'employee' | 'settings' | 'system';
  entityId: string;
  entityName?: string; // Display name for the entity
  action: string; // e.g., "created", "updated", "deleted"
  description: string; // Human-readable description
  changes?: {
    field: string;
    oldValue: unknown;
    newValue: unknown;
  }[];
  metadata?: Record<string, unknown>; // Additional context
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
  sessionId?: string;
}
```

### 1.4 Admin Activity Overview Section

**Location**: Settings Page → "Activity Tracking" Tab

**Features**:
- **Activity Timeline**: Chronological list of all activities
- **User Filter**: Filter activities by specific user
- **Entity Filter**: Filter by entity type (Factuur, Werkorder, Offerte, etc.)
- **Action Filter**: Filter by action type (Created, Updated, Deleted, etc.)
- **Date Range Filter**: Filter by date range
- **Search**: Search activities by description, entity name, or user name
- **Export**: Export activity logs to CSV/Excel
- **Real-time Updates**: Live activity feed (optional)

**Display Format**:
- Table view with sortable columns
- Timeline view for chronological display
- Detail view showing full activity information including changes
- Statistics dashboard showing activity metrics

---

## 2. Document Numbering System

### 2.1 General Number (Sequential Number)

Every document (Factuur, Werkorder, Offerte) receives a **general sequential number** that increments across all document types.

**Format**: `{YYYY}-{SEQUENTIAL_NUMBER}`

**Examples**:
- `2024-0001`
- `2024-0002`
- `2024-0003`

**Rules**:
- Starts at 0001 each calendar year
- Resets to 0001 on January 1st of each new year
- Sequential across all document types (shared counter)
- Never reused, even if document is deleted
- Stored in `generalNumber` field

### 2.2 Document-Specific Number (Prefix Number)

Each document type also receives a **type-specific number** with a prefix.

**Format**: `{PREFIX}-{YYYY}-{SEQUENTIAL_NUMBER}`

**Prefixes**:
- **Factuur (Invoice)**: `F`
- **Offerte (Quote)**: `O`
- **Werkorder (Work Order)**: `W`

**Examples**:
- Factuur: `F-2024-0001`, `F-2024-0002`
- Offerte: `O-2024-0001`, `O-2024-0002`
- Werkorder: `W-2024-0001`, `W-2024-0002`

**Rules**:
- Each document type has its own sequential counter per year
- Starts at 0001 each calendar year for each type
- Resets to 0001 on January 1st of each new year
- Never reused, even if document is deleted
- Stored in `documentNumber` field (e.g., `invoiceNumber`, `quoteNumber`, `workOrderNumber`)

### 2.3 Number Generation Logic

```typescript
interface NumberGenerator {
  // Get next general number
  getNextGeneralNumber(): string;
  
  // Get next document-specific number
  getNextFactuurNumber(): string;
  getNextOfferteNumber(): string;
  getNextWerkorderNumber(): string;
  
  // Initialize counters (called on system initialization or year change)
  initializeCounters(year: number): void;
}
```

**Storage**:
- Counters stored in settings/localStorage/database
- Key: `document_counters_{YEAR}`
- Structure:
```json
{
  "general": 42,
  "factuur": 15,
  "offerte": 20,
  "werkorder": 7
}
```

### 2.4 Number Assignment

Numbers are assigned:
- **Immediately upon document creation** (not when saved)
- **Before document is saved** to ensure number is always present
- **Atomically** to prevent duplicate numbers
- **Permanently** - once assigned, never changed or reused

---

## 3. Document Archive System

### 3.1 Purpose

Maintain a permanent record of all documents (Facturen, Werkorders, Offertes) even after they are deleted from the active system. This ensures complete auditability and compliance.

### 3.2 Archive Data Structure

```typescript
interface ArchivedDocument {
  id: string; // Original document ID
  documentType: 'factuur' | 'werkorder' | 'offerte';
  generalNumber: string; // e.g., "2024-0001"
  documentNumber: string; // e.g., "F-2024-0001"
  
  // Full document data (snapshot at time of deletion)
  documentData: Invoice | WorkOrder | Quote;
  
  // Archive metadata
  archivedAt: string;
  archivedBy: string; // User ID
  archivedByName: string; // User name
  archiveReason?: string; // Why it was archived/deleted
  
  // Original creation metadata
  createdAt: string;
  createdBy: string;
  createdByName: string;
  
  // Journey tracking
  journey: DocumentJourneyEntry[];
  
  // Activity log (all activities related to this document)
  activities: ActivityLog[];
}
```

### 3.3 Document Journey Tracking

Each document tracks its complete journey through the system:

```typescript
interface DocumentJourneyEntry {
  id: string;
  timestamp: string;
  stage: JourneyStage;
  performedBy: string; // User ID
  performedByName: string; // User name
  action: string; // e.g., "Created", "Sent to customer", "Converted to invoice"
  description: string;
  metadata?: Record<string, unknown>;
}

type JourneyStage = 
  | 'created'
  | 'draft'
  | 'sent'
  | 'in_progress'
  | 'completed'
  | 'converted'
  | 'paid'
  | 'cancelled'
  | 'archived';
```

**Journey Examples**:

**Factuur Journey**:
1. Created (by User A)
2. Sent to customer (by User A)
3. Payment reminder sent (by User B)
4. Paid (by User C)
5. Archived (by User A)

**Offerte Journey**:
1. Created (by User A)
2. Sent to customer (by User A)
3. Accepted by customer (by User B)
4. Converted to Werkorder (by User B)
5. Archived (by User A)

**Werkorder Journey**:
1. Created from Offerte (by User A)
2. Assigned to Employee X (by User B)
3. Status changed to "In Progress" (by Employee X)
4. Materials added (by Employee X)
5. Completed (by Employee X)
6. Converted to Factuur (by User B)
7. Archived (by User A)

### 3.4 Archive Process

When a document is deleted:
1. **Create Archive Entry**: Copy full document data to archive
2. **Record Archive Activity**: Log who archived it and when
3. **Preserve Journey**: Copy complete journey history
4. **Preserve Activities**: Copy all related activity logs
5. **Remove from Active**: Remove from active document lists
6. **Keep References**: Maintain references in related documents

**Important**: Documents are never truly deleted, only moved to archive.

---

## 4. Admin Archive Management Section

### 4.1 Location

**Settings Page → "Document Archive" Tab**

Only visible to users with `admin` role.

### 4.2 Features

#### 4.2.1 Document List View

- **Table Display**: All archived documents in a sortable table
- **Columns**:
  - Document Type (with icon)
  - General Number
  - Document Number
  - Customer Name
  - Created Date
  - Archived Date
  - Created By
  - Archived By
  - Status (at time of archive)
  - Total Amount (for Factuur/Offerte)
- **Bulk Actions**: Select multiple documents for operations

#### 4.2.2 Filtering System

**Filter Options**:
- **Document Type**: Filter by Factuur, Werkorder, or Offerte
- **Customer**: Filter by customer name or ID
- **Number**: Filter by general number or document number
- **User**: Filter by user who created or archived
- **Date Range**: Filter by creation date or archive date
- **Status**: Filter by status at time of archive
- **Amount Range**: Filter by total amount (for Factuur/Offerte)
- **Search**: Full-text search across all fields

**Filter Combinations**: All filters can be combined for precise queries.

#### 4.2.3 Document Detail View

When clicking on an archived document:

**Tabs**:
1. **Overview**: Basic document information
2. **Journey**: Complete journey timeline with visual representation
3. **Activities**: All activities related to this document
4. **Related Documents**: Links to related documents (e.g., Offerte → Werkorder → Factuur)
5. **Full Data**: Complete JSON/document data snapshot

**Journey Visualization**:
- Timeline view showing all stages
- Visual flow diagram
- User actions at each stage
- Time between stages

#### 4.2.4 Export & Reporting

- **Export to CSV/Excel**: Export filtered results
- **Generate Report**: Create PDF report of archived documents
- **Statistics Dashboard**: 
  - Total archived documents
  - By document type
  - By customer
  - By user
  - Archive trends over time

#### 4.2.5 Restore Functionality

- **Restore Document**: Restore archived document to active system
- **Restore with History**: Restore including all journey and activity data
- **Restore Permissions**: Only admins can restore

---

## 5. Data Models

### 5.1 Updated Document Types

#### Factuur (Invoice)
```typescript
interface Invoice {
  id: string;
  generalNumber: string; // e.g., "2024-0001"
  invoiceNumber: string; // e.g., "F-2024-0001"
  // ... existing fields ...
  journey?: DocumentJourneyEntry[];
  createdAt: string;
  createdBy: string;
  createdByName: string;
}
```

#### Offerte (Quote)
```typescript
interface Quote {
  id: string;
  generalNumber: string; // e.g., "2024-0002"
  quoteNumber: string; // e.g., "O-2024-0001"
  // ... existing fields ...
  journey?: DocumentJourneyEntry[];
  createdAt: string;
  createdBy: string;
  createdByName: string;
}
```

#### Werkorder (Work Order)
```typescript
interface WorkOrder {
  id: string;
  generalNumber: string; // e.g., "2024-0003"
  workOrderNumber: string; // e.g., "W-2024-0001"
  // ... existing fields ...
  journey?: DocumentJourneyEntry[];
  createdAt: string;
  createdBy: string;
  createdByName: string;
}
```

### 5.2 Storage Structure

**Active Documents**: Stored in existing storage (localStorage/IndexedDB)
**Archived Documents**: Stored separately in `archived_documents` key
**Activity Logs**: Stored in `activity_logs` key
**Number Counters**: Stored in `document_counters_{YEAR}` key

---

## 6. Implementation Phases

### Phase 1: Number Generation System
1. Create number generator utility
2. Update document creation logic
3. Add number fields to document types
4. Initialize counters

### Phase 2: Activity Tracking
1. Create activity logging system
2. Integrate activity logging into all document operations
3. Create activity log storage
4. Build admin activity overview UI

### Phase 3: Journey Tracking
1. Add journey tracking to document types
2. Update document operations to record journey entries
3. Build journey visualization components

### Phase 4: Archive System
1. Create archive data structure
2. Implement archive process
3. Build archive storage system
4. Create admin archive management UI

### Phase 5: Filtering & Search
1. Implement filtering logic
2. Build filter UI components
3. Add search functionality
4. Implement export features

---

## 7. User Interface Specifications

### 7.1 Activity Tracking Tab

**Layout**:
- Left sidebar: Filters
- Main area: Activity timeline/table
- Right sidebar (optional): Activity details

**Components**:
- `ActivityTimeline` - Timeline view component
- `ActivityTable` - Table view component
- `ActivityFilters` - Filter panel component
- `ActivityDetail` - Detail view component
- `ActivityStats` - Statistics dashboard component

### 7.2 Document Archive Tab

**Layout**:
- Top: Filter bar and search
- Main: Document list/table
- Bottom: Pagination and export controls

**Components**:
- `ArchiveTable` - Archive document table
- `ArchiveFilters` - Filter panel
- `ArchiveDetail` - Document detail modal/page
- `JourneyTimeline` - Journey visualization
- `ActivityLogView` - Activity log display
- `RelatedDocuments` - Related documents panel

---

## 8. Technical Considerations

### 8.1 Performance

- **Pagination**: Implement pagination for large activity/archive lists
- **Lazy Loading**: Load journey and activities on demand
- **Indexing**: Index archived documents by number, customer, date for fast filtering
- **Caching**: Cache frequently accessed archive data

### 8.2 Data Integrity

- **Atomic Operations**: Ensure number generation is atomic
- **Transaction Safety**: Archive operations should be transactional
- **Data Validation**: Validate all data before archiving
- **Backup**: Regular backups of archive data

### 8.3 Security

- **Access Control**: Only admins can access archive and activity tracking
- **Audit Trail**: All admin actions on archive should be logged
- **Data Privacy**: Ensure compliance with data protection regulations
- **Export Security**: Secure export functionality

### 8.4 Scalability

- **Storage Strategy**: Consider moving to database for large datasets
- **Archival Strategy**: Consider archiving old activity logs to separate storage
- **Performance Monitoring**: Monitor query performance on archive

---

## 9. Future Enhancements

- **Real-time Activity Feed**: WebSocket-based live activity updates
- **Activity Notifications**: Notify admins of important activities
- **Advanced Analytics**: Analytics dashboard for activity patterns
- **Document Relationships Graph**: Visual graph of document relationships
- **Automated Archiving**: Auto-archive documents after certain period
- **Compliance Reports**: Generate compliance reports from archive data
- **Integration**: Export archive data to external systems

---

## 10. Testing Requirements

### 10.1 Number Generation
- Test sequential number generation
- Test year reset functionality
- Test concurrent number generation (no duplicates)
- Test number persistence

### 10.2 Activity Tracking
- Test activity logging for all operations
- Test activity filtering
- Test activity export
- Test activity performance with large datasets

### 10.3 Archive System
- Test archive process
- Test archive retrieval
- Test archive filtering
- Test archive restore
- Test archive data integrity

### 10.4 Journey Tracking
- Test journey entry creation
- Test journey visualization
- Test journey filtering
- Test journey export

---

## Conclusion

This tracking and numbering system provides comprehensive auditability, complete document history, and powerful administrative tools for managing and tracking all system activities and documents. The system ensures no data is ever truly lost and provides complete transparency into system usage and document lifecycles.


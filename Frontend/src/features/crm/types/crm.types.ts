export interface Customer {
  id: string;
  name: string;
  email: string;
  emailAddresses?: string[];
  phone?: string;
  company?: string;
  type?: 'business' | 'private' | 'individual';
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  kvk?: string;
  vatNumber?: string;
  creditLimit?: number;
  paymentTerms?: number;
  outstandingBalance?: number;
  notes?: string;
  source?: string;
  since?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
  source?: string;
  estimatedValue?: number;
  notes?: string;
  createdDate?: string;
  lastContactDate?: string;
  nextFollowUpDate?: string;
  createdAt: string;
  updatedAt: string;
  convertedToCustomerId?: string;
}

export interface Interaction {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'sms';
  subject: string;
  description: string;
  date: string;
  employeeId: string;
  customerId?: string;
  leadId?: string;
  followUpRequired?: boolean;
  followUpDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in_progress' | 'done';
  dueDate?: string;
  customerId?: string;
  leadId?: string;
  employeeId: string;
  createdAt: string;
  updatedAt: string;
}

// Form input types
export type CreateCustomerInput = Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateCustomerInput = Partial<Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>>;

export type CreateLeadInput = Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateLeadInput = Partial<Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>>;

export type CreateInteractionInput = Omit<Interaction, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateInteractionInput = Partial<Omit<Interaction, 'id' | 'createdAt' | 'updatedAt'>>;

export type CreateTaskInput = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateTaskInput = Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>;

// Customer Dashboard Types
export interface CustomerSalesSummary {
  customerId: string;
  totalSales: number;
  averageSalePerOrder: number;
  lastSaleDate?: string;
  totalOrders: number;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
}

export interface CustomerFinancialSummary {
  customerId: string;
  outstandingBalance: number;
  creditLimit: number;
  creditUsed: number;
  paymentTerms: number;
  overdueAmount: number;
  lastPaymentDate?: string;
  averagePaymentDays: number;
}

export interface CustomerDocument {
  id: string;
  customerId: string;
  type: 'invoice' | 'quote' | 'work_order' | 'contract' | 'other';
  documentNumber: string;
  title: string;
  date: string;
  amount?: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  fileUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerJourneyEntry {
  id: string;
  customerId: string;
  type: 'interaction' | 'quote' | 'invoice' | 'work_order' | 'payment' | 'note';
  title: string;
  description: string;
  date: string;
  amount?: number;
  status?: string;
  employeeId?: string;
  relatedId?: string; // ID of related entity (interaction, quote, etc.)
  createdAt: string;
}

export interface CustomerDashboard {
  customer: Customer;
  salesSummary: CustomerSalesSummary;
  financialSummary: CustomerFinancialSummary;
  recentDocuments: CustomerDocument[];
  journeyEntries: CustomerJourneyEntry[];
  recentInteractions: Interaction[];
  openTasks: Task[];
}

// Lead Scoring Types
export interface LeadScoreFactors {
  estimatedValue: number;      // Weight: 30%
  leadSource: number;           // Weight: 20%
  interactionCount: number;     // Weight: 20%
  timeInPipeline: number;       // Weight: 15%
  engagementLevel: number;      // Weight: 15%
}

export interface LeadScore {
  id: string;
  leadId: string;
  totalScore: number;           // 0-100
  factors: LeadScoreFactors;
  category: 'hot' | 'warm' | 'cold';
  lastCalculated: string;
  scoreHistory: {
    date: string;
    score: number;
  }[];
  createdAt: string;
  updatedAt: string;
}

// Lead Analytics Types
export interface LeadConversionMetrics {
  totalLeads: number;
  convertedLeads: number;
  conversionRate: number;
  conversionBySource: {
    source: string;
    count: number;
    conversionRate: number;
  }[];
  conversionByStatus: {
    status: string;
    count: number;
    conversionRate: number;
  }[];
  winLossRatio: number;
  averageConversionTime: number; // in days
}

export interface LeadVelocityMetrics {
  averageTimePerStage: {
    stage: string;
    averageDays: number;
  }[];
  bottlenecks: {
    stage: string;
    averageDays: number;
    leadsStuck: number;
  }[];
  velocityTrend: 'improving' | 'declining' | 'stable';
}

export interface RevenueForecast {
  period: string;
  pipelineValue: number;
  weightedValue: number;
  expectedRevenue: number;
  confidence: 'high' | 'medium' | 'low';
  forecastAccuracy?: number;
}

// Email Template Types
export interface EmailTemplate {
  id: string;
  name: string;
  category: 'quote' | 'invoice' | 'follow_up' | 'general' | 'welcome' | 'reminder';
  subject: string;
  body: string; // HTML content
  variables: string[]; // Available variables like {{customer.name}}
  isActive: boolean;
  usageCount: number;
  lastUsed?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmailTemplateVariable {
  key: string;
  label: string;
  example: string;
  category: 'customer' | 'quote' | 'invoice' | 'company';
}

// Document Management Types
export interface CRMDocument {
  id: string;
  customerId?: string;
  leadId?: string;
  name: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  category: 'contract' | 'quote' | 'invoice' | 'correspondence' | 'other';
  tags: string[];
  url: string;
  version: number;
  uploadedBy: string;
  sharedWith: string[]; // Employee IDs
  downloadCount: number;
  lastDownloaded?: string;
  createdAt: string;
  updatedAt: string;
}

// Activity Feed Types
export interface ActivityFeedItem {
  id: string;
  type: 'customer_created' | 'customer_updated' | 'lead_created' | 'lead_status_changed' | 
        'interaction_added' | 'task_completed' | 'document_uploaded' | 'quote_sent' | 
        'invoice_paid' | 'lead_converted';
  title: string;
  description: string;
  entityId: string;
  entityType: 'customer' | 'lead' | 'interaction' | 'task' | 'document';
  employeeId: string;
  timestamp: string;
  priority: 'low' | 'medium' | 'high';
  read: boolean;
}

// CRM Reports Types
export interface CRMReport {
  id: string;
  name: string;
  type: 'sales_performance' | 'lead_source' | 'customer_lifetime_value' | 
        'pipeline_analysis' | 'custom';
  parameters: Record<string, any>;
  generatedBy: string;
  generatedAt: string;
  data: any;
  format: 'table' | 'chart' | 'dashboard';
}

// Form input types for advanced features
export type CreateEmailTemplateInput = Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount' | 'lastUsed'>;
export type UpdateEmailTemplateInput = Partial<Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>>;

export type CreateCRMDocumentInput = Omit<CRMDocument, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'downloadCount' | 'lastDownloaded'>;
export type UpdateCRMDocumentInput = Partial<Omit<CRMDocument, 'id' | 'createdAt' | 'updatedAt'>>;

export type CreateLeadScoreInput = Omit<LeadScore, 'id' | 'createdAt' | 'updatedAt' | 'scoreHistory'>;
export type UpdateLeadScoreInput = Partial<Omit<LeadScore, 'id' | 'createdAt' | 'updatedAt'>>;
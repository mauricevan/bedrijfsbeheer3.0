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
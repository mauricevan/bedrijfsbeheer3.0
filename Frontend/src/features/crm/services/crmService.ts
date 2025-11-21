import type { Customer, Lead, Interaction, Task } from '../types/crm.types';
import { storage } from '@/utils/storage';

const CUSTOMERS_KEY = 'bedrijfsbeheer_customers';
const LEADS_KEY = 'bedrijfsbeheer_leads';
const INTERACTIONS_KEY = 'bedrijfsbeheer_interactions';
const TASKS_KEY = 'bedrijfsbeheer_tasks';

const DEFAULT_CUSTOMERS: Customer[] = [
  {
    id: '1',
    name: 'Acme Corporation',
    email: 'contact@acme.com',
    phone: '+31 20 123 4567',
    company: 'Acme Corp',
    type: 'business',
    address: 'Hoofdstraat 123',
    city: 'Amsterdam',
    postalCode: '1012 AB',
    country: 'Netherlands',
    creditLimit: 50000,
    paymentTerms: 30,
    outstandingBalance: 0,
    tags: ['VIP', 'Enterprise'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const DEFAULT_LEADS: Lead[] = [
  {
    id: '1',
    name: 'TechStart BV',
    email: 'info@techstart.nl',
    phone: '+31 30 987 6543',
    company: 'TechStart',
    status: 'qualified',
    source: 'Website',
    estimatedValue: 15000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const DEFAULT_INTERACTIONS: Interaction[] = [];
const DEFAULT_TASKS: Task[] = [];

let CUSTOMERS = storage.get<Customer[]>(CUSTOMERS_KEY, DEFAULT_CUSTOMERS);
let LEADS = storage.get<Lead[]>(LEADS_KEY, DEFAULT_LEADS);
let INTERACTIONS = storage.get<Interaction[]>(INTERACTIONS_KEY, DEFAULT_INTERACTIONS);
let TASKS = storage.get<Task[]>(TASKS_KEY, DEFAULT_TASKS);

const saveCustomers = () => storage.set(CUSTOMERS_KEY, CUSTOMERS);
const saveLeads = () => storage.set(LEADS_KEY, LEADS);
const saveInteractions = () => storage.set(INTERACTIONS_KEY, INTERACTIONS);
const saveTasks = () => storage.set(TASKS_KEY, TASKS);
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const crmService = {
  // Customers
  getCustomers: async (): Promise<Customer[]> => {
    await delay(500);
    return [...CUSTOMERS];
  },

  createCustomer: async (data: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Customer> => {
    await delay(800);
    const newCustomer: Customer = {
      ...data,
      id: `cust-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    CUSTOMERS.push(newCustomer);
    saveCustomers();
    return newCustomer;
  },

  updateCustomer: async (id: string, updates: Partial<Customer>): Promise<Customer> => {
    await delay(500);
    const index = CUSTOMERS.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Customer not found');
    
    const updated = {
      ...CUSTOMERS[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    CUSTOMERS[index] = updated;
    saveCustomers();
    return updated;
  },

  deleteCustomer: async (id: string): Promise<void> => {
    await delay(500);
    CUSTOMERS = CUSTOMERS.filter(c => c.id !== id);
    saveCustomers();
  },

  // Leads
  getLeads: async (): Promise<Lead[]> => {
    await delay(500);
    return [...LEADS];
  },

  createLead: async (data: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lead> => {
    await delay(800);
    const newLead: Lead = {
      ...data,
      id: `lead-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    LEADS.push(newLead);
    saveLeads();
    return newLead;
  },

  updateLead: async (id: string, updates: Partial<Lead>): Promise<Lead> => {
    await delay(500);
    const index = LEADS.findIndex(l => l.id === id);
    if (index === -1) throw new Error('Lead not found');
    
    const updated = {
      ...LEADS[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    LEADS[index] = updated;
    saveLeads();
    return updated;
  },

  deleteLead: async (id: string): Promise<void> => {
    await delay(500);
    LEADS = LEADS.filter(l => l.id !== id);
    saveLeads();
  },

  convertLeadToCustomer: async (leadId: string): Promise<Customer> => {
    const lead = LEADS.find(l => l.id === leadId);
    if (!lead) throw new Error('Lead not found');

    const customer = await crmService.createCustomer({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      notes: lead.notes,
      source: lead.source,
      tags: ['Converted from Lead'],
    });

    await crmService.updateLead(leadId, { 
      status: 'won',
      convertedToCustomerId: customer.id 
    });

    return customer;
  },

  // Interactions
  getInteractions: async (filters?: { customerId?: string; leadId?: string; type?: Interaction['type'] }): Promise<Interaction[]> => {
    await delay(300);
    let filtered = [...INTERACTIONS];
    if (filters?.customerId) filtered = filtered.filter(i => i.customerId === filters.customerId);
    if (filters?.leadId) filtered = filtered.filter(i => i.leadId === filters.leadId);
    if (filters?.type) filtered = filtered.filter(i => i.type === filters.type);
    return filtered;
  },

  createInteraction: async (data: Omit<Interaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<Interaction> => {
    await delay(500);
    const newInteraction: Interaction = {
      ...data,
      id: `int-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    INTERACTIONS.push(newInteraction);
    saveInteractions();
    return newInteraction;
  },

  updateInteraction: async (id: string, updates: Partial<Interaction>): Promise<Interaction> => {
    await delay(500);
    const index = INTERACTIONS.findIndex(i => i.id === id);
    if (index === -1) throw new Error('Interaction not found');
    
    const updated = {
      ...INTERACTIONS[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    INTERACTIONS[index] = updated;
    saveInteractions();
    return updated;
  },

  deleteInteraction: async (id: string): Promise<void> => {
    await delay(300);
    INTERACTIONS = INTERACTIONS.filter(i => i.id !== id);
    saveInteractions();
  },

  // Tasks
  getTasks: async (filters?: { customerId?: string; employeeId?: string; status?: Task['status'] }): Promise<Task[]> => {
    await delay(300);
    let filtered = [...TASKS];
    if (filters?.customerId) filtered = filtered.filter(t => t.customerId === filters.customerId);
    if (filters?.employeeId) filtered = filtered.filter(t => t.employeeId === filters.employeeId);
    if (filters?.status) filtered = filtered.filter(t => t.status === filters.status);
    return filtered;
  },

  createTask: async (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
    await delay(500);
    const newTask: Task = {
      ...data,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    TASKS.push(newTask);
    saveTasks();
    return newTask;
  },

  updateTask: async (id: string, updates: Partial<Task>): Promise<Task> => {
    await delay(500);
    const index = TASKS.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Task not found');
    
    const updated = {
      ...TASKS[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    TASKS[index] = updated;
    saveTasks();
    return updated;
  },

  deleteTask: async (id: string): Promise<void> => {
    await delay(300);
    TASKS = TASKS.filter(t => t.id !== id);
    saveTasks();
  },
};

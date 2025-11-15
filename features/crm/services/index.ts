// features/crm/services/index.ts
import type { Lead, Customer, Interaction, Task } from '../types';

export const createLead = (data: Partial<Lead>, userId: string): Lead => ({
  id: `lead-${Date.now()}`,
  name: data.name || '',
  email: data.email || '',
  phone: data.phone || '',
  company: data.company,
  status: 'new',
  source: data.source || '',
  estimatedValue: data.estimatedValue,
  notes: data.notes,
  createdDate: new Date().toISOString(),
  lastContactDate: undefined,
  nextFollowUpDate: data.nextFollowUpDate,
});

export const convertLeadToCustomer = (lead: Lead): Customer => ({
  id: `cust-${Date.now()}`,
  name: lead.name,
  email: lead.email,
  phone: lead.phone,
  since: new Date().toISOString(),
  type: lead.company ? 'business' : 'private',
  company: lead.company,
  source: lead.source,
  notes: lead.notes,
});

export const createInteraction = (data: Partial<Interaction>): Interaction => ({
  id: `int-${Date.now()}`,
  customerId: data.customerId,
  leadId: data.leadId,
  type: data.type || 'note',
  subject: data.subject || '',
  description: data.description || '',
  date: new Date().toISOString(),
  employeeId: data.employeeId,
  followUpRequired: data.followUpRequired,
  followUpDate: data.followUpDate,
});

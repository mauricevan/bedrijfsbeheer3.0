/**
 * CRM Filters Utilities
 * Pure filtering and search functions
 */

import type { Customer, Lead, Interaction, Task } from '../types/crm.types';

/**
 * Filter customers by search term
 */
export const filterCustomersBySearch = (
  customers: Customer[],
  searchTerm: string
): Customer[] => {
  if (!searchTerm) return customers;

  const searchLower = searchTerm.toLowerCase();

  return customers.filter((customer) => {
    // Search in name
    if (customer.name.toLowerCase().includes(searchLower)) return true;

    // Search in email
    if (customer.email.toLowerCase().includes(searchLower)) return true;

    // Search in company
    if (customer.company?.toLowerCase().includes(searchLower)) return true;

    // Search in phone
    if (customer.phone?.toLowerCase().includes(searchLower)) return true;

    // Search in address
    if (customer.address?.toLowerCase().includes(searchLower)) return true;

    // Search in city
    if (customer.city?.toLowerCase().includes(searchLower)) return true;

    // Search in KVK
    if (customer.kvk?.toLowerCase().includes(searchLower)) return true;

    // Search in VAT number
    if (customer.vatNumber?.toLowerCase().includes(searchLower)) return true;

    return false;
  });
};

/**
 * Filter customers by type
 */
export const filterCustomersByType = (
  customers: Customer[],
  type: string | null
): Customer[] => {
  if (!type) return customers;
  return customers.filter((customer) => customer.type === type);
};

/**
 * Filter customers by source
 */
export const filterCustomersBySource = (
  customers: Customer[],
  source: string | null
): Customer[] => {
  if (!source) return customers;
  return customers.filter((customer) => customer.source === source);
};

/**
 * Filter leads by search term
 */
export const filterLeadsBySearch = (
  leads: Lead[],
  searchTerm: string
): Lead[] => {
  if (!searchTerm) return leads;

  const searchLower = searchTerm.toLowerCase();

  return leads.filter((lead) => {
    // Search in name
    if (lead.name.toLowerCase().includes(searchLower)) return true;

    // Search in email
    if (lead.email.toLowerCase().includes(searchLower)) return true;

    // Search in company
    if (lead.company?.toLowerCase().includes(searchLower)) return true;

    // Search in phone
    if (lead.phone?.toLowerCase().includes(searchLower)) return true;

    // Search in source
    if (lead.source?.toLowerCase().includes(searchLower)) return true;

    // Search in notes
    if (lead.notes?.toLowerCase().includes(searchLower)) return true;

    return false;
  });
};

/**
 * Filter leads by status
 */
export const filterLeadsByStatus = (
  leads: Lead[],
  status: string | null
): Lead[] => {
  if (!status) return leads;
  return leads.filter((lead) => lead.status === status);
};

/**
 * Filter leads by source
 */
export const filterLeadsBySource = (
  leads: Lead[],
  source: string | null
): Lead[] => {
  if (!source) return leads;
  return leads.filter((lead) => lead.source === source);
};

/**
 * Filter interactions by search term
 */
export const filterInteractionsBySearch = (
  interactions: Interaction[],
  searchTerm: string
): Interaction[] => {
  if (!searchTerm) return interactions;

  const searchLower = searchTerm.toLowerCase();

  return interactions.filter((interaction) => {
    // Search in subject
    if (interaction.subject.toLowerCase().includes(searchLower)) return true;

    // Search in description
    if (interaction.description.toLowerCase().includes(searchLower)) return true;

    return false;
  });
};

/**
 * Filter interactions by type
 */
export const filterInteractionsByType = (
  interactions: Interaction[],
  type: string | null
): Interaction[] => {
  if (!type) return interactions;
  return interactions.filter((interaction) => interaction.type === type);
};

/**
 * Filter interactions by employee
 */
export const filterInteractionsByEmployee = (
  interactions: Interaction[],
  employeeId: string | null
): Interaction[] => {
  if (!employeeId) return interactions;
  return interactions.filter((interaction) => interaction.employeeId === employeeId);
};

/**
 * Filter tasks by search term
 */
export const filterTasksBySearch = (
  tasks: Task[],
  searchTerm: string
): Task[] => {
  if (!searchTerm) return tasks;

  const searchLower = searchTerm.toLowerCase();

  return tasks.filter((task) => {
    // Search in title
    if (task.title.toLowerCase().includes(searchLower)) return true;

    // Search in description
    if (task.description?.toLowerCase().includes(searchLower)) return true;

    return false;
  });
};

/**
 * Filter tasks by status
 */
export const filterTasksByStatus = (
  tasks: Task[],
  status: string | null
): Task[] => {
  if (!status) return tasks;
  return tasks.filter((task) => task.status === status);
};

/**
 * Filter tasks by priority
 */
export const filterTasksByPriority = (
  tasks: Task[],
  priority: string | null
): Task[] => {
  if (!priority) return tasks;
  return tasks.filter((task) => task.priority === priority);
};

/**
 * Filter tasks by employee
 */
export const filterTasksByEmployee = (
  tasks: Task[],
  employeeId: string | null
): Task[] => {
  if (!employeeId) return tasks;
  return tasks.filter((task) => task.employeeId === employeeId);
};

/**
 * Get overdue tasks
 */
export const getOverdueTasks = (tasks: Task[]): Task[] => {
  const today = new Date().toISOString().split('T')[0];
  return tasks.filter(
    (task) =>
      task.status !== 'done' &&
      task.dueDate &&
      task.dueDate < today
  );
};


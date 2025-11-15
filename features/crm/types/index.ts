// features/crm/types/index.ts
export type { Lead, LeadStatus, Customer, Interaction, InteractionType, Task, TaskPriority, TaskStatus, Employee, User, Email } from '../../types';

export interface CRMProps {
  leads: any[];
  setLeads: React.Dispatch<React.SetStateAction<any[]>>;
  customers: any[];
  setCustomers: React.Dispatch<React.SetStateAction<any[]>>;
  interactions: any[];
  setInteractions: React.Dispatch<React.SetStateAction<any[]>>;
  tasks: any[];
  setTasks: React.Dispatch<React.SetStateAction<any[]>>;
  employees: any[];
  currentUser: any;
  isAdmin: boolean;
}

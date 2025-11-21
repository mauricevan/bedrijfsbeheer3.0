import type { WorkOrder } from '../types';
import { storage, STORAGE_KEYS } from '@/utils/storage';

const DEFAULT_WORK_ORDERS: WorkOrder[] = [
  {
    id: '1',
    title: 'Install Office Network',
    description: 'Set up network infrastructure for new office',
    status: 'in_progress',
    assignedTo: 'emp1',
    assignedToName: 'John Doe',
    customerId: 'cust1',
    customerName: 'Acme Corp',
    location: 'Amsterdam Office',
    scheduledDate: new Date(Date.now() + 86400000).toISOString(),
    materials: [],
    estimatedHours: 8,
    hoursSpent: 4,
    estimatedCost: 1200,
    sortIndex: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Repair Laptop',
    description: 'Fix broken screen and keyboard',
    status: 'todo',
    materials: [],
    estimatedHours: 2,
    hoursSpent: 0,
    estimatedCost: 350,
    sortIndex: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Server Maintenance',
    description: 'Monthly server check and updates',
    status: 'completed',
    assignedTo: 'emp2',
    assignedToName: 'Jane Smith',
    completedDate: new Date().toISOString(),
    materials: [],
    estimatedHours: 4,
    hoursSpent: 3.5,
    estimatedCost: 500,
    sortIndex: 0,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let MOCK_WORK_ORDERS = storage.get<WorkOrder[]>(STORAGE_KEYS.WORK_ORDERS, DEFAULT_WORK_ORDERS);

const saveWorkOrders = () => {
  storage.set(STORAGE_KEYS.WORK_ORDERS, MOCK_WORK_ORDERS);
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const workOrderService = {
  getAll: async (): Promise<WorkOrder[]> => {
    await delay(500);
    return [...MOCK_WORK_ORDERS];
  },

  create: async (data: Omit<WorkOrder, 'id' | 'createdAt' | 'updatedAt'>): Promise<WorkOrder> => {
    await delay(800);
    const newOrder: WorkOrder = {
      ...data,
      id: `wo-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    MOCK_WORK_ORDERS.push(newOrder);
    saveWorkOrders();
    return newOrder;
  },

  update: async (id: string, updates: Partial<WorkOrder>): Promise<WorkOrder> => {
    await delay(500);
    const index = MOCK_WORK_ORDERS.findIndex(wo => wo.id === id);
    if (index === -1) throw new Error('Work order not found');
    
    const updated = {
      ...MOCK_WORK_ORDERS[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    MOCK_WORK_ORDERS[index] = updated;
    saveWorkOrders();
    return updated;
  },

  delete: async (id: string): Promise<void> => {
    await delay(500);
    const index = MOCK_WORK_ORDERS.findIndex(wo => wo.id === id);
    if (index !== -1) {
      MOCK_WORK_ORDERS.splice(index, 1);
      saveWorkOrders();
    }
  },
};

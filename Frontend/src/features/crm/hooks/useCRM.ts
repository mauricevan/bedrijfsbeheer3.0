import { useState, useEffect, useCallback } from 'react';
import type { Customer, Lead, Interaction, Task } from '../types/crm.types';
import { crmService } from '../services/crmService';

export const useCRM = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [customersData, leadsData, interactionsData, tasksData] = await Promise.all([
        crmService.getCustomers(),
        crmService.getLeads(),
        crmService.getInteractions(),
        crmService.getTasks(),
      ]);
      setCustomers(customersData);
      setLeads(leadsData);
      setInteractions(interactionsData);
      setTasks(tasksData);
    } catch (error) {
      console.error('Failed to fetch CRM data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const createCustomer = async (data: CreateCustomerInput) => {
    const newCustomer = await crmService.createCustomer(data);
    setCustomers(prev => [...prev, newCustomer]);
    return newCustomer;
  };

  const updateCustomer = async (id: string, updates: UpdateCustomerInput) => {
    const updated = await crmService.updateCustomer(id, updates);
    setCustomers(prev => prev.map(c => c.id === id ? updated : c));
    return updated;
  };

  const deleteCustomer = async (id: string) => {
    await crmService.deleteCustomer(id);
    setCustomers(prev => prev.filter(c => c.id !== id));
  };

  const createLead = async (data: CreateLeadInput) => {
    const newLead = await crmService.createLead(data);
    setLeads(prev => [...prev, newLead]);
    return newLead;
  };

  const updateLead = async (id: string, updates: UpdateLeadInput) => {
    const updated = await crmService.updateLead(id, updates);
    setLeads(prev => prev.map(l => l.id === id ? updated : l));
    return updated;
  };

  const deleteLead = async (id: string) => {
    await crmService.deleteLead(id);
    setLeads(prev => prev.filter(l => l.id !== id));
  };

  const convertLeadToCustomer = async (leadId: string) => {
    const customer = await crmService.convertLeadToCustomer(leadId);
    setCustomers(prev => [...prev, customer]);
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: 'won' as const } : l));
    return customer;
  };

  const createInteraction = async (data: CreateInteractionInput) => {
    const newInteraction = await crmService.createInteraction(data);
    setInteractions(prev => [...prev, newInteraction]);
    return newInteraction;
  };

  const updateInteraction = async (id: string, updates: UpdateInteractionInput) => {
    const updated = await crmService.updateInteraction(id, updates);
    setInteractions(prev => prev.map(i => i.id === id ? updated : i));
    return updated;
  };

  const deleteInteraction = async (id: string) => {
    await crmService.deleteInteraction(id);
    setInteractions(prev => prev.filter(i => i.id !== id));
  };

  const createTask = async (data: CreateTaskInput) => {
    const newTask = await crmService.createTask(data);
    setTasks(prev => [...prev, newTask]);
    return newTask;
  };

  const updateTask = async (id: string, updates: UpdateTaskInput) => {
    const updated = await crmService.updateTask(id, updates);
    setTasks(prev => prev.map(t => t.id === id ? updated : t));
    return updated;
  };

  const deleteTask = async (id: string) => {
    await crmService.deleteTask(id);
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return {
    customers,
    leads,
    interactions,
    tasks,
    isLoading,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    createLead,
    updateLead,
    deleteLead,
    convertLeadToCustomer,
    createInteraction,
    updateInteraction,
    deleteInteraction,
    createTask,
    updateTask,
    deleteTask,
    refresh: fetchData,
  };
};

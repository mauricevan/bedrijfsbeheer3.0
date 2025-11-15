// features/crm/hooks/index.ts
import { useMemo } from 'react';

export const useCRMStats = (leads: any[], customers: any[]) => {
  return useMemo(() => {
    const totalLeads = leads.length;
    const activeLeads = leads.filter((l) =>
      l.status !== 'won' && l.status !== 'lost'
    ).length;
    const wonLeads = leads.filter((l) => l.status === 'won').length;
    const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;
    const pipelineValue = leads
      .filter((l) => l.status !== 'won' && l.status !== 'lost')
      .reduce((sum, l) => sum + (l.estimatedValue || 0), 0);

    return {
      totalLeads,
      activeLeads,
      wonLeads,
      conversionRate,
      pipelineValue,
      totalCustomers: customers.length,
      businessCustomers: customers.filter((c) => c.type === 'business').length,
      privateCustomers: customers.filter((c) => c.type === 'private').length,
    };
  }, [leads, customers]);
};

export const useLeadsPipeline = (leads: any[]) => {
  return useMemo(() => {
    const stages = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'];
    const grouped: Record<string, any[]> = {};
    stages.forEach((stage) => {
      grouped[stage] = leads.filter((l) => l.status === stage);
    });
    return grouped;
  }, [leads]);
};

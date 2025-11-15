// features/crm/utils/index.ts
export const getLeadStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    new: 'bg-purple-100 text-purple-800',
    contacted: 'bg-blue-100 text-blue-800',
    qualified: 'bg-yellow-100 text-yellow-800',
    proposal: 'bg-orange-100 text-orange-800',
    negotiation: 'bg-pink-100 text-pink-800',
    won: 'bg-green-100 text-green-800',
    lost: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100';
};

export const calculateConversionRate = (leads: any[]): number => {
  if (leads.length === 0) return 0;
  const won = leads.filter((l) => l.status === 'won').length;
  return Math.round((won / leads.length) * 100);
};

export const calculatePipelineValue = (leads: any[]): number => {
  return leads
    .filter((l) => l.status !== 'won' && l.status !== 'lost')
    .reduce((sum, l) => sum + (l.estimatedValue || 0), 0);
};

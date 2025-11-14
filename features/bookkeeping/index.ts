// features/bookkeeping/index.ts
export * from '../../../types';
export const calculateVAT = (amount: number, rate: number) => amount * (rate / 100);
export const ledgerAccounts = [
  { id: '1300', name: 'Debiteuren', type: 'asset' },
  { id: '1600', name: 'Voorraad', type: 'asset' },
  { id: '4400', name: 'Crediteuren', type: 'liability' },
  { id: '8000', name: 'Omzet', type: 'revenue' },
];

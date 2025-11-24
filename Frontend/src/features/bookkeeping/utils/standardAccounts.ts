import type { LedgerAccount } from '../types/bookkeeping.types';

/**
 * Standard MKB (Midden- en Kleinbedrijf) Chart of Accounts
 * Based on Dutch accounting standards (RJ)
 */
export const STANDARD_MKB_ACCOUNTS: Omit<LedgerAccount, 'id' | 'debit' | 'credit' | 'balance' | 'createdAt' | 'updatedAt'>[] = [
  // Vaste Activa (Fixed Assets) - 1000-1999
  { accountNumber: '1000', name: 'Kas', type: 'asset', category: 'Vaste Activa', description: 'Contant geld', isActive: true },
  { accountNumber: '1010', name: 'Bank', type: 'asset', category: 'Vaste Activa', description: 'Bankrekening', isActive: true },
  { accountNumber: '1020', name: 'Bank Spaarrekening', type: 'asset', category: 'Vaste Activa', description: 'Spaarrekening', isActive: true },
  { accountNumber: '1100', name: 'Debiteuren', type: 'asset', category: 'Vlottende Activa', description: 'Vorderingen op klanten', isActive: true },
  { accountNumber: '1110', name: 'Te vorderen BTW', type: 'asset', category: 'Vlottende Activa', description: 'BTW te vorderen van Belastingdienst', isActive: true },
  { accountNumber: '1200', name: 'Voorraden', type: 'asset', category: 'Vlottende Activa', description: 'Voorraad goederen', isActive: true },
  { accountNumber: '1300', name: 'Debiteuren', type: 'asset', category: 'Vlottende Activa', description: 'Vorderingen op klanten', isActive: true },
  { accountNumber: '1400', name: 'Voorraad', type: 'asset', category: 'Vlottende Activa', description: 'Voorraad goederen', isActive: true },
  { accountNumber: '1500', name: 'Onderhanden werk', type: 'asset', category: 'Vlottende Activa', description: 'Werk in uitvoering', isActive: true },
  { accountNumber: '1600', name: 'Crediteuren', type: 'liability', category: 'Kortlopende Schulden', description: 'Schulden aan leveranciers', isActive: true },
  { accountNumber: '1700', name: 'Te betalen BTW', type: 'liability', category: 'Kortlopende Schulden', description: 'BTW te betalen aan Belastingdienst', isActive: true },
  
  // Passiva (Liabilities) - 2000-2999
  { accountNumber: '2000', name: 'Hypothecaire lening', type: 'liability', category: 'Langlopende Schulden', description: 'Hypotheek', isActive: true },
  { accountNumber: '2100', name: 'Lange termijn lening', type: 'liability', category: 'Langlopende Schulden', description: 'Lange termijn lening', isActive: true },
  { accountNumber: '2200', name: 'BTW hoog 21%', type: 'liability', category: 'Kortlopende Schulden', description: 'BTW te betalen 21%', isActive: true },
  { accountNumber: '2210', name: 'BTW laag 9%', type: 'liability', category: 'Kortlopende Schulden', description: 'BTW te betalen 9%', isActive: true },
  { accountNumber: '2220', name: 'BTW te vorderen 21%', type: 'asset', category: 'Vlottende Activa', description: 'BTW te vorderen 21%', isActive: true },
  { accountNumber: '2230', name: 'BTW te vorderen 9%', type: 'asset', category: 'Vlottende Activa', description: 'BTW te vorderen 9%', isActive: true },
  
  // Eigen Vermogen (Equity) - 3000-3999
  { accountNumber: '3000', name: 'Eigen vermogen', type: 'equity', category: 'Eigen Vermogen', description: 'Eigen vermogen', isActive: true },
  { accountNumber: '3100', name: 'Privé opname', type: 'equity', category: 'Eigen Vermogen', description: 'Privé opnames', isActive: true },
  { accountNumber: '3200', name: 'Privé storting', type: 'equity', category: 'Eigen Vermogen', description: 'Privé stortingen', isActive: true },
  { accountNumber: '3300', name: 'Winst/Verlies', type: 'equity', category: 'Eigen Vermogen', description: 'Winst of verlies', isActive: true },
  
  // Kosten (Expenses) - 4000-6999
  { accountNumber: '4000', name: 'Inkoop grondstoffen', type: 'expense', category: 'Kosten', description: 'Inkoop grondstoffen', isActive: true },
  { accountNumber: '4010', name: 'Inkoop goederen', type: 'expense', category: 'Kosten', description: 'Inkoop goederen', isActive: true },
  { accountNumber: '4100', name: 'Inkoop diensten', type: 'expense', category: 'Kosten', description: 'Inkoop diensten', isActive: true },
  { accountNumber: '4200', name: 'Lonen', type: 'expense', category: 'Kosten', description: 'Lonen personeel', isActive: true },
  { accountNumber: '4300', name: 'Sociale lasten', type: 'expense', category: 'Kosten', description: 'Sociale lasten', isActive: true },
  { accountNumber: '4400', name: 'Inkoop diensten', type: 'expense', category: 'Kosten', description: 'Inkoop diensten', isActive: true },
  { accountNumber: '4500', name: 'Huur', type: 'expense', category: 'Kosten', description: 'Huur pand', isActive: true },
  { accountNumber: '4600', name: 'Energie', type: 'expense', category: 'Kosten', description: 'Energiekosten', isActive: true },
  { accountNumber: '4700', name: 'Verzekeringen', type: 'expense', category: 'Kosten', description: 'Verzekeringskosten', isActive: true },
  { accountNumber: '4800', name: 'Marketing', type: 'expense', category: 'Kosten', description: 'Marketingkosten', isActive: true },
  { accountNumber: '4900', name: 'Kantoorartikelen', type: 'expense', category: 'Kosten', description: 'Kantoorartikelen', isActive: true },
  { accountNumber: '5000', name: 'Afschrijvingen', type: 'expense', category: 'Kosten', description: 'Afschrijvingen', isActive: true },
  { accountNumber: '5100', name: 'Rente', type: 'expense', category: 'Kosten', description: 'Rentekosten', isActive: true },
  { accountNumber: '5200', name: 'Reiskosten', type: 'expense', category: 'Kosten', description: 'Reiskosten', isActive: true },
  { accountNumber: '5300', name: 'Telefoon/Internet', type: 'expense', category: 'Kosten', description: 'Telefoon en internet', isActive: true },
  { accountNumber: '5400', name: 'Accountantskosten', type: 'expense', category: 'Kosten', description: 'Accountantskosten', isActive: true },
  { accountNumber: '5500', name: 'Diverse kosten', type: 'expense', category: 'Kosten', description: 'Diverse kosten', isActive: true },
  
  // Omzet (Revenue) - 8000-8999
  { accountNumber: '8000', name: 'Omzet goederen 21%', type: 'revenue', category: 'Omzet', description: 'Omzet goederen met 21% BTW', isActive: true },
  { accountNumber: '8010', name: 'Omzet diensten 9%', type: 'revenue', category: 'Omzet', description: 'Omzet diensten met 9% BTW', isActive: true },
  { accountNumber: '8020', name: 'Omzet vrijgesteld 0%', type: 'revenue', category: 'Omzet', description: 'Omzet vrijgesteld van BTW', isActive: true },
  { accountNumber: '8100', name: 'Overige opbrengsten', type: 'revenue', category: 'Omzet', description: 'Overige opbrengsten', isActive: true },
];

/**
 * Generate full ledger account with default values
 */
export const createLedgerAccount = (
  account: typeof STANDARD_MKB_ACCOUNTS[0],
  id?: string
): LedgerAccount => {
  return {
    id: id || `acc-${account.accountNumber}-${Date.now()}`,
    accountNumber: account.accountNumber,
    name: account.name,
    type: account.type,
    category: account.category,
    description: account.description,
    debit: 0,
    credit: 0,
    balance: 0,
    isActive: account.isActive,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

/**
 * Get all standard accounts as LedgerAccount array
 */
export const getStandardLedgerAccounts = (): LedgerAccount[] => {
  return STANDARD_MKB_ACCOUNTS.map((acc, index) => 
    createLedgerAccount(acc, `acc-${acc.accountNumber}`)
  );
};


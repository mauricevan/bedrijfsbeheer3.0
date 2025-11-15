import { Quote, Invoice, WorkOrder } from '../types';

export interface WorkflowValidationResult {
  isValid: boolean;
  message: string;
  severity: 'error' | 'warning' | 'info';
  canProceed: boolean;
  suggestedAction?: string;
}

const createResult = (isValid: boolean, message: string, severity: 'error' | 'warning' | 'info', canProceed: boolean, suggestedAction?: string): WorkflowValidationResult => ({
  isValid,
  message,
  severity,
  canProceed,
  suggestedAction,
});

const error = (msg: string, action?: string) => createResult(false, msg, 'error', false, action);
const warning = (msg: string, action?: string) => createResult(false, msg, 'warning', false, action);
const success = (msg: string) => createResult(true, msg, 'info', true);

export function validateQuoteToWorkOrder(quote: Quote, workOrders: WorkOrder[]): WorkflowValidationResult {
  if (quote.status !== 'approved')
    return error(`⚠️ Offerte nog niet geaccepteerd. Status: ${quote.status}.`, 'Wacht op goedkeuring van de klant.');

  if (quote.workOrderId) {
    const existing = workOrders.find(wo => wo.id === quote.workOrderId);
    if (existing)
      return error(`⚠️ Werkorder ${existing.id} bestaat al. Status: ${existing.status}.`, `Bekijk werkorder ${existing.id}.`);
  }

  if (quote.invoiceId)
    return warning('⚠️ Offerte heeft al een factuur. Maak eerst werkorder.', 'Gebruik bestaande factuur.');

  return success('✅ Offerte kan worden omgezet naar werkorder.');
}

export function validateWorkOrderToInvoice(workOrder: WorkOrder, quotes: Quote[], invoices: Invoice[]): WorkflowValidationResult {
  if (workOrder.status !== 'Voltooid')
    return error(`⚠️ Werkorder niet voltooid. Status: ${workOrder.status}.`, 'Voltooi eerst de werkorder.');

  if (workOrder.invoiceId) {
    const existing = invoices.find(inv => inv.id === workOrder.invoiceId);
    if (existing)
      return error(`⚠️ Factuur ${existing.invoiceNumber} bestaat al. Status: ${existing.status}.`, `Bekijk factuur ${existing.invoiceNumber}.`);
  }

  if (workOrder.quoteId) {
    const quote = quotes.find(q => q.id === workOrder.quoteId);
    if (quote?.invoiceId) {
      const existing = invoices.find(inv => inv.id === quote.invoiceId);
      if (existing)
        return createResult(false, '⚠️ Offerte heeft al een factuur. Deze wordt bijgewerkt.', 'info', true, 'Bestaande factuur wordt bijgewerkt.');
    }
  }

  if (!workOrder.customerId)
    return error('⚠️ Werkorder heeft geen klant. Voeg eerst een klant toe.', 'Koppel eerst een klant.');

  return success('✅ Werkorder kan worden omgezet naar factuur.');
}

export function validateQuoteToInvoice(quote: Quote, workOrders: WorkOrder[]): WorkflowValidationResult {
  if (quote.status !== 'approved')
    return error(`⚠️ Offerte niet geaccepteerd. Status: ${quote.status}.`, 'Wacht op goedkeuring.');

  if (quote.workOrderId) {
    const workOrder = workOrders.find(wo => wo.id === quote.workOrderId);
    if (workOrder && workOrder.status !== 'Voltooid')
      return warning(`⚠️ Actieve werkorder ${workOrder.id}. Status: ${workOrder.status}.`, 'Wacht tot werkorder is voltooid.');
  }

  if (quote.invoiceId)
    return error('⚠️ Offerte heeft al een factuur.', 'Bekijk bestaande factuur.');

  return success('✅ Offerte kan worden omgezet naar factuur.');
}

export function validateInvoiceToWorkOrder(invoice: Invoice, workOrders: WorkOrder[]): WorkflowValidationResult {
  if (invoice.workOrderId) {
    const existing = workOrders.find(wo => wo.id === invoice.workOrderId);
    if (existing)
      return error(`⚠️ Werkorder ${existing.id} bestaat al. Status: ${existing.status}.`, `Bekijk werkorder ${existing.id}.`);
  }

  if (!['draft', 'sent'].includes(invoice.status))
    return error(`⚠️ Factuur kan niet worden omgezet. Status: ${invoice.status}.`, 'Alleen concept- of verzonden facturen kunnen worden omgezet.');

  return success('✅ Factuur kan worden omgezet naar werkorder.');
}

export function validateQuoteEdit(quote: Quote, workOrders: WorkOrder[]): WorkflowValidationResult {
  if (quote.workOrderId) {
    const workOrder = workOrders.find(wo => wo.id === quote.workOrderId);
    if (workOrder) {
      if (workOrder.status === 'Voltooid')
        return error('🔒 Werkorder is voltooid. Alleen notities kunnen worden aangepast.', 'Werkorder is voltooid.');

      if (workOrder.status === 'In Uitvoering')
        return createResult(true, '⚠️ Werkorder is actief. Medewerker ontvangt notificatie.', 'warning', true, 'Medewerker ontvangt notificatie.');
    }
  }

  return success('✅ Offerte kan worden bewerkt.');
}

export function validateInvoiceEdit(invoice: Invoice, workOrders: WorkOrder[]): WorkflowValidationResult {
  if (invoice.workOrderId) {
    const workOrder = workOrders.find(wo => wo.id === invoice.workOrderId);
    if (workOrder && workOrder.status === 'Voltooid')
      return warning('🔒 Factuur gekoppeld aan voltooide werkorder.', 'Alleen notities kunnen worden aangepast.');
  }

  if (invoice.status === 'paid')
    return error('🔒 Factuur is al betaald. Wijzigingen niet mogelijk.', 'Betaalde facturen kunnen niet worden bewerkt.');

  return success('✅ Factuur kan worden bewerkt.');
}

export function getWorkflowGuardrailMessage(validation: WorkflowValidationResult): { icon: string; color: string; message: string } {
  const configs = {
    error: { icon: '🔒', color: 'bg-red-50 border-red-500 text-red-800' },
    warning: { icon: '⚠️', color: 'bg-orange-50 border-orange-500 text-orange-800' },
    info: { icon: 'ℹ️', color: 'bg-blue-50 border-blue-500 text-blue-800' },
  };

  const config = configs[validation.severity];
  return { ...config, message: validation.message };
}

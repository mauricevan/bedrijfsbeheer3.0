/**
 * Invoice Reminder Service
 *
 * Features:
 * - Automatic reminder date calculation (+7 days, +14 days after due date)
 * - Reminder tracking (sent/not sent)
 * - Email reminder functionality
 * - Reminder history
 *
 * Compliant with: ACCOUNTING_COMPLETE.md Feature 55-62 (P0)
 */

import type { Invoice, Customer, Employee } from '../../../types';

/**
 * Reminder configuration
 */
export interface ReminderConfig {
  reminder1DaysAfterDue: number; // Default: 7 days
  reminder2DaysAfterDue: number; // Default: 14 days
  autoSend: boolean; // Auto-send reminders
}

export const DEFAULT_REMINDER_CONFIG: ReminderConfig = {
  reminder1DaysAfterDue: 7,
  reminder2DaysAfterDue: 14,
  autoSend: false,
};

/**
 * Calculate reminder dates based on due date
 *
 * @param dueDate - Invoice due date (YYYY-MM-DD)
 * @param config - Reminder configuration
 * @returns Calculated reminder dates
 */
export const calculateReminderDates = (
  dueDate: string,
  config: ReminderConfig = DEFAULT_REMINDER_CONFIG
): {
  reminder1Date: string;
  reminder2Date: string;
} => {
  const due = new Date(dueDate);

  const reminder1 = new Date(due);
  reminder1.setDate(due.getDate() + config.reminder1DaysAfterDue);

  const reminder2 = new Date(due);
  reminder2.setDate(due.getDate() + config.reminder2DaysAfterDue);

  return {
    reminder1Date: reminder1.toISOString().split('T')[0],
    reminder2Date: reminder2.toISOString().split('T')[0],
  };
};

/**
 * Initialize reminders when invoice is sent
 *
 * @param invoice - Invoice object
 * @param config - Reminder configuration
 * @returns Invoice with reminders initialized
 */
export const initializeReminders = (
  invoice: Invoice,
  config: ReminderConfig = DEFAULT_REMINDER_CONFIG
): Invoice => {
  if (!invoice.dueDate) {
    return invoice; // No due date, no reminders
  }

  const { reminder1Date, reminder2Date } = calculateReminderDates(
    invoice.dueDate,
    config
  );

  return {
    ...invoice,
    reminders: {
      reminder1Date,
      reminder1Sent: false,
      reminder2Date,
      reminder2Sent: false,
    },
  };
};

/**
 * Check if reminder should be sent today
 *
 * @param reminderDate - Date when reminder should be sent
 * @param reminderSent - Whether reminder was already sent
 * @returns True if reminder should be sent today
 */
export const shouldSendReminderToday = (
  reminderDate: string | undefined,
  reminderSent: boolean | undefined
): boolean => {
  if (!reminderDate || reminderSent) {
    return false;
  }

  const today = new Date().toISOString().split('T')[0];
  return reminderDate <= today;
};

/**
 * Get invoices that need reminder 1 sent
 *
 * @param invoices - Array of invoices
 * @returns Invoices needing reminder 1
 */
export const getInvoicesNeedingReminder1 = (
  invoices: Invoice[]
): Invoice[] => {
  return invoices.filter(
    (inv) =>
      inv.status === 'sent' || inv.status === 'overdue'
  ).filter(
    (inv) =>
      inv.reminders &&
      shouldSendReminderToday(
        inv.reminders.reminder1Date,
        inv.reminders.reminder1Sent
      )
  );
};

/**
 * Get invoices that need reminder 2 sent
 *
 * @param invoices - Array of invoices
 * @returns Invoices needing reminder 2
 */
export const getInvoicesNeedingReminder2 = (
  invoices: Invoice[]
): Invoice[] => {
  return invoices.filter(
    (inv) =>
      inv.status === 'sent' || inv.status === 'overdue'
  ).filter(
    (inv) =>
      inv.reminders &&
      shouldSendReminderToday(
        inv.reminders.reminder2Date,
        inv.reminders.reminder2Sent
      )
  );
};

/**
 * Mark reminder as sent
 *
 * @param invoice - Invoice object
 * @param reminderNumber - Which reminder (1 or 2)
 * @returns Updated invoice
 */
export const markReminderAsSent = (
  invoice: Invoice,
  reminderNumber: 1 | 2
): Invoice => {
  const now = new Date().toISOString();

  if (!invoice.reminders) {
    return invoice;
  }

  if (reminderNumber === 1) {
    return {
      ...invoice,
      reminders: {
        ...invoice.reminders,
        reminder1Sent: true,
        reminder1SentDate: now.split('T')[0],
      },
    };
  } else {
    return {
      ...invoice,
      reminders: {
        ...invoice.reminders,
        reminder2Sent: true,
        reminder2SentDate: now.split('T')[0],
      },
    };
  }
};

/**
 * Generate reminder email content
 *
 * @param invoice - Invoice object
 * @param customer - Customer object
 * @param reminderNumber - Which reminder (1 or 2)
 * @returns Email content
 */
export const generateReminderEmail = (
  invoice: Invoice,
  customer: Customer,
  reminderNumber: 1 | 2
): {
  subject: string;
  body: string;
} => {
  const reminderText = reminderNumber === 1 ? 'eerste' : 'tweede';
  const daysOverdue = invoice.dueDate
    ? Math.floor(
        (new Date().getTime() - new Date(invoice.dueDate).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  const subject = `${reminderText.charAt(0).toUpperCase() + reminderText.slice(1)} herinnering - Factuur ${invoice.invoiceNumber}`;

  const body = `
Beste ${customer.name},

Dit is een ${reminderText} herinnering voor factuur ${invoice.invoiceNumber}.

Factuurnummer: ${invoice.invoiceNumber}
Factuurdatum: ${invoice.issueDate}
Vervaldatum: ${invoice.dueDate}
Bedrag: €${invoice.total.toFixed(2)}
Dagen over vervaldatum: ${daysOverdue > 0 ? daysOverdue : 0}

${daysOverdue > 0
  ? `Deze factuur is ${daysOverdue} dag(en) over de vervaldatum.`
  : 'Deze factuur zal binnenkort vervallen.'
}

Indien u de betaling reeds heeft verricht, kunt u dit bericht negeren.

Met vriendelijke groet,
[Bedrijfsnaam]
  `.trim();

  return { subject, body };
};

/**
 * Send reminder (placeholder for actual email sending)
 *
 * @param invoice - Invoice object
 * @param customer - Customer object
 * @param reminderNumber - Which reminder (1 or 2)
 * @returns Promise<boolean> - Success status
 */
export const sendReminder = async (
  invoice: Invoice,
  customer: Customer,
  reminderNumber: 1 | 2
): Promise<boolean> => {
  try {
    const { subject, body } = generateReminderEmail(
      invoice,
      customer,
      reminderNumber
    );

    // TODO: Integrate with actual email service
    // For now, just log it
    console.log('Sending reminder email:');
    console.log('To:', customer.email);
    console.log('Subject:', subject);
    console.log('Body:', body);

    // Simulate email sending
    return true;
  } catch (error) {
    console.error('Failed to send reminder:', error);
    return false;
  }
};

/**
 * Process all pending reminders (auto-send)
 *
 * @param invoices - Array of invoices
 * @param customers - Array of customers
 * @param config - Reminder configuration
 * @returns Updated invoices with sent reminders
 */
export const processAutomaticReminders = async (
  invoices: Invoice[],
  customers: Customer[],
  config: ReminderConfig = DEFAULT_REMINDER_CONFIG
): Promise<Invoice[]> => {
  if (!config.autoSend) {
    return invoices; // Auto-send disabled
  }

  const updatedInvoices = [...invoices];

  // Process reminder 1
  const needReminder1 = getInvoicesNeedingReminder1(invoices);
  for (const invoice of needReminder1) {
    const customer = customers.find((c) => c.id === invoice.customerId);
    if (customer) {
      const sent = await sendReminder(invoice, customer, 1);
      if (sent) {
        const index = updatedInvoices.findIndex((i) => i.id === invoice.id);
        if (index !== -1) {
          updatedInvoices[index] = markReminderAsSent(invoice, 1);
        }
      }
    }
  }

  // Process reminder 2
  const needReminder2 = getInvoicesNeedingReminder2(invoices);
  for (const invoice of needReminder2) {
    const customer = customers.find((c) => c.id === invoice.customerId);
    if (customer) {
      const sent = await sendReminder(invoice, customer, 2);
      if (sent) {
        const index = updatedInvoices.findIndex((i) => i.id === invoice.id);
        if (index !== -1) {
          updatedInvoices[index] = markReminderAsSent(invoice, 2);
        }
      }
    }
  }

  return updatedInvoices;
};

/**
 * Get reminder statistics
 *
 * @param invoices - Array of invoices
 * @returns Reminder statistics
 */
export const getReminderStats = (invoices: Invoice[]): {
  totalReminder1Sent: number;
  totalReminder2Sent: number;
  pendingReminder1: number;
  pendingReminder2: number;
} => {
  const reminder1Sent = invoices.filter(
    (inv) => inv.reminders?.reminder1Sent
  ).length;

  const reminder2Sent = invoices.filter(
    (inv) => inv.reminders?.reminder2Sent
  ).length;

  const pendingReminder1 = getInvoicesNeedingReminder1(invoices).length;
  const pendingReminder2 = getInvoicesNeedingReminder2(invoices).length;

  return {
    totalReminder1Sent: reminder1Sent,
    totalReminder2Sent: reminder2Sent,
    pendingReminder1,
    pendingReminder2,
  };
};

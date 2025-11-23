import React, { useState, useCallback, useRef } from 'react';
import { Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { Modal } from './common/Modal';
import { Input } from './common/Input';
import { parseEmlFile, detectWorkflowType, type ParsedEmail } from '@/utils/emailParser';
import { useAccounting } from '@/features/accounting/hooks/useAccounting';
import { useCRM } from '@/features/crm/hooks/useCRM';
import { useWorkOrders } from '@/features/work-orders/hooks/useWorkOrders';
import { useHRM } from '@/features/hrm/hooks/useHRM';
import { useToast } from '@/context/ToastContext';
import type { Customer } from '@/features/crm/types/crm.types';

interface ProcessedEmail {
  email: ParsedEmail;
  workflowType: 'order' | 'task' | 'notification';
  customerId?: string;
  customerName?: string;
  status: 'success' | 'error';
  workflowItemId?: string;
  error?: string;
  timestamp: string;
}

export const EmailDropZone: React.FC = () => {
  const { showToast } = useToast();
  const { customers, leads } = useCRM();
  const { createQuote } = useAccounting();
  const { createWorkOrder } = useWorkOrders();
  const { createTask } = useCRM();
  const { employees } = useHRM();

  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedEmail, setParsedEmail] = useState<ParsedEmail | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [rememberMapping, setRememberMapping] = useState(false);
  const [processedEmails, setProcessedEmails] = useState<ProcessedEmail[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Match customer by email
  const matchCustomer = useCallback((email: string): Customer | null => {
    const emailLower = email.toLowerCase();
    
    // Check customer primary email
    const customer = customers.find(c => 
      c.email.toLowerCase() === emailLower ||
      c.emailAddresses?.some(e => e.toLowerCase() === emailLower)
    );
    
    if (customer) return customer;

    // Check lead email
    const lead = leads.find(l => l.email.toLowerCase() === emailLower);
    if (lead) {
      // Return a customer-like object from lead
      return {
        id: lead.id,
        name: lead.name,
        email: lead.email,
        company: lead.company,
      } as Customer;
    }

    return null;
  }, [customers, leads]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const processFile = useCallback(async (file: File) => {
    try {
      setIsProcessing(true);
      const parsed = await parseEmlFile(file);
      setParsedEmail(parsed);
      
      // Auto-match customer
      const matchedCustomer = matchCustomer(parsed.from);
      if (matchedCustomer) {
        setSelectedCustomerId(matchedCustomer.id);
      }
      
      setShowPreview(true);
    } catch (error) {
      showToast('Fout bij het parseren van het e-mailbestand', 'error');
      console.error('Email parsing error:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [matchCustomer, showToast]);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter(f => f.name.endsWith('.eml'));
    if (files.length > 0) {
      await processFile(files[0]);
    }
  }, [processFile]);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.name.endsWith('.eml')) {
        await processFile(file);
      } else {
        showToast('Alleen .eml bestanden worden ondersteund', 'error');
      }
    }
  }, [processFile, showToast]);


  const handleCreateWorkflow = async () => {
    if (!parsedEmail || !selectedCustomerId) {
      showToast('Selecteer een klant', 'warning');
      return;
    }

    const customer = customers.find(c => c.id === selectedCustomerId);
    if (!customer) {
      showToast('Klant niet gevonden', 'error');
      return;
    }

    try {
      setIsProcessing(true);
      const workflowType = detectWorkflowType(parsedEmail);
      let workflowItemId: string | undefined;

      if (workflowType === 'order') {
        // Create quote
        const quote = await createQuote({
          customerId: selectedCustomerId,
          customerName: customer.name,
          customerEmail: customer.email,
          status: 'draft',
          items: [],
          subtotal: 0,
          totalVat: 0,
          total: 0,
          validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          notes: `Email van ${parsedEmail.from}:\n\n${parsedEmail.subject}\n\n${parsedEmail.body}`,
        });
        workflowItemId = quote.id;
        showToast('Offerte aangemaakt vanuit e-mail', 'success');
      } else if (workflowType === 'task') {
        // Create task
        const task = await createTask({
          title: parsedEmail.subject || 'Nieuwe taak vanuit e-mail',
          description: parsedEmail.body,
          priority: 'medium',
          status: 'todo',
          customerId: selectedCustomerId,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        });
        workflowItemId = task.id;
        showToast('Taak aangemaakt vanuit e-mail', 'success');
      } else {
        // Create work order as notification
        const employeeId = employees[0]?.id || '';
        if (employeeId) {
          const workOrder = await createWorkOrder({
            title: parsedEmail.subject || 'Werkorder vanuit e-mail',
            description: parsedEmail.body,
            status: 'todo',
            assignedTo: employeeId,
            customerId: selectedCustomerId,
            materials: [],
            estimatedHours: 0,
            hoursSpent: 0,
            estimatedCost: 0,
            notes: `Email van ${parsedEmail.from}`,
            sortIndex: 0,
          });
          workflowItemId = workOrder.id;
          showToast('Werkorder aangemaakt vanuit e-mail', 'success');
        }
      }

      // Save processed email
      setProcessedEmails(prev => [...prev, {
        email: parsedEmail,
        workflowType,
        customerId: selectedCustomerId,
        customerName: customer.name,
        status: 'success',
        workflowItemId,
        timestamp: new Date().toISOString(),
      }]);

      // Remember mapping if requested
      if (rememberMapping) {
        // Save to localStorage
        const mappings = JSON.parse(localStorage.getItem('email_customer_mappings') || '{}');
        mappings[parsedEmail.from.toLowerCase()] = selectedCustomerId;
        localStorage.setItem('email_customer_mappings', JSON.stringify(mappings));
      }

      setShowPreview(false);
      setParsedEmail(null);
      setSelectedCustomerId('');
    } catch (error) {
      showToast('Fout bij het aanmaken van workflow item', 'error');
      console.error('Workflow creation error:', error);
      
      setProcessedEmails(prev => [...prev, {
        email: parsedEmail,
        workflowType: detectWorkflowType(parsedEmail),
        status: 'error',
        error: 'Fout bij aanmaken',
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
            ${isDragging ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-slate-300 dark:border-slate-700'}
            ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800'}
          `}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".eml"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isProcessing}
          />
          
          {isProcessing ? (
            <>
              <Loader2 className="h-12 w-12 text-indigo-600 dark:text-indigo-400 mx-auto mb-4 animate-spin" />
              <p className="text-slate-600 dark:text-slate-400">E-mail wordt verwerkt...</p>
            </>
          ) : (
            <>
              <Mail className="h-12 w-12 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Sleep e-mailbestand hierheen
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                Of klik om een .eml bestand te selecteren
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Ondersteunt Outlook .eml bestanden
              </p>
            </>
          )}
        </div>
      </Card>

      {/* Processed Emails */}
      {processedEmails.length > 0 && (
        <Card className="p-4">
          <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Verwerkte E-mails</h4>
          <div className="space-y-2">
            {processedEmails.slice(-5).reverse().map((processed, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  processed.status === 'success'
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                }`}
              >
                <div className="flex items-start gap-2">
                  {processed.status === 'success' ? (
                    <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-slate-900 dark:text-white truncate">
                      {processed.email.subject}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Van: {processed.email.from}
                    </p>
                    {processed.customerName && (
                      <p className="text-xs text-slate-500 dark:text-slate-500">
                        Klant: {processed.customerName}
                      </p>
                    )}
                    {processed.error && (
                      <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                        {processed.error}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Preview Modal */}
      {parsedEmail && (
        <Modal
          isOpen={showPreview}
          onClose={() => {
            setShowPreview(false);
            setParsedEmail(null);
            setSelectedCustomerId('');
          }}
          title="E-mail Preview"
          className="max-w-2xl"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Van
              </label>
              <Input value={parsedEmail.from} readOnly />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Onderwerp
              </label>
              <Input value={parsedEmail.subject} readOnly />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Bericht
              </label>
              <textarea
                value={parsedEmail.body}
                readOnly
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white min-h-[200px]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Klant
              </label>
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="">Selecteer klant...</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} {customer.company ? `(${customer.company})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="rememberMapping"
                checked={rememberMapping}
                onChange={(e) => setRememberMapping(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <label htmlFor="rememberMapping" className="text-sm text-slate-700 dark:text-slate-300">
                Onthoud deze e-mail-klant mapping
              </label>
            </div>

            <div className="flex gap-2 justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
              <Button
                variant="outline"
                onClick={() => {
                  setShowPreview(false);
                  setParsedEmail(null);
                  setSelectedCustomerId('');
                }}
              >
                Annuleren
              </Button>
              <Button
                onClick={handleCreateWorkflow}
                disabled={!selectedCustomerId || isProcessing}
                isLoading={isProcessing}
              >
                {detectWorkflowType(parsedEmail) === 'order' ? 'Maak Offerte' :
                 detectWorkflowType(parsedEmail) === 'task' ? 'Maak Taak' :
                 'Maak Werkorder'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};


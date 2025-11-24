import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, XCircle, Clock, Package, User, Euro, AlertTriangle } from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import type { WorkOrder } from '../types';

interface CompletionValidationModalProps {
  workOrder: WorkOrder;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (withInvoice: boolean) => Promise<void>;
  existingInvoiceId?: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export const CompletionValidationModal: React.FC<CompletionValidationModalProps> = ({
  workOrder,
  isOpen,
  onClose,
  onConfirm,
  existingInvoiceId,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [createInvoice, setCreateInvoice] = useState(true);

  const validateWorkOrder = (): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required validations (block completion)
    if (!workOrder.customerId) {
      errors.push('Klant is niet toegewezen');
    }

    if (!workOrder.assignedTo) {
      errors.push('Medewerker is niet toegewezen');
    }

    if (workOrder.hoursSpent === 0 && workOrder.estimatedHours === 0) {
      errors.push('Geen uren bijgehouden (uren gewerkt of geschat moeten > 0 zijn)');
    }

    // Warning validations (can complete but warned)
    if (workOrder.materials && workOrder.materials.length === 0 && workOrder.estimatedCost > 0) {
      warnings.push('Geen materialen bijgehouden, maar er zijn geschatte kosten');
    }

    if (!workOrder.notes || workOrder.notes.trim().length === 0) {
      warnings.push('Geen notities toegevoegd');
    }

    if (workOrder.hoursSpent === 0 && workOrder.estimatedHours > 0) {
      warnings.push('Geen uren gewerkt bijgehouden, alleen geschatte uren');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  };

  const validation = validateWorkOrder();
  const hasExistingInvoice = !!existingInvoiceId;

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      await onConfirm(createInvoice && !hasExistingInvoice);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Werkorder Voltooien - Validatie"
      size="lg"
    >
      <div className="space-y-6">
        {/* Work Order Summary */}
        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
            Werkorder Overzicht
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-slate-600 dark:text-slate-400">Titel:</span>
              <p className="font-medium text-slate-900 dark:text-white">{workOrder.title}</p>
            </div>
            <div>
              <span className="text-slate-600 dark:text-slate-400">Klant:</span>
              <p className="font-medium text-slate-900 dark:text-white">
                {workOrder.customerName || 'Niet toegewezen'}
              </p>
            </div>
            <div>
              <span className="text-slate-600 dark:text-slate-400">Medewerker:</span>
              <p className="font-medium text-slate-900 dark:text-white">
                {workOrder.assignedToName || 'Niet toegewezen'}
              </p>
            </div>
            <div>
              <span className="text-slate-600 dark:text-slate-400">Geschatte kosten:</span>
              <p className="font-medium text-slate-900 dark:text-white">
                €{workOrder.estimatedCost.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Validation Results */}
        <div className="space-y-4">
          {/* Errors */}
          {validation.errors.length > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-start">
                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-2 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-semibold text-red-900 dark:text-red-200 mb-2">
                    Vereiste velden ontbreken
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-red-800 dark:text-red-300">
                    {validation.errors.map((error, idx) => (
                      <li key={idx}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Warnings */}
          {validation.warnings.length > 0 && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 mr-2 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-semibold text-amber-900 dark:text-amber-200 mb-2">
                    Waarschuwingen
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-amber-800 dark:text-amber-300">
                    {validation.warnings.map((warning, idx) => (
                      <li key={idx}>{warning}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Success */}
          {validation.isValid && validation.warnings.length === 0 && (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5 mr-2 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-semibold text-emerald-900 dark:text-emerald-200">
                    Alle validaties geslaagd
                  </h4>
                  <p className="text-sm text-emerald-800 dark:text-emerald-300 mt-1">
                    Deze werkorder kan worden voltooid.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Existing Invoice Warning */}
          {hasExistingInvoice && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-200">
                    Factuur bestaat al
                  </h4>
                  <p className="text-sm text-blue-800 dark:text-blue-300 mt-1">
                    Er is al een factuur gekoppeld aan deze werkorder. Er wordt geen nieuwe factuur aangemaakt.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Checklist */}
        <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
          <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Validatie Checklist</h4>
          <div className="space-y-2">
            <div className="flex items-center">
              {workOrder.customerId ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mr-2" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600 dark:text-red-400 mr-2" />
              )}
              <span className="text-sm">Klant toegewezen</span>
            </div>
            <div className="flex items-center">
              {workOrder.assignedTo ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mr-2" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600 dark:text-red-400 mr-2" />
              )}
              <span className="text-sm">Medewerker toegewezen</span>
            </div>
            <div className="flex items-center">
              {workOrder.hoursSpent > 0 || workOrder.estimatedHours > 0 ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mr-2" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600 dark:text-red-400 mr-2" />
              )}
              <span className="text-sm">
                Uren bijgehouden ({workOrder.hoursSpent > 0 ? `${workOrder.hoursSpent} gewerkt` : `${workOrder.estimatedHours} geschat`})
              </span>
            </div>
            <div className="flex items-center">
              {workOrder.materials && workOrder.materials.length > 0 ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mr-2" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 mr-2" />
              )}
              <span className="text-sm">
                Materialen bijgehouden ({workOrder.materials?.length || 0} items)
              </span>
            </div>
          </div>
        </div>

        {/* Invoice Creation Option */}
        {!hasExistingInvoice && validation.isValid && (
          <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={createInvoice}
                onChange={(e) => setCreateInvoice(e.target.checked)}
                className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
              />
              <span className="text-sm font-medium text-slate-900 dark:text-white">
                Automatisch factuur aanmaken na voltooiing
              </span>
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 ml-6">
              Er wordt automatisch een factuur aangemaakt met de gegevens van deze werkorder.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 border-t border-slate-200 dark:border-slate-700 pt-4">
          <Button variant="secondary" onClick={onClose} disabled={isProcessing}>
            Annuleren
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={!validation.isValid || isProcessing}
          >
            {isProcessing ? 'Verwerken...' : 'Voltooien & Factuur Aanmaken'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};


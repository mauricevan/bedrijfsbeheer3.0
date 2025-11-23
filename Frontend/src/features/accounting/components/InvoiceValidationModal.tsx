import React, { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import type { Invoice } from '../types';

interface InvoiceValidationModalProps {
  invoice: Invoice;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const InvoiceValidationModal: React.FC<InvoiceValidationModalProps> = ({
  invoice,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [checks, setChecks] = useState({
    hoursChecked: false,
    materialsChecked: false,
    extraWorkAdded: false,
  });

  const handleCheck = (key: keyof typeof checks) => {
    setChecks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const canSend = checks.hoursChecked && checks.materialsChecked;

  const handleConfirm = () => {
    if (canSend) {
      onConfirm();
    }
  };

  // Calculate reminder dates
  const dueDate = new Date(invoice.dueDate);
  const reminder1Date = new Date(dueDate);
  reminder1Date.setDate(reminder1Date.getDate() + 7);
  const reminder2Date = new Date(dueDate);
  reminder2Date.setDate(reminder2Date.getDate() + 14);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Factuur Valideren" className="max-w-2xl">
      <div className="space-y-6">
        {invoice.workOrderId && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              Deze factuur is automatisch gegenereerd vanuit een werkorder. Controleer de volgende punten voordat u de factuur verstuurt.
            </p>
          </div>
        )}

        <div className="space-y-3">
          <h3 className="font-semibold text-slate-900 dark:text-white">Validatie Checklist</h3>
          
          <label className="flex items-start gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
            <input
              type="checkbox"
              checked={checks.hoursChecked}
              onChange={() => handleCheck('hoursChecked')}
              className="mt-1 rounded border-slate-300 dark:border-slate-600"
            />
            <div className="flex-1">
              <span className="font-medium text-slate-900 dark:text-white">Uren gecontroleerd</span>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Controleer of alle gewerkte uren correct zijn geregistreerd en meegenomen in de factuur.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
            <input
              type="checkbox"
              checked={checks.materialsChecked}
              onChange={() => handleCheck('materialsChecked')}
              className="mt-1 rounded border-slate-300 dark:border-slate-600"
            />
            <div className="flex-1">
              <span className="font-medium text-slate-900 dark:text-white">Materialen gecontroleerd</span>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Controleer of alle gebruikte materialen correct zijn opgenomen in de factuur.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
            <input
              type="checkbox"
              checked={checks.extraWorkAdded}
              onChange={() => handleCheck('extraWorkAdded')}
              className="mt-1 rounded border-slate-300 dark:border-slate-600"
            />
            <div className="flex-1">
              <span className="font-medium text-slate-900 dark:text-white">Extra werk toegevoegd</span>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Optioneel: Extra werk dat niet in de oorspronkelijke offerte stond is toegevoegd.
              </p>
            </div>
          </label>
        </div>

        {invoice.dueDate && (
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Herinneringsplanning</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Vervaldatum:</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {new Date(invoice.dueDate).toLocaleDateString('nl-NL')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Herinnering 1:</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {reminder1Date.toLocaleDateString('nl-NL')} (+7 dagen)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400">Herinnering 2:</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {reminder2Date.toLocaleDateString('nl-NL')} (+14 dagen)
                </span>
              </div>
            </div>
          </div>
        )}

        {!canSend && (
          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <p className="text-sm text-amber-800 dark:text-amber-300">
              Uren en materialen moeten gecontroleerd zijn voordat u de factuur kunt versturen.
            </p>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Annuleren
          </Button>
          <Button onClick={handleConfirm} disabled={!canSend}>
            Valideren en Versturen
          </Button>
        </div>
      </div>
    </Modal>
  );
};


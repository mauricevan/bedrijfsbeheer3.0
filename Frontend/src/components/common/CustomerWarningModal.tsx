import React, { useEffect, useRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { cn } from '@/utils/cn';
import { Button } from './Button';
import type { CustomerWarningNote } from '@/features/crm/types/crm.types';

interface CustomerWarningModalProps {
  isOpen: boolean;
  onAcknowledge: () => void;
  customerName: string;
  warningNotes: CustomerWarningNote[];
  className?: string;
}

export const CustomerWarningModal: React.FC<CustomerWarningModalProps> = ({
  isOpen,
  onAcknowledge,
  customerName,
  warningNotes,
  className,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Focus the modal for accessibility
      modalRef.current?.focus();
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Block ESC key and outside clicks
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (isOpen && modalRef.current && !modalRef.current.contains(e.target as Node)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape, true);
      document.addEventListener('mousedown', handleClickOutside, true);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape, true);
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, [isOpen]);

  if (!isOpen || warningNotes.length === 0) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop - non-clickable */}
      <div
        className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className={cn(
          'relative w-full max-w-lg transform rounded-xl bg-white dark:bg-slate-900 p-6 text-left shadow-2xl transition-all border-2 border-red-500 dark:border-red-600',
          'focus:outline-none',
          className
        )}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="warning-modal-title"
        aria-describedby="warning-modal-description"
      >
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="flex-shrink-0">
            <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" fill="currentColor" />
            </div>
          </div>
          <div className="flex-1">
            <h3
              id="warning-modal-title"
              className="text-xl font-bold text-red-600 dark:text-red-400 mb-1"
            >
              Waarschuwing: {customerName}
            </h3>
            <p
              id="warning-modal-description"
              className="text-sm text-slate-600 dark:text-slate-400"
            >
              Deze klant heeft actieve waarschuwingen
            </p>
          </div>
        </div>

        {/* Warning Notes List */}
        <div className="mb-6 space-y-3">
          {warningNotes.map((warningNote) => (
            <div
              key={warningNote.id}
              className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
            >
              <p className="text-slate-900 dark:text-white font-medium">
                {warningNote.note}
              </p>
              {warningNote.createdAt && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Toegevoegd op: {new Date(warningNote.createdAt).toLocaleDateString('nl-NL')}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Footer - Only acknowledge button */}
        <div className="flex justify-end">
          <Button
            onClick={onAcknowledge}
            variant="danger"
            size="md"
            className="min-w-[120px]"
          >
            Ik begrijp het
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};


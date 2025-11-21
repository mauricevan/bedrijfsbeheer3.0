import React, { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import type { PaymentMethod } from '../types';

type PaymentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  onConfirm: (method: PaymentMethod) => Promise<void>;
};

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  total,
  onConfirm,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('cash');
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentMethods: { value: PaymentMethod; label: string }[] = [
    { value: 'cash', label: 'Cash' },
    { value: 'pin', label: 'PIN' },
    { value: 'ideal', label: 'iDEAL' },
    { value: 'credit_card', label: 'Credit Card' },
  ];

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      await onConfirm(selectedMethod);
      onClose();
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Process Payment">
      <div className="space-y-6">
        <div className="text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Amount</p>
          <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
            €{total.toFixed(2)}
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Payment Method
          </label>
          <div className="grid grid-cols-2 gap-3">
            {paymentMethods.map((method) => (
              <button
                key={method.value}
                onClick={() => setSelectedMethod(method.value)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedMethod === method.value
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <p className="font-medium text-slate-900 dark:text-white">{method.label}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1" disabled={isProcessing}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} className="flex-1" isLoading={isProcessing}>
            Confirm Payment
          </Button>
        </div>
      </div>
    </Modal>
  );
};

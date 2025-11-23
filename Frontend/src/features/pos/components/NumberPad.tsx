import React, { useState } from 'react';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Delete, Check, X } from 'lucide-react';
import type { CartItem } from '../types';

type NumberPadProps = {
  onAdd: (item: Omit<CartItem, 'id'>) => void;
  className?: string;
};

export const NumberPad: React.FC<NumberPadProps> = ({ onAdd, className }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('Handmatige invoer');

  const handleNumberClick = (num: string) => {
    if (num === '.' && amount.includes('.')) return;
    
    if (amount === '0') {
      if (num === '0' || num === '00') return;
      if (num === '.') {
        setAmount('0.');
        return;
      }
      setAmount(num);
      return;
    }
    
    setAmount(prev => prev + num);
  };

  const handleClear = () => {
    setAmount('');
  };

  const handleBackspace = () => {
    setAmount(prev => prev.slice(0, -1));
  };

  const handleAdd = () => {
    const price = parseFloat(amount);
    if (!price || isNaN(price)) return;

    onAdd({
      inventoryItemId: 'manual',
      name: description || 'Handmatige invoer',
      quantity: 1,
      pricePerUnit: price,
      vatRate: 21, // Default to 21%
      discount: 0,
      isManual: true,
    });
    setAmount('');
    setDescription('Handmatige invoer');
  };

  const keys = [
    '7', '8', '9',
    '4', '5', '6',
    '1', '2', '3',
    '0', '00', '.'
  ];

  return (
    <Card className={`p-6 h-full flex flex-col gap-4 ${className}`}>
      <div className="space-y-4">
        <Input
          label="Omschrijving"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Bijv. Diversen"
          className="w-full"
        />
        
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Bedrag
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-slate-500 sm:text-lg">€</span>
            </div>
            <div className="block w-full pl-8 pr-12 py-3 text-right text-2xl font-bold rounded-lg border border-slate-300 bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white shadow-sm">
              {amount || '0.00'}
            </div>
            <button
              onClick={handleBackspace}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <Delete className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-2 flex-1">
        {keys.map((key) => (
          <button
            key={key}
            onClick={() => handleNumberClick(key)}
            className="flex items-center justify-center text-xl font-semibold rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-600 active:bg-slate-300 transition-colors p-4"
          >
            {key}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 mt-2">
        <Button
          variant="outline"
          onClick={handleClear}
          className="h-14 text-lg border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-900/20"
        >
          <X className="mr-2 h-5 w-5" />
          Wissen
        </Button>
        <Button
          variant="primary"
          onClick={handleAdd}
          disabled={!amount || parseFloat(amount) === 0}
          className="h-14 text-lg bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <Check className="mr-2 h-5 w-5" />
          Toevoegen
        </Button>
      </div>
    </Card>
  );
};

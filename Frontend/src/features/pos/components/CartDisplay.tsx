import React from 'react';
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
import type { CartItem } from '../types';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { calculateVATBreakdown } from '../utils';

type CartDisplayProps = {
  items: CartItem[];
  subtotal: number;
  totalVAT: number;
  total: number;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
  onClear: () => void;
};

export const CartDisplay: React.FC<CartDisplayProps> = ({
  items,
  subtotal,

  total,
  onIncrease,
  onDecrease,
  onRemove,
  onCheckout,
  onClear,
}) => {
  const vatBreakdown = calculateVATBreakdown(items);

  if (items.length === 0) {
    return (
      <Card className="h-full flex flex-col items-center justify-center text-slate-400">
        <ShoppingCart className="h-16 w-16 mb-4" />
        <p>Cart is empty</p>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Cart</h3>
        <Button variant="ghost" size="sm" onClick={onClear}>
          Clear
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 mb-4">
        {items.map((item) => {
          const itemTotal = item.pricePerUnit * item.quantity;
          const discountAmount = itemTotal * (item.discount / 100);
          const itemSubtotal = itemTotal - discountAmount;

          return (
            <div
              key={item.id}
              className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <p className="font-medium text-slate-900 dark:text-white">{item.name}</p>
                  <p className="text-xs text-slate-500">
                    €{item.pricePerUnit.toFixed(2)} × {item.quantity} | VAT {item.vatRate}%
                  </p>
                  {item.discount > 0 && (
                    <p className="text-xs text-emerald-600">Discount: {item.discount}%</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(item.id)}
                  className="h-6 w-6 p-0 text-red-500"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDecrease(item.id)}
                    className="h-7 w-7 p-0"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onIncrease(item.id)}
                    className="h-7 w-7 p-0"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <p className="font-semibold text-slate-900 dark:text-white">
                  €{itemSubtotal.toFixed(2)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-slate-200 dark:border-slate-700 pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-400">Subtotal (Excl. VAT)</span>
          <span className="font-medium">€{subtotal.toFixed(2)}</span>
        </div>

        {Object.entries(vatBreakdown).map(([rate, data]) => (
          <div key={rate} className="flex justify-between text-xs text-slate-500">
            <span>VAT {rate}%</span>
            <span>€{data.vat.toFixed(2)}</span>
          </div>
        ))}

        <div className="flex justify-between text-sm font-semibold pt-2 border-t border-slate-200 dark:border-slate-700">
          <span>Total (Incl. VAT)</span>
          <span className="text-lg text-indigo-600 dark:text-indigo-400">€{total.toFixed(2)}</span>
        </div>

        <Button className="w-full mt-4" size="lg" onClick={onCheckout}>
          Checkout
        </Button>
      </div>
    </Card>
  );
};

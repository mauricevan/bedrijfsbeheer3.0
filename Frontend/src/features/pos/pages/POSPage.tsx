import React, { useState } from 'react';
import { usePOS } from '../hooks/usePOS';
import { CartDisplay } from '../components/CartDisplay';
import { ProductSelector } from '../components/ProductSelector';
import { PaymentModal } from '../components/PaymentModal';
import { Button } from '@/components/common/Button';
import { ShoppingBag, FileText } from 'lucide-react';

export const POSPage: React.FC = () => {
  const {
    cart,
    mode,
    totals,
    setMode,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    processPayment,
  } = usePOS();

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const handleCheckout = () => {
    setIsPaymentModalOpen(true);
  };

  const handlePayment = async (method: any) => {
    await processPayment(method);
    setIsPaymentModalOpen(false);
    // Show success message
    alert('Payment successful!');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Point of Sale</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Process sales and transactions</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={mode === 'b2c' ? 'primary' : 'outline'}
            leftIcon={<ShoppingBag className="h-4 w-4" />}
            onClick={() => setMode('b2c')}
          >
            B2C (Kassa)
          </Button>
          <Button
            variant={mode === 'b2b' ? 'primary' : 'outline'}
            leftIcon={<FileText className="h-4 w-4" />}
            onClick={() => setMode('b2b')}
          >
            B2B (Pakbon)
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProductSelector onAddToCart={addToCart} />
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <CartDisplay
              items={cart}
              subtotal={totals.subtotal}
              totalVAT={totals.totalVAT}
              total={totals.total}
              onIncrease={increaseQuantity}
              onDecrease={decreaseQuantity}
              onRemove={removeFromCart}
              onCheckout={handleCheckout}
              onClear={clearCart}
            />
          </div>
        </div>
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        total={totals.total}
        onConfirm={handlePayment}
      />
    </div>
  );
};

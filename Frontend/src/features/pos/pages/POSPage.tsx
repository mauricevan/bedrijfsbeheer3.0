import React, { useState, useEffect } from 'react';
import { usePOS } from '../hooks/usePOS';
import { CartDisplay } from '../components/CartDisplay';
import { ProductSelector } from '../components/ProductSelector';
import { NumberPad } from '../components/NumberPad';
import { PaymentModal } from '../components/PaymentModal';
import { Button } from '@/components/common/Button';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { CustomerWarningIndicator } from '@/components/common/CustomerWarningIndicator';
import { CustomerWarningModal } from '@/components/common/CustomerWarningModal';
import { useCustomerWarningDisplay } from '@/hooks/useCustomerWarningDisplay';
import { customerWarningService } from '@/features/crm/services/customerWarningService';
import { useCRM } from '@/features/crm/hooks/useCRM';
import { useToast } from '@/context/ToastContext';
import { ShoppingBag, FileText } from 'lucide-react';
import type { PaymentMethod } from '../types';

export const POSPage: React.FC = () => {
  const {
    cart,
    mode,
    customerId,
    totals,
    setMode,
    setCustomerId,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    processPayment,
  } = usePOS();

  const { customers } = useCRM();
  const { showToast } = useToast();
  const {
    checkAndShowWarning,
    showModal,
    warningNotes,
    customerId: warningCustomerId,
    acknowledgeWarning,
  } = useCustomerWarningDisplay();
  const [hasWarnings, setHasWarnings] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [viewMode, setViewMode] = useState<'products' | 'manual'>('products');

  useEffect(() => {
    const checkCustomerWarnings = async () => {
      if (mode === 'b2b' && customerId) {
        const hasWarns = await customerWarningService.hasActiveWarnings(customerId);
        setHasWarnings(hasWarns);
        if (hasWarns) {
          checkAndShowWarning(customerId, 'pos');
        }
      } else {
        setHasWarnings(false);
      }
    };
    checkCustomerWarnings();
  }, [mode, customerId, checkAndShowWarning]);

  const handleCheckout = () => {
    if (cart.length === 0) {
      showToast('Cart is empty', 'warning');
      return;
    }
    setIsPaymentModalOpen(true);
  };

  const handlePayment = async (method: PaymentMethod) => {
    try {
      await processPayment(method);
      // Close modal first
      setIsPaymentModalOpen(false);
      // Show success toast
      showToast('Payment successful! Cart cleared.', 'success');
    } catch (error) {
      showToast('Payment failed. Please try again.', 'error');
      console.error('Payment error:', error);
    }
  };

  const handleClearCart = () => {
    if (cart.length === 0) {
      showToast('Cart is already empty', 'info');
      return;
    }
    setShowClearConfirm(true);
  };

  const confirmClearCart = () => {
    clearCart();
    showToast('Cart cleared', 'info');
    setShowClearConfirm(false);
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

      {/* Customer Selection for B2B Mode */}
      {mode === 'b2b' && (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Klant selecteren (B2B)
          </label>
          <div className="flex items-center gap-2">
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="">Selecteer klant</option>
              {customers.map(customer => (
                <option key={customer.id} value={customer.id}>{customer.name}</option>
              ))}
            </select>
            {customerId && hasWarnings && (
              <CustomerWarningIndicator
                hasWarnings={true}
                onClick={() => checkAndShowWarning(customerId, 'pos')}
              />
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex border-b border-slate-200 dark:border-slate-700">
            <button
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                viewMode === 'products'
                  ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
              onClick={() => setViewMode('products')}
            >
              Producten
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                viewMode === 'manual'
                  ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
              onClick={() => setViewMode('manual')}
            >
              Handmatige Invoer
            </button>
          </div>

          {viewMode === 'products' ? (
            <ProductSelector onAddToCart={addToCart} />
          ) : (
            <div className="max-w-md mx-auto w-full">
              <NumberPad onAdd={addToCart} />
            </div>
          )}
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
              onClear={handleClearCart}
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

      <ConfirmDialog
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={confirmClearCart}
        title="Clear Cart?"
        message="Are you sure you want to clear all items from the cart? This action cannot be undone."
        confirmText="Clear Cart"
        cancelText="Cancel"
        type="warning"
      />

      {/* Warning Modal */}
      {warningCustomerId && (
        <CustomerWarningModal
          isOpen={showModal}
          onAcknowledge={acknowledgeWarning}
          customerName={customers.find(c => c.id === warningCustomerId)?.name || 'Onbekende klant'}
          warningNotes={warningNotes}
        />
      )}
    </div>
  );
};

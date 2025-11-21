import { useState, useCallback } from 'react';
import type { CartItem, POSMode, PaymentMethod } from '../types';
import { calculateCartTotals, generateTransactionNumber } from '../utils';

export const usePOS = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mode, setMode] = useState<POSMode>('b2c');
  const [customerId, setCustomerId] = useState<string>('');

  const addToCart = useCallback((item: Omit<CartItem, 'id'>) => {
    const newItem: CartItem = {
      ...item,
      id: `cart-${Date.now()}-${Math.random()}`,
    };
    setCart(prev => [...prev, newItem]);
  }, []);

  const updateCartItem = useCallback((id: string, updates: Partial<CartItem>) => {
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setCustomerId('');
  }, []);

  const increaseQuantity = useCallback((id: string) => {
    setCart(prev => prev.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    ));
  }, []);

  const decreaseQuantity = useCallback((id: string) => {
    setCart(prev => prev.map(item =>
      item.id === id && item.quantity > 1 
        ? { ...item, quantity: item.quantity - 1 } 
        : item
    ));
  }, []);

  const processPayment = useCallback(async (paymentMethod: PaymentMethod) => {
    const totals = calculateCartTotals(cart);
    const transaction = {
      id: `txn-${Date.now()}`,
      transactionNumber: generateTransactionNumber(),
      mode,
      items: cart,
      ...totals,
      paymentMethod,
      customerId: mode === 'b2b' ? customerId : undefined,
      createdAt: new Date().toISOString(),
    };

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    clearCart();
    return transaction;
  }, [cart, mode, customerId, clearCart]);

  const totals = calculateCartTotals(cart);

  return {
    cart,
    mode,
    customerId,
    totals,
    setMode,
    setCustomerId,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
    processPayment,
  };
};

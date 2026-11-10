'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useSyncExternalStore } from 'react';
import { CartItem, Design } from '@/types';
import { getStoredCart, saveStoredCart } from '@/lib/storage';

interface CartContextType {
  items: CartItem[];
  totalCount: number;
  totalEstimatedHours: number;
  totalEstimatedBaseINR: number;
  addToCart: (design: Design, notes?: string) => void;
  removeFromCart: (designId: string) => void;
  updateQuantity: (designId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (designId: string) => boolean;
  isLoaded: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const isLoaded = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const [items, setItems] = useState<CartItem[]>(() => {
    return getStoredCart();
  });

  // Sync state to external storage whenever items change
  useEffect(() => {
    if (isLoaded) {
      saveStoredCart(items);
    }
  }, [items, isLoaded]);

  const addToCart = (design: Design, notes?: string) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.design.id === design.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
          notes: notes || updated[existingIndex].notes,
        };
        return updated;
      }
      return [
        ...prev,
        {
          id: `item-${design.id}-${Date.now()}`,
          design,
          quantity: 1,
          addedAt: Date.now(),
          notes,
        },
      ];
    });
  };

  const removeFromCart = (designId: string) => {
    setItems((prev) => prev.filter((item) => item.design.id !== designId));
  };

  const updateQuantity = (designId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(designId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.design.id === designId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const isInCart = (designId: string) => {
    return items.some((item) => item.design.id === designId);
  };

  const totalCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const totalEstimatedHours = useMemo(() => {
    return items.reduce((sum, item) => {
      const hours = item.design.technicalSpecs.devHours || 0;
      return sum + hours * item.quantity;
    }, 0);
  }, [items]);

  const totalEstimatedBaseINR = useMemo(() => {
    return items.reduce((sum, item) => {
      const base = item.design.commercial?.estimatedBaseINR || 0;
      return sum + base * item.quantity;
    }, 0);
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        totalCount,
        totalEstimatedHours,
        totalEstimatedBaseINR,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
        isLoaded,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

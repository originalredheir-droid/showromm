'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useSyncExternalStore } from 'react';
import { CartItem, Design, ScreenPreview } from '@/types';
import { getStoredCart, saveStoredCart } from '@/lib/storage';

interface CartContextType {
  items: CartItem[];
  totalCount: number;
  totalEstimatedHours: number;
  totalEstimatedBaseINR: number;
  addToCart: (design: Design, screen: ScreenPreview) => void;
  removeFromCart: (offerId: string) => void;
  clearCart: () => void;
  isInCart: (offerId: string) => boolean;
  isLoaded: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const EMPTY_CART_ITEMS: CartItem[] = [];

export function CartProvider({ children }: { children: React.ReactNode }) {
  const isLoaded = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const [items, setItems] = useState<CartItem[]>(() => getStoredCart());

  // Sync state to external storage whenever items change
  useEffect(() => {
    if (isLoaded) {
      saveStoredCart(items);
    }
  }, [items, isLoaded]);

  const visibleItems = isLoaded ? items : EMPTY_CART_ITEMS;
  const addToCart = (design: Design, screen: ScreenPreview) => {
    const id = `${design.id}:${screen.id}`;
    setItems((prev) => {
      if (prev.some((item) => item.id === id)) return prev;
      return [
        ...prev,
        {
          id,
          design,
          screen,
          addedAt: Date.now(),
        },
      ];
    });
  };

  const removeFromCart = (offerId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== offerId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const isInCart = (offerId: string) => {
    return isLoaded && items.some((item) => item.id === offerId);
  };

  const totalCount = useMemo(() => {
    return visibleItems.length;
  }, [visibleItems]);

  const totalEstimatedHours = useMemo(() => {
    return visibleItems.reduce((sum, item) => {
      return sum + (item.screen.devHours ?? 0);
    }, 0);
  }, [visibleItems]);

  const totalEstimatedBaseINR = useMemo(() => {
    return visibleItems.reduce((sum, item) => {
      return sum + (item.screen.estimatedPriceINR ?? 0);
    }, 0);
  }, [visibleItems]);

  return (
    <CartContext.Provider
      value={{
        items: visibleItems,
        totalCount,
        totalEstimatedHours,
        totalEstimatedBaseINR,
        addToCart,
        removeFromCart,
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

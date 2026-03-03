'use client';

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';

import CartToast from '@/components/cartToast';

type CartItem = {
  id: string;
  title: string;
  variantTitle?: string;
  price: number;
  quantity: number;
  image?: string;
  available: number;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [toastMessage, setToastMessage] = useState<string>("");

  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : []
  });

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (item: CartItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id);

      if (existing) {
        const updatedQty = Math.min(
          existing.quantity + item.quantity,
          existing.available
        );
        setToastMessage(`${item.title} actualizado en el carrito`);
        return prev.map(i =>
          i.id === item.id ? { ...i, quantity: updatedQty } : i
        );
      }

      setToastMessage(`${item.title} agregado al carrito`);
      return [...prev, item];
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    setItems(prev =>
      prev.map(i => (i.id === id ? { ...i, quantity } : i))
    );
  };

  const removeFromCart = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const clearCart = () => setItems([]);

  return (
    <CartContext.Provider
      value={{ items, addToCart, updateQuantity, removeFromCart, clearCart }}
    >
      {children}

      {/* Toast Global */}
      {toastMessage && (
        <CartToast
          message={toastMessage}
          onClose={() => setToastMessage("")}
        />
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
}

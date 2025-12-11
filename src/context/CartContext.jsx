import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

export default function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    try {
      const s = localStorage.getItem("final_ecom_cart");
      if (s) setCart(JSON.parse(s));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("final_ecom_cart", JSON.stringify(cart));
  }, [cart]);

  function addToCart(product) {
    setCart((prev) => {
      const found = prev.find((p) => p.id === product.id);
      if (found) {
        return prev.map((p) => (p.id === product.id ? { ...p, qty: p.qty + 1 } : p));
      }
      return [...prev, { ...product, qty: 1 }];
    });
  }

  function removeFromCart(id) {
    setCart((prev) => prev.filter((p) => p.id !== id));
  }

  function clearCart() {
    setCart([]);
  }

  function updateQty(id, qty) {
    setCart((prev) => prev.map((p) => (p.id === id ? { ...p, qty } : p)));
  }

  const totalItems = cart.reduce((s, p) => s + p.qty, 0);
  const totalPrice = cart.reduce((s, p) => s + p.qty * p.price, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, updateQty, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

// context.js
import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({ products: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const userId = 'user123'; // Example user ID

  const fetchCartData = async () => {
    try {
      const res = await fetch(`http://localhost:8000/cart/${userId}`);
      const data = await res.json();
      setCart({ products: data.cart?.products || [], total: data.total || 0 });
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('http://localhost:8000/products');
        const data = await res.json();
        setProducts(data);
        await fetchCartData();
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const addToCart = async (productId) => {
    try {
      setIsMutating(true);
      await fetch('http://localhost:8000/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, productId, quantity: 1 }),
      });
      await fetchCartData();
    } catch (err) {
      console.error('Error adding to cart:', err);
    } finally {
      setIsMutating(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      setIsMutating(true);
      await fetch('http://localhost:8000/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, productId, quantity }),
      });
      await fetchCartData();
    } catch (err) {
      console.error('Error updating cart:', err);
    } finally {
      setIsMutating(false);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      setIsMutating(true);
      await fetch('http://localhost:8000/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, productId }),
      });
      await fetchCartData();
    } catch (err) {
      console.error('Error removing from cart:', err);
    } finally {
      setIsMutating(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        products,
        cart,
        loading,
        isMutating,
        addToCart,
        updateQuantity,
        removeFromCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
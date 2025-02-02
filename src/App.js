// App.js
import React, { useContext, useEffect, useState } from 'react';
import { CartContext, CartProvider } from './context';
import './styles.css';

const ProductList = () => {
  const { products, addToCart, loading, isMutating } = useContext(CartContext);

  if (loading) {
    return (
      <div className="product-list">
        <h2>Products</h2>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="product-list">
      <h2>Products</h2>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <div className="product-content">
              <h3 className="product-title">{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <p className="product-price">${product.price}</p>
              <button
                disabled={isMutating}
                className="add-to-cart-btn"
                onClick={() => addToCart(product._id)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, loading, isMutating } = useContext(CartContext);

  if (loading) {
    return (
      <div className="cart">
        <h2>Shopping Cart</h2>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="cart">
      <h2>Shopping Cart</h2>
      {cart.products.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          {cart.products.map((item) => (
            <div key={item.productId._id} className="cart-item">
              <div>
                <h3 className="product-title">{item.productId.name}</h3>
                <p className="product-price">${item.productId.price}</p>
              </div>
              <input
                type="number"
                min="1"
                value={item.quantity}
                disabled={isMutating}
                onChange={(e) => updateQuantity(item.productId._id, parseInt(e.target.value))}
                className="quantity-input"
              />
              <button
                disabled={isMutating}
                className="remove-btn"
                onClick={() => removeFromCart(item.productId._id)}
              >
                Remove
              </button>
            </div>
          ))}
          <div className="cart-total">Total: ${cart.total.toFixed(2)}</div>
        </>
      )}
    </div>
  );
};

const App = () => {
  return (
    <CartProvider>
      <div className="container">
        <h1>Cart Management System</h1>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          <ProductList />
          <Cart />
        </div>
      </div>
    </CartProvider>
  );
};

export default App;
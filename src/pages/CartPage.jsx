import React from "react";
import { useCart } from "../context/CartContext.jsx";

export default function CartPage() {
  const { cart, removeFromCart, updateQty, clearCart, totalPrice } = useCart();

  if (!cart.length) {
    return <div className="status info">Your cart is empty. Add products from the products page.</div>;
  }

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      <div className="cart-layout">
        <div className="cart-list">
          {cart.map(item => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-main">
                <div className="cart-thumb"><img src={item.thumbnail} alt={item.title} /></div>
                <div className="cart-item-info">
                  <div className="cart-item-title">{item.title}</div>
                  <div className="cart-item-price">₹ {item.price}</div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div className="qty-control">
                  <button onClick={() => updateQty(item.id, Math.max(1, item.qty - 1))}>-</button>
                  <input value={item.qty} readOnly />
                  <button onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn btn-outline" onClick={() => removeFromCart(item.id)}>Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="cart-summary">
          <h3>Order Summary</h3>
          <div>Total: <strong>₹ {totalPrice.toFixed(2)}</strong></div>
          <div style={{ marginTop: 12 }}>
            <button className="btn btn-primary" onClick={() => alert("Checkout - Demo only")}>Checkout</button>
            <button className="btn btn-ghost" onClick={clearCart} style={{ marginLeft: 8 }}>Clear</button>
          </div>
        </aside>
      </div>
    </div>
  );
}

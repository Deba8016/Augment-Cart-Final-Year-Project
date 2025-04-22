import React, { useState } from 'react';
import { useCart } from '../context/useCart';
import AppHeader from '../components/Header';

const Checkout = () => {
  const { cartItems, getTotal, clearCart } = useCart();
  const [success, setSuccess] = useState(false);

  const handleCheckout = () => {
    // Placeholder for actual checkout logic (e.g., payment API)
    setSuccess(true);
    clearCart();
  };

  return (
    <div className="container mt-4">
      <AppHeader title="Checkout" />

      {success ? (
        <div className="alert alert-success text-center">
          🎉 Order placed successfully!
        </div>
      ) : (
        <>
          <div className="mb-4">
            <h5>Order Summary</h5>
            <ul className="list-group mb-3">
              {cartItems.map((item) => (
                <li key={item.id} className="list-group-item d-flex justify-content-between">
                  <div>{item.name} (x{item.quantity})</div>
                  <div>₹{item.price * item.quantity}</div>
                </li>
              ))}
              <li className="list-group-item d-flex justify-content-between fw-bold">
                <span>Total</span>
                <span>₹{getTotal()}</span>
              </li>
            </ul>
          </div>

          <button className="btn btn-primary btn-lg w-100" onClick={handleCheckout}>
            Confirm & Place Order
          </button>
        </>
      )}
    </div>
  );
};

export default Checkout;

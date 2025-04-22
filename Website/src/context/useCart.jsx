// useCart.js
import { useContext } from 'react';
import { CartContext } from './provider/CartProvider'; // Import CartContext from CartProvider

export const useCart = () => useContext(CartContext); // Use context to get cart data

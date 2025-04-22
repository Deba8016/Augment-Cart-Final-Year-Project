import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // 🔁 Load cart from storage on app load
  useEffect(() => {
    const loadCart = async () => {
      try {
        const storedCart = await AsyncStorage.getItem('cart');
        // console.log("StoredCart: ", storedCart)
        if (storedCart) {
          setCartItems(JSON.parse(storedCart));
        }
      } catch (error) {
        console.log('Failed to load cart:', error);
      }
    };
    loadCart();
  }, []);

  // 💾 Save cart to storage every time it changes
  useEffect(() => {
    const saveCart = async () => {
      try {
        await AsyncStorage.setItem('cart', JSON.stringify(cartItems));
      } catch (error) {
        console.log('Failed to save cart:', error);
      }
    };
    saveCart();
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const exists = prev.find((item) => item._id === product._id);
      if (exists) {
        return prev.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item._id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    setCartItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => item._id !== productId);
      }
      return prev.map((item) =>
        item._id === productId ? { ...item, quantity } : item
      );
    });
  };
  const addMultipleToCart = (products) => {
    setCartItems((prev) => {
      const updatedCart = [...prev];
  
      products.forEach(({ product, quantity }) => {
        const existingIndex = updatedCart.findIndex((item) => item._id === product._id);
        if (existingIndex !== -1) {
          updatedCart[existingIndex].quantity += quantity;
        } else {
          updatedCart.push({ ...product, quantity });
        }
      });
  
      return updatedCart;
    });
  };

  const clearCart = () => setCartItems([]);

  const getTotal = () =>
    cartItems.reduce((total, item) => {
      const priceMatch = item.price.match(/[\d.]+/);
      const price = priceMatch ? parseFloat(priceMatch[0]) : 0;
      return total + item.quantity * price;
    }, 0);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getTotal, addMultipleToCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

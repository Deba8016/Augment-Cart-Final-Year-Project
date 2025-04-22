import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
export const CartContext = createContext(); // Export CartContext so it can be used by the provider

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // 🔁 Load cart from storage on app load
  useEffect(() => {
    const loadCart = () => {
      try {
        const storedCart = localStorage.getItem('cart');
        console.log("StoredCart: ", storedCart)
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
        if (cartItems.length > 0) {
          localStorage.setItem('cart', JSON.stringify(cartItems));
          console.log('Saved cart:', cartItems);
        } else {
          localStorage.removeItem('cart'); // Clear cart from localStorage if empty
        }
      } catch (error) {
        console.log('Failed to save cart:', error);
      }
    };
    saveCart();
  }, [cartItems]);

   // Fetch and enrich cart data from backend
   const fetchEnrichedCartData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/cart`);
      console.log('Enriched Cart Data from Backend:', response.data);
      setCartItems(response.data); // This will replace local cart with Unity's cart
    } catch (error) {
      console.error('Error fetching enriched cart data:', error);
    }
  };
  
  // 🚀 On first load, sync Unity cart to frontend
  useEffect(() => {
    fetchEnrichedCartData(); // Only GET, no need to pass anything
  }, []);
  


  const addToCart = (product) => {
    setCartItems((prev) => {
      const exists = prev.find((item) => item._id === product._id);
      if (exists) {
        const updatedCart = prev.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
        localStorage.setItem('cart', JSON.stringify(updatedCart)); // Save immediately after update
        return updatedCart;
      } else {
        const updatedCart = [...prev, { ...product, quantity: 1 }];
        localStorage.setItem('cart', JSON.stringify(updatedCart)); // Save immediately after update
        return updatedCart;
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => {
      const updatedCart = prev.filter((item) => item._id !== productId);
      localStorage.setItem('cart', JSON.stringify(updatedCart)); // Save immediately after update
      return updatedCart;
    });
  };

  const updateQuantity = (productId, quantity) => {
    setCartItems((prev) => {
      if (quantity <= 0) {
        const updatedCart = prev.filter((item) => item._id !== productId);
        localStorage.setItem('cart', JSON.stringify(updatedCart)); // Save immediately after update
        return updatedCart;
      }
      const updatedCart = prev.map((item) =>
        item._id === productId ? { ...item, quantity } : item
      );
      localStorage.setItem('cart', JSON.stringify(updatedCart)); // Save immediately after update
      return updatedCart;
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

      localStorage.setItem('cart', JSON.stringify(updatedCart)); // Save immediately after update
      return updatedCart;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart'); // Remove from localStorage when clearing the cart
  };

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

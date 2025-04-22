import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  // 🔁 Load wishlist from storage when the app starts
  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const storedWishlist = await AsyncStorage.getItem('wishlist');
        // console.log("Stored Wishlist: ",storedWishlist)
        if (storedWishlist) {
          setWishlistItems(JSON.parse(storedWishlist));
        }
      } catch (error) {
        console.log('Failed to load wishlist:', error);
      }
    };
    loadWishlist();
  }, []);
  
  // 💾 Save wishlist to storage every time it changes
  useEffect(() => {
    const saveWishlist = async () => {
      try {
        await AsyncStorage.setItem('wishlist', JSON.stringify(wishlistItems));
      } catch (error) {
        console.log('Failed to save wishlist:', error);
      }
    };
    saveWishlist();
  }, [wishlistItems]);

  const addToWishlist = (item) => {
    if (!wishlistItems.find((x) => x._id === item._id)) {
      setWishlistItems([...wishlistItems, item]);
    }
  };

  const removeFromWishlist = (id) => {
    setWishlistItems(wishlistItems.filter((item) => item._id !== id));
  };

  const clearWishlist = () => setWishlistItems([]);

  const isInWishlist = (id) => wishlistItems.some((item) => item._id === id);

  return (
    <WishlistContext.Provider
      value={{ wishlistItems, addToWishlist, removeFromWishlist, clearWishlist, isInWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);

import React, { createContext, useState, useEffect } from 'react';

// Create the context
export const WishlistContext = createContext();

const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    try {
      const storedWishlist = localStorage.getItem('wishlist');
      if (storedWishlist) {
        console.log('Loaded wishlist:', storedWishlist);
        setWishlistItems(JSON.parse(storedWishlist));
      }
    } catch (error) {
      console.log('Failed to load wishlist:', error);
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    try {
      if (wishlistItems.length > 0) {
        localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
        console.log('Saved wishlist:', wishlistItems);
      }
    } catch (error) {
      console.log('Failed to save wishlist:', error);
    }
  }, [wishlistItems]);

  const addToWishlist = (item) => {
    setWishlistItems((prevWishlist) => {
      const updatedWishlist = [...prevWishlist, item];
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));  // Save immediately after updating state
      return updatedWishlist;
    });
  };

  const removeFromWishlist = (id) => {
    setWishlistItems((prevWishlist) => {
      const updatedWishlist = prevWishlist.filter((item) => item._id !== id);
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));  // Save immediately after updating state
      return updatedWishlist;
    });
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    localStorage.removeItem('wishlist');  // Remove from localStorage when clearing
  };

  const isInWishlist = (id) => wishlistItems.some((item) => item._id === id);

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export { WishlistProvider };

import { useContext } from 'react';
import { WishlistContext } from './provider/WishlistProvider'; // Import the context

export const useWishlist = () => {
  return useContext(WishlistContext); // Use the context here
};

import React from 'react';
import { useWishlist } from '../context/useWishlist';
// import { useCart } from '../context/useCart';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
const URL = import.meta.env.VITE_APP_BACKEND_URL;

const Wishlist = () => {
  const { wishlistItems } = useWishlist();

  return (
    <div className="col">
        <Header />
      <div className="container mt-4">
      {wishlistItems.length === 0 ? (
        <div className='d-flex justify-content-center align-items-center' style={{height: '75vh'}}>
        <h5 className="text-center text-muted">💔 Your wishlist is empty</h5>
        </div>
      ) : (
        <div className="row">
          {wishlistItems.map((item) => (
            <div className="col-md-6 col-lg-3 mb-4" key={item._id}>
              <ProductCard product={item} />
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
};

export default Wishlist;

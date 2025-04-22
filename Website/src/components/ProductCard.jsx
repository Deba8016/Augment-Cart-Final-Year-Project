import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/useCart';
import { useWishlist } from '../context/useWishlist';

const URL = import.meta.env.VITE_APP_BACKEND_URL;

const ProductCard = ({ product }) => {
  const { addToCart, updateQuantity, cartItems, removeFromCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [liked, setLiked] = useState(isInWishlist(product._id));
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    // Check if the product is already in the cart and update quantity
    const cartItem = cartItems.find((item) => item._id === product._id);
    if (cartItem) {
      setQuantity(cartItem.quantity);
    }
  }, [cartItems, product._id]);

  // Handle adding to the cart
  const handleAddClick = () => {
    addToCart(product);
    setQuantity(1);
  };

  // Handle quantity change
  const handleIncrease = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    updateQuantity(product._id, newQuantity);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      updateQuantity(product._id, newQuantity);
    } else {
      setQuantity(0);
      removeFromCart(product._id);
    }
  };

  // Handle adding/removing from the wishlist
  const handleWishlistClick = () => {
    if (liked) {
      removeFromWishlist(product._id);
      setLiked(false);
    } else {
      addToWishlist(product);
      setLiked(true);
    }
  };

  return (
    <div className="card border-1 shadow rounded-4 p-3 product-card my-4">
      <Link to={`/productDetails/${product._id}`} style={{ color: 'black', textDecoration: 'none' }}>
        <div className="position-relative text-center d-flex justify-content-center">
          <img
            src={`${URL}/images/product-images/${product.image}`}
            alt={product.name}
            className="img-fluid my-3 product-image scale-on-hover"
          />
        </div>
      </Link>

      <div className="card-body text-center">
        <h6 className="card-title fw-bold">{product.name}</h6>
        <p className="fw-bold">{product.price}</p>

        <div className="d-flex justify-content-between align-items-center mt-3">
          <div style={{ position: 'relative' }}>
            <button className="wishlist-btn" onClick={handleWishlistClick}>
              <i
                className={`fa-${liked ? 'solid' : 'regular'} fa-heart`}
                style={{ color: liked ? 'red' : '#4caf50' }}
              ></i>
            </button>
          </div>

          <div className="d-flex align-items-center">
            {quantity > 0 ? (
              <>
                <button className="btn btn-outline-success" onClick={handleDecrease}>
                  -
                </button>
                <span className="mx-2">{quantity}</span>
                <button className="btn btn-outline-success" onClick={handleIncrease}>
                  +
                </button>
              </>
            ) : (
              <button className="btn btn-outline-success" onClick={handleAddClick}>
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

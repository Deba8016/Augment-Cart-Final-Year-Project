import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../context/useCart';
import { useWishlist } from '../context/useWishlist';
import { getProduct } from '../api/Product_API';
import Header from '../components/Header';
import Footer from '../components/Footer';

const URL = import.meta.env.VITE_APP_BACKEND_URL;

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});

  const { addToCart, updateQuantity, cartItems } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [liked, setLiked] = useState(isInWishlist(product._id));
  const cartItem = cartItems.find((item) => item._id === product._id);
  const quantity = cartItem ? cartItem.quantity : 0;

  

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProduct(id);
        setProduct(response);
        console.log(product)
      } catch (error) {
        console.error('Failed to fetch product:', error);
      }
    };
    fetchProduct();
  }, [id]);


  if (!product) {
    return <div className="text-center my-5">Loading product details...</div>;
  }

 

  const handleAddToCart = () => {
    addToCart({ ...product, id: product._id });
  };

  const handleIncrement = () => {
    updateQuantity(product._id, quantity + 1);
  };

  const handleDecrement = () => {
    updateQuantity(product._id, quantity - 1);
  };
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
    <div className="col">
      <Header />
      <div className="container my-5">
        <div className="row">
          {/* Product Image */}
          <div className="col-md-6 text-center d-flex flex-column justify-content-center align-items-center">
          <span style={{position:"relative", top:50, left: -125}}>
          <button className="wishlist-btn" onClick={handleWishlistClick}>
              
              <i
                className={`fa-${liked ? 'solid' : 'regular'} fa-heart`}
                style={{ color: liked ? 'red' : '#4caf50' }}
              ></i>
             
            </button> </span>
            <img
              src={`${URL}/images/product-images/${product.image}`}
              alt={product.name}
              className="img-fluid rounded shadow p-4"
              style={{ maxHeight: '400px' }}
            />

            {/* Buttons Container */}
            <div className=" row d-flex justify-content-center w-50 mt-3">
              {/* Add to Cart Button */}
              <div className='col'>
                {quantity > 0 ? (
                  <div className="d-flex justify-content-center align-items-center">
                    <button className="btn btn-outline-success me-5 " onClick={handleDecrement}>-</button>
                    <span className="fs-4">{quantity}</span>
                    <button className="btn btn-outline-success ms-5" onClick={handleIncrement}>+</button>
                  </div>
                ) : (
                  <button
                    className='btn btn-success w-100'
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          </div>


          {/* Product Info */}
          <div className="col-md-6">
            <h2 className="fw-bold">{product.name}</h2>
            <h4 className="text-success mb-3">₹{product.price}</h4>
            <p>
              &#8226; Packed with nutrients and flavor, {product.name} is perfect for a nutritious and satisfying addition to your meals.
              <br /><br />
              &#8226; Freshly sourced and of the highest quality, {product.name} is versatile for a variety of dishes, from simple snacks to hearty meals.
              <br /><br />
              &#8226; Bring out the best in every recipe with {product.name}, carefully selected for its taste, freshness, and quality.
              <br /><br />
              &#8226; Whether it's a healthy snack or an essential ingredient in your next recipe, {product.name} adds flavor and nourishment to your day.
              <br /><br />
              &#8226; Enjoy the natural goodness of {product.name}, offering rich flavors and essential nutrients to make every meal more enjoyable.
              <br /><br />
              &#8226; {product.name} is your perfect companion for every dish, providing the freshness and quality you expect for home-cooked goodness.
              <br /><br />
            </p>


          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetails;

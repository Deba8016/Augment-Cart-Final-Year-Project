import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/useCart';
import Header from '../components/Header';
import { createOrder } from '../api/Order_API'; // Import the createOrder function
import { jwtDecode } from 'jwt-decode';
import { getUser } from '../api/User_API'; // Assuming you have a function to get user info
import Notiflix from 'notiflix';
import { useNavigate } from 'react-router-dom';
const URL = import.meta.env.VITE_APP_BACKEND_URL;

const Cart = () => {

  const navigate = useNavigate();

  const { cartItems, removeFromCart, updateQuantity, getTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const decoded = jwtDecode(token);
          const userFromDB = await getUser(decoded.id);
          console.log(userFromDB);
          setUserInfo(userFromDB);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
    fetchUser();
  }, []);

  // Function to handle quantity change
  const handleQuantityChange = (productId, change) => {
    const cartItem = cartItems.find(item => item._id === productId);
    const newQuantity = cartItem ? cartItem.quantity + change : 1;

    if (newQuantity <= 0) {
      removeFromCart(productId); // Remove from cart if quantity is 0 or less
    } else {
      updateQuantity(productId, newQuantity); // Update quantity
    }
  };

  // Function to create Razorpay order
  const createRazorpayOrder = async () => {
    // Razorpay order options
    const razorpayOptions = {
      key: import.meta.env.VITE_APP_RAZORPAY_KEY_ID, // Use the Razorpay key from the environment variables
      amount: getTotal() * 100, // Convert to paise (Razorpay expects amount in paise)
      currency: 'INR',
      name: 'Augment Cart',
      description: 'Order Payment',
      handler: async function (response) {
        try {
          // Get the paymentId from the Razorpay response
          const paymentID = response.razorpay_payment_id;

          // Now call your backend to save the order and payment details
          const orderResponse = await createOrder({
            paymentID: paymentID,
            products: cartItems.map(item => ({
              product: item._id,
              quantity: item.quantity,
            })),
            totalAmount: getTotal(),
            user: userInfo._id,
          });

          if (orderResponse.status == '201') {
            // Handle success, e.g., navigate to a success page
            console.log('Order created successfully');
            Notiflix.Notify.success(orderResponse.data)
            clearCart();
            navigate("/home")

            // Optionally, you can navigate to a confirmation page or update the UI
          } else {
            console.log('Error creating order on the backend');
            Notiflix.Notify.failure(orderResponse.data)
          }
        } catch (error) {
          console.error('Error during Razorpay payment handler:', error);
          Notiflix.Notify.failure("Error during Razorpay payment handler", error)
        }
      },
      prefill: {
        name: userInfo?.name || " ",
        email: userInfo?.email || " ",
        contact: userInfo?.mobile || " ",
      },
      theme: { color: '#4caf50' },
    };

    const razorpayInstance = new window.Razorpay(razorpayOptions);
    razorpayInstance.open();
  };

  // Function to proceed to payment
  const handleProceedToPayment = async () => {
    if (!userInfo) {
      Notiflix.Notify.failure("Please Login to Continue..")
      setLoading(true);
      setTimeout(() => {
        setLoading(false)
      }, 1000);
      return;
    }
    if(userInfo.address === null){
      Notiflix.Notify.warning("Please Add your Delivery Address..")
      setLoading(true);
      setTimeout(() => {
        setLoading(false)
        navigate("/profile")
      }, 1000);
      return;
    }


    try {
      // Call Razorpay to initiate the payment
      createRazorpayOrder(); // Pass orderData to Razorpay order creation
    } catch (error) {
      console.error('Error during payment or order creation:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="col">
      <Header />
      <div className="container mt-4">
        {cartItems.length > 0 && (
          <div className="d-flex justify-content-between align-items-center py-4 mb-4">
            <div>
              <h5>Total Cart Amount: <span className="h2">₹{getTotal()}</span></h5>
            </div>
            <button
              className="btn btn-success"
              onClick={handleProceedToPayment}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Proceed to Payment'}
            </button>
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: '75vh' }}>
            <h5 className="text-center text-muted">🛒 Your cart is empty</h5>
          </div>
        ) : (
          <div className="row">
            <div className="col">
              {cartItems.map((item) => (
                <div key={item._id}>
                  <div className="d-flex justify-content-between align-items-center mb-3">

                    <div className="position-relative me-3">
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="btn btn-sm btn-danger position-absolute top-0 start-0 rounded-circle"
                        style={{ zIndex: 2 }}
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                      <Link to={`/productDetails/${item._id}`}>
                        <img
                          src={`${URL}/images/product-images/${item.image}`}
                          alt={item.name}
                          className="cart-item-img"
                          style={{ width: '100px', borderRadius: '10px' }}
                        />
                      </Link>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h4 className="mb-3">{item.name}</h4>
                      <p className="mb-1">{item.categoryName === 'null' ? '' : item.categoryName}</p>
                      <h6 className="mb-1">{item.price}</h6>
                    </div>

                    <div className="buttons">
                      <div className="mb-4 h5">
                        ₹{(parseFloat(item.price.match(/[\d.]+/)[0]) * item.quantity).toFixed(2)}
                      </div>
                      <div className="d-flex align-items-center">
                        <button
                          className="btn btn-dark btn-sm"
                          onClick={() => handleQuantityChange(item._id, -1)}
                        >
                          <i className="fa-solid fa-minus"></i>
                        </button>
                        <span className="mx-2">{item.quantity}</span>
                        <button
                          className="btn btn-dark btn-sm"
                          onClick={() => handleQuantityChange(item._id, 1)}
                        >
                          <i className="fa-solid fa-plus"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                  <hr style={{ borderTop: 'dashed 1px black' }} />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Cart;

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDisclosure } from '@chakra-ui/react';
import WebProfileImage from './WebProfileImage';
const URL = import.meta.env.VITE_APP_BACKEND_URL;
import Login from '../pages/authPages/Login';
import SignUp from '../pages/authPages/SignUp';
import { useCart } from '../context/useCart';
import SearchBar from './Searchbar';

const Header = () => {
  const navigate = useNavigate();
  const { cartItems } = useCart();

  const [hasUser, setHasUser] = useState(false);
  const handleCloseModals = () => {
    closeSignup();
    closeLogin();
  };
  const switchToLogin = () => {
    closeSignup();
    openLogin();
  };

  const switchToSignup = () => {
    closeLogin();
    openSignup();
  };


  const { isOpen: isSignupOpen, onOpen: openSignup, onClose: closeSignup } = useDisclosure();
  const { isOpen: isLoginOpen, onOpen: openLogin, onClose: closeLogin } = useDisclosure();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setHasUser(true);
    }

  }, [])

  return (
    <div className="col">
      <div className="container py-3" id='header-section'>
        <div className="row align-items-center">

          {/* Left: Logo */}

          <div className="col-md-3 text-center ">
            <Link to="/home">
              <img
                className="rounded-circle img-fluid scale-on-hover"
                src="/images/logo.png"
                alt="Logo"
                style={{ height: '80px', width: 'auto', cursor: "pointer" }}
              />

            </Link>
          </div>


          {/* Center: Navbar + Search */}
          <div className="col-md-6 d-flex justify-content-center">
            <nav className="navbar navbar-expand-lg p-0">
              <div className="container-fluid p-0">
                <button
                  className="navbar-toggler"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarSupportedContent"
                  aria-controls="navbarSupportedContent"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                  <ul className="navbar-nav mb-2 mb-lg-0">
                    <li className="nav-item">
                      <Link className="nav-link active change-color-on-hover" to="/home">Home</Link>
                    </li>
                    <li className="nav-item ms-3">
                      <a className="nav-link active change-color-on-hover" href="#category-section">Category</a>
                    </li>
                    <li className="nav-item ms-3">
                      <a className="nav-link active change-color-on-hover" href="#bestseller-section">Bestseller</a>
                    </li>
                    <li className="nav-item mx-3">
                      <a className="nav-link active change-color-on-hover" href="#footer-section">Contact</a>
                    </li>
                  </ul>

                  {/* Search Field with Icon */}
                  <SearchBar />
                </div>
              </div>
            </nav>
          </div>

          {/* Right: Icons */}
          <div className="col-md-3 d-flex justify-content-end align-items-center gap-5">

            <Link to="/cart">
              <div>
                <span class="material-symbols-outlined scale-on-hover" style={{ color: "black", paddingTop: "4px" }}>
                  local_mall
                </span>
                {cartItems.length > 0 && (
                  <span style={{ backgroundColor: "#4caf50", color: "white", borderRadius: "50%", border: "1px solid black", position: "absolute", top: 35, marginLeft: 15, height: "20px", aspectRatio: "1/1", display: "flex", justifyContent: "center", alignItems: "center", paddingTop: 1 }}>{cartItems.length}</span>
                )}
              </div>
            </Link>

            <Link to="/wishlist"><i className="fa-solid fa-heart fa-xl change-color-on-hover" style={{ color: "red" }}></i></Link>

            <span
              onClick={() => {
                if (hasUser) {
                  navigate("/profile")
                } else {
                  openSignup();
                }
              }}
              style={{ cursor: 'pointer' }}
            >
              <WebProfileImage size={50} />
            </span>

            {/* Signup Modal */}
            <SignUp
              isOpen={isSignupOpen}
              onClose={handleCloseModals}
              switchToLogin={switchToLogin}
            />

            {/* Login Modal */}
            <Login
              isOpen={isLoginOpen}
              onClose={handleCloseModals}
              switchToSignup={switchToSignup}
            />




          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import ARChoicePage from './pages/ARChoicePage';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import ProfilePage from './pages/ProfilePage';
import LandingPage from './pages/LandingPage';
import { CartProvider } from './context/provider/CartProvider';
import { WishlistProvider } from './context/provider/WishlistProvider';
import ProductDetails from './pages/ProductDetails';
import ProductsPerCategory from './pages/ProductsPerCategory';
import Checkout from './pages/Checkout';
import SearchResultsPage from './pages/SearchResultsPage';
import { ChakraProvider } from '@chakra-ui/react';
function App() {
  return (
    <Router>
      <ChakraProvider>
      <WishlistProvider>
        <CartProvider>

          <Routes>
            {/* AR Entry page */}
            <Route path="/" element={<ARChoicePage />} />

            {/* Website view */}
            <Route path="/home" element={<LandingPage />} />
            <Route path='/wishlist' element={<Wishlist />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/profile' element={<ProfilePage />} />
            <Route path='/productDetails/:id' element={<ProductDetails />} />
            <Route path='/productsPerCategory/:categoryId/:categoryName' element={<ProductsPerCategory />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path='/checkout' element={<Checkout />} />

          </Routes>

        </CartProvider>
        </WishlistProvider>
      </ChakraProvider>
    </Router>
  );
}

export default App;

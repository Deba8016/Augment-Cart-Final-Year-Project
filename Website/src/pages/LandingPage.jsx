import React from 'react'
import Header from '../components/Header';
import Offer from '../components/Offer';
import Category from '../components/Category';

import BestSeller from '../components/BestSeller';
import Footer from '../components/Footer';
import NewlyLaunched from '../components/NewlyLaunched';

const LandingPage = () => {
  return (
    <div className="App container-fluid">
      <div className="row header">
        <Header />
      </div>
      <div className="row offer pt-3 pb-5">
        <Offer />
      </div>
      <div className="row category pt-5 pb-5">
        <Category />
      </div>
      <div className="row bestseller pt-5 pb-5">
        <BestSeller />
      </div>
      <div className="row newlylaunched pt-5 pb-5">
        <NewlyLaunched />
      </div>
      <div className="row footer pt-5">
        <Footer />
      </div>
    </div>
  )
}

export default LandingPage

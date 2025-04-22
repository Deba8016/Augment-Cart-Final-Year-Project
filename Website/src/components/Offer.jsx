import React from 'react'
import { Link } from 'react-router-dom'


const Offer = () => {
    return (
        <div className="col" id='home-section'>
            <div className="container">
                <div className="row">
                    {/* Left side */}
                    <div className="col-md-8 col-lg-8 d-flex align-items-center justify-content-center">
                        <div className="top-left d-flex align-items-center justify-content-between p-4 scale-on-hover">
                            <div>
                                <p className="text-warning fw-bold">100% Natural</p>
                                <h2 className="fw-bold">Fresh Vegetables</h2>
                                <p>Best Selling Summer Naturally Grown Vegetables.</p>
                                <Link to="/productsPerCategory/67f6cf691c94935b4ba86922/Vegetables"><button className="btn btn-outline-dark mt-2">SHOP NOW</button></Link>
                            </div>
                            <img src="/images/top_left.png" alt="Juice" className="img-fluid top-left-img" />
                        </div>
                    </div>

                    {/* Right side */}
                    <div className="col-md-4 col-lg-4 d-flex flex-column justify-content-between">
                        <div className="row">
                        <div className="col">
                        <div className="top-right p-3 mb-3 d-flex align-items-center justify-content-between">
                            <div className="row scale-on-hover">
                                <div className='col-8 ps-4'>
                                    <p className="text-muted small">20% Off</p>
                                    <h5 className="fw-bold">Fruits</h5>
                                    <Link to="/productsPerCategory/67f6ce2a1c94935b4ba86920/Fruits" style={{ color: "#4caf50", textDecoration: "none" }}>Shop The Category →</Link>
                                </div>
                                <div className='col-4 pe-2'><img src="/images/top-right.png" alt="Fruits" className="img-fluid" /></div>
                            </div>
                        </div>
                        <div className="bottom-right p-3 d-flex align-items-center justify-content-between">
                            <div className="row scale-on-hover">
                                <div className='col-8 ps-4'>
                                    <p className="text-muted small">15% Off</p>
                                    <h5 className="fw-bold">Snacks</h5>
                                    <Link to="/productsPerCategory/67f6d18d1c94935b4ba86924/Snacks" style={{ color: "#4caf50", textDecoration: "none" }}>Shop The Category →</Link>
                                </div>
                                <div className="col-4 pe-2">
                                    <img src="/images/bottom-right.png" alt="Breads" className="img-fluid" />
                                </div>
                            </div>
                        </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>



    )
}

export default Offer

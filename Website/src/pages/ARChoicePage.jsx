import React from "react";
import { useNavigate } from "react-router-dom";


const ARChoicePage = () => {
    const navigate = useNavigate();

    const handleWebView = () => {
        navigate("/home");
    };


    return (
        <div className="ar-choice-container">
            <div className="card text-center shadow p-4 ar-choice-card">
                <div className="card-body">
                    <h2 className="card-title mb-4">Welcome to AUGMENT-CART</h2>
                    <p className="card-text mb-4">
                        How you'd like to experience our store?
                    </p>
                    <div className="row">
                        <div className="col-6">
                            <button
                                className="btn btn-lg w-100 web"
                                onClick={handleWebView}
                            >
                                Web View
                            </button>
                        </div>
                        <div className="col-6">


                            <a href="https://augment-kart.netlify.app/"><button className="btn btn-lg w-100 ar">
                                AR View
                            </button></a>


                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ARChoicePage;

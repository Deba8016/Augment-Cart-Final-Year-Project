import React, { useRef, useEffect, useState } from 'react';
import { getCategories } from '../api/Category_API';
import { Link } from 'react-router-dom';

const URL = import.meta.env.VITE_APP_BACKEND_URL;

const Category = () => {
    const scrollRef = useRef(null);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const data = await getCategories();
            setCategories(data);
        };

        fetchCategories();
    }, []);

    const scroll = (dir) => {
        const scrollAmount = 200;
        scrollRef.current.scrollLeft += dir === 'left' ? -scrollAmount : scrollAmount;
    };

    useEffect(() => {
        const el = scrollRef.current;
        const wheelScroll = (e) => {
            if (e.deltaY === 0) return;
            e.preventDefault();
            el.scrollLeft += e.deltaY;
        };
        el.addEventListener('wheel', wheelScroll, { passive: false });
        return () => el.removeEventListener('wheel', wheelScroll);
    }, []);

    return (
        <div className="col" id="category-section">
            <div className="container">
                <div className="row">
                    <div className="col-md-6">
                        <h2>Categories</h2>
                    </div>
                    <div className="col-md-6 d-flex justify-content-end">
                        <div className="btn scroll-btn me-2 pe-3 ps-3 d-flex justify-content-center align-items-center" onClick={() => scroll('left')}>
                            <i className="fa-solid fa-chevron-left"></i>
                        </div>
                        <div className="btn scroll-btn ms-2 pe-3 ps-3 d-flex justify-content-center align-items-center" onClick={() => scroll('right')}>
                            <i className="fa-solid fa-chevron-right"></i>
                        </div>
                    </div>
                </div>

                <div className="row mt-3">
                    <div
                        className="d-flex justify-content-center overflow-auto flex-nowrap w-100 px-2 category-scrollbar-hide"
                        ref={scrollRef}
                        style={{
                            scrollBehavior: 'smooth',
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                        }}
                    >
                        {categories.map((category) => (
                            <Link to={`/productsPerCategory/${category._id}/${category.name}`} style={{ textDecoration: 'none' }}><div
                                key={category._id}
                                className="text-center mx-3 flex-shrink-0 category-item scale-on-hover"
                                style={{ width: '100px', cursor: 'pointer', color: "black" }}
                            >
                                <div
                                    className="rounded-circle mb-2 d-flex justify-content-center align-items-center bg-white"
                                    style={{
                                        width: '90px',
                                        height: '90px',
                                        border: '2px solid #eee',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <img
                                        src={`${URL}/images/category-logo/${category.image}`}
                                        alt={category.name}
                                        style={{
                                            width: '70px',
                                            height: '70px',
                                            objectFit: 'contain',
                                        }}
                                    />
                                </div>
                                <div className="fw-medium" >{category.name}</div>
                            </div></Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Category;

import React, { useRef, useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { getSortedProducts } from '../api/Product_API';

const BestSeller = ({ limit = 10, sortBy = 'sold', order = 'desc' }) => {
    const [items, setItems] = useState([]);
    const scrollRef = useRef(null);

    useEffect(() => {
        const sortedProducts = async () => {
            const response = await getSortedProducts({ limit, sortBy, order });
            setItems(response);
        };
        sortedProducts();
    }, [limit, sortBy, order]);

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
        <div className="col" id="bestseller-section">
            <div className="container">
                <div className="row">
                    <div className="col-md-6">
                        <h2>BestSeller</h2>
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
                        className="d-flex overflow-auto flex-nowrap w-100 px-2 category-scrollbar-hide"
                        ref={scrollRef}
                        style={{
                            scrollBehavior: 'smooth',
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                        }}
                    >
                        {items.map((item) => (
                            <ProductCard product={item} key={item._id} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BestSeller;

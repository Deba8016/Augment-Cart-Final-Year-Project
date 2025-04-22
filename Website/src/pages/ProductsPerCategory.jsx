import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductsByCategory } from '../api/Product_API';
import ProductCard from '../components/ProductCard';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ProductsPerCategory = () => {
  const { categoryId, categoryName } = useParams();
  console.log(categoryId, "     ", categoryName)
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProductsByCategory(categoryId);
        setProducts(data);
        console.log(data)
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };
    fetchProducts();
  }, [categoryId]);

  return (
    <div className="container-fluid">
      <div className="row header">
        <Header />
      </div>
      <div className="col">
        <div className="container mt-4">
          <div className="row">
            {products.length === 0 ? (
              <h5 className="text-center text-muted mt-5">No products found in this category</h5>
            ) : (
              products.map((item) => (
                <div className="col-md-6 col-lg-3 mb-4" key={item._id}>
                  <ProductCard product={item} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <div className="row footer">
        <Footer />
      </div>
    </div>
  );
};

export default ProductsPerCategory;

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { searchProducts } from '../api/Product_API';
import ProductCard from '../components/ProductCard';
import Header from '../components/Header';
import Footer from '../components/Footer';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchResultsPage = () => {
  const query = useQuery().get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const data = await searchProducts(query);
        setResults(data);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
    };

    if (query.trim()) {
      fetchResults();
    }
  }, [query]);

  return (
    <div className="col">
    <Header />
        <div className="container mt-4">
      <h3>Results for "{query}"</h3>
      {loading ? (
        <p>Loading...</p>
      ) : results.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="row">
          {results.map(item => (
            <div className="col-md-6 col-lg-3">
            <ProductCard product={item} />
            </div>
          ))}
        </div>
      )}
    </div>
    <Footer />
    </div>
  );
};

export default SearchResultsPage;

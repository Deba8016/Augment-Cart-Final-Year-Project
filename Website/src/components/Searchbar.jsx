import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ placeholder = "Search products...", className = "" }) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form
      className={`d-flex align-items-center position-relative ${className}`}
      onSubmit={handleSubmit}
      role="search"
      style={{ minWidth: '250px' }}
    >
      <input
        className="form-control pe-5"
        type="search"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search"
      />
      <button
        className="position-absolute end-0 top-50 translate-middle-y me-2 p-0 border-0 bg-transparent"
        type="submit"
      >
        <i className="fa-solid fa-magnifying-glass"></i>
      </button>
    </form>
  );
};

export default SearchBar;

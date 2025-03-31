import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import './pages/Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Mock API call
    fetch('https://fakestoreapi.com/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error('Error fetching products:', error));
  }, []);

  return (
    <div className="home">
      <h1 className="home-title">Featured Products</h1>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Home;
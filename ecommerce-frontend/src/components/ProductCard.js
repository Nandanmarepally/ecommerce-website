import React from 'react';
import { Link } from 'react-router-dom';
import './components/ProductCard.css';
import './ProductCard.css'; // Ensure this file exists


const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} className="product-image" />
      <h3 className="product-title">{product.name}</h3>
      <p className="product-price">${product.price}</p>
      <Link to={`/product/${product.id}`} className="product-link">View Details</Link>
    </div>
  );
};

export default ProductCard;

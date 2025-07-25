import React from 'react';
import { Helmet } from 'react-helmet-async';

const ProductDetail = () => {
  return (
    <>
      <Helmet>
        <title>Product Details - EcomShop</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Product Detail Page</h1>
        <p className="text-gray-600">Coming soon! Detailed product view with images, reviews, and purchase options.</p>
      </div>
    </>
  );
};

export default ProductDetail;
import React from 'react';
import { Helmet } from 'react-helmet-async';

const Products = () => {
  return (
    <>
      <Helmet>
        <title>Products - EcomShop</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Products Page</h1>
        <p className="text-gray-600">Coming soon! Product listing with search and filters.</p>
      </div>
    </>
  );
};

export default Products;
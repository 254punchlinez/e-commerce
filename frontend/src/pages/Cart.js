import React from 'react';
import { Helmet } from 'react-helmet-async';

const Cart = () => {
  return (
    <>
      <Helmet>
        <title>Shopping Cart - EcomShop</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Shopping Cart</h1>
        <p className="text-gray-600">Coming soon! Cart management with quantity updates and checkout.</p>
      </div>
    </>
  );
};

export default Cart;
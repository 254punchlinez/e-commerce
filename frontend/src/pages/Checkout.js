import React from 'react';
import { Helmet } from 'react-helmet-async';

const Checkout = () => {
  return (
    <>
      <Helmet>
        <title>Checkout - EcomShop</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Checkout</h1>
        <p className="text-gray-600">Coming soon! Secure checkout with payment processing.</p>
      </div>
    </>
  );
};

export default Checkout;
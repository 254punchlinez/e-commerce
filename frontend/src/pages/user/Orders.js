import React from 'react';
import { Helmet } from 'react-helmet-async';

const Orders = () => {
  return (
    <>
      <Helmet>
        <title>My Orders - EcomShop</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">My Orders</h1>
        <p className="text-gray-600">Coming soon! Order history and tracking.</p>
      </div>
    </>
  );
};

export default Orders;
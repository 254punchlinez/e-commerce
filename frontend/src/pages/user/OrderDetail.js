import React from 'react';
import { Helmet } from 'react-helmet-async';

const OrderDetail = () => {
  return (
    <>
      <Helmet>
        <title>Order Details - EcomShop</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Order Details</h1>
        <p className="text-gray-600">Coming soon! Detailed order information and tracking.</p>
      </div>
    </>
  );
};

export default OrderDetail;
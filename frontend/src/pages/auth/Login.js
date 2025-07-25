import React from 'react';
import { Helmet } from 'react-helmet-async';

const Login = () => {
  return (
    <>
      <Helmet>
        <title>Login - EcomShop</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Login Page</h1>
        <p className="text-gray-600">Coming soon! User authentication with email and password.</p>
      </div>
    </>
  );
};

export default Login;
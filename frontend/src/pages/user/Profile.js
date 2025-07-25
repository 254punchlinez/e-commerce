import React from 'react';
import { Helmet } from 'react-helmet-async';

const Profile = () => {
  return (
    <>
      <Helmet>
        <title>Profile - EcomShop</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">User Profile</h1>
        <p className="text-gray-600">Coming soon! User profile management and settings.</p>
      </div>
    </>
  );
};

export default Profile;
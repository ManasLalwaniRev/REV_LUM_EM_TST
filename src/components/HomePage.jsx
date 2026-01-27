
import React from 'react';

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 p-8">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-4xl text-center">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-8">
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            Welcome to Lumina Vendor Portal
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          {/* Use the sidebar to navigate through the application. */}
        </p>
      </div>
    </div>
  );
};

export default HomePage;
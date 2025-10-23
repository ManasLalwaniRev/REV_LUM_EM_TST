// src/components/Modal.jsx
import React from 'react';

const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 z-50">
    <div className="bg-white p-8 rounded-xl shadow-2xl max-w-6xl w-full relative">
      {/* Main modal title - slightly bolder and more spaced */}
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
        {title}
      </h2>
      {/* Improved Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-full p-2 w-8 h-8 flex items-center justify-center transition duration-200 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-400"
        aria-label="Close modal"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      {children}
    </div>
  </div>
);

export default Modal;

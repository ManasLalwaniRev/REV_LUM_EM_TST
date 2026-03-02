import React from 'react';
import { ArrowLeft, ExternalLink, Database, Briefcase, Download, Users,LogOut } from 'lucide-react';

// A small component for feature items to keep the code clean
const FeatureItem = ({ icon, title, description }) => (
    <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex-shrink-0 text-blue-600">
            {icon}
        </div>
        <div>
            <h3 className="font-semibold text-gray-800">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
        </div>
    </div>
);

const AboutPage = ({ setCurrentPage, handleLogout }) => {
  return (
    // Main container with dark background
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8">
      {/* Centered content card with increased max-width */}
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-6xl mx-auto text-gray-800">
        
        {/* Logo */}
        <div className="flex justify-center mb-6">
            <img 
                src="/Lumina_logo.png" 
                alt="Lumina Logo" 
                className="h-16"
            />
        </div>
        {/* <div className="w-1/4 flex justify-"> */}
             {/* <button 
                onClick={handleLogout} 
                className="p-3 bg-red-100 hover:bg-red-200 rounded-full text-red-600 transition-colors"
                title="Logout"
            >
                <LogOut size={20} />
            </button> */}
        {/* </div> */}
    {/* </div> */}

        {/* Title and Description */}
        <div className="text-center mb-8">
            {/* <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    About Lumina
                </span>
            </h1> */}
            {/* <p className="text-gray-600 max-w-2xl mx-auto">
                An integrated platform designed to simplify expense tracking, streamline voucher processing, and provide powerful data management tools for your organization.
            </p> */}
        </div>

        {/* --- Key Features Section ---
        <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-700 mb-4 text-center">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FeatureItem 
                    icon={<Database size={24} />}
                    title="Centralized Expense Entry"
                    description="Submit and manage all expense records in one unified system."
                />
                <FeatureItem 
                    icon={<Briefcase size={24} />}
                    title="Voucher Processing"
                    description="A dedicated interface for accountants to review, process, and approve vouchers."
                />
                <FeatureItem 
                    icon={<Download size={24} />}
                    title="Advanced Data Export"
                    description="Generate custom Excel reports with advanced filtering and your company logo."
                />
                <FeatureItem 
                    icon={<Users size={24} />}
                    title="User & Role Management"
                    description="Admin controls for creating users and managing permissions across the application."
                />
            </div>
        </div> */}
        
        {/* --- Version & System Details Section --- */}
        <div className="space-y-4 text-center border-t border-b border-gray-200 py-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="sm:text-right">
                    <p className="text-gray-500 font-medium">Product Version</p>
                    <p className="text-gray-800 font-semibold">v2.0.0</p>
                </div>
                <div className="sm:text-center">
                    <p className="text-gray-500 font-medium">Release Date</p>
                    <p className="text-gray-800 font-semibold">2026.01.15</p>
                </div>
                <div className="sm:text-left">
                    <p className="text-gray-500 font-medium">System</p>
                    <p className="text-gray-800 font-semibold">Infotrend Sandbox</p>
                </div>
            </div>
        </div>

        {/* Website and Copyright */}
        <div className="mt-8 text-center space-y-4">
            <a 
                href="https://revolvespl.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition-colors"
            >
                Revolve Website <ExternalLink size={16} />
            </a>
            <p className="text-xs text-gray-400">
                Copyright &copy; {new Date().getFullYear()} Revolve. All Rights Reserved.
            </p>
        </div>

        {/* Back Button */}
        <div className="mt-12 text-center">
            <button
                onClick={() => setCurrentPage('view')}
                className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-5 rounded-lg shadow-sm transition-colors flex items-center gap-2 mx-auto"
            >
                <ArrowLeft size={18} />
                Back to Home
            </button>
            <div className="absolute top-6 right-6">
             <button 
                onClick={handleLogout} 
                className="p-3 bg-red-100 hover:bg-red-200 rounded-full text-red-600 transition-colors"
                title="Logout"
            >
                <LogOut size={20} />
            </button>
            </div>
        </div>
        
      </div>
    </div>
  );
};

export default AboutPage;
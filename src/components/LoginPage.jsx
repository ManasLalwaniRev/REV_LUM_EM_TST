
// console.log("VITE_API_BASE_URL VALUE:", import.meta.env.VITE_API_BASE_URL); 
import React, { useState } from 'react';

// const API_BASE_URL = 'http://localhost:5000/api';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const LoginPage = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // const response = await fetch(`${API_BASE_URL}/login`, {
         const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      // This function remains unchanged and passes all data to the parent
      onLoginSuccess(data.userId, data.username, data.role, data.avatar); 
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'An unexpected error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // --- New Dark Gradient Background ---
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-r from-gray-800 via-gray-400 to-blue-200 p-4">
    {/* // <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-br from-blue-400 via-pink-300 to-blue-600 p-4"> */}
      {/* --- New "Glass" Login Card --- */}
      <div className="bg-white/10 backdrop-blur-lg p-8 sm:p-10 rounded-2xl shadow-2xl text-center max-w-md w-full border border-white/20">
        
        {/* --- Logo --- */}
        <div className="flex justify-center mb-6">
            <img 
                src="/Lumina_logo.png" // Make sure your logo is in the /public folder
                alt="Lumina Logo" 
                className="h-14"
            />
        </div>
        
        {/* --- Title --- */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-8">
          Financial Management
        </h1>

        {/* --- Form (Functionality is unchanged) --- */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="sr-only">Username</label>
            <input
              type="text"
              id="username"
              className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              type="password"
              id="password"
              className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
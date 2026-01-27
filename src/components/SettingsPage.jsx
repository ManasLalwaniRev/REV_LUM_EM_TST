
import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, ArrowLeft, Loader } from 'lucide-react'; // Added Loader icon

// const API_BASE_URL = 'http://localhost:5000/api';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SettingsPage = ({ setCurrentPage, currentUserRole }) => {
  const [contractOptions, setContractOptions] = useState([]);
  const [creditCardOptions, setCreditCardOptions] = useState([]);
  const [newContract, setNewContract] = useState('');
  const [newCard, setNewCard] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Start with loading as true

  // Fetch all dropdown options on component mount
  const fetchData = async () => {
    setIsLoading(true);
    setMessage('');
    try {
      const [contractsRes, cardsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/contract-options`),
        fetch(`${API_BASE_URL}/credit-card-options`),
      ]);
      if (!contractsRes.ok || !cardsRes.ok) {
        throw new Error('Failed to fetch dropdown options.');
      }
      const contracts = await contractsRes.json();
      const cards = await cardsRes.json();
      setContractOptions(contracts);
      setCreditCardOptions(cards);
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleAddOption = async (type) => {
    const isContract = type === 'contract';
    const name = isContract ? newContract : newCard;
    const url = isContract ? `${API_BASE_URL}/contract-options` : `${API_BASE_URL}/credit-card-options`;
    const setOptions = isContract ? setContractOptions : setCreditCardOptions;
    const setNewItem = isContract ? setNewContract : setNewCard;

    if (!name) {
      setMessage('Please enter a name for the new option.');
      return;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, userRole: currentUserRole }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to add new ${type}.`);
      }
      const newOption = await response.json();
      setOptions(prev => [...prev, newOption].sort((a, b) => a.name.localeCompare(b.name)));
      setNewItem('');
      setMessage(`${isContract ? 'Contract' : 'Credit card'} option added successfully.`);
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  const handleDeleteOption = async (id, type) => {
    const isContract = type === 'contract';
    const url = isContract ? `${API_BASE_URL}/contract-options/${id}` : `${API_BASE_URL}/credit-card-options/${id}`;
    const setOptions = isContract ? setContractOptions : setCreditCardOptions;

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userRole: currentUserRole }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to delete ${type}.`);
      }
      setOptions(prev => prev.filter(option => option.id !== id));
      setMessage(`${isContract ? 'Contract' : 'Credit card'} option deleted successfully.`);
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };
  
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8">
      {/* <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-5xl mx-auto"> */}
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-full">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            Settings
          </span>
        </h1>

        {message && (
            <div className={`text-center p-3 rounded-lg mb-6 text-sm ${message.startsWith('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {message}
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contract Options Management Card */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Manage Contract Names</h2>
            <div className="flex mb-4">
              <input
                type="text"
                value={newContract}
                onChange={(e) => setNewContract(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="New contract name"
              />
              <button onClick={() => handleAddOption('contract')} className="bg-blue-600 text-white p-3 rounded-r-md hover:bg-blue-700 transition flex items-center">
                <PlusCircle size={20} />
              </button>
            </div>
            {/* --- FIX IS HERE: Added loading state check --- */}
            {isLoading ? (
              <div className="flex justify-center items-center h-48">
                <Loader className="animate-spin text-blue-500" size={32} />
              </div>
            ) : (
              <ul className="space-y-2 max-h-80 overflow-y-auto pr-2">
                {contractOptions.map(option => (
                  <li key={option.id} className="flex justify-between items-center p-3 bg-white border rounded-md">
                    <span className="text-gray-700">{option.name}</span>
                    <button onClick={() => handleDeleteOption(option.id, 'contract')} className="text-gray-400 hover:text-red-500 transition">
                      <Trash2 size={18} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Credit Card Options Management Card */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Manage Credit Cards</h2>
            <div className="flex mb-4">
              <input
                type="text"
                value={newCard}
                onChange={(e) => setNewCard(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="New card name"
              />
              <button onClick={() => handleAddOption('card')} className="bg-blue-600 text-white p-3 rounded-r-md hover:bg-blue-700 transition flex items-center">
                <PlusCircle size={20} />
              </button>
            </div>
            {/* --- FIX IS HERE: Added loading state check --- */}
            {isLoading ? (
              <div className="flex justify-center items-center h-48">
                <Loader className="animate-spin text-blue-500" size={32} />
              </div>
            ) : (
              <ul className="space-y-2 max-h-80 overflow-y-auto pr-2">
                {creditCardOptions.map(option => (
                  <li key={option.id} className="flex justify-between items-center p-3 bg-white border rounded-md">
                    <span className="text-gray-700">{option.name}</span>
                    <button onClick={() => handleDeleteOption(option.id, 'card')} className="text-gray-400 hover:text-red-500 transition">
                      <Trash2 size={18} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => setCurrentPage('view')}
            className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-5 rounded-lg shadow-sm transition-colors flex items-center gap-2 mx-auto"
          >
            <ArrowLeft size={18} />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

import React, { useState, useEffect } from 'react';
import Modal from './Modal.jsx';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/entries`;

const AddDataModal = ({ onClose, userId, username, contractOptions = [], creditCardOptions = [], onDataAdded }) => {
  // 1. Initial State - Ensure all keys exist to prevent "undefined" crashes
  const [formData, setFormData] = useState({
    vendorId: '',
    contractShortName: '',
    vendorName: '',
    chargeDate: '',
    chargeAmount: '',
    submittedDate: '',
    submitter: username || '',
    pmEmail: '',
    chargeCode: '',
    isApproved: false, // Checkbox state
    notes: '',
    pdfFilePath: '',
  });

  // 2. Local variables for dropdowns
  const pmEmailOptions = [
    'pm.manager1@Infotrend.com',
    'pm.manager2@Infotrend.com',
    'admin.finance@Infotrend.com',
    'operations.lead@Infotrend.com'
  ];

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Sync username if it changes
  useEffect(() => {
    if (username) {
      setFormData(prev => ({ ...prev, submitter: username }));
    }
  }, [username]);

  // 3. Robust Input Handler (Handles Text, Select, and Checkboxes)
  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowSuccessMessage(false);
    setShowErrorMessage(false);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/new`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userId }),
      });

      if (!response.ok) throw new Error('Failed to add entry');

      setShowSuccessMessage(true);
      onDataAdded(); 

      setTimeout(() => {
        setShowSuccessMessage(false);
        onClose(); 
      }, 2000);
    } catch (error) {
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal title="Add New Entry" onClose={onClose}>
      <div className="p-6 sm:p-8 bg-white rounded-xl shadow-lg max-h-[90vh] overflow-y-auto relative text-gray-800">
        
        {/* Alerts */}
        {showSuccessMessage && <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg z-50">Entry Added Successfully!</div>}
        {showErrorMessage && <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg z-50">Failed to add entry.</div>}

        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Enter New Charge Details</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Vendor ID (Replica of Credit Card) */}
          <div className="col-span-1">
            <label className="block text-sm font-medium mb-1">VENDOR ID *</label>
            <select id="vendorId" className="w-full p-2 border border-gray-300 rounded" value={formData.vendorId} onChange={handleInputChange} required>
              <option value="">Select Vendor ID</option>
              {creditCardOptions?.map((option, idx) => (
                <option key={idx} value={option.name || option}>{option.name || option}</option>
              ))}
            </select>
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium mb-1">CONTRACT SHORT NAME *</label>
            <select id="contractShortName" className="w-full p-2 border border-gray-300 rounded" value={formData.contractShortName} onChange={handleInputChange} required>
              <option value="">Select a Contract</option>
              {contractOptions?.map((option, idx) => (
                <option key={idx} value={option.name || option}>{option.name || option}</option>
              ))}
            </select>
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium mb-1">VENDOR NAME *</label>
            <input id="vendorName" type="text" className="w-full p-2 border border-gray-300 rounded" value={formData.vendorName} onChange={handleInputChange} required />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium mb-1">CHARGE DATE *</label>
            <input id="chargeDate" type="date" className="w-full p-2 border border-gray-300 rounded" value={formData.chargeDate} onChange={handleInputChange} required />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium mb-1">CHARGE AMOUNT *</label>
            <input id="chargeAmount" type="number" step="0.01" className="w-full p-2 border border-gray-300 rounded" value={formData.chargeAmount} onChange={handleInputChange} required />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium mb-1">SUBMITTED DATE *</label>
            <input id="submittedDate" type="date" className="w-full p-2 border border-gray-300 rounded" value={formData.submittedDate} onChange={handleInputChange} required />
          </div>

          {/* PM Email Dropdown */}
          <div className="col-span-1">
            <label className="block text-sm font-medium mb-1">PM EMAIL *</label>
            <select id="pmEmail" className="w-full p-2 border border-gray-300 rounded" value={formData.pmEmail} onChange={handleInputChange} required>
              <option value="">Select PM Email</option>
              {pmEmailOptions.map((email, idx) => (
                <option key={idx} value={email}>{email}</option>
              ))}
            </select>
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium mb-1">PDF FILE PATH *</label>
            <input id="pdfFilePath" type="text" className="w-full p-2 border border-gray-300 rounded" value={formData.pdfFilePath} onChange={handleInputChange} required />
          </div>

          <div className="col-span-full">
            <label className="block text-sm font-medium mb-1">CHARGE CODE *</label>
            <textarea id="chargeCode" rows="2" className="w-full p-2 border border-gray-300 rounded" value={formData.chargeCode} onChange={handleInputChange} required />
          </div>

          {/* Approver Checkbox */}
          <div className="col-span-full flex items-center gap-3 bg-blue-50 p-3 rounded-lg border border-blue-100">
            <input
              type="checkbox"
              id="isApproved"
              className="w-5 h-5 cursor-pointer"
              checked={formData.isApproved}
              onChange={handleInputChange}
            />
            <label htmlFor="isApproved" className="text-sm font-bold text-blue-800 uppercase cursor-pointer">
              Program Manager Approver
            </label>
          </div>

          <div className="col-span-full">
            <label className="block text-sm font-medium mb-1">NOTES</label>
            <textarea id="notes" rows="2" className="w-full p-2 border border-gray-300 rounded" value={formData.notes} onChange={handleInputChange} />
          </div>

          <div className="col-span-full flex justify-end mt-4">
            <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-8 rounded-full" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Entry'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddDataModal;
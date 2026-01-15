import React, { useState, useEffect } from 'react';
import Modal from './Modal.jsx';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/entries`;

const AddSubcontractorModal = ({ onClose, userId, username, onDataAdded }) => {
  const [formData, setFormData] = useState({
    poNo: '',
    subkName: '',
    employeeName: '',
    projectCode: '',
    plc: '',
    submitter: '',
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (username) {
      setFormData((prevData) => ({
        ...prevData,
        submitter: username,
      }));
    }
  }, [username]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
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
        body: JSON.stringify({ ...formData, userId, category: 'subcontractor' }),
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
    <Modal title="Add Subcontractor Assignment" onClose={onClose}>
      <div className="p-6 sm:p-8 bg-white rounded-xl shadow-lg relative">
        {showSuccessMessage && <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-2 rounded-lg z-50">Added Successfully!</div>}
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">PO NO. <span className="text-red-500">*</span></label>
            <input id="poNo" type="text" required className="w-full p-2 border rounded" value={formData.poNo} onChange={handleInputChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">SUBK NAME <span className="text-red-500">*</span></label>
            <input id="subkName" type="text" required className="w-full p-2 border rounded" value={formData.subkName} onChange={handleInputChange} />
          </div>
          <div className="col-span-full">
            <label className="block text-sm font-medium text-gray-700">NEW SUBK EMPLOYEE NAME <span className="text-red-500">*</span></label>
            <input id="employeeName" type="text" required className="w-full p-2 border rounded" value={formData.employeeName} onChange={handleInputChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">PROJECT CODE <span className="text-red-500">*</span></label>
            <input id="projectCode" type="text" required className="w-full p-2 border rounded" value={formData.projectCode} onChange={handleInputChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">PLC <span className="text-red-500">*</span></label>
            <input id="plc" type="text" required className="w-full p-2 border rounded" value={formData.plc} onChange={handleInputChange} />
          </div>
          <div className="col-span-full flex justify-end mt-4">
            <button type="submit" className="bg-blue-600 text-white py-2 px-6 rounded-full" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Assignment'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddSubcontractorModal;
import React, { useState, useEffect } from 'react';
import Modal from './Modal.jsx';

const EditSubcontractorModal = ({ onClose, userId, userRole, entry, onDataEdited }) => {
  const [formData, setFormData] = useState({
    poNo: '',
    subkName: '',
    employeeName: '',
    projectCode: '',
    plc: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form with existing entry data
  useEffect(() => {
    if (entry) {
      setFormData({
        poNo: entry.poNo || '',
        subkName: entry.subkName || '',
        employeeName: entry.employeeName || '',
        projectCode: entry.projectCode || '',
        plc: entry.plc || '',
      });
    }
  }, [entry]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/entries`;
      const response = await fetch(`${API_BASE_URL}/${entry.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userId, adminRole: userRole }),
      });

      if (!response.ok) throw new Error('Failed to update assignment');

      onDataEdited(); // Refresh data in App.jsx
      onClose();      // Close modal
    } catch (error) {
      alert('Error updating assignment: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal title="Edit Subcontractor Assignment" onClose={onClose}>
      <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white rounded-xl">
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">PO No.</label>
          <input 
            id="poNo" 
            type="text" 
            className="w-full p-2 border rounded bg-gray-50" 
            value={formData.poNo} 
            onChange={handleInputChange} 
            required 
          />
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">SubK Name</label>
          <input 
            id="subkName" 
            type="text" 
            className="w-full p-2 border rounded bg-gray-50" 
            value={formData.subkName} 
            onChange={handleInputChange} 
            required 
          />
        </div>
        <div className="col-span-full">
          <label className="block text-sm font-medium text-gray-700">New SubK Employee Name</label>
          <input 
            id="employeeName" 
            type="text" 
            className="w-full p-2 border rounded bg-gray-50" 
            value={formData.employeeName} 
            onChange={handleInputChange} 
            required 
          />
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">Project Code</label>
          <input 
            id="projectCode" 
            type="text" 
            className="w-full p-2 border rounded bg-gray-50" 
            value={formData.projectCode} 
            onChange={handleInputChange} 
            required 
          />
        </div>
        <div className="col-span-1">
          <label className="block text-sm font-medium text-gray-700">PLC</label>
          <input 
            id="plc" 
            type="text" 
            className="w-full p-2 border rounded bg-gray-50" 
            value={formData.plc} 
            onChange={handleInputChange} 
            required 
          />
        </div>
        <div className="col-span-full flex justify-end gap-3 mt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600">Cancel</button>
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg" disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Assignment'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditSubcontractorModal;
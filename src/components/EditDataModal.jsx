
// import React, { useState, useEffect } from 'react';
// import Modal from './Modal.jsx'; // Import the generic Modal component

// // const API_BASE_URL = 'http://localhost:5000/api/entries'; // Your backend API base URL
//  const API_BASE_URL = 'https://rev-lumina.onrender.com/api/entries';

// // Helper to convert snake_case keys to camelCase
// const snakeToCamel = (obj) => {
//   if (Array.isArray(obj)) {
//     return obj.map(v => snakeToCamel(v));
//   } else if (obj !== null && typeof obj === 'object') {
//     return Object.keys(obj).reduce((acc, key) => {
//       const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
//       acc[camelKey] = snakeToCamel(obj[key]);
//       return acc;
//     }, {});
//   }
//   return obj;
// };

// // Helper to format date for display (MM/DD/YYYY)
// const formatDateForDisplay = (isoString) => {
//   if (!isoString) return '';
//   const date = new Date(isoString);
//   if (isNaN(date.getTime())) {
//     console.warn("Invalid date string received:", isoString);
//     return 'Invalid Date';
//   }
//   return date.toLocaleDateString('en-US', {
//     year: 'numeric',
//     month: '2-digit',
//     day: '2-digit',
//   });
// };

// // Helper to format date for input (YYYY-MM-DD)
// const formatDateForInput = (isoString) => {
//   if (!isoString) return '';
//   const date = new Date(isoString);
//   if (isNaN(date.getTime())) {
//     console.warn("Invalid date string for input:", isoString);
//     return '';
//   }
//   return date.toISOString().slice(0, 10); // Returns YYYY-MM-DD
// };

// const EditDataModal = ({ onClose, userId, userRole, username }) => { // Receive userId, userRole, and username
//   const [records, setRecords] = useState([]); // State to store fetched records
//   const [selectedRecord, setSelectedRecord] = useState(null);
//   const [formData, setFormData] = useState({
//     primeKey: '', creditCard: '', contractShortName: '', vendorName: '', chargeDate: '',
//     chargeCode: '', chargeAmount: '', submittedDate: '', submitter: '', notes: '', pdfFilePath: '', // Initialize submitter as empty
//   });
//   const [showSuccessMessage, setShowSuccessMessage] = useState(false);
//   const [showErrorMessage, setShowErrorMessage] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
  
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filteredRecords, setFilteredRecords] = useState([]);

//   const isUpdatedEntry = (primeKey) => primeKey && primeKey.includes('.');

//   // MODIFIED: Fetch records from API on component mount, now includes userId and userRole
//   useEffect(() => {
//     const fetchRecords = async () => {
//       setIsLoading(true);
//       try {
//         // Include userId and userRole in the query parameters for filtering
//         const response = await fetch(`${API_BASE_URL}?userId=${userId}&userRole=${userRole}`);
//         if (!response.ok) {
//           throw new Error('Failed to fetch records');
//         }
//         const data = await response.json();
//         const camelCaseData = snakeToCamel(data);
//         setRecords(camelCaseData);
//       } catch (error) {
//         console.error('Error fetching records:', error);
//         setShowErrorMessage(true);
//         setTimeout(() => setShowErrorMessage(false), 5000);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     if (userId && userRole) { // Only fetch if user info is available
//       fetchRecords();
//     }
//   }, [userId, userRole]); // Re-fetch when userId or userRole changes

//   // useEffect to set the submitter field in formData when a record is selected or username changes
//   useEffect(() => {
//     if (selectedRecord) {
//       setFormData(prev => ({
//         ...prev,
//         submitter: username || selectedRecord.submitter, // Prioritize username if available
//       }));
//     } else if (username) {
//       // If no record is selected, but username is available, set it
//       setFormData(prev => ({
//         ...prev,
//         submitter: username,
//       }));
//     }
//   }, [selectedRecord, username]); // Depend on selectedRecord and username prop

//   // useEffect to filter records based on search query
//   useEffect(() => {
//     const lowercasedQuery = searchQuery.toLowerCase();
//     const filtered = records.filter(record => {
//       return (
//         String(record.primeKey).toLowerCase().includes(lowercasedQuery) ||
//         String(record.contractShortName).toLowerCase().includes(lowercasedQuery) ||
//         String(record.vendorName).toLowerCase().includes(lowercasedQuery) ||
//         String(record.chargeAmount).toLowerCase().includes(lowercasedQuery) ||
//         formatDateForDisplay(record.chargeDate).toLowerCase().includes(lowercasedQuery) ||
//         String(record.submitter).toLowerCase().includes(lowercasedQuery)
//       );
//     });
//     setFilteredRecords(filtered);
//   }, [records, searchQuery]);

//   const handleRecordSelect = (record) => {
//     setSelectedRecord(record);
//     setFormData({
//       ...record,
//       chargeDate: formatDateForInput(record.chargeDate),
//       submittedDate: formatDateForInput(record.submittedDate),
//       pdfFilePath: record.pdfFilePath || '',
//       submitter: username || record.submitter, // Ensure submitter is set here too
//     });
//     setShowSuccessMessage(false);
//     setShowErrorMessage(false);
//   };

//   const handleInputChange = (e) => {
//     const { id, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [id]: value,
//     }));
//   };

//   // MODIFIED: handleSave now includes userId and userRole in the PATCH body
//   const handleSave = async (e) => {
//     e.preventDefault();
//     setShowSuccessMessage(false);
//     setShowErrorMessage(false);
//     setIsLoading(true);

//     if (!selectedRecord) {
//       setShowErrorMessage(true);
//       console.error('No record selected to edit.');
//       setIsLoading(false);
//       return;
//     }

//     try {
//       // Include userId and userRole in the payload for authorization on backend
//       const response = await fetch(`${API_BASE_URL}/${selectedRecord.id}`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           ...formData,
//           submitter: username, // Ensure the submitter sent is the logged-in username
//           userId, // Passed from App.jsx
//           userRole, // Passed from App.jsx
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to save changes');
//       }

//       const result = await response.json();
//       console.log('Updated entry (new version) added successfully:', result);

//       // Re-fetch records to update the table with the new versioned entry
//       const updatedResponse = await fetch(`${API_BASE_URL}?userId=${userId}&userRole=${userRole}`);
//       const updatedData = await updatedResponse.json();
//       const camelCaseUpdatedData = snakeToCamel(updatedData);
//       setRecords(camelCaseUpdatedData);

//       setSelectedRecord(null);
//       setFormData({ // Reset form data, but keep submitter from username
//         primeKey: '', creditCard: '', contractShortName: '', vendorName: '', chargeDate: '',
//         chargeCode: '', chargeAmount: '', submittedDate: '', submitter: username, notes: '', pdfFilePath: '',
//       });

//       setShowSuccessMessage(true);
//       setTimeout(() => {
//         setShowSuccessMessage(false);
//       }, 3000);
//     } catch (error) {
//       console.error('Error saving changes:', error);
//       setShowErrorMessage(true);
//       setTimeout(() => {
//         setShowErrorMessage(false);
//       }, 5000);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Modal title="Edit Existing Entry" onClose={onClose}>
//       <div className="p-6 sm:p-8 bg-white rounded-xl shadow-lg max-h-[90vh] overflow-y-auto">
//         {showSuccessMessage && (
//           <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-fade-in-down">
//             Changes Saved!
//           </div>
//         )}
//         {showErrorMessage && (
//           <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-fade-in-down">
//             Failed to save changes. Please try again.
//           </div>
//         )}

//         <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
//           <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
//             Modify Existing Charge Details
//           </span>
//         </h2>

//         <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
//           <div className="col-span-1">
//             <label htmlFor="primeKey" className="block text-sm font-medium text-gray-700 mb-1">
//               PRIME KEY
//             </label>
//             <input
//               type="text"
//               id="primeKey"
//               className="w-full p-3 border border-gray-600 rounded-lg shadow-sm bg-gray-700 text-gray-300 cursor-not-allowed"
//               value={formData.primeKey}
//               readOnly
//             />
//           </div>
          
//           <div className="col-span-1">
//             <label htmlFor="creditCard" className="block text-sm font-medium text-gray-700 mb-1">
//               CREDIT CARD (If Charged To Card)
//             </label>
//             <select
//               id="creditCard"
//               className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150 ease-in-out bg-gray-800 text-white appearance-none pr-8"
//               value={formData.creditCard}
//               onChange={handleInputChange}
//             >
//               <option value="">Select Card</option>
//               <option value="visa">Visa</option>
//               <option value="mastercard">MasterCard</option>
//               <option value="amex">American Express</option>
//               <option value="no-credit-card">No Credit Card</option>
//             </select>
//           </div>

//           <div className="col-span-1">
//             <label htmlFor="contractShortName" className="block text-sm font-medium text-gray-700 mb-1">
//               CONTRACT SHORT NAME
//             </label>
//             <input
//               type="text"
//               id="contractShortName"
//               placeholder="e.g., ABC Project"
//               className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150 ease-in-out bg-gray-800 text-white placeholder-gray-400"
//               value={formData.contractShortName}
//               onChange={handleInputChange}
//             />
//           </div>

//           <div className="col-span-1">
//             <label htmlFor="vendorName" className="block text-sm font-medium text-gray-700 mb-1">
//               VENDOR NAME
//             </label>
//             <input
//               type="text"
//               id="vendorName"
//               placeholder="e.g., Supplier Inc."
//               className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150 ease-in-out bg-gray-800 text-white placeholder-gray-400"
//               value={formData.vendorName}
//               onChange={handleInputChange}
//             />
//           </div>

//           <div className="col-span-1">
//             <label htmlFor="chargeDate" className="block text-sm font-medium text-gray-700 mb-1">
//               CHARGE DATE
//             </label>
//             <input
//               type="date"
//               id="chargeDate"
//               className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150 ease-in-out bg-gray-800 text-white"
//               value={formData.chargeDate}
//               onChange={handleInputChange}
//             />
//           </div>

//           <div className="col-span-1">
//             <label htmlFor="chargeAmount" className="block text-sm font-medium text-gray-700 mb-1">
//               CHARGE AMOUNT
//             </label>
//             <input
//               type="number"
//               id="chargeAmount"
//               placeholder="e.g., 123.45"
//               step="0.01"
//               className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150 ease-in-out bg-gray-800 text-white placeholder-gray-400"
//               value={formData.chargeAmount}
//               onChange={handleInputChange}
//             />
//           </div>

//           <div className="col-span-1">
//             <label htmlFor="submittedDate" className="block text-sm font-medium text-gray-700 mb-1">
//               SUBMITTED DATE
//             </label>
//             <input
//               type="date"
//               id="submittedDate"
//               className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150 ease-in-out bg-gray-800 text-white"
//               value={formData.submittedDate}
//               onChange={handleInputChange}
//             />
//           </div>

//           <div className="col-span-1">
//             <label htmlFor="submitter" className="block text-sm font-medium text-gray-700 mb-1">
//               SUBMITTER
//             </label>
//             <input // Changed from select to input
//               type="text"
//               id="submitter"
//               className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150 ease-in-out bg-gray-700 text-gray-300 cursor-not-allowed"
//               value={formData.submitter}
//               readOnly // Make it read-only
//               disabled // Disable it to prevent interaction
//             />
//           </div>

//           <div className="col-span-1">
//             <label htmlFor="pdfFilePath" className="block text-sm font-medium text-gray-700 mb-1">
//               PDF FILE PATH 
//             </label>
//             <input
//               type="text"
//               id="pdfFilePath"
//               placeholder="e.g., /docs/report.pdf"
//               className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150 ease-in-out bg-gray-800 text-white placeholder-gray-400"
//               value={formData.pdfFilePath}
//               onChange={handleInputChange}
//             />
//           </div>

//           <div className="col-span-full">
//             <label htmlFor="chargeCode" className="block text-sm font-medium text-gray-700 mb-1">
//               CHARGE CODE 
//             </label>
//             <textarea
//               id="chargeCode"
//               placeholder="Enter charge codes..."
//               rows="3"
//               className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150 ease-in-out resize-y bg-gray-800 text-white placeholder-gray-400"
//               value={formData.chargeCode}
//               onChange={handleInputChange}
//             ></textarea>
//           </div>

//           <div className="col-span-full">
//             <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
//               NOTES
//             </label>
//             <textarea
//               id="notes"
//               placeholder="Add any additional notes here..."
//               rows="3"
//               className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150 ease-in-out resize-y bg-gray-800 text-white placeholder-gray-400"
//               value={formData.notes}
//               onChange={handleInputChange}
//             ></textarea>
//           </div>

//           <div className="col-span-full flex justify-end mt-4">
//             <button
//               type="submit"
//               className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
//               onClick={handleSave}
//               disabled={isLoading}
//             >
//               {isLoading ? 'Saving...' : 'Save Changes'}
//             </button>
//           </div>
//         </form>

//         <h3 className="text-2xl font-bold text-gray-800 mb-4 mt-8 text-center">
//           <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600">
//             Select Record to Modify
//           </span>
//         </h3>
//         {isLoading && <p className="text-center text-gray-600">Loading records...</p>}
        
//         <div className="mb-4">
//           <input
//             type="text"
//             placeholder="Search records..."
//             className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-150 ease-in-out"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>

//         <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200 max-h-48 overflow-y-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-100 sticky top-0 z-10">
//               <tr>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Select
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Prime Key
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Contract Short Name
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Vendor Name
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Charge Amount
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Charge Date
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Submitter
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   PDF
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredRecords.length > 0 ? (
//                 filteredRecords.map((record) => (
//                   <tr
//                     key={record.id}
//                     className={`hover:bg-gray-50 cursor-pointer ${
//                       selectedRecord && selectedRecord.id === record.id ? 'bg-blue-100' : ''
//                     } ${isUpdatedEntry(record.primeKey) ? 'bg-yellow-50' : ''}`}
//                     onClick={() => handleRecordSelect(record)}
//                   >
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       <input
//                         type="radio"
//                         name="selectedRecord"
//                         checked={selectedRecord && selectedRecord.id === record.id}
//                         onChange={() => handleRecordSelect(record)}
//                         className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
//                       />
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {record.primeKey}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {record.contractShortName}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {record.vendorName}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       ${record.chargeAmount ? parseFloat(record.chargeAmount).toFixed(2) : '0.00'}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {formatDateForDisplay(record.chargeDate)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {record.submitter}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {record.pdfFilePath ? (
//                         <a href={record.pdfFilePath} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View PDF</a>
//                       ) : 'N/A'}
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="8" className="px-6 py-4 text-center text-gray-600 italic">
//                     No records found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </Modal>
//   );
// };

// export default EditDataModal;


//LATEST VERSION //

// import React, { useState, useEffect } from 'react';
// import Modal from './Modal.jsx'; // Import the generic Modal component

// // const API_BASE_URL = 'http://localhost:5000/api/entries'; // Your backend API base URL
//  const API_BASE_URL = 'https://rev-lumina.onrender.com/api/entries';

// // Helper to convert snake_case keys to camelCase
// const snakeToCamel = (obj) => {
//   if (Array.isArray(obj)) {
//     return obj.map(v => snakeToCamel(v));
//   } else if (obj !== null && typeof obj === 'object') {
//     return Object.keys(obj).reduce((acc, key) => {
//       const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
//       acc[camelKey] = snakeToCamel(obj[key]);
//       return acc;
//     }, {});
//   }
//   return obj;
// };

// // Helper to format date for display (MM/DD/YYYY)
// const formatDateForDisplay = (isoString) => {
//   if (!isoString) return '';
//   const date = new Date(isoString);
//   if (isNaN(date.getTime())) {
//     console.warn("Invalid date string received:", isoString);
//     return 'Invalid Date';
//   }
//   return date.toLocaleDateString('en-US', {
//     year: 'numeric',
//     month: '2-digit',
//     day: '2-digit',
//   });
// };

// // Helper to format date for input (YYYY-MM-DD)
// const formatDateForInput = (isoString) => {
//   if (!isoString) return '';
//   const date = new Date(isoString);
//   if (isNaN(date.getTime())) {
//     console.warn("Invalid date string for input:", isoString);
//     return '';
//   }
//   return date.toISOString().slice(0, 10); // Returns YYYY-MM-DD
// };

// const EditDataModal = ({ onClose, userId, userRole, username }) => { // Receive userId, userRole, and username
//   const [records, setRecords] = useState([]); // State to store fetched records
//   const [selectedRecord, setSelectedRecord] = useState(null);
//   const [formData, setFormData] = useState({
//     primeKey: '', creditCard: '', contractShortName: '', vendorName: '', chargeDate: '',
//     chargeCode: '', chargeAmount: '', submittedDate: '', submitter: '', notes: '', pdfFilePath: '', // Initialize submitter as empty
//   });
//   const [showSuccessMessage, setShowSuccessMessage] = useState(false);
//   const [showErrorMessage, setShowErrorMessage] = useState(false);
//   const [errorMessage, setErrorMessage] = useState('Failed to save changes. Please try again.'); // State for dynamic error messages
//   const [isLoading, setIsLoading] = useState(false);
//   
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filteredRecords, setFilteredRecords] = useState([]);

//   const isUpdatedEntry = (primeKey) => primeKey && primeKey.includes('.');

//   // MODIFIED: Fetch records from API on component mount, now includes userId and userRole
//   useEffect(() => {
//     const fetchRecords = async () => {
//       setIsLoading(true);
//       try {
//         // Include userId and userRole in the query parameters for filtering
//         const response = await fetch(`${API_BASE_URL}?userId=${userId}&userRole=${userRole}`);
//         if (!response.ok) {
//           throw new Error('Failed to fetch records');
//         }
//         const data = await response.json();
//         const camelCaseData = snakeToCamel(data);
//         setRecords(camelCaseData);
//       } catch (error) {
//         console.error('Error fetching records:', error);
//         setErrorMessage('Failed to fetch records.');
//         setShowErrorMessage(true);
//         setTimeout(() => setShowErrorMessage(false), 5000);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     if (userId && userRole) { // Only fetch if user info is available
//       fetchRecords();
//     }
//   }, [userId, userRole]); // Re-fetch when userId or userRole changes

//   // useEffect to set the submitter field in formData when a record is selected or username changes
//   useEffect(() => {
//     if (selectedRecord) {
//       setFormData(prev => ({
//         ...prev,
//         submitter: username || selectedRecord.submitter, // Prioritize username if available
//       }));
//     } else if (username) {
//       // If no record is selected, but username is available, set it
//       setFormData(prev => ({
//         ...prev,
//         submitter: username,
//       }));
//     }
//   }, [selectedRecord, username]); // Depend on selectedRecord and username prop

//   // useEffect to filter records based on search query
//   useEffect(() => {
//     const lowercasedQuery = searchQuery.toLowerCase();
//     const filtered = records.filter(record => {
//       return (
//         String(record.primeKey).toLowerCase().includes(lowercasedQuery) ||
//         String(record.contractShortName).toLowerCase().includes(lowercasedQuery) ||
//         String(record.vendorName).toLowerCase().includes(lowercasedQuery) ||
//         String(record.chargeAmount).toLowerCase().includes(lowercasedQuery) ||
//         formatDateForDisplay(record.chargeDate).toLowerCase().includes(lowercasedQuery) ||
//         String(record.submitter).toLowerCase().includes(lowercasedQuery)
//       );
//     });
//     setFilteredRecords(filtered);
//   }, [records, searchQuery]);

//   const handleRecordSelect = (record) => {
//     setSelectedRecord(record);
//     setFormData({
//       ...record,
//       chargeDate: formatDateForInput(record.chargeDate),
//       submittedDate: formatDateForInput(record.submittedDate),
//       pdfFilePath: record.pdfFilePath || '',
//       submitter: username || record.submitter, // Ensure submitter is set here too
//     });
//     setShowSuccessMessage(false);
//     setShowErrorMessage(false);
//   };

//   const handleInputChange = (e) => {
//     const { id, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [id]: value,
//     }));
//   };

//   // MODIFIED: handleSave now includes validation
//   const handleSave = async (e) => {
//     e.preventDefault();
//     setShowSuccessMessage(false);
//     setShowErrorMessage(false);

//     // --- Validation for mandatory fields ---
//     const requiredFields = {
//       creditCard: 'Credit Card',
//       contractShortName: 'Contract Short Name',
//       vendorName: 'Vendor Name',
//       chargeDate: 'Charge Date',
//       chargeAmount: 'Charge Amount',
//       submittedDate: 'Submitted Date',
//       chargeCode: 'Charge Code',
//       pdfFilePath: 'PDF File Path',
//     };

//     const emptyFields = Object.keys(requiredFields).filter(
//       (field) => !formData[field] || String(formData[field]).trim() === ''
//     );

//     if (emptyFields.length > 0) {
//       const fieldNames = emptyFields.map(field => requiredFields[field]).join(', ');
//       setErrorMessage(`Please fill out all required fields: ${fieldNames}`);
//       setShowErrorMessage(true);
//       setTimeout(() => setShowErrorMessage(false), 5000);
//       return; // Stop the submission
//     }
//     // --- End Validation ---

//     setIsLoading(true);

//     if (!selectedRecord) {
//       setErrorMessage('No record selected to edit.');
//       setShowErrorMessage(true);
//       console.error('No record selected to edit.');
//       setIsLoading(false);
//       return;
//     }

//     try {
//       // Include userId and userRole in the payload for authorization on backend
//       const response = await fetch(`${API_BASE_URL}/${selectedRecord.id}`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           ...formData,
//           submitter: username, // Ensure the submitter sent is the logged-in username
//           userId, // Passed from App.jsx
//           userRole, // Passed from App.jsx
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to save changes');
//       }

//       const result = await response.json();
//       console.log('Updated entry (new version) added successfully:', result);

//       // Re-fetch records to update the table with the new versioned entry
//       const updatedResponse = await fetch(`${API_BASE_URL}?userId=${userId}&userRole=${userRole}`);
//       const updatedData = await updatedResponse.json();
//       const camelCaseUpdatedData = snakeToCamel(updatedData);
//       setRecords(camelCaseUpdatedData);

//       setSelectedRecord(null);
//       setFormData({ // Reset form data, but keep submitter from username
//         primeKey: '', creditCard: '', contractShortName: '', vendorName: '', chargeDate: '',
//         chargeCode: '', chargeAmount: '', submittedDate: '', submitter: username, notes: '', pdfFilePath: '',
//       });

//       setShowSuccessMessage(true);
//       setTimeout(() => {
//         setShowSuccessMessage(false);
//       }, 3000);
//     } catch (error) {
//       console.error('Error saving changes:', error);
//       setErrorMessage(error.message || 'Failed to save changes. Please try again.');
//       setShowErrorMessage(true);
//       setTimeout(() => {
//         setShowErrorMessage(false);
//       }, 5000);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Modal title="Edit Existing Entry" onClose={onClose}>
//       <div className="p-6 sm:p-8 bg-white rounded-xl shadow-lg max-h-[90vh] overflow-y-auto">
//         {showSuccessMessage && (
//           <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-fade-in-down">
//             Changes Saved!
//           </div>
//         )}
//         {showErrorMessage && (
//           <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-fade-in-down">
//             {errorMessage}
//           </div>
//         )}

//         <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
//           <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
//             Modify Existing Charge Details
//           </span>
//         </h2>

//         <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
//           <div className="col-span-1">
//             <label htmlFor="primeKey" className="block text-sm font-medium text-gray-700 mb-1">
//               PRIME KEY
//             </label>
//             <input
//               type="text"
//               id="primeKey"
//               className="w-full p-3 border border-gray-600 rounded-lg shadow-sm bg-gray-700 text-gray-300 cursor-not-allowed"
//               value={formData.primeKey}
//               readOnly
//             />
//           </div>
//           
//           <div className="col-span-1">
//             <label htmlFor="creditCard" className="block text-sm font-medium text-gray-700 mb-1">
//               CREDIT CARD (If Charged To Card) <span className="text-red-500">*</span>
//             </label>
//             <select
//               id="creditCard"
//               className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150 ease-in-out bg-gray-800 text-white appearance-none pr-8"
//               value={formData.creditCard}
//               onChange={handleInputChange}
//             >
//               <option value="">Select Card</option>
//               <option value="visa">Visa</option>
//               <option value="mastercard">MasterCard</option>
//               <option value="amex">American Express</option>
//               <option value="no-credit-card">No Credit Card</option>
//             </select>
//           </div>

//           <div className="col-span-1">
//             <label htmlFor="contractShortName" className="block text-sm font-medium text-gray-700 mb-1">
//               CONTRACT SHORT NAME <span className="text-red-500">*</span>
//             </label>
//             <select
// //               type="text"
// //               id="contractShortName"
// //               placeholder="e.g., ABC Project"
// //               className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150 ease-in-out bg-gray-800 text-white placeholder-gray-400"
// //               value={formData.contractShortName}
// //               onChange={handleInputChange}

//               id="contractShortName"
//               className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150 ease-in-out bg-gray-800 text-white appearance-none pr-8"
//               value={formData.contractShortName}
//               onChange={handleInputChange}
//               required
//             >
//               <option value="">Select a Contract</option>
//               <option value="NIA ADSP -1001.003">NIA ADSP -1001.003</option>
//               <option value="PCP- 1002.15">PCP- 1002.15</option>
//               <option value="INNOVATION LAB – 1002.17">INNOVATION LAB – 1002.17</option>
//               <option value="ASGCR -1002.09">ASGCR -1002.09</option>
//               <option value="IMOD – 1006.01">IMOD – 1006.01</option>
//               <option value="UPENN -2000.00006">UPENN -2000.00006</option>
//               <option value="OVERHEAD">OVERHEAD - OVER</option>
//             </select>
//           </div>

//           <div className="col-span-1">
//             <label htmlFor="vendorName" className="block text-sm font-medium text-gray-700 mb-1">
//               VENDOR NAME <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               id="vendorName"
//               placeholder="e.g., Supplier Inc."
//               className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150 ease-in-out bg-gray-800 text-white placeholder-gray-400"
//               value={formData.vendorName}
//               onChange={handleInputChange}
//             />
//           </div>

//           <div className="col-span-1">
//             <label htmlFor="chargeDate" className="block text-sm font-medium text-gray-700 mb-1">
//               CHARGE DATE <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="date"
//               id="chargeDate"
//               className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150 ease-in-out bg-gray-800 text-white"
//               value={formData.chargeDate}
//               onChange={handleInputChange}
//             />
//           </div>

//           <div className="col-span-1">
//             <label htmlFor="chargeAmount" className="block text-sm font-medium text-gray-700 mb-1">
//               CHARGE AMOUNT <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="number"
//               id="chargeAmount"
//               placeholder="e.g., 123.45"
//               step="0.01"
//               className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150 ease-in-out bg-gray-800 text-white placeholder-gray-400"
//               value={formData.chargeAmount}
//               onChange={handleInputChange}
//             />
//           </div>

//           <div className="col-span-1">
//             <label htmlFor="submittedDate" className="block text-sm font-medium text-gray-700 mb-1">
//               SUBMITTED DATE <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="date"
//               id="submittedDate"
//               className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150 ease-in-out bg-gray-800 text-white"
//               value={formData.submittedDate}
//               onChange={handleInputChange}
//             />
//           </div>

//           <div className="col-span-1">
//             <label htmlFor="submitter" className="block text-sm font-medium text-gray-700 mb-1">
//               SUBMITTER
//             </label>
//             <input // Changed from select to input
//               type="text"
//               id="submitter"
//               className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150 ease-in-out bg-gray-700 text-gray-300 cursor-not-allowed"
//               value={formData.submitter}
//               readOnly // Make it read-only
//               disabled // Disable it to prevent interaction
//             />
//           </div>

//           <div className="col-span-1">
//             <label htmlFor="pdfFilePath" className="block text-sm font-medium text-gray-700 mb-1">
//               PDF FILE PATH <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               id="pdfFilePath"
//               placeholder="e.g., /docs/report.pdf"
//               className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150 ease-in-out bg-gray-800 text-white placeholder-gray-400"
//               value={formData.pdfFilePath}
//               onChange={handleInputChange}
//             />
//           </div>

//           <div className="col-span-full">
//             <label htmlFor="chargeCode" className="block text-sm font-medium text-gray-700 mb-1">
//               CHARGE CODE <span className="text-red-500">*</span>
//             </label>
//             <textarea
//               id="chargeCode"
//               placeholder="Enter charge codes..."
//               rows="3"
//               className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150 ease-in-out resize-y bg-gray-800 text-white placeholder-gray-400"
//               value={formData.chargeCode}
//               onChange={handleInputChange}
//             ></textarea>
//           </div>

//           <div className="col-span-full">
//             <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
//               NOTES
//             </label>
//             <textarea
//               id="notes"
//               placeholder="Add any additional notes here..."
//               rows="3"
//               className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150 ease-in-out resize-y bg-gray-800 text-white placeholder-gray-400"
//               value={formData.notes}
//               onChange={handleInputChange}
//             ></textarea>
//           </div>

//           <div className="col-span-full flex justify-end mt-4">
//             <button
//               type="submit"
//               className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
//               onClick={handleSave}
//               disabled={isLoading}
//             >
//               {isLoading ? 'Saving...' : 'Save Changes'}
//             </button>
//           </div>
//         </form>

//         <h3 className="text-2xl font-bold text-gray-800 mb-4 mt-8 text-center">
//           <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600">
//             Select Record to Modify
//           </span>
//         </h3>
//         {isLoading && <p className="text-center text-gray-600">Loading records...</p>}
//         
//         <div className="mb-4">
//           <input
//             type="text"
//             placeholder="Search records..."
//             className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-150 ease-in-out"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>

//         <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200 max-h-48 overflow-y-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-100 sticky top-0 z-10">
//               <tr>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Select
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Prime Key
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Contract Short Name
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Vendor Name
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Charge Amount
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               _ Charge Date
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Submitter
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   PDF
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredRecords.length > 0 ? (
//                 filteredRecords.map((record) => (
//                   <tr
//                     key={record.id}
//                     className={`hover:bg-gray-50 cursor-pointer ${
//                       selectedRecord && selectedRecord.id === record.id ? 'bg-blue-100' : ''
//                     } ${isUpdatedEntry(record.primeKey) ? 'bg-yellow-50' : ''}`}
//                     onClick={() => handleRecordSelect(record)}
//                   >
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       <input
//                         type="radio"
//                         name="selectedRecord"
//                         checked={selectedRecord && selectedRecord.id === record.id}
//                         onChange={() => handleRecordSelect(record)}
//                         className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
//                       />
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {record.primeKey}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {record.contractShortName}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {record.vendorName}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       ${record.chargeAmount ? parseFloat(record.chargeAmount).toFixed(2) : '0.00'}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {formatDateForDisplay(record.chargeDate)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {record.submitter}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {record.pdfFilePath ? (
//                         <a href={record.pdfFilePath} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View PDF</a>
//                       ) : 'N/A'}
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="8" className="px-6 py-4 text-center text-gray-600 italic">
//                     No records found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </Modal>
//   );
// };

// export default EditDataModal;

// LATEST VERSION //


//Deployed version below //
// import React, { useState, useEffect } from 'react';
// import Modal from './Modal.jsx';

// const API_BASE_URL = 'https://rev-lumina.onrender.com/api/entries';

// // Helper to convert snake_case keys to camelCase
// const snakeToCamel = (obj) => {
//   if (Array.isArray(obj)) {
//     return obj.map(v => snakeToCamel(v));
//   } else if (obj !== null && typeof obj === 'object') {
//     return Object.keys(obj).reduce((acc, key) => {
//       const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
//       acc[camelKey] = snakeToCamel(obj[key]);
//       return acc;
//     }, {});
//   }
//   return obj;
// };

// // Helper to format date for display (MM/DD/YYYY)
// const formatDateForDisplay = (isoString) => {
//   if (!isoString) return '';
//   const date = new Date(isoString);
//   if (isNaN(date.getTime())) {
//     return 'Invalid Date';
//   }
//   return date.toLocaleDateString('en-US', {
//     year: 'numeric',
//     month: '2-digit',
//     day: '2-digit',
//   });
// };

// // Helper to format date for input (YYYY-MM-DD)
// const formatDateForInput = (isoString) => {
//   if (!isoString) return '';
//   const date = new Date(isoString);
//   if (isNaN(date.getTime())) {
//     return '';
//   }
//   return date.toISOString().slice(0, 10);
// };

// const EditDataModal = ({ onClose, userId, userRole, username, contractOptions, creditCardOptions }) => {
//   const [records, setRecords] = useState([]);
//   const [selectedRecord, setSelectedRecord] = useState(null);
//   const [formData, setFormData] = useState({
//     primeKey: '', creditCard: '', contractShortName: '', vendorName: '', chargeDate: '',
//     chargeCode: '', chargeAmount: '', submittedDate: '', submitter: '', notes: '', pdfFilePath: '',
//   });
//   const [showSuccessMessage, setShowSuccessMessage] = useState(false);
//   const [showErrorMessage, setShowErrorMessage] = useState(false);
//   const [errorMessage, setErrorMessage] = useState('Failed to save changes. Please try again.');
//   const [isLoading, setIsLoading] = useState(false);
  
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filteredRecords, setFilteredRecords] = useState([]);

//   const isUpdatedEntry = (primeKey) => primeKey && primeKey.includes('.');

//   useEffect(() => {
//     const fetchRecords = async () => {
//       setIsLoading(true);
//       try {
//         const response = await fetch(`${API_BASE_URL}?userId=${userId}&userRole=${userRole}`);
//         if (!response.ok) {
//           throw new Error('Failed to fetch records');
//         }
//         const data = await response.json();
//         const camelCaseData = snakeToCamel(data);
//         setRecords(camelCaseData);
//       } catch (error) {
//         console.error('Error fetching records:', error);
//         setErrorMessage('Failed to fetch records.');
//         setShowErrorMessage(true);
//         setTimeout(() => setShowErrorMessage(false), 5000);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     if (userId && userRole) {
//       fetchRecords();
//     }
//   }, [userId, userRole]);

//   useEffect(() => {
//     if (selectedRecord) {
//       setFormData(prev => ({ ...prev, submitter: username || selectedRecord.submitter }));
//     } else if (username) {
//       setFormData(prev => ({ ...prev, submitter: username }));
//     }
//   }, [selectedRecord, username]);

//   useEffect(() => {
//     const lowercasedQuery = searchQuery.toLowerCase();
//     const filtered = records.filter(record =>
//       Object.values(record).some(value =>
//         String(value).toLowerCase().includes(lowercasedQuery)
//       )
//     );
//     setFilteredRecords(filtered);
//   }, [records, searchQuery]);

//   const handleRecordSelect = (record) => {
//     setSelectedRecord(record);
//     setFormData({
//       ...record,
//       chargeDate: formatDateForInput(record.chargeDate),
//       submittedDate: formatDateForInput(record.submittedDate),
//       pdfFilePath: record.pdfFilePath || '',
//       submitter: username || record.submitter,
//     });
//     setShowSuccessMessage(false);
//     setShowErrorMessage(false);
//   };

//   const handleInputChange = (e) => {
//     const { id, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [id]: value,
//     }));
//   };

//     const handleSave = async (e) => {
//     e.preventDefault();
//     setShowSuccessMessage(false);
//     setShowErrorMessage(false);

//     // --- Validation for mandatory fields ---
//     const requiredFields = {
//       creditCard: 'Credit Card',
//       contractShortName: 'Contract Short Name',
//       vendorName: 'Vendor Name',
//       chargeDate: 'Charge Date',
//       chargeAmount: 'Charge Amount',
//       submittedDate: 'Submitted Date',
//       chargeCode: 'Charge Code',
//       pdfFilePath: 'PDF File Path',
//     };

//     const emptyFields = Object.keys(requiredFields).filter(
//       (field) => !formData[field] || String(formData[field]).trim() === ''
//     );

//     if (emptyFields.length > 0) {
//       const fieldNames = emptyFields.map(field => requiredFields[field]).join(', ');
//       setErrorMessage(`Please fill out all required fields: ${fieldNames}`);
//       setShowErrorMessage(true);
//       setTimeout(() => setShowErrorMessage(false), 5000);
//       return; // Stop the submission
//     }
//     // --- End Validation ---

//     setIsLoading(true);

//     if (!selectedRecord) {
//       setErrorMessage('No record selected to edit.');
//       setShowErrorMessage(true);
//       setIsLoading(false);
//       return;
//     }

//     try {
//       const response = await fetch(`${API_BASE_URL}/${selectedRecord.id}`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           ...formData,
//           submitter: username,
//           userId,
//           userRole,
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to save changes');
//       }

//       const updatedResponse = await fetch(`${API_BASE_URL}?userId=${userId}&userRole=${userRole}`);
//       const updatedData = await updatedResponse.json();
//       const camelCaseUpdatedData = snakeToCamel(updatedData);
//       setRecords(camelCaseUpdatedData);

//       setSelectedRecord(null);
//       setFormData({
//         primeKey: '', creditCard: '', contractShortName: '', vendorName: '', chargeDate: '',
//         chargeCode: '', chargeAmount: '', submittedDate: '', submitter: username, notes: '', pdfFilePath: '',
//       });

//       setShowSuccessMessage(true);
//       setTimeout(() => {
//         setShowSuccessMessage(false);
//       }, 3000);
//     } catch (error) {
//       console.error('Error saving changes:', error);
//       setErrorMessage(error.message || 'Failed to save changes. Please try again.');
//       setShowErrorMessage(true);
//       setTimeout(() => {
//         setShowErrorMessage(false);
//       }, 5000);
//     } finally {
//       setIsLoading(false);
//     }
//   };


//   return (
//     <Modal title="Edit Existing Entry" onClose={onClose}>
//       <div className="p-6 sm:p-8 bg-white rounded-xl shadow-lg max-h-[90vh] overflow-y-auto">
//         {showSuccessMessage && (
//           <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-xl z-50">
//             Changes Saved!
//           </div>
//         )}
//         {showErrorMessage && (
//           <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-xl z-50">
//             {errorMessage}
//           </div>
//         )}

//         <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
//           <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
//             Modify Existing Charge Details
//           </span>
//         </h2>

//         <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
//           <div className="col-span-1">
//             <label htmlFor="primeKey" className="block text-sm font-medium text-gray-700 mb-1">
//               PRIME KEY
//             </label>
//             <input
//               type="text"
//               id="primeKey"
//               className="w-full p-3 border border-gray-600 rounded-lg bg-gray-200 text-gray-500 cursor-not-allowed"
//               value={formData.primeKey}
//               readOnly
//             />
//           </div>
          
//           <div className="col-span-1">
//             <label htmlFor="creditCard" className="block text-sm font-medium text-gray-700 mb-1">
//               CREDIT CARD (If Charged To Card) <span className="text-red-500">*</span>
//             </label>
//             <select
//               id="creditCard"
//               className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//               value={formData.creditCard}
//               onChange={handleInputChange}
//             >
//               <option value="">Select Card</option>
//               {creditCardOptions.map(option => (
//                 <option key={option.id} value={option.name}>{option.name}</option>
//               ))}
//             </select>
//           </div>

//           <div className="col-span-1">
//             <label htmlFor="contractShortName" className="block text-sm font-medium text-gray-700 mb-1">
//               CONTRACT SHORT NAME <span className="text-red-500">*</span>
//             </label>
//             <select
//               id="contractShortName"
//               className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//               value={formData.contractShortName}
//               onChange={handleInputChange}
//               required
//             >
//               <option value="">Select a Contract</option>
//               {contractOptions.map(option => (
//                 <option key={option.id} value={option.name}>{option.name}</option>
//               ))}
//             </select>
//           </div>
        
//           <div className="col-span-1">
//             <label htmlFor="vendorName" className="block text-sm font-medium text-gray-700 mb-1">
//               VENDOR NAME <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               id="vendorName"
//               placeholder="e.g., Supplier Inc."
//               className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//               value={formData.vendorName}
//               onChange={handleInputChange}
//             />
//           </div>

//           <div className="col-span-1">
//             <label htmlFor="chargeDate" className="block text-sm font-medium text-gray-700 mb-1">
//               CHARGE DATE <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="date"
//               id="chargeDate"
//               className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//               value={formData.chargeDate}
//               onChange={handleInputChange}
//             />
//           </div>

//           <div className="col-span-1">
//             <label htmlFor="chargeAmount" className="block text-sm font-medium text-gray-700 mb-1">
//               CHARGE AMOUNT <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="number"
//               id="chargeAmount"
//               placeholder="e.g., 123.45"
//               step="0.01"
//               className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//               value={formData.chargeAmount}
//               onChange={handleInputChange}
//             />
//           </div>

//           <div className="col-span-1">
//             <label htmlFor="submittedDate" className="block text-sm font-medium text-gray-700 mb-1">
//               SUBMITTED DATE <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="date"
//               id="submittedDate"
//               className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//               value={formData.submittedDate}
//               onChange={handleInputChange}
//             />
//           </div>

//           <div className="col-span-1">
//             <label htmlFor="submitter" className="block text-sm font-medium text-gray-700 mb-1">
//               SUBMITTER
//             </label>
//             <input
//               type="text"
//               id="submitter"
//               className="w-full p-3 border border-gray-600 rounded-lg shadow-sm bg-gray-200 text-gray-500 cursor-not-allowed"
//               value={formData.submitter}
//               readOnly
//               disabled
//             />
//           </div>

//           <div className="col-span-1">
//             <label htmlFor="pdfFilePath" className="block text-sm font-medium text-gray-700 mb-1">
//               PDF FILE PATH <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               id="pdfFilePath"
//               placeholder="e.g., /docs/report.pdf"
//               className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//               value={formData.pdfFilePath}
//               onChange={handleInputChange}
//             />
//           </div>

//           <div className="col-span-full">
//             <label htmlFor="chargeCode" className="block text-sm font-medium text-gray-700 mb-1">
//               CHARGE CODE <span className="text-red-500">*</span>
//             </label>
//             <textarea
//               id="chargeCode"
//               placeholder="Enter charge codes..."
//               rows="3"
//               className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//               value={formData.chargeCode}
//               onChange={handleInputChange}
//             ></textarea>
//           </div>

//           <div className="col-span-full">
//             <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
//               NOTES
//             </label>
//             <textarea
//               id="notes"
//               placeholder="Add any additional notes here..."
//               rows="3"
//               className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//               value={formData.notes}
//               onChange={handleInputChange}
//             ></textarea>
//           </div>

//           <div className="col-span-full flex justify-end mt-4">
//             <button
//               type="submit"
//               className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg"
//               onClick={handleSave}
//               disabled={isLoading}
//             >
//               {isLoading ? 'Saving...' : 'Save Changes'}
//             </button>
//           </div>
//         </form>

//         <h3 className="text-2xl font-bold text-gray-800 mb-4 mt-8 text-center">
//           <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600">
//             Select Record to Modify
//           </span>
//         </h3>
//         {isLoading && <p className="text-center text-gray-600">Loading records...</p>}
        
//         <div className="mb-4">
//           <input
//             type="text"
//             placeholder="Search records..."
//             className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>

//         <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200 max-h-48 overflow-y-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-100 sticky top-0 z-10">
//               <tr>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Select</th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prime Key</th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contract Short Name</th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor Name</th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Charge Amount</th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Charge Date</th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitter</th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PDF</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredRecords.length > 0 ? (
//                 filteredRecords.map((record) => (
//                   <tr
//                     key={record.id}
//                     className={`hover:bg-gray-50 cursor-pointer ${
//                       selectedRecord && selectedRecord.id === record.id ? 'bg-blue-100' : ''
//                     } ${isUpdatedEntry(record.primeKey) ? 'bg-yellow-50' : ''}`}
//                     onClick={() => handleRecordSelect(record)}
//                   >
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       <input
//                         type="radio"
//                         name="selectedRecord"
//                         checked={selectedRecord && selectedRecord.id === record.id}
//                         onChange={() => handleRecordSelect(record)}
//                         className="form-radio h-4 w-4 text-blue-600"
//                       />
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.primeKey}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.contractShortName}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.vendorName}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${record.chargeAmount ? parseFloat(record.chargeAmount).toFixed(2) : '0.00'}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDateForDisplay(record.chargeDate)}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.submitter}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {record.pdfFilePath ? (
//                         <a href={record.pdfFilePath} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View PDF</a>
//                       ) : 'N/A'}
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="8" className="px-6 py-4 text-center text-gray-600 italic">
//                     No records found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </Modal>
//   );
// };

// export default EditDataModal;


//Deployed version below //


// import React, { useState, useEffect, useMemo } from 'react';
// import Modal from './Modal.jsx';

// const API_BASE_URL = 'https://rev-lumina.onrender.com/api/entries';

// // Helper to convert snake_case keys to camelCase
// // DELETE your old snakeToCamel function and REPLACE it with this one.

// const snakeToCamel = (obj) => {
//   if (Array.isArray(obj)) {
//     return obj.map(v => snakeToCamel(v));
//   } else if (obj !== null && typeof obj === 'object') {
//     return Object.keys(obj).reduce((acc, key) => {
//       // This is a more robust regex for the conversion
//       const camelKey = key.replace(/([-_][a-z])/ig, ($1) => {
//         return $1.toUpperCase().replace('-', '').replace('_', '');
//       });
//       acc[camelKey] = snakeToCamel(obj[key]);
//       return acc;
//     }, {});
//   }
//   return obj;
// };

// // Helper to format date for display (MM/DD/YYYY)
// const formatDateForDisplay = (isoString) => {
//   if (!isoString) return '';
//   const date = new Date(isoString);
//   if (isNaN(date.getTime())) {
//     return 'Invalid Date';
//   }
//   return date.toLocaleDateString('en-US', {
//     year: 'numeric',
//     month: '2-digit',
//     day: '2-digit',
//   });
// };

// // Helper to format date for input (YYYY-MM-DD)
// const formatDateForInput = (isoString) => {
//   if (!isoString) return '';
//   const date = new Date(isoString);
//   if (isNaN(date.getTime())) {
//     return '';
//   }
//   return date.toISOString().slice(0, 10);
// };

// const EditDataModal = ({ onClose, userId, userRole, username, contractOptions, creditCardOptions }) => {
  
//   // Helper to find the latest version for each prime key base
//   const getLatestVersions = (records) => {
//     const latest = {};
//     records.forEach(record => {
//       const key = String(record.primeKey);
//       if (key.includes('.')) {
//         const parts = key.split('.');
//         const major = parseInt(parts[0], 10);
//         const minor = parseInt(parts[1], 10);

//         if (isFinite(major) && isFinite(minor)) {
//           if (!latest[major] || minor > latest[major]) {
//             latest[major] = minor;
//           }
//         }
//       }
//     });
//     return latest;
//   };

//   const [records, setRecords] = useState([]);
//   const [selectedRecord, setSelectedRecord] = useState(null);
//   const [formData, setFormData] = useState({
//     primeKey: '', creditCard: '', contractShortName: '', vendorName: '', chargeDate: '',
//     chargeCode: '', chargeAmount: '', submittedDate: '', submitter: '', notes: '', pdfFilePath: '',
//   });
//   const [showSuccessMessage, setShowSuccessMessage] = useState(false);
//   const [showErrorMessage, setShowErrorMessage] = useState(false);
//   const [errorMessage, setErrorMessage] = useState('Failed to save changes. Please try again.');
//   const [isLoading, setIsLoading] = useState(false);
  
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filteredRecords, setFilteredRecords] = useState([]);

//   // Calculate the latest version for each group of records
//   const latestVersions = useMemo(() => getLatestVersions(records), [records]);

//   const isUpdatedEntry = (primeKey) => primeKey && String(primeKey).includes('.');

//   useEffect(() => {
//     const fetchRecords = async () => {
//       setIsLoading(true);
//       try {
//         const response = await fetch(`${API_BASE_URL}?userId=${userId}&userRole=${userRole}`);
//         if (!response.ok) throw new Error('Failed to fetch records');
//         const data = await response.json();
//         const camelCaseData = snakeToCamel(data);
//         setRecords(camelCaseData);
//       } catch (error) {
//         console.error('Error fetching records:', error);
//         setErrorMessage('Failed to fetch records.');
//         setShowErrorMessage(true);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     if (userId && userRole) fetchRecords();
//   }, [userId, userRole]);

//   useEffect(() => {
//     if (selectedRecord) {
//       setFormData(prev => ({ ...prev, submitter: username || selectedRecord.submitter }));
//     } else if (username) {
//       setFormData(prev => ({ ...prev, submitter: username }));
//     }
//   }, [selectedRecord, username]);
  
//   // Search filters the original, full list of records
//   useEffect(() => {
//     const lowercasedQuery = searchQuery.toLowerCase();
//     const filtered = records.filter(record =>
//       Object.values(record).some(value =>
//         String(value).toLowerCase().includes(lowercasedQuery)
//       )
//     );
//     setFilteredRecords(filtered);
//   }, [records, searchQuery]);

//   // handleRecordSelect now checks if the record is the latest before proceeding
//   const handleRecordSelect = (record) => {
//     const key = String(record.primeKey);
//     const parts = key.split('.');
//     const major = parseInt(parts[0], 10);
//     let isLatest = true;

//     if (isFinite(major)) {
//         const isVersioned = key.includes('.') && parts.length > 1;
//         const latestMinor = latestVersions[major];

//         if (latestMinor !== undefined) { // A versioned record exists for this group
//             if (isVersioned) {
//                 const minor = parseInt(parts[1], 10);
//                 if (!isFinite(minor) || minor < latestMinor) isLatest = false;
//             } else {
//                 isLatest = false; // It's a base record, but a newer version exists
//             }
//         }
        
//         if (!isLatest) {
//             setErrorMessage(`Cannot edit an older record. The latest version is ${major}.${latestMinor}.`);
//             setShowErrorMessage(true);
//             setTimeout(() => setShowErrorMessage(false), 5000);
//             return; // Stop the selection
//         }
//     }

//     setSelectedRecord(record);
//     setFormData({
//       ...record,
//       chargeDate: formatDateForInput(record.chargeDate),
//       submittedDate: formatDateForInput(record.submittedDate),
//       pdfFilePath: record.pdfFilePath || '',
//       submitter: username || record.submitter,
//     });
//     setShowSuccessMessage(false);
//     setShowErrorMessage(false);
//   };

//   const handleInputChange = (e) => {
//     const { id, value } = e.target;
//     setFormData((prevData) => ({ ...prevData, [id]: value }));
//   };

//   const handleSave = async (e) => {
//     e.preventDefault();
//     setShowSuccessMessage(false);
//     setShowErrorMessage(false);

//     // --- (Validation logic remains the same) ---
//     const requiredFields = {
//       creditCard: 'Credit Card', contractShortName: 'Contract Short Name', vendorName: 'Vendor Name',
//       chargeDate: 'Charge Date', chargeAmount: 'Charge Amount', submittedDate: 'Submitted Date',
//       chargeCode: 'Charge Code', pdfFilePath: 'PDF File Path',
//     };
//     const emptyFields = Object.keys(requiredFields).filter(
//       (field) => !formData[field] || String(formData[field]).trim() === ''
//     );
//     if (emptyFields.length > 0) {
//       const fieldNames = emptyFields.map(field => requiredFields[field]).join(', ');
//       setErrorMessage(`Please fill out all required fields: ${fieldNames}`);
//       setShowErrorMessage(true);
//       return;
//     }
    
//     setIsLoading(true);
//     if (!selectedRecord) {
//       setErrorMessage('No record selected to create a new version from.');
//       setShowErrorMessage(true);
//       setIsLoading(false);
//       return;
//     }

//     // --- NEW VERSIONING LOGIC STARTS HERE ---

//     // 1. Calculate the next version number for the primeKey
//     const basePrimeKey = String(selectedRecord.primeKey).split('.')[0];
//     const relatedRecords = records.filter(r => String(r.primeKey).startsWith(basePrimeKey));
    
//     let maxMinorVersion = 0;
//     relatedRecords.forEach(r => {
//       const parts = String(r.primeKey).split('.');
//       if (parts.length > 1) {
//         const minorVersion = parseInt(parts[1], 10);
//         if (isFinite(minorVersion) && minorVersion > maxMinorVersion) {
//           maxMinorVersion = minorVersion;
//         }
//       }
//     });

//     const newMinorVersion = maxMinorVersion + 1;
//     const newPrimeKey = `${basePrimeKey}.${newMinorVersion}`;

//     // 2. Prepare the payload for the new record
//     //    We use the form data, set the new primeKey, and REMOVE the old id.
//     const { id, ...newRecordData } = formData; // <-- Important: remove the 'id'
//     const payload = {
//         ...newRecordData,
//         primeKey: newPrimeKey,
//         submitter: username,
//         userId,
//         userRole
//     };
    
//     // --- NEW VERSIONING LOGIC ENDS HERE ---

//     try {
//       // 3. Change the method to POST and update the URL
//       const response = await fetch(`${API_BASE_URL}/${selectedRecord.id}`, {
//     method: 'PATCH',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ ...formData, submitter: username, userId, userRole }),
// });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to create new version');
//       }

//       // --- (Success handling remains the same) ---
//       const updatedResponse = await fetch(`${API_BASE_URL}?userId=${userId}&userRole=${userRole}`);
//       const updatedData = await updatedResponse.json();
//       setRecords(snakeToCamel(updatedData));

//       setSelectedRecord(null);
//       setFormData({
//         primeKey: '', creditCard: '', contractShortName: '', vendorName: '', chargeDate: '',
//         chargeCode: '', chargeAmount: '', submittedDate: '', submitter: username, notes: '', pdfFilePath: '',
//       });

//       // Update success message for clarity
//       setShowSuccessMessage(true);
//       // You can make the success message more specific
//       // setSuccessMessage(`Successfully created version ${newPrimeKey}!`);
//       setTimeout(() => setShowSuccessMessage(false), 3000);

//     } catch (error) {
//       console.error('Error creating new version:', error);
//       setErrorMessage(error.message || 'Failed to save new version. Please try again.');
//       setShowErrorMessage(true);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Modal title="Edit Existing Entry" onClose={onClose}>
//       {showSuccessMessage && (
//         <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-xl z-50">
//           Changes Saved!
//         </div>
//       )}
//       {showErrorMessage && (
//         <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-xl z-50">
//           {errorMessage}
//         </div>
//       )}

//       <div className="p-6 sm:p-8 bg-white rounded-xl shadow-lg max-h-[90vh] overflow-y-auto">
//         <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
//           <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
//             Modify Existing Charge Details
//           </span>
//         </h2>

//         <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
//             {/* Form inputs remain the same */}
//             <div className="col-span-1"><label htmlFor="primeKey" className="block text-sm font-medium text-gray-700 mb-1">PRIME KEY</label><input type="text" id="primeKey" className="w-full p-3 border border-gray-600 rounded-lg bg-gray-200 text-gray-500 cursor-not-allowed" value={formData.primeKey} readOnly/></div>
//             <div className="col-span-1"><label htmlFor="creditCard" className="block text-sm font-medium text-gray-700 mb-1">CREDIT CARD <span className="text-red-500">*</span></label><select id="creditCard" className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400" value={formData.creditCard} onChange={handleInputChange}><option value="">Select Card</option>{creditCardOptions.map(option => (<option key={option.id} value={option.name}>{option.name}</option>))}</select></div>
//             <div className="col-span-1"><label htmlFor="contractShortName" className="block text-sm font-medium text-gray-700 mb-1">CONTRACT SHORT NAME <span className="text-red-500">*</span></label><select id="contractShortName" className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400" value={formData.contractShortName} onChange={handleInputChange} required><option value="">Select a Contract</option>{contractOptions.map(option => (<option key={option.id} value={option.name}>{option.name}</option>))}</select></div>
//             <div className="col-span-1"><label htmlFor="vendorName" className="block text-sm font-medium text-gray-700 mb-1">VENDOR NAME <span className="text-red-500">*</span></label><input type="text" id="vendorName" placeholder="e.g., Supplier Inc." className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400" value={formData.vendorName} onChange={handleInputChange}/></div>
//             <div className="col-span-1"><label htmlFor="chargeDate" className="block text-sm font-medium text-gray-700 mb-1">CHARGE DATE <span className="text-red-500">*</span></label><input type="date" id="chargeDate" className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400" value={formData.chargeDate} onChange={handleInputChange}/></div>
//             <div className="col-span-1"><label htmlFor="chargeAmount" className="block text-sm font-medium text-gray-700 mb-1">CHARGE AMOUNT <span className="text-red-500">*</span></label><input type="number" id="chargeAmount" placeholder="e.g., 123.45" step="0.01" className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400" value={formData.chargeAmount} onChange={handleInputChange}/></div>
//             <div className="col-span-1"><label htmlFor="submittedDate" className="block text-sm font-medium text-gray-700 mb-1">SUBMITTED DATE <span className="text-red-500">*</span></label><input type="date" id="submittedDate" className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400" value={formData.submittedDate} onChange={handleInputChange}/></div>
//             <div className="col-span-1"><label htmlFor="submitter" className="block text-sm font-medium text-gray-700 mb-1">SUBMITTER</label><input type="text" id="submitter" className="w-full p-3 border border-gray-600 rounded-lg shadow-sm bg-gray-200 text-gray-500 cursor-not-allowed" value={formData.submitter} readOnly disabled/></div>
//             <div className="col-span-1"><label htmlFor="pdfFilePath" className="block text-sm font-medium text-gray-700 mb-1">PDF FILE PATH <span className="text-red-500">*</span></label><input type="text" id="pdfFilePath" placeholder="e.g., /docs/report.pdf" className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400" value={formData.pdfFilePath} onChange={handleInputChange}/></div>
//             <div className="col-span-full"><label htmlFor="chargeCode" className="block text-sm font-medium text-gray-700 mb-1">CHARGE CODE <span className="text-red-500">*</span></label><textarea id="chargeCode" placeholder="Enter charge codes..." rows="3" className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400" value={formData.chargeCode} onChange={handleInputChange}></textarea></div>
//             <div className="col-span-full"><label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">NOTES</label><textarea id="notes" placeholder="Add any additional notes here..." rows="3" className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400" value={formData.notes} onChange={handleInputChange}></textarea></div>
//             <div className="col-span-full flex justify-end mt-4"><button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg" onClick={handleSave} disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Changes'}</button></div>
//         </form>

//         <h3 className="text-2xl font-bold text-gray-800 mb-4 mt-8 text-center">
//           <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600">
//             Select Record to Modify
//           </span>
//         </h3>
//         {isLoading && <p className="text-center text-gray-600">Loading records...</p>}
        
//         <div className="mb-4">
//           <input type="text" placeholder="Search records..." className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
//         </div>

//         <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200 max-h-48 overflow-y-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-100 sticky top-0 z-10">
//               <tr>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Select</th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prime Key</th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contract Short Name</th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor Name</th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Charge Amount</th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Charge Date</th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitter</th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PDF</th>
//                 {/* --- STATUS COLUMN REMOVED --- */}
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredRecords.length > 0 ? (
//                 filteredRecords.map((record) => {
//                   const key = String(record.primeKey);
//                   const parts = key.split('.');
//                   const major = parseInt(parts[0], 10);
//                   let isEditable = true;
//                   let tooltipMessage = '';

//                   if (isFinite(major)) {
//                       const isVersioned = key.includes('.') && parts.length > 1;
//                       const latestMinor = latestVersions[major];
//                       if (latestMinor !== undefined) {
//                           if(isVersioned) {
//                               const minor = parseInt(parts[1], 10);
//                               if (!isFinite(minor) || minor < latestMinor) isEditable = false;
//                           } else {
//                               isEditable = false;
//                           }
//                           if (!isEditable) {
//                               tooltipMessage = `Cannot edit: Version ${major}.${latestMinor} is the latest.`;
//                           }
//                       }
//                   }

//                   return (
//                     <tr
//                       key={record.id}
//                       className={`
//                         ${isEditable ? 'hover:bg-gray-50 cursor-pointer' : 'bg-gray-100 opacity-60 cursor-not-allowed'}
//                         ${selectedRecord && selectedRecord.id === record.id ? 'bg-blue-100' : ''}
//                         ${isUpdatedEntry(record.primeKey) ? 'bg-yellow-50' : ''}
//                       `}
//                       onClick={() => isEditable && handleRecordSelect(record)}
//                       // --- TOOLTIP ADDED HERE ---
//                       title={tooltipMessage}
//                     >
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                         <input type="radio" name="selectedRecord"
//                           checked={selectedRecord && selectedRecord.id === record.id}
//                           onChange={() => isEditable && handleRecordSelect(record)}
//                           disabled={!isEditable}
//                           className="form-radio h-4 w-4 text-blue-600 disabled:bg-gray-400"
//                         />
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.primeKey}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.contractShortName}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.vendorName}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${record.chargeAmount ? parseFloat(record.chargeAmount).toFixed(2) : '0.00'}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDateForDisplay(record.chargeDate)}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.submitter}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {record.pdfFilePath ? (
//                           <a href={record.pdfFilePath} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View PDF</a>
//                         ) : 'N/A'}
//                       </td>
//                     </tr>
//                   );
//                 })
//               ) : (
//                 <tr>
//                   {/* --- COLSPAN UPDATED --- */}
//                   <td colSpan="8" className="px-6 py-4 text-center text-gray-600 italic">
//                     No records found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </Modal>
//   );
// };

// export default EditDataModal;


import React, { useState, useEffect, useMemo } from 'react';
import Modal from './Modal.jsx';

// const API_BASE_URL = 'https://rev-lumina.onrender.com/api/entries'; 
// const API_BASE_URL = 'http://localhost:5000/api/entries'; 
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/entries`;

// Helper to convert snake_case keys to camelCase
const snakeToCamel = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(v => snakeToCamel(v));
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = key.replace(/([-_][a-z])/ig, ($1) => {
        return $1.toUpperCase().replace('-', '').replace('_', '');
      });
      acc[camelKey] = snakeToCamel(obj[key]);
      return acc;
    }, {});
  }
  return obj;
};

// Helper to format date for display (MM/DD/YYYY)
const formatDateForDisplay = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

// Helper to format date for input (YYYY-MM-DD)
const formatDateForInput = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) {
    return '';
  }
  return date.toISOString().slice(0, 10);
};

const EditDataModal = ({ onClose, userId, userRole, username, contractOptions, creditCardOptions }) => {
  
  // Helper to find the latest version for each prime key base
  const getLatestVersions = (records) => {
    const latest = {};
    records.forEach(record => {
      const key = String(record.primeKey);
      if (key.includes('.')) {
        const parts = key.split('.');
        const major = parseInt(parts[0], 10);
        const minor = parseInt(parts[1], 10);

        if (isFinite(major) && isFinite(minor)) {
          if (!latest[major] || minor > latest[major]) {
            latest[major] = minor;
          }
        }
      }
    });
    return latest;
  };

  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  
  // FIX 1: Initialize all form fields to prevent uncontrolled component warnings.
  const [formData, setFormData] = useState({
    primeKey: '',
    creditCard: '',
    contractShortName: '',
    vendorName: '',
    chargeDate: '',
    chargeCode: '',
    chargeAmount: '',
    submittedDate: '',
    submitter: '',
    notes: '',
    pdfFilePath: '',
  });

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Failed to save changes. Please try again.');
  const [isLoading, setIsLoading] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRecords, setFilteredRecords] = useState([]);

  const latestVersions = useMemo(() => getLatestVersions(records), [records]);

  const isUpdatedEntry = (primeKey) => primeKey && String(primeKey).includes('.');

  useEffect(() => {
    const fetchRecords = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}?userId=${userId}&userRole=${userRole}`);
        if (!response.ok) throw new Error('Failed to fetch records');
        const data = await response.json();
        const camelCaseData = snakeToCamel(data);
        setRecords(camelCaseData);
      } catch (error) {
        console.error('Error fetching records:', error);
        setErrorMessage('Failed to fetch records.');
        setShowErrorMessage(true);
      } finally {
        setIsLoading(false);
      }
    };
    if (userId && userRole) fetchRecords();
  }, [userId, userRole]);

  useEffect(() => {
    if (selectedRecord) {
      setFormData(prev => ({ ...prev, submitter: username || selectedRecord.submitter }));
    } else if (username) {
      setFormData(prev => ({ ...prev, submitter: username }));
    }
  }, [selectedRecord, username]);
  
  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = records.filter(record =>
      Object.values(record).some(value =>
        String(value).toLowerCase().includes(lowercasedQuery)
      )
    );
    setFilteredRecords(filtered);
  }, [records, searchQuery]);

  // FIX 2: Safely populate form data to ensure no undefined values.
  const handleRecordSelect = (record) => {
    const key = String(record.primeKey);
    const parts = key.split('.');
    const major = parseInt(parts[0], 10);
    let isLatest = true;

    if (isFinite(major)) {
        const isVersioned = key.includes('.') && parts.length > 1;
        const latestMinor = latestVersions[major];

        if (latestMinor !== undefined) {
            if (isVersioned) {
                const minor = parseInt(parts[1], 10);
                if (!isFinite(minor) || minor < latestMinor) isLatest = false;
            } else {
                isLatest = false;
            }
        }
        
        if (!isLatest) {
            setErrorMessage(`Cannot edit an older record. The latest version is ${major}.${latestMinor}.`);
            setShowErrorMessage(true);
            setTimeout(() => setShowErrorMessage(false), 5000);
            return;
        }
    }

    setSelectedRecord(record);
    setFormData({
      primeKey: record.primeKey || '',
      creditCard: record.creditCard || '',
      contractShortName: record.contractShortName || '',
      vendorName: record.vendorName || '',
      chargeDate: formatDateForInput(record.chargeDate),
      chargeCode: record.chargeCode || '',
      chargeAmount: record.chargeAmount || '',
      submittedDate: formatDateForInput(record.submittedDate),
      submitter: username || record.submitter || '',
      notes: record.notes || '',
      pdfFilePath: record.pdfFilePath || '',
    });
    setShowSuccessMessage(false);
    setShowErrorMessage(false);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setShowSuccessMessage(false);
    setShowErrorMessage(false);

    const requiredFields = {
      creditCard: 'Credit Card', contractShortName: 'Contract Short Name', vendorName: 'Vendor Name',
      chargeDate: 'Charge Date', chargeAmount: 'Charge Amount', submittedDate: 'Submitted Date',
      chargeCode: 'Charge Code', pdfFilePath: 'PDF File Path',
    };

    const emptyFields = Object.keys(requiredFields).filter(
      (field) => !formData[field] || String(formData[field]).trim() === ''
    );

    if (emptyFields.length > 0) {
      const fieldNames = emptyFields.map(field => requiredFields[field]).join(', ');
      setErrorMessage(`Please fill out all required fields: ${fieldNames}`);
      setShowErrorMessage(true);
      return;
    }

    setIsLoading(true);
    if (!selectedRecord) {
      setErrorMessage('No record selected to edit.');
      setShowErrorMessage(true);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${selectedRecord.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, submitter: username, userId, userRole }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save changes');
      }

      const updatedResponse = await fetch(`${API_BASE_URL}?userId=${userId}&userRole=${userRole}`);
      const updatedData = await updatedResponse.json();
      setRecords(snakeToCamel(updatedData));
onDataEdited();
      setSelectedRecord(null);
      setFormData({
        primeKey: '', creditCard: '', contractShortName: '', vendorName: '', chargeDate: '',
        chargeCode: '', chargeAmount: '', submittedDate: '', submitter: username, notes: '', pdfFilePath: '',
      });

      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error('Error creating new version:', error);
      setErrorMessage(error.message || 'Failed to save changes. Please try again.');
      setShowErrorMessage(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal title="Edit Existing Entry" onClose={onClose}>
      {showSuccessMessage && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-xl z-50">
          Changes Saved!
        </div>
      )}
      {showErrorMessage && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-xl z-50">
          {errorMessage}
        </div>
      )}

      <div className="p-6 sm:p-8 bg-white rounded-xl shadow-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            Modify Existing Charge Details
          </span>
        </h2>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
          <div className="col-span-1"><label htmlFor="primeKey" className="block text-sm font-medium text-gray-700 mb-1">PRIME KEY</label><input type="text" id="primeKey" className="w-full p-3 border border-gray-600 rounded-lg bg-gray-200 text-gray-500 cursor-not-allowed" value={formData.primeKey} readOnly/></div>
          <div className="col-span-1"><label htmlFor="creditCard" className="block text-sm font-medium text-gray-700 mb-1">CREDIT CARD <span className="text-red-500">*</span></label><select id="creditCard" className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400" value={formData.creditCard} onChange={handleInputChange}><option value="">Select Card</option>{creditCardOptions.map(option => (<option key={option.id} value={option.name}>{option.name}</option>))}</select></div>
          <div className="col-span-1"><label htmlFor="contractShortName" className="block text-sm font-medium text-gray-700 mb-1">CONTRACT SHORT NAME <span className="text-red-500">*</span></label><select id="contractShortName" className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400" value={formData.contractShortName} onChange={handleInputChange} required><option value="">Select a Contract</option>{contractOptions.map(option => (<option key={option.id} value={option.name}>{option.name}</option>))}</select></div>
          <div className="col-span-1"><label htmlFor="vendorName" className="block text-sm font-medium text-gray-700 mb-1">VENDOR NAME <span className="text-red-500">*</span></label><input type="text" id="vendorName" placeholder="e.g., Supplier Inc." className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400" value={formData.vendorName} onChange={handleInputChange}/></div>
          <div className="col-span-1"><label htmlFor="chargeDate" className="block text-sm font-medium text-gray-700 mb-1">CHARGE DATE <span className="text-red-500">*</span></label><input type="date" id="chargeDate" className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400" value={formData.chargeDate} onChange={handleInputChange}/></div>
          <div className="col-span-1"><label htmlFor="chargeAmount" className="block text-sm font-medium text-gray-700 mb-1">CHARGE AMOUNT <span className="text-red-500">*</span></label><input type="number" id="chargeAmount" placeholder="e.g., 123.45" step="0.01" className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400" value={formData.chargeAmount} onChange={handleInputChange}/></div>
          <div className="col-span-1"><label htmlFor="submittedDate" className="block text-sm font-medium text-gray-700 mb-1">SUBMITTED DATE <span className="text-red-500">*</span></label><input type="date" id="submittedDate" className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400" value={formData.submittedDate} onChange={handleInputChange}/></div>
          <div className="col-span-1"><label htmlFor="submitter" className="block text-sm font-medium text-gray-700 mb-1">SUBMITTER</label><input type="text" id="submitter" className="w-full p-3 border border-gray-600 rounded-lg shadow-sm bg-gray-200 text-gray-500 cursor-not-allowed" value={formData.submitter} readOnly disabled/></div>
          <div className="col-span-1"><label htmlFor="pdfFilePath" className="block text-sm font-medium text-gray-700 mb-1">PDF FILE PATH <span className="text-red-500">*</span></label><input type="text" id="pdfFilePath" placeholder="e.g., /docs/report.pdf" className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400" value={formData.pdfFilePath} onChange={handleInputChange}/></div>
          <div className="col-span-full"><label htmlFor="chargeCode" className="block text-sm font-medium text-gray-700 mb-1">CHARGE CODE <span className="text-red-500">*</span></label><textarea id="chargeCode" placeholder="Enter charge codes..." rows="3" className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400" value={formData.chargeCode} onChange={handleInputChange}></textarea></div>
          <div className="col-span-full"><label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">NOTES</label><textarea id="notes" placeholder="Add any additional notes here..." rows="3" className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400" value={formData.notes} onChange={handleInputChange}></textarea></div>
          <div className="col-span-full flex justify-end mt-4"><button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg" onClick={handleSave} disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Changes'}</button></div>
        </form>

        <h3 className="text-2xl font-bold text-gray-800 mb-4 mt-8 text-center">
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600">
            Select Record to Modify
          </span>
        </h3>
        {isLoading && <p className="text-center text-gray-600">Loading records...</p>}
        
        <div className="mb-4">
          <input type="text" placeholder="Search records..." className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>

        <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200 max-h-48 overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Select</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prime Key</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contract Short Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Charge Amount</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Charge Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitter</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PDF</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => {
                  const key = String(record.primeKey);
                  const parts = key.split('.');
                  const major = parseInt(parts[0], 10);
                  let isEditable = true;
                  let tooltipMessage = '';

                  if (isFinite(major)) {
                      const isVersioned = key.includes('.') && parts.length > 1;
                      const latestMinor = latestVersions[major];
                      if (latestMinor !== undefined) {
                          if(isVersioned) {
                              const minor = parseInt(parts[1], 10);
                              if (!isFinite(minor) || minor < latestMinor) isEditable = false;
                          } else {
                              isEditable = false;
                          }
                          if (!isEditable) {
                              tooltipMessage = `Cannot edit: Version ${major}.${latestMinor} is the latest.`;
                          }
                      }
                  }

                  return (
                    <tr
                      key={record.id}
                      className={`
                        ${isEditable ? 'hover:bg-gray-50 cursor-pointer' : 'bg-gray-100 opacity-60 cursor-not-allowed'}
                        ${selectedRecord && selectedRecord.id === record.id ? 'bg-blue-100' : ''}
                        ${isUpdatedEntry(record.primeKey) ? 'bg-yellow-50' : ''}
                      `}
                      onClick={() => isEditable && handleRecordSelect(record)}
                      title={tooltipMessage}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <input type="radio" name="selectedRecord"
                          checked={selectedRecord && selectedRecord.id === record.id}
                          onChange={() => isEditable && handleRecordSelect(record)}
                          disabled={!isEditable}
                          className="form-radio h-4 w-4 text-blue-600 disabled:bg-gray-400"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.primeKey}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.contractShortName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.vendorName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${record.chargeAmount ? parseFloat(record.chargeAmount).toFixed(2) : '0.00'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDateForDisplay(record.chargeDate)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.submitter}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.pdfFilePath ? (
                          <a href={record.pdfFilePath} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View PDF</a>
                        ) : 'N/A'}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-600 italic">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
};

export default EditDataModal;
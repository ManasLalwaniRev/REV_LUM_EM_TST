    
// import React, { useState, useEffect } from 'react'; // Import useEffect
// import Modal from './Modal.jsx'; // Import the generic Modal component

// // const API_BASE_URL = 'http://localhost:5000/api/entries'; // Your backend API base URL
//  const API_BASE_URL = 'https://rev-lumina.onrender.com/api/entries';


// const AddDataModal = ({ onClose, userId, username }) => { // Receive userId and username
//   const [formData, setFormData] = useState({
//     creditCard: '',
//     contractShortName: '',
//     vendorName: '',
//     chargeDate: '',
//     chargeAmount: '',
//     submittedDate: '',
//     submitter: '', // Initialize as empty, will be set by useEffect
//     chargeCode: '',
//     notes: '',
//     pdfFilePath: '',
//   });
//   const [showSuccessMessage, setShowSuccessMessage] = useState(false);
//   const [showErrorMessage, setShowErrorMessage] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   // Use useEffect to set the submitter field when the username prop changes
//   useEffect(() => {
//     if (username) {
//       setFormData((prevData) => ({
//         ...prevData,
//         submitter: username, // Set submitter to the logged-in username
//       }));
//     }
//   }, [username]); // Depend on username prop

//   const handleInputChange = (e) => {
//     const { id, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [id]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setShowSuccessMessage(false);
//     setShowErrorMessage(false);
//     setIsLoading(true);

//     try {
//       const response = await fetch(`${API_BASE_URL}/new`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ ...formData, userId }), // Include userId in the payload
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to add entry');
//       }

//       const result = await response.json();
//       console.log('New entry added successfully:', result);

//       setShowSuccessMessage(true);
//       setTimeout(() => {
//         setShowSuccessMessage(false);
//         onClose(); // Close modal on success
//       }, 3000);
      
//       // Optionally, reset form data here, but keep submitter from username
//       setFormData((prevData) => ({
//         creditCard: '', contractShortName: '', vendorName: '', chargeDate: '',
//         chargeAmount: '', submittedDate: '', submitter: prevData.submitter, chargeCode: '', notes: '', pdfFilePath: '',
//       }));

//     } catch (error) {
//       console.error('Error adding new entry:', error);
//       setShowErrorMessage(true);
//       setTimeout(() => {
//         setShowErrorMessage(false);
//       }, 5000);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Modal title="Add New Entry" onClose={onClose}>
//       <div className="p-6 sm:p-8 bg-white rounded-xl shadow-lg max-h-[90vh] overflow-y-auto relative">
//         {showSuccessMessage && (
//           <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-fade-in-down">
//             Entry Added Successfully!
//           </div>
//         )}
//         {showErrorMessage && (
//           <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-fade-in-down">
//             Failed to add entry. Please try again.
//           </div>
//         )}

//         <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
//           <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
//             Enter New Charge Details
//           </span>
//         </h2>

//         <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
//           <div className="col-span-1">
//             <label htmlFor="creditCard" className="block text-sm font-medium text-gray-700 mb-1">
//               CREDIT CARD (If Charged To Card)
//             </label>
//             <select
//               id="creditCard"
//               className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150 ease-in-out bg-gray-800 text-white appearance-none pr-8"
//               value={formData.creditCard}
//               onChange={handleInputChange}
//               required // Added required attribute
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
//               required // Added required attribute
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
//               required // Added required attribute
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
//               required // Added required attribute
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
//               required // Added required attribute
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
//               required // Added required attribute
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
//               required // Added required attribute
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
//               // Not required
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
//               required // Added required attribute
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
//               // Not required
//             ></textarea>
//           </div>

//           <div className="col-span-full flex justify-end mt-4">
//             <button
//               type="submit"
//               className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
//               disabled={isLoading}
//             >
//               {isLoading ? 'Adding...' : 'Add Entry'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </Modal>
//   );
// };

// export default AddDataModal;

// import React, { useState, useEffect } from 'react';
// import Modal from './Modal.jsx';

// // const API_BASE_URL = 'http://localhost:5000/api/entries'; // Your backend API base URL
//  const API_BASE_URL = 'https://rev-lumina.onrender.com/api/entries';


// const AddDataModal = ({ onClose, userId, username }) => {
//   const [formData, setFormData] = useState({
//     creditCard: '',
//     contractShortName: '',
//     vendorName: '',
//     chargeDate: '',
//     chargeAmount: '',
//     submittedDate: '',
//     submitter: '',
//     chargeCode: '',
//     notes: '',
//     pdfFilePath: '',
//   });
//   const [showSuccessMessage, setShowSuccessMessage] = useState(false);
//   const [showErrorMessage, setShowErrorMessage] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   // Use useEffect to set the submitter field when the username prop changes
//   useEffect(() => {
//     if (username) {
//       setFormData((prevData) => ({
//         ...prevData,
//         submitter: username,
//       }));
//     }
//   }, [username]);

//   const handleInputChange = (e) => {
//     const { id, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [id]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setShowSuccessMessage(false);
//     setShowErrorMessage(false);
//     setIsLoading(true);

//     try {
//       const response = await fetch(`${API_BASE_URL}/new`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ ...formData, userId }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to add entry');
//       }

//       const result = await response.json();
//       console.log('New entry added successfully:', result);

//       setShowSuccessMessage(true);
//       setTimeout(() => {
//         setShowSuccessMessage(false);
//         onClose();
//       }, 3000);
      
//       setFormData((prevData) => ({
//         creditCard: '', contractShortName: '', vendorName: '', chargeDate: '',
//         chargeAmount: '', submittedDate: '', submitter: prevData.submitter, chargeCode: '', notes: '', pdfFilePath: '',
//       }));

//     } catch (error) {
//       console.error('Error adding new entry:', error);
//       setShowErrorMessage(true);
//       setTimeout(() => {
//         setShowErrorMessage(false);
//       }, 5000);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Modal title="Add New Entry" onClose={onClose}>
//       <div className="p-6 sm:p-8 bg-white rounded-xl shadow-lg max-h-[90vh] overflow-y-auto relative">
//         {showSuccessMessage && (
//           <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-fade-in-down">
//             Entry Added Successfully!
//           </div>
//         )}
//         {showErrorMessage && (
//           <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-fade-in-down">
//             Failed to add entry. Please try again.
//           </div>
//         )}

//         <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
//           <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
//             Enter New Charge Details
//           </span>
//         </h2>

//         <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
//           <div className="col-span-1">
//             <label htmlFor="creditCard" className="block text-sm font-medium text-gray-700 mb-1">
//               CREDIT CARD (If Charged To Card)
//             </label>
//             <select
//               id="creditCard"
//               className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150 ease-in-out bg-gray-800 text-white appearance-none pr-8"
//               value={formData.creditCard}
//               onChange={handleInputChange}
//               required
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
//             <select
//               id="contractShortName"
//               className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150 ease-in-out bg-gray-800 text-white appearance-none pr-8"
//               value={formData.contractShortName}
//               onChange={handleInputChange}
//               required
//             >
//               <option value="">Select a Contract</option>
//               <option value="NIA ADSP -1001.003">NIA ADSP -1001.003</option>
//               <option value="PCP- 1002.15">PCP- 1002.15</option>
//               <option value="Innovation Lab – 1002.17">Innovation Lab – 1002.17</option>
//               <option value="ASGCR -1002.09">ASGCR -1002.09</option>
//               <option value="IMOD – 1006.01">IMOD – 1006.01</option>
//               <option value="UPENN -2000.00006">UPENN -2000.00006</option>
//             </select>
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
//               required
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
//               required
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
//               required
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
//               required
//             />
//           </div>

//           <div className="col-span-1">
//             <label htmlFor="submitter" className="block text-sm font-medium text-gray-700 mb-1">
//               SUBMITTER
//             </label>
//             <input
//               type="text"
//               id="submitter"
//               className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150 ease-in-out bg-gray-700 text-gray-300 cursor-not-allowed"
//               value={formData.submitter}
//               readOnly
//               disabled
//               required
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
//               required 
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
//               required
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
//               disabled={isLoading}
//             >
//               {isLoading ? 'Adding...' : 'Add Entry'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </Modal>
//   );
// };

// export default AddDataModal;


// import React, { useState, useEffect } from 'react';
// import Modal from './Modal.jsx';

// // THIS IS THE FIX: Pointing to your local backend server
// const API_BASE_URL = 'https://rev-lumina.onrender.com/api/entries';

// const AddDataModal = ({ onClose, userId, username }) => {
//   const [formData, setFormData] = useState({
//     creditCard: '',
//     contractShortName: '',
//     vendorName: '',
//     chargeDate: '',
//     chargeAmount: '',
//     submittedDate: '',
//     submitter: '',
//     chargeCode: '',
//     notes: '',
//     pdfFilePath: '',
//   });
//   const [showSuccessMessage, setShowSuccessMessage] = useState(false);
//   const [showErrorMessage, setShowErrorMessage] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     if (username) {
//       setFormData((prevData) => ({
//         ...prevData,
//         submitter: username,
//       }));
//     }
//   }, [username]);

//   const handleInputChange = (e) => {
//     const { id, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [id]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setShowSuccessMessage(false);
//     setShowErrorMessage(false);
//     setIsLoading(true);

//     try {
//       const response = await fetch(`${API_BASE_URL}/new`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ ...formData, userId }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to add entry');
//       }

//       const result = await response.json();
//       console.log('New entry added successfully:', result);

//       setShowSuccessMessage(true);
//       setTimeout(() => {
//         setShowSuccessMessage(false);
//         onClose();
//       }, 3000);
      
//       setFormData((prevData) => ({
//         creditCard: '', contractShortName: '', vendorName: '', chargeDate: '',
//         chargeAmount: '', submittedDate: '', submitter: prevData.submitter, chargeCode: '', notes: '', pdfFilePath: '',
//       }));

//     } catch (error) {
//       console.error('Error adding new entry:', error);
//       setShowErrorMessage(true);
//       setTimeout(() => {
//         setShowErrorMessage(false);
//       }, 5000);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Modal title="Add New Entry" onClose={onClose}>
//       <div className="p-6 sm:p-8 bg-white rounded-xl shadow-lg max-h-[90vh] overflow-y-auto relative">
//         {showSuccessMessage && (
//           <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-fade-in-down">
//             Entry Added Successfully!
//           </div>
//         )}
//         {showErrorMessage && (
//           <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-fade-in-down">
//             Failed to add entry. Please try again.
//           </div>
//         )}

//         <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
//           <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
//             Enter New Charge Details
//           </span>
//         </h2>

//         <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
//           <div className="col-span-1">
//             <label htmlFor="creditCard" className="block text-sm font-medium text-gray-700 mb-1">
//               CREDIT CARD (If Charged To Card)
//             </label>
//             <select
//               id="creditCard"
//               className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150 ease-in-out bg-gray-800 text-white appearance-none pr-8"
//               value={formData.creditCard}
//               onChange={handleInputChange}
//               required
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
//             <select
//               id="contractShortName"
//               className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150 ease-in-out bg-gray-800 text-white appearance-none pr-8"
//               value={formData.contractShortName}
//               onChange={handleInputChange}
//               required
//             >
//               <option value="">Select a Contract</option>
//               <option value="NIA ADSP -1001.003">NIA ADSP -1001.003</option>
//               <option value="PCP- 1002.15">PCP- 1002.15</option>
//               <option value="Innovation Lab – 1002.17">Innovation Lab – 1002.17</option>
//               <option value="ASGCR -1002.09">ASGCR -1002.09</option>
//               <option value="IMOD – 1006.01">IMOD – 1006.01</option>
//               <option value="UPENN -2000.00006">UPENN -2000.00006</option>
//             </select>
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
//               required
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
//               required
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
//               required
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
//               required
//             />
//           </div>

//           <div className="col-span-1">
//             <label htmlFor="submitter" className="block text-sm font-medium text-gray-700 mb-1">
//               SUBMITTER
//             </label>
//             <input
//               type="text"
//               id="submitter"
//               className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150 ease-in-out bg-gray-700 text-gray-300 cursor-not-allowed"
//               value={formData.submitter}
//               readOnly
//               disabled
//               required
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
//               required
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
//               required
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
//               disabled={isLoading}
//             >
//               {isLoading ? 'Adding...' : 'Add Entry'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </Modal>
//   );
// };

// export default AddDataModal;


//LATEST VERSION // 

// import React, { useState, useEffect } from 'react';
// import Modal from './Modal.jsx';

// // THIS IS THE FIX: Pointing to your local backend server
// const API_BASE_URL = 'https://rev-lumina.onrender.com/api/entries';

// const AddDataModal = ({ onClose, userId, username }) => {
//   const [formData, setFormData] = useState({
//     creditCard: '',
//     contractShortName: '',
//     vendorName: '',
//     chargeDate: '',
//     chargeAmount: '',
//     submittedDate: '',
//     submitter: '',
//     chargeCode: '',
//     notes: '',
//     pdfFilePath: '',
//   });
//   const [showSuccessMessage, setShowSuccessMessage] = useState(false);
//   const [showErrorMessage, setShowErrorMessage] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     if (username) {
//       setFormData((prevData) => ({
//         ...prevData,
//         submitter: username,
//       }));
//     }
//   }, [username]);

//   const handleInputChange = (e) => {
//     const { id, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [id]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setShowSuccessMessage(false);
//     setShowErrorMessage(false);
//     setIsLoading(true);

//     try {
//       const response = await fetch(`${API_BASE_URL}/new`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ ...formData, userId }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to add entry');
//       }

//       const result = await response.json();
//       console.log('New entry added successfully:', result);

//       setShowSuccessMessage(true);
//       setTimeout(() => {
//         setShowSuccessMessage(false);
//         onClose();
//       }, 3000);
//       
//       setFormData((prevData) => ({
//         creditCard: '', contractShortName: '', vendorName: '', chargeDate: '',
//         chargeAmount: '', submittedDate: '', submitter: prevData.submitter, chargeCode: '', notes: '', pdfFilePath: '',
//       }));

//     } catch (error) {
//       console.error('Error adding new entry:', error);
//       setShowErrorMessage(true);
//       setTimeout(() => {
//         setShowErrorMessage(false);
//       }, 5000);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Modal title="Add New Entry" onClose={onClose}>
//       <div className="p-6 sm:p-8 bg-white rounded-xl shadow-lg max-h-[90vh] overflow-y-auto relative">
//         {showSuccessMessage && (
//           <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-fade-in-down">
//             Entry Added Successfully!
//           </div>
//         )}
//         {showErrorMessage && (
//           <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-fade-in-down">
//             Failed to add entry. Please try again.
//           </div>
//         )}

//         <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
//           <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
//             Enter New Charge Details
//           </span>
//         </h2>

//         <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
//           <div className="col-span-1">
//             <label htmlFor="creditCard" className="block text-sm font-medium text-gray-700 mb-1">
//               CREDIT CARD (If Charged To Card) <span className="text-red-500">*</span>
//             </label>
//             <select
//               id="creditCard"
//               className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150 ease-in-out bg-gray-800 text-white appearance-none pr-8"
//               value={formData.creditCard}
//               onChange={handleInputChange}
//               required
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
//               required
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
//               required
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
//               required
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
//               required
//             />
//           </div>

//           <div className="col-span-1">
//             <label htmlFor="submitter" className="block text-sm font-medium text-gray-700 mb-1">
//               SUBMITTER
//             </label>
//             <input
//               type="text"
//               id="submitter"
//               className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150 ease-in-out bg-gray-700 text-gray-300 cursor-not-allowed"
//               value={formData.submitter}
//               readOnly
//               disabled
//               required
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
//               required
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
//               required
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
//               disabled={isLoading}
//             >
//               {isLoading ? 'Adding...' : 'Add Entry'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </Modal>
//   );
// };

// export default AddDataModal;

// LATEST VERSION ENDS  //

import React, { useState, useEffect } from 'react';
import Modal from './Modal.jsx';

// const API_BASE_URL = 'https://rev-lumina.onrender.com/api/entries'; 
// const API_BASE_URL = 'http://localhost:5000/api/entries'; 
// const API_BASE_URL = \${import.meta.env.VITE_API_BASE_URL}/entries`;
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/entries`;

// const AddDataModal = ({ onClose, userId, username, contractOptions, creditCardOptions }) => {
  const AddDataModal = ({ onClose, userId, username, contractOptions, creditCardOptions, onDataAdded }) => {
  const [formData, setFormData] = useState({
    creditCard: '',
    contractShortName: '',
    vendorName: '',
    chargeDate: '',
    chargeAmount: '',
    submittedDate: '',
    submitter: '',
    chargeCode: '',
    notes: '',
    pdfFilePath: '',
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add entry');
      }

      setShowSuccessMessage(true);
      onDataAdded(); // Tell App.jsx to re-fetch all data

      setTimeout(() => {
        setShowSuccessMessage(false);
        onClose(); // Close modal
      }, 3000);
      setTimeout(() => {
        setShowSuccessMessage(false);
        onClose();
      }, 3000);
      
      setFormData((prevData) => ({
        creditCard: '', contractShortName: '', vendorName: '', chargeDate: '',
        chargeAmount: '', submittedDate: '', submitter: prevData.submitter, chargeCode: '', notes: '', pdfFilePath: '',
      }));

    } catch (error) {
      console.error('Error adding new entry:', error);
      setShowErrorMessage(true);
      setTimeout(() => {
        setShowErrorMessage(false);
      }, 5000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal title="Add New Entry" onClose={onClose}>
      <div className="p-6 sm:p-8 bg-white rounded-xl shadow-lg max-h-[90vh] overflow-y-auto relative">
        {showSuccessMessage && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-fade-in-down">
            Entry Added Successfully!
          </div>
        )}
        {showErrorMessage && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-fade-in-down">
            Failed to add entry. Please try again.
          </div>
        )}

        <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            Enter New Charge Details
          </span>
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div className="col-span-1">
            <label htmlFor="creditCard" className="block text-sm font-medium text-gray-700 mb-1">
              CREDIT CARD (If Charged To Card) <span className="text-red-500">*</span>
            </label>
            <select
              id="creditCard"
              className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={formData.creditCard}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Card</option>
              {creditCardOptions.map(option => (
                <option key={option.id} value={option.name}>{option.name}</option>
              ))}
            </select>
          </div>

          <div className="col-span-1">
            <label htmlFor="contractShortName" className="block text-sm font-medium text-gray-700 mb-1">
              CONTRACT SHORT NAME <span className="text-red-500">*</span>
            </label>
            <select
              id="contractShortName"
              className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={formData.contractShortName}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a Contract</option>
              {contractOptions.map(option => (
                <option key={option.id} value={option.name}>{option.name}</option>
              ))}
            </select>
          </div>

          <div className="col-span-1">
            <label htmlFor="vendorName" className="block text-sm font-medium text-gray-700 mb-1">
              VENDOR NAME <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="vendorName"
              placeholder="e.g., Supplier Inc."
              className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={formData.vendorName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="col-span-1">
            <label htmlFor="chargeDate" className="block text-sm font-medium text-gray-700 mb-1">
              CHARGE DATE <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="chargeDate"
              className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={formData.chargeDate}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="col-span-1">
            <label htmlFor="chargeAmount" className="block text-sm font-medium text-gray-700 mb-1">
              CHARGE AMOUNT <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="chargeAmount"
              placeholder="e.g., 123.45"
              step="0.01"
              className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={formData.chargeAmount}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="col-span-1">
            <label htmlFor="submittedDate" className="block text-sm font-medium text-gray-700 mb-1">
              SUBMITTED DATE <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="submittedDate"
              className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={formData.submittedDate}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="col-span-1">
            <label htmlFor="submitter" className="block text-sm font-medium text-gray-700 mb-1">
              SUBMITTER
            </label>
            <input
              type="text"
              id="submitter"
              className="w-full p-3 border border-gray-600 rounded-lg shadow-sm bg-gray-200 text-gray-500 cursor-not-allowed"
              value={formData.submitter}
              readOnly
              disabled
              required
            />
          </div>

          <div className="col-span-1">
            <label htmlFor="pdfFilePath" className="block text-sm font-medium text-gray-700 mb-1">
              PDF FILE PATH <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="pdfFilePath"
              placeholder="e.g., /docs/report.pdf"
              className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={formData.pdfFilePath}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="col-span-full">
            <label htmlFor="chargeCode" className="block text-sm font-medium text-gray-700 mb-1">
              CHARGE CODE <span className="text-red-500">*</span>
            </label>
            <textarea
              id="chargeCode"
              placeholder="Enter charge codes..."
              rows="3"
              className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={formData.chargeCode}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>

          <div className="col-span-full">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              NOTES
            </label>
            <textarea
              id="notes"
              placeholder="Add any additional notes here..."
              rows="3"
              className="w-full p-3 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={formData.notes}
              onChange={handleInputChange}
            ></textarea>
          </div>

          <div className="col-span-full flex justify-end mt-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
              disabled={isLoading}
            >
              {isLoading ? 'Adding...' : 'Add Entry'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddDataModal;
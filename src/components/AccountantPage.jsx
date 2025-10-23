
    // import React, { useState, useEffect } from 'react';

    // // const API_BASE_URL = 'http://localhost:5000/api/entries'; 
    // const API_BASE_URL = 'https://rev-lumina.onrender.com/api/entries'; // This is your live Render API URL

    // // Helper to convert snake_case keys to camelCase.
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

    // // Helper to format date for display (MM/DD/YYYY).
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

    // // Helper to check if a primeKey indicates an updated entry.
    // const isUpdatedEntry = (primeKey) => primeKey && primeKey.includes('.');

    // // Helper function to format date for input (YYYY-MM-DD).
    // const formatDateForInput = (isoString) => {
    //   if (!isoString) return '';
    //   const date = new Date(isoString);
    //   if (isNaN(date.getTime())) {
    //     console.warn("Invalid date string for input:", isoString);
    //     return '';
    //   }
    //   return date.toISOString().slice(0, 10);
    // };


    // const AccountantPage = ({ setCurrentPage, userId, userRole }) => { // Receive userId and userRole
    //   const [dataEntries, setDataEntries] = useState([]);
    //   const [filteredEntries, setFilteredEntries] = useState([]);
    //   const [isLoading, setIsLoading] = useState(true);
    //   const [error, setError] = useState(null);
      
    //   const [filters, setFilters] = useState({
    //     primeKey: '', creditCard: '', contractShortName: '', vendorName: '', chargeDate: '',
    //     chargeAmount: '', submittedDate: '', submitter: '', chargeCode: '', notes: '', pdfFilePath: '',
    //     accountingProcessed: '', dateProcessed: '', apvNumber: ''
    //   });

    //   const [editedData, setEditedData] = useState({});

    //   // MODIFIED: fetchEntries now includes userId and userRole in the query
    //   const fetchEntries = async () => {
    //     setIsLoading(true);
    //     setError(null);
    //     try {
    //       // Include userId and userRole in the query parameters for filtering
    //       const response = await fetch(`${API_BASE_URL}?userId=${userId}&userRole=${userRole}`);
          
    //       if (!response.ok) {
    //         throw new Error('Failed to fetch data entries');
    //       }
    //       const data = await response.json();
    //       const camelCaseData = snakeToCamel(data);
    //       setDataEntries(camelCaseData);
    //     } catch (err) {
    //       console.error('Error fetching data entries:', err);
    //       setError('Failed to load data. Please try again later.');
    //     } finally {
    //       setIsLoading(false);
    //     }
    //   };

    //   useEffect(() => {
    //     if (userId && userRole) { // Only fetch if user info is available
    //       fetchEntries();
    //     }
    //   }, [userId, userRole]); // Re-fetch when userId or userRole changes

    //   // useEffect to filter data whenever dataEntries or filters change.
    //   useEffect(() => {
    //     if (isLoading || error) {
    //       setFilteredEntries([]);
    //       return;
    //     }

    //     const updatedEntries = dataEntries.filter(entry => {
    //       return Object.keys(filters).every(key => {
    //         const filterValue = filters[key].toLowerCase();
    //         const entryValue = key.includes('Date') 
    //           ? formatDateForDisplay(entry[key]).toLowerCase()
    //           : String(entry[key] || '').toLowerCase();
    //         return entryValue.includes(filterValue);
    //       });
    //     });
    //     setFilteredEntries(updatedEntries);
    //   }, [dataEntries, filters, isLoading, error]);

    //   const handleFilterChange = (key, value) => {
    //     setFilters(prevFilters => ({
    //       ...prevFilters,
    //       [key]: value
    //     }));
    //   };

    //   const handleEditChange = (id, field, value) => {
    //     setEditedData(prev => ({
    //       ...prev,
    //       [id]: {
    //         ...prev[id],
    //         [field]: value
    //       }
    //     }));
    //   };

    //   // MODIFIED: handleSaveAll now includes userId and userRole in the PATCH body
    //   const handleSaveAll = async () => {
    //     setIsLoading(true);
    //     setError(null);

    //     try {
    //       await Promise.all(Object.keys(editedData).map(async (id) => {
    //         const dataToSave = { ...editedData[id], userId, userRole }; // Include userId and userRole
    //         const response = await fetch(`${API_BASE_URL}/${id}`, {
    //           method: 'PATCH',
    //           headers: { 'Content-Type': 'application/json' },
    //           body: JSON.stringify(dataToSave)
    //         });
    //         if (!response.ok) {
    //           const errorData = await response.json();
    //           throw new Error(errorData.error || `Failed to save entry ID ${id}`);
    //         }
    //         return response.json();
    //       }));

    //       console.log('All changes saved successfully.');
    //       await fetchEntries(); // Re-fetch to show updated data and clear editedData

    //     } catch (err) {
    //       console.error('Error saving changes:', err);
    //       setError('Failed to save all changes. Please try again.');
    //     } finally {
    //       setIsLoading(false);
    //     }
    //   };

    //   return (
    //     <div className="flex flex-col items-center min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
    //       <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-full px-4">
    //         <h1 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">
    //           <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
    //             Accountant Dashboard
    //           </span>
    //         </h1>

    //         {isLoading && <p className="text-center text-gray-600">Loading data...</p>}
    //         {error && <p className="text-center text-red-500">{error}</p>}
            
    //         {Object.keys(editedData).length > 0 && (
    //           <div className="flex justify-end mb-4">
    //             <button
    //               onClick={handleSaveAll}
    //               className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105"
    //             >
    //               Save All Changes ({Object.keys(editedData).length})
    //             </button>
    //           </div>
    //         )}

    //         {!isLoading && !error && (
    //           <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
    //             <table className="min-w-full divide-y divide-gray-200">
    //               <thead className="bg-blue-600 text-white sticky top-0">
    //                 <tr>
    //                   <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Prime Key</th>
    //                   <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Credit Card</th>
    //                   <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Contract Short Name</th>
    //                   <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Vendor Name</th>
    //                   <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Charge Date</th>
    //                   <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Charge Amount</th>
    //                   <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Submitted Date</th>
    //                   <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Submitter</th>
    //                   <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Charge Code</th>
    //                   <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Notes</th>
    //                   <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">PDF</th>
    //                   <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Accounting Processed</th>
    //                   <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Date Processed</th>
    //                   <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">APV Number</th>
    //                 </tr>
    //                 <tr className="bg-blue-500">
    //                   <td className="px-6 py-2">
    //                     <input type="text" placeholder="Filter..." className="w-full p-1 border rounded text-sm text-gray-700" value={filters.primeKey} onChange={(e) => handleFilterChange('primeKey', e.target.value)} />
    //                   </td>
    //                   <td className="px-6 py-2">
    //                     <input type="text" placeholder="Filter..." className="w-full p-1 border rounded text-sm text-gray-700" value={filters.creditCard} onChange={(e) => handleFilterChange('creditCard', e.target.value)} />
    //                   </td>
    //                   <td className="px-6 py-2">
    //                     <input type="text" placeholder="Filter..." className="w-full p-1 border rounded text-sm text-gray-700" value={filters.contractShortName} onChange={(e) => handleFilterChange('contractShortName', e.target.value)} />
    //                   </td>
    //                   <td className="px-6 py-2">
    //                     <input type="text" placeholder="Filter..." className="w-full p-1 border rounded text-sm text-gray-700" value={filters.vendorName} onChange={(e) => handleFilterChange('vendorName', e.target.value)} />
    //                   </td>
    //                   <td className="px-6 py-2">
    //                     <input type="text" placeholder="Filter..." className="w-full p-1 border rounded text-sm text-gray-700" value={filters.chargeDate} onChange={(e) => handleFilterChange('chargeDate', e.target.value)} />
    //                   </td>
    //                   <td className="px-6 py-2">
    //                     <input type="text" placeholder="Filter..." className="w-full p-1 border rounded text-sm text-gray-700" value={filters.chargeAmount} onChange={(e) => handleFilterChange('chargeAmount', e.target.value)} />
    //                   </td>
    //                   <td className="px-6 py-2">
    //                     <input type="text" placeholder="Filter..." className="w-full p-1 border rounded text-sm text-gray-700" value={filters.submittedDate} onChange={(e) => handleFilterChange('submittedDate', e.target.value)} />
    //                   </td>
    //                   <td className="px-6 py-2">
    //                     <input type="text" placeholder="Filter..." className="w-full p-1 border rounded text-sm text-gray-700" value={filters.submitter} onChange={(e) => handleFilterChange('submitter', e.target.value)} />
    //                   </td>
    //                   <td className="px-6 py-2">
    //                     <input type="text" placeholder="Filter..." className="w-full p-1 border rounded text-sm text-gray-700" value={filters.chargeCode} onChange={(e) => handleFilterChange('chargeCode', e.target.value)} />
    //                   </td>
    //                   <td className="px-6 py-2">
    //                     <input type="text" placeholder="Filter..." className="w-full p-1 border rounded text-sm text-gray-700" value={filters.notes} onChange={(e) => handleFilterChange('notes', e.target.value)} />
    //                   </td>
    //                   <td className="px-6 py-2">
    //                     <input type="text" placeholder="Filter..." className="w-full p-1 border rounded text-sm text-gray-700" value={filters.pdfFilePath} onChange={(e) => handleFilterChange('pdfFilePath', e.target.value)} />
    //                   </td>
    //                   <td className="px-6 py-2">
    //                     <input type="text" placeholder="Filter..." className="w-full p-1 border rounded text-sm text-gray-700" value={filters.accountingProcessed} onChange={(e) => handleFilterChange('accountingProcessed', e.target.value)} />
    //                   </td>
    //                   <td className="px-6 py-2">
    //                     <input type="text" placeholder="Filter..." className="w-full p-1 border rounded text-sm text-gray-700" value={filters.dateProcessed} onChange={(e) => handleFilterChange('dateProcessed', e.target.value)} />
    //                   </td>
    //                   <td className="px-6 py-2">
    //                     <input type="text" placeholder="Filter..." className="w-full p-1 border rounded text-sm text-gray-700" value={filters.apvNumber} onChange={(e) => handleFilterChange('apvNumber', e.target.value)} />
    //                   </td>
    //                 </tr>
    //               </thead>
    //               <tbody className="bg-white divide-y divide-gray-200">
    //                 {filteredEntries.length > 0 ? (
    //                   filteredEntries.map((entry) => (
    //                     <tr
    //                       key={entry.id}
    //                       className={`hover:bg-gray-50 ${isUpdatedEntry(entry.primeKey) || editedData[entry.id] ? 'bg-yellow-50' : ''}`}
    //                     >
    //                       <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-900">{entry.primeKey}</td>
    //                       <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-900">{entry.creditCard}</td>
    //                       <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700">{entry.contractShortName}</td>
    //                       <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700">{entry.vendorName}</td>
    //                       <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700">{formatDateForDisplay(entry.chargeDate)}</td>
    //                       <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700">${entry.chargeAmount ? parseFloat(entry.chargeAmount).toFixed(2) : '0.00'}</td>
    //                       <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700">{formatDateForDisplay(entry.submittedDate)}</td>
    //                       <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700">{entry.submitter}</td>
    //                       <td className="px-6 py-4 whitespace-pre-wrap text-base text-gray-700">{entry.chargeCode}</td>
    //                       <td className="px-6 py-4 whitespace-pre-wrap text-base text-gray-700">{entry.notes}</td>
    //                       <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700">
    //                         {entry.pdfFilePath ? (
    //                           <a href={entry.pdfFilePath} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View PDF</a>
    //                         ) : 'N/A'}
    //                       </td>
    //                       <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700 flex justify-center items-center">
    //                         <input
    //                           type="checkbox"
    //                           checked={editedData[entry.id]?.accountingProcessed === 'T' || entry.accountingProcessed === 'T'}
    //                           onChange={(e) => handleEditChange(entry.id, 'accountingProcessed', e.target.checked ? 'T' : 'F')}
    //                           className="form-checkbox h-5 w-5 text-green-600"
    //                         />
    //                       </td>
    //                       <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700">
    //                         <input
    //                           type="date"
    //                           value={editedData[entry.id]?.dateProcessed ?? formatDateForInput(entry.dateProcessed)}
    //                           onChange={(e) => handleEditChange(entry.id, 'dateProcessed', e.target.value)}
    //                           className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
    //                         />
    //                       </td>
    //                       <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700">
    //                         <input
    //                           type="text"
    //                           value={editedData[entry.id]?.apvNumber ?? entry.apvNumber ?? ''}
    //                           onChange={(e) => handleEditChange(entry.id, 'apvNumber', e.target.value)}
    //                           className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
    //                         />
    //                       </td>
    //                     </tr>
    //                   ))
    //                 ) : (
    //                   <tr>
    //                     <td colSpan="14" className="px-6 py-4 text-center text-gray-600 italic">
    //                       No entries found. Adjust your filters or add some data.
    //                     </td>
    //                   </tr>
    //                 )}
    //               </tbody>
    //             </table>
    //           </div>
    //         )}

    //         <div className="mt-8 text-center">
    //           <button
    //             onClick={() => setCurrentPage('home')}
    //             className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105"
    //           >
    //             Back to Home
    //           </button>
    //         </div>
    //       </div>
    //     </div>
    //   );
    // };

    // export default AccountantPage;
    

    // LAtest //

// import React, { useState, useEffect } from 'react';

// // const API_BASE_URL = 'http://localhost:5000/api/entries'; 
// const API_BASE_URL = 'https://rev-lumina.onrender.com/api/entries'; // This is your live Render API URL

// // Helper to convert snake_case keys to camelCase.
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

// // Helper to format date for display (MM/DD/YYYY).
// const formatDateForDisplay = (isoString) => {
//   if (!isoString) return '';
//   const date = new Date(isoString);
//   if (isNaN(date.getTime())) {
//     console.warn("Invalid date string received:", isoString);
//     return 'Invalid Date';
//   }
//   // CORRECTED: The function is toLocaleDateString, not toLocaleDateDateString
//   return date.toLocaleDateString('en-US', {
//     year: 'numeric',
//     month: '2-digit',
//     day: '2-digit',
//   });
// };

// // Helper to check if a primeKey indicates an updated entry.
// const isUpdatedEntry = (primeKey) => primeKey && primeKey.includes('.');

// // Helper function to format date for input (YYYY-MM-DD).
// const formatDateForInput = (isoString) => {
//   if (!isoString) return '';
//   const date = new Date(isoString);
//   if (isNaN(date.getTime())) {
//     console.warn("Invalid date string for input:", isoString);
//     return '';
//   }
//   return date.toISOString().slice(0, 10);
// };


// const AccountantPage = ({ setCurrentPage, userId, userRole }) => {
//   const [dataEntries, setDataEntries] = useState([]);
//   const [filteredEntries, setFilteredEntries] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   const [latestPrimeKeys, setLatestPrimeKeys] = useState(new Set());

//   const [filters, setFilters] = useState({
//     primeKey: '', creditCard: '', contractShortName: '', vendorName: '', chargeDate: '',
//     chargeAmount: '', submittedDate: '', submitter: '', chargeCode: '', notes: '', pdfFilePath: '',
//     accountingProcessed: '', dateProcessed: '', apvNumber: '', accountantNotes: '' 
//   });

//   const [editedData, setEditedData] = useState({});

//   const fetchEntries = async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const response = await fetch(`${API_BASE_URL}?userId=${userId}&userRole=${userRole}`);
      
//       if (!response.ok) {
//         throw new Error('Failed to fetch data entries');
//       }
//       const data = await response.json();
//       const camelCaseData = snakeToCamel(data);
//       setDataEntries(camelCaseData);
//     } catch (err) {
//       console.error('Error fetching data entries:', err);
//       setError('Failed to load data. Please try again later.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (userId && userRole) { 
//       fetchEntries();
//     }
//   }, [userId, userRole]); 

//   useEffect(() => {
//     if (dataEntries.length > 0) {
//       const latestVersionsMap = {};
//       dataEntries.forEach(entry => {
//         const primeKeyFloat = parseFloat(entry.primeKey);
//         if (isNaN(primeKeyFloat)) return;

//         const baseKey = Math.floor(primeKeyFloat);
//         if (!latestVersionsMap[baseKey] || primeKeyFloat > parseFloat(latestVersionsMap[baseKey])) {
//           latestVersionsMap[baseKey] = entry.primeKey;
//         }
//       });
//       setLatestPrimeKeys(new Set(Object.values(latestVersionsMap)));
//     }
//   }, [dataEntries]);

//   useEffect(() => {
//     if (isLoading || error) {
//       setFilteredEntries([]);
//       return;
//     }

//     const updatedEntries = dataEntries.filter(entry => {
//       return Object.keys(filters).every(key => {
//         const filterValue = filters[key].toLowerCase();
//         const entryValue = key.includes('Date') 
//           ? formatDateForDisplay(entry[key]).toLowerCase()
//           : String(entry[key] || '').toLowerCase();
//         return entryValue.includes(filterValue);
//       });
//     });
//     setFilteredEntries(updatedEntries);
//   }, [dataEntries, filters, isLoading, error]);

//   const handleFilterChange = (key, value) => {
//     setFilters(prevFilters => ({
//       ...prevFilters,
//       [key]: value
//     }));
//   };

//   const handleEditChange = (id, field, value) => {
//     setEditedData(prev => ({
//       ...prev,
//       [id]: {
//         ...prev[id],
//         [field]: value
//       }
//     }));
//   };

//   const handleSaveAll = async () => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       await Promise.all(Object.keys(editedData).map(async (id) => {
//         const dataToSave = { ...editedData[id], userId, userRole }; 
//         const response = await fetch(`${API_BASE_URL}/${id}`, {
//           method: 'PATCH',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(dataToSave)
//         });
//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(errorData.error || `Failed to save entry ID ${id}`);
//         }
//         return response.json();
//       }));

//       console.log('All changes saved successfully.');
//       setEditedData({}); 
//       await fetchEntries();

//     } catch (err) {
//       console.error('Error saving changes:', err);
//       setError('Failed to save all changes. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
//       <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-full px-4">
//         <h1 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">
//           <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
//             Accountant Dashboard
//           </span>
//         </h1>

//         {isLoading && <p className="text-center text-gray-600">Loading data...</p>}
//         {error && <p className="text-center text-red-500">{error}</p>}
        
//         {Object.keys(editedData).length > 0 && (
//           <div className="flex justify-end mb-4">
//             <button
//               onClick={handleSaveAll}
//               className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105"
//             >
//               Save All Changes ({Object.keys(editedData).length})
//             </button>
//           </div>
//         )}

//         {!isLoading && !error && (
//           <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-blue-600 text-white sticky top-0">
//                 <tr>
//                   <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Prime Key</th>
//                   <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Credit Card</th>
//                   <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Contract Short Name</th>
//                   <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Vendor Name</th>
//                   <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Charge Date</th>
//                   <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Charge Amount</th>
//                   <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Submitted Date</th>
//                   <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Submitter</th>
//                   <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Charge Code</th>
//                   <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Notes</th>
//                   <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">PDF</th>
//                   <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Accounting Processed</th>
//                   <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Date Processed</th>
//                   <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">APV Number</th>
//                   <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Accountant Notes</th>
//                 </tr>
//                 <tr className="bg-blue-500">
//                   <td className="px-6 py-2"><input type="text" placeholder="Filter..." className="w-full p-1 border rounded text-sm text-gray-700" value={filters.primeKey} onChange={(e) => handleFilterChange('primeKey', e.target.value)} /></td>
//                   <td className="px-6 py-2"><input type="text" placeholder="Filter..." className="w-full p-1 border rounded text-sm text-gray-700" value={filters.creditCard} onChange={(e) => handleFilterChange('creditCard', e.target.value)} /></td>
//                   <td className="px-6 py-2"><input type="text" placeholder="Filter..." className="w-full p-1 border rounded text-sm text-gray-700" value={filters.contractShortName} onChange={(e) => handleFilterChange('contractShortName', e.target.value)} /></td>
//                   <td className="px-6 py-2"><input type="text" placeholder="Filter..." className="w-full p-1 border rounded text-sm text-gray-700" value={filters.vendorName} onChange={(e) => handleFilterChange('vendorName', e.target.value)} /></td>
//                   <td className="px-6 py-2"><input type="text" placeholder="Filter..." className="w-full p-1 border rounded text-sm text-gray-700" value={filters.chargeDate} onChange={(e) => handleFilterChange('chargeDate', e.target.value)} /></td>
//                   <td className="px-6 py-2"><input type="text" placeholder="Filter..." className="w-full p-1 border rounded text-sm text-gray-700" value={filters.chargeAmount} onChange={(e) => handleFilterChange('chargeAmount', e.target.value)} /></td>
//                   <td className="px-6 py-2"><input type="text" placeholder="Filter..." className="w-full p-1 border rounded text-sm text-gray-700" value={filters.submittedDate} onChange={(e) => handleFilterChange('submittedDate', e.target.value)} /></td>
//                   <td className="px-6 py-2"><input type="text" placeholder="Filter..." className="w-full p-1 border rounded text-sm text-gray-700" value={filters.submitter} onChange={(e) => handleFilterChange('submitter', e.target.value)} /></td>
//                   <td className="px-6 py-2"><input type="text" placeholder="Filter..." className="w-full p-1 border rounded text-sm text-gray-700" value={filters.chargeCode} onChange={(e) => handleFilterChange('chargeCode', e.target.value)} /></td>
//                   <td className="px-6 py-2"><input type="text" placeholder="Filter..." className="w-full p-1 border rounded text-sm text-gray-700" value={filters.notes} onChange={(e) => handleFilterChange('notes', e.target.value)} /></td>
//                   <td className="px-6 py-2"><input type="text" placeholder="Filter..." className="w-full p-1 border rounded text-sm text-gray-700" value={filters.pdfFilePath} onChange={(e) => handleFilterChange('pdfFilePath', e.target.value)} /></td>
//                   <td className="px-6 py-2"><input type="text" placeholder="Filter..." className="w-full p-1 border rounded text-sm text-gray-700" value={filters.accountingProcessed} onChange={(e) => handleFilterChange('accountingProcessed', e.target.value)} /></td>
//                   <td className="px-6 py-2"><input type="text" placeholder="Filter..." className="w-full p-1 border rounded text-sm text-gray-700" value={filters.dateProcessed} onChange={(e) => handleFilterChange('dateProcessed', e.target.value)} /></td>
//                   <td className="px-6 py-2"><input type="text" placeholder="Filter..." className="w-full p-1 border rounded text-sm text-gray-700" value={filters.apvNumber} onChange={(e) => handleFilterChange('apvNumber', e.target.value)} /></td>
//                   <td className="px-6 py-2"><input type="text" placeholder="Filter..." className="w-full p-1 border rounded text-sm text-gray-700" value={filters.accountantNotes} onChange={(e) => handleFilterChange('accountantNotes', e.target.value)} /></td>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredEntries.length > 0 ? (
//                   filteredEntries.map((entry) => {
//                     const isEditable = latestPrimeKeys.has(entry.primeKey);
                    
//                     return (
//                       <tr
//                         key={entry.id}
//                         className={`
//                           ${!isEditable ? 'bg-gray-100 cursor-not-allowed' : 'hover:bg-gray-50'}
//                           ${isUpdatedEntry(entry.primeKey) || editedData[entry.id] ? 'bg-yellow-50' : ''}
//                         `}
//                       >
//                         <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-900">{entry.primeKey}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-900">{entry.creditCard}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700">{entry.contractShortName}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700">{entry.vendorName}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700">{formatDateForDisplay(entry.chargeDate)}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700">${entry.chargeAmount ? parseFloat(entry.chargeAmount).toFixed(2) : '0.00'}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700">{formatDateForDisplay(entry.submittedDate)}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700">{entry.submitter}</td>
//                         <td className="px-6 py-4 whitespace-pre-wrap text-base text-gray-700">{entry.chargeCode}</td>
//                         <td className="px-6 py-4 whitespace-pre-wrap text-base text-gray-700">{entry.notes}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700">
//                           {entry.pdfFilePath ? (<a href={entry.pdfFilePath} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View PDF</a>) : 'N/A'}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700 flex justify-center items-center">
//                           <input
//                             type="checkbox"
//                             checked={editedData[entry.id]?.accountingProcessed === 'T' || (editedData[entry.id]?.accountingProcessed !== 'F' && entry.accountingProcessed === 'T')}
//                             onChange={(e) => handleEditChange(entry.id, 'accountingProcessed', e.target.checked ? 'T' : 'F')}
//                             className="form-checkbox h-5 w-5 text-green-600"
//                             disabled={!isEditable}
//                           />
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700">
//                           <input
//                             type="date"
//                             value={editedData[entry.id]?.dateProcessed ?? formatDateForInput(entry.dateProcessed)}
//                             onChange={(e) => handleEditChange(entry.id, 'dateProcessed', e.target.value)}
//                             className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400 disabled:bg-gray-200"
//                             disabled={!isEditable}
//                           />
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700">
//                           <input
//                             type="text"
//                             value={editedData[entry.id]?.apvNumber ?? entry.apvNumber ?? ''}
//                             onChange={(e) => handleEditChange(entry.id, 'apvNumber', e.target.value)}
//                             className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400 disabled:bg-gray-200"
//                             disabled={!isEditable}
//                           />
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700">
//                           <input
//                             type="text"
//                             value={editedData[entry.id]?.accountantNotes ?? entry.accountantNotes ?? ''}
//                             onChange={(e) => handleEditChange(entry.id, 'accountantNotes', e.target.value)}
//                             className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400 disabled:bg-gray-200"
//                             disabled={!isEditable}
//                           />
//                         </td>
//                       </tr>
//                     )
//                   })
//                 ) : (
//                   <tr>
//                     <td colSpan="15" className="px-6 py-4 text-center text-gray-600 italic">No entries found. Adjust your filters or add some data.</td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}

//         <div className="mt-8 text-center">
//           <button
//             onClick={() => setCurrentPage('home')}
//             className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105"
//           >
//             Back to Home
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AccountantPage;


// Latest//


// TEST ///


// import React, { useState, useEffect } from 'react';

// // const API_BASE_URL = 'http://localhost:5000/api/entries'; 
// const API_BASE_URL = 'https://rev-lumina.onrender.com/api/entries'; // This is your live Render API URL

// // Helper to convert snake_case keys to camelCase.
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

// // Helper to format date for display (MM/DD/YYYY).
// const formatDateForDisplay = (isoString) => {
//   if (!isoString) return '';
//   const date = new Date(isoString);
//   if (isNaN(date.getTime())) {
//     console.warn("Invalid date string received:", isoString);
//     return 'Invalid Date';
//   }
//   // CORRECTED: The function is toLocaleDateString, not toLocaleDateDateString
//   return date.toLocaleDateString('en-US', {
//     year: 'numeric',
//     month: '2-digit',
//     day: '2-digit',
//   });
// };

// // Helper to check if a primeKey indicates an updated entry.
// const isUpdatedEntry = (primeKey) => primeKey && primeKey.includes('.');

// // Helper function to format date for input (YYYY-MM-DD).
// const formatDateForInput = (isoString) => {
//   if (!isoString) return '';
//   const date = new Date(isoString);
//   if (isNaN(date.getTime())) {
//     console.warn("Invalid date string for input:", isoString);
//     return '';
//   }
//   return date.toISOString().slice(0, 10);
// };


// const AccountantPage = ({ setCurrentPage, userId, userRole }) => {
//   const [dataEntries, setDataEntries] = useState([]);
//   const [filteredEntries, setFilteredEntries] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   
//   const [latestPrimeKeys, setLatestPrimeKeys] = useState(new Set());

//   const [filters, setFilters] = useState({
//     primeKey: '', creditCard: '', contractShortName: '', vendorName: '', chargeDate: '',
//     chargeAmount: '', submittedDate: '', submitter: '', chargeCode: '', notes: '', pdfFilePath: '',
//     accountingProcessed: '', dateProcessed: '', apvNumber: '', accountantNotes: '' 
//   });

//   const [editedData, setEditedData] = useState({});

//   const fetchEntries = async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const response = await fetch(`${API_BASE_URL}?userId=${userId}&userRole=${userRole}`);
//       
//       if (!response.ok) {
//         throw new Error('Failed to fetch data entries');
//       }
//       const data = await response.json();
//       const camelCaseData = snakeToCamel(data);
//       setDataEntries(camelCaseData);
//     } catch (err) {
//       console.error('Error fetching data entries:', err);
//       setError('Failed to load data. Please try again later.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (userId && userRole) { 
//       fetchEntries();
//     }
//   }, [userId, userRole]); 

//   useEffect(() => {
//     if (dataEntries.length > 0) {
//       const latestVersionsMap = {};
//       dataEntries.forEach(entry => {
//         const primeKeyFloat = parseFloat(entry.primeKey);
//         if (isNaN(primeKeyFloat)) return;

//         const baseKey = Math.floor(primeKeyFloat);
//         if (!latestVersionsMap[baseKey] || primeKeyFloat > parseFloat(latestVersionsMap[baseKey])) {
//           latestVersionsMap[baseKey] = entry.primeKey;
//         }
//       });
//       setLatestPrimeKeys(new Set(Object.values(latestVersionsMap)));
//     }
//   }, [dataEntries]);

//   useEffect(() => {
//     if (isLoading || error) {
//       setFilteredEntries([]);
//       return;
//     }

//     const updatedEntries = dataEntries.filter(entry => {
//       return Object.keys(filters).every(key => {
//         const filterValue = filters[key].toLowerCase();
//         const entryValue = key.includes('Date') 
//           ? formatDateForDisplay(entry[key]).toLowerCase()
//           : String(entry[key] || '').toLowerCase();
//         return entryValue.includes(filterValue);
//       });
//     });
//     setFilteredEntries(updatedEntries);
//   }, [dataEntries, filters, isLoading, error]);

//   const handleFilterChange = (key, value) => {
//     setFilters(prevFilters => ({
//       ...prevFilters,
//       [key]: value
//     }));
//   };

//   const handleEditChange = (id, field, value) => {
//     setEditedData(prev => ({
//       ...prev,
//       [id]: {
//         ...prev[id],
//         [field]: value
//       }
//     }));
//   };

// //   const handleSaveAll = async () => {
// //     setIsLoading(true);
// //     setError(null);

// //     try {
// //       await Promise.all(Object.keys(editedData).map(async (id) => {
// //         const dataToSave = { ...editedData[id], userId, userRole }; 
// //         const response = await fetch(`${API_BASE_URL}/${id}`, {
// //           method: 'PATCH',
// //           headers: { 'Content-Type': 'application/json' },
// //           body: JSON.stringify(dataToSave)
// //         });
// //         if (!response.ok) {
// //           const errorData = await response.json();
// //           throw new Error(errorData.error || `Failed to save entry ID ${id}`);
// //         }
// //         return response.json();
// //       }));

// //       console.log('All changes saved successfully.');
// //       setEditedData({}); 
// //       await fetchEntries();

// //     } catch (err) {
// //       console.error('Error saving changes:', err);
// //       setError('Failed to save all changes. Please try again.');
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };
// const handleSaveAll = async () => {
//     setIsLoading(true);
//     setError(null);

//     try {
//         await Promise.all(Object.keys(editedData).map(async (id) => {
            
//             const changes = editedData[id];
//             const payload = {};

//             // Loop through only the fields that were changed
//             for (const key in changes) {
//                 let value = changes[key];

//                 // --- START: MODIFICATION ---
//                 // If the user clears an input, its value becomes an empty string.
//                 // We convert it to `null` so the database field is set to NULL instead of ''.
//                 if (value === '') {
//                     value = null;
//                 }

//                 // We now check only for `undefined`. This allows our `null` value to be included in the payload.
//                 if (value !== undefined) {
//                     payload[key] = value;
//                 }
//                 // --- END: MODIFICATION ---
//             }

//             if (Object.keys(payload).length === 0) {
//                 console.log(`Skipping save for ID ${id} as there are no valid changes.`);
//                 return; 
//             }

//             const dataToSave = { ...payload, userId, userRole };

//             const response = await fetch(`${API_BASE_URL}/${id}`, {
//                 method: 'PATCH',
//                 headers: { 'Content-Type': 'application/json' },
//                 // Use the cleaned data object
//                 body: JSON.stringify(dataToSave)
//             });

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.error || `Failed to save entry ID ${id}`);
//             }
//             return response.json();
//         }));

//         console.log('All changes saved successfully.');
//         setEditedData({});
//         await fetchEntries();

//     } catch (err) {
//         console.error('Error saving changes:', err);
//         setError('Failed to save all changes. Please try again.');
//     } finally {
//         setIsLoading(false);
//     }
// };




//   return (
//     <div className="flex flex-col items-center min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
//       <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-full px-4">
//         <h1 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">
//           <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
//             Accountant Dashboard
//           </span>
//         </h1>

//         {isLoading && <p className="text-center text-gray-600">Loading data...</p>}
//         {error && <p className="text-center text-red-500">{error}</p>}
//         
//         {Object.keys(editedData).length > 0 && (
//           <div className="flex justify-end mb-4">
//             <button
//               onClick={handleSaveAll}
//               className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105"
//             >
//               Save All Changes ({Object.keys(editedData).length})
//             </button>
//           </div>
//         )}

//         {!isLoading && !error && (
//           <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-blue-600 text-white sticky top-0">
//                 <tr>
//                   <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Prime Key</th>
//                   <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Credit Card</th>
//                   <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Contract Short Name</th>
//                   <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Vendor Name</th>
//                   <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Charge Date</th>
//                   <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Charge Amount</th>
//                   <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Submitted Date</th>
//                   <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Submitter</th>
//                   <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Charge Code</th>
//                   <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Notes</th>
//                   <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">PDF</th>
//                   <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Accounting Processed</th>
//                   <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Date Processed</th>
//                   <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">APV Number</th>
//                   <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Accountant Notes</th>
//                 </tr>
//                 <tr className="bg-blue-500">
//                   <td className="px-6 py-2"><input type="text" placeholder="Filter..." className="w-full p-1 border rounded text-sm text-gray-700" value={filters.primeKey} onChange={(e) => handleFilterChange('primeKey', e.target.value)} /></td>
//                   <td className="px-6 py-2"><input type="text" placeholder="Filter..." className="w-full p-1 border rounded text-sm text-gray-700" value={filters.creditCard} onChange={(e) => handleFilterChange('creditCard', e.target.value)} /></td>
//                   <td className="px-6 py-2"><input type="text" placeholder="Filter..." className="w-full p-1 border rounded text-sm text-gray-700" value={filters.contractShortName} onChange={(e) => handleFilterChange('contractShortName', e.target.value)} /></td>
//                   <td className="px-6 py-2"><input type="text" placeholder="Filter..." className="w-full p-1 border rounded text-sm text-gray-700" value={filters.vendorName} onChange={(e) => handleFilterChange('vendorName', e.target.value)} /></td>
//                   <td className="px-6 py-2"><input type="text" placeholder="Filter..." className="w-full p-1 border rounded text-sm text-gray-700" value={filters.chargeDate} onChange={(e) => handleFilterChange('chargeDate', e.target.value)} /></td>
//                   <td className="px-6 py-2"><input type="text" placeholder="Filter..." className="w-full p-1 border rounded text-sm text-gray-700" value={filters.chargeAmount} onChange={(e) => handleFilterChange('chargeAmount', e.target.value)} /></td>
//                   <td className="px-6 py-2"><input type="text" placeholder="Filter..." className="w-full p-1 border rounded text-sm text-gray-700" value={filters.submittedDate} onChange={(e) => handleFilterChange('submittedDate', e.target.value)} /></td>
//                   <td className="px-6 py-2"><input type="text" placeholder="Filter..." className="w-full p-1 border rounded text-sm text-gray-700" value={filters.submitter} onChange={(e) => handleFilterChange('submitter', e.target.value)} /></td>
//                   <td className="px-6 py-2"><input type="text" placeholder="Filter..." className="w-full p-1 border rounded text-sm text-gray-700" value={filters.chargeCode} onChange={(e) => handleFilterChange('chargeCode', e.target.value)} /></td>
//                   <td className="px-6 py-2"><input type="text" placeholder="Filter..." className="w-full p-1 border rounded text-sm text-gray-700" value={filters.notes} onChange={(e) => handleFilterChange('notes', e.target.value)} /></td>
//                   <td className="px-6 py-2"><input type="text" placeholder="Filter..." className="w-full p-1 border rounded text-sm text-gray-700" value={filters.pdfFilePath} onChange={(e) => handleFilterChange('pdfFilePath', e.target.value)} /></td>
//                   <td className="px-6 py-2"><input type="text" placeholder="Filter..." className="w-full p-1 border rounded text-sm text-gray-700" value={filters.accountingProcessed} onChange={(e) => handleFilterChange('accountingProcessed', e.target.value)} /></td>
//                   <td className="px-6 py-2"><input type="text" placeholder="Filter..." className="w-full p-1 border rounded text-sm text-gray-700" value={filters.dateProcessed} onChange={(e) => handleFilterChange('dateProcessed', e.target.value)} /></td>
//                   <td className="px-6 py-2"><input type="text" placeholder="Filter..." className="w-full p-1 border rounded text-sm text-gray-700" value={filters.apvNumber} onChange={(e) => handleFilterChange('apvNumber', e.target.value)} /></td>
//                   <td className="px-6 py-2"><input type="text" placeholder="Filter..." className="w-full p-1 border rounded text-sm text-gray-700" value={filters.accountantNotes} onChange={(e) => handleFilterChange('accountantNotes', e.target.value)} /></td>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredEntries.length > 0 ? (
//                   filteredEntries.map((entry) => {
//                     const isEditable = latestPrimeKeys.has(entry.primeKey);
//                     
//                     // Determine the current value for the checkbox, preferring the edited value if it exists.
//                     const isAccountingProcessed = editedData[entry.id]?.accountingProcessed !== undefined
//                       ? editedData[entry.id].accountingProcessed === 'T'
//                       : entry.accountingProcessed === 'T';

//                     return (
//                       <tr
//                         key={entry.id}
//                         className={`
//                           ${!isEditable ? 'bg-gray-100 cursor-not-allowed' : 'hover:bg-gray-50'}
//                           ${isUpdatedEntry(entry.primeKey) || editedData[entry.id] ? 'bg-yellow-50' : ''}
//                         `}
//                       >
//                         <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-900">{entry.primeKey}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-900">{entry.creditCard}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700">{entry.contractShortName}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700">{entry.vendorName}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700">{formatDateForDisplay(entry.chargeDate)}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700">${entry.chargeAmount ? parseFloat(entry.chargeAmount).toFixed(2) : '0.00'}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700">{formatDateForDisplay(entry.submittedDate)}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700">{entry.submitter}</td>
//                         <td className="px-6 py-4 whitespace-pre-wrap text-base text-gray-700">{entry.chargeCode}</td>
//                         <td className="px-6 py-4 whitespace-pre-wrap text-base text-gray-700">{entry.notes}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700">
//                           {entry.pdfFilePath ? (<a href={entry.pdfFilePath} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View PDF</a>) : 'N/A'}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700 flex justify-center items-center">
//                           <input
//                             type="checkbox"
//                             checked={isAccountingProcessed}
//                             onChange={(e) => handleEditChange(entry.id, 'accountingProcessed', e.target.checked ? 'T' : 'F')}
//                             className="form-checkbox h-5 w-5 text-green-600"
//                             disabled={!isEditable}
//                           />
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700">
//                           <input
//                             type="date"
//                             value={editedData[entry.id]?.dateProcessed ?? formatDateForInput(entry.dateProcessed)}
//                             onChange={(e) => handleEditChange(entry.id, 'dateProcessed', e.target.value)}
//                             className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400 disabled:bg-gray-200"
//                             disabled={!isEditable}
//                           />
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700">
//                           <input
//                             type="text"
//                             value={editedData[entry.id]?.apvNumber ?? entry.apvNumber ?? ''}
//                             onChange={(e) => handleEditChange(entry.id, 'apvNumber', e.target.value)}
//                             className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400 disabled:bg-gray-200"
//                             disabled={!isEditable}
//                           />
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700">
//                           <input
//                             type="text"
//                             value={editedData[entry.id]?.accountantNotes ?? entry.accountantNotes ?? ''}
//                             onChange={(e) => handleEditChange(entry.id, 'accountantNotes', e.target.value)}
//                             className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400 disabled:bg-gray-200"
//                             disabled={!isEditable}
//                           />
//                         </td>
//                       </tr>
//                     )
//                   })
//                 ) : (
//                   <tr>
//                     <td colSpan="15" className="px-6 py-4 text-center text-gray-600 italic">No entries found. Adjust your filters or add some data.</td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}

//         <div className="mt-8 text-center">
//           <button
//             onClick={() => setCurrentPage('home')}
//             className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105"
//           >
//             Back to Home
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AccountantPage;


// // 
// import React, { useState, useEffect } from 'react';

// // const API_BASE_URL = 'http://localhost:5000/api/entries'; 
// // const API_BASE_URL = 'https://rev-lumina.onrender.com/api/entries'; // This is your live Render API URL
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://rev-lumina.onrender.com/api';

// // Helper to convert snake_case keys to camelCase.
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

// // Helper to format date for display (MM/DD/YYYY).
// const formatDateForDisplay = (isoString) => {
//   if (!isoString) return '';
//   const date = new Date(isoString);
//   if (isNaN(date.getTime())) {
//     console.warn("Invalid date string received:", isoString);
//     return 'Invalid Date';
//   }
//   // CORRECTED: The function is toLocaleDateString, not toLocaleDateDateString
//   return date.toLocaleDateString('en-US', {
//     year: 'numeric',
//     month: '2-digit',
//     day: '2-digit',
//   });
// };

// // Helper to check if a primeKey indicates an updated entry.
// const isUpdatedEntry = (primeKey) => primeKey && primeKey.includes('.');

// // Helper function to format date for input (YYYY-MM-DD).
// const formatDateForInput = (isoString) => {
//   if (!isoString) return '';
//   const date = new Date(isoString);
//   if (isNaN(date.getTime())) {
//     console.warn("Invalid date string for input:", isoString);
//     return '';
//   }
//   return date.toISOString().slice(0, 10);
// };


// const AccountantPage = ({ setCurrentPage, userId, userRole }) => {
//   const [dataEntries, setDataEntries] = useState([]);
//   const [filteredEntries, setFilteredEntries] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   
//   const [latestPrimeKeys, setLatestPrimeKeys] = useState(new Set());

//   const [filters, setFilters] = useState({
//     primeKey: '', creditCard: '', contractShortName: '', vendorName: '', chargeDate: '',
//     chargeAmount: '', submittedDate: '', submitter: '', chargeCode: '', notes: '', pdfFilePath: '',
//     accountingProcessed: '', dateProcessed: '', apvNumber: '', accountantNotes: '' 
//   });

//   const [editedData, setEditedData] = useState({});

//   const fetchEntries = async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const response = await fetch(`${API_BASE_URL}?userId=${userId}&userRole=${userRole}`);
//       
//       if (!response.ok) {
//         throw new Error('Failed to fetch data entries');
//       }
//       const data = await response.json();
//       const camelCaseData = snakeToCamel(data);
//       setDataEntries(camelCaseData);
//     } catch (err) {
//       console.error('Error fetching data entries:', err);
//       setError('Failed to load data. Please try again later.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (userId && userRole) { 
//       fetchEntries();
//     }
//   }, [userId, userRole]); 

//   useEffect(() => {
//     if (dataEntries.length > 0) {
//       const latestVersionsMap = {};
//       dataEntries.forEach(entry => {
//         const primeKeyFloat = parseFloat(entry.primeKey);
//         if (isNaN(primeKeyFloat)) return;

//         const baseKey = Math.floor(primeKeyFloat);
//         if (!latestVersionsMap[baseKey] || primeKeyFloat > parseFloat(latestVersionsMap[baseKey])) {
//           latestVersionsMap[baseKey] = entry.primeKey;
//         }
//       });
//       setLatestPrimeKeys(new Set(Object.values(latestVersionsMap)));
//     }
//   }, [dataEntries]);

//   useEffect(() => {
//     if (isLoading || error) {
//       setFilteredEntries([]);
//       return;
//     }

//     const updatedEntries = dataEntries.filter(entry => {
//       return Object.keys(filters).every(key => {
//         const filterValue = filters[key].toLowerCase();
//         const entryValue = key.includes('Date') 
//           ? formatDateForDisplay(entry[key]).toLowerCase()
//           : String(entry[key] || '').toLowerCase();
//         return entryValue.includes(filterValue);
//       });
//     });
//     setFilteredEntries(updatedEntries);
//   }, [dataEntries, filters, isLoading, error]);

//   const handleFilterChange = (key, value) => {
//     setFilters(prevFilters => ({
//       ...prevFilters,
//       [key]: value
//     }));
//   };

//   const handleEditChange = (id, field, value) => {
//     setEditedData(prev => ({
//       ...prev,
//       [id]: {
//         ...prev[id],
//         [field]: value
//       }
//     }));
//   };

// const handleSaveAll = async () => {
//   setIsLoading(true);
//   setError(null);

//   try {
//     await Promise.all(Object.keys(editedData).map(async (id) => {
//       const changes = editedData[id];
//       const payload = {};

//       // Loop through only the fields that were changed
//       for (const key in changes) {
//         const value = changes[key];

//         // Only include the key in the payload if the value is not null, undefined, or an empty string
//         if (value !== null && value !== undefined && value !== '') {
//           payload[key] = value;
//         } else if (key === 'accountantNotes' && value === '') { // <<< THIS IS THE EDITED LINE
//           payload[key] = null; // Explicitly set null for accountantNotes if cleared
//         }
//       }

//       if (Object.keys(payload).length === 0) {
//         console.log(`Skipping save for ID ${id} as there are no valid changes.`);
//         return; 
//       }

//       const dataToSave = { ...payload, userId, userRole };

//       const response = await fetch(`${API_BASE_URL}/${id}`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(dataToSave)
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || `Failed to save entry ID ${id}`);
//       }
//       return response.json();
//     }));

//     console.log('All changes saved successfully.');
//     setEditedData({});
//     await fetchEntries();

//   } catch (err) {
//     console.error('Error saving changes:', err);
//     setError('Failed to save all changes. Please try again.');
//   } finally {
//     setIsLoading(false);
//   }
// };



//   return (
//     <div className="flex flex-col items-center min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
//       <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-full px-4">
//         <h1 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">
//           <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
//             Accountant Dashboard
//           </span>
//         </h1>
// {/* <div style={{ backgroundColor: '#f0f0f0', padding: '10px', margin: '20px 0', borderRadius: '8px' }}>
//         <h2>Currently Edited Data:</h2>
//         <pre>{JSON.stringify(editedData, null, 2)}</pre>
//       </div> */}

//         {isLoading && <p className="text-center text-gray-600">Loading data...</p>}
//         {error && <p className="text-center text-red-500">{error}</p>}
//         
//         {Object.keys(editedData).length > 0 && (
//           <div className="flex justify-end mb-4">
//             <button
//               onClick={handleSaveAll}
//               className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105"
//             >
//               Save All Changes ({Object.keys(editedData).length})
//             </button>
//           </div>
//         )}

//         {!isLoading && !error && (
//           <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-blue-600 text-white sticky top-0">
//                 <tr>
//                   <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Prime Key</th>
//                   <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Credit Card</th>
//                   <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Contract Short Name</th>
//                   <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Vendor Name</th>
//                   <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Charge Date</th>
//                   <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Charge Amount</th>
//                   <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Submitted Date</th>
//                   <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Submitter</th>
//                   <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Charge Code</th>
//                   <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Notes</th>
//                   <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">PDF</th>
//                   <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Accounting Processed</th>
//                   <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Date Processed</th>
//                   <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">APV Number</th>
//                   <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Accountant Notes</th>
//                 </tr>
//                 <tr className="bg-blue-500">
//                   <td className="px-6 py-2"><input type="text" placeholder="Filter..." className="w-full p-1 border rounded text-sm text-gray-700" value={filters.primeKey} onChange={(e) => handleFilterChange('primeKey', e.target.value)} /></td>
//                   <td className="px-6 py-2"><input type="text" placeholder="Filter..." className="w-full p-1 border rounded text-sm text-gray-700" value={filters.creditCard} onChange={(e) => handleFilterChange('creditCard', e.target.value)} /></td>
//                   <td className="px-6 py-2"><input type="text" placeholder="Filter..." className="w-full p-1 border rounded text-sm text-gray-700" value={filters.contractShortName} onChange={(e) => handleFilterChange('contractShortName', e.target.value)} /></td>
//                   <td className="px-6 py-2"><input type="text" placeholder="Filter..." className="w-full p-1 border rounded text-sm text-gray-700" value={filters.vendorName} onChange={(e) => handleFilterChange('vendorName', e.target.value)} /></td>
//                   <td className="px-6 py-2"><input type="text" placeholder="Filter..." className="w-full p-1 border rounded text-sm text-gray-700" value={filters.chargeDate} onChange={(e) => handleFilterChange('chargeDate', e.target.value)} /></td>
//                   <td className="px-6 py-2"><input type="text" placeholder="Filter..." className="w-full p-1 border rounded text-sm text-gray-700" value={filters.chargeAmount} onChange={(e) => handleFilterChange('chargeAmount', e.target.value)} /></td>
//                   <td className="px-6 py-2"><input type="text" placeholder="Filter..." className="w-full p-1 border rounded text-sm text-gray-700" value={filters.submittedDate} onChange={(e) => handleFilterChange('submittedDate', e.target.value)} /></td>
//                   <td className="px-6 py-2"><input type="text" placeholder="Filter..." className="w-full p-1 border rounded text-sm text-gray-700" value={filters.submitter} onChange={(e) => handleFilterChange('submitter', e.target.value)} /></td>
//                   <td className="px-6 py-2"><input type="text" placeholder="Filter..." className="w-full p-1 border rounded text-sm text-gray-700" value={filters.chargeCode} onChange={(e) => handleFilterChange('chargeCode', e.target.value)} /></td>
//                   <td className="px-6 py-2"><input type="text" placeholder="Filter..." className="w-full p-1 border rounded text-sm text-gray-700" value={filters.notes} onChange={(e) => handleFilterChange('notes', e.target.value)} /></td>
//                   <td className="px-6 py-2"><input type="text" placeholder="Filter..." className="w-full p-1 border rounded text-sm text-gray-700" value={filters.pdfFilePath} onChange={(e) => handleFilterChange('pdfFilePath', e.target.value)} /></td>
//                   <td className="px-6 py-2"><input type="text" placeholder="Filter..." className="w-full p-1 border rounded text-sm text-gray-700" value={filters.accountingProcessed} onChange={(e) => handleFilterChange('accountingProcessed', e.target.value)} /></td>
//                   <td className="px-6 py-2"><input type="text" placeholder="Filter..." className="w-full p-1 border rounded text-sm text-gray-700" value={filters.dateProcessed} onChange={(e) => handleFilterChange('dateProcessed', e.target.value)} /></td>
//                   <td className="px-6 py-2"><input type="text" placeholder="Filter..." className="w-full p-1 border rounded text-sm text-gray-700" value={filters.apvNumber} onChange={(e) => handleFilterChange('apvNumber', e.target.value)} /></td>
//                   <td className="px-6 py-2"><input type="text" placeholder="Filter..." className="w-full p-1 border rounded text-sm text-gray-700" value={filters.accountingNotes} onChange={(e) => handleFilterChange('accountingNotes', e.target.value)} /></td>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredEntries.length > 0 ? (
//                   filteredEntries.map((entry) => {
//                     const isEditable = latestPrimeKeys.has(entry.primeKey);
//                     
//                     // Determine the current value for the checkbox, preferring the edited value if it exists.
//                     const isAccountingProcessed = editedData[entry.id]?.accountingProcessed !== undefined
//                       ? editedData[entry.id].accountingProcessed === 'T'
//                       : entry.accountingProcessed === 'T';

//                     return (
//                       <tr
//                         key={entry.id}
//                         className={`
//                           ${!isEditable ? 'bg-gray-100 cursor-not-allowed' : 'hover:bg-gray-50'}
//                           ${isUpdatedEntry(entry.primeKey) || editedData[entry.id] ? 'bg-yellow-50' : ''}
//                         `}
//                       >
//                         <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-900">{entry.primeKey}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-900">{entry.creditCard}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700">{entry.contractShortName}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700">{entry.vendorName}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700">{formatDateForDisplay(entry.chargeDate)}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700">${entry.chargeAmount ? parseFloat(entry.chargeAmount).toFixed(2) : '0.00'}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700">{formatDateForDisplay(entry.submittedDate)}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700">{entry.submitter}</td>
//                         <td className="px-6 py-4 whitespace-pre-wrap text-base text-gray-700">{entry.chargeCode}</td>
//                         <td className="px-6 py-4 whitespace-pre-wrap text-base text-gray-700">{entry.notes}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700">
//                           {entry.pdfFilePath ? (<a href={entry.pdfFilePath} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View PDF</a>) : 'N/A'}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700 flex justify-center items-center">
//                           <input
//                             type="checkbox"
//                             checked={isAccountingProcessed}
//                             onChange={(e) => handleEditChange(entry.id, 'accountingProcessed', e.target.checked ? 'T' : 'F')}
//                             className="form-checkbox h-5 w-5 text-green-600"
//                             disabled={!isEditable}
//                           />
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700">
//                           <input
//                             type="date"
//                             value={editedData[entry.id]?.dateProcessed ?? formatDateForInput(entry.dateProcessed)}
//                             onChange={(e) => handleEditChange(entry.id, 'dateProcessed', e.target.value)}
//                             className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400 disabled:bg-gray-200"
//                             disabled={!isEditable}
//                           />
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700">
//                           <input
//                             type="text"
//                             value={editedData[entry.id]?.apvNumber ?? entry.apvNumber ?? ''}
//                             onChange={(e) => handleEditChange(entry.id, 'apvNumber', e.target.value)}
//                             className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400 disabled:bg-gray-200"
//                             disabled={!isEditable}
//                           />
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700">
//                           <input
//                           type="text"
//                           value={editedData[entry.id]?.accountingNotes ?? entry.accountingNotes ?? ''}
//                           onChange={(e) => handleEditChange(entry.id, 'accountingNotes', e.target.value)}
//                           className="w-full p-2 border border-gray-300 rounded..."
//                           disabled={!isEditable}
//                          />
//                         </td>
//                       </tr>
//                     )
//                   })
//                 ) : (
//                   <tr>
//                     <td colSpan="15" className="px-6 py-4 text-center text-gray-600 italic">No entries found. Adjust your filters or add some data.</td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}

//         <div className="mt-8 text-center">
//           <button
//             onClick={() => setCurrentPage('home')}
//             className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105"
//           >
//             Back to Home
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AccountantPage;

// Stable 1 //


// import React, { useState, useEffect } from 'react';

// // Helper to convert snake_case keys to camelCase.
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

// // Helper to format date for display (MM/DD/YYYY).
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

// // Helper to check if a primeKey indicates an updated entry.
// const isUpdatedEntry = (primeKey) => primeKey && String(primeKey).includes('.');

// // Helper function to format date for input (YYYY-MM-DD).
// const formatDateForInput = (isoString) => {
//   if (!isoString) return '';
//   const date = new Date(isoString);
//   if (isNaN(date.getTime())) {
//     console.warn("Invalid date string for input:", isoString);
//     return '';
//   }
//   return date.toISOString().slice(0, 10);
// };

// const AccountantPage = ({ dataEntries, isLoading, error, fetchEntries, userId, userRole }) => {
//   const [filteredEntries, setFilteredEntries] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [latestPrimeKeys, setLatestPrimeKeys] = useState(new Set());
//   const [editedData, setEditedData] = useState({});

//   useEffect(() => {
//     if (dataEntries.length > 0) {
//       const latestVersionsMap = {};
//       dataEntries.forEach(entry => {
//         const primeKeyFloat = parseFloat(entry.primeKey);
//         if (isNaN(primeKeyFloat)) return;

//         const baseKey = Math.floor(primeKeyFloat);
//         if (!latestVersionsMap[baseKey] || primeKeyFloat > parseFloat(latestVersionsMap[baseKey])) {
//           latestVersionsMap[baseKey] = entry.primeKey;
//         }
//       });
//       setLatestPrimeKeys(new Set(Object.values(latestVersionsMap)));
//     }
//   }, [dataEntries]);

//   useEffect(() => {
//     if (isLoading || error) {
//       setFilteredEntries([]);
//       return;
//     }

//     if (!searchQuery) {
//       setFilteredEntries(dataEntries);
//       return;
//     }

//     const lowercasedQuery = searchQuery.toLowerCase();

//     const updatedEntries = dataEntries.filter(entry => {
//       return Object.values(entry).some(value => {
//         if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}T/)) {
//             return formatDateForDisplay(value).toLowerCase().includes(lowercasedQuery);
//         }
//         return String(value || '').toLowerCase().includes(lowercasedQuery);
//       });
//     });
//     setFilteredEntries(updatedEntries);
//   }, [dataEntries, searchQuery, isLoading, error]);

//   const handleEditChange = (id, field, value) => {
//     setEditedData(prev => ({
//       ...prev,
//       [id]: {
//         ...prev[id],
//         [field]: value
//       }
//     }));
//   };

//   const handleSaveAll = async () => {
//     setIsLoading(true);
//     const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://rev-lumina.onrender.com/api';
//     try {
//         await Promise.all(Object.keys(editedData).map(async (id) => {
//             const dataToSave = { ...editedData[id], userId, userRole }; 
//             const response = await fetch(`${API_BASE_URL}/entries/${id}`, {
//                 method: 'PATCH',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(dataToSave)
//             });
//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.error || `Failed to save entry ID ${id}`);
//             }
//             return response.json();
//         }));
//         setEditedData({});
//         fetchEntries(); // This will refresh the data from App.jsx
//     } catch (err) {
//         console.error('Error saving changes:', err);
//     } finally {
//         setIsLoading(false);
//     }
//   };

//   return (
//     <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-full">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-4xl font-extrabold text-gray-800">
//           <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
//             Accountant Dashboard
//           </span>
//         </h1>
        
//         <div className="flex items-center space-x-4">
//             <input
//                 type="text"
//                 placeholder="Search..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-64 p-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//             />
//             {Object.keys(editedData).length > 0 && (
//                 <button
//                 onClick={handleSaveAll}
//                 className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full shadow-lg"
//                 >
//                 Save All Changes ({Object.keys(editedData).length})
//                 </button>
//             )}
//         </div>
//       </div>

//       {isLoading && <p className="text-center text-gray-600">Loading data...</p>}
//       {error && <p className="text-center text-red-500">{error}</p>}
      
//       {!isLoading && !error && (
//         <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-blue-600 text-white sticky top-0">
//                 <tr>
//                     <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Prime Key</th>
//                     <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Contract Short Name</th>
//                     <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Vendor Name</th>
//                     <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Charge Amount</th>
//                     <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Charge Date</th>
//                     <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Submitter</th>
//                     <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Accounting Processed</th>
//                     <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Date Processed</th>
//                     <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">APV Number</th>
//                     <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Accountant Notes</th>
//                 </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredEntries.length > 0 ? (
//                   filteredEntries.map((entry) => {
//                     const isEditable = latestPrimeKeys.has(entry.primeKey);
//                     const isAccountingProcessed = editedData[entry.id]?.accountingProcessed !== undefined
//                       ? editedData[entry.id].accountingProcessed === 'T'
//                       : entry.accountingProcessed === 'T';
                    
//                     return (
//                       <tr key={entry.id} className={`${!isEditable ? 'bg-gray-100 cursor-not-allowed' : 'hover:bg-gray-50'} ${isUpdatedEntry(entry.primeKey) || editedData[entry.id] ? 'bg-yellow-50' : ''}`}>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{entry.primeKey}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{entry.contractShortName}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{entry.vendorName}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${entry.chargeAmount ? parseFloat(entry.chargeAmount).toFixed(2) : '0.00'}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatDateForDisplay(entry.chargeDate)}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{entry.submitter}</td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 flex justify-center items-center">
//                           <input type="checkbox" checked={isAccountingProcessed} onChange={(e) => handleEditChange(entry.id, 'accountingProcessed', e.target.checked ? 'T' : 'F')} className="form-checkbox h-5 w-5 text-green-600" disabled={!isEditable} />
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                           <input type="date" value={editedData[entry.id]?.dateProcessed ?? formatDateForInput(entry.dateProcessed)} onChange={(e) => handleEditChange(entry.id, 'dateProcessed', e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400 disabled:bg-gray-200" disabled={!isEditable} />
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                           <input type="text" value={editedData[entry.id]?.apvNumber ?? entry.apvNumber ?? ''} onChange={(e) => handleEditChange(entry.id, 'apvNumber', e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400 disabled:bg-gray-200" disabled={!isEditable} />
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                           <input type="text" value={editedData[entry.id]?.accountantNotes ?? entry.accountingNotes ?? ''} onChange={(e) => handleEditChange(entry.id, 'accountingNotes', e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400 disabled:bg-gray-200" disabled={!isEditable} />
//                         </td>
//                       </tr>
//                     )
//                   })
//                 ) : (
//                   <tr>
//                     <td colSpan="10" className="px-6 py-4 text-center text-gray-600 italic">No entries found.</td>
//                   </tr>
//                 )}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AccountantPage;


// Stable 1 ENDS///

// STABLE 2 STARTS ///

// import React, { useState, useEffect, useMemo } from 'react';
// import { Save, Search, UserCircle, ChevronDown, ChevronRight } from 'lucide-react';

// // --- Helper Functions ---
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
// const formatDateForDisplay = (isoString) => {
//   if (!isoString) return '';
//   const date = new Date(isoString);
//   if (isNaN(date.getTime())) return 'Invalid Date';
//   return date.toLocaleDateString('en-US', {
//     year: 'numeric',
//     month: '2-digit',
//     day: '2-digit',
//   });
// };
// const formatDateForInput = (isoString) => {
//   if (!isoString) return '';
//   const date = new Date(isoString);
//   if (isNaN(date.getTime())) return '';
//   return date.toISOString().slice(0, 10);
// };

// // --- Read-Only Row component for displaying history ---
// const HistoryRow = ({ entry }) => (
//     <>
//         <td className="px-6 py-3 whitespace-nowrap text-sm font-medium pl-12">{entry.primeKey}</td>
//         <td className="px-6 py-3 whitespace-nowrap text-sm">{entry.contractShortName}</td>
//         <td className="px-6 py-3 whitespace-nowrap text-sm">{entry.vendorName}</td>
//         <td className="px-6 py-3 whitespace-nowrap text-sm">$${entry.chargeAmount ? parseFloat(entry.chargeAmount).toFixed(2) : '0.00'}</td>
//         <td className="px-6 py-3 whitespace-nowrap text-sm">{formatDateForDisplay(entry.chargeDate)}</td>
//         <td className="px-6 py-3 whitespace-nowrap text-sm">{entry.submitter}</td>
//         <td className="px-6 py-3 whitespace-nowrap text-sm text-center">
//             {entry.accountingProcessed === 'T' ? 'Yes' : 'No'}
//         </td>
//         <td className="px-6 py-3 whitespace-nowrap text-sm">{formatDateForDisplay(entry.dateProcessed)}</td>
//         <td className="px-6 py-3 whitespace-nowrap text-sm">{entry.apvNumber || ''}</td>
//         <td className="px-6 py-3 whitespace-nowrap text-sm">{entry.accountingNotes || ''}</td>
//     </>
// );

// const AccountantPage = ({ dataEntries, isLoading, error, fetchEntries, userId, userRole, userName = 'Accountant', userAvatar }) => {
//   const [searchColumn, setSearchColumn] = useState('all');
//   const [searchValue, setSearchValue] = useState('');
//   const [showOnlyLatest, setShowOnlyLatest] = useState(false);
//   const [expandedRows, setExpandedRows] = useState(new Set());
//   const [latestPrimeKeys, setLatestPrimeKeys] = useState(new Set());
//   const [editedData, setEditedData] = useState({});

//   const searchableColumns = [
//       { key: 'all', name: 'All Fields' },
//       { key: 'primeKey', name: 'Prime Key' },
//       { key: 'contractShortName', name: 'Contract' },
//       { key: 'vendorName', name: 'Vendor' },
//       { key: 'submitter', name: 'Submitter' },
//   ];

//   useEffect(() => {
//     if (dataEntries.length > 0) {
//       const latestVersionsMap = {};
//       dataEntries.forEach(entry => {
//         const primeKeyFloat = parseFloat(entry.primeKey);
//         if (isNaN(primeKeyFloat)) return;
//         const baseKey = Math.floor(primeKeyFloat);
//         if (!latestVersionsMap[baseKey] || primeKeyFloat > parseFloat(latestVersionsMap[baseKey].primeKey)) {
//           latestVersionsMap[baseKey] = entry;
//         }
//       });
//       setLatestPrimeKeys(new Set(Object.values(latestVersionsMap).map(e => e.primeKey)));
//     }
//   }, [dataEntries]);

//   const groupedAndFilteredEntries = useMemo(() => {
//     if (isLoading || error) return [];

//     const groups = dataEntries.reduce((acc, entry) => {
//       const baseKey = String(entry.primeKey).split('.')[0];
//       if (!acc[baseKey]) acc[baseKey] = [];
//       acc[baseKey].push(entry);
//       return acc;
//     }, {});

//     for (const key in groups) {
//       groups[key].sort((a, b) => parseFloat(b.primeKey) - parseFloat(a.primeKey));
//     }

//     let filteredGroups = Object.values(groups);

//     if (searchValue) {
//       const lowercasedValue = searchValue.toLowerCase();
//       filteredGroups = filteredGroups.filter(group =>
//         group.some(entry => {
//           if (searchColumn === 'all') {
//             return Object.values(entry).some(value =>
//               String(value || '').toLowerCase().includes(lowercasedValue)
//             );
//           }
//           const entryValue = String(entry[searchColumn] || '');
//           return entryValue.toLowerCase().includes(lowercasedValue);
//         })
//       );
//     }
    
//     return filteredGroups;
//   }, [dataEntries, isLoading, error, searchColumn, searchValue]);

//   const toggleRowExpansion = (baseKey) => {
//     setExpandedRows(prev => {
//       const newSet = new Set(prev);
//       if (newSet.has(baseKey)) {
//         newSet.delete(baseKey);
//       } else {
//         newSet.add(baseKey);
//       }
//       return newSet;
//     });
//   };

//   const handleEditChange = (id, field, value) => {
//     setEditedData(prev => ({
//       ...prev,
//       [id]: { ...prev[id], [field]: value }
//     }));
//   };

//   const handleSaveAll = async () => {
//     setIsLoading(true);
//     const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://rev-lumina.onrender.com/api';
//     try {
//         await Promise.all(Object.keys(editedData).map(async (id) => {
//             const dataToSave = { ...editedData[id], userId, userRole }; 
//             const response = await fetch(`${API_BASE_URL}/entries/${id}`, {
//                 method: 'PATCH',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(dataToSave)
//             });
//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.error || `Failed to save entry ID ${id}`);
//             }
//             return response.json();
//         }));
//         setEditedData({});
//         fetchEntries();
//     } catch (err) {
//         console.error('Error saving changes:', err);
//     } finally {
//         setIsLoading(false);
//     }
//   };

//   const entriesToRender = showOnlyLatest
//     ? dataEntries.filter(entry => latestPrimeKeys.has(entry.primeKey)).map(e => [e]) // Wrap in array to match group structure
//     : groupedAndFilteredEntries;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 sm:p-6 lg:p-8 text-gray-100 flex justify-center items-start">
//         <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-full">
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
//                 <h1 className="text-3xl font-extrabold">
//                     <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
//                         Accountant Dashboard
//                     </span>
//                 </h1>
//                 {/* <div className="flex items-center gap-3 bg-gray-100 p-2 rounded-lg">
//                     <UserCircle size={24} className="text-gray-500" />
//                     <span className="text-md font-medium text-gray-700 hidden sm:block">
//                         Welcome, {userName}
//                     </span>
//                 </div> */}
//                              {/* Center Column: Your Logo */}
//     <div className="w-1/3 flex justify-center">
//         {/*
//           **ADD YOUR LOGO HERE**
//           - Place your logo file (e.g., 'logo.png') in the 'public' folder.
//           - Change the 'src' path below to match your logo's filename.
//         */}
//         <img 
//             src="/Lumina_logo.png" 
//             alt="Lumina Logo" 
//             className="h-12 opacity-100" // Adjust height and opacity as needed
//         />
//     </div>
//                 <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-lg">
//     {userAvatar ? (
//         <img src={userAvatar} alt="User Avatar" className="w-10 h-10 rounded-full object-cover" />
//     ) : (
//         <UserCircle size={32} className="text-gray-500" />
//     )}
//     <span className="text-md font-medium text-gray-700 hidden sm:block">
//         Welcome, {userName}
//     </span>
// </div>
//             </div>

//             <div className="flex flex-col md:flex-row justify-between items-center bg-gray-100 p-4 rounded-lg shadow-sm mb-6 gap-3">
//                  <div className="flex items-center border border-gray-300 rounded-lg bg-white shadow-sm flex-grow">
//                     <select
//                         value={searchColumn}
//                         onChange={(e) => setSearchColumn(e.target.value)}
//                         className="py-2 pl-3 pr-8 bg-transparent border-r border-gray-200 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm text-gray-700 appearance-none"
//                     >
//                         {searchableColumns.map(col => (
//                             <option key={col.key} value={col.key}>{col.name}</option>
//                         ))}
//                     </select>
//                     <input
//                         type="text"
//                         placeholder={`Search...`}
//                         value={searchValue}
//                         onChange={(e) => setSearchValue(e.target.value)}
//                         className="w-full p-2 rounded-r-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm text-gray-800"
//                     />
//                     <Search size={18} className="text-gray-400 mr-3 hidden sm:block" />
//                 </div>
//                 <label htmlFor="latest-toggle-accountant" className="flex items-center cursor-pointer p-2 bg-gray-200 rounded-full hover:bg-gray-300">
//                     <div className="relative">
//                         <input 
//                             type="checkbox" 
//                             id="latest-toggle-accountant" 
//                             className="sr-only peer" 
//                             checked={showOnlyLatest}
//                             onChange={(e) => setShowOnlyLatest(e.target.checked)}
//                         />
//                         <div className="block bg-gray-400 w-12 h-7 rounded-full peer-checked:bg-blue-600 transition-all"></div>
//                         <div className="dot absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-all transform peer-checked:translate-x-full"></div>
//                     </div>
//                     <div className="ml-3 text-sm font-medium text-gray-800">
//                         Show Latest Only
//                     </div>
//                 </label>
//             </div>
            
//             {Object.keys(editedData).length > 0 && (
//                 <div className="flex justify-start items-center gap-3 mb-6">
//                     <button
//                       onClick={handleSaveAll}
//                       className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-2.5 px-5 rounded-lg shadow-md transition-all transform hover:-translate-y-0.5"
//                     >
//                       <Save size={20} />
//                       Save All Changes ({Object.keys(editedData).length})
//                     </button>
//                 </div>
//             )}

//             <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200">
//                 <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-100">
//                          <tr>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Prime Key</th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contract</th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Vendor</th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Charge Date</th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Submitter</th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">Processed</th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date Processed</th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">APV Number</th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Accountant Notes</th>
//                         </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-100 text-gray-800">
//                       {isLoading && <tr><td colSpan="10" className="text-center p-6">Loading...</td></tr>}
//                       {error && <tr><td colSpan="10" className="text-center p-6 text-red-600">{error}</td></tr>}
//                       {!isLoading && !error && entriesToRender.map((group, index) => {
//                           const latestEntry = group[0];
//                           const baseKey = String(latestEntry.primeKey).split('.')[0];
//                           const hasHistory = group.length > 1;
//                           const isExpanded = expandedRows.has(baseKey);
                          
//                           const isEditable = latestPrimeKeys.has(latestEntry.primeKey);
//                           const isModified = !!editedData[latestEntry.id];
                          
//                           const rowClass = `
//                             transition-colors duration-150 ease-in-out
//                             ${!isEditable ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : (index % 2 === 0 ? 'bg-white' : 'bg-gray-50')}
//                             ${isEditable && 'hover:bg-blue-50'}
//                             ${isModified ? 'bg-yellow-100 hover:bg-yellow-200' : ''}
//                           `;

//                           return (
//                             <React.Fragment key={baseKey}>
//                               <tr className={rowClass}>
//                                 <td className="px-6 py-3 whitespace-nowrap text-sm font-medium">
//                                   <div className="flex items-center gap-2">
//                                     {hasHistory && !showOnlyLatest ? (
//                                       <button onClick={() => toggleRowExpansion(baseKey)} className="p-1 rounded-md hover:bg-gray-200">
//                                         {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
//                                       </button>
//                                     ) : (
//                                       <span className="w-[28px]" />
//                                     )}
//                                     <span>{latestEntry.primeKey}</span>
//                                   </div>
//                                 </td>
//                                 <td className="px-6 py-3 whitespace-nowrap text-sm">{latestEntry.contractShortName}</td>
//                                 <td className="px-6 py-3 whitespace-nowrap text-sm">{latestEntry.vendorName}</td>
//                                 <td className="px-6 py-3 whitespace-nowrap text-sm">$${latestEntry.chargeAmount ? parseFloat(latestEntry.chargeAmount).toFixed(2) : '0.00'}</td>
//                                 <td className="px-6 py-3 whitespace-nowrap text-sm">{formatDateForDisplay(latestEntry.chargeDate)}</td>
//                                 <td className="px-6 py-3 whitespace-nowrap text-sm">{latestEntry.submitter}</td>
//                                 <td className="px-6 py-3 whitespace-nowrap text-sm flex justify-center items-center">
//                                   <input 
//                                     type="checkbox" 
//                                     checked={editedData[latestEntry.id]?.accountingProcessed === 'T' || (!isModified && latestEntry.accountingProcessed === 'T')} 
//                                     onChange={(e) => handleEditChange(latestEntry.id, 'accountingProcessed', e.target.checked ? 'T' : 'F')} 
//                                     className="form-checkbox h-5 w-5 text-green-600 rounded disabled:opacity-50" 
//                                     disabled={!isEditable} 
//                                   />
//                                 </td>
//                                 <td className="px-6 py-3 whitespace-nowrap text-sm">
//                                   <input 
//                                     type="date" 
//                                     value={editedData[latestEntry.id]?.dateProcessed ?? formatDateForInput(latestEntry.dateProcessed)} 
//                                     onChange={(e) => handleEditChange(latestEntry.id, 'dateProcessed', e.target.value)} 
//                                     className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 disabled:bg-gray-200" 
//                                     disabled={!isEditable} 
//                                   />
//                                 </td>
//                                 <td className="px-6 py-3 whitespace-nowrap text-sm">
//                                   <input 
//                                     type="text" 
//                                     value={editedData[latestEntry.id]?.apvNumber ?? latestEntry.apvNumber ?? ''} 
//                                     onChange={(e) => handleEditChange(latestEntry.id, 'apvNumber', e.target.value)} 
//                                     className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 disabled:bg-gray-200" 
//                                     disabled={!isEditable} 
//                                   />
//                                 </td>
//                                 <td className="px-6 py-3 whitespace-nowrap text-sm">
//                                   <input 
//                                     type="text" 
//                                     value={editedData[latestEntry.id]?.accountingNotes ?? latestEntry.accountingNotes ?? ''} 
//                                     onChange={(e) => handleEditChange(latestEntry.id, 'accountingNotes', e.target.value)} 
//                                     className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 disabled:bg-gray-200" 
//                                     disabled={!isEditable} 
//                                   />
//                                 </td>
//                               </tr>
//                               {isExpanded && hasHistory && !showOnlyLatest && group.slice(1).map(historyEntry => (
//                                 <tr key={historyEntry.id} className="bg-gray-100 text-gray-500">
//                                   <HistoryRow entry={historyEntry} />
//                                 </tr>
//                               ))}
//                             </React.Fragment>
//                           );
//                       })}
//                       {!isLoading && !error && entriesToRender.length === 0 && (
//                           <tr><td colSpan="10" className="text-center p-6 italic">No entries match your criteria.</td></tr>
//                       )}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     </div>
//   );
// };

// export default AccountantPage;



// STABLE 2 ENDS ///


import React, { useState, useEffect, useMemo } from 'react';
import { Save, Search, UserCircle, ChevronDown, ChevronRight, Loader,LogOut } from 'lucide-react';

// --- Helper Functions ---
const snakeToCamel = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(v => snakeToCamel(v));
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      acc[camelKey] = snakeToCamel(obj[key]);
      return acc;
    }, {});
  }
  return obj;
};
const formatDateForDisplay = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return 'Invalid Date';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};
const formatDateForInput = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
};

// --- Read-Only Row component for displaying history ---
const HistoryRow = ({ entry }) => (
    <>
        <td className="px-6 py-3 whitespace-nowrap text-sm font-medium pl-12">{entry.primeKey}</td>
        <td className="px-6 py-3 whitespace-nowrap text-sm">{entry.contractShortName}</td>
        <td className="px-6 py-3 whitespace-nowrap text-sm">{entry.vendorName}</td>
        <td className="px-6 py-3 whitespace-nowrap text-sm">$${entry.chargeAmount ? parseFloat(entry.chargeAmount).toFixed(2) : '0.00'}</td>
        <td className="px-6 py-3 whitespace-nowrap text-sm">{formatDateForDisplay(entry.chargeDate)}</td>
        <td className="px-6 py-3 whitespace-nowrap text-sm">{entry.submitter}</td>
        <td className="px-6 py-3 whitespace-nowrap text-sm">
  {entry.pdfFilePath ? (
    <a href={entry.pdfFilePath} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
      View PDF
    </a>
  ) : (
    'N/A'
  )}
</td>
        <td className="px-6 py-3 whitespace-nowrap text-sm text-center">
            {entry.accountingProcessed === 'T' ? 'Yes' : 'No'}
        </td>
        <td className="px-6 py-3 whitespace-nowrap text-sm">{formatDateForDisplay(entry.dateProcessed)}</td>
        <td className="px-6 py-3 whitespace-nowrap text-sm">{entry.apvNumber || ''}</td>
        <td className="px-6 py-3 whitespace-nowrap text-sm">{entry.accountingNotes || ''}</td>
        <td className="px-6 py-3 whitespace-nowrap text-sm">{formatDateForDisplay(entry.paidDt)}</td>
    </>
);

const AccountantPage = ({ dataEntries, isLoading, error, fetchEntries, userId, userRole, userName = 'Accountant', userAvatar,handleLogout }) => {
  const [searchColumn, setSearchColumn] = useState('all');
  const [searchValue, setSearchValue] = useState('');
  const [showOnlyLatest, setShowOnlyLatest] = useState(false);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [latestPrimeKeys, setLatestPrimeKeys] = useState(new Set());
  const [editedData, setEditedData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const searchableColumns = [
      { key: 'all', name: 'All Fields' },
      { key: 'primeKey', name: 'Prime Key' },
      { key: 'contractShortName', name: 'Contract' },
      { key: 'vendorName', name: 'Vendor' },
      { key: 'submitter', name: 'Submitter' },
  ];
  
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    if (dataEntries.length > 0) {
      const latestVersionsMap = {};
      dataEntries.forEach(entry => {
        const primeKeyFloat = parseFloat(entry.primeKey);
        if (isNaN(primeKeyFloat)) return;
        const baseKey = Math.floor(primeKeyFloat);
        if (!latestVersionsMap[baseKey] || primeKeyFloat > parseFloat(latestVersionsMap[baseKey].primeKey)) {
          latestVersionsMap[baseKey] = entry;
        }
      });
      setLatestPrimeKeys(new Set(Object.values(latestVersionsMap).map(e => e.primeKey)));
    }
  }, [dataEntries]);

  const groupedAndFilteredEntries = useMemo(() => {
    if (isLoading || error) return [];
    const groups = dataEntries.reduce((acc, entry) => {
      const baseKey = String(entry.primeKey).split('.')[0];
      if (!acc[baseKey]) acc[baseKey] = [];
      acc[baseKey].push(entry);
      return acc;
    }, {});

    for (const key in groups) {
      groups[key].sort((a, b) => parseFloat(b.primeKey) - parseFloat(a.primeKey));
    }

    let filteredGroups = Object.values(groups);

    if (searchValue) {
      const lowercasedValue = searchValue.toLowerCase();
      filteredGroups = filteredGroups.filter(group =>
        group.some(entry => {
          if (searchColumn === 'all') {
            return Object.values(entry).some(value =>
              String(value || '').toLowerCase().includes(lowercasedValue)
            );
          }
          const entryValue = String(entry[searchColumn] || '');
          return entryValue.toLowerCase().includes(lowercasedValue);
        })
      );
    }
    return filteredGroups;
  }, [dataEntries, isLoading, error, searchColumn, searchValue]);

  const toggleRowExpansion = (baseKey) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(baseKey)) {
        newSet.delete(baseKey);
      } else {
        newSet.add(baseKey);
      }
      return newSet;
    });
  };

  const handleEditChange = (id, field, value) => {
    setEditedData(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  };
  
  const handleSaveAll = async () => {
    setIsSaving(true);
    setMessage('');
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://rev-lumina.onrender.com/api';
    try {
        await Promise.all(Object.keys(editedData).map(async (id) => {
            const dataToSave = { ...editedData[id], userId, userRole }; 
            const response = await fetch(`${API_BASE_URL}/entries/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSave)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to save entry ID ${id}`);
            }
            return response.json();
        }));
        setEditedData({});
        setMessage('All changes saved successfully!');
        fetchEntries();
    } catch (err) {
        console.error('Error saving changes:', err);
        setMessage(`Error: ${err.message}`);
    } finally {
        setIsSaving(false);
    }
  };

  const entriesToRender = showOnlyLatest
    ? dataEntries.filter(entry => latestPrimeKeys.has(entry.primeKey)).map(e => [e])
    : groupedAndFilteredEntries;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 sm:p-6 lg:p-8 text-gray-100 flex justify-center items-start">
        <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-full">
            <div className="flex justify-between items-center mb-6">
                <div className="w-1/3">
                    <h1 className="text-3xl font-extrabold">
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r text-lime-800">
                            Voucher Entries
                        </span>
                    </h1>
                </div>
                <div className="w-1/3 flex justify-center">
                    <img 
                        src="/Lumina_logo.png" 
                        alt="Lumina Logo" 
                        className="h-12 opacity-100"
                    />
                </div>
                {/* <div className="w-1/3 flex justify-end">
                    <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-lg">
                        {userAvatar ? (
                            <img src={userAvatar} alt="User Avatar" className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                            <UserCircle size={32} className="text-gray-500" />
                        )}
                        <span className="text-md font-medium text-gray-700 hidden sm:block">
                            Welcome, {userName}
                        </span>
                        
                    </div>
                </div> */}
                {/* Right Column: Welcome Message & Logout Button */}
<div className="w-1/3 flex justify-end items-center gap-4">
    <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-lg">
        {userAvatar ? (
            <img src={userAvatar} alt="User Avatar" className="w-10 h-10 rounded-full object-cover" />
        ) : (
            <UserCircle size={32} className="text-gray-500" />
        )}
        <span className="text-lg font-medium text-gray-700 hidden sm:block">
            Welcome, {userName}
        </span>
    </div>
    <button 
        onClick={handleLogout} 
        className="p-3 bg-red-100 hover:bg-red-200 rounded-full text-red-600 transition-colors"
        title="Logout"
    >
        <LogOut size={20} />
    </button>
</div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center bg-gray-100 p-4 rounded-lg shadow-sm mb-6 gap-3">
                 <div className="flex items-center border border-gray-300 rounded-lg bg-white shadow-sm flex-grow">
                    <select
                        value={searchColumn}
                        onChange={(e) => setSearchColumn(e.target.value)}
                        className="py-2 pl-3 pr-8 bg-transparent border-r border-gray-200 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm text-gray-700 appearance-none"
                    >
                        {searchableColumns.map(col => (
                            <option key={col.key} value={col.key}>{col.name}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder={`Search...`}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="w-full p-2 rounded-r-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm text-gray-800"
                    />
                    <Search size={18} className="text-gray-400 mr-3 hidden sm:block" />
                </div>
                <label htmlFor="latest-toggle-accountant" className="flex items-center cursor-pointer p-2 bg-gray-200 rounded-full hover:bg-gray-300">
                    <div className="relative">
                        <input 
                            type="checkbox" 
                            id="latest-toggle-accountant" 
                            className="sr-only peer" 
                            checked={showOnlyLatest}
                            onChange={(e) => setShowOnlyLatest(e.target.checked)}
                        />
                        <div className="block bg-gray-400 w-12 h-7 rounded-full peer-checked:bg-blue-600 transition-all"></div>
                        <div className="dot absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-all transform peer-checked:translate-x-full"></div>
                    </div>
                    <div className="ml-3 text-sm font-medium text-gray-800">
                        Show Latest Only
                    </div>
                </label>
            </div>
            
            {message && (
              <div className={`text-center p-3 rounded-lg mb-6 text-sm ${message.startsWith('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {message}
              </div>
            )}
            
            {Object.keys(editedData).length > 0 && (
                <div className="flex justify-start items-center gap-3 mb-6">
                    <button
                      onClick={handleSaveAll}
                      disabled={isSaving}
                      className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-2.5 px-5 rounded-lg shadow-md transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
                    >
                      <Save size={20} />
                      {isSaving ? 'Saving...' : `Save All Changes (${Object.keys(editedData).length})`}
                    </button>
                </div>
            )}

            <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                         <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600  tracking-wider">Record No</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600  tracking-wider">Contract</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600  tracking-wider">Vendor</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600  tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600  tracking-wider">Charge Date</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600  tracking-wider">Submitter</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 tracking-wider">PDF</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600  tracking-wider text-center">Processed</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600  tracking-wider">Date Processed</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600  tracking-wider">APV Number</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600  tracking-wider">Accountant Notes</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600  tracking-wider">Paid Date</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100 text-gray-800">
                      {isLoading && <tr><td colSpan="10" className="text-center p-6"><Loader className="animate-spin text-blue-500 mx-auto" /></td></tr>}
                      {error && <tr><td colSpan="10" className="text-center p-6 text-red-600">{error}</td></tr>}
                      {!isLoading && !error && entriesToRender.map((group, index) => {
                          const latestEntry = group[0];
                          const baseKey = String(latestEntry.primeKey).split('.')[0];
                          const hasHistory = group.length > 1;
                          const isExpanded = expandedRows.has(baseKey);
                          
                          const isEditable = latestPrimeKeys.has(latestEntry.primeKey);
                          const isModified = !!editedData[latestEntry.id];
                          
                          const rowClass = `
                            transition-colors duration-150 ease-in-out
                            ${!isEditable ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : (index % 2 === 0 ? 'bg-white' : 'bg-gray-50')}
                            ${isEditable && 'hover:bg-blue-50'}
                            ${isModified ? 'bg-yellow-100 hover:bg-yellow-200' : ''}
                          `;

                          return (
                            <React.Fragment key={baseKey}>
                              <tr className={rowClass}>
                                <td className="px-6 py-3 whitespace-nowrap text-sm font-medium">
                                  <div className="flex items-center gap-2">
                                    {hasHistory && !showOnlyLatest ? (
                                      <button onClick={() => toggleRowExpansion(baseKey)} className="p-1 rounded-md hover:bg-gray-200">
                                        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                      </button>
                                    ) : (
                                      <span className="w-[28px]" />
                                    )}
                                    <span>{latestEntry.primeKey}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm">{latestEntry.contractShortName}</td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm">{latestEntry.vendorName}</td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm">$${latestEntry.chargeAmount ? parseFloat(latestEntry.chargeAmount).toFixed(2) : '0.00'}</td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm">{formatDateForDisplay(latestEntry.chargeDate)}</td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm">{latestEntry.submitter}</td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm">
  {latestEntry.pdfFilePath ? (
    <a href={latestEntry.pdfFilePath} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
      View PDF
    </a>
  ) : (
    'N/A'
  )}
</td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm flex justify-center items-center">
                                  <input 
                                    type="checkbox" 
                                    checked={editedData[latestEntry.id]?.accountingProcessed === 'T' || (!isModified && latestEntry.accountingProcessed === 'T')} 
                                    onChange={(e) => handleEditChange(latestEntry.id, 'accountingProcessed', e.target.checked ? 'T' : 'F')} 
                                    className="form-checkbox h-5 w-5 text-green-600 rounded disabled:opacity-50" 
                                    disabled={!isEditable} 
                                  />
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm">
                                  <input 
                                    type="date" 
                                    value={editedData[latestEntry.id]?.dateProcessed ?? formatDateForInput(latestEntry.dateProcessed)} 
                                    onChange={(e) => handleEditChange(latestEntry.id, 'dateProcessed', e.target.value)} 
                                    className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 disabled:bg-gray-200" 
                                    disabled={!isEditable} 
                                  />
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm">
                                  <input 
                                    type="text" 
                                    value={editedData[latestEntry.id]?.apvNumber ?? latestEntry.apvNumber ?? ''} 
                                    onChange={(e) => handleEditChange(latestEntry.id, 'apvNumber', e.target.value)} 
                                    className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 disabled:bg-gray-200" 
                                    disabled={!isEditable} 
                                  />
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm">
                                  <input 
                                    type="text" 
                                    value={editedData[latestEntry.id]?.accountingNotes ?? latestEntry.accountingNotes ?? ''} 
                                    onChange={(e) => handleEditChange(latestEntry.id, 'accountingNotes', e.target.value)} 
                                    className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 disabled:bg-gray-200" 
                                    disabled={!isEditable} 
                                  />
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap text-sm">
                                <input 
                                  type="date" 
                                  value={editedData[latestEntry.id]?.paidDt ?? formatDateForInput(latestEntry.paidDt)} 
                                  onChange={(e) => handleEditChange(latestEntry.id, 'paidDt', e.target.value)} 
                                  className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 disabled:bg-gray-200" 
                                  disabled={!isEditable} 
                                />
</td>
                              </tr>
                              {isExpanded && hasHistory && !showOnlyLatest && group.slice(1).map(historyEntry => (
                                <tr key={historyEntry.id} className="bg-gray-100 text-gray-500">
                                  <HistoryRow entry={historyEntry} />
                                </tr>
                              ))}
                            </React.Fragment>
                          );
                      })}
                      {!isLoading && !error && entriesToRender.length === 0 && (
                          <tr><td colSpan="10" className="text-center p-6 italic">No entries match your criteria.</td></tr>
                      )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};

export default AccountantPage;
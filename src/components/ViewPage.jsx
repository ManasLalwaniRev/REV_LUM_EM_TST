
    //    import React, { useState, useEffect } from 'react';

    // // const API_BASE_URL = 'http://localhost:5000/api/entries'; 
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

    // // Helper to check if a primeKey indicates an updated entry
    // const isUpdatedEntry = (primeKey) => primeKey && primeKey.includes('.');

    // const ViewPage = ({ setCurrentPage, userId, userRole }) => { // Receive userId and userRole
    //   const [dataEntries, setDataEntries] = useState([]);
    //   const [filteredEntries, setFilteredEntries] = useState([]);
    //   const [isLoading, setIsLoading] = useState(true);
    //   const [error, setError] = useState(null);

    //   const [filters, setFilters] = useState({
    //     primeKey: '', creditCard: '', contractShortName: '', vendorName: '', chargeDate: '',
    //     chargeAmount: '', submittedDate: '', submitter: '', chargeCode: '', notes: '', pdfFilePath: ''
    //   });

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

    //   return (
    //     <div className="flex flex-col items-center min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
    //       <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-full px-4">
    //         <h1 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">
    //           <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
    //             All Data Entries
    //           </span>
    //         </h1>

    //         {isLoading && <p className="text-center text-gray-600">Loading data...</p>}
    //         {error && <p className="text-center text-red-500">{error}</p>}

    //         {!isLoading && !error && (
    //           <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
    //             <table className="min-w-full divide-y divide-gray-200">
    //               <thead className="bg-blue-600 text-white">
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
    //                 </tr>
    //               </thead>
    //               <tbody className="bg-white divide-y divide-gray-200">
    //                 {filteredEntries.length > 0 ? (
    //                   filteredEntries.map((entry) => (
    //                     <tr
    //                       key={entry.id}
    //                       className={`hover:bg-gray-50 ${isUpdatedEntry(entry.primeKey) ? 'bg-yellow-50' : ''}`}
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
    //                     </tr>
    //                   ))
    //                 ) : (
    //                   <tr>
    //                     <td colSpan="11" className="px-6 py-4 text-center text-gray-600 italic">
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

    // export default ViewPage;
    


//     import React, { useState, useEffect } from 'react';

// // The API base URL is for your deployed backend.
// // const API_BASE_URL = 'https://rev-lumina.onrender.com/api/entries'; 
// const API_BASE_URL = 'http://localhost:5000/api/entries'; 

// // Helper to convert snake_case keys to camelCase.
// // This is a robust helper for nested objects and arrays.
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
//   // Ensure date is valid before formatting.
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

// const ViewPage = ({ setCurrentPage, userId, userRole }) => { // Receive userId and userRole
//   const [dataEntries, setDataEntries] = useState([]);
//   const [filteredEntries, setFilteredEntries] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   // State to hold the filter values for each column, now including new columns.
//   const [filters, setFilters] = useState({
//     primeKey: '',
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
//     apvNumber: '',          // NEW FILTER
//     accountingProcessed: '', // NEW FILTER
//     dateProcessed: ''        // NEW FILTER
//   });

//   // useEffect to fetch data from the API once on component mount.
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
//       // Convert fetched data keys from snake_case to camelCase.
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
//     // If the data is still loading or there's an error, don't attempt to filter.
//     if (isLoading || error) {
//       setFilteredEntries([]);
//       return;
//     }

//     // Filter the entries based on the current filter values.
//     const updatedEntries = dataEntries.filter(entry => {
//       // Check each filter key and value.
//       return Object.keys(filters).every(key => {
//         const filterValue = filters[key].toLowerCase();
//         // Handle date formatting for filtering.
//         const entryValue = key.includes('Date') 
//           ? formatDateForDisplay(entry[key]).toLowerCase()
//           : String(entry[key] || '').toLowerCase();
        
//         return entryValue.includes(filterValue);
//       });
//     });
//     setFilteredEntries(updatedEntries);
//   }, [dataEntries, filters, isLoading, error]);

//   // Handler for updating the filter state.
//   const handleFilterChange = (key, value) => {
//     setFilters(prevFilters => ({
//       ...prevFilters,
//       [key]: value
//     }));
//   };

//   return (
//     <div className="flex flex-col items-center min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
//       <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-full px-4">
//         <h1 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">
//           <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
//             All Data Entries
//           </span>
//         </h1>

//         {isLoading && <p className="text-center text-gray-600">Loading data...</p>}
//         {error && <p className="text-center text-red-500">{error}</p>}
        
//         {/* The table container and table are now always visible */}
//         {!isLoading && !error && (
//           <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-blue-600 text-white">
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
//                   <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">APV Number</th> {/* NEW HEADER */}
//                   <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Accounting Processed</th> {/* NEW HEADER */}
//                   <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Date Processed</th> {/* NEW HEADER */}
//                 </tr>
//                 {/* Filter row, now including new filters */}
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
//                   <td className="px-6 py-2"> {/* NEW FILTER INPUT */}
//                     <input type="text" placeholder="Filter..." className="w-full p-1 border rounded text-sm text-gray-700" value={filters.apvNumber} onChange={(e) => handleFilterChange('apvNumber', e.target.value)} />
//                   </td>
//                   <td className="px-6 py-2"> {/* NEW FILTER INPUT */}
//                     <input type="text" placeholder="Filter..." className="w-full p-1 border rounded text-sm text-gray-700" value={filters.accountingProcessed} onChange={(e) => handleFilterChange('accountingProcessed', e.target.value)} />
//                   </td>
//                   <td className="px-6 py-2"> {/* NEW FILTER INPUT */}
//                     <input type="text" placeholder="Filter..." className="w-full p-1 border rounded text-sm text-gray-700" value={filters.dateProcessed} onChange={(e) => handleFilterChange('dateProcessed', e.target.value)} />
//                   </td>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredEntries.length > 0 ? (
//                   filteredEntries.map((entry) => (
//                     <tr
//                       key={entry.id}
//                       className={`hover:bg-gray-50 ${isUpdatedEntry(entry.primeKey) ? 'bg-yellow-50' : ''}`}
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
//                       {/* NEW DATA CELLS */}
//                       <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700">{entry.apvNumber || 'N/A'}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700">
//                         {entry.accountingProcessed === 'T' ? 'Yes' : (entry.accountingProcessed === 'F' ? 'No' : 'N/A')}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700">{formatDateForDisplay(entry.dateProcessed)}</td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="14" className="px-6 py-4 text-center text-gray-600 italic"> {/* Adjusted colSpan */}
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

// export default ViewPage;

// Stable 1 ///

// import React, { useState, useEffect } from 'react';

// // Helper to format date for display (MM/DD/YYYY).
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

// // Helper to check if a primeKey indicates an updated entry.
// const isUpdatedEntry = (primeKey) => primeKey && String(primeKey).includes('.');

// const ViewPage = ({ dataEntries, isLoading, error, openAddDataModal, openEditDataModal }) => {
//   const [filteredEntries, setFilteredEntries] = useState([]);
//   const [searchQuery, setSearchQuery] = useState(''); // State for the single search query

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

//   return (
//     <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-full">
//       {/* --- MODIFIED HEADER SECTION --- */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-4xl font-extrabold text-gray-800">
//           <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
//             All Data Entries
//           </span>
//         </h1>
        
//         {/* Group for search bar and buttons */}
//         <div className="flex items-center space-x-4">
//           <input
//             type="text"
//             placeholder="Search..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-64 p-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//           />
//           <button
//             onClick={openAddDataModal}
//             className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
//           >
//             Add Data
//           </button>
//           <button
//             onClick={openEditDataModal}
//             className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
//           >
//             Edit Data
//           </button>
//         </div>
//       </div>
//       {/* --- END OF MODIFIED SECTION --- */}

//       {isLoading && <p className="text-center text-gray-600">Loading data...</p>}
//       {error && <p className="text-center text-red-500">{error}</p>}
      
//       {!isLoading && !error && (
//         <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
//           <table className="min-w-full divide-y divide-gray-200">
//             {/* Table content remains the same... */}
//             <thead className="bg-blue-600 text-white">
//               <tr>
//                 <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Prime Key</th>
//                 <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Credit Card</th>
//                 <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Contract Short Name</th>
//                 <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Vendor Name</th>
//                 <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Charge Date</th>
//                 <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Charge Amount</th>
//                 <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Submitted Date</th>
//                 <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Submitter</th>
//                 <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Charge Code</th>
//                 <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Notes</th>
//                 <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">PDF</th>
//                 <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">APV Number</th>
//                 <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Accounting Processed</th>
//                 <th scope="col" className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Date Processed</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredEntries.length > 0 ? (
//                 filteredEntries.map((entry) => (
//                   <tr
//                     key={entry.id}
//                     className={`hover:bg-gray-50 ${isUpdatedEntry(entry.primeKey) ? 'bg-yellow-50' : ''}`}
//                   >
//                     <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-900">{entry.primeKey}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-900">{entry.creditCard}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700">{entry.contractShortName}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700">{entry.vendorName}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700">{formatDateForDisplay(entry.chargeDate)}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700">${entry.chargeAmount ? parseFloat(entry.chargeAmount).toFixed(2) : '0.00'}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700">{formatDateForDisplay(entry.submittedDate)}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700">{entry.submitter}</td>
//                     <td className="px-6 py-4 whitespace-pre-wrap text-base text-gray-700">{entry.chargeCode}</td>
//                     <td className="px-6 py-4 whitespace-pre-wrap text-base text-gray-700">{entry.notes}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700">
//                       {entry.pdfFilePath ? (
//                         <a href={entry.pdfFilePath} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View PDF</a>
//                       ) : 'N/A'}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700">{entry.apvNumber || 'N/A'}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700">
//                       {entry.accountingProcessed === 'T' ? 'Yes' : (entry.accountingProcessed === 'F' ? 'No' : 'N/A')}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700">{formatDateForDisplay(entry.dateProcessed)}</td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="14" className="px-6 py-4 text-center text-gray-600 italic">
//                     No entries found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ViewPage;



// STABLE 1 END ///


// STABLE 2 ///

// import React, { useState, useEffect, useMemo } from 'react';
// import { ChevronDown, ChevronRight } from 'lucide-react';
// import * as XLSX from 'xlsx';

// const formatDateForDisplay = (isoString) => {
//   if (!isoString) return '';
//   const date = new Date(isoString);
//   if (isNaN(date.getTime())) return 'Invalid Date';
//   return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
// };

// const ViewPage = ({ dataEntries, isLoading, error, openAddDataModal, openEditDataModal, openExportModal }) => {
//   // const [searchQuery, setSearchQuery] = useState(''); 
//   const [searchColumn, setSearchColumn] = useState('all'); // Default to searching all fields
//   const [searchValue, setSearchValue] = useState('');   // The text the user types
//   const [expandedRows, setExpandedRows] = useState(new Set());
//   const [selectedRows, setSelectedRows] = useState(new Set());
// // Add this array inside your ViewPage component
// const searchableColumns = [
//     { key: 'all', name: 'All Fields' }, // Default option
//     { key: 'creditCard', name: 'Credit Card' },
//     { key: 'contractShortName', name: 'Contract' },
//     { key: 'vendorName', name: 'Vendor' },
//     { key: 'submitter', name: 'Submitter' },
//     { key: 'chargeAmount', name: 'Amount' },
//     { key: 'chargeDate', name: 'Charge Date' },
// ];
//   // const groupedEntries = useMemo(() => {
//   //   if (!dataEntries) return [];
//   //   const groups = dataEntries.reduce((acc, entry) => {
//   //     const baseKey = String(entry.primeKey).split('.')[0];
//   //     if (!acc[baseKey]) acc[baseKey] = [];
//   //     acc[baseKey].push(entry);
//   //     return acc;
//   //   }, {});
//   //   for (const key in groups) {
//   //     groups[key].sort((a, b) => parseFloat(b.primeKey) - parseFloat(a.primeKey));
//   //   }
//   //   const lowercasedQuery = searchQuery.toLowerCase();
//   //   if (!lowercasedQuery) return Object.values(groups);
//   //   return Object.values(groups).filter(group =>
//   //     group.some(entry =>
//   //       Object.values(entry).some(value =>
//   //         String(value || '').toLowerCase().includes(lowercasedQuery)
//   //       )
//   //     )
//   //   );
//   // }, [dataEntries, searchQuery]);
//   const groupedEntries = useMemo(() => {
//     if (!dataEntries) return [];
//     const groups = dataEntries.reduce((acc, entry) => {
//       const baseKey = String(entry.primeKey).split('.')[0];
//       if (!acc[baseKey]) acc[baseKey] = [];
//       acc[baseKey].push(entry);
//       return acc;
//     }, {});

//     for (const key in groups) {
//       groups[key].sort((a, b) => parseFloat(b.primeKey) - parseFloat(a.primeKey));
//     }

//     if (!searchValue) {
//       return Object.values(groups);
//     }

//     const lowercasedValue = searchValue.toLowerCase();

//     return Object.values(groups).filter(group =>
//       group.some(entry => {
//         if (searchColumn === 'all') {
//           // Search all values in the entry object if 'All Fields' is selected
//           return Object.values(entry).some(value => {
//             const entryValue = (String(value) || '').toLowerCase();
//             return entryValue.includes(lowercasedValue);
//           });
//         } else {
//           // Otherwise, search only the selected column
//           const entryValue = searchColumn.includes('Date')
//             ? formatDateForDisplay(entry[searchColumn])
//             : String(entry[searchColumn] || '');
//           return entryValue.toLowerCase().includes(lowercasedValue);
//         }
//       })
//     );
// }, [dataEntries, searchColumn, searchValue]);

//   const visibleEntryIds = useMemo(() => groupedEntries.flat().map(entry => entry.id), [groupedEntries]);

//   const handleSelectAll = (e) => {
//     if (e.target.checked) {
//       setSelectedRows(new Set(visibleEntryIds));
//     } else {
//       setSelectedRows(new Set());
//     }
//   };

//   const handleSelectRow = (id) => {
//     const newSelectedRows = new Set(selectedRows);
//     if (newSelectedRows.has(id)) {
//       newSelectedRows.delete(id);
//     } else {
//       newSelectedRows.add(id);
//     }
//     setSelectedRows(newSelectedRows);
//   };

//   const handleExport = () => {
//     let dataToExport;
//     if (selectedRows.size > 0) {
//       dataToExport = dataEntries.filter(entry => selectedRows.has(entry.id));
//       if (dataToExport.length === 0) {
//         alert("No rows selected for export.");
//         return;
//       }
//       const dataForSheet = dataToExport.map(entry => ({
//         "Prime Key": entry.primeKey,
//         "Credit Card": entry.creditCard,
//         "Contract Short Name": entry.contractShortName,
//         "Vendor Name": entry.vendorName,
//         "Charge Date": formatDateForDisplay(entry.chargeDate),
//         "Charge Amount": entry.chargeAmount,
//         "Submitted Date": formatDateForDisplay(entry.submittedDate),
//         "Submitter": entry.submitter,
//         "Charge Code": entry.chargeCode,
//         "Notes": entry.notes,
//         "PDF File Path": entry.pdfFilePath,
//         "APV Number": entry.apvNumber,
//         "Accounting Processed": entry.accountingProcessed === 'T' ? 'Yes' : 'No',
//         "Date Processed": formatDateForDisplay(entry.dateProcessed),
//       }));
//       const worksheet = XLSX.utils.json_to_sheet(dataForSheet);
//       const workbook = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(workbook, worksheet, "SelectedData");
//       XLSX.writeFile(workbook, "LuminaSelectionExport.xlsx");
//     } else {
//       openExportModal();
//     }
//   };

//   const toggleRowExpansion = (baseKey) => {
//     setExpandedRows(prev => {
//       const newSet = new Set(prev);
//       if (newSet.has(baseKey)) newSet.delete(baseKey);
//       else newSet.add(baseKey);
//       return newSet;
//     });
//   };
  
//   // This Row component is defined inside ViewPage so it can access its state and functions
//   const Row = ({ entry, isHistory }) => (
//     <React.Fragment>
//       <td className="p-4">
//           <input
//               type="checkbox"
//               className="form-checkbox h-5 w-5 text-blue-600"
//               checked={selectedRows.has(entry.id)}
//               onChange={() => handleSelectRow(entry.id)}
//           />
//       </td>
//       <td className={`px-6 py-4 whitespace-nowrap text-base ${isHistory ? 'text-gray-500 pl-12' : 'font-medium text-gray-900'}`}>{entry.primeKey}</td>
//       <td className={`px-6 py-4 whitespace-nowrap text-base ${isHistory ? 'text-gray-500' : 'font-medium text-gray-900'}`}>{entry.creditCard}</td>
//       <td className={`px-6 py-4 whitespace-nowrap text-base ${isHistory ? 'text-gray-500' : 'text-gray-700'}`}>{entry.contractShortName}</td>
//       <td className={`px-6 py-4 whitespace-nowrap text-base ${isHistory ? 'text-gray-500' : 'text-gray-700'}`}>{entry.vendorName}</td>
//       <td className={`px-6 py-4 whitespace-nowrap text-base ${isHistory ? 'text-gray-500' : 'text-gray-700'}`}>{formatDateForDisplay(entry.chargeDate)}</td>
//       <td className={`px-6 py-4 whitespace-nowrap text-base ${isHistory ? 'text-gray-500' : 'text-gray-700'}`}>${entry.chargeAmount ? parseFloat(entry.chargeAmount).toFixed(2) : '0.00'}</td>
//       <td className={`px-6 py-4 whitespace-nowrap text-base ${isHistory ? 'text-gray-500' : 'text-gray-700'}`}>{formatDateForDisplay(entry.submittedDate)}</td>
//       <td className={`px-6 py-4 whitespace-nowrap text-base ${isHistory ? 'text-gray-500' : 'text-gray-700'}`}>{entry.submitter}</td>
//       <td className={`px-6 py-4 whitespace-pre-wrap text-base ${isHistory ? 'text-gray-500' : 'text-gray-700'}`}>{entry.chargeCode}</td>
//       <td className={`px-6 py-4 whitespace-pre-wrap text-base ${isHistory ? 'text-gray-500' : 'text-gray-700'}`}>{entry.notes}</td>
//       <td className={`px-6 py-4 whitespace-nowrap text-base ${isHistory ? 'text-gray-500' : 'text-gray-700'}`}>
//         {entry.pdfFilePath ? <a href={entry.pdfFilePath} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View PDF</a> : 'N/A'}
//       </td>
//       <td className={`px-6 py-4 whitespace-nowrap text-base ${isHistory ? 'text-gray-500' : 'text-gray-700'}`}>{entry.apvNumber || 'N/A'}</td>
//       <td className={`px-6 py-4 whitespace-nowrap text-base ${isHistory ? 'text-gray-500' : 'text-gray-700'}`}>{entry.accountingProcessed === 'T' ? 'Yes' : (entry.accountingProcessed === 'F' ? 'No' : 'N/A')}</td>
//       <td className={`px-6 py-4 whitespace-nowrap text-base ${isHistory ? 'text-gray-500' : 'text-gray-700'}`}>{formatDateForDisplay(entry.dateProcessed)}</td>
//     </React.Fragment>
//   );

//   return (
//     <>
//       <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-full">
//         {/* <div className="flex justify-between items-center mb-6">
//           <h1 className="text-4xl font-extrabold text-gray-800">
//             <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
//               All Data Entries
//             </span>
//           </h1>
//           <div className="flex items-center space-x-4">
//             <input
//               type="text"
//               placeholder="Search..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-64 p-3 border border-gray-300 rounded-full shadow-sm"
//             />
//             <button onClick={handleExport} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full shadow-lg">
//               {selectedRows.size > 0 ? `Export ${selectedRows.size} Selected` : 'Advanced Export'}
//             </button>
//             <button onClick={openAddDataModal} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full shadow-lg">Add Data</button>
//             <button onClick={openEditDataModal} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-full shadow-lg">Edit Data</button>
//           </div>
//         </div> */}

//         <div className="flex justify-between items-center mb-6">
//   <h1 className="text-4xl font-extrabold text-gray-800">
//     <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
//       All Data Entries
//     </span>
//   </h1>
//   <div className="flex items-center space-x-4">
//     {/* --- NEW ADVANCED SEARCH BAR --- */}
//     <div className="flex items-center border border-gray-300 rounded-full shadow-sm bg-white">
//         <select
//             value={searchColumn}
//             onChange={(e) => setSearchColumn(e.target.value)}
//             className="p-3 bg-gray-50 border-r border-gray-300 rounded-l-full focus:outline-none text-gray-600 appearance-none"
//         >
//             {searchableColumns.map(col => (
//                 <option key={col.key} value={col.key}>{col.name}</option>
//             ))}
//         </select>
//         <input
//             type="text"
//             placeholder={`Search in ${searchableColumns.find(c => c.key === searchColumn).name}...`}
//             value={searchValue}
//             onChange={(e) => setSearchValue(e.target.value)}
//             className="w-64 p-3 rounded-r-full focus:outline-none"
//         />
//     </div>

//     <button onClick={handleExport} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full shadow-lg">
//       {selectedRows.size > 0 ? `Export ${selectedRows.size} Selected` : 'Advanced Export'}
//     </button>
//     <button onClick={openAddDataModal} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full shadow-lg">Add Data</button>
//     <button onClick={openEditDataModal} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-full shadow-lg">Edit Data</button>
//   </div>
// </div>
        
//         {!isLoading && !error && (
//           <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-blue-600 text-white">
//                 <tr>
//                   <th scope="col" className="p-4">
//                     <input type="checkbox" onChange={handleSelectAll} checked={visibleEntryIds.length > 0 && selectedRows.size === visibleEntryIds.length} className="form-checkbox h-5 w-5"/>
//                   </th>
//                   <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Prime Key</th>
//                   <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Credit Card</th>
//                   <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Contract Short Name</th>
//                   <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Vendor Name</th>
//                   <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Charge Date</th>
//                   <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Charge Amount</th>
//                   <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Submitted Date</th>
//                   <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Submitter</th>
//                   <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Charge Code</th>
//                   <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Notes</th>
//                   <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">PDF</th>
//                   <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">APV Number</th>
//                   <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Accounting Processed</th>
//                   <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Date Processed</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {isLoading && <tr><td colSpan="15" className="text-center py-4">Loading...</td></tr>}
//                 {error && <tr><td colSpan="15" className="text-center py-4 text-red-500">{error}</td></tr>}
//                 {!isLoading && !error && groupedEntries.length > 0 ? (
//                   groupedEntries.map((group) => {
//                     const latestEntry = group[0];
//                     const baseKey = String(latestEntry.primeKey).split('.')[0];
//                     const isExpanded = expandedRows.has(baseKey);
//                     const hasHistory = group.length > 1;
//                     return (
//                       <React.Fragment key={baseKey}>
//                         <tr className="hover:bg-gray-50">
//                             {/* This is the crucial fix: The first row now correctly includes the chevron button */}
//                             <td className="p-4"><input type="checkbox" checked={selectedRows.has(latestEntry.id)} onChange={() => handleSelectRow(latestEntry.id)} className="form-checkbox h-5 w-5"/></td>
//                             <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-900">
//                                 <div className="flex items-center gap-2">
//                                 {hasHistory ? <button onClick={() => toggleRowExpansion(baseKey)} className="p-0.5 rounded-full hover:bg-gray-200">{isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}</button> : <span className="w-[28px]" />}
//                                 <span>{latestEntry.primeKey}</span>
//                                 </div>
//                             </td>
//                             <td className="px-6 py-4">{latestEntry.creditCard}</td>
//                             <td className="px-6 py-4">{latestEntry.contractShortName}</td>
//                             <td className="px-6 py-4">{latestEntry.vendorName}</td>
//                             <td className="px-6 py-4">{formatDateForDisplay(latestEntry.chargeDate)}</td>
//                             <td className="px-6 py-4">${latestEntry.chargeAmount ? parseFloat(latestEntry.chargeAmount).toFixed(2) : '0.00'}</td>
//                             <td className="px-6 py-4">{formatDateForDisplay(latestEntry.submittedDate)}</td>
//                             <td className="px-6 py-4">{latestEntry.submitter}</td>
//                             <td className="px-6 py-4">{latestEntry.chargeCode}</td>
//                             <td className="px-6 py-4">{latestEntry.notes}</td>
//                             <td className="px-6 py-4">{latestEntry.pdfFilePath ? <a href={latestEntry.pdfFilePath} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View PDF</a> : 'N/A'}</td>
//                             <td className="px-6 py-4">{latestEntry.apvNumber || 'N/A'}</td>
//                             <td className="px-6 py-4">{latestEntry.accountingProcessed === 'T' ? 'Yes' : 'No'}</td>
//                             <td className="px-6 py-4">{formatDateForDisplay(latestEntry.dateProcessed)}</td>
//                         </tr>
//                         {isExpanded && group.slice(1).map(entry => (
//                           <tr key={entry.id} className="bg-gray-50 hover:bg-gray-100"><Row entry={entry} isHistory={true} /></tr>
//                         ))}
//                       </React.Fragment>
//                     );
//                   })
//                 ) : (
//                   <tr><td colSpan="15" className="px-6 py-4 text-center text-gray-600 italic">No entries found.</td></tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default ViewPage;


// STABLE 2 END ///


/// 


// Deployed version below

// import React, { useState, useMemo } from 'react';
// // import { ChevronDown, ChevronRight, Plus, Pencil, Download, Search } from 'lucide-react';
// import { ChevronDown, ChevronRight, Plus, Pencil, Download, Search, LogOut } from 'lucide-react';


// import * as XLSX from 'xlsx';

// const formatDateForDisplay = (isoString) => {
//   if (!isoString) return '';
//   const date = new Date(isoString);
//   if (isNaN(date.getTime())) return 'Invalid Date';
//   return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' , timeZone: 'UTC'});
// };

// // const ViewPage = ({ dataEntries, isLoading, error, openAddDataModal, openEditDataModal, openExportModal }) => {
//   const ViewPage = ({ dataEntries, isLoading, error, openAddDataModal, openEditDataModal, openExportModal, userName = 'User',userAvatar,handleLogout, currentUserRole, }) => {
//   const [searchColumn, setSearchColumn] = useState('all');
//   const [searchValue, setSearchValue] = useState('');
//   const [showOnlyLatest, setShowOnlyLatest] = useState(false);
//   const [expandedRows, setExpandedRows] = useState(new Set());
//   const [selectedRows, setSelectedRows] = useState(new Set());
//   const [isExporting, setIsExporting] = useState(false);

//   const searchableColumns = [
//     { key: 'all', name: 'All Fields' },
//     { key: 'creditCard', name: 'Credit Card' },
//     { key: 'contractShortName', name: 'Contract' },
//     { key: 'vendorName', name: 'Vendor' },
//     { key: 'submitter', name: 'Submitter' },
//     { key: 'chargeAmount', name: 'Amount' },
//     { key: 'chargeDate', name: 'Charge Date' },
//   ];

//   const groupedEntries = useMemo(() => {
//     if (!dataEntries) return [];
    
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
//               (String(value) || '').toLowerCase().includes(lowercasedValue)
//             );
//           } else {
//             const entryValue = searchColumn.includes('Date')
//               ? formatDateForDisplay(entry[searchColumn])
//               : String(entry[searchColumn] || '');
//             return entryValue.toLowerCase().includes(lowercasedValue);
//           }
//         })
//       );
//     }

//     if (showOnlyLatest) {
//       return filteredGroups.map(group => [group[0]]);
//     }

//     return filteredGroups;
//   }, [dataEntries, searchColumn, searchValue, showOnlyLatest]);

//   const visibleEntryIds = useMemo(() => groupedEntries.flat().map(entry => entry.id), [groupedEntries]);

//   const handleSelectAll = (e) => {
//     if (e.target.checked) {
//       setSelectedRows(new Set(visibleEntryIds));
//     } else {
//       setSelectedRows(new Set());
//     }
//   };

//   const handleSelectRow = (id) => {
//     const newSelectedRows = new Set(selectedRows);
//     const entryToToggle = dataEntries.find(e => e.id === id);
//     if (!entryToToggle) return;

//     if (newSelectedRows.has(id)) {
//       newSelectedRows.delete(id);
//     } else {
//       newSelectedRows.add(id);
//       const baseKey = String(entryToToggle.primeKey).split('.')[0];
//       setExpandedRows(prevExpanded => {
//         if (prevExpanded.has(baseKey)) {
//           return prevExpanded;
//         }
//         const newExpanded = new Set(prevExpanded);
//         newExpanded.add(baseKey);
//         return newExpanded;
//       });
//     }
//     setSelectedRows(newSelectedRows);
//   };

//   // const handleExport = () => {
//   //   let dataToExport;
//   //   if (selectedRows.size > 0) {
//   //     dataToExport = dataEntries.filter(entry => selectedRows.has(entry.id));
//   //     if (dataToExport.length === 0) {
//   //       alert("No rows selected for export.");
//   //       return;
//   //     }
//   //     const dataForSheet = dataToExport.map(entry => ({
//   //       "Prime Key": entry.primeKey,
//   //       "Credit Card": entry.creditCard,
//   //       "Contract Short Name": entry.contractShortName,
//   //       "Vendor Name": entry.vendorName,
//   //       "Charge Date": formatDateForDisplay(entry.chargeDate),
//   //       "Charge Amount": entry.chargeAmount,
//   //       "Submitted Date": formatDateForDisplay(entry.submittedDate),
//   //       "Submitter": entry.submitter,
//   //       "Charge Code": entry.chargeCode,
//   //       "Notes": entry.notes,
//   //       "PDF File Path": entry.pdfFilePath,
//   //       "APV Number": entry.apvNumber,
//   //       "Accounting Processed": entry.accountingProcessed === 'T' ? 'Yes' : 'No',
//   //       "Date Processed": formatDateForDisplay(entry.dateProcessed),
//   //     }));
//   //     const worksheet = XLSX.utils.json_to_sheet(dataForSheet);
//   //     const workbook = XLSX.utils.book_new();
//   //     XLSX.utils.book_append_sheet(workbook, worksheet, "SelectedData");
//   //     XLSX.writeFile(workbook, "LuminaSelectionExport.xlsx");
//   //   } else {
//   //     openExportModal();
//   //   }
//   // };
//   const handleExport = async () => {
//   if (selectedRows.size > 0) {
//     setIsExporting(true);
//     try {
//       const dataToExport = dataEntries.filter(entry => selectedRows.has(entry.id));
//       if (dataToExport.length === 0) {
//         alert("No rows selected for export.");
//         return;
//       }

//       // Prepare data with the correct headers, changing "Prime Key" to "Record No"
//       const dataForSheet = dataToExport.map(entry => ({
//         "Record No": entry.primeKey, // Changed header
//         "Credit Card": entry.creditCard,
//         "Contract Short Name": entry.contractShortName,
//         "Vendor Name": entry.vendorName,
//         "Charge Date": formatDateForDisplay(entry.chargeDate),
//         "Charge Amount": entry.chargeAmount,
//         "Submitted Date": formatDateForDisplay(entry.submittedDate),
//         "Submitter": entry.submitter,
//         "Charge Code": entry.chargeCode,
//         "Notes": entry.notes,
//         "PDF File Path": entry.pdfFilePath,
//         "APV Number": entry.apvNumber,
//         "Accounting Processed": entry.accountingProcessed === 'T' ? 'Yes' : 'No',
//         "Date Processed": formatDateForDisplay(entry.dateProcessed),
//       }));

//       // Call the backend to generate the Excel file
//       // const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
//       const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/entries`;
//       const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/generate-excel`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ data: dataForSheet }),
//       });

//       if (!response.ok) {
//         throw new Error('Server failed to generate the Excel file.');
//       }

//       // Receive the file and trigger the download
//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = 'LuminaSelectionExport.xlsx';
//       document.body.appendChild(a);
//       a.click();
//       window.URL.revokeObjectURL(url);
//       a.remove();

//     } catch (err) {
//       console.error("Error exporting selected data:", err);
//       alert("An error occurred while exporting the data.");
//     } finally {
//       setIsExporting(false);
//     }
//   } else {
//     // If no rows are selected, open the advanced export modal as before
//     openExportModal();
//   }
// };

//   const toggleRowExpansion = (baseKey) => {
//     setExpandedRows(prev => {
//       const newSet = new Set(prev);
//       if (newSet.has(baseKey)) newSet.delete(baseKey);
//       else newSet.add(baseKey);
//       return newSet;
//     });
//   };

//   const Row = ({ entry }) => (
//     <React.Fragment>
//         <td className="p-0">
//             <label className="flex items-center justify-center p-4 cursor-pointer">
//                 <input
//                     type="checkbox"
//                     className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                     checked={selectedRows.has(entry.id)}
//                     onChange={() => handleSelectRow(entry.id)}
//                 />
//             </label>
//         </td>
//         <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500 pl-12">{entry.primeKey}</td>
//         <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{entry.creditCard}</td>
//         <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{entry.contractShortName}</td>
//         <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{entry.vendorName}</td>
//         <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{formatDateForDisplay(entry.chargeDate)}</td>
//         <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">${entry.chargeAmount ? parseFloat(entry.chargeAmount).toFixed(2) : '0.00'}</td>
//         <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{formatDateForDisplay(entry.submittedDate)}</td>
//         <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{entry.submitter}</td>
//         <td className="px-6 py-3 whitespace-pre-wrap text-sm text-gray-500">{entry.chargeCode}</td>
//         <td className="px-6 py-3 whitespace-pre-wrap text-sm text-gray-500">{entry.notes}</td>
//         <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
//             {entry.pdfFilePath ? <a href={entry.pdfFilePath} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View PDF</a> : 'N/A'}
//         </td>
//         <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{entry.apvNumber || 'N/A'}</td>
//         <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{entry.accountingProcessed === 'T' ? 'Yes' : (entry.accountingProcessed === 'F' ? 'No' : 'N/A')}</td>
        
//         <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{formatDateForDisplay(entry.paidDt)}</td>
//     </React.Fragment>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 sm:p-6 lg:p-8 text-gray-100 flex justify-center items-start">
//         <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-full">
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
//                 <h1 className="text-3xl font-extrabold">
//                     <span className="block text-transparent bg-clip-text text-lime-800">
//                         Expense Entries
//                     </span>
//                 </h1>
//                 {/* Center Column: Your Logo */}
//     <div className="w-1/3 flex justify-end">
//         {/*
//           **ADD YOUR LOGO HERE**
//           - Place your logo file (e.g., 'logo.png') in the 'public' folder.
//           - Change the 'src' path below to match your logo's filename.
//         */}
//         <img 
//             src="\Lumina_logo.png" 
//             alt="Lumina Logo" 
//             // className="h-12 opacity-100 transform -translate-x-2" 
//             // // Adjust height and opacity as needed
//             className="h-12 opacity-100 pr-12"

//         />
//     </div>
//                       {/* <div className="w-1/3 flex justify-end items-center gap-4">
//     <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-lg translate-x-2"> */}
//         {/* {userAvatar ? (
//             <img src={userAvatar} alt="User Avatar" className="w-10 h-10 rounded-full object-cover" />
//         ) :
//          (
//             <UserCircle size={32} className="text-gray-500" />
//         )} */}
//               {/* <img 
//           src={userAvatar} 
//           alt="User Avatar" 
//           className="w-10 h-10 rounded-full object-cover border border-gray-300 shadow-sm" 
// />
//         <span className="text-lg font-medium text-gray-700 hidden sm:block">
//             Welcome, {userName}
//         </span>
//     </div>
//     <button 
//         onClick={handleLogout} 
//         className="p-3 bg-red-100 hover:bg-red-200 rounded-full text-red-600 transition-colors"
//         title="Logout"
//     >
//         <LogOut size={20} />
//     </button>
// </div> */}
// <div className="w-1/3 flex justify-end items-center gap-4">
//   <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-lg translate-x-2">
//     <img 
//       src={userAvatar} 
//       alt="User Avatar" 
//       className="w-10 h-10 rounded-full object-cover border border-gray-300 shadow-sm" 
//     />
//     <span className="text-lg font-medium text-gray-700 hidden sm:block">
//       Welcome, {userName}
//     </span>
//   </div>
//   <button 
//     onClick={handleLogout} 
//     className="p-3 bg-red-100 hover:bg-red-200 rounded-full text-red-600 transition-colors"
//     title="Logout"
//   >
//     <LogOut size={20} />
//   </button>
// </div>
//             </div>

//             <div className="flex flex-col md:flex-row justify-between items-center bg-gray-100 p-4 rounded-lg shadow-sm mb-6 gap-3">
//                 <div className="flex items-center border border-gray-300 rounded-lg bg-white shadow-sm flex-grow">
//                     <select
//                         value={searchColumn}
//                         onChange={(e) => setSearchColumn(e.target.value)}
//                         className="py-2 pl-3 pr-8 bg-transparent border-r border-gray-200 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm text-gray-700 appearance-none transition-all duration-200"
//                     >
//                         {searchableColumns.map(col => (
//                             <option key={col.key} value={col.key}>{col.name}</option>
//                         ))}
//                     </select>
//                     <input
//                         type="text"
//                         placeholder={`Search in ${searchableColumns.find(c => c.key === searchColumn).name}...`}
//                         value={searchValue}
//                         onChange={(e) => setSearchValue(e.target.value)}
//                         className="w-full p-2 rounded-r-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm text-gray-800 transition-all duration-200"
//                     />
//                     <Search size={18} className="text-gray-400 mr-3 hidden sm:block" />
//                 </div>

//                 <label htmlFor="latest-toggle" className="flex items-center cursor-pointer p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors duration-200">
//                     <div className="relative">
//                         <input 
//                             type="checkbox" 
//                             id="latest-toggle" 
//                             className="sr-only peer" 
//                             checked={showOnlyLatest}
//                             onChange={(e) => setShowOnlyLatest(e.target.checked)}
//                         />
//                         <div className="block bg-gray-400 w-12 h-7 rounded-full peer-checked:bg-blue-600 transition-all duration-300"></div>
//                         <div className="dot absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-all duration-300 transform peer-checked:translate-x-full"></div>
//                     </div>
//                     <div className="ml-3 text-sm font-medium text-gray-800">
//                         Show Latest Only
//                     </div>
//                 </label>
//             </div>

//             <div className="flex flex-wrap justify-start items-center gap-3 mb-6">
//               {currentUserRole !== 'accountant' && (
//                 <>
//                 <button onClick={openAddDataModal} className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold py-2.5 px-5 rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:-translate-y-0.5">
//                     <Plus size={20} />
//                     Add 
//                 </button>
//                 <button onClick={openEditDataModal} className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold py-2.5 px-5 rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:-translate-y-0.5">
//                     <Pencil size={20} />
//                     Edit 
//                 </button>
//                 </>
//               )}
//                 <button onClick={handleExport}
//                 disabled={isExporting}
//                 className="flex items-center gap-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-2.5 px-5 rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:-translate-y-0.5 disabled:opacity-50" // <-- Add disabled style
// >
//                  {/* className="flex items-center gap-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-2.5 px-5 rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:-translate-y-0.5"> */}
//                     <Download size={20} />
//                     {isExporting 
//         ? 'Exporting...' 
//         : (selectedRows.size > 0 ? `Export ${selectedRows.size} Selected` : 'Advanced Search')
//     }
//                     {/* {selectedRows.size > 0 ? `Export ${selectedRows.size}` : 'Advanced Export'} */}
//                 </button>
//             </div>
            
//             <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200">
//                 <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-100">
//                         <tr>
//                             <th scope="col" className="p-0 w-12">
//                                 <label className="flex items-center justify-center p-4 cursor-pointer">
//                                     <input type="checkbox" onChange={handleSelectAll} checked={visibleEntryIds.length > 0 && selectedRows.size === visibleEntryIds.length} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
//                                 </label>
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600  tracking-wider">Record No</th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600  tracking-wider">Credit Card</th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600  tracking-wider">Contract</th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600  tracking-wider">Vendor</th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600  tracking-wider">Charge Date</th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600  tracking-wider">Amount</th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600  tracking-wider">Submitted Date</th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600  tracking-wider">Submitter</th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600  tracking-wider">Charge Code</th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600  tracking-wider">Notes</th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600  tracking-wider">PDF</th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600  tracking-wider">APV Number</th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600  tracking-wider">Processed</th>
                            
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 tracking-wider">Paid Date</th>
//                         </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-100">
//                         {isLoading && <tr><td colSpan="15" className="text-center p-6 text-gray-500">Loading...</td></tr>}
//                         {error && <tr><td colSpan="15" className="text-center p-6 text-red-600">{error}</td></tr>}
//                         {!isLoading && !error && groupedEntries.length > 0 ? (
//                             groupedEntries.map((group, groupIndex) => {
//                                 const latestEntry = group[0];
//                                 const baseKey = String(latestEntry.primeKey).split('.')[0];
//                                 const isExpanded = expandedRows.has(baseKey);
//                                 const hasHistory = group.length > 1;

//                                 return (
//                                     <React.Fragment key={baseKey}>
//                                         <tr className={`
//                                             ${groupIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'} 
//                                             hover:bg-blue-50 transition-colors duration-150 ease-in-out
//                                         `}>
//                                             <td className="p-0">
//                                                 <label className="flex items-center justify-center p-4 cursor-pointer">
//                                                     <input type="checkbox" checked={selectedRows.has(latestEntry.id)} onChange={() => handleSelectRow(latestEntry.id)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
//                                                 </label>
//                                             </td>
//                                             <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
//                                                 <div className="flex items-center gap-2">
//                                                     {hasHistory ? <button onClick={() => toggleRowExpansion(baseKey)} className="p-1 rounded-md hover:bg-gray-200 text-gray-600">{isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</button> : <span className="w-[28px]" />}
//                                                     <span>{latestEntry.primeKey}</span>
//                                                 </div>
//                                             </td>
//                                             <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">{latestEntry.creditCard}</td>
//                                             <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">{latestEntry.contractShortName}</td>
//                                             <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">{latestEntry.vendorName}</td>
//                                             <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">{formatDateForDisplay(latestEntry.chargeDate)}</td>
//                                             <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">${latestEntry.chargeAmount ? parseFloat(latestEntry.chargeAmount).toFixed(2) : '0.00'}</td>
//                                             <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">{formatDateForDisplay(latestEntry.submittedDate)}</td>
//                                             <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">{latestEntry.submitter}</td>
//                                             <td className="px-6 py-3 whitespace-pre-wrap text-sm text-gray-700">{latestEntry.chargeCode}</td>
//                                             <td className="px-6 py-3 whitespace-pre-wrap text-sm text-gray-700">{latestEntry.notes}</td>
//                                             <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">{latestEntry.pdfFilePath ? <a href={latestEntry.pdfFilePath} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View PDF</a> : 'N/A'}</td>
//                                             <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">{latestEntry.apvNumber || 'N/A'}</td>
//                                             <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">{latestEntry.accountingProcessed === 'T' ? 'Yes' : 'No'}</td> 
//                                             <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">{formatDateForDisplay(latestEntry.paidDt)}</td>
//                                         </tr>
//                                         {isExpanded && group.slice(1).map((entry, historyIndex) => (
//                                             <tr key={entry.id} className={`
//                                                 bg-gray-100 hover:bg-gray-200 transition-colors duration-150 ease-in-out
//                                             `}>
//                                                 <Row entry={entry} />
//                                             </tr>
//                                         ))}
//                                     </React.Fragment>
//                                 );
//                             })
//                         ) : (
//                             <tr><td colSpan="15" className="text-center p-6 text-gray-500 italic">No entries found.</td></tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     </div>
//   );
// };

// export default ViewPage;


import React, { useState, useMemo, useEffect } from 'react';
import { ChevronDown, ChevronRight, Plus, Pencil, Download, Search, LogOut, X, Save } from 'lucide-react';
import * as XLSX from 'xlsx';

const formatDateForDisplay = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return 'Invalid Date';
  return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'UTC' });
};

const ViewPage = ({ 
  dataEntries, 
  isLoading, 
  error, 
  userName = 'User', 
  userAvatar, 
  handleLogout, 
  currentUserRole,
  currentUserId,
  onDataChanged,
  contractOptions = [],
  creditCardOptions = []
}) => {
  const [searchColumn, setSearchColumn] = useState('all');
  const [searchValue, setSearchValue] = useState('');
  const [showOnlyLatest, setShowOnlyLatest] = useState(false);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [isExporting, setIsExporting] = useState(false);

  // --- DEMO CACHE LOGIC ---
  const [localEntries, setLocalEntries] = useState([]);

  useEffect(() => {
    setLocalEntries(dataEntries || []);
  }, [dataEntries]);

  // --- INLINE FORM STATE ---
  const [isAdding, setIsAdding] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [formData, setFormData] = useState({
    creditCard: '', // Displayed as Vendor ID
    contractShortName: '',
    vendorName: '',
    chargeDate: '',
    chargeAmount: '',
    submittedDate: '',
    pmEmail: '',
    chargeCode: '',
    isApproved: false,
    notes: '',
    pdfFilePath: '',
  });

  const pmEmailOptions = [
    'pm.manager1@infotrend.com',
    'pm.manager2@infotrend.com',
    'admin.finance@infotrend.com',
    'operations.lead@infotrend.com'
  ];

  const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/entries`;

  const searchableColumns = [
    { key: 'all', name: 'All Fields' },
    { key: 'creditCard', name: 'Vendor ID' },
    { key: 'contractShortName', name: 'Contract' },
    { key: 'vendorName', name: 'Vendor' },
    { key: 'submitter', name: 'Submitter' },
  ];

  const groupedEntries = useMemo(() => {
    const groups = localEntries.reduce((acc, entry) => {
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
              (String(value) || '').toLowerCase().includes(lowercasedValue)
            );
          } else {
            return String(entry[searchColumn] || '').toLowerCase().includes(lowercasedValue);
          }
        })
      );
    }

    return showOnlyLatest ? filteredGroups.map(group => [group[0]]) : filteredGroups;
  }, [localEntries, searchColumn, searchValue, showOnlyLatest]);

  const visibleEntryIds = useMemo(() => groupedEntries.flat().map(entry => entry.id), [groupedEntries]);

  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [id]: type === 'checkbox' ? checked : value }));
  };

  const resetForm = () => {
    setFormData({
      creditCard: '', contractShortName: '', vendorName: '', chargeDate: '',
      chargeAmount: '', submittedDate: '', pmEmail: '', chargeCode: '',
      isApproved: false, notes: '', pdfFilePath: ''
    });
    setIsAdding(false);
    setEditingEntry(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const newRecord = {
      ...formData,
      id: editingEntry ? editingEntry.id : Date.now(),
      submitter: userName,
      primeKey: editingEntry ? editingEntry.primeKey : (localEntries.length + 101).toString()
    };

    // Update Cache
    if (editingEntry) {
      setLocalEntries(prev => prev.map(en => en.id === editingEntry.id ? newRecord : en));
    } else {
      setLocalEntries(prev => [newRecord, ...prev]);
    }

    // API Call
    const method = editingEntry ? 'PATCH' : 'POST';
    const url = editingEntry ? `${API_BASE_URL}/${editingEntry.id}` : `${API_BASE_URL}/new`;
    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userId: currentUserId, submitter: userName }),
      });
      if (onDataChanged) onDataChanged();
    } catch (err) {
      console.warn("Backend failed, kept in demo cache.");
    }
    resetForm();
  };

  const startEdit = () => {
    const entryId = Array.from(selectedRows)[0];
    const entry = localEntries.find(e => e.id === entryId);
    if (entry) {
      setEditingEntry(entry);
      setFormData({
        creditCard: entry.creditCard || '',
        contractShortName: entry.contractShortName || '',
        vendorName: entry.vendorName || '',
        chargeDate: entry.chargeDate ? entry.chargeDate.split('T')[0] : '',
        chargeAmount: entry.chargeAmount || '',
        submittedDate: entry.submittedDate ? entry.submittedDate.split('T')[0] : '',
        pmEmail: entry.pmEmail || '',
        chargeCode: entry.chargeCode || '',
        isApproved: entry.isApproved || false,
        notes: entry.notes || '',
        pdfFilePath: entry.pdfFilePath || '',
      });
      setIsAdding(false);
    }
  };

  const Row = ({ entry, isHistory = false }) => (
    <React.Fragment>
        <td className="p-0 text-center">
            <label className="flex items-center justify-center p-4 cursor-pointer">
                <input type="checkbox" checked={selectedRows.has(entry.id)} onChange={() => {
                   const next = new Set(selectedRows);
                   next.has(entry.id) ? next.delete(entry.id) : next.add(entry.id);
                   setSelectedRows(next);
                }} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
            </label>
        </td>
        <td className={`px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900 ${isHistory ? 'pl-12' : ''}`}>
            {!isHistory && groupedEntries.find(g => g[0].id === entry.id)?.length > 1 ? (
              <button onClick={() => {
                const baseKey = String(entry.primeKey).split('.')[0];
                const next = new Set(expandedRows);
                next.has(baseKey) ? next.delete(baseKey) : next.add(baseKey);
                setExpandedRows(next);
              }} className="mr-2 inline-block">
                {expandedRows.has(String(entry.primeKey).split('.')[0]) ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
              </button>
            ) : isHistory ? null : <span className="w-6 inline-block"/>}
            {entry.primeKey}
        </td>
        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">{entry.creditCard}</td>
        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">{entry.contractShortName}</td>
        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">{entry.vendorName}</td>
        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">{formatDateForDisplay(entry.chargeDate)}</td>
        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">${parseFloat(entry.chargeAmount || 0).toFixed(2)}</td>
        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">{entry.submitter}</td>
        <td className="px-6 py-3 whitespace-nowrap text-sm text-blue-600">
            {entry.pdfFilePath ? <a href={entry.pdfFilePath} target="_blank" rel="noreferrer" className="hover:underline">View PDF</a> : 'N/A'}
        </td>
        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">{entry.apvNumber || 'N/A'}</td>
        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">{entry.accountingProcessed === 'T' ? 'Yes' : 'No'}</td>
    </React.Fragment>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 sm:p-6 lg:p-8 text-gray-100 flex justify-center items-start">
        <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-full text-gray-800">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-3xl font-extrabold text-black-800">Voucher Expense Entries</h1>
                <div className="flex items-center gap-4">
                    <img src="/Lumina_logo.png" alt="Logo" className="h-10 pr-4" />
                    <div className="flex items-center gap-3 bg-gray-100 p-2 rounded-lg">
                        <img src={userAvatar} alt="Avatar" className="w-10 h-10 rounded-full border" />
                        <span className="font-medium text-gray-700">Welcome, {userName}</span>
                    </div>
                    <button onClick={handleLogout} className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"><LogOut size={20}/></button>
                </div>
            </div>

            {/* Inline Form */}
            {(isAdding || editingEntry) && (
              <div className="mb-8 p-6 border-2 border-blue-200 rounded-xl bg-blue-50 animate-in fade-in slide-in-from-top-4">
                <div className="flex justify-between items-center mb-4 text-blue-900">
                  <h2 className="text-xl font-bold">{editingEntry ? 'Edit Entry' : 'Add New Entry'}</h2>
                  <button onClick={resetForm} className="text-gray-500 hover:text-red-500"><X /></button>
                </div>
                <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-1">VENDOR ID *</label>
                    <select id="creditCard" className="w-full p-2 border rounded" value={formData.creditCard} onChange={handleInputChange} required>
                      <option value="">Select Vendor ID</option>
                      {creditCardOptions.map(opt => <option key={opt.id} value={opt.name}>{opt.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">CONTRACT *</label>
                    <select id="contractShortName" className="w-full p-2 border rounded" value={formData.contractShortName} onChange={handleInputChange} required>
                      <option value="">Select Contract</option>
                      {contractOptions.map(opt => <option key={opt.id} value={opt.name}>{opt.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">VENDOR NAME *</label>
                    <input id="vendorName" type="text" className="w-full p-2 border rounded" value={formData.vendorName} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">AMOUNT *</label>
                    <input id="chargeAmount" type="number" step="0.01" className="w-full p-2 border rounded" value={formData.chargeAmount} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">CHARGE DATE *</label>
                    <input id="chargeDate" type="date" className="w-full p-2 border rounded" value={formData.chargeDate} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">SUBMITTED DATE *</label>
                    <input id="submittedDate" type="date" className="w-full p-2 border rounded" value={formData.submittedDate} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">PM EMAIL *</label>
                    <select id="pmEmail" className="w-full p-2 border rounded" value={formData.pmEmail} onChange={handleInputChange} required>
                      <option value="">Select PM Email</option>
                      {pmEmailOptions.map(email => <option key={email} value={email}>{email}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">PDF PATH *</label>
                    <input id="pdfFilePath" type="text" className="w-full p-2 border rounded" value={formData.pdfFilePath} onChange={handleInputChange} required />
                  </div>
                  <div className="lg:col-span-2">
                    <label className="block text-xs font-bold mb-1">CHARGE CODE *</label>
                    <textarea id="chargeCode" rows="1" className="w-full p-2 border rounded" value={formData.chargeCode} onChange={handleInputChange} required />
                  </div>
                  <div className="lg:col-span-2 flex items-center gap-3 bg-white p-2 rounded border border-blue-200">
                    <input type="checkbox" id="isApproved" checked={formData.isApproved} onChange={handleInputChange} className="w-5 h-5 cursor-pointer" />
                    <label htmlFor="isApproved" className="text-xs font-bold text-blue-800 uppercase cursor-pointer">Program Manager Approver</label>
                  </div>
                  <div className="lg:col-span-4 flex justify-end">
                    <button type="submit" className="bg-blue-600 text-white px-8 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
                      <Save size={18}/> {editingEntry ? 'Update' : 'Save'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-gray-100 p-4 rounded-lg mb-6 gap-3">
                <div className="flex items-center border rounded-lg bg-white flex-grow">
                    <select value={searchColumn} onChange={(e) => setSearchColumn(e.target.value)} className="p-2 bg-transparent border-r text-sm">
                        {searchableColumns.map(col => <option key={col.key} value={col.key}>{col.name}</option>)}
                    </select>
                    <input type="text" placeholder="Search..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)} className="w-full p-2 text-sm focus:outline-none" />
                    <Search size={18} className="text-gray-400 mr-3" />
                </div>
                <label className="flex items-center cursor-pointer gap-3 text-sm font-medium">
                    Show Latest Only
                    <input type="checkbox" checked={showOnlyLatest} onChange={(e) => setShowOnlyLatest(e.target.checked)} className="w-4 h-4" />
                </label>
            </div>

            <div className="flex gap-3 mb-6">
                {!isAdding && !editingEntry && (
                  <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 bg-yellow-500 text-white px-5 py-2.5 rounded-lg hover:bg-yellow-600 transition"><Plus size={20}/> Add</button>
                )}
                <button onClick={startEdit} disabled={selectedRows.size !== 1} className="flex items-center gap-2 bg-gray-600 text-white px-5 py-2.5 rounded-lg disabled:opacity-50"><Pencil size={20}/> Edit</button>
                <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg"><Download size={20}/> Export</button>
            </div>
            
            {/* Table */}
            <div className="overflow-x-auto rounded-lg border">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-4 w-12 text-center">
                              <input type="checkbox" onChange={(e) => setSelectedRows(e.target.checked ? new Set(visibleEntryIds) : new Set())} checked={visibleEntryIds.length > 0 && selectedRows.size === visibleEntryIds.length} />
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Record No</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Vendor ID</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Contract</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Vendor</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Charge Date</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Submitter</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">PDF</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">APV No</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Done</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y">
                        {groupedEntries.map((group, gIdx) => (
                            <React.Fragment key={group[0].id}>
                                <tr className="hover:bg-blue-50 transition-colors">
                                    <Row entry={group[0]} />
                                </tr>
                                {expandedRows.has(String(group[0].primeKey).split('.')[0]) && group.slice(1).map(hEntry => (
                                    <tr key={hEntry.id} className="bg-gray-50 border-l-4 border-blue-400">
                                        <Row entry={hEntry} isHistory={true} />
                                    </tr>
                                ))}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};

export default ViewPage;
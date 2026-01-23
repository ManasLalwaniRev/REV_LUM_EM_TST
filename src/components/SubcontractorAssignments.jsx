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

// // const SubcontractorAssignments = ({ dataEntries, isLoading, error, openAddDataModal, openEditDataModal, openExportModal }) => {
//   const SubcontractorAssignments = ({ dataEntries, isLoading, error, openAddDataModal, openEditDataModal, openExportModal, userName = 'User',userAvatar,handleLogout, currentUserRole, }) => {
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

// export default SubcontractorAssignments;



// import React, { useState, useMemo } from 'react';
// import { Plus, Pencil, Download, Search, LogOut } from 'lucide-react';
// import * as XLSX from 'xlsx';

// const SubcontractorAssignments = ({ 
//   dataEntries, 
//   isLoading, 
//   error, 
//   openAddSubkModal, 
//   openEditDataModal, 
//   openExportModal, 
//   userName = 'User', 
//   userAvatar, 
//   handleLogout, 
//   currentUserRole 
// }) => {
//   const [searchColumn, setSearchColumn] = useState('all');
//   const [searchValue, setSearchValue] = useState('');
//   const [selectedRows, setSelectedRows] = useState(new Set());
//   const [isExporting, setIsExporting] = useState(false);

//   // Updated searchable columns for the Subcontractor screen
//   const searchableColumns = [
//     { key: 'all', name: 'All Fields' },
//     { key: 'poNo', name: 'PO No.' },
//     { key: 'subkName', name: 'SubK Name' },
//     { key: 'employeeName', name: 'Employee Name' },
//     { key: 'projectCode', name: 'Project Code' },
//     { key: 'plc', name: 'PLC' },
//   ];

//   const filteredEntries = useMemo(() => {
//     if (!dataEntries) return [];
    
//     let filtered = dataEntries;

//     if (searchValue) {
//       const lowercasedValue = searchValue.toLowerCase();
//       filtered = filtered.filter(entry => {
//         if (searchColumn === 'all') {
//           return Object.values(entry).some(value => 
//             (String(value) || '').toLowerCase().includes(lowercasedValue)
//           );
//         } else {
//           return String(entry[searchColumn] || '').toLowerCase().includes(lowercasedValue);
//         }
//       });
//     }

//     return filtered;
//   }, [dataEntries, searchColumn, searchValue]);

//   const visibleEntryIds = useMemo(() => filteredEntries.map(entry => entry.id), [filteredEntries]);

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

//   const handleExport = async () => {
//     if (selectedRows.size > 0) {
//       setIsExporting(true);
//       try {
//         const dataToExport = dataEntries.filter(entry => selectedRows.has(entry.id));
//         const dataForSheet = dataToExport.map(entry => ({
//           "PO No.": entry.poNo,
//           "SubK Name": entry.subkName,
//           "New SubK Employee Name": entry.employeeName,
//           "Project Code": entry.projectCode,
//           "PLC": entry.plc,
//           "Submitter": entry.submitter,
//         }));

//         const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/generate-excel`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ data: dataForSheet }),
//         });

//         if (!response.ok) throw new Error('Export failed');

//         const blob = await response.blob();
//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = 'SubcontractorAssignmentsExport.xlsx';
//         document.body.appendChild(a);
//         a.click();
//         window.URL.revokeObjectURL(url);
//         a.remove();
//       } catch (err) {
//         console.error("Error exporting data:", err);
//       } finally {
//         setIsExporting(false);
//       }
//     } else {
//       openExportModal();
//     }
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
//         <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{entry.poNo || 'N/A'}</td>
//         <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{entry.subkName || 'N/A'}</td>
//         <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{entry.employeeName || 'N/A'}</td>
//         <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{entry.projectCode || 'N/A'}</td>
//         <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{entry.plc || 'N/A'}</td>
//         <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{entry.submitter || 'N/A'}</td>
//     </React.Fragment>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 sm:p-6 lg:p-8 text-gray-100 flex justify-center items-start">
//         <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-full">
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
//                 <h1 className="text-3xl font-extrabold">
//                     <span className="block text-transparent bg-clip-text text-lime-800">
//                         Subcontractor Assignments
//                     </span>
//                 </h1>
//                 <div className="w-1/3 flex justify-end">
//                     <img src="\Lumina_logo.png" alt="Lumina Logo" className="h-12 opacity-100 pr-12" />
//                 </div>
//                 <div className="w-1/3 flex justify-end items-center gap-4">
//                     <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-lg translate-x-2">
//                         <img 
//                           src={userAvatar} 
//                           alt="User Avatar" 
//                           className="w-10 h-10 rounded-full object-cover border border-gray-300 shadow-sm"
//                         />
//                         <span className="text-lg font-medium text-gray-700 hidden sm:block">
//                             Welcome, {userName}
//                         </span>
//                     </div>
//                     <button 
//                         onClick={handleLogout} 
//                         className="p-3 bg-red-100 hover:bg-red-200 rounded-full text-red-600 transition-colors"
//                         title="Logout"
//                     >
//                         <LogOut size={20} />
//                     </button>
//                 </div>
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
//             </div>

//             <div className="flex flex-wrap justify-start items-center gap-3 mb-6">
//               {currentUserRole !== 'accountant' && (
//                 <>
//                 <button onClick={openAddSubkModal} className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold py-2.5 px-5 rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:-translate-y-0.5">
//                     <Plus size={20} /> Add Assignment
//                 </button>
//                 {/* <button onClick={openEditDataModal} className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold py-2.5 px-5 rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:-translate-y-0.5">
//                     <Pencil size={20} /> Edit 
//                 </button> */}
//                 <button 
//                         onClick={() => {
//                           const entryId = Array.from(selectedRows)[0];
//                           const entry = dataEntries.find(e => e.id === entryId);
//                           if (entry) openEditSubkModal(entry);
//                           else alert("Please select a record to edit.");
//                         }}
//                         disabled={selectedRows.size !== 1} // Only allow editing one row at a time
//                         className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold py-2.5 px-5 rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:-translate-y-0.5"
//                       >
//                         <Pencil size={20} /> Edit 
//                       </button>

//                 </>
//               )}
//               {/* <button onClick={handleExport}
//                 disabled={isExporting}
//                 className="flex items-center gap-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-2.5 px-5 rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:-translate-y-0.5 disabled:opacity-50"
//               >
//                 <Download size={20} />
//                 {isExporting ? 'Exporting...' : (selectedRows.size > 0 ? `Export ${selectedRows.size} Selected` : 'Advanced Search')}
//               </button> */}
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
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 tracking-wider">PO No.</th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 tracking-wider">SubK Name</th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 tracking-wider">New SubK Employee Name</th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 tracking-wider">Project Code</th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 tracking-wider">PLC</th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 tracking-wider">Submitter</th>
//                         </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-100">
//                         {isLoading && <tr><td colSpan="7" className="text-center p-6 text-gray-500">Loading...</td></tr>}
//                         {error && <tr><td colSpan="7" className="text-center p-6 text-red-600">{error}</td></tr>}
//                         {!isLoading && !error && filteredEntries.length > 0 ? (
//                             filteredEntries.map((entry, index) => (
//                                 <tr key={entry.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors duration-150 ease-in-out`}>
//                                     <Row entry={entry} />
//                                 </tr>
//                             ))
//                         ) : (
//                             <tr><td colSpan="7" className="text-center p-6 text-gray-500 italic">No assignments found.</td></tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     </div>
//   );
// };

// export default SubcontractorAssignments;




////////////

import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Pencil, Download, Search, LogOut, X, Save } from 'lucide-react';
import * as XLSX from 'xlsx';

const SubcontractorAssignments = ({ 
  dataEntries, 
  isLoading, 
  error, 
  userName = 'User', 
  userAvatar, 
  handleLogout, 
  currentUserRole,
  onDataChanged 
}) => {
  const [searchColumn, setSearchColumn] = useState('all');
  const [searchValue, setSearchValue] = useState('');
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [isExporting, setIsExporting] = useState(false);
  
  // --- DEMO CACHE LOGIC ---
  // This local state acts as your "cache record" to show entries immediately
  const [localEntries, setLocalEntries] = useState([]);

  // Sync local cache whenever the main dataEntries prop changes
  useEffect(() => {
    setLocalEntries(dataEntries || []);
  }, [dataEntries]);

  // Local state for Inline Add/Edit features
  const [isAdding, setIsAdding] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [formData, setFormData] = useState({
    poNo: '',
    subkName: '',
    employeeName: '',
    projectCode: '',
    plc: ''
  });

  // const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/entries`;

  const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/subcontractor-assignments`;
  const searchableColumns = [
    { key: 'all', name: 'All Fields' },
    { key: 'poNo', name: 'PO No.' },
    { key: 'subkName', name: 'SubK Name' },
    { key: 'employeeName', name: 'Employee Name' },
    { key: 'projectCode', name: 'Project Code' },
    { key: 'plc', name: 'PLC' },
  ];

  // Filter localEntries (the cache) instead of dataEntries
  const filteredEntries = useMemo(() => {
    let filtered = localEntries;

    if (searchValue) {
      const lowercasedValue = searchValue.toLowerCase();
      filtered = filtered.filter(entry => {
        if (searchColumn === 'all') {
          return Object.values(entry).some(value => 
            (String(value) || '').toLowerCase().includes(lowercasedValue)
          );
        } else {
          return String(entry[searchColumn] || '').toLowerCase().includes(lowercasedValue);
        }
      });
    }

    return filtered;
  }, [localEntries, searchColumn, searchValue]);

  const visibleEntryIds = useMemo(() => filteredEntries.map(entry => entry.id), [filteredEntries]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(new Set(visibleEntryIds));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (id) => {
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(id)) {
      newSelectedRows.delete(id);
    } else {
      newSelectedRows.add(id);
    }
    setSelectedRows(newSelectedRows);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const resetForm = () => {
    setFormData({ poNo: '', subkName: '', employeeName: '', projectCode: '', plc: '' });
    setIsAdding(false);
    setEditingEntry(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    // 1. Create the "Cache Record" for immediate display
    const newRecord = {
      ...formData,
      id: editingEntry ? editingEntry.id : Date.now(), // Temporary ID for demo
      submitter: userName,
    };

    // 2. Update the local cache state immediately
    if (editingEntry) {
      setLocalEntries(prev => prev.map(en => en.id === editingEntry.id ? newRecord : en));
    } else {
      setLocalEntries(prev => [newRecord, ...prev]);
    }

    // 3. (Optional) Proceed with actual API call
    const method = editingEntry ? 'PATCH' : 'POST';
    const url = editingEntry ? `${API_BASE_URL}/${editingEntry.id}` : `${API_BASE_URL}/new`;
    
    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData, 
          submitter: userName,
          category: 'subcontractor' 
        }),
      });

      if (response.ok && onDataChanged) {
        onDataChanged(); // Keep parent in sync if API succeeds
      }
    } catch (err) {
      console.error("API failed, but record is kept in local cache for demo.", err);
    }

    resetForm();
  };

  const startEdit = () => {
    const entryId = Array.from(selectedRows)[0];
    const entry = localEntries.find(e => e.id === entryId);
    if (entry) {
      setEditingEntry(entry);
      setFormData({
        poNo: entry.poNo || '',
        subkName: entry.subkName || '',
        employeeName: entry.employeeName || '',
        projectCode: entry.projectCode || '',
        plc: entry.plc || ''
      });
      setIsAdding(false);
    }
  };

  const handleExport = async () => {
    if (selectedRows.size > 0) {
      setIsExporting(true);
      try {
        const dataToExport = localEntries.filter(entry => selectedRows.has(entry.id));
        const dataForSheet = dataToExport.map(entry => ({
          "PO No.": entry.poNo,
          "SubK Name": entry.subkName,
          "New SubK Employee Name": entry.employeeName,
          "Project Code": entry.projectCode,
          "PLC": entry.plc,
          "Submitter": entry.submitter,
        }));

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/generate-excel`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: dataForSheet }),
        });

        if (!response.ok) throw new Error('Export failed');

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'SubcontractorAssignmentsExport.xlsx';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      } catch (err) {
        console.error("Error exporting data:", err);
      } finally {
        setIsExporting(false);
      }
    }
  };

  const Row = ({ entry }) => (
    <React.Fragment>
        <td className="p-0">
            <label className="flex items-center justify-center p-4 cursor-pointer">
                <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={selectedRows.has(entry.id)}
                    onChange={() => handleSelectRow(entry.id)}
                />
            </label>
        </td>
        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">{entry.poNo || 'N/A'}</td>
        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">{entry.subkName || 'N/A'}</td>
        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">{entry.employeeName || 'N/A'}</td>
        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">{entry.projectCode || 'N/A'}</td>
        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">{entry.plc || 'N/A'}</td>
        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">{entry.submitter || 'N/A'}</td>
    </React.Fragment>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 sm:p-6 lg:p-8 text-gray-100 flex justify-center items-start">
        <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-3xl font-extrabold">
                    <span className="block text-transparent bg-clip-text text-black-800">
                        Subcontractor Assignments
                    </span>
                </h1>
                <div className="w-1/3 flex justify-end">
                    <img src="\Lumina_logo.png" alt="Lumina Logo" className="h-12 opacity-100 pr-12" />
                </div>
                <div className="w-1/3 flex justify-end items-center gap-4 text-gray-800">
                    <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-lg translate-x-2">
                        <img 
                          src={userAvatar} 
                          alt="User Avatar" 
                          className="w-10 h-10 rounded-full object-cover border border-gray-300 shadow-sm"
                        />
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

            {/* Inline Add/Edit Form Section */}
            {(isAdding || editingEntry) && (
              <div className="mb-8 p-6 border-2 border-yellow-200 rounded-xl bg-yellow-50 animate-in fade-in slide-in-from-top-4 text-gray-800">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-yellow-900">
                    {editingEntry ? 'Edit Subcontractor Assignment' : 'Add New Assignment'}
                  </h2>
                  <button onClick={resetForm} className="text-gray-500 hover:text-red-500"><X /></button>
                </div>
                <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">PO No.</label>
                    <input 
                      id="poNo" type="text" required
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500"
                      value={formData.poNo} onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">SubK Name</label>
                    <input 
                      id="subkName" type="text" required
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500"
                      value={formData.subkName} onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">New SubK Employee Name</label>
                    <input 
                      id="employeeName" type="text" required
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500"
                      value={formData.employeeName} onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Project Code</label>
                    <input 
                      id="projectCode" type="text" required
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500"
                      value={formData.projectCode} onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">PLC</label>
                    <input 
                      id="plc" type="text" required
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500"
                      value={formData.plc} onChange={handleInputChange}
                    />
                  </div>
                  <div className="lg:col-span-3 flex justify-end">
                    <button type="submit" className="flex items-center gap-2 bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition">
                      <Save size={18} /> {editingEntry ? 'Update' : 'Save'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-center bg-gray-100 p-4 rounded-lg shadow-sm mb-6 gap-3">
                <div className="flex items-center border border-gray-300 rounded-lg bg-white shadow-sm flex-grow">
                    <select
                        value={searchColumn}
                        onChange={(e) => setSearchColumn(e.target.value)}
                        className="py-2 pl-3 pr-8 bg-transparent border-r border-gray-200 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm text-gray-700 appearance-none transition-all duration-200"
                    >
                        {searchableColumns.map(col => (
                            <option key={col.key} value={col.key}>{col.name}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder={`Search in ${searchableColumns.find(c => c.key === searchColumn).name}...`}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="w-full p-2 rounded-r-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm text-gray-800 transition-all duration-200"
                    />
                    <Search size={18} className="text-gray-400 mr-3 hidden sm:block" />
                </div>
            </div>

            <div className="flex flex-wrap justify-start items-center gap-3 mb-6">
              {currentUserRole !== 'accountant' && (
                <>
                {!isAdding && !editingEntry && (
                  <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold py-2.5 px-5 rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:-translate-y-0.5">
                      <Plus size={20} /> Add Assignment
                  </button>
                )}
                <button 
                    onClick={startEdit}
                    disabled={selectedRows.size !== 1}
                    className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold py-2.5 px-5 rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:-translate-y-0.5 disabled:opacity-50"
                  >
                    <Pencil size={20} /> Edit 
                </button>
                </>
              )}
              <button onClick={handleExport}
                disabled={isExporting}
                className="flex items-center gap-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-2.5 px-5 rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:-translate-y-0.5 disabled:opacity-50"
              >
                <Download size={20} />
                {isExporting ? 'Exporting...' : (selectedRows.size > 0 ? `Export ${selectedRows.size} Selected` : 'Advanced Search')}
              </button>
            </div>
            
            <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th scope="col" className="p-0 w-12">
                                <label className="flex items-center justify-center p-4 cursor-pointer">
                                    <input type="checkbox" onChange={handleSelectAll} checked={visibleEntryIds.length > 0 && selectedRows.size === visibleEntryIds.length} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                                </label>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 tracking-wider">PO No.</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 tracking-wider">SubK Name</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 tracking-wider">New SubK Employee Name</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 tracking-wider">Project Code</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 tracking-wider">PLC</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 tracking-wider">Submitter</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {isLoading && <tr><td colSpan="7" className="text-center p-6 text-gray-500">Loading...</td></tr>}
                        {error && <tr><td colSpan="7" className="text-center p-6 text-red-600">{error}</td></tr>}
                        {!isLoading && !error && filteredEntries.length > 0 ? (
                            filteredEntries.map((entry, index) => (
                                <tr key={entry.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors duration-150 ease-in-out`}>
                                    <Row entry={entry} />
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="7" className="text-center p-6 text-gray-500 italic">No assignments found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};

export default SubcontractorAssignments;
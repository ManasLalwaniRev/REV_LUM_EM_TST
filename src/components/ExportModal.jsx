// import React, { useState, useMemo } from 'react';
// import Modal from './Modal.jsx';
// import * as XLSX from 'xlsx';

// const ExportModal = ({ onClose, dataEntries, contractOptions, creditCardOptions }) => {
//   const [exportType, setExportType] = useState('latest'); // 'latest' or 'all'
//   const [selectedContracts, setSelectedContracts] = useState([]);
//   const [selectedVendors, setSelectedVendors] = useState([]);
//   const [selectedCards, setSelectedCards] = useState([]);

//   // Get unique vendor names from the data
//   const vendorOptions = useMemo(() => {
//     const vendors = new Set(dataEntries.map(entry => entry.vendorName));
//     return Array.from(vendors).sort();
//   }, [dataEntries]);

//   const handleExport = () => {
//     let dataToFilter = [];

//     if (exportType === 'latest') {
//       // Logic to get only the latest version of each record
//       const latestEntries = {};
//       dataEntries.forEach(entry => {
//         const baseKey = String(entry.primeKey).split('.')[0];
//         if (!latestEntries[baseKey] || parseFloat(entry.primeKey) > parseFloat(latestEntries[baseKey].primeKey)) {
//           latestEntries[baseKey] = entry;
//         }
//       });
//       dataToFilter = Object.values(latestEntries);
//     } else {
//       // Use all records
//       dataToFilter = [...dataEntries];
//     }

//     // Apply the dropdown filters
//     const filteredData = dataToFilter.filter(entry => {
//       const contractMatch = selectedContracts.length === 0 || selectedContracts.includes(entry.contractShortName);
//       const vendorMatch = selectedVendors.length === 0 || selectedVendors.includes(entry.vendorName);
//       const cardMatch = selectedCards.length === 0 || selectedCards.includes(entry.creditCard);
//       return contractMatch && vendorMatch && cardMatch;
//     });

//     // Format data for Excel
//     const dataForSheet = filteredData.map(entry => ({
//       "Prime Key": entry.primeKey,
//       "Credit Card": entry.creditCard,
//       "Contract Short Name": entry.contractShortName,
//       "Vendor Name": entry.vendorName,
//       "Charge Date": entry.chargeDate ? new Date(entry.chargeDate).toLocaleDateString('en-US') : '',
//       "Charge Amount": entry.chargeAmount,
//       "Submitted Date": entry.submittedDate ? new Date(entry.submittedDate).toLocaleDateString('en-US') : '',
//       "Submitter": entry.submitter,
//       "Charge Code": entry.chargeCode,
//       "Notes": entry.notes,
//       "PDF File Path": entry.pdfFilePath,
//       "APV Number": entry.apvNumber,
//       "Accounting Processed": entry.accountingProcessed === 'T' ? 'Yes' : 'No',
//       "Date Processed": entry.dateProcessed ? new Date(entry.dateProcessed).toLocaleDateString('en-US') : '',
//     }));

//     if (dataForSheet.length === 0) {
//         alert("No data matches your filter criteria.");
//         return;
//     }

//     const worksheet = XLSX.utils.json_to_sheet(dataForSheet);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "DataEntries");
//     XLSX.writeFile(workbook, "LuminaDataExport.xlsx");
//     onClose(); // Close the modal after exporting
//   };

//   const handleMultiSelectChange = (setter) => (e) => {
//     const options = Array.from(e.target.selectedOptions, option => option.value);
//     setter(options);
//   };

//   return (
//     <Modal title="Export to Excel" onClose={onClose}>
//       <div className="p-4 space-y-6">
//         {/* Record Version Filter */}
//         <div>
//           <label className="block text-lg font-semibold text-gray-700 mb-2">Record Version</label>
//           <div className="flex items-center space-x-4">
//             <label className="flex items-center">
//               <input type="radio" name="exportType" value="latest" checked={exportType === 'latest'} onChange={(e) => setExportType(e.target.value)} className="form-radio h-5 w-5 text-blue-600"/>
//               <span className="ml-2 text-gray-700">Latest Records Only</span>
//             </label>
//             <label className="flex items-center">
//               <input type="radio" name="exportType" value="all" checked={exportType === 'all'} onChange={(e) => setExportType(e.target.value)} className="form-radio h-5 w-5 text-blue-600"/>
//               <span className="ml-2 text-gray-700">All Records (including history)</span>
//             </label>
//           </div>
//         </div>

//         {/* Multi-select Filters */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div>
//             <label htmlFor="contract-filter" className="block text-sm font-medium text-gray-700">Filter by Contract (optional)</label>
//             <select id="contract-filter" multiple onChange={handleMultiSelectChange(setSelectedContracts)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm h-32">
//               {contractOptions.map(option => <option key={option.id} value={option.name}>{option.name}</option>)}
//             </select>
//           </div>
//           <div>
//             <label htmlFor="vendor-filter" className="block text-sm font-medium text-gray-700">Filter by Vendor (optional)</label>
//             <select id="vendor-filter" multiple onChange={handleMultiSelectChange(setSelectedVendors)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm h-32">
//               {vendorOptions.map(vendor => <option key={vendor} value={vendor}>{vendor}</option>)}
//             </select>
//           </div>
//           <div>
//             <label htmlFor="card-filter" className="block text-sm font-medium text-gray-700">Filter by Credit Card (optional)</label>
//             <select id="card-filter" multiple onChange={handleMultiSelectChange(setSelectedCards)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm h-32">
//               {creditCardOptions.map(option => <option key={option.id} value={option.name}>{option.name}</option>)}
//             </select>
//           </div>
//         </div>
//         <p className="text-xs text-gray-500 text-center">Tip: Hold Ctrl (or Cmd on Mac) to select multiple options.</p>

//         {/* Action Buttons */}
//         <div className="flex justify-end space-x-4 pt-4">
//           <button onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-full">
//             Cancel
//           </button>
//           <button onClick={handleExport} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full">
//             Export
//           </button>
//         </div>
//       </div>
//     </Modal>
//   );
// };

// export default ExportModal;


// STABLE 1 START ///


// import React, { useState, useMemo } from 'react';
// import Modal from './Modal.jsx';
// import * as XLSX from 'xlsx';

// const SearchableMultiSelect = ({ options, label, onChange }) => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const filteredOptions = useMemo(() => {
//     if (!searchTerm) return options;
//     return options.filter(option =>
//       String(option).toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }, [options, searchTerm]);

//   return (
//     <div>
//       <label className="block text-sm font-medium text-gray-700">{label}</label>
//       <input
//         type="text"
//         placeholder="Search options..."
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm mb-2"
//       />
//       <select
//         multiple
//         onChange={(e) => onChange(Array.from(e.target.selectedOptions, option => option.value))}
//         className="w-full p-2 border border-gray-300 rounded-md shadow-sm h-32"
//       >
//         {filteredOptions.map(option => (
//           <option key={String(option)} value={String(option)}>{String(option)}</option>
//         ))}
//       </select>
//     </div>
//   );
// };

// const ExportModal = ({ onClose, dataEntries, contractOptions, creditCardOptions }) => {
//   const [exportType, setExportType] = useState('latest');
//   const [selectedContracts, setSelectedContracts] = useState([]);
//   const [selectedVendors, setSelectedVendors] = useState([]);
//   const [selectedCards, setSelectedCards] = useState([]);
//   const [selectedPrimeKeys, setSelectedPrimeKeys] = useState([]);
//   const [selectedSubmitters, setSelectedSubmitters] = useState([]);

//   const { vendorOptions, primeKeyOptions, submitterOptions } = useMemo(() => {
//     const vendors = new Set();
//     const primeKeys = new Set();
//     const submitters = new Set();
//     dataEntries.forEach(entry => {
//         if(entry.vendorName) vendors.add(entry.vendorName);
//         if(entry.primeKey) primeKeys.add(entry.primeKey);
//         if(entry.submitter) submitters.add(entry.submitter);
//     });
//     return {
//         vendorOptions: Array.from(vendors).sort(),
//         primeKeyOptions: Array.from(primeKeys).sort((a,b) => parseFloat(a) - parseFloat(b)),
//         submitterOptions: Array.from(submitters).sort(),
//     };
//   }, [dataEntries]);

//   const handleExport = () => {
//     let dataToFilter = [];
//     if (exportType === 'latest') {
//       const latestEntries = {};
//       dataEntries.forEach(entry => {
//         const baseKey = String(entry.primeKey).split('.')[0];
//         if (!latestEntries[baseKey] || parseFloat(entry.primeKey) > parseFloat(latestEntries[baseKey].primeKey)) {
//           latestEntries[baseKey] = entry;
//         }
//       });
//       dataToFilter = Object.values(latestEntries);
//     } else {
//       dataToFilter = [...dataEntries];
//     }

//     const filteredData = dataToFilter.filter(entry => {
//       const contractMatch = selectedContracts.length === 0 || selectedContracts.includes(entry.contractShortName);
//       const vendorMatch = selectedVendors.length === 0 || selectedVendors.includes(entry.vendorName);
//       const cardMatch = selectedCards.length === 0 || selectedCards.includes(entry.creditCard);
//       const primeKeyMatch = selectedPrimeKeys.length === 0 || selectedPrimeKeys.includes(String(entry.primeKey));
//       const submitterMatch = selectedSubmitters.length === 0 || selectedSubmitters.includes(entry.submitter);
//       return contractMatch && vendorMatch && cardMatch && primeKeyMatch && submitterMatch;
//     });

//     if (filteredData.length === 0) {
//         alert("No data matches your filter criteria.");
//         return;
//     }

//     const dataForSheet = filteredData.map(entry => ({
//       "Prime Key": entry.primeKey,
//       "Credit Card": entry.creditCard,
//       "Contract Short Name": entry.contractShortName,
//       "Vendor Name": entry.vendorName,
//       "Charge Date": entry.chargeDate ? new Date(entry.chargeDate).toLocaleDateString('en-US') : '',
//       "Charge Amount": entry.chargeAmount,
//       "Submitted Date": entry.submittedDate ? new Date(entry.submittedDate).toLocaleDateString('en-US') : '',
//       "Submitter": entry.submitter,
//       "Charge Code": entry.chargeCode,
//       "Notes": entry.notes,
//       "PDF File Path": entry.pdfFilePath,
//       "APV Number": entry.apvNumber,
//       "Accounting Processed": entry.accountingProcessed === 'T' ? 'Yes' : 'No',
//       "Date Processed": entry.dateProcessed ? new Date(entry.dateProcessed).toLocaleDateString('en-US') : '',
//     }));

//     const worksheet = XLSX.utils.json_to_sheet(dataForSheet);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "DataEntries");
//     XLSX.writeFile(workbook, "LuminaDataExport.xlsx");
//     onClose();
//   };

//   return (
//     <Modal title="Advanced Export Options" onClose={onClose}>
//       <div className="p-4 space-y-6">
//         <div>
//           <label className="block text-lg font-semibold text-gray-700 mb-2">1. Select Record Versions</label>
//           <div className="flex items-center space-x-4">
//             <label className="flex items-center"><input type="radio" name="exportType" value="latest" checked={exportType === 'latest'} onChange={(e) => setExportType(e.target.value)} className="form-radio h-5 w-5 text-blue-600"/><span className="ml-2 text-gray-700">Latest Records Only</span></label>
//             <label className="flex items-center"><input type="radio" name="exportType" value="all" checked={exportType === 'all'} onChange={(e) => setExportType(e.target.value)} className="form-radio h-5 w-5 text-blue-600"/><span className="ml-2 text-gray-700">All Records (including history)</span></label>
//           </div>
//         </div>

//         <div>
//            <label className="block text-lg font-semibold text-gray-700 mb-2">2. Filter by Fields (Optional)</label>
//            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               <SearchableMultiSelect options={primeKeyOptions} label="Prime Key" onChange={setSelectedPrimeKeys} />
//               <SearchableMultiSelect options={submitterOptions} label="Submitter" onChange={setSelectedSubmitters} />
//               <SearchableMultiSelect options={contractOptions.map(c => c.name)} label="Contract" onChange={setSelectedContracts} />
//               <SearchableMultiSelect options={vendorOptions} label="Vendor Name" onChange={setSelectedVendors} />
//               <SearchableMultiSelect options={creditCardOptions.map(c => c.name)} label="Credit Card" onChange={setSelectedCards} />
//            </div>
//         </div>
        
//         <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md">
//             <p className="font-bold">Pro Tip</p>
//             <p>You can hold Ctrl (or Cmd on Mac) to select multiple items in any list. Leave all fields blank to export all data (based on your version selection).</p>
//         </div>

//         <div className="flex justify-end space-x-4 pt-4">
//           <button onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-full">Cancel</button>
//           <button onClick={handleExport} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full">Generate & Download</button>
//         </div>
//       </div>
//     </Modal>
//   );
// };

// export default ExportModal;


// STABLE 1 END ///

/// STABLE 2 ///



// import React, { useState, useMemo, useRef, useEffect } from 'react';
// import Modal from './Modal.jsx';
// import * as XLSX from 'xlsx';
// import { X, ChevronDown } from 'lucide-react';

// // const CustomSearchableMultiSelect = ({ options, label, onChange, selectedValues }) => {
// //   const [isOpen, setIsOpen] = useState(false);
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const wrapperRef = useRef(null);

// //   const filteredOptions = useMemo(() => {
// //     if (!searchTerm) return options;
// //     return options.filter(option =>
// //       String(option).toLowerCase().includes(searchTerm.toLowerCase())
// //     );
// //   }, [options, searchTerm]);

// //   useEffect(() => {
// //     function handleClickOutside(event) {
// //       if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
// //         setIsOpen(false);
// //       }
// //     }
// //     document.addEventListener("mousedown", handleClickOutside);
// //     return () => document.removeEventListener("mousedown", handleClickOutside);
// //   }, [wrapperRef]);

// //   const handleSelect = (option) => {
// //     const newSelectedValues = selectedValues.includes(option)
// //       ? selectedValues.filter(item => item !== option)
// //       : [...selectedValues, option];
// //     onChange(newSelectedValues);
// //   };

// //   const removeValue = (valueToRemove) => {
// //     onChange(selectedValues.filter(item => item !== valueToRemove));
// //   };

// //   return (
// //     <div ref={wrapperRef} className="relative">
// //       <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
// //       <div className="flex items-center p-2 bg-white border border-gray-300 rounded-md cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
// //         <div className="flex flex-wrap gap-1 flex-grow">
// //           {selectedValues.length === 0 ? (
// //             <span className="text-gray-500">Select {label}...</span>
// //           ) : (
// //             selectedValues.map(value => (
// //               <span key={value} className="flex items-center gap-1 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
// //                 {value}
// //                 <button
// //                   onClick={(e) => { e.stopPropagation(); removeValue(value); }}
// //                   className="hover:bg-blue-400 rounded-full"
// //                 >
// //                   <X size={12} />
// //                 </button>
// //               </span>
// //             ))
// //           )}
// //         </div>
// //         <ChevronDown size={20} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
// //       </div>

// //       {isOpen && (
// //         <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
// //           <input
// //             type="text"
// //             placeholder="Search..."
// //             value={searchTerm}
// //             onChange={(e) => setSearchTerm(e.target.value)}
// //             className="w-full p-2 text-gray-800 border-b border-gray-200 focus:outline-none"
// //           />
// //           <ul className="max-h-48 overflow-y-auto">
// //             {filteredOptions.map(option => (
// //               <li
// //                 key={option}
// //                 onClick={() => handleSelect(option)}
// //                 className={`p-2 cursor-pointer text-gray-800 hover:bg-gray-100 ${selectedValues.includes(option) ? 'bg-blue-100 font-bold' : ''}`}
// //               >
// //                 {option}
// //               </li>
// //             ))}
// //           </ul>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };
// const CustomSearchableMultiSelect = ({ options, label, onChange, selectedValues }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const wrapperRef = useRef(null);

//   const filteredOptions = useMemo(() => {
//     if (!searchTerm) return options;
//     return options.filter(option =>
//       String(option).toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }, [options, searchTerm]);

//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, [wrapperRef]);

//   const handleSelect = (option) => {
//     const newSelectedValues = selectedValues.includes(option)
//       ? selectedValues.filter(item => item !== option)
//       : [...selectedValues, option];
//     onChange(newSelectedValues);
//   };

//   const removeValue = (valueToRemove) => {
//     onChange(selectedValues.filter(item => item !== valueToRemove));
//   };

//   return (
//     <div ref={wrapperRef} className="relative">
//       <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
//       <div className="flex items-center p-2 bg-white border border-gray-300 rounded-md cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
//         <div className="flex flex-wrap gap-1 flex-grow">
//           {selectedValues.length === 0 ? (
//             <span className="text-gray-500">Select {label}...</span>
//           ) : (
//             selectedValues.map(value => (
//               <span key={value} className="flex items-center gap-1 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
//                 {value}
//                 <button
//                   onClick={(e) => { e.stopPropagation(); removeValue(value); }} // <-- FIX IS HERE
//                   className="hover:bg-blue-400 rounded-full"
//                 >
//                   <X size={12} />
//                 </button>
//               </span>
//             ))
//           )}
//         </div>
//         <ChevronDown size={20} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
//       </div>

//       {isOpen && (
//         <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
//           <input
//             type="text"
//             placeholder="Search..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full p-2 text-gray-800 border-b border-gray-200 focus:outline-none"
//           />
//           <ul className="max-h-48 overflow-y-auto">
//             {filteredOptions.map(option => (
//               <li
//                 key={option}
//                 onClick={() => handleSelect(option)}
//                 className={`p-2 cursor-pointer text-gray-800 hover:bg-gray-100 ${selectedValues.includes(option) ? 'bg-blue-100 font-bold' : ''}`}
//               >
//                 {option}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// const ExportModal = ({ onClose, dataEntries, contractOptions, creditCardOptions }) => {
//   const [exportType, setExportType] = useState('latest');
//   const [selectedContracts, setSelectedContracts] = useState([]);
//   const [selectedVendors, setSelectedVendors] = useState([]);
//   const [selectedCards, setSelectedCards] = useState([]);
//   const [selectedPrimeKeys, setSelectedPrimeKeys] = useState([]);
//   const [selectedSubmitters, setSelectedSubmitters] = useState([]);

//   const { vendorOptions, primeKeyOptions, submitterOptions } = useMemo(() => {
//     const vendors = new Set();
//     const primeKeys = new Set();
//     const submitters = new Set();
//     dataEntries.forEach(entry => {
//         if(entry.vendorName) vendors.add(entry.vendorName);
//         if(entry.primeKey) primeKeys.add(entry.primeKey);
//         if(entry.submitter) submitters.add(entry.submitter);
//     });
//     return {
//         vendorOptions: Array.from(vendors).sort(),
//         primeKeyOptions: Array.from(primeKeys).sort((a,b) => parseFloat(a) - parseFloat(b)),
//         submitterOptions: Array.from(submitters).sort(),
//     };
//   }, [dataEntries]);

//   const handleExport = () => {
//     let dataToFilter = [];
//     if (exportType === 'latest') {
//       const latestEntries = {};
//       dataEntries.forEach(entry => {
//         const baseKey = String(entry.primeKey).split('.')[0];
//         if (!latestEntries[baseKey] || parseFloat(entry.primeKey) > parseFloat(latestEntries[baseKey].primeKey)) {
//           latestEntries[baseKey] = entry;
//         }
//       });
//       dataToFilter = Object.values(latestEntries);
//     } else {
//       dataToFilter = [...dataEntries];
//     }

//     const filteredData = dataToFilter.filter(entry => {
//       const contractMatch = selectedContracts.length === 0 || selectedContracts.includes(entry.contractShortName);
//       const vendorMatch = selectedVendors.length === 0 || selectedVendors.includes(entry.vendorName);
//       const cardMatch = selectedCards.length === 0 || selectedCards.includes(entry.creditCard);
//       const primeKeyMatch = selectedPrimeKeys.length === 0 || selectedPrimeKeys.includes(String(entry.primeKey));
//       const submitterMatch = selectedSubmitters.length === 0 || selectedSubmitters.includes(entry.submitter);
//       return contractMatch && vendorMatch && cardMatch && primeKeyMatch && submitterMatch;
//     });

//     if (filteredData.length === 0) {
//         alert("No data matches your filter criteria.");
//         return;
//     }

//     const dataForSheet = filteredData.map(entry => ({
//       "Prime Key": entry.primeKey,
//       "Credit Card": entry.creditCard,
//       "Contract Short Name": entry.contractShortName,
//       "Vendor Name": entry.vendorName,
//       "Charge Date": entry.chargeDate ? new Date(entry.chargeDate).toLocaleDateString('en-US') : '',
//       "Charge Amount": entry.chargeAmount,
//       "Submitted Date": entry.submittedDate ? new Date(entry.submittedDate).toLocaleDateString('en-US') : '',
//       "Submitter": entry.submitter,
//       "Charge Code": entry.chargeCode,
//       "Notes": entry.notes,
//       "PDF File Path": entry.pdfFilePath,
//       "APV Number": entry.apvNumber,
//       "Accounting Processed": entry.accountingProcessed === 'T' ? 'Yes' : 'No',
//       "Date Processed": entry.dateProcessed ? new Date(entry.dateProcessed).toLocaleDateString('en-US') : '',
//     }));

//     const worksheet = XLSX.utils.json_to_sheet(dataForSheet);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "DataEntries");
//     XLSX.writeFile(workbook, "LuminaDataExport.xlsx");
//     onClose();
//   };


//   return (
//     <Modal title="Advanced Export Options" onClose={onClose}>
//       <div className="w-full max-w-5xl text-gray-800"> {/* Increased width */}
//         <div className="space-y-8"> {/* Increased spacing */}
//             <div>
//               <label className="block text-lg font-bold text-gray-700 mb-4">1. Select Record Versions</label> {/* Styled title */}
//               <div className="flex bg-gray-100 p-1 rounded-lg">
//                 <button
//                   onClick={() => setExportType('latest')}
//                   className={`w-1/2 p-2 rounded-md text-sm font-semibold transition-all duration-300 ${exportType === 'latest' ? 'bg-white text-blue-600 shadow' : 'text-gray-500 hover:bg-gray-200'}`}
//                 >
//                   Latest Records Only
//                 </button>
//                 <button
//                   onClick={() => setExportType('all')}
//                   className={`w-1/2 p-2 rounded-md text-sm font-semibold transition-all duration-300 ${exportType === 'all' ? 'bg-white text-blue-600 shadow' : 'text-gray-500 hover:bg-gray-200'}`}
//                 >
//                   All Records (including history)
//                 </button>
//               </div>
//             </div>

//             <div>
//                 <label className="block text-lg font-bold text-gray-700 mb-4">2. Filter by Fields (Optional)</label> {/* Styled title */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                   <CustomSearchableMultiSelect options={primeKeyOptions} label="Prime Key" onChange={setSelectedPrimeKeys} selectedValues={selectedPrimeKeys} />
//                   <CustomSearchableMultiSelect options={submitterOptions} label="Submitter" onChange={setSelectedSubmitters} selectedValues={selectedSubmitters} />
//                   <CustomSearchableMultiSelect options={contractOptions.map(c => c.name)} label="Contract" onChange={setSelectedContracts} selectedValues={selectedContracts} />
//                   <CustomSearchableMultiSelect options={vendorOptions} label="Vendor Name" onChange={setSelectedVendors} selectedValues={selectedVendors} />
//                   <CustomSearchableMultiSelect options={creditCardOptions.map(c => c.name)} label="Credit Card" onChange={setSelectedCards} selectedValues={selectedCards} />
//                 </div>
//             </div>
            
//             <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200"> {/* Adjusted spacing and buttons */}
//                 <button onClick={onClose} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 px-6 rounded-md transition-colors">Cancel</button>
//                 <button onClick={handleExport} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md shadow-sm transition-colors">Download</button>
//             </div>
//         </div>
//       </div>
//     </Modal>
//   );
// };

// export default ExportModal;




/// STABLE 2 END ///


import React, { useState, useMemo, useRef, useEffect } from 'react';
import Modal from './Modal.jsx';
import { X, ChevronDown } from 'lucide-react';

// NOTE: No Excel libraries (xlsx or xlsx-populate) are needed in this file anymore.

// --- Custom Searchable Multi-Select Component ---
const CustomSearchableMultiSelect = ({ options, label, onChange, selectedValues }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef(null);

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    return options.filter(option =>
      String(option).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const handleSelect = (option) => {
    const newSelectedValues = selectedValues.includes(option)
      ? selectedValues.filter(item => item !== option)
      : [...selectedValues, option];
    onChange(newSelectedValues);
  };

  const removeValue = (valueToRemove) => {
    onChange(selectedValues.filter(item => item !== valueToRemove));
  };

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex items-center p-2 bg-white border border-gray-300 rounded-md cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex flex-wrap gap-1 flex-grow">
          {selectedValues.length === 0 ? (
            <span className="text-gray-500">Select {label}...</span>
          ) : (
            selectedValues.map(value => (
              <span key={value} className="flex items-center gap-1 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                {value}
                <button
                  onClick={(e) => { e.stopPropagation(); removeValue(value); }}
                  className="hover:bg-blue-400 rounded-full"
                >
                  <X size={12} />
                </button>
              </span>
            ))
          )}
        </div>
        <ChevronDown size={20} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 text-gray-800 border-b border-gray-200 focus:outline-none"
          />
          <ul className="max-h-48 overflow-y-auto">
            {filteredOptions.map(option => (
              <li
                key={option}
                onClick={() => handleSelect(option)}
                className={`p-2 cursor-pointer text-gray-800 hover:bg-gray-100 ${selectedValues.includes(option) ? 'bg-blue-100 font-bold' : ''}`}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// --- Main Export Modal Component ---
const ExportModal = ({ onClose, dataEntries, contractOptions, creditCardOptions }) => {
  const [exportType, setExportType] = useState('latest');
  const [selectedContracts, setSelectedContracts] = useState([]);
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [selectedPrimeKeys, setSelectedPrimeKeys] = useState([]);
  const [selectedSubmitters, setSelectedSubmitters] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);

  const { vendorOptions, primeKeyOptions, submitterOptions } = useMemo(() => {
    const vendors = new Set();
    const primeKeys = new Set();
    const submitters = new Set();
    dataEntries.forEach(entry => {
        if(entry.vendorName) vendors.add(entry.vendorName);
        if(entry.primeKey) primeKeys.add(String(entry.primeKey));
        if(entry.submitter) submitters.add(entry.submitter);
    });
    return {
        vendorOptions: Array.from(vendors).sort(),
        primeKeyOptions: Array.from(primeKeys).sort((a,b) => parseFloat(a) - parseFloat(b)),
        submitterOptions: Array.from(submitters).sort(),
    };
  }, [dataEntries]);

  const handleExport = async () => {
    setIsDownloading(true);

    // 1. Filter data based on user selections
    let dataToFilter = [];
    if (exportType === 'latest') {
      const latestEntries = {};
      dataEntries.forEach(entry => {
        const baseKey = String(entry.primeKey).split('.')[0];
        if (!latestEntries[baseKey] || parseFloat(entry.primeKey) > parseFloat(latestEntries[baseKey].primeKey)) {
          latestEntries[baseKey] = entry;
        }
      });
      dataToFilter = Object.values(latestEntries);
    } else {
      dataToFilter = [...dataEntries];
    }

    const filteredData = dataToFilter.filter(entry => {
      const contractMatch = selectedContracts.length === 0 || selectedContracts.includes(entry.contractShortName);
      const vendorMatch = selectedVendors.length === 0 || selectedVendors.includes(entry.vendorName);
      const cardMatch = selectedCards.length === 0 || selectedCards.includes(entry.creditCard);
      const primeKeyMatch = selectedPrimeKeys.length === 0 || selectedPrimeKeys.includes(String(entry.primeKey));
      const submitterMatch = selectedSubmitters.length === 0 || selectedSubmitters.includes(entry.submitter);
      return contractMatch && vendorMatch && cardMatch && primeKeyMatch && submitterMatch;
    });

    if (filteredData.length === 0) {
        alert("No data matches your filter criteria.");
        setIsDownloading(false);
        return;
    }

    // 2. Prepare data object for the server
    const dataForSheet = filteredData.map(entry => ({
      "Record No": entry.primeKey,
      "Credit Card": entry.creditCard,
      "Contract Short Name": entry.contractShortName,
      "Vendor Name": entry.vendorName,
      "Charge Date": entry.chargeDate ? new Date(entry.chargeDate).toLocaleDateString('en-US') : '',
      "Charge Amount": entry.chargeAmount,
      "Submitted Date": entry.submittedDate ? new Date(entry.submittedDate).toLocaleDateString('en-US') : '',
      "Submitter": entry.submitter,
      "Charge Code": entry.chargeCode,
      "Notes": entry.notes,
      "PDF File Path": entry.pdfFilePath,
      "APV Number": entry.apvNumber,
      "Accounting Processed": entry.accountingProcessed === 'T' ? 'Yes' : 'No',
      "Date Processed": entry.dateProcessed ? new Date(entry.dateProcessed).toLocaleDateString('en-US') : '',
      "Paid Date": entry.paidDt ? new Date(entry.paidDt).toLocaleDateString('en-US') : '' // <-- Add this line
    }));

    try {
      // 3. Send the data to the backend endpoint
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_BASE_URL}/generate-excel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: dataForSheet }),
      });

      if (!response.ok) {
        throw new Error('Server failed to generate the Excel file.');
      }

      // 4. Receive the file as a blob and trigger the download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'LuminaDataExport.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();

      onClose();

    } catch (err) {
      console.error("Error downloading Excel file:", err);
      alert("An error occurred while downloading the file. Please check the console for details.");
    } finally {
        setIsDownloading(false);
    }
  };

  return (
    <Modal title="Advanced Export Options" onClose={onClose}>
      <div className="w-full max-w-5xl text-gray-800">
        <div className="space-y-8">
            <div>
              <label className="block text-lg font-bold text-gray-700 mb-4">1. Select Record Versions</label>
              {/* <div className="flex bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setExportType('latest')}
                  className={`w-1/2 p-2 rounded-md text-sm font-semibold transition-all duration-300 ${exportType === 'latest' ? 'bg-white text-blue-600 shadow' : 'text-gray-500 hover:bg-gray-200'}`}
                >
                  Latest Records Only
                </button>
                <button
                  onClick={() => setExportType('all')}
                  className={`w-1/2 p-2 rounded-md text-sm font-semibold transition-all duration-300 ${exportType === 'all' ? 'bg-white text-blue-600 shadow' : 'text-gray-500 hover:bg-gray-200'}`}
                >
                  All Records (including history)
                </button>
              </div> */}
              <div className="flex items-center justify-center space-x-4 py-2">
  {/* "Latest Records Only" Label */}
  <span className={`font-semibold transition-colors ${exportType === 'latest' ? 'text-blue-600' : 'text-gray-500'}`}>
    Latest Records Only
  </span>

  {/* The Toggle Switch */}
  <label htmlFor="export-type-toggle" className="relative inline-block w-14 h-8 cursor-pointer">
    <input
      type="checkbox"
      id="export-type-toggle"
      className="sr-only peer"
      checked={exportType === 'all'}
      onChange={() => setExportType(prev => prev === 'latest' ? 'all' : 'latest')}
    />
    <div className="block bg-gray-200 w-full h-full rounded-full peer-checked:bg-blue-600 transition"></div>
    <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform transform peer-checked:translate-x-6"></div>
  </label>
  
  {/* "All Records" Label */}
  <span className={`font-semibold transition-colors ${exportType === 'all' ? 'text-blue-600' : 'text-gray-500'}`}>
    All Records
  </span>
</div>
            </div>

            <div>
                <label className="block text-lg font-bold text-gray-700 mb-4">2. Filter by Fields (Optional)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <CustomSearchableMultiSelect options={primeKeyOptions} label="Prime Key" onChange={setSelectedPrimeKeys} selectedValues={selectedPrimeKeys} />
                  <CustomSearchableMultiSelect options={submitterOptions} label="Submitter" onChange={setSelectedSubmitters} selectedValues={selectedSubmitters} />
                  <CustomSearchableMultiSelect options={contractOptions.map(c => c.name)} label="Contract" onChange={setSelectedContracts} selectedValues={selectedContracts} />
                  <CustomSearchableMultiSelect options={vendorOptions} label="Vendor Name" onChange={setSelectedVendors} selectedValues={selectedVendors} />
                  <CustomSearchableMultiSelect options={creditCardOptions.map(c => c.name)} label="Credit Card" onChange={setSelectedCards} selectedValues={selectedCards} />
                </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button onClick={onClose} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 px-6 rounded-md transition-colors">Cancel</button>
                <button 
                    onClick={handleExport}
                    disabled={isDownloading}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md shadow-sm transition-colors disabled:bg-blue-400"
                >
                    {isDownloading ? 'Generating...' : 'Download'}
                </button>
            </div>
        </div>
      </div>
    </Modal>
  );
};

export default ExportModal;
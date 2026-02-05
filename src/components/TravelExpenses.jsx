
// import React, { useState, useMemo, useEffect } from 'react';
// import { Plus, Pencil, Download, Search, LogOut, X, Save } from 'lucide-react';
// import * as XLSX from 'xlsx';

// const TravelExpenses = ({ 
//   dataEntries, 
//   isLoading, 
//   error, 
//   userName = 'User', 
//   userAvatar, 
//   handleLogout, 
//   currentUserRole,
//   currentUserId,
//   onDataChanged 
// }) => {
//   const [searchColumn, setSearchColumn] = useState('all');
//   const [searchValue, setSearchValue] = useState('');
//   const [selectedRows, setSelectedRows] = useState(new Set());
//   const [isExporting, setIsExporting] = useState(false);
  
//   // --- DEMO CACHE LOGIC ---
//   const [localEntries, setLocalEntries] = useState([]);

//   useEffect(() => {
//     setLocalEntries(dataEntries || []);
//   }, [dataEntries]);

//   // Local state for Inline Add/Edit features
//   const [isAdding, setIsAdding] = useState(false);
//   const [editingEntry, setEditingEntry] = useState(null);
//   const [formData, setFormData] = useState({
//     pdfFilePath: '',
//     contractShortName: '',
//     notes: ''
//   });

//   // const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/entries`;

//   const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/travel-expenses`;
//   const searchableColumns = [
//     { key: 'all', name: 'All Fields' },
//     { key: 'contractShortName', name: 'Project' },
//     { key: 'notes', name: 'Notes' },
//     { key: 'submitter', name: 'Submitter' },
//   ];

//   const filteredEntries = useMemo(() => {
//     let filtered = localEntries;

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
//   }, [localEntries, searchColumn, searchValue]);

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

//   const handleInputChange = (e) => {
//     const { id, value } = e.target;
//     setFormData(prev => ({ ...prev, [id]: value }));
//   };

//   const resetForm = () => {
//     setFormData({ pdfFilePath: '', contractShortName: '', notes: '' });
//     setIsAdding(false);
//     setEditingEntry(null);
//   };

//   const handleSave = async (e) => {
//     e.preventDefault();
    
//     // Create the "Cache Record" for immediate display in demo
//     const newRecord = {
//       ...formData,
//       id: editingEntry ? editingEntry.id : Date.now(),
//       submitter: userName,
//     };

//     // Update local cache state immediately
//     if (editingEntry) {
//       setLocalEntries(prev => prev.map(en => en.id === editingEntry.id ? newRecord : en));
//     } else {
//       setLocalEntries(prev => [newRecord, ...prev]);
//     }

//     const method = editingEntry ? 'PATCH' : 'POST';
//     const url = editingEntry ? `${API_BASE_URL}/${editingEntry.id}` : `${API_BASE_URL}/new`;
    
//     try {
//       const response = await fetch(url, {
//         method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ 
//           ...formData, 
//           userId: currentUserId,
//           submitter: userName,
//           category: 'travel' 
//         }),
//       });

//       if (response.ok && onDataChanged) {
//         onDataChanged(); 
//       }
//     } catch (err) {
//       console.warn("Backend save failed, but demo record is cached locally.");
//     }

//     resetForm();
//   };

//   const startEdit = () => {
//     const entryId = Array.from(selectedRows)[0];
//     const entry = localEntries.find(e => e.id === entryId);
//     if (entry) {
//       setEditingEntry(entry);
//       setFormData({
//         pdfFilePath: entry.pdfFilePath || '',
//         contractShortName: entry.contractShortName || '',
//         notes: entry.notes || ''
//       });
//       setIsAdding(false);
//     }
//   };

//   const handleExport = async () => {
//     if (selectedRows.size > 0) {
//       setIsExporting(true);
//       try {
//         const dataToExport = localEntries.filter(entry => selectedRows.has(entry.id));
//         const dataForSheet = dataToExport.map(entry => ({
//           "Project for Travel": entry.contractShortName,
//           "Travel Form Link": entry.pdfFilePath,
//           "Notes": entry.notes,
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
//         a.download = 'TravelExpensesExport.xlsx';
//         document.body.appendChild(a);
//         a.click();
//         window.URL.revokeObjectURL(url);
//         a.remove();
//       } catch (err) {
//         console.error("Error exporting data:", err);
//       } finally {
//         setIsExporting(false);
//       }
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
//         <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700 font-medium">{entry.contractShortName || 'Contract 2'}</td>
//         <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">
//             {entry.pdfFilePath ? <a href={entry.pdfFilePath} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View Form</a> : 'Form Link'}
//         </td>
//         <td className="px-6 py-3 whitespace-pre-wrap text-sm text-gray-700">{entry.notes || '—'}</td>
//         <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">{entry.submitter || 'Revolve'}</td>
//     </React.Fragment>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 sm:p-6 lg:p-8 text-gray-100 flex justify-center items-start">
//         <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-full">
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
//                  <h1 className="text-3xl font-extrabold">
//                         <span className="block text-transparent bg-clip-text bg-gradient-to-r text-black-800">
//                             Travel Expenses
//                         </span>
//                     </h1>
//                 <div className="w-1/3 flex justify-end">
//                     <img src="\Lumina_logo.png" alt="Lumina Logo" className="h-12 opacity-100 pr-12" />
//                 </div>
//                 <div className="w-1/3 flex justify-end items-center gap-4 text-gray-800">
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

//             {(isAdding || editingEntry) && (
//               <div className="mb-8 p-6 border-2 border-lime-200 rounded-xl bg-lime-50 animate-in fade-in slide-in-from-top-4 text-gray-800">
//                 <div className="flex justify-between items-center mb-4">
//                   <h2 className="text-xl font-bold text-lime-900">
//                     {editingEntry ? 'Edit Travel Expense' : 'Add New Travel Expense'}
//                   </h2>
//                   <button onClick={resetForm} className="text-gray-500 hover:text-red-500"><X /></button>
//                 </div>
//                 <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <div>
//                     <label className="block text-sm font-semibold mb-1">Project for Travel</label>
//                     <input 
//                       id="contractShortName" type="text" required
//                       className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-lime-500"
//                       value={formData.contractShortName} onChange={handleInputChange}
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold mb-1">Attach Travel Form (Link)</label>
//                     <input 
//                       id="pdfFilePath" type="text" required
//                       className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-lime-500"
//                       value={formData.pdfFilePath} onChange={handleInputChange}
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold mb-1">Notes</label>
//                     <input 
//                       id="notes" type="text"
//                       className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-lime-500"
//                       value={formData.notes} onChange={handleInputChange}
//                     />
//                   </div>
//                   <div className="md:col-span-3 flex justify-end">
//                     <button type="submit" className="flex items-center gap-2 bg-lime-600 text-white px-6 py-2 rounded-lg hover:bg-lime-700 transition">
//                       <Save size={18} /> {editingEntry ? 'Update' : 'Save'}
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             )}

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
//                 {!isAdding && !editingEntry && (
//                   <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold py-2.5 px-5 rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:-translate-y-0.5">
//                       <Plus size={20} /> Add 
//                   </button>
//                 )}
//                 <button 
//                   onClick={startEdit}
//                   disabled={selectedRows.size !== 1} 
//                   className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold py-2.5 px-5 rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:-translate-y-0.5 disabled:opacity-50"
//                 >
//                   <Pencil size={20} /> Edit 
//                 </button>
//                 </>
//               )}
//               <button onClick={handleExport}
//                 disabled={isExporting}
//                 className="flex items-center gap-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-2.5 px-5 rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:-translate-y-0.5 disabled:opacity-50"
//               >
//                 <Download size={20} />
//                 {isExporting ? 'Exporting...' : (selectedRows.size > 0 ? `Export ${selectedRows.size} Selected` : 'Advanced Search')}
//               </button>
//             </div>
            
//             <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200">
//                 <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-100">
//                         <tr>
//                             <th scope="col" className="p-0 w-12 text-center">
//                                 <label className="flex items-center justify-center p-4 cursor-pointer">
//                                     <input type="checkbox" onChange={handleSelectAll} checked={visibleEntryIds.length > 0 && selectedRows.size === visibleEntryIds.length} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
//                                 </label>
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 tracking-wider">Project for Travel</th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 tracking-wider">Travel Form</th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 tracking-wider">Notes</th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 tracking-wider">Submitter</th>
//                         </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-100">
//                         {isLoading && <tr><td colSpan="5" className="text-center p-6 text-gray-500">Loading...</td></tr>}
//                         {error && <tr><td colSpan="5" className="text-center p-6 text-red-600">{error}</td></tr>}
//                         {!isLoading && !error && filteredEntries.length > 0 ? (
//                             filteredEntries.map((entry, index) => (
//                                 <tr key={entry.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-lime-50 transition-colors duration-150 ease-in-out`}>
//                                     <Row entry={entry} />
//                                 </tr>
//                             ))
//                         ) : (
//                             <tr><td colSpan="5" className="text-center p-6 text-gray-500 italic">No entries found.</td></tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     </div>
//   );
// };

// export default TravelExpenses;


import React, { useState } from 'react';
import { Pencil, Save, CheckCircle, LogOut, FileText, Printer } from 'lucide-react';

const TravelExpenses = ({ contractOptions = [], userName, handleLogout }) => {
  // Dropdowns
  const employeeOptions = [
    { id: 'EMP001', name: 'Manas Lalwani' },
    { id: 'EMP002', name: 'Nilesh Peswani' },
    { id: 'EMP003', name: 'Abdul Shaikh' }
  ];
  const purposeOptions = ['Client Meeting', 'Site Visit', 'Conference', 'Relocation', 'Internal Audit'];

  const [formData, setFormData] = useState({
    employeeName: '', employeeId: '', datePrepared: new Date().toISOString().split('T')[0],
    purpose: '', travelFrom: '', travelTo: '', perDiemLodging: 0, perDiemMIE: 0,
    projectName: '', personalMiles: 0, transportCost: 0, miePerDiem: 0,
    lodgingActual: 0, lodgingTaxes: 0, rentalTaxi: 0, parkingTolls: 0,
    otherSpecify: '', otherCost: 0, travelAdvance: 0
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleEmployeeChange = (e) => {
    const emp = employeeOptions.find(opt => opt.id === e.target.value);
    setFormData(prev => ({ ...prev, employeeId: e.target.value, employeeName: emp ? emp.name : '' }));
  };

  const calculateTotal = () => {
    const mileage = parseFloat(formData.personalMiles || 0) * 0.655;
    const costs = [
      formData.transportCost, formData.miePerDiem, formData.lodgingActual,
      formData.lodgingTaxes, formData.rentalTaxi, formData.parkingTolls, formData.otherCost
    ];
    return mileage + costs.reduce((sum, val) => sum + parseFloat(val || 0), 0);
  };

  const amountDue = calculateTotal() - parseFloat(formData.travelAdvance || 0);

  return (
    <div className="min-h-screen bg-slate-100 p-4 text-slate-800 font-sans">
      <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-40px)]">
        
        {/* --- LEFT PANEL: DATA ENTRY (ALL FIELDS) --- */}
        <div className="w-full lg:w-1/3 bg-white rounded-xl shadow-lg overflow-y-auto p-6 border-t-4 border-blue-600">
          <div className="flex items-center justify-between mb-6 border-b pb-4">
            <div className="flex items-center gap-3">
              <Pencil className="text-blue-600" size={24}/>
              <h2 className="text-xl font-black text-slate-800 uppercase">Expense Entry</h2>
            </div>
          </div>
          
          <div className="space-y-4">
             <section className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Header Information</label>
                <select id="employeeId" className="w-full p-2 border rounded-lg bg-slate-50 text-sm" value={formData.employeeId} onChange={handleEmployeeChange}>
                  <option value="">Select Employee ID / Name</option>
                  {employeeOptions.map(emp => <option key={emp.id} value={emp.id}>{emp.id} - {emp.name}</option>)}
                </select>
                <select id="purpose" className="w-full p-2 border rounded-lg bg-slate-50 text-sm" value={formData.purpose} onChange={handleInputChange}>
                  <option value="">Select Purpose of Trip</option>
                  {purposeOptions.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <select id="projectName" className="w-full p-2 border rounded-lg bg-slate-50 text-sm" value={formData.projectName} onChange={handleInputChange}>
                  <option value="">Select Project Name</option>
                  {contractOptions.map(opt => <option key={opt.id} value={opt.name}>{opt.name}</option>)}
                </select>
             </section>

             <section className="space-y-2 pt-4 border-t">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dates & Per Diems</label>
                <div className="grid grid-cols-2 gap-2">
                   <input id="travelFrom" placeholder="Travel From" className="p-2 border rounded text-sm" onChange={handleInputChange}/>
                   <input id="travelTo" placeholder="Travel To" className="p-2 border rounded text-sm" onChange={handleInputChange}/>
                   <input id="perDiemLodging" type="number" placeholder="Per Diem: Lodging" className="p-2 border rounded text-sm" onChange={handleInputChange}/>
                   <input id="perDiemMIE" type="number" placeholder="Per Diem: M&IE" className="p-2 border rounded text-sm" onChange={handleInputChange}/>
                </div>
             </section>

             <section className="space-y-2 pt-4 border-t">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expense Rows</label>
                <div className="grid grid-cols-2 gap-2">
                   <input id="personalMiles" type="number" placeholder="Auto Miles" className="p-2 border rounded text-sm" onChange={handleInputChange}/>
                   <input id="transportCost" type="number" placeholder="Transport Cost" className="p-2 border rounded text-sm" onChange={handleInputChange}/>
                   <input id="miePerDiem" type="number" placeholder="M&IE (Per Diem Only)" className="p-2 border rounded text-sm" onChange={handleInputChange}/>
                   <input id="lodgingActual" type="number" placeholder="Lodging Room" className="p-2 border rounded text-sm" onChange={handleInputChange}/>
                   <input id="lodgingTaxes" type="number" placeholder="Lodging Taxes" className="p-2 border rounded text-sm" onChange={handleInputChange}/>
                   <input id="rentalTaxi" type="number" placeholder="Rental/Taxis" className="p-2 border rounded text-sm" onChange={handleInputChange}/>
                   <input id="parkingTolls" type="number" placeholder="Parking/Tolls" className="p-2 border rounded text-sm" onChange={handleInputChange}/>
                   <input id="otherCost" type="number" placeholder="Other Amount" className="p-2 border rounded text-sm" onChange={handleInputChange}/>
                   <input id="travelAdvance" type="number" placeholder="Less Travel Advance" className="p-2 border rounded text-sm col-span-2" onChange={handleInputChange}/>
                </div>
             </section>

             <button className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all mt-4">
               <CheckCircle size={18}/> SUBMIT STATEMENT
             </button>
          </div>
        </div>

        {/* --- RIGHT PANEL: EXACT STATEMENT REPLICATION --- */}
        <div className="w-full lg:w-2/3 bg-white rounded-xl shadow-inner overflow-y-auto p-12 border border-slate-200" id="printable-report">
          <div className="max-w-5xl mx-auto border-[1px] border-slate-400 p-8 shadow-sm text-blue-900">
            
            <div className="text-center mb-6">
              <h1 className="text-2xl font-black uppercase tracking-tight">Infotrend Inc Travel Expense Statement</h1>
            </div>

            {/* Header */}
            <div className="grid grid-cols-4 gap-x-4 text-[11px] mb-4">
              <div className="col-span-2 border-b border-slate-400 pb-1 flex gap-2">
                <span className="font-bold">Employee:</span> <span className="text-slate-800 uppercase">{formData.employeeName}</span>
              </div>
              <div className="border-b border-slate-400 pb-1 flex gap-2">
                <span className="font-bold">Employee #:</span> <span className="text-slate-800">{formData.employeeId}</span>
              </div>
              <div className="border-b border-slate-400 pb-1 flex gap-2">
                <span className="font-bold">Date Prepared :</span> <span className="text-slate-800">{formData.datePrepared}</span>
              </div>
              <div className="col-span-4 border-b border-slate-400 pb-1 flex gap-2 mt-2">
                <span className="font-bold">Purpose of Trip:</span> <span className="text-slate-800 uppercase">{formData.purpose}</span>
              </div>
            </div>

            {/* Table Header Section */}
            <table className="w-full border-collapse border border-slate-500 text-[10px]">
              <tbody>
                <tr className="bg-blue-50/50 font-bold uppercase">
                  <td className="border border-slate-500 p-1 w-1/4">Date</td>
                  <td className="border border-slate-500 p-1" colSpan="6"></td>
                  <td className="border border-slate-500 p-2 w-[220px] text-center" rowSpan="6">
                    <div className="font-black border-b border-blue-200 mb-1 pb-1 text-blue-800 text-[11px]">Receipt Requirements:</div>
                    <div className="font-normal normal-case leading-tight text-slate-500 text-[9px]">
                      * Receipts are required for all items (excluding M&IE perdiems & mileage charges)
                    </div>
                    <div className="mt-2 font-normal normal-case leading-tight text-slate-500 text-[9px]">
                      ** Receipts are required for full amount
                    </div>
                  </td>
                </tr>
                <tr><td className="border border-slate-500 p-1 font-bold">Travel From:</td><td className="border border-slate-500 p-1" colSpan="6">{formData.travelFrom}</td></tr>
                <tr><td className="border border-slate-500 p-1 font-bold">Travel To:</td><td className="border border-slate-500 p-1" colSpan="6">{formData.travelTo}</td></tr>
                <tr>
                  <td className="border border-slate-500 p-1 font-bold">Per Diem: Lodging</td>
                  <td className="border border-slate-500 p-1 text-center bg-slate-100 italic">Input</td>
                  <td className="border border-slate-500 p-1 text-center font-bold" colSpan="5">{formData.perDiemLodging || 0}</td>
                </tr>
                <tr>
                  <td className="border border-slate-500 p-1 font-bold">Per Diem: M&IE</td>
                  <td className="border border-slate-500 p-1 text-center bg-slate-100 italic">Input</td>
                  <td className="border border-slate-500 p-1 text-center font-bold" colSpan="5">{formData.perDiemMIE || 0}</td>
                </tr>
                <tr><td className="border border-slate-500 p-1 font-bold">Project Name :</td><td className="border border-slate-500 p-1 uppercase" colSpan="6">{formData.projectName}</td></tr>

                {/* Main Table Column Names */}
                <tr className="bg-slate-100 text-[9px] font-black text-center uppercase">
                   <td className="border border-slate-500 p-1 text-left">Description</td>
                   <td className="border border-slate-500 p-1">Ref. No</td>
                   <td className="border border-slate-500 p-1" colSpan="5">Total Paid by Employee</td>
                   <td className="border border-slate-500 p-1">Cost in Excess of FAR</td>
                   <td className="border border-slate-500 p-1">Comments</td>
                </tr>

                {/* Rows matching image exactly */}
                <tr><td className="border border-slate-500 p-1">Personal Auto Miles</td><td className="border border-slate-500 p-1"></td><td className="border border-slate-500 p-1 text-center" colSpan="5">{formData.personalMiles || 0}</td><td className="border border-slate-500 p-1"></td><td className="border border-slate-500 p-1 text-center italic text-slate-400">To / From Airport</td></tr>
                <tr><td className="border border-slate-500 p-1 font-medium">Mileage ( 0.655 cents / mile)</td><td className="border border-slate-500 p-1"></td><td className="border border-slate-500 p-1 text-right font-bold" colSpan="5">${(formData.personalMiles * 0.655).toFixed(2)}</td><td className="border border-slate-500 p-1"></td><td className="border border-slate-500 p-1 text-center text-slate-400">No receipts are required</td></tr>
                <tr><td className="border border-slate-500 p-1 font-medium">Transport (Airline/Train) **</td><td className="border border-slate-500 p-1"></td><td className="border border-slate-500 p-1 text-right" colSpan="5">${parseFloat(formData.transportCost || 0).toFixed(2)}</td><td className="border border-slate-500 p-1"></td><td className="border border-slate-500 p-1"></td></tr>
                <tr><td className="border border-slate-500 p-1 font-medium">M&IE (Per Diem only)</td><td className="border border-slate-500 p-1"></td><td className="border border-slate-500 p-1 text-right" colSpan="5">${parseFloat(formData.miePerDiem || 0).toFixed(2)}</td><td className="border border-slate-500 p-1"></td><td className="border border-slate-500 p-1 text-center text-slate-400 font-bold">No receipts are required</td></tr>

                {/* ORANGE SECTION (MANDATORY) */}
                <tr className="bg-[#B87333]/30 font-bold text-slate-900">
                  <td className="border border-slate-500 p-1">Lodging room (actuals) **</td><td className="border border-slate-500 p-1"></td><td className="border border-slate-500 p-1 text-right" colSpan="5">${parseFloat(formData.lodgingActual || 0).toFixed(2)}</td><td className="border border-slate-500 p-1"></td><td className="border border-slate-500 p-1"></td>
                </tr>
                <tr className="bg-[#B87333]/30 font-bold text-slate-900">
                  <td className="border border-slate-500 p-1">Lodging taxes (actuals) **</td><td className="border border-slate-500 p-1"></td><td className="border border-slate-500 p-1 text-right" colSpan="5">${parseFloat(formData.lodgingTaxes || 0).toFixed(2)}</td><td className="border border-slate-500 p-1"></td><td className="border border-slate-500 p-1"></td>
                </tr>
                <tr className="bg-[#B87333]/30 font-bold text-slate-900">
                  <td className="border border-slate-500 p-1">Allowable Lodging Charges</td><td className="border border-slate-500 p-1"></td><td className="border border-slate-500 p-1 text-right" colSpan="5">$ -</td><td className="border border-slate-500 p-1"></td><td className="border border-slate-500 p-1 text-center text-blue-800 uppercase text-[8px]">Allowable Expenses</td>
                </tr>
                <tr className="bg-[#B87333]/30 font-black italic text-[9px]">
                  <td className="border border-slate-500 p-2" colSpan="8">Please do not enter any values in the shaded boxes (Rows 18-20)</td>
                  <td className="border border-slate-500 p-2 text-center text-blue-800 uppercase text-[8px]">Unallowable Expenses</td>
                </tr>

                {/* Remaining Rows */}
                <tr><td className="border border-slate-500 p-1">Car Rental, Taxis *</td><td className="border border-slate-500 p-1"></td><td className="border border-slate-500 p-1 text-right" colSpan="5">${parseFloat(formData.rentalTaxi || 0).toFixed(2)}</td><td className="border border-slate-500 p-1"></td><td className="border border-slate-500 p-1"></td></tr>
                <tr><td className="border border-slate-500 p-1">Parking, Tolls *</td><td className="border border-slate-500 p-1"></td><td className="border border-slate-500 p-1 text-right" colSpan="5">${parseFloat(formData.parkingTolls || 0).toFixed(2)}</td><td className="border border-slate-500 p-1"></td><td className="border border-slate-500 p-1"></td></tr>
                <tr><td className="border border-slate-500 p-1">Other (specify) *</td><td className="border border-slate-500 p-1"></td><td className="border border-slate-500 p-1 text-right" colSpan="5">${parseFloat(formData.otherCost || 0).toFixed(2)}</td><td className="border border-slate-500 p-1"></td><td className="border border-slate-500 p-1"></td></tr>

                {/* Grand Total */}
                <tr className="bg-blue-600 text-white font-black">
                  <td className="border border-slate-500 p-3 text-right uppercase tracking-widest text-[11px]" colSpan="7">Total Expenses Paid</td>
                  <td className="border border-slate-500 p-3 text-right text-sm font-black">${calculateTotal().toFixed(2)}</td>
                  <td className="border border-slate-500 p-3 text-right">$ -</td>
                </tr>
              </tbody>
            </table>

            {/* Verification & Footer */}
            <div className="mt-4 text-[9px] text-slate-500 italic leading-tight mb-8">
              I certify this statement is accurate and prepared in accordance with FAR Section 31 cost principles and all unallowable costs have been identified on this report.
            </div>

            <div className="grid grid-cols-2 gap-10 text-[10px]">
               <div className="space-y-6">
                 <div className="border-b border-slate-400 pb-1 flex justify-between"><span>Employee Signature</span><span>Date</span></div>
                 <div className="border-b border-slate-400 pb-1"><span>Supervisor Signature</span></div>
               </div>
               <div className="space-y-2 text-right">
                  <div className="flex justify-between border-b border-slate-200"><span>Total Expenses Paid</span><span className="font-bold">${calculateTotal().toFixed(2)}</span></div>
                  <div className="flex justify-between border-b border-slate-200"><span>Less Travel Advance</span><span className="font-bold">(${parseFloat(formData.travelAdvance || 0).toFixed(2)})</span></div>
                  <div className="flex justify-between pt-2 border-t-2 border-blue-600">
                    <span className="font-black text-blue-700 uppercase">Amount Due Employee</span>
                    <span className="text-xl font-black text-slate-900">${amountDue.toFixed(2)}</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelExpenses;
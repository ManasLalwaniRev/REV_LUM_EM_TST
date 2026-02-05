
// import React, { useState, useMemo, useEffect } from 'react';
// import { ChevronDown, ChevronRight, Plus, Pencil, Download, Search, LogOut, X, Save } from 'lucide-react';
// import * as XLSX from 'xlsx';

// const formatDateForDisplay = (isoString) => {
//   if (!isoString) return '';
//   const date = new Date(isoString);
//   if (isNaN(date.getTime())) return 'Invalid Date';
//   return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'UTC' });
// };

// const Vendor_Expenses = ({ 
//   dataEntries, 
//   isLoading, 
//   error, 
//   userName = 'User', 
//   userAvatar, 
//   handleLogout, 
//   currentUserRole,
//   currentUserId,
//   onDataChanged,
//   contractOptions = [],
//   creditCardOptions = [] // Used for Vendor ID dropdown
// }) => {
//   const [searchColumn, setSearchColumn] = useState('all');
//   const [searchValue, setSearchValue] = useState('');
//   const [showOnlyLatest, setShowOnlyLatest] = useState(false);
//   const [expandedRows, setExpandedRows] = useState(new Set());
//   const [selectedRows, setSelectedRows] = useState(new Set());
//   const [isExporting, setIsExporting] = useState(false);

//   // --- LOCAL STATE CACHE ---
//   const [localEntries, setLocalEntries] = useState([]);

//   useEffect(() => {
//     setLocalEntries(dataEntries || []);
//   }, [dataEntries]);

//   // --- INLINE FORM STATE ---
//   const [isAdding, setIsAdding] = useState(false);
//   const [editingEntry, setEditingEntry] = useState(null);
//   const [formData, setFormData] = useState({
//     vendorId: '', 
//     contractShortName: '',
//     vendorName: '',
//     chargeDate: '',
//     chargeAmount: '',
//     submittedDate: '',
//     pmEmail: '',
//     chargeCode: '',
//     isApproved: false,
//     notes: '',
//     pdfFilePath: '',
//   });

//   const pmEmailOptions = [
//     'pm.manager1@infotrend.com',
//     'pm.manager2@infotrend.com',
//     'admin.finance@infotrend.com',
//     'operations.lead@infotrend.com'
//   ];

//   const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/vendor-expenses`;

//   const searchableColumns = [
//     { key: 'all', name: 'All Fields' },
//     { key: 'vendorId', name: 'Vendor ID' },
//     { key: 'contractShortName', name: 'Contract' },
//     { key: 'vendorName', name: 'Vendor' },
//     { key: 'submitter', name: 'Submitter' },
//   ];

//   // --- PORTED LOGIC: GROUPING, SORTING, SEARCH, AND LATEST TOGGLE ---
//   const groupedEntries = useMemo(() => {
//     // 1. Group by the base Record No (e.g., 1, 1.1, 1.2 all group under "1")
//     const groups = localEntries.reduce((acc, entry) => {
//       const baseKey = String(entry.primeKey).split('.')[0];
//       if (!acc[baseKey]) acc[baseKey] = [];
//       acc[baseKey].push(entry);
//       return acc;
//     }, {});

//     // 2. Sort versions within each group (Highest version first)
//     for (const key in groups) {
//       groups[key].sort((a, b) => parseFloat(b.primeKey) - parseFloat(a.primeKey));
//     }

//     let filteredGroups = Object.values(groups);

//     // 3. Apply Search Logic
//     if (searchValue) {
//       const lowercasedValue = searchValue.toLowerCase();
//       filteredGroups = filteredGroups.filter(group =>
//         group.some(entry => {
//           if (searchColumn === 'all') {
//             return Object.values(entry).some(value => 
//               (String(value) || '').toLowerCase().includes(lowercasedValue)
//             );
//           } else {
//             return String(entry[searchColumn] || '').toLowerCase().includes(lowercasedValue);
//           }
//         })
//       );
//     }

//     // 4. Filter for Latest Only if toggled
//     return showOnlyLatest ? filteredGroups.map(group => [group[0]]) : filteredGroups;
//   }, [localEntries, searchColumn, searchValue, showOnlyLatest]);

//   const visibleEntryIds = useMemo(() => groupedEntries.flat().map(entry => entry.id), [groupedEntries]);

//   const handleInputChange = (e) => {
//     const { id, value, type, checked } = e.target;
//     setFormData(prev => ({ ...prev, [id]: type === 'checkbox' ? checked : value }));
//   };

//   const resetForm = () => {
//     setFormData({
//       vendorId: '', contractShortName: '', vendorName: '', chargeDate: '',
//       chargeAmount: '', submittedDate: '', pmEmail: '', chargeCode: '',
//       isApproved: false, notes: '', pdfFilePath: ''
//     });
//     setIsAdding(false);
//     setEditingEntry(null);
//   };

//   const handleSave = async (e) => {
//     e.preventDefault();
//     const method = editingEntry ? 'PATCH' : 'POST';
//     const url = editingEntry ? `${API_BASE_URL}/${editingEntry.id}` : `${API_BASE_URL}/new`;
//     try {
//       await fetch(url, {
//         method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ ...formData, userId: currentUserId, submitter: userName }),
//       });
//       if (onDataChanged) onDataChanged();
//       resetForm();
//     } catch (err) {
//       console.warn("Backend update failed, record kept in local state.");
//     }
//   };

//   const startEdit = () => {
//     const entryId = Array.from(selectedRows)[0];
//     const entry = localEntries.find(e => e.id === entryId);
//     if (entry) {
//       setEditingEntry(entry);
//       setFormData({
//         vendorId: entry.vendorId || '',
//         contractShortName: entry.contractShortName || '',
//         vendorName: entry.vendorName || '',
//         chargeDate: entry.chargeDate ? entry.chargeDate.split('T')[0] : '',
//         chargeAmount: entry.chargeAmount || '',
//         submittedDate: entry.submittedDate ? entry.submittedDate.split('T')[0] : '',
//         pmEmail: entry.pmEmail || '',
//         chargeCode: entry.chargeCode || '',
//         isApproved: entry.isApproved || false,
//         notes: entry.notes || '',
//         pdfFilePath: entry.pdfFilePath || '',
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
//           "Record No": entry.primeKey,
//           "Vendor ID": entry.vendorId,
//           "Contract": entry.contractShortName,
//           "Vendor Name": entry.vendorName,
//           "Amount": entry.chargeAmount,
//           "Charge Date": formatDateForDisplay(entry.chargeDate),
//           "Submitter": entry.submitter,
//           "PM Email": entry.pmEmail,
//           "Notes": entry.notes
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
//         a.download = 'VendorExpensesExport.xlsx';
//         document.body.appendChild(a);
//         a.click();
//         a.remove();
//         window.URL.revokeObjectURL(url);
//       } catch (err) {
//         console.error("Export error:", err);
//       } finally {
//         setIsExporting(false);
//       }
//     }
//   };

//   const Row = ({ entry, isHistory = false }) => (
//     <React.Fragment>
//         <td className="p-0 text-center">
//             <label className="flex items-center justify-center p-4 cursor-pointer">
//                 <input type="checkbox" checked={selectedRows.has(entry.id)} onChange={() => {
//                    const next = new Set(selectedRows);
//                    next.has(entry.id) ? next.delete(entry.id) : next.add(entry.id);
//                    setSelectedRows(next);
//                 }} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
//             </label>
//         </td>
//         <td className={`px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900 ${isHistory ? 'pl-12' : ''}`}>
//             {!isHistory && groupedEntries.find(g => g[0].id === entry.id)?.length > 1 ? (
//               <button onClick={() => {
//                 const baseKey = String(entry.primeKey).split('.')[0];
//                 const next = new Set(expandedRows);
//                 next.has(baseKey) ? next.delete(baseKey) : next.add(baseKey);
//                 setExpandedRows(next);
//               }} className="mr-2 inline-block">
//                 {expandedRows.has(String(entry.primeKey).split('.')[0]) ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
//               </button>
//             ) : isHistory ? null : <span className="w-6 inline-block"/>}
//             {entry.primeKey}
//         </td>
//         <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">{entry.vendorId}</td>
//         <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">{entry.contractShortName}</td>
//         <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">{entry.vendorName}</td>
//         <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">{formatDateForDisplay(entry.chargeDate)}</td>
//         <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">${parseFloat(entry.chargeAmount || 0).toFixed(2)}</td>
//         <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">{entry.submitter}</td>
//         <td className="px-6 py-3 whitespace-nowrap text-sm text-blue-600">
//             {entry.pdfFilePath ? <a href={entry.pdfFilePath} target="_blank" rel="noreferrer" className="hover:underline">View PDF</a> : 'N/A'}
//         </td>
//         <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">{entry.apvNumber || 'N/A'}</td>
//         <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">{entry.accountingProcessed === 'T' ? 'Yes' : 'No'}</td>
//     </React.Fragment>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 sm:p-6 lg:p-8 text-gray-100 flex justify-center items-start">
//         <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-full text-gray-800">
//             {/* Header */}
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
//                 <h1 className="text-3xl font-extrabold text-lime-800">Vendor Expenses</h1>
//                 <div className="flex items-center gap-4">
//                     <img src="/Lumina_logo.png" alt="Logo" className="h-10 pr-4" />
//                     <div className="flex items-center gap-3 bg-gray-100 p-2 rounded-lg">
//                         <img src={userAvatar} alt="Avatar" className="w-10 h-10 rounded-full border" />
//                         <span className="font-medium text-gray-700">Welcome, {userName}</span>
//                     </div>
//                     <button onClick={handleLogout} className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"><LogOut size={20}/></button>
//                 </div>
//             </div>

//             {/* Inline Form */}
//             {(isAdding || editingEntry) && (
//               <div className="mb-8 p-6 border-2 border-blue-200 rounded-xl bg-blue-50 animate-in fade-in slide-in-from-top-4">
//                 <div className="flex justify-between items-center mb-4 text-blue-900">
//                   <h2 className="text-xl font-bold">{editingEntry ? 'Edit Vendor Entry' : 'Add New Vendor Entry'}</h2>
//                   <button onClick={resetForm} className="text-gray-500 hover:text-red-500"><X /></button>
//                 </div>
//                 <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                   <div>
//                     <label className="block text-xs font-bold mb-1">VENDOR ID *</label>
//                     <select id="vendorId" className="w-full p-2 border border-gray-300 rounded" value={formData.vendorId} onChange={handleInputChange} required>
//                       <option value="">Select Vendor ID</option>
//                       {creditCardOptions.map(opt => (
//                         <option key={opt.id} value={opt.name}>{opt.name}</option>
//                       ))}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-xs font-bold mb-1">CONTRACT *</label>
//                     <select id="contractShortName" className="w-full p-2 border border-gray-300 rounded" value={formData.contractShortName} onChange={handleInputChange} required>
//                       <option value="">Select Contract</option>
//                       {contractOptions.map(opt => <option key={opt.id} value={opt.name}>{opt.name}</option>)}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-xs font-bold mb-1">VENDOR NAME *</label>
//                     <input id="vendorName" type="text" className="w-full p-2 border border-gray-300 rounded" value={formData.vendorName} onChange={handleInputChange} required />
//                   </div>
//                   <div>
//                     <label className="block text-xs font-bold mb-1">AMOUNT *</label>
//                     <input id="chargeAmount" type="number" step="0.01" className="w-full p-2 border border-gray-300 rounded" value={formData.chargeAmount} onChange={handleInputChange} required />
//                   </div>
//                   <div>
//                     <label className="block text-xs font-bold mb-1">CHARGE DATE *</label>
//                     <input id="chargeDate" type="date" className="w-full p-2 border border-gray-300 rounded" value={formData.chargeDate} onChange={handleInputChange} required />
//                   </div>
//                   <div>
//                     <label className="block text-xs font-bold mb-1">SUBMITTED DATE *</label>
//                     <input id="submittedDate" type="date" className="w-full p-2 border border-gray-300 rounded" value={formData.submittedDate} onChange={handleInputChange} required />
//                   </div>
//                   <div>
//                     <label className="block text-xs font-bold mb-1">PM EMAIL *</label>
//                     <select id="pmEmail" className="w-full p-2 border border-gray-300 rounded" value={formData.pmEmail} onChange={handleInputChange} required>
//                       <option value="">Select PM Email</option>
//                       {pmEmailOptions.map(email => <option key={email} value={email}>{email}</option>)}
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-xs font-bold mb-1">PDF PATH *</label>
//                     <input id="pdfFilePath" type="text" className="w-full p-2 border border-gray-300 rounded" value={formData.pdfFilePath} onChange={handleInputChange} required />
//                   </div>
//                   <div className="lg:col-span-2">
//                     <label className="block text-xs font-bold mb-1">CHARGE CODE *</label>
//                     <textarea id="chargeCode" rows="1" className="w-full p-2 border border-gray-300 rounded" value={formData.chargeCode} onChange={handleInputChange} required />
//                   </div>
//                   <div className="lg:col-span-2">
//                     <label className="block text-xs font-bold mb-1">NOTES</label>
//                     <textarea id="notes" rows="1" className="w-full p-2 border border-gray-300 rounded" value={formData.notes} onChange={handleInputChange} placeholder="Add additional notes here..." />
//                   </div>
//                   <div className="lg:col-span-4 flex items-center gap-3 bg-white p-2 rounded border border-blue-200">
//                     <input type="checkbox" id="isApproved" checked={formData.isApproved} onChange={handleInputChange} className="w-5 h-5 cursor-pointer" />
//                     <label htmlFor="isApproved" className="text-xs font-bold text-blue-800 uppercase cursor-pointer">Program Manager Approver</label>
//                   </div>
//                   <div className="lg:col-span-4 flex justify-end">
//                     <button type="submit" className="bg-blue-600 text-white px-8 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
//                       <Save size={18}/> {editingEntry ? 'Update' : 'Save'}
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             )}

//             {/* Ported Controls: Search and Toggle */}
//             <div className="flex flex-col md:flex-row justify-between items-center bg-gray-100 p-4 rounded-lg mb-6 gap-3">
//                 <div className="flex items-center border rounded-lg bg-white flex-grow">
//                     <select value={searchColumn} onChange={(e) => setSearchColumn(e.target.value)} className="p-2 bg-transparent border-r text-sm">
//                         {searchableColumns.map(col => <option key={col.key} value={col.key}>{col.name}</option>)}
//                     </select>
//                     <input type="text" placeholder="Search vendor expenses..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)} className="w-full p-2 text-sm focus:outline-none" />
//                     <Search size={18} className="text-gray-400 mr-3" />
//                 </div>
//                 <label className="flex items-center cursor-pointer gap-3 text-sm font-medium">
//                     Show Latest Only
//                     <input type="checkbox" checked={showOnlyLatest} onChange={(e) => setShowOnlyLatest(e.target.checked)} className="w-4 h-4" />
//                 </label>
//             </div>

//             <div className="flex gap-3 mb-6">
//                 {!isAdding && !editingEntry && (
//                   <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 bg-yellow-500 text-white px-5 py-2.5 rounded-lg hover:bg-yellow-600 transition"><Plus size={20}/> Add</button>
//                 )}
//                 <button onClick={startEdit} disabled={selectedRows.size !== 1} className="flex items-center gap-2 bg-gray-600 text-white px-5 py-2.5 rounded-lg disabled:opacity-50"><Pencil size={20}/> Edit</button>
//                 <button onClick={handleExport} disabled={selectedRows.size === 0 && !isExporting} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg disabled:opacity-50">
//                     <Download size={20}/> {isExporting ? 'Exporting...' : 'Export'}
//                 </button>
//             </div>
            
//             {/* Table */}
//             <div className="overflow-x-auto rounded-lg border">
//                 <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                         <tr>
//                             <th className="p-4 w-12 text-center">
//                               <input type="checkbox" onChange={(e) => setSelectedRows(e.target.checked ? new Set(visibleEntryIds) : new Set())} checked={visibleEntryIds.length > 0 && selectedRows.size === visibleEntryIds.length} />
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Record No</th>
//                             <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Vendor ID</th>
//                             <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Contract</th>
//                             <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Vendor</th>
//                             <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Charge Date</th>
//                             <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Amount</th>
//                             <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Submitter</th>
//                             <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">PDF</th>
//                             <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">APV No</th>
//                             <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Done</th>
//                         </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y">
//                         {groupedEntries.length > 0 ? (
//                             groupedEntries.map((group) => (
//                                 <React.Fragment key={group[0].id}>
//                                     <tr className="hover:bg-blue-50 transition-colors">
//                                         <Row entry={group[0]} />
//                                     </tr>
//                                     {expandedRows.has(String(group[0].primeKey).split('.')[0]) && group.slice(1).map(hEntry => (
//                                         <tr key={hEntry.id} className="bg-gray-50 border-l-4 border-yellow-400">
//                                             <Row entry={hEntry} isHistory={true} />
//                                         </tr>
//                                     ))}
//                                 </React.Fragment>
//                             ))
//                         ) : (
//                             <tr><td colSpan="11" className="text-center p-6 text-gray-500 italic">No vendor expenses found.</td></tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     </div>
//   );
// };

// export default Vendor_Expenses;

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
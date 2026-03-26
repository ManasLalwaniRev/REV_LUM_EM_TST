
// ////////////
// import React, { useState, useMemo, useEffect } from 'react';
// import { Plus, Pencil, Download, Search, LogOut, X, Save } from 'lucide-react';
// import * as XLSX from 'xlsx';

// const SubcontractorAssignments = ({ 
//   dataEntries, 
//   isLoading, 
//   error, 
//   userName = 'User', 
//   userAvatar, 
//   handleLogout, 
//   currentUserRole,
//   onDataChanged 
// }) => {
//   const [searchColumn, setSearchColumn] = useState('all');
//   const [searchValue, setSearchValue] = useState('');
//   const [selectedRows, setSelectedRows] = useState(new Set());
//   const [isExporting, setIsExporting] = useState(false);
  
//   // --- DEMO CACHE LOGIC ---
//   // This local state acts as your "cache record" to show entries immediately
//   const [localEntries, setLocalEntries] = useState([]);

//   // Sync local cache whenever the main dataEntries prop changes
//   useEffect(() => {
//     setLocalEntries(dataEntries || []);
//   }, [dataEntries]);

//   // Local state for Inline Add/Edit features
//   const [isAdding, setIsAdding] = useState(false);
//   const [editingEntry, setEditingEntry] = useState(null);
//   const [formData, setFormData] = useState({
//     poNo: '',
//     subkName: '',
//     employeeName: '',
//     projectCode: '',
//     plc: ''
//   });

//   // const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/entries`;

//   const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/subcontractor-assignments`;
//   const searchableColumns = [
//     { key: 'all', name: 'All Fields' },
//     { key: 'poNo', name: 'PO No.' },
//     { key: 'subkName', name: 'SubK Name' },
//     { key: 'employeeName', name: 'Employee Name' },
//     { key: 'projectCode', name: 'Project Code' },
//     { key: 'plc', name: 'PLC' },
//   ];

//   // Filter localEntries (the cache) instead of dataEntries
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
//     setFormData({ poNo: '', subkName: '', employeeName: '', projectCode: '', plc: '' });
//     setIsAdding(false);
//     setEditingEntry(null);
//   };

//   const handleSave = async (e) => {
//     e.preventDefault();
    
//     // 1. Create the "Cache Record" for immediate display
//     const newRecord = {
//       ...formData,
//       id: editingEntry ? editingEntry.id : Date.now(), // Temporary ID for demo
//       submitter: userName,
//     };

//     // 2. Update the local cache state immediately
//     if (editingEntry) {
//       setLocalEntries(prev => prev.map(en => en.id === editingEntry.id ? newRecord : en));
//     } else {
//       setLocalEntries(prev => [newRecord, ...prev]);
//     }

//     // 3. (Optional) Proceed with actual API call
//     const method = editingEntry ? 'PATCH' : 'POST';
//     const url = editingEntry ? `${API_BASE_URL}/${editingEntry.id}` : `${API_BASE_URL}/new`;
    
//     try {
//       const response = await fetch(url, {
//         method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ 
//           ...formData, 
//           submitter: userName,
//           category: 'subcontractor' 
//         }),
//       });

//       if (response.ok && onDataChanged) {
//         onDataChanged(); // Keep parent in sync if API succeeds
//       }
//     } catch (err) {
//       console.error("API failed, but record is kept in local cache for demo.", err);
//     }

//     resetForm();
//   };

//   const startEdit = () => {
//     const entryId = Array.from(selectedRows)[0];
//     const entry = localEntries.find(e => e.id === entryId);
//     if (entry) {
//       setEditingEntry(entry);
//       setFormData({
//         poNo: entry.poNo || '',
//         subkName: entry.subkName || '',
//         employeeName: entry.employeeName || '',
//         projectCode: entry.projectCode || '',
//         plc: entry.plc || ''
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
//         <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">{entry.poNo || 'N/A'}</td>
//         <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">{entry.subkName || 'N/A'}</td>
//         <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">{entry.employeeName || 'N/A'}</td>
//         <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">{entry.projectCode || 'N/A'}</td>
//         <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">{entry.plc || 'N/A'}</td>
//         <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">{entry.submitter || 'N/A'}</td>
//     </React.Fragment>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 sm:p-6 lg:p-8 text-gray-100 flex justify-center items-start">
//         <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-full">
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
//                 <h1 className="text-3xl font-extrabold">
//                     <span className="block text-transparent bg-clip-text text-black-800">
//                         Subcontractor Assignments
//                     </span>
//                 </h1>
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

//             {/* Inline Add/Edit Form Section */}
//             {(isAdding || editingEntry) && (
//               <div className="mb-8 p-6 border-2 border-yellow-200 rounded-xl bg-yellow-50 animate-in fade-in slide-in-from-top-4 text-gray-800">
//                 <div className="flex justify-between items-center mb-4">
//                   <h2 className="text-xl font-bold text-yellow-900">
//                     {editingEntry ? 'Edit Subcontractor Assignment' : 'Add New Assignment'}
//                   </h2>
//                   <button onClick={resetForm} className="text-gray-500 hover:text-red-500"><X /></button>
//                 </div>
//                 <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                   <div>
//                     <label className="block text-sm font-semibold mb-1">PO No.</label>
//                     <input 
//                       id="poNo" type="text" required
//                       className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500"
//                       value={formData.poNo} onChange={handleInputChange}
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold mb-1">SubK Name</label>
//                     <input 
//                       id="subkName" type="text" required
//                       className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500"
//                       value={formData.subkName} onChange={handleInputChange}
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold mb-1">New SubK Employee Name</label>
//                     <input 
//                       id="employeeName" type="text" required
//                       className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500"
//                       value={formData.employeeName} onChange={handleInputChange}
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold mb-1">Project Code</label>
//                     <input 
//                       id="projectCode" type="text" required
//                       className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500"
//                       value={formData.projectCode} onChange={handleInputChange}
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-semibold mb-1">PLC</label>
//                     <input 
//                       id="plc" type="text" required
//                       className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500"
//                       value={formData.plc} onChange={handleInputChange}
//                     />
//                   </div>
//                   <div className="lg:col-span-3 flex justify-end">
//                     <button type="submit" className="flex items-center gap-2 bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition">
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
//                       <Plus size={20} /> Add Assignment
//                   </button>
//                 )}
//                 <button 
//                     onClick={startEdit}
//                     disabled={selectedRows.size !== 1}
//                     className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold py-2.5 px-5 rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:-translate-y-0.5 disabled:opacity-50"
//                   >
//                     <Pencil size={20} /> Edit 
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

// Deployed Code Here 


// import React, { useState } from 'react';
// import { Layout, Plus, Save, LogOut, Eye, EyeOff, Trash2, Briefcase, FileText, UserCheck, List, Edit } from 'lucide-react';

// const SubcontractorAssignments = ({ 
//   dataEntries = [], userName, handleLogout, 
//   currentUserId, onDataChanged 
// }) => {
//   const [activeTab, setActiveTab] = useState('list'); // 'list', 'new', 'mod'
//   const [isPreviewOn, setIsPreviewOn] = useState(true);
//   const [isSaving, setIsSaving] = useState(false);

//   // --- FORM STATE (SHARED) ---
//   const [actionForm, setActionForm] = useState({
//     // Shared
//     programManager: '', projectName: '',
//     // New Subk Specific
//     companyName: '', companyAddress: '', companyPoc: '', pocPhone: '', pocEmail: '',
//     agreementType: 'FFP', popStart: '', popEnd: '',
//     hasOptionPeriods: 'No', optionPeriodsThrough: '', fundingAuthAmount: '',
//     // Mod Specific
//     subcontractNumber: '', modDescription: '', scopeChanges: '',
//     // Shared Labor
//     laborItems: [{ name: '', category: '', start: '', end: '', rate: '', hours: '', total: '' }],
//     totalTravel: 0, totalOdc: 0
//   });

//   // --- HANDLERS ---
//   const handleActionChange = (e) => {
//     const { id, value } = e.target;
//     setActionForm(prev => ({ ...prev, [id]: value }));
//   };

//   const handleLaborChange = (index, field, value) => {
//     const newItems = [...actionForm.laborItems];
//     newItems[index][field] = value;
//     // Auto-calc row total
//     if (field === 'rate' || field === 'hours') {
//         const r = parseFloat(field === 'rate' ? value : newItems[index].rate) || 0;
//         const h = parseFloat(field === 'hours' ? value : newItems[index].hours) || 0;
//         newItems[index].total = (r * h).toFixed(2);
//     }
//     setActionForm(prev => ({ ...prev, laborItems: newItems }));
//   };

//   const addLaborRow = () => setActionForm(prev => ({ ...prev, laborItems: [...prev.laborItems, { name: '', category: '', start: '', end: '', rate: '', hours: '', total: '' }] }));
  
//   const removeLaborRow = (index) => {
//     if (actionForm.laborItems.length > 1) {
//       setActionForm(prev => ({ ...prev, laborItems: prev.laborItems.filter((_, i) => i !== index) }));
//     }
//   };

//   // --- CALCULATIONS ---
//   const totalLabor = actionForm.laborItems.reduce((sum, item) => sum + parseFloat(item.total || 0), 0);
//   const grandTotal = totalLabor + parseFloat(actionForm.totalTravel || 0) + parseFloat(actionForm.totalOdc || 0);

//   // --- SAVE ---
//   const handleSaveAction = async (e) => {
//     e.preventDefault();
//     if (isSaving) return;
//     setIsSaving(true);

//     // Determine Type based on Tab
//     const requestType = activeTab === 'new' ? 'New' : 'Modification';

//     const payload = { 
//         ...actionForm, 
//         requestType, 
//         totalLabor, 
//         userId: currentUserId 
//     };
    
//     const API_BASE = import.meta.env.VITE_API_BASE_URL;

//     try {
//       const response = await fetch(`${API_BASE}/subcontractor-actions/new`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         alert(`${requestType} Request Saved!\nReference ID: ${data.prime_key}`);
//         window.location.reload();
//       } else {
//         throw new Error('Failed to save request');
//       }
//     } catch (err) {
//       alert("Error: " + err.message);
//       setIsSaving(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-100 p-4 font-sans text-slate-800">
      
//       {/* HEADER & TABS */}
//       <div className="flex flex-col md:flex-row justify-between items-center mb-4 bg-white p-3 rounded-xl shadow-sm border border-slate-200">
//         <div className="flex items-center gap-4 w-full md:w-auto">
//            <h1 className="text-lg font-black tracking-tight text-blue-900 hidden md:block ">SubK Management</h1>
//            <div className="flex bg-slate-100 p-1 rounded-lg w-full md:w-auto">
//               <button onClick={() => setActiveTab('list')} className={`flex-2 px-4 py-2 rounded-md text-xs font-bold  tracking-wider flex items-center gap-2 ${activeTab === 'list' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-400'}`}>
//                 <List size={14}/> List
//               </button>
//               <button onClick={() => setActiveTab('new')} className={`flex-2 px-4 py-2 rounded-md text-xs font-bold tracking-wider flex items-center gap-2 ${activeTab === 'new' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-400'}`}>
//                 <UserCheck size={14}/> New SubK
//               </button>
//               <button onClick={() => setActiveTab('mod')} className={`flex-2 px-4 py-2 rounded-md text-xs font-bold  tracking-wider flex items-center gap-2 ${activeTab === 'mod' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-400'}`}>
//                 <Edit size={14}/> Mod Form
//               </button>
//            </div>
//         </div>
//         <div className="flex items-center gap-2">
//             {(activeTab === 'new' || activeTab === 'mod') && (
//                 <button onClick={() => setIsPreviewOn(!isPreviewOn)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold ${isPreviewOn ? 'bg-yellow-600 text-white' : 'bg-slate-200'}`}>
//                     {isPreviewOn ? <EyeOff size={14}/> : <Eye size={14}/>} {isPreviewOn ? 'HIDE PREVIEW' : 'SHOW PREVIEW'}
//                 </button>
//             )}
//             <button onClick={handleLogout} className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100"><LogOut size={20}/></button>
//         </div>
//       </div>

//       {/* --- TAB 1: ASSIGNMENTS LIST --- */}
//       {activeTab === 'list' && (
//         <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-blue-600">
//            <div className="flex justify-between items-center mb-6">
//               <h2 className="text-xl font-bold text-slate-700">Subcontractor Requests & Assignments</h2>
//               <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">{dataEntries.length} Records</span>
//            </div>
//            <div className="overflow-x-auto border rounded-lg">
//              <table className="min-w-full divide-y text-sm">
//                <thead className="bg-slate-50 uppercase font-bold text-slate-500 text-xs">
//                  <tr>
//                    <th className="px-6 py-3 text-left">Ref Key</th>
//                    <th className="px-6 py-3 text-left">Project</th>
//                    <th className="px-6 py-3 text-left">Type</th>
//                    <th className="px-6 py-3 text-left">Amount</th>
//                    <th className="px-6 py-3 text-left">Status</th>
//                  </tr>
//                </thead>
//                <tbody className="bg-white divide-y">
//                  {dataEntries.map(entry => (
//                    <tr key={entry.id} className="hover:bg-blue-50 transition-colors">
//                      <td className="px-6 py-3 font-bold text-blue-600">{entry.prime_key || entry.id}</td>
//                      <td className="px-6 py-3 font-medium">{entry.project_name || entry.projectName}</td>
//                      <td className="px-6 py-3 text-slate-600">{entry.request_type || 'Assignment'}</td>
//                      <td className="px-6 py-3 font-mono font-bold text-green-700">${parseFloat(entry.grand_total || entry.charge_amount || 0).toFixed(2)}</td>
//                      <td className="px-6 py-3"><span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide">{entry.status}</span></td>
//                    </tr>
//                  ))}
//                </tbody>
//              </table>
//            </div>
//         </div>
//       )}

//       {/* --- FORMS CONTAINER --- */}
//       {(activeTab === 'new' || activeTab === 'mod') && (
//         <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-140px)]">
           
//            {/* DATA ENTRY SIDE */}
//            <div className={`${isPreviewOn ? 'lg:w-1/3' : 'lg:w-full max-w-5xl mx-auto'} bg-white rounded-xl shadow-lg overflow-y-auto p-6 border-t-4 border-blue-600 transition-all duration-300`}>
//               <form onSubmit={handleSaveAction} className="space-y-4">
//                   <div className="flex items-center gap-2 mb-2 pb-2 border-b">
//                       {activeTab === 'new' ? <UserCheck className="text-blue-600" size={18} /> : <Edit className="text-blue-600" size={18} />}
//                       <h2 className="font-black text-slate-700  tracking-wide text-sm">{activeTab === 'new' ? 'New Subcontract' : 'Modification'} Request</h2>
//                   </div>
                  
//                   <input id="programManager" placeholder="Program Manager" className="w-full p-2 border rounded text-sm bg-slate-50" value={actionForm.programManager} onChange={handleActionChange}/>
//                   <input id="projectName" placeholder="Project Name / Code" className="w-full p-2 border rounded text-sm bg-slate-50" value={actionForm.projectName} onChange={handleActionChange}/>

//                   {/* TAB SPECIFIC FIELDS */}
//                   {activeTab === 'new' ? (
//                       <div className="space-y-3 pt-2 border-t">
//                           <input id="companyName" placeholder="Company Name" className="w-full p-2 border rounded text-sm" value={actionForm.companyName} onChange={handleActionChange}/>
//                           <textarea id="companyAddress" placeholder="Company Address" className="w-full p-2 border rounded text-sm h-12" value={actionForm.companyAddress} onChange={handleActionChange}/>
//                           <div className="grid grid-cols-2 gap-2">
//                              <input id="companyPoc" placeholder="POC Name" className="p-2 border rounded text-sm" value={actionForm.companyPoc} onChange={handleActionChange}/>
//                              <input id="pocPhone" placeholder="POC Phone" className="p-2 border rounded text-sm" value={actionForm.pocPhone} onChange={handleActionChange}/>
//                           </div>
//                           <input id="pocEmail" placeholder="POC Email" className="w-full p-2 border rounded text-sm" value={actionForm.pocEmail} onChange={handleActionChange}/>
                          
//                           <select id="agreementType" className="w-full p-2 border rounded text-sm" value={actionForm.agreementType} onChange={handleActionChange}>
//                               <option value="FFP">FFP - Firm Fixed Price</option>
//                               <option value="LH">LH - Labor Hour</option>
//                               <option value="T&M">T&M - Time & Materials</option>
//                           </select>
//                           <div className="grid grid-cols-2 gap-2">
//                               <input id="popStart" type="date" className="p-2 border rounded text-sm" value={actionForm.popStart} onChange={handleActionChange}/>
//                               <input id="popEnd" type="date" className="p-2 border rounded text-sm" value={actionForm.popEnd} onChange={handleActionChange}/>
//                           </div>
//                           <input id="fundingAuthAmount" type="number" placeholder="Authorized Funding $" className="w-full p-2 border rounded text-sm" value={actionForm.fundingAuthAmount} onChange={handleActionChange}/>
//                       </div>
//                   ) : (
//                       <div className="space-y-3 pt-2 border-t">
//                           <input id="subcontractNumber" placeholder="Infotrend Subcontract #" className="w-full p-2 border rounded text-sm font-bold text-blue-900" value={actionForm.subcontractNumber} onChange={handleActionChange}/>
//                           <textarea id="modDescription" placeholder="What are you requesting to change?" className="w-full p-2 border rounded text-sm h-20" value={actionForm.modDescription} onChange={handleActionChange}/>
//                           <textarea id="scopeChanges" placeholder="Changes to Scope of Work (if applicable)" className="w-full p-2 border rounded text-sm h-20" value={actionForm.scopeChanges} onChange={handleActionChange}/>
//                       </div>
//                   )}

//                   {/* LABOR BREAKOUT (SHARED) */}
//                   <div className="pt-4 border-t space-y-3">
//                       <div className="flex justify-between items-center">
//                           <label className="text-[10px] font-black text-slate-400  tracking-widest">Labor Breakout</label>
//                           <button type="button" onClick={addLaborRow} className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded font-bold flex gap-1"><Plus size={12}/> Add</button>
//                       </div>
//                       {actionForm.laborItems.map((item, idx) => (
//                           <div key={idx} className="bg-slate-50 p-2 rounded border relative">
//                               <div className="grid grid-cols-2 gap-2 mb-2">
//                                   <input placeholder="Name" className="p-1 border rounded text-xs" value={item.name} onChange={(e) => handleLaborChange(idx, 'name', e.target.value)}/>
//                                   <input placeholder="Category" className="p-1 border rounded text-xs" value={item.category} onChange={(e) => handleLaborChange(idx, 'category', e.target.value)}/>
//                               </div>
//                               <div className="grid grid-cols-3 gap-2 mb-2">
//                                   <input type="number" placeholder="Rate" className="p-1 border rounded text-xs" value={item.rate} onChange={(e) => handleLaborChange(idx, 'rate', e.target.value)}/>
//                                   <input type="number" placeholder="Hrs" className="p-1 border rounded text-xs" value={item.hours} onChange={(e) => handleLaborChange(idx, 'hours', e.target.value)}/>
//                                   <input disabled placeholder="Total" className="p-1 border rounded text-xs bg-slate-100" value={item.total} />
//                               </div>
//                               {actionForm.laborItems.length > 1 && <button type="button" onClick={() => removeLaborRow(idx)} className="absolute -top-1 -right-1 bg-red-100 text-red-500 p-1 rounded-full"><Trash2 size={10}/></button>}
//                           </div>
//                       ))}
//                   </div>

//                   {/* TOTALS */}
//                   <div className="pt-4 border-t grid grid-cols-2 gap-3">
//                       <input id="totalTravel" type="number" placeholder="Travel Cost" className="p-2 border rounded text-sm" value={actionForm.totalTravel} onChange={handleActionChange}/>
//                       <input id="totalOdc" type="number" placeholder="ODC Cost" className="p-2 border rounded text-sm" value={actionForm.totalOdc} onChange={handleActionChange}/>
//                   </div>

//                   <button disabled={isSaving} className={`w-full text-white font-black py-3 rounded-lg shadow tracking-tighter text-sm mt-4 ${isSaving ? 'bg-slate-400' : 'bg-green-600 hover:bg-green-700'}`}>
//                       {isSaving ? 'Saving...' : `Save ${activeTab === 'new' ? 'New Request' : 'Modification'}`}
//                   </button>
//               </form>
//            </div>

//            {/* PREVIEW SIDE */}
//            {isPreviewOn && (
//                <div className="w-full lg:w-2/3 bg-white rounded-xl shadow-inner overflow-y-auto p-8 border border-slate-200">
//                    <div className="max-w-4xl mx-auto bg-white p-8 text-black border border-black min-h-[1000px] text-xs font-sans">
                        
//                         {/* 1. HEADER CHANGES BASED ON TAB */}
//                         {activeTab === 'new' ? (
//                             <h1 className="text-xl font-bold uppercase underline mb-6">Request for NEW Subcontract:</h1>
//                         ) : (
//                             <h1 className="text-xl font-bold uppercase underline mb-6">Request for Subcontract MODIFICATION Form:</h1>
//                         )}

//                         {/* WARNING BOX */}
//                         <div className="border border-black p-2 mb-4 bg-yellow-50/50">
//                             <p className="font-bold mb-2">NOTES:</p>
//                             <p className="mb-2">ALL FIELDS MUST BE COMPLETED ON THIS FORM BEFORE RETURNING TO CONTRACTS.</p>
//                             <p className="font-bold">REMINDER: SUBCONTRACTS CANNOT BE AWARDED OUTSIDE OF PRIME CONTRACT PERIOD OF PERFORMANCE.</p>
//                         </div>

//                         {/* 2. PROGRAM DETAILS */}
//                         <div className="grid grid-cols-[200px_1fr] border-b border-black pb-1 mb-2">
//                             <span className="font-bold">Program Manager:</span>
//                             <span>{actionForm.programManager}</span>
//                         </div>
                        
//                         {activeTab === 'mod' && (
//                             <div className="grid grid-cols-[200px_1fr] border-b border-black pb-1 mb-2">
//                                 <span className="font-bold">Infotrend Subcontract # issued:</span>
//                                 <span>{actionForm.subcontractNumber}</span>
//                             </div>
//                         )}

//                         <div className="grid grid-cols-[200px_1fr] border-b border-black pb-1 mb-6">
//                             <span className="font-bold">Project Name / Code:</span>
//                             <span>{actionForm.projectName}</span>
//                         </div>

//                         {/* 3. CONDITIONAL BODY */}
//                         {activeTab === 'new' ? (
//                             // NEW SUBK BODY
//                             <>
//                                 <h3 className="font-bold underline mb-2">Company Information:</h3>
//                                 <div className="space-y-1 mb-6 pl-4">
//                                      <div className="grid grid-cols-[150px_1fr]"><span className="font-bold">Company Name:</span><span>{actionForm.companyName}</span></div>
//                                      <div className="grid grid-cols-[150px_1fr]"><span className="font-bold">Company Address:</span><span>{actionForm.companyAddress}</span></div>
//                                      <div className="grid grid-cols-[150px_1fr]"><span className="font-bold">Company POC:</span><span>{actionForm.companyPoc}</span></div>
//                                      <div className="grid grid-cols-[150px_1fr]"><span className="font-bold">POC Phone #:</span><span>{actionForm.pocPhone}</span></div>
//                                      <div className="grid grid-cols-[150px_1fr]"><span className="font-bold">POC Email:</span><span>{actionForm.pocEmail}</span></div>
//                                 </div>
//                                 <div className="mb-6 space-y-2">
//                                      <div className="flex gap-2"><span className="font-bold">Type:</span><span className="border-b border-black px-4">{actionForm.agreementType}</span></div>
//                                      <div className="font-bold mt-2">Period of Performance:</div>
//                                      <div className="flex gap-8 pl-4">
//                                         <div><span className="font-bold mr-2">Start:</span>{actionForm.popStart}</div>
//                                         <div><span className="font-bold mr-2">End:</span>{actionForm.popEnd}</div>
//                                      </div>
//                                      <div className="flex gap-2 mt-2"><span className="font-bold">Funding Authorized:</span><span className="font-mono font-bold">${actionForm.fundingAuthAmount}</span></div>
//                                 </div>
//                             </>
//                         ) : (
//                             // MODIFICATION BODY
//                             <>
//                                 <div className="mb-6">
//                                     <div className="font-bold mb-1">What are you requesting to change?</div>
//                                     <div className="border border-black p-2 min-h-[60px] whitespace-pre-wrap">{actionForm.modDescription}</div>
//                                 </div>
//                                 <div className="mb-2 font-bold underline">Ceiling and Funding Changes:</div>
//                             </>
//                         )}

//                         {/* 4. LABOR TABLE (SHARED) */}
//                         <table className="w-full border-collapse border border-black mb-6 text-[10px]">
//                             <thead className="bg-slate-100 font-bold text-center">
//                                 <tr>
//                                     <td className="border border-black p-1">Person's Name</td>
//                                     <td className="border border-black p-1">Labor Category</td>
//                                     <td className="border border-black p-1">Rate</td>
//                                     <td className="border border-black p-1">Hrs</td>
//                                     <td className="border border-black p-1">Total</td>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {actionForm.laborItems.map((item, i) => (
//                                     <tr key={i} className="text-center">
//                                         <td className="border border-black p-1">{item.name}</td>
//                                         <td className="border border-black p-1">{item.category}</td>
//                                         <td className="border border-black p-1">{item.rate}</td>
//                                         <td className="border border-black p-1">{item.hours}</td>
//                                         <td className="border border-black p-1 font-bold">{item.total ? `$${item.total}` : ''}</td>
//                                     </tr>
//                                 ))}
//                                 <tr className="bg-slate-50 font-bold">
//                                     <td colSpan="4" className="border border-black p-1 text-right">Total Labor:</td>
//                                     <td className="border border-black p-1">${totalLabor.toFixed(2)}</td>
//                                 </tr>
//                             </tbody>
//                         </table>

//                         {/* 5. SCOPE & TOTALS */}
//                         {activeTab === 'mod' && (
//                             <div className="mb-6">
//                                 <div className="font-bold mb-1">Changes to Scope of Work (if applicable):</div>
//                                 <div className="border border-black p-2 min-h-[60px] whitespace-pre-wrap">{actionForm.scopeChanges}</div>
//                             </div>
//                         )}

//                         <h3 className="font-bold mb-2">COST SUMMARY:</h3>
//                         <div className="w-1/2 ml-auto">
//                             <div className="flex justify-between border-b border-black p-1"><span>Labor:</span><span>${totalLabor.toFixed(2)}</span></div>
//                             <div className="flex justify-between border-b border-black p-1"><span>Travel:</span><span>${parseFloat(actionForm.totalTravel || 0).toFixed(2)}</span></div>
//                             <div className="flex justify-between border-b border-black p-1"><span>ODC:</span><span>${parseFloat(actionForm.totalOdc || 0).toFixed(2)}</span></div>
//                             <div className="flex justify-between border-t-2 border-black p-1 font-black text-sm mt-1"><span>TOTAL:</span><span>${grandTotal.toFixed(2)}</span></div>
//                         </div>

//                         {/* 6. FOOTER */}
//                         <div className="mt-8 border p-4 text-[10px]">
//                             <h3 className="font-bold underline mb-2">Required Documents:</h3>
//                             <ul className="list-disc pl-5 space-y-1">
//                                 <li>Statement of Work</li>
//                                 <li>Documentation of Rate Agreement</li>
//                                 <li>Labor Categories</li>
//                             </ul>
//                             <div className="mt-4 italic">Process Note: Email this form to jvarnese@Infotrend.com</div>
//                         </div>
//                    </div>
//                </div>
//            )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default SubcontractorAssignments;


// Deployed Code Above 


// import React, { useState } from 'react';
import React, { useState, useEffect } from 'react';
import { Layout, Plus, Save, LogOut, Eye, EyeOff, Trash2, Briefcase, FileText, UserCheck, List, Edit } from 'lucide-react';


const SubcontractorAssignments = ({ 
//   dataEntries = [], userName, handleLogout, 
//   currentUserId, onDataChanged
    userName,
handleLogout,
currentUserId
}) => {
  const [activeTab, setActiveTab] = useState('list'); // 'list', 'new', 'mod'
  const [isPreviewOn, setIsPreviewOn] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [entries, setEntries] = useState([]);

  // --- FORM STATE (SHARED) ---
  const [actionForm, setActionForm] = useState({
    // Shared
    programManager: '', projectName: '',
    // New Subk Specific
    companyName: '', companyAddress: '', companyPoc: '', pocPhone: '', pocEmail: '',
    agreementType: 'FFP', popStart: '', popEnd: '',
    hasOptionPeriods: 'No', optionPeriodsThrough: '', fundingAuthAmount: '',
    // Mod Specific
    subcontractNumber: '', modDescription: '', scopeChanges: '',
    // Shared Labor
    laborItems: [{ name: '', category: '', start: '', end: '', rate: '', hours: '', total: '' }],
    totalTravel: 0, totalOdc: 0
  });

  // --- HANDLERS ---
  const handleActionChange = (e) => {
    const { id, value } = e.target;
    setActionForm(prev => ({ ...prev, [id]: value }));
  };

  const handleLaborChange = (index, field, value) => {
    const newItems = [...actionForm.laborItems];
    newItems[index][field] = value;
    // Auto-calc row total
    if (field === 'rate' || field === 'hours') {
        const r = parseFloat(field === 'rate' ? value : newItems[index].rate) || 0;
        const h = parseFloat(field === 'hours' ? value : newItems[index].hours) || 0;
        newItems[index].total = (r * h).toFixed(2);
    }
    setActionForm(prev => ({ ...prev, laborItems: newItems }));
  };

  const addLaborRow = () => setActionForm(prev => ({ ...prev, laborItems: [...prev.laborItems, { name: '', category: '', start: '', end: '', rate: '', hours: '', total: '' }] }));
  
  const removeLaborRow = (index) => {
    if (actionForm.laborItems.length > 1) {
      setActionForm(prev => ({ ...prev, laborItems: prev.laborItems.filter((_, i) => i !== index) }));
    }
  };

  // --- CALCULATIONS ---
  const totalLabor = actionForm.laborItems.reduce((sum, item) => sum + parseFloat(item.total || 0), 0);
  const grandTotal = totalLabor + parseFloat(actionForm.totalTravel || 0) + parseFloat(actionForm.totalOdc || 0);

  // --- SAVE ---
  const handleSaveAction = async (e) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);

    // Determine Type based on Tab
    const requestType = activeTab === 'new' ? 'New' : 'Modification';

    const payload = { 
        ...actionForm, 
        requestType, 
        totalLabor, 
        userId: currentUserId 
    };
    
    // const API_BASE = import.meta.env.VITE_API_BASE_URL;

    // useEffect(() => {
    // loadData();
    // }, []);

    // const loadData = async () => {
    // try{
    //     const res = await fetch(`${API_BASE}/subcontractor-actions`);

    //     if(!res.ok)
    //     throw new Error("Failed to fetch");

    //     const data = await res.json();

    //     console.log("Loaded:",data);

    //     setEntries(data);

    // }catch(err){
    //     console.error(err);
    // }
    // };
        

        const API_BASE = import.meta.env.VITE_API_BASE_URL;

        const loadData = async () => {

        try{

        const res = await fetch(`${API_BASE}/subcontractor-actions`);

        if(!res.ok)
        throw new Error("Failed to fetch");

        const data = await res.json();

        console.log("Loaded:",data);

        setEntries(data);

        }catch(err){

        console.error(err);

        }   

        }; 
        useEffect(()=>{

        loadData();

        },[]);

    try {
      const response = await fetch(`${API_BASE}/subcontractor-actions/new`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`${requestType} Request Saved!\nReference ID: ${data.prime_key}`);
        // window.location.reload();
        loadData();
        setIsSaving(false);
        setActiveTab('list');
      } else {
        throw new Error('Failed to save request');
      }
    } catch (err) {
      alert("Error: " + err.message);
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 font-sans text-slate-800">
      
      {/* HEADER & TABS */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 bg-white p-3 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-4 w-full md:w-auto">
           <h1 className="text-lg font-black tracking-tight text-blue-900 hidden md:block ">SubK Management</h1>
           <div className="flex bg-slate-100 p-1 rounded-lg w-full md:w-auto">
              <button onClick={() => setActiveTab('list')} className={`flex-2 px-4 py-2 rounded-md text-xs font-bold  tracking-wider flex items-center gap-2 ${activeTab === 'list' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-400'}`}>
                <List size={14}/> List
              </button>
              <button onClick={() => setActiveTab('new')} className={`flex-2 px-4 py-2 rounded-md text-xs font-bold tracking-wider flex items-center gap-2 ${activeTab === 'new' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-400'}`}>
                <UserCheck size={14}/> New SubK
              </button>
              <button onClick={() => setActiveTab('mod')} className={`flex-2 px-4 py-2 rounded-md text-xs font-bold  tracking-wider flex items-center gap-2 ${activeTab === 'mod' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-400'}`}>
                <Edit size={14}/> Mod Form
              </button>
           </div>
        </div>
        <div className="flex items-center gap-2">
            {(activeTab === 'new' || activeTab === 'mod') && (
                <button onClick={() => setIsPreviewOn(!isPreviewOn)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold ${isPreviewOn ? 'bg-yellow-600 text-white' : 'bg-slate-200'}`}>
                    {isPreviewOn ? <EyeOff size={14}/> : <Eye size={14}/>} {isPreviewOn ? 'HIDE PREVIEW' : 'SHOW PREVIEW'}
                </button>
            )}
            <button onClick={handleLogout} className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100"><LogOut size={20}/></button>
        </div>
      </div>

      {/* --- TAB 1: ASSIGNMENTS LIST --- */}
      {activeTab === 'list' && (
        <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-blue-600">
           <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-700">Subcontractor Requests & Assignments</h2>
              {/* <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">{dataEntries.length} Records</span> */}
              <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">{entries.length} Records</span>
           </div>
           <div className="overflow-x-auto border rounded-lg">
             <table className="min-w-full divide-y text-sm">
               <thead className="bg-slate-50 uppercase font-bold text-slate-500 text-xs">
                 <tr>
                   <th className="px-6 py-3 text-left">Ref Key</th>
                   <th className="px-6 py-3 text-left">Project</th>
                   <th className="px-6 py-3 text-left">Type</th>
                   <th className="px-6 py-3 text-left">Amount</th>
                   <th className="px-6 py-3 text-left">Status</th>
                 </tr>
               </thead>
               <tbody className="bg-white divide-y">
                 {/* {dataEntries.map(entry => ( */}
                 {entries.map(entry => (
                   <tr key={entry.id || entry.prime_key} className="hover:bg-blue-50 transition-colors">
                     <td className="px-6 py-3 font-bold text-blue-600">{entry.prime_key || entry.id}</td>
                     <td className="px-6 py-3 font-medium">{entry.project_name || entry.projectName}</td>
                     <td className="px-6 py-3 text-slate-600">{entry.request_type || 'Assignment'}</td>
                     <td className="px-6 py-3 font-mono font-bold text-green-700">${parseFloat(entry.grand_total || entry.charge_amount || 0).toFixed(2)}</td>
                     <td className="px-6 py-3"><span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide">{entry.status}</span></td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>
      )}

      {/* --- FORMS CONTAINER --- */}
      {(activeTab === 'new' || activeTab === 'mod') && (
        <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-140px)]">
           
           {/* DATA ENTRY SIDE */}
           <div className={`${isPreviewOn ? 'lg:w-1/3' : 'lg:w-full max-w-5xl mx-auto'} bg-white rounded-xl shadow-lg overflow-y-auto p-6 border-t-4 border-blue-600 transition-all duration-300`}>
              <form onSubmit={handleSaveAction} className="space-y-4">
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b">
                      {activeTab === 'new' ? <UserCheck className="text-blue-600" size={18} /> : <Edit className="text-blue-600" size={18} />}
                      <h2 className="font-black text-slate-700  tracking-wide text-sm">{activeTab === 'new' ? 'New Subcontract' : 'Modification'} Request</h2>
                  </div>
                  
                  <input id="programManager" placeholder="Program Manager" className="w-full p-2 border rounded text-sm bg-slate-50" value={actionForm.programManager} onChange={handleActionChange}/>
                  <input id="projectName" placeholder="Project Name / Code" className="w-full p-2 border rounded text-sm bg-slate-50" value={actionForm.projectName} onChange={handleActionChange}/>

                  {/* TAB SPECIFIC FIELDS */}
                  {activeTab === 'new' ? (
                      <div className="space-y-3 pt-2 border-t">
                          <input id="companyName" placeholder="Company Name" className="w-full p-2 border rounded text-sm" value={actionForm.companyName} onChange={handleActionChange}/>
                          <textarea id="companyAddress" placeholder="Company Address" className="w-full p-2 border rounded text-sm h-12" value={actionForm.companyAddress} onChange={handleActionChange}/>
                          <div className="grid grid-cols-2 gap-2">
                             <input id="companyPoc" placeholder="POC Name" className="p-2 border rounded text-sm" value={actionForm.companyPoc} onChange={handleActionChange}/>
                             <input id="pocPhone" placeholder="POC Phone" className="p-2 border rounded text-sm" value={actionForm.pocPhone} onChange={handleActionChange}/>
                          </div>
                          <input id="pocEmail" placeholder="POC Email" className="w-full p-2 border rounded text-sm" value={actionForm.pocEmail} onChange={handleActionChange}/>
                          
                          <select id="agreementType" className="w-full p-2 border rounded text-sm" value={actionForm.agreementType} onChange={handleActionChange}>
                              <option value="FFP">FFP - Firm Fixed Price</option>
                              <option value="LH">LH - Labor Hour</option>
                              <option value="T&M">T&M - Time & Materials</option>
                          </select>
                          <div className="grid grid-cols-2 gap-2">
                              <input id="popStart" type="date" className="p-2 border rounded text-sm" value={actionForm.popStart} onChange={handleActionChange}/>
                              <input id="popEnd" type="date" className="p-2 border rounded text-sm" value={actionForm.popEnd} onChange={handleActionChange}/>
                          </div>
                          <input id="fundingAuthAmount" type="number" placeholder="Authorized Funding $" className="w-full p-2 border rounded text-sm" value={actionForm.fundingAuthAmount} onChange={handleActionChange}/>
                      </div>
                  ) : (
                      <div className="space-y-3 pt-2 border-t">
                          <input id="subcontractNumber" placeholder="Infotrend Subcontract #" className="w-full p-2 border rounded text-sm font-bold text-blue-900" value={actionForm.subcontractNumber} onChange={handleActionChange}/>
                          <textarea id="modDescription" placeholder="What are you requesting to change?" className="w-full p-2 border rounded text-sm h-20" value={actionForm.modDescription} onChange={handleActionChange}/>
                          <textarea id="scopeChanges" placeholder="Changes to Scope of Work (if applicable)" className="w-full p-2 border rounded text-sm h-20" value={actionForm.scopeChanges} onChange={handleActionChange}/>
                      </div>
                  )}

                  {/* LABOR BREAKOUT (SHARED) */}
                  <div className="pt-4 border-t space-y-3">
                      <div className="flex justify-between items-center">
                          <label className="text-[10px] font-black text-slate-400  tracking-widest">Labor Breakout</label>
                          <button type="button" onClick={addLaborRow} className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded font-bold flex gap-1"><Plus size={12}/> Add</button>
                      </div>
                      {actionForm.laborItems.map((item, idx) => (
                          <div key={idx} className="bg-slate-50 p-2 rounded border relative">
                              <div className="grid grid-cols-2 gap-2 mb-2">
                                  <input placeholder="Name" className="p-1 border rounded text-xs" value={item.name} onChange={(e) => handleLaborChange(idx, 'name', e.target.value)}/>
                                  <input placeholder="Category" className="p-1 border rounded text-xs" value={item.category} onChange={(e) => handleLaborChange(idx, 'category', e.target.value)}/>
                              </div>
                              <div className="grid grid-cols-3 gap-2 mb-2">
                                  <input type="number" placeholder="Rate" className="p-1 border rounded text-xs" value={item.rate} onChange={(e) => handleLaborChange(idx, 'rate', e.target.value)}/>
                                  <input type="number" placeholder="Hrs" className="p-1 border rounded text-xs" value={item.hours} onChange={(e) => handleLaborChange(idx, 'hours', e.target.value)}/>
                                  <input disabled placeholder="Total" className="p-1 border rounded text-xs bg-slate-100" value={item.total} />
                              </div>
                              {actionForm.laborItems.length > 1 && <button type="button" onClick={() => removeLaborRow(idx)} className="absolute -top-1 -right-1 bg-red-100 text-red-500 p-1 rounded-full"><Trash2 size={10}/></button>}
                          </div>
                      ))}
                  </div>

                  {/* TOTALS */}
                  <div className="pt-4 border-t grid grid-cols-2 gap-3">
                      <input id="totalTravel" type="number" placeholder="Travel Cost" className="p-2 border rounded text-sm" value={actionForm.totalTravel} onChange={handleActionChange}/>
                      <input id="totalOdc" type="number" placeholder="ODC Cost" className="p-2 border rounded text-sm" value={actionForm.totalOdc} onChange={handleActionChange}/>
                  </div>

                  <button disabled={isSaving} className={`w-full text-white font-black py-3 rounded-lg shadow tracking-tighter text-sm mt-4 ${isSaving ? 'bg-slate-400' : 'bg-green-600 hover:bg-green-700'}`}>
                      {isSaving ? 'Saving...' : `Save ${activeTab === 'new' ? 'New Request' : 'Modification'}`}
                  </button>
              </form>
           </div>

           {/* PREVIEW SIDE */}
           {isPreviewOn && (
               <div className="w-full lg:w-2/3 bg-white rounded-xl shadow-inner overflow-y-auto p-8 border border-slate-200">
                   <div className="max-w-4xl mx-auto bg-white p-8 text-black border border-black min-h-[1000px] text-xs font-sans">
                        
                        {/* 1. HEADER CHANGES BASED ON TAB */}
                        {activeTab === 'new' ? (
                            <h1 className="text-xl font-bold uppercase underline mb-6">Request for NEW Subcontract:</h1>
                        ) : (
                            <h1 className="text-xl font-bold uppercase underline mb-6">Request for Subcontract MODIFICATION Form:</h1>
                        )}

                        {/* WARNING BOX */}
                        <div className="border border-black p-2 mb-4 bg-yellow-50/50">
                            <p className="font-bold mb-2">NOTES:</p>
                            <p className="mb-2">ALL FIELDS MUST BE COMPLETED ON THIS FORM BEFORE RETURNING TO CONTRACTS.</p>
                            <p className="font-bold">REMINDER: SUBCONTRACTS CANNOT BE AWARDED OUTSIDE OF PRIME CONTRACT PERIOD OF PERFORMANCE.</p>
                        </div>

                        {/* 2. PROGRAM DETAILS */}
                        <div className="grid grid-cols-[200px_1fr] border-b border-black pb-1 mb-2">
                            <span className="font-bold">Program Manager:</span>
                            <span>{actionForm.programManager}</span>
                        </div>
                        
                        {activeTab === 'mod' && (
                            <div className="grid grid-cols-[200px_1fr] border-b border-black pb-1 mb-2">
                                <span className="font-bold">Infotrend Subcontract # issued:</span>
                                <span>{actionForm.subcontractNumber}</span>
                            </div>
                        )}

                        <div className="grid grid-cols-[200px_1fr] border-b border-black pb-1 mb-6">
                            <span className="font-bold">Project Name / Code:</span>
                            <span>{actionForm.projectName}</span>
                        </div>

                        {/* 3. CONDITIONAL BODY */}
                        {activeTab === 'new' ? (
                            // NEW SUBK BODY
                            <>
                                <h3 className="font-bold underline mb-2">Company Information:</h3>
                                <div className="space-y-1 mb-6 pl-4">
                                     <div className="grid grid-cols-[150px_1fr]"><span className="font-bold">Company Name:</span><span>{actionForm.companyName}</span></div>
                                     <div className="grid grid-cols-[150px_1fr]"><span className="font-bold">Company Address:</span><span>{actionForm.companyAddress}</span></div>
                                     <div className="grid grid-cols-[150px_1fr]"><span className="font-bold">Company POC:</span><span>{actionForm.companyPoc}</span></div>
                                     <div className="grid grid-cols-[150px_1fr]"><span className="font-bold">POC Phone #:</span><span>{actionForm.pocPhone}</span></div>
                                     <div className="grid grid-cols-[150px_1fr]"><span className="font-bold">POC Email:</span><span>{actionForm.pocEmail}</span></div>
                                </div>
                                <div className="mb-6 space-y-2">
                                     <div className="flex gap-2"><span className="font-bold">Type:</span><span className="border-b border-black px-4">{actionForm.agreementType}</span></div>
                                     <div className="font-bold mt-2">Period of Performance:</div>
                                     <div className="flex gap-8 pl-4">
                                        <div><span className="font-bold mr-2">Start:</span>{actionForm.popStart}</div>
                                        <div><span className="font-bold mr-2">End:</span>{actionForm.popEnd}</div>
                                     </div>
                                     <div className="flex gap-2 mt-2"><span className="font-bold">Funding Authorized:</span><span className="font-mono font-bold">${actionForm.fundingAuthAmount}</span></div>
                                </div>
                            </>
                        ) : (
                            // MODIFICATION BODY
                            <>
                                <div className="mb-6">
                                    <div className="font-bold mb-1">What are you requesting to change?</div>
                                    <div className="border border-black p-2 min-h-[60px] whitespace-pre-wrap">{actionForm.modDescription}</div>
                                </div>
                                <div className="mb-2 font-bold underline">Ceiling and Funding Changes:</div>
                            </>
                        )}

                        {/* 4. LABOR TABLE (SHARED) */}
                        <table className="w-full border-collapse border border-black mb-6 text-[10px]">
                            <thead className="bg-slate-100 font-bold text-center">
                                <tr>
                                    <td className="border border-black p-1">Person's Name</td>
                                    <td className="border border-black p-1">Labor Category</td>
                                    <td className="border border-black p-1">Rate</td>
                                    <td className="border border-black p-1">Hrs</td>
                                    <td className="border border-black p-1">Total</td>
                                </tr>
                            </thead>
                            <tbody>
                                {actionForm.laborItems.map((item, i) => (
                                    <tr key={i} className="text-center">
                                        <td className="border border-black p-1">{item.name}</td>
                                        <td className="border border-black p-1">{item.category}</td>
                                        <td className="border border-black p-1">{item.rate}</td>
                                        <td className="border border-black p-1">{item.hours}</td>
                                        <td className="border border-black p-1 font-bold">{item.total ? `$${item.total}` : ''}</td>
                                    </tr>
                                ))}
                                <tr className="bg-slate-50 font-bold">
                                    <td colSpan="4" className="border border-black p-1 text-right">Total Labor:</td>
                                    <td className="border border-black p-1">${totalLabor.toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>

                        {/* 5. SCOPE & TOTALS */}
                        {activeTab === 'mod' && (
                            <div className="mb-6">
                                <div className="font-bold mb-1">Changes to Scope of Work (if applicable):</div>
                                <div className="border border-black p-2 min-h-[60px] whitespace-pre-wrap">{actionForm.scopeChanges}</div>
                            </div>
                        )}

                        <h3 className="font-bold mb-2">COST SUMMARY:</h3>
                        <div className="w-1/2 ml-auto">
                            <div className="flex justify-between border-b border-black p-1"><span>Labor:</span><span>${totalLabor.toFixed(2)}</span></div>
                            <div className="flex justify-between border-b border-black p-1"><span>Travel:</span><span>${parseFloat(actionForm.totalTravel || 0).toFixed(2)}</span></div>
                            <div className="flex justify-between border-b border-black p-1"><span>ODC:</span><span>${parseFloat(actionForm.totalOdc || 0).toFixed(2)}</span></div>
                            <div className="flex justify-between border-t-2 border-black p-1 font-black text-sm mt-1"><span>TOTAL:</span><span>${grandTotal.toFixed(2)}</span></div>
                        </div>

                        {/* 6. FOOTER */}
                        <div className="mt-8 border p-4 text-[10px]">
                            <h3 className="font-bold underline mb-2">Required Documents:</h3>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Statement of Work</li>
                                <li>Documentation of Rate Agreement</li>
                                <li>Labor Categories</li>
                            </ul>
                            <div className="mt-4 italic">Process Note: Email this form to jvarnese@Infotrend.com</div>
                        </div>
                   </div>
               </div>
           )}
        </div>
      )}
    </div>
  );
};

export default SubcontractorAssignments;



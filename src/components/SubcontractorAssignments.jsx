
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


import React, { useState, useMemo, useEffect } from 'react';
import { Layout, Plus, Pencil, Save, LogOut } from 'lucide-react';

const SubcontractorAssignments = ({ 
  dataEntries, userName, userAvatar, handleLogout, 
  currentUserRole, currentUserId, onDataChanged, contractOptions = [] 
}) => {
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [isAdding, setIsAdding] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  const [formData, setFormData] = useState({
    contractShortName: '', projectName: '', subkName: '', laborCategory: '',
    chargeAmount: '', chargeDate: '', status: 'Submitted', notes: ''
  });

  const resetForm = () => {
    setFormData({
      contractShortName: '', projectName: '', subkName: '', laborCategory: '',
      chargeAmount: '', chargeDate: '', status: 'Submitted', notes: ''
    });
    setIsAdding(false);
    setEditingEntry(null);
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    const url = editingEntry 
      ? `${import.meta.env.VITE_API_BASE_URL}/subk-travel/${editingEntry.id}`
      : `${import.meta.env.VITE_API_BASE_URL}/subk-travel/new`;

    try {
      await fetch(url, {
        method: editingEntry ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, category: 'Subk', userId: currentUserId }),
      });
      if (onDataChanged) onDataChanged();
      resetForm();
    } catch (err) { alert("Save error"); }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="bg-white p-6 rounded-xl shadow-2xl">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h1 className="text-2xl font-black text-blue-900 uppercase flex items-center gap-2">
             SubK Assignments
          </h1>
          <button onClick={handleLogout} className="p-2 bg-red-100 text-red-600 rounded-full"><LogOut/></button>
        </div>

        {/* Form and Table logic filtered for Category === 'Subk' */}
        <button onClick={() => setIsAdding(true)} className="bg-blue-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold mb-6">
          <Plus size={20}/> ADD ASSIGNMENT
        </button>

        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full divide-y text-sm">
            <thead className="bg-gray-50 uppercase font-bold text-gray-600">
              <tr>
                <th className="px-6 py-3 text-left">Project</th>
                <th className="px-6 py-3 text-left">Subk Name</th>
                <th className="px-6 py-3 text-left">Amount</th>
                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y">
              {dataEntries.map(entry => (
                <tr key={entry.id} className="hover:bg-blue-50">
                  <td className="px-6 py-3">{entry.project_name || entry.projectName}</td>
                  <td className="px-6 py-3 font-bold">{entry.subk_name || entry.subkName}</td>
                  <td className="px-6 py-3">${parseFloat(entry.charge_amount || entry.chargeAmount || 0).toFixed(2)}</td>
                  <td className="px-6 py-3">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-bold">{entry.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SubcontractorAssignments;
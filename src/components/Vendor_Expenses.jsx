
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


import React, { useState, useMemo, useEffect } from 'react';
import { ChevronDown, ChevronRight, Plus, Pencil, Download, Search, LogOut, X, Save, Send, CheckCircle, XCircle } from 'lucide-react';

const formatDateForDisplay = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return 'Invalid Date';
  return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'UTC' });
};

const Vendor_Expenses = ({ 
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
  const [isNotifying, setIsNotifying] = useState(false);
  const [localEntries, setLocalEntries] = useState([]);

  useEffect(() => {
    setLocalEntries(dataEntries || []);
  }, [dataEntries]);

  const [isAdding, setIsAdding] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  
  // ALL FIELDS RESTORED
  const [formData, setFormData] = useState({
    vendorId: '', 
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

  const pmEmailOptions = ['Manas.Lalwani@revolvespl.com'];
  const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/vendor-expenses`;
  const LOGIN_URL = "https://rev-lum-em-tst.vercel.app";

  const searchableColumns = [
    { key: 'all', name: 'All Fields' },
    { key: 'vendorId', name: 'Vendor ID' },
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
      vendorId: '', contractShortName: '', vendorName: '', chargeDate: '',
      chargeAmount: '', submittedDate: '', pmEmail: '', chargeCode: '',
      isApproved: false, notes: '', pdfFilePath: ''
    });
    setIsAdding(false);
    setEditingEntry(null);
  };

  const notifyBatchPM = async () => {
    if (selectedRows.size === 0) return;
    setIsNotifying(true);
    const selectedEntries = localEntries.filter(entry => selectedRows.has(entry.id));
    const pmGroups = selectedEntries.reduce((acc, entry) => {
      if (!acc[entry.pmEmail]) acc[entry.pmEmail] = [];
      acc[entry.pmEmail].push(entry);
      return acc;
    }, {});

    try {
      for (const [pmEmail, entries] of Object.entries(pmGroups)) {
        const approvedRecords = entries.filter(e => e.isApproved).map(e => e.primeKey);
        const rejectedRecords = entries.filter(e => !e.isApproved).map(e => `${e.primeKey} (Reason: ${e.notes || 'None'})`);

        let body = `Hello,\n\nYou have multiple Vendor Expense records awaiting action.\n\n`;
        if (approvedRecords.length > 0) body += `RECORDS TO REVIEW/APPROVE: ${approvedRecords.join(', ')}\n`;
        if (rejectedRecords.length > 0) body += `REJECTED RECORDS: ${rejectedRecords.join(', ')}\n`;
        body += `\nPlease login here to process them: ${LOGIN_URL}`;

        await fetch(`${import.meta.env.VITE_API_BASE_URL}/send-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ recipient: pmEmail, subject: `Action Required: Multiple Records (${entries.length})`, bodyContent: body }),
        });
      }
      alert("Notifications sent.");
      setSelectedRows(new Set());
    } catch (err) { alert("Error sending mail."); }
    finally { setIsNotifying(false); }
  };

  const handleSave = async (e, shouldNotify = false) => {
    if (e) e.preventDefault();
    if (!formData.isApproved && !formData.notes) {
      alert("Reason for rejection is required.");
      return;
    }

    const method = editingEntry ? 'PATCH' : 'POST';
    // FIX: URL pathing for update
    const url = editingEntry ? `${API_BASE_URL}/${editingEntry.id}` : `${API_BASE_URL}/new`;
    
    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userId: currentUserId, submitter: userName }),
      });
      
      const savedData = await response.json();
      if (onDataChanged) onDataChanged();
      
      if (shouldNotify) {
        const body = formData.isApproved 
          ? `A record requires review: ${savedData.prime_key || 'New'}\nLogin here: ${LOGIN_URL}`
          : `Record ${savedData.prime_key || 'New'} was REJECTED: ${formData.notes}\nLogin here: ${LOGIN_URL}`;
        
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/send-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ recipient: formData.pmEmail, subject: `Vendor Expense Notification`, bodyContent: body }),
        });
      }
      resetForm();
    } catch (err) { alert("Update failed."); }
  };

  const startEdit = () => {
    const entryId = Array.from(selectedRows)[0];
    const entry = localEntries.find(e => e.id === entryId);
    if (entry) {
      setEditingEntry(entry);
      setFormData({
        vendorId: entry.vendorId || '',
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
            <input type="checkbox" checked={selectedRows.has(entry.id)} onChange={() => {
                const next = new Set(selectedRows);
                next.has(entry.id) ? next.delete(entry.id) : next.add(entry.id);
                setSelectedRows(next);
            }} className="h-4 w-4" />
        </td>
        <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{entry.primeKey}</td>
        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">{entry.vendorId}</td>
        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">{entry.contractShortName}</td>
        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">{entry.vendorName}</td>
        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">{formatDateForDisplay(entry.chargeDate)}</td>
        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">${parseFloat(entry.chargeAmount || 0).toFixed(2)}</td>
        <td className="px-6 py-3 whitespace-nowrap text-sm text-blue-600">
            {entry.pdfFilePath ? <a href={entry.pdfFilePath} target="_blank" rel="noreferrer">View PDF</a> : 'N/A'}
        </td>
        <td className="px-6 py-3 whitespace-nowrap text-sm">
            {entry.isApproved ? <span className="text-green-600 font-bold">Approved</span> : <span className="text-red-600 font-bold">Rejected</span>}
        </td>
        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">{entry.apvNumber || 'N/A'}</td>
        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">{entry.pmEmail}</td>
    </React.Fragment>
  );

  return (
    <div className="min-h-screen bg-gray-900 p-6">
        <div className="bg-white p-6 rounded-xl shadow-2xl w-full text-gray-800">
            <h1 className="text-3xl font-extrabold text-lime-800 mb-6">Vendor Expenses</h1>

            {(isAdding || editingEntry) && (
              <div className="mb-8 p-6 border-2 border-blue-200 rounded-xl bg-blue-50">
                <form onSubmit={(e) => handleSave(e, false)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* RESTORED ALL FORM FIELDS */}
                  <div>
                    <label className="block text-xs font-bold mb-1">VENDOR ID *</label>
                    <select id="vendorId" className="w-full p-2 border rounded" value={formData.vendorId} onChange={handleInputChange} required>
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
                    <label className="block text-xs font-bold mb-1 text-blue-700">NOTIFY PM *</label>
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
                  <div className="lg:col-span-2">
                    <label className="block text-xs font-bold mb-1">REASON / NOTES</label>
                    <textarea id="notes" rows="1" className={`w-full p-2 border rounded ${!formData.isApproved ? 'border-red-400 bg-red-50' : ''}`} value={formData.notes} onChange={handleInputChange} required={!formData.isApproved} />
                  </div>

                  {/* VISUAL ACTION BOXES */}
                  <div className="lg:col-span-4 flex gap-4">
                    <button type="button" onClick={() => setFormData(prev => ({ ...prev, isApproved: true }))} className={`flex-1 p-4 rounded-xl border-2 transition-all ${formData.isApproved ? 'bg-green-100 border-green-500 font-bold' : 'bg-white border-gray-200 opacity-60'}`}>APPROVE</button>
                    <button type="button" onClick={() => setFormData(prev => ({ ...prev, isApproved: false }))} className={`flex-1 p-4 rounded-xl border-2 transition-all ${!formData.isApproved ? 'bg-red-100 border-red-500 font-bold' : 'bg-white border-gray-200 opacity-60'}`}>REJECT</button>
                  </div>

                  <div className="lg:col-span-4 flex justify-end gap-3">
                    <button type="submit" className="bg-blue-600 text-white px-8 py-2 rounded-lg flex items-center gap-2"><Save size={18}/> {editingEntry ? 'Update' : 'Save'}</button>
                    <button type="button" onClick={(e) => handleSave(e, true)} className="bg-purple-600 text-white px-8 py-2 rounded-lg flex items-center gap-2"><Send size={18}/> Save and Notify</button>
                  </div>
                </form>
              </div>
            )}

            <div className="flex gap-3 mb-6">
                {!isAdding && !editingEntry && <button onClick={() => setIsAdding(true)} className="bg-yellow-500 text-white px-5 py-2.5 rounded-lg flex items-center gap-2"><Plus size={20}/> Add</button>}
                <button onClick={notifyBatchPM} disabled={selectedRows.size === 0 || isNotifying} className="bg-purple-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 disabled:opacity-50"><Send size={20}/> {isNotifying ? 'Sending Batch...' : 'Notify Selection'}</button>
                <button onClick={startEdit} disabled={selectedRows.size !== 1} className="bg-gray-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 disabled:opacity-50"><Pencil size={20}/> Edit</button>
            </div>
            
            <div className="overflow-x-auto rounded-lg border">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-4 w-12"></th>
                            <th className="px-6 py-3 text-left font-bold uppercase">Record No</th>
                            <th className="px-6 py-3 text-left font-bold uppercase">Vendor ID</th>
                            <th className="px-6 py-3 text-left font-bold uppercase">Contract</th>
                            <th className="px-6 py-3 text-left font-bold uppercase">Vendor</th>
                            <th className="px-6 py-3 text-left font-bold uppercase">Date</th>
                            <th className="px-6 py-3 text-left font-bold uppercase">Amount</th>
                            <th className="px-6 py-3 text-left font-bold uppercase">PDF</th>
                            <th className="px-6 py-3 text-left font-bold uppercase">Status</th>
                            <th className="px-6 py-3 text-left font-bold uppercase">APV No</th>
                            <th className="px-6 py-3 text-left font-bold uppercase">Notify PM</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y">
                        {groupedEntries.map((group) => <tr key={group[0].id} className="hover:bg-blue-50 transition-colors"><Row entry={group[0]} /></tr>)}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};

export default Vendor_Expenses;
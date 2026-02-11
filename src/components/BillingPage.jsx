// import React, { useState, useMemo, useEffect } from 'react';
// import { Plus, Pencil, Download, Search, LogOut, X, Save } from 'lucide-react';
// import * as XLSX from 'xlsx';

// const formatDateForDisplay = (isoString) => {
//   if (!isoString) return '';
//   const date = new Date(isoString);
//   if (isNaN(date.getTime())) return 'Invalid Date';
//   return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'UTC' });
// };

// const BillingPage = ({ 
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
//   const [searchValue, setSearchValue] = useState('');
//   const [selectedRows, setSelectedRows] = useState(new Set());
//   const [isExporting, setIsExporting] = useState(false);
  
//   // --- DEMO CACHE LOGIC ---
//   const [localEntries, setLocalEntries] = useState([]);

//   // Mock initial billing data for demo
//   const dummyBilling = [
//     { id: 'b1', invoiceNo: 'INV-2025-001', clientName: 'Vertex Solutions', amount: 4500.00, billingDate: '2026-01-01', dueDate: '2026-02-01', status: 'Paid', submitter: 'Admin' },
//     { id: 'b2', invoiceNo: 'INV-2025-002', clientName: 'Nexus Corp', amount: 1250.50, billingDate: '2026-01-10', dueDate: '2026-02-10', status: 'Pending', submitter: 'Admin' }
//   ];

//   useEffect(() => {
//     // Merge live entries (filtered by category if available) with dummy data
//     const liveBilling = (dataEntries || []).filter(en => en.category === 'billing');
//     setLocalEntries([...dummyBilling, ...liveBilling]);
//   }, [dataEntries]);

//   // Inline Form State
//   const [isAdding, setIsAdding] = useState(false);
//   const [editingEntry, setEditingEntry] = useState(null);
//   const [formData, setFormData] = useState({
//     invoiceNo: '',
//     clientName: '',
//     amount: '',
//     billingDate: '',
//     dueDate: '',
//     status: 'Pending',
//     notes: ''
//   });

//   const filteredEntries = useMemo(() => {
//     return localEntries.filter(entry => 
//       Object.values(entry).some(val => String(val).toLowerCase().includes(searchValue.toLowerCase()))
//     );
//   }, [localEntries, searchValue]);

//   const handleInputChange = (e) => {
//     const { id, value } = e.target;
//     setFormData(prev => ({ ...prev, [id]: value }));
//   };

//   const resetForm = () => {
//     setFormData({ invoiceNo: '', clientName: '', amount: '', billingDate: '', dueDate: '', status: 'Pending', notes: '' });
//     setIsAdding(false);
//     setEditingEntry(null);
//   };

//   const handleSave = async (e) => {
//     e.preventDefault();
//     const newRecord = {
//       ...formData,
//       id: editingEntry ? editingEntry.id : Date.now(),
//       submitter: userName,
//       category: 'billing'
//     };

//     // Immediate Cache Update
//     if (editingEntry) {
//       setLocalEntries(prev => prev.map(en => en.id === editingEntry.id ? newRecord : en));
//     } else {
//       setLocalEntries(prev => [newRecord, ...prev]);
//     }

//     // Backend API Call (Sync)
//     try {
//       const method = editingEntry ? 'PATCH' : 'POST';
//       const url = editingEntry ? `${import.meta.env.VITE_API_BASE_URL}/entries/${editingEntry.id}` : `${import.meta.env.VITE_API_BASE_URL}/entries/new`;
//       await fetch(url, {
//         method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ ...formData, userId: currentUserId, submitter: userName, category: 'billing' }),
//       });
//       if (onDataChanged) onDataChanged();
//     } catch (err) {
//       console.warn("Backend save skipped/failed, keeping local cache for demo.");
//     }
//     resetForm();
//   };

//   const startEdit = () => {
//     const entryId = Array.from(selectedRows)[0];
//     const entry = localEntries.find(e => e.id === entryId);
//     if (entry) {
//       setEditingEntry(entry);
//       setFormData({
//         invoiceNo: entry.invoiceNo || '',
//         clientName: entry.clientName || '',
//         amount: entry.amount || '',
//         billingDate: entry.billingDate || '',
//         dueDate: entry.dueDate || '',
//         status: entry.status || 'Pending',
//         notes: entry.notes || ''
//       });
//       setIsAdding(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 sm:p-6 lg:p-8 text-gray-100 flex justify-center items-start">
//       <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-full text-gray-800">
        
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
//           <h1 className="text-3xl font-extrabold text-lime-800">Billing Management</h1>
//           <div className="flex items-center gap-4">
//             <img src="/Lumina_logo.png" alt="Logo" className="h-10 pr-4" />
//             <div className="flex items-center gap-3 bg-gray-100 p-2 rounded-lg text-gray-700">
//               <img src={userAvatar} alt="Avatar" className="w-10 h-10 rounded-full border" />
//               <span className="font-medium">Welcome, {userName}</span>
//             </div>
//             <button onClick={handleLogout} className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"><LogOut size={20}/></button>
//           </div>
//         </div>

//         {/* Inline Form */}
//         {(isAdding || editingEntry) && (
//           <div className="mb-8 p-6 border-2 border-purple-200 rounded-xl bg-purple-50 animate-in fade-in slide-in-from-top-4">
//             <div className="flex justify-between items-center mb-4 text-purple-900">
//               <h2 className="text-xl font-bold">{editingEntry ? 'Edit Invoice' : 'Generate New Invoice'}</h2>
//               <button onClick={resetForm} className="text-gray-500 hover:text-red-500"><X /></button>
//             </div>
//             <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//               <div>
//                 <label className="block text-xs font-bold mb-1">INVOICE NO *</label>
//                 <input id="invoiceNo" type="text" className="w-full p-2 border rounded" value={formData.invoiceNo} onChange={handleInputChange} required />
//               </div>
//               <div>
//                 <label className="block text-xs font-bold mb-1">CLIENT NAME *</label>
//                 <input id="clientName" type="text" className="w-full p-2 border rounded" value={formData.clientName} onChange={handleInputChange} required />
//               </div>
//               <div>
//                 <label className="block text-xs font-bold mb-1">AMOUNT *</label>
//                 <input id="amount" type="number" step="0.01" className="w-full p-2 border rounded" value={formData.amount} onChange={handleInputChange} required />
//               </div>
//               <div>
//                 <label className="block text-xs font-bold mb-1">STATUS</label>
//                 <select id="status" className="w-full p-2 border rounded" value={formData.status} onChange={handleInputChange}>
//                   <option value="Pending">Pending</option>
//                   <option value="Paid">Paid</option>
//                   <option value="Overdue">Overdue</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-xs font-bold mb-1">BILLING DATE *</label>
//                 <input id="billingDate" type="date" className="w-full p-2 border rounded" value={formData.billingDate} onChange={handleInputChange} required />
//               </div>
//               <div>
//                 <label className="block text-xs font-bold mb-1">DUE DATE *</label>
//                 <input id="dueDate" type="date" className="w-full p-2 border rounded" value={formData.dueDate} onChange={handleInputChange} required />
//               </div>
//               <div className="lg:col-span-2">
//                 <label className="block text-xs font-bold mb-1">NOTES</label>
//                 <input id="notes" type="text" className="w-full p-2 border rounded" value={formData.notes} onChange={handleInputChange} />
//               </div>
//               <div className="lg:col-span-4 flex justify-end">
//                 <button type="submit" className="bg-purple-600 text-white px-8 py-2 rounded-lg hover:bg-purple-700 transition flex items-center gap-2">
//                   <Save size={18}/> {editingEntry ? 'Update' : 'Save Invoice'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         )}

//         {/* Controls */}
//         <div className="flex flex-col md:flex-row justify-between items-center bg-gray-100 p-4 rounded-lg mb-6 gap-3">
//           <div className="flex items-center border rounded-lg bg-white flex-grow">
//             <Search size={18} className="text-gray-400 ml-3" />
//             <input type="text" placeholder="Search invoices..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)} className="w-full p-2 text-sm focus:outline-none" />
//           </div>
//           <div className="flex gap-2">
//             <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 bg-yellow-500 text-white px-5 py-2.5 rounded-lg hover:bg-yellow-600 transition"><Plus size={20}/> Add</button>
//             <button onClick={startEdit} disabled={selectedRows.size !== 1} className="flex items-center gap-2 bg-gray-600 text-white px-5 py-2.5 rounded-lg disabled:opacity-50"><Pencil size={20}/> Edit</button>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto rounded-lg border">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="p-4 w-12 text-center">
//                   <input type="checkbox" onChange={(e) => setSelectedRows(e.target.checked ? new Set(filteredEntries.map(en => en.id)) : new Set())} checked={filteredEntries.length > 0 && selectedRows.size === filteredEntries.length} />
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Invoice No</th>
//                 <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Client</th>
//                 <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Amount</th>
//                 <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
//                 <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Billing Date</th>
//                 <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Due Date</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y">
//               {filteredEntries.map((entry) => (
//                 <tr key={entry.id} className="hover:bg-purple-50 transition-colors">
//                   <td className="p-4 text-center">
//                     <input type="checkbox" checked={selectedRows.has(entry.id)} onChange={() => {
//                        const next = new Set(selectedRows);
//                        next.has(entry.id) ? next.delete(entry.id) : next.add(entry.id);
//                        setSelectedRows(next);
//                     }} />
//                   </td>
//                   <td className="px-6 py-3 text-sm font-bold text-gray-900">{entry.invoiceNo}</td>
//                   <td className="px-6 py-3 text-sm text-gray-700">{entry.clientName}</td>
//                   <td className="px-6 py-3 text-sm text-gray-700 font-semibold">${parseFloat(entry.amount).toFixed(2)}</td>
//                   <td className="px-6 py-3 text-sm">
//                     <span className={`px-2 py-1 rounded text-xs font-bold ${
//                       entry.status === 'Paid' ? 'bg-green-100 text-green-700' : 
//                       entry.status === 'Overdue' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
//                     }`}>
//                       {entry.status}
//                     </span>
//                   </td>
//                   <td className="px-6 py-3 text-sm text-gray-700">{formatDateForDisplay(entry.billingDate)}</td>
//                   <td className="px-6 py-3 text-sm text-gray-700">{formatDateForDisplay(entry.dueDate)}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BillingPage;


import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronDown, ChevronRight, Plus, Pencil, Search, 
  LogOut, X, Save, Send, FileText, Layout 
} from 'lucide-react';

const BillingPage = ({ 
  dataEntries, isLoading, userName = 'User', userAvatar, handleLogout, 
  currentUserRole, currentUserId, onDataChanged, contractOptions = []
}) => {
  const [searchColumn, setSearchColumn] = useState('all');
  const [searchValue, setSearchValue] = useState('');
  const [showOnlyLatest, setShowOnlyLatest] = useState(false);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [localEntries, setLocalEntries] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  // Persistence Key
  const CACHE_KEY = `billing_form_cache_${currentUserId}`;

  const pmEmailOptions = [
    'Manas.Lalwani@revolvespl.com',
    'Nilesh.Peswani@revolvespl.com',
    'abdulraees.shaikh@revolvespl.com',
    'jony.rodrigues@revolvespl.com'
  ];

  const searchableColumns = [
    { key: 'all', name: 'All Fields' },
    { key: 'projectName', name: 'Project Name' },
    { key: 'contractShortName', name: 'Contract' },
    { key: 'status', name: 'Status' },
  ];

  const [formData, setFormData] = useState({
    projectName: '', contractShortName: '', pmEmail: '', emailCc: '',
    invoiceDate: '', amount: '', status: 'Draft', notes: '', pdfFilePath: '',
  });

  // 1. Initial Load & Cache Restoration
  useEffect(() => {
    setLocalEntries(dataEntries || []);
    const savedCache = localStorage.getItem(CACHE_KEY);
    if (savedCache && !editingEntry) {
      setFormData(JSON.parse(savedCache));
      setIsAdding(true); // Re-open form if they had unsaved work
    }
  }, [dataEntries]);

  // 2. Continuous Cache Save
  useEffect(() => {
    if (isAdding || editingEntry) {
      localStorage.setItem(CACHE_KEY, JSON.stringify(formData));
    }
  }, [formData, isAdding, editingEntry]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const setStatus = (newStatus) => {
    const adminStatuses = ['Approved', 'Rejected', 'Paid'];
    // HARDCODED PERMISSION: Only user "Revolve" can Approve, Reject, or mark Paid
    if (adminStatuses.includes(newStatus) && userName !== 'Revolve') {
      alert("Permission Denied: Only Admins can set Approved, Rejected, or Paid status.");
      return;
    }
    setFormData(prev => ({ ...prev, status: newStatus }));
  };

  const resetForm = () => {
    setFormData({
      projectName: '', contractShortName: '', pmEmail: '', emailCc: '',
      invoiceDate: '', amount: '', status: 'Draft', notes: '', pdfFilePath: ''
    });
    localStorage.removeItem(CACHE_KEY);
    setIsAdding(false);
    setEditingEntry(null);
  };

  const startEdit = () => {
    const entryId = Array.from(selectedRows)[0];
    const entry = localEntries.find(e => e.id === entryId);
    if (entry) {
      setEditingEntry(entry);
      setIsAdding(false);
      setFormData({
        projectName: entry.project_name || entry.projectName || '',
        contractShortName: entry.contract_short_name || entry.contractShortName || '',
        pmEmail: entry.pm_email || entry.pmEmail || '',
        emailCc: entry.email_cc || entry.emailCc || '',
        invoiceDate: (entry.invoice_date || entry.invoiceDate)?.split('T')[0] || '',
        amount: entry.amount || 0,
        status: entry.status || 'Draft',
        notes: entry.notes || '',
        pdfFilePath: entry.pdf_file_path || entry.pdfFilePath || '',
      });
    }
  };

  const handleSave = async (e, shouldNotify = false) => {
    if (e) e.preventDefault();
    
    // Validation
    if (formData.status === 'Rejected' && !formData.notes) {
      return alert("Reason for rejection is required in the Notes field.");
    }

    try {
      const url = editingEntry 
        ? `${import.meta.env.VITE_API_BASE_URL}/billing/${editingEntry.id}`
        : `${import.meta.env.VITE_API_BASE_URL}/billing/new`;

      const response = await fetch(url, {
        method: editingEntry ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userId: currentUserId, shouldNotify }),
      });

      if (response.ok) {
        if (onDataChanged) onDataChanged();
        resetForm();
      } else {
        alert("Server error during save.");
      }
    } catch (err) { alert("Save error: " + err.message); }
  };

  // --- Search & History Logic ---
  const groupedEntries = useMemo(() => {
    const groups = localEntries.reduce((acc, entry) => {
      const baseKey = String(entry.prime_key || entry.primeKey || '').split('.')[0];
      if (!baseKey) return acc;
      if (!acc[baseKey]) acc[baseKey] = [];
      acc[baseKey].push(entry);
      return acc;
    }, {});

    for (const key in groups) {
      groups[key].sort((a, b) => parseFloat(b.prime_key || b.primeKey || 0) - parseFloat(a.prime_key || a.primeKey || 0));
    }

    let filteredGroups = Object.values(groups);
    if (searchValue) {
      const lowVal = searchValue.toLowerCase();
      filteredGroups = filteredGroups.filter(group =>
        group.some(e => Object.values(e).some(v => String(v).toLowerCase().includes(lowVal)))
      );
    }
    return showOnlyLatest ? filteredGroups.map(g => [g[0]]) : filteredGroups;
  }, [localEntries, searchValue, showOnlyLatest]);

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-gray-800">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h1 className="text-3xl font-black text-blue-900  tracking-tighter flex items-center gap-2">
             Billing
          </h1>
          <div className="flex items-center gap-4">
            <div className="bg-gray-100 p-2 rounded-lg flex items-center gap-2 border">
              <img src={userAvatar || "/default-avatar.png"} alt="Avatar" className="w-8 h-8 rounded-full" />
              <span className="text-sm font-bold">{userName}</span>
            </div>
            <button onClick={handleLogout} className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition">
              <LogOut size={20}/>
            </button>
          </div>
        </div>

        {/* Persistence Banner */}
        {(isAdding || editingEntry) && (
          <div className="mb-2 text-[10px] font-bold text-purple-500 uppercase animate-pulse">
        
          </div>
        )}

        {/* Input Form */}
        {(isAdding || editingEntry) && (
          <div className="mb-8 p-6 border-2 border-purple-200 rounded-xl bg-purple-50 relative z-30 shadow-xl">
            <form onSubmit={(e) => handleSave(e, false)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div><label className="block text-xs font-bold mb-1">PROJECT NAME *</label><input id="projectName" className="w-full p-2 border rounded bg-white" value={formData.projectName} onChange={handleInputChange} required /></div>
                <div><label className="block text-xs font-bold mb-1">CONTRACT *</label>
                  <select id="contractShortName" className="w-full p-2 border rounded bg-white" value={formData.contractShortName} onChange={handleInputChange} required>
                    <option value="">Select Contract</option>
                    {contractOptions.map(opt => <option key={opt.id} value={opt.name}>{opt.name}</option>)}
                  </select>
                </div>
                <div><label className="block text-xs font-bold mb-1 text-blue-700 font-bold">NOTIFY PM *</label>
                  <select id="pmEmail" className="w-full p-2 border rounded bg-white" value={formData.pmEmail} onChange={handleInputChange} required>
                    <option value="">Select PM</option>
                    {pmEmailOptions.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
                <div><label className="block text-xs font-bold mb-1">EMAIL CC</label><input id="emailCc" type="email" className="w-full p-2 border rounded bg-white" value={formData.emailCc} onChange={handleInputChange} placeholder="Optional" /></div>
                <div><label className="block text-xs font-bold mb-1 uppercase">Amount *</label><input id="amount" type="number" step="0.01" className="w-full p-2 border rounded bg-white" value={formData.amount} onChange={handleInputChange} required /></div>
                <div><label className="block text-xs font-bold mb-1 uppercase">Invoice Date *</label><input id="invoiceDate" type="date" className="w-full p-2 border rounded bg-white" value={formData.invoiceDate} onChange={handleInputChange} required /></div>
                <div className="lg:col-span-2"><label className="block text-xs font-bold mb-1 uppercase">PDF Path / Link *</label><input id="pdfFilePath" type="text" className="w-full p-2 border rounded bg-white" value={formData.pdfFilePath} onChange={handleInputChange} required /></div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 uppercase text-gray-500">
                  Notes {formData.status === 'Rejected' && <span className="text-red-600">(Reason Required)</span>}
                </label>
                <textarea id="notes" rows="1" className={`w-full p-2 border rounded bg-white ${formData.status === 'Rejected' ? 'border-red-500 border-2' : ''}`} value={formData.notes} onChange={handleInputChange} />
              </div>

              {/* Status & Actions */}
              <div className="p-4 bg-white border-2 border-dashed rounded-lg flex flex-wrap items-center justify-between gap-4">
                <div className="flex gap-2">
                  {['Draft', 'Submitted'].map(st => (
                    <button key={st} type="button" onClick={() => setStatus(st)} className={`px-4 py-2 rounded font-bold text-xs transition-all ${formData.status === st ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-400'}`}>{st.toUpperCase()}</button>
                  ))}
                  <div className="w-[2px] bg-gray-200 h-8 mx-2" />
                  {['Approved', 'Rejected', 'Paid'].map(st => (
                    <button key={st} type="button" onClick={() => setStatus(st)} className={`px-4 py-2 rounded font-bold text-xs transition-all ${formData.status === st ? (st === 'Approved' ? 'bg-green-600 text-white' : st === 'Rejected' ? 'bg-red-600 text-white' : 'bg-emerald-700 text-white shadow-lg') : 'bg-gray-100 text-gray-400'} ${userName !== 'Revolve' ? 'opacity-20 cursor-not-allowed' : 'hover:scale-105'}`}>{st.toUpperCase()}</button>
                  ))}
                </div>
                <div className="flex gap-2">
                   <button type="button" onClick={resetForm} className="px-6 py-2 bg-gray-200 rounded font-bold text-xs hover:bg-gray-300">CANCEL</button>
                   <button type="submit" className="bg-blue-600 text-white px-8 py-2 rounded font-bold shadow-lg hover:bg-blue-700 transition flex items-center gap-2"><Save size={18}/> SAVE</button>
                   {userName !== 'Revolve' && (
                     <button type="button" onClick={(e) => handleSave(e, true)} className="bg-purple-600 text-white px-8 py-2 rounded font-bold shadow-lg hover:bg-purple-700 transition flex items-center gap-2"><Send size={18}/> SAVE & NOTIFY</button>
                   )}
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-gray-100 p-4 rounded-lg mb-6 gap-3">
            <div className="flex gap-3">
                {!isAdding && !editingEntry && (
                  <button onClick={() => setIsAdding(true)} className="bg-yellow-500 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold shadow-md hover:bg-yellow-600 transition"><Plus size={20}/> ADD BILL</button>
                )}
                <button disabled={selectedRows.size !== 1} onClick={startEdit} className="bg-gray-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 disabled:opacity-50 font-bold transition hover:bg-gray-700 shadow-md"><Pencil size={20}/> EDIT</button>
            </div>
            <div className="flex items-center border rounded-lg bg-white flex-grow max-w-xl">
                <select value={searchColumn} onChange={(e) => setSearchColumn(e.target.value)} className="p-2 bg-transparent border-r text-sm">
                    {searchableColumns.map(col => <option key={col.key} value={col.key}>{col.name}</option>)}
                </select>
                <input type="text" placeholder="Search invoices..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)} className="w-full p-2 text-sm outline-none" />
                <Search size={18} className="text-gray-400 mr-3" />
            </div>
            <label className="flex items-center cursor-pointer gap-2 text-xs font-bold uppercase text-gray-500">
                Latest Only
                <input type="checkbox" checked={showOnlyLatest} onChange={(e) => setShowOnlyLatest(e.target.checked)} className="w-4 h-4" />
            </label>
        </div>

        {/* Table Content */}
        
        <div className="overflow-x-auto border rounded-lg shadow-sm">
          <table className="min-w-full divide-y text-sm">
            <thead className="bg-gray-50 uppercase font-bold text-gray-500 text-xs">
              <tr>
                <th className="p-4 w-12 text-center"></th>
                <th className="px-6 py-3 text-left">Record No</th>
                <th className="px-6 py-3 text-left">Project Name</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Amount</th>
                <th className="px-6 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y">
              {groupedEntries.map(group => {
                const baseKey = String(group[0].prime_key || group[0].primeKey).split('.')[0];
                const hasHistory = group.length > 1;
                const entry = group[0];
                
                return (
                  <React.Fragment key={entry.id}>
                    <tr onClick={() => { const s = new Set(); s.add(entry.id); setSelectedRows(s); }} className={`hover:bg-blue-50 cursor-pointer transition-colors ${selectedRows.has(entry.id) ? 'bg-blue-50 border-l-4 border-blue-600' : ''}`}>
                      <td className="p-4 text-center"><input type="checkbox" checked={selectedRows.has(entry.id)} readOnly /></td>
                      <td className="px-6 py-3 font-bold">
                        {hasHistory && (
                          <button onClick={(e) => { e.stopPropagation(); const next = new Set(expandedRows); next.has(baseKey) ? next.delete(baseKey) : next.add(baseKey); setExpandedRows(next); }} className="mr-2">
                            {expandedRows.has(baseKey) ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
                          </button>
                        )}
                        {entry.prime_key || entry.primeKey}
                      </td>
                      <td className="px-6 py-3 font-medium">{entry.project_name || entry.projectName}</td>
                      <td className="px-6 py-3">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${
                          entry.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                          entry.status === 'Rejected' ? 'bg-red-100 text-red-700' : 
                          entry.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' :
                          entry.status === 'Submitted' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {entry.status || 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-3 font-black text-blue-900">
                        ${parseFloat(entry.amount || entry.chargeAmount || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-3 text-gray-500">
                        {(entry.invoice_date || entry.invoiceDate || entry.chargeDate)?.split('T')[0]}
                      </td>
                    </tr>
                    
                    {/* Version History Expansion */}
                    {expandedRows.has(baseKey) && group.slice(1).map(hEntry => (
                      <tr key={hEntry.id} className="bg-gray-50 italic text-gray-400 border-l-4 border-yellow-400 text-xs">
                        <td className="p-4"></td>
                        <td className="px-6 py-2 pl-12 font-bold">{hEntry.prime_key || hEntry.primeKey}</td>
                        <td className="px-6 py-2">{hEntry.project_name || hEntry.projectName}</td>
                        <td className="px-6 py-2 uppercase font-bold">{hEntry.status}</td>
                        <td className="px-6 py-2">${parseFloat(hEntry.amount || 0).toFixed(2)}</td>
                        <td className="px-6 py-2">{(hEntry.invoice_date || hEntry.invoiceDate)?.split('T')[0]}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
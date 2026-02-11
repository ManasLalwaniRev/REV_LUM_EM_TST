
// import React, { useState, useMemo, useEffect } from 'react';
// import { 
//   Save, Search, UserCircle, ChevronDown, ChevronRight, 
//   Loader, LogOut, Mail, FileText, Book, AlertCircle, CheckCircle2 
// } from 'lucide-react';

// // --- SLA Status Calculation ---
// const getAutoStatus = (infoDateStr, processDateStr) => {
//   if (!infoDateStr || !processDateStr) return { text: 'Awaiting Dates', color: 'text-gray-400', bg: 'bg-gray-50' };

//   const infoDate = new Date(infoDateStr);
//   const processDate = new Date(processDateStr);

//   const i = Date.UTC(infoDate.getUTCFullYear(), infoDate.getUTCMonth(), infoDate.getUTCDate());
//   const p = Date.UTC(processDate.getUTCFullYear(), processDate.getUTCMonth(), processDate.getUTCDate());

//   const diffDays = (p - i) / (1000 * 60 * 60 * 24);

//   if (diffDays > 2) return { text: 'Deadline crossed', color: 'text-red-600 font-bold', bg: 'bg-red-50' };
//   if (diffDays === 2) return { text: 'On deadline', color: 'text-yellow-600 font-bold', bg: 'bg-yellow-50' };
//   return { text: 'Before Deadline', color: 'text-green-600 font-bold', bg: 'bg-green-50' };
// };

// const formatDateForInput = (isoString) => {
//   if (!isoString) return '';
//   const date = new Date(isoString);
//   return isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
// };

// const SLA = ({ dataEntries = [], isLoading, error, fetchEntries, userId, userName = 'Accountant', userAvatar, handleLogout }) => {
//   const [activeTab, setActiveTab] = useState('vendor');
//   const [searchValue, setSearchValue] = useState('');
//   const [expandedRows, setExpandedRows] = useState(new Set());
//   const [editedData, setEditedData] = useState({});
//   const [isSaving, setIsSaving] = useState(false);
//   const [message, setMessage] = useState('');

//   const tabConfig = {
//     vendor: {
//       label: 'Vendor Expenses',
//       icon: <FileText size={18} />,
//       columns: ['Contract', 'Vendor Name', 'Amount', 'Charge Date'],
//       keys: ['displayContract', 'displayName', 'displayAmount', 'displayDate']
//     },
//     email: {
//       label: 'Email Records',
//       icon: <Mail size={18} />,
//       columns: ['Subject', 'Sent To', 'Task', 'Email Date'],
//       keys: ['displaySubject', 'displayRecipient', 'displayTask', 'displayDate']
//     },
//     bill: {
//       label: 'Billing',
//       icon: <Book size={18} />,
//       columns: ['Contract', 'Invoice No', 'Period', 'Amount'],
//       keys: ['displayContract', 'displayInvoice', 'displayPeriod', 'displayAmount']
//     }
//   };

//   // --- DATA NORMALIZER ---
//   // This maps inconsistent backend keys to a unified set of "Display Keys"
//   const normalizedData = useMemo(() => {
//     if (!dataEntries || !Array.isArray(dataEntries)) return [];

//     return dataEntries.map(entry => ({
//       ...entry,
//       // Shared mappings
//       pKey: entry.primeKey || entry.prime_key || "0",
//       displayContract: entry.contractShortName || entry.contract_short_name || 'N/A',
//       displayDate: entry.chargeDate || entry.charge_date || entry.emailDate || entry.email_date || entry.created_at,
//       displayAmount: entry.chargeAmount || entry.charge_amount || entry.amount || 0,
      
//       // Module specific mappings
//       displayName: entry.vendorName || entry.vendor_name,
//       displaySubject: entry.subject,
//       displayRecipient: entry.recipient,
//       displayTask: entry.task,
//       displayInvoice: entry.invoiceNo || entry.invoice_no,
//       displayPeriod: entry.billingPeriod || entry.billing_period,

//       // Detect Module Type if missing
//       mType: entry.moduleType || (
//         (entry.vendorName || entry.vendor_name) ? 'vendor' :
//         (entry.subject || entry.recipient) ? 'email' : 'bill'
//       )
//     }));
//   }, [dataEntries]);

//   const filteredData = useMemo(() => {
//     return normalizedData.filter(entry => entry.mType === activeTab);
//   }, [normalizedData, activeTab]);

//   const groupedEntries = useMemo(() => {
//     const groups = filteredData.reduce((acc, entry) => {
//       const baseKey = String(entry.pKey).split('.')[0];
//       if (!acc[baseKey]) acc[baseKey] = [];
//       acc[baseKey].push(entry);
//       return acc;
//     }, {});

//     for (const key in groups) {
//       groups[key].sort((a, b) => parseFloat(b.pKey) - parseFloat(a.pKey));
//     }

//     let result = Object.values(groups);
//     if (searchValue.trim()) {
//       const term = searchValue.toLowerCase();
//       result = result.filter(g => g.some(e => 
//         Object.values(e).some(val => String(val || '').toLowerCase().includes(term))
//       ));
//     }
//     return result;
//   }, [filteredData, searchValue]);

//   const handleEditChange = (id, field, value) => {
//     setEditedData(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
//   };

//   const handleSaveAll = async () => {
//     setIsSaving(true);
//     const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
//     try {
//       const endpointMap = { vendor: 'vendor-expenses', email: 'email-records', bill: 'billing' };
//       await Promise.all(Object.keys(editedData).map(async (id) => {
//         return fetch(`${API_BASE_URL}/${endpointMap[activeTab]}/${id}`, {
//           method: 'PATCH',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ ...editedData[id], userId })
//         });
//       }));
//       setEditedData({});
//       setMessage('Records updated successfully!');
//       fetchEntries();
//     } catch (err) {
//       setMessage('Error: ' + err.message);
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 sm:p-6 lg:p-8 text-gray-100 flex justify-center items-start">
//       <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-full text-gray-800">
        
//         {/* Header */}
//         <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
//           <div className="flex items-center gap-4">
//             {/* <div className="p-3 bg-lime-100 rounded-xl text-lime-700">
              
//               </div> */}
//             <h1 className="text-3xl font-black text-blue-800  tracking-tighter">SLA Monitoring</h1>
//           </div>
//           <div className="flex items-center gap-3 bg-gray-50 p-2 pr-4 rounded-full border">
//             <img src={userAvatar} className="w-10 h-10 rounded-full border-2 border-white" alt="avatar" />
//             <span className="text-sm font-bold text-gray-700 leading-tight">{userName}</span>
//             <button onClick={handleLogout} className="p-2 text-red-500 hover:bg-red-50 rounded-full"><LogOut size={16}/></button>
//           </div>
//         </div>

//         {/* Tab Navigation */}
//         <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
//           {Object.entries(tabConfig).map(([key, config]) => (
//             <button
//               key={key}
//               onClick={() => { setActiveTab(key); setExpandedRows(new Set()); }}
//               className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold transition-all ${
//                 activeTab === key ? 'bg-white text-lime-700 shadow-sm' : 'text-gray-400 hover:text-gray-600'
//               }`}
//             >
//               {config.icon} {config.label}
//             </button>
//           ))}
//         </div>

//         {/* Global Controls */}
//         <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
//           <div className="relative w-full md:max-w-md">
//             <Search className="absolute left-3 top-3 text-gray-400" size={20} />
//             <input 
//               type="text" 
//               placeholder={`Search ${tabConfig[activeTab].label}...`}
//               className="w-full pl-10 pr-4 py-3 border-2 border-gray-100 rounded-xl focus:border-lime-500 outline-none"
//               value={searchValue}
//               onChange={(e) => setSearchValue(e.target.value)}
//             />
//           </div>
//           {Object.keys(editedData).length > 0 && (
//             <button onClick={handleSaveAll} disabled={isSaving} className="bg-lime-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-lime-700">
//               <Save size={20} /> {isSaving ? 'Saving...' : `Save ${Object.keys(editedData).length} Changes`}
//             </button>
//           )}
//         </div>

//         {/* Data Table */}
//         <div className="overflow-x-auto rounded-2xl border-2 border-gray-100">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-4 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Ref No</th>
//                 {tabConfig[activeTab].columns.map(col => (
//                   <th key={col} className="px-4 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">{col}</th>
//                 ))}
//                 <th className="px-4 py-4 text-center text-[10px] font-black text-blue-600 uppercase bg-blue-50/50 border-x">SLA Status</th>
//                 <th className="px-4 py-4 text-center text-[10px] font-black text-gray-400 uppercase">Proc.</th>
//                 <th className="px-4 py-4 text-left text-[10px] font-black text-gray-400 uppercase">Info Received</th>
//                 <th className="px-4 py-4 text-left text-[10px] font-black text-gray-400 uppercase">Processed Date</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-100">
//               {isLoading ? (
//                 <tr><td colSpan="10" className="p-12 text-center"><Loader className="animate-spin mx-auto text-lime-600" size={32}/></td></tr>
//               ) : groupedEntries.length === 0 ? (
//                 <tr><td colSpan="10" className="p-12 text-center text-gray-400 italic">No records found for this tab. Check Console for data status.</td></tr>
//               ) : groupedEntries.map((group) => {
//                 const latest = group[0];
//                 const baseKey = String(latest.pKey).split('.')[0];
//                 const isExpanded = expandedRows.has(baseKey);
                
//                 // const curInfoDate = editedData[latest.id]?.infoReceivedDate ?? latest.infoReceivedDate || latest.info_received_date;
//                 // const curProcDate = editedData[latest.id]?.dateProcessed ?? latest.dateProcessed || latest.date_processed;
//                 // 1. Ensure latest exists to prevent "Cannot read property id of undefined"
// const entryId = latest?.id;
// if (!entryId) return null; // Skip rendering if ID is missing

// // 2. Use a fallback sequence that handles Edited State -> CamelCase -> snake_case -> null
// const curInfoDate = editedData[entryId]?.infoReceivedDate 
//                  ?? latest.infoReceivedDate 
//                  ?? latest.info_received_date 
//                  ?? null;

// const curProcDate = editedData[entryId]?.dateProcessed 
//                  ?? latest.dateProcessed 
//                  ?? latest.date_processed 
//                  ?? null;
                 
                 
//                 const status = getAutoStatus(curInfoDate, curProcDate);

//                 return (
//                   <tr key={latest.id} className="hover:bg-gray-50 transition-colors">
//                     <td className="px-4 py-4 whitespace-nowrap font-black text-gray-900 text-sm">{latest.pKey}</td>
//                     {tabConfig[activeTab].keys.map(key => (
//                       <td key={key} className="px-4 py-4 text-xs font-bold text-gray-600">
//                         {key.includes('Amount') ? `$${parseFloat(latest[key] || 0).toLocaleString(undefined, {minimumFractionDigits:2})}` : latest[key] || '---'}
//                       </td>
//                     ))}
//                     <td className={`px-4 py-4 text-center text-[10px] font-black uppercase ${status.color} ${status.bg} border-x`}>{status.text}</td>
//                     <td className="px-4 py-4 text-center">
//                       <input 
//                         type="checkbox" 
//                         checked={editedData[latest.id]?.accountingProcessed === 'T' || (latest.accountingProcessed === 'T' || latest.accounting_processed === 'T')}
//                         onChange={e => handleEditChange(latest.id, 'accountingProcessed', e.target.checked ? 'T' : 'F')}
//                         className="w-4 h-4 rounded accent-lime-600"
//                       />
//                     </td>
//                     <td className="px-4 py-4">
//                       <input 
//                         type="date" 
//                         value={editedData[latest.id]?.infoReceivedDate ?? formatDateForInput(latest.infoReceivedDate || latest.info_received_date)}
//                         onChange={e => handleEditChange(latest.id, 'infoReceivedDate', e.target.value)}
//                         className="text-xs font-bold border rounded p-1"
//                       />
//                     </td>
//                     <td className="px-4 py-4">
//                       <input 
//                         type="date" 
//                         value={editedData[latest.id]?.dateProcessed ?? formatDateForInput(latest.dateProcessed || latest.date_processed)}
//                         onChange={e => handleEditChange(latest.id, 'dateProcessed', e.target.value)}
//                         className="text-xs font-bold border rounded p-1"
//                       />
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SLA;


import React, { useState, useMemo } from 'react';
import { 
  Save, Search, LogOut, Mail, FileText, Book, AlertCircle, CheckCircle2, Loader, Clock
} from 'lucide-react';

// --- INITIAL MOCK DATA ---
const INITIAL_DATA = [
  {
    id: 1,
    primeKey: "V-101",
    moduleType: "vendor",
    contractShortName: "Cloud Services",
    vendorName: "Amazon AWS",
    chargeAmount: 1250.00,
    chargeDate: "2026-02-01",
    infoReceivedDate: "2026-02-01",
    dateProcessed: "2026-02-01", // 0 days diff -> Green (Before)
    accountingProcessed: "T"
  },
  {
    id: 2,
    primeKey: "V-102",
    moduleType: "vendor",
    contractShortName: "Marketing",
    vendorName: "Google Ads",
    chargeAmount: 2500.00,
    chargeDate: "2026-02-05",
    infoReceivedDate: "2026-02-05",
    dateProcessed: "2026-02-07", // 2 days diff -> Yellow (On Deadline)
    accountingProcessed: "F"
  },
  {
    id: 3,
    primeKey: "E-201",
    moduleType: "email",
    subject: "Urgent Tax Query",
    recipient: "tax-dept@company.com",
    task: "Clarification",
    emailDate: "2026-02-10",
    infoReceivedDate: "2026-02-10",
    dateProcessed: "2026-02-15", // 5 days diff -> Red (Overdue)
    accountingProcessed: "F"
  },
  {
    id: 4,
    primeKey: "B-301",
    moduleType: "bill",
    contractShortName: "Office Lease",
    invoiceNo: "INV-9988",
    billingPeriod: "Feb 2026",
    amount: 5000.00,
    infoReceivedDate: "2026-02-01",
    dateProcessed: "2026-02-01", // Green (Before)
    accountingProcessed: "T"
  }
];

// --- SLA Status Calculation ---
const getAutoStatus = (infoDateStr, processDateStr) => {
  if (!infoDateStr || !processDateStr) return { text: 'Awaiting Dates', color: 'text-gray-400', bg: 'bg-gray-50' };

  const infoDate = new Date(infoDateStr);
  const processDate = new Date(processDateStr);

  const i = Date.UTC(infoDate.getUTCFullYear(), infoDate.getUTCMonth(), infoDate.getUTCDate());
  const p = Date.UTC(processDate.getUTCFullYear(), processDate.getUTCMonth(), processDate.getUTCDate());

  const diffDays = Math.floor((p - i) / (1000 * 60 * 60 * 24));

  if (diffDays > 2) return { text: 'Deadline crossed', color: 'text-red-600 font-bold', bg: 'bg-red-50' };
  if (diffDays === 2) return { text: 'On deadline', color: 'text-yellow-600 font-bold', bg: 'bg-yellow-50' };
  return { text: 'Before Deadline', color: 'text-green-600 font-bold', bg: 'bg-green-50' };
};

const formatDateForInput = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  return isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
};

const SLA = () => {
  // Local state instead of API
  const [dataEntries, setDataEntries] = useState(INITIAL_DATA);
  const [activeTab, setActiveTab] = useState('vendor');
  const [searchValue, setSearchValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const tabConfig = {
    vendor: {
      label: 'Vendor Expenses',
      icon: <FileText size={18} />,
      columns: ['Contract', 'Vendor Name', 'Amount', 'Charge Date'],
      keys: ['displayContract', 'displayName', 'displayAmount', 'displayDate']
    },
    email: {
      label: 'Email Records',
      icon: <Mail size={18} />,
      columns: ['Subject', 'Sent To', 'Task', 'Email Date'],
      keys: ['displaySubject', 'displayRecipient', 'displayTask', 'displayDate']
    },
    bill: {
      label: 'Billing',
      icon: <Book size={18} />,
      columns: ['Contract', 'Invoice No', 'Period', 'Amount'],
      keys: ['displayContract', 'displayInvoice', 'displayPeriod', 'displayAmount']
    }
  };

  // --- Unified Data Mapping ---
  const normalizedData = useMemo(() => {
    return dataEntries.map(entry => ({
      ...entry,
      pKey: entry.primeKey || "0",
      displayContract: entry.contractShortName || 'N/A',
      displayDate: entry.chargeDate || entry.emailDate || 'N/A',
      displayAmount: entry.chargeAmount || entry.amount || 0,
      displayName: entry.vendorName,
      displaySubject: entry.subject,
      displayRecipient: entry.recipient,
      displayTask: entry.task,
      displayInvoice: entry.invoiceNo,
      displayPeriod: entry.billingPeriod,
      mType: entry.moduleType
    }));
  }, [dataEntries]);

  const filteredData = useMemo(() => {
    const tabFiltered = normalizedData.filter(entry => entry.mType === activeTab);
    if (!searchValue.trim()) return tabFiltered;
    
    const term = searchValue.toLowerCase();
    return tabFiltered.filter(e => 
      Object.values(e).some(val => String(val || '').toLowerCase().includes(term))
    );
  }, [normalizedData, activeTab, searchValue]);

  // Handle local data updates
  const handleLocalEdit = (id, field, value) => {
    setDataEntries(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const simulateSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("Changes saved successfully to local state!");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 sm:p-6 lg:p-8 text-gray-100 flex justify-center items-start">
      <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-7xl text-gray-800">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-black text-blue-800 tracking-tighter">SLA Monitoring</h1>
          </div>
          <div className="flex items-center gap-3 bg-gray-50 p-2 pr-4 rounded-full border">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">A</div>
            <span className="text-sm font-bold text-gray-700 leading-tight">Accountant Mode</span>
            <button onClick={() => window.location.reload()} className="p-2 text-red-500 hover:bg-red-50 rounded-full"><LogOut size={16}/></button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
          {Object.entries(tabConfig).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold transition-all ${
                activeTab === key ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {config.icon} {config.label}
            </button>
          ))}
        </div>

        {/* Global Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder={`Search in ${tabConfig[activeTab].label}...`}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-100 rounded-xl focus:border-blue-500 outline-none"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
          <button onClick={simulateSave} disabled={isSaving} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 disabled:bg-gray-400">
            {isSaving ? <Loader className="animate-spin" size={20} /> : <Save size={20} />}
            {isSaving ? 'Processing...' : 'Save All Changes'}
          </button>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto rounded-2xl border-2 border-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Ref No</th>
                {tabConfig[activeTab].columns.map(col => (
                  <th key={col} className="px-4 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">{col}</th>
                ))}
                <th className="px-4 py-4 text-center text-[10px] font-black text-blue-600 uppercase bg-blue-50/50 border-x">SLA Status</th>
                <th className="px-4 py-4 text-center text-[10px] font-black text-gray-400 uppercase">Proc.</th>
                <th className="px-4 py-4 text-left text-[10px] font-black text-gray-400 uppercase">Info Received</th>
                <th className="px-4 py-4 text-left text-[10px] font-black text-gray-400 uppercase">Processed Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredData.length === 0 ? (
                <tr><td colSpan="10" className="p-12 text-center text-gray-400 italic">No records found for this category.</td></tr>
              ) : filteredData.map((entry) => {
                const status = getAutoStatus(entry.infoReceivedDate, entry.dateProcessed);

                return (
                  <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap font-black text-gray-900 text-sm">{entry.pKey}</td>
                    {tabConfig[activeTab].keys.map(key => (
                      <td key={key} className="px-4 py-4 text-xs font-bold text-gray-600">
                        {key.includes('Amount') 
                          ? `$${parseFloat(entry[key] || 0).toLocaleString(undefined, {minimumFractionDigits:2})}` 
                          : entry[key] || '---'}
                      </td>
                    ))}
                    
                    {/* SLA STATUS COLUMN */}
                    <td className={`px-4 py-4 text-center text-[10px] font-black uppercase ${status.color} ${status.bg} border-x`}>
                      <div className="flex items-center justify-center gap-1">
                        {status.text === 'Before Deadline' && <CheckCircle2 size={12} />}
                        {status.text === 'On deadline' && <Clock size={12} />}
                        {status.text === 'Deadline crossed' && <AlertCircle size={12} />}
                        {status.text}
                      </div>
                    </td>

                    <td className="px-4 py-4 text-center">
                      <input 
                        type="checkbox" 
                        checked={entry.accountingProcessed === 'T'}
                        onChange={e => handleLocalEdit(entry.id, 'accountingProcessed', e.target.checked ? 'T' : 'F')}
                        className="w-4 h-4 rounded accent-blue-600 cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <input 
                        type="date" 
                        value={formatDateForInput(entry.infoReceivedDate)}
                        onChange={e => handleLocalEdit(entry.id, 'infoReceivedDate', e.target.value)}
                        className="text-xs font-bold border rounded p-1 outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <input 
                        type="date" 
                        value={formatDateForInput(entry.dateProcessed)}
                        onChange={e => handleLocalEdit(entry.id, 'dateProcessed', e.target.value)}
                        className="text-xs font-bold border rounded p-1 outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SLA;
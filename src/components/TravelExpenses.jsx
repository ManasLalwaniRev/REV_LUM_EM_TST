
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



import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plane, Bed, Utensils, Car, LogOut, Plus, 
  Save, Info, X, ExternalLink, FileText 
} from 'lucide-react';

// --- 1. Instructions Modal Component ---
const InstructionsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const instructions = [
    "Please enter expenses for each day of travel separately.",
    <>On Row 8 - enter the lodging perdiem rate. Ref: <a href="https://www.gsa.gov/travel/plan-book/per-diem-rates" target="_blank" rel="noreferrer" className="text-blue-600 underline">GSA Rates</a></>,
    "On Row - 9 enter the M & IE perdiem rate. First & last day of travel equals 75% of total M&IE.",
    "Row 10 - Enter the project name.",
    "Rows 12-13 - Enter the actual expenses.",
    "Row 14 - Enter M&IE per diem as per the rates.",
    "Rows 16 & 17 - Enter actual lodging charges & taxes.",
    "Rows 18 - 20 - DO NOT enter any information.",
    "Rows 22-24 - Enter actual expenses.",
    "Row 33 - Complete the information."
  ];

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200">
        <div className="bg-blue-900 p-4 flex justify-between items-center">
          <h2 className="text-white font-bold uppercase text-sm tracking-widest flex items-center gap-2">
            <Info size={18}/> Help & Instructions
          </h2>
          <button onClick={onClose} className="text-white/80 hover:text-white"><X size={20}/></button>
        </div>
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <ul className="space-y-3">
            {instructions.map((text, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-700">
                <span className="font-bold text-blue-600">{i + 1}.</span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-4 bg-gray-50 border-t flex justify-end">
          <button onClick={onClose} className="bg-blue-900 text-white px-6 py-2 rounded-lg font-bold text-xs uppercase hover:bg-blue-800 transition">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// --- 2. Travel Report View (Statement Layout) ---
const TravelReportView = ({ entries }) => {
  const totalAmount = entries.reduce((sum, e) => sum + parseFloat(e.chargeAmount || e.charge_amount || 0), 0);

  return (
    <div className="mt-4 bg-white border border-gray-300 rounded-lg overflow-hidden shadow-lg">
      <div className="bg-[#0070C0] p-4 text-center">
        <h2 className="text-xl font-black text-white uppercase tracking-widest">Infotrend Inc - Travel Expense Statement</h2>
      </div>
      
      <div className="p-4 overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-400 text-[11px]">
          <tbody>
            <tr className="bg-gray-50">
              <td className="border border-gray-400 p-2 font-bold text-blue-900" colSpan="2">Employee:</td>
              <td className="border border-gray-400 p-2" colSpan="2"></td>
              <td className="border border-gray-400 p-2 font-bold text-blue-900">Employee #:</td>
              <td className="border border-gray-400 p-2"></td>
              <td className="border border-gray-400 p-2 font-bold text-blue-900">Date Prepared:</td>
              <td className="border border-gray-400 p-2"></td>
            </tr>
            <tr>
              <td className="border border-gray-400 p-2 font-bold text-blue-900" colSpan="2">Purpose of Trip:</td>
              <td className="border border-gray-400 p-2" colSpan="6"></td>
            </tr>
            <tr className="bg-gray-100 text-center font-bold text-blue-900">
              <td className="border border-gray-400 p-2" colSpan="2">Description</td>
              <td className="border border-gray-400 p-2">Ref No.</td>
              <td className="border border-gray-400 p-2" colSpan="4">Daily Breakout</td>
              <td className="border border-gray-400 p-2 text-right">Total Paid</td>
            </tr>
            {/* Lodging & M&IE Calculation Rows */}
            <tr>
              <td className="border border-gray-400 p-2 font-bold" colSpan="2">Per Diem: Lodging (Rate)</td>
              <td className="border border-gray-400 p-2 bg-blue-50 text-center font-bold">Input</td>
              <td className="border border-gray-400 p-2 text-right font-black" colSpan="5">$0.00</td>
            </tr>
            <tr>
              <td className="border border-gray-400 p-2 font-bold" colSpan="2">Per Diem: M&IE (Rate)</td>
              <td className="border border-gray-400 p-2 bg-blue-50 text-center font-bold">Input</td>
              <td className="border border-gray-400 p-2 text-right font-black" colSpan="5">$0.00</td>
            </tr>
            {/* Shaded Restriction Zone */}
            <tr className="bg-[#5C3317] text-white font-bold text-center">
              <td className="border border-gray-400 p-1" colSpan="8 italic">Please do not enter any values in the shaded boxes (Rows 18-20)</td>
            </tr>
            {/* Summary Totals */}
            <tr className="bg-gray-100 font-black text-blue-900">
              <td className="border border-gray-400 p-2 text-right uppercase" colSpan="7">Grand Total</td>
              <td className="border border-gray-400 p-2 text-right text-lg">${totalAmount.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
        <div className="mt-4 p-4 border-t-2 border-dashed flex justify-between items-end">
           <div className="text-[10px] text-gray-500 max-w-md">
             I certify this statement is accurate and prepared in accordance with FAR Section 31 cost principles and all unallowable costs have been identified.
           </div>
           <div className="text-right">
             <span className="block text-xs font-bold text-gray-400">AMOUNT DUE EMPLOYEE</span>
             <span className="text-2xl font-black text-blue-700">${totalAmount.toFixed(2)}</span>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- 3. Main TravelExpenses Component ---
const TravelExpenses = ({ 
  dataEntries, userName, userAvatar, handleLogout, 
  currentUserRole, currentUserId, onDataChanged, contractOptions = [] 
}) => {
  const [activeTab, setActiveTab] = useState('Airfare');
  const [showInstructions, setShowInstructions] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [isAdding, setIsAdding] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  const travelTabs = [
    { id: 'Airfare', icon: <Plane size={16}/> },
    { id: 'Hotel', icon: <Bed size={16}/> },
    { id: 'Meals', icon: <Utensils size={16}/> },
    { id: 'Rental', icon: <Car size={16}/> },
    { id: 'Report', icon: <FileText size={16}/> }
  ];

  const [formData, setFormData] = useState({
    contractShortName: '', projectName: '', subkName: '', travelType: 'Airfare',
    chargeAmount: '', chargeDate: '', status: 'Submitted', notes: '', pdfFilePath: ''
  });

  const resetForm = () => {
    setFormData({
      contractShortName: '', projectName: '', subkName: '', travelType: activeTab,
      chargeAmount: '', chargeDate: '', status: 'Submitted', notes: '', pdfFilePath: ''
    });
    setIsAdding(false);
    setEditingEntry(null);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
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
        body: JSON.stringify({ 
          ...formData, 
          category: 'Travel', 
          travelType: activeTab, 
          userId: currentUserId 
        }),
      });
      if (onDataChanged) onDataChanged();
      resetForm();
    } catch (err) { alert("Save error"); }
  };

  const filteredEntries = useMemo(() => 
    (dataEntries || []).filter(e => (e.travel_type || e.travelType) === activeTab),
    [dataEntries, activeTab]
  );

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-gray-800">
      <InstructionsModal isOpen={showInstructions} onClose={() => setShowInstructions(false)} />
      
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h1 className="text-2xl font-black text-orange-600 uppercase flex items-center gap-2 tracking-tighter">
            <Plane size={28}/> Travel Expenses
          </h1>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowInstructions(true)}
              className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm border border-blue-100"
            >
              <Info size={24} />
            </button>
            <button onClick={handleLogout} className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition">
              <LogOut size={20}/>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 mb-6 bg-gray-50 p-2 rounded-xl border border-orange-100">
          {travelTabs.map(tab => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setIsAdding(false); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-white text-orange-600 shadow-sm border border-orange-200' : 'text-gray-400 hover:text-gray-600'}`}>
              {tab.icon} {tab.id.toUpperCase()}
            </button>
          ))}
        </div>

        {activeTab === 'Report' ? (
          <TravelReportView entries={(dataEntries || []).filter(e => e.category === 'Travel')} />
        ) : (
          <>
            {/* Input Form */}
            {(isAdding || editingEntry) && (
              <div className="mb-8 p-6 border-2 border-orange-200 rounded-xl bg-orange-50 relative z-30 shadow-xl">
                <form onSubmit={handleSave} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div><label className="block text-xs font-bold mb-1">CONTRACT *</label>
                      <select id="contractShortName" className="w-full p-2 border rounded bg-white" value={formData.contractShortName} onChange={handleInputChange} required>
                        <option value="">Select Contract</option>
                        {contractOptions.map(opt => <option key={opt.id} value={opt.name}>{opt.name}</option>)}
                      </select>
                    </div>
                    <div><label className="block text-xs font-bold mb-1">PROJECT NAME *</label><input id="projectName" className="w-full p-2 border rounded" value={formData.projectName} onChange={handleInputChange} required /></div>
                    <div><label className="block text-xs font-bold mb-1 text-orange-700">TRAVELER NAME</label><input id="subkName" className="w-full p-2 border-orange-300 rounded" value={formData.subkName} onChange={handleInputChange} /></div>
                    <div><label className="block text-xs font-bold mb-1">AMOUNT *</label><input id="chargeAmount" type="number" step="0.01" className="w-full p-2 border rounded" value={formData.chargeAmount} onChange={handleInputChange} required /></div>
                    <div><label className="block text-xs font-bold mb-1">DATE *</label><input id="chargeDate" type="date" className="w-full p-2 border rounded" value={formData.chargeDate} onChange={handleInputChange} required /></div>
                    <div className="lg:col-span-3"><label className="block text-xs font-bold mb-1">PDF / RECEIPT PATH</label><input id="pdfFilePath" className="w-full p-2 border rounded" value={formData.pdfFilePath} onChange={handleInputChange} /></div>
                  </div>
                  <div className="flex justify-end gap-2">
                     <button type="button" onClick={resetForm} className="px-6 py-2 bg-gray-200 rounded font-bold text-xs uppercase">Cancel</button>
                     <button type="submit" className="bg-orange-600 text-white px-8 py-2 rounded font-bold shadow-lg flex items-center gap-2 uppercase text-xs"><Save size={16}/> Save {activeTab}</button>
                  </div>
                </form>
              </div>
            )}

            <button onClick={() => setIsAdding(true)} className="bg-orange-500 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold mb-6 shadow-md transition hover:bg-orange-600">
              <Plus size={20}/> ADD {activeTab.toUpperCase()} EXPENSE
            </button>

            <div className="overflow-x-auto border rounded-lg shadow-sm">
              <table className="min-w-full divide-y text-sm">
                <thead className="bg-gray-50 uppercase font-black text-gray-500 text-[10px]">
                  <tr>
                    <th className="px-6 py-3 text-left">Record No</th>
                    <th className="px-6 py-3 text-left">Traveler</th>
                    <th className="px-6 py-3 text-left">Project</th>
                    <th className="px-6 py-3 text-left">Amount</th>
                    <th className="px-6 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y">
                  {filteredEntries.map(entry => (
                    <tr key={entry.id} className="hover:bg-orange-50 transition-colors">
                      <td className="px-6 py-3 font-bold">{entry.prime_key || entry.primeKey}</td>
                      <td className="px-6 py-3">{entry.subk_name || entry.subkName}</td>
                      <td className="px-6 py-3 text-gray-500">{entry.project_name || entry.projectName}</td>
                      <td className="px-6 py-3 font-black text-orange-700">${parseFloat(entry.charge_amount || entry.chargeAmount || 0).toFixed(2)}</td>
                      <td className="px-6 py-3">
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-[10px] font-bold uppercase">{entry.status || 'Submitted'}</span>
                      </td>
                    </tr>
                  ))}
                  {filteredEntries.length === 0 && (
                    <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-400 italic">No {activeTab} expenses found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TravelExpenses;

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
  Save, Info, X, FileText, ChevronRight 
} from 'lucide-react';

const TravelExpenses = ({ 
  dataEntries, userName, userAvatar, handleLogout, 
  currentUserRole, currentUserId, onDataChanged, contractOptions = [] 
}) => {
  const [activeTab, setActiveTab] = useState('Airfare');
  const [showInstructions, setShowInstructions] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // --- Static Options for Dropdowns ---
  const employeeOptions = [
    { id: 'EMP001', name: 'Manas Lalwani' },
    { id: 'EMP002', name: 'Nilesh Peswani' },
    { id: 'EMP003', name: 'Abdul Shaikh' }
  ];

  const purposeOptions = ['Client Meeting', 'Site Visit', 'Conference', 'Relocation', 'Other'];

  // --- State for the Report Form ---
  const [formData, setFormData] = useState({
    employeeId: '',
    employeeName: '',
    purpose: '',
    travelFrom: '',
    travelTo: '',
    projectName: '',
    personalMiles: 0,
    mileageRate: 0.655,
    transportCost: 0,
    mealsPerDiem: 0,
    lodgingActual: 0,
    lodgingTaxes: 0,
    rentalTaxi: 0,
    parkingTolls: 0,
    otherSpecify: '',
    otherCost: 0,
    status: 'Draft'
  });

  const travelTabs = [
    { id: 'Airfare', icon: <Plane size={16}/> },
    { id: 'Hotel', icon: <Bed size={16}/> },
    { id: 'Meals', icon: <Utensils size={16}/> },
    { id: 'Rental', icon: <Car size={16}/> },
    { id: 'Report', icon: <FileText size={16}/> }
  ];

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleEmployeeChange = (e) => {
    const emp = employeeOptions.find(opt => opt.id === e.target.value);
    setFormData(prev => ({ ...prev, employeeId: e.target.value, employeeName: emp ? emp.name : '' }));
  };

  const calculateTotal = () => {
    const mileageTotal = parseFloat(formData.personalMiles || 0) * parseFloat(formData.mileageRate || 0);
    return (
      mileageTotal +
      parseFloat(formData.transportCost || 0) +
      parseFloat(formData.mealsPerDiem || 0) +
      parseFloat(formData.lodgingActual || 0) +
      parseFloat(formData.lodgingTaxes || 0) +
      parseFloat(formData.rentalTaxi || 0) +
      parseFloat(formData.parkingTolls || 0) +
      parseFloat(formData.otherCost || 0)
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-gray-800">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h1 className="text-2xl font-black text-orange-600 uppercase flex items-center gap-2">
            <Plane size={28}/> Travel Management
          </h1>
          <div className="flex items-center gap-3">
            <button onClick={handleLogout} className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition"><LogOut size={20}/></button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 mb-6 bg-gray-50 p-2 rounded-xl border border-orange-100">
          {travelTabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-white text-orange-600 shadow-sm border border-orange-200' : 'text-gray-400 hover:text-gray-600'}`}>
              {tab.icon} {tab.id.toUpperCase()}
            </button>
          ))}
        </div>

        {activeTab === 'Report' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* LEFT: INPUT FORM */}
            <div className="bg-gray-50 p-6 rounded-xl border space-y-4">
              <h2 className="font-bold text-blue-900 uppercase text-sm border-b pb-2">Entry Form</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500">EMPLOYEE</label>
                  <select id="employeeId" className="w-full p-2 border rounded bg-white text-sm" value={formData.employeeId} onChange={handleEmployeeChange}>
                    <option value="">Select Employee</option>
                    {employeeOptions.map(emp => <option key={emp.id} value={emp.id}>{emp.id} - {emp.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500">PURPOSE</label>
                  <select id="purpose" className="w-full p-2 border rounded bg-white text-sm" value={formData.purpose} onChange={handleInputChange}>
                    <option value="">Select Purpose</option>
                    {purposeOptions.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500">TRAVEL FROM</label>
                  <input id="travelFrom" type="date" className="w-full p-2 border rounded text-sm" value={formData.travelFrom} onChange={handleInputChange} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500">TRAVEL TO</label>
                  <input id="travelTo" type="date" className="w-full p-2 border rounded text-sm" value={formData.travelTo} onChange={handleInputChange} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                <div><label className="block text-[10px] font-bold text-gray-500">PROJECT NAME</label>
                  <select id="projectName" className="w-full p-2 border rounded bg-white text-sm" value={formData.projectName} onChange={handleInputChange}>
                    <option value="">Select Project</option>
                    {contractOptions.map(opt => <option key={opt.id} value={opt.name}>{opt.name}</option>)}
                  </select>
                </div>
                <div><label className="block text-[10px] font-bold text-gray-500">AUTO MILES</label><input id="personalMiles" type="number" className="w-full p-2 border rounded text-sm" value={formData.personalMiles} onChange={handleInputChange} /></div>
                <div><label className="block text-[10px] font-bold text-gray-500">TRANSPORT (AIR/TRAIN)</label><input id="transportCost" type="number" className="w-full p-2 border rounded text-sm" value={formData.transportCost} onChange={handleInputChange} /></div>
                <div><label className="block text-[10px] font-bold text-gray-500">M&IE PER DIEM</label><input id="mealsPerDiem" type="number" className="w-full p-2 border rounded text-sm" value={formData.mealsPerDiem} onChange={handleInputChange} /></div>
                <div><label className="block text-[10px] font-bold text-gray-500">LODGING (ACTUAL)</label><input id="lodgingActual" type="number" className="w-full p-2 border rounded text-sm" value={formData.lodgingActual} onChange={handleInputChange} /></div>
                <div><label className="block text-[10px] font-bold text-gray-500">LODGING TAXES</label><input id="lodgingTaxes" type="number" className="w-full p-2 border rounded text-sm" value={formData.lodgingTaxes} onChange={handleInputChange} /></div>
                <div><label className="block text-[10px] font-bold text-gray-500">CAR RENTAL / TAXIS</label><input id="rentalTaxi" type="number" className="w-full p-2 border rounded text-sm" value={formData.rentalTaxi} onChange={handleInputChange} /></div>
                <div><label className="block text-[10px] font-bold text-gray-500">PARKING / TOLLS</label><input id="parkingTolls" type="number" className="w-full p-2 border rounded text-sm" value={formData.parkingTolls} onChange={handleInputChange} /></div>
              </div>
              
              <div className="pt-2 border-t flex gap-2">
                <input id="otherSpecify" placeholder="Other (Specify)" className="flex-grow p-2 border rounded text-sm" value={formData.otherSpecify} onChange={handleInputChange} />
                <input id="otherCost" type="number" placeholder="Amount" className="w-32 p-2 border rounded text-sm" value={formData.otherCost} onChange={handleInputChange} />
              </div>

              <button className="w-full bg-blue-900 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-800 transition shadow-lg mt-4">
                <Save size={18}/> SUBMIT EXPENSE REPORT
              </button>
            </div>

            {/* RIGHT: LIVE PREVIEW (MATCHING IMAGE) */}
            <div className="border rounded-xl bg-white shadow-sm overflow-hidden text-[10px]">
              <div className="bg-[#0070C0] p-2 text-center text-white font-black uppercase tracking-widest">Travel Expense Statement</div>
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 border-b pb-2">
                  <div><span className="font-bold text-blue-900">Employee:</span> {formData.employeeName}</div>
                  <div><span className="font-bold text-blue-900">Project:</span> {formData.projectName}</div>
                </div>

                <table className="w-full border-collapse border border-gray-300">
                  <thead className="bg-gray-100 font-bold text-blue-900">
                    <tr>
                      <td className="border border-gray-300 p-1">Description</td>
                      <td className="border border-gray-300 p-1 text-right">Amount</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td className="border border-gray-300 p-1 italic">Mileage (0.655 c/m)</td><td className="border border-gray-300 p-1 text-right">${(formData.personalMiles * formData.mileageRate).toFixed(2)}</td></tr>
                    <tr><td className="border border-gray-300 p-1">Transport (Airline/Train)</td><td className="border border-gray-300 p-1 text-right">${parseFloat(formData.transportCost || 0).toFixed(2)}</td></tr>
                    <tr><td className="border border-gray-300 p-1">M&IE (Per Diem Only)</td><td className="border border-gray-300 p-1 text-right">${parseFloat(formData.mealsPerDiem || 0).toFixed(2)}</td></tr>
                    <tr><td className="border border-gray-300 p-1">Lodging (Actuals + Taxes)</td><td className="border border-gray-300 p-1 text-right">${(parseFloat(formData.lodgingActual || 0) + parseFloat(formData.lodgingTaxes || 0)).toFixed(2)}</td></tr>
                    <tr><td className="border border-gray-300 p-1">Car Rental, Taxis</td><td className="border border-gray-300 p-1 text-right">${parseFloat(formData.rentalTaxi || 0).toFixed(2)}</td></tr>
                    <tr><td className="border border-gray-300 p-1">Parking, Tolls</td><td className="border border-gray-300 p-1 text-right">${parseFloat(formData.parkingTolls || 0).toFixed(2)}</td></tr>
                    <tr><td className="border border-gray-300 p-1">{formData.otherSpecify || 'Other'}</td><td className="border border-gray-300 p-1 text-right">${parseFloat(formData.otherCost || 0).toFixed(2)}</td></tr>
                    <tr className="bg-blue-50 font-black text-blue-900 text-sm">
                      <td className="border border-gray-300 p-2 uppercase">Amount Due Employee</td>
                      <td className="border border-gray-300 p-2 text-right">${calculateTotal().toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-gray-400 italic text-center py-20">Select the Report tab to use the dynamic Expense Statement form.</div>
        )}
      </div>
    </div>
  );
};

export default TravelExpenses;
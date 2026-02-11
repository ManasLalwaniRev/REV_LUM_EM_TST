
// import React, { useState } from 'react';
// import { Pencil, Save, CheckCircle, LogOut, Printer, FileText } from 'lucide-react';

// const TravelExpenses = ({ contractOptions = [], userName, handleLogout, currentUserId, onDataChanged }) => {
//   // Dropdown Options
//   const employeeOptions = [
//     { id: 'EMP001', name: 'Manas Lalwani' },
//     { id: 'EMP002', name: 'Nilesh Peswani' },
//     { id: 'EMP003', name: 'Abdul Shaikh' }
//   ];
//   const purposeOptions = ['Client Meeting', 'Site Visit', 'Conference', 'Relocation', 'Internal Audit'];

//   const [formData, setFormData] = useState({
//     employeeName: '', employeeId: '', datePrepared: new Date().toISOString().split('T')[0],
//     purpose: '', travelFrom: '', travelTo: '', perDiemLodging: 0, perDiemMIE: 0,
//     projectName: '', personalMiles: 0, transportCost: 0, miePerDiem: 0,
//     lodgingActual: 0, lodgingTaxes: 0, rentalTaxi: 0, parkingTolls: 0,
//     otherSpecify: '', otherCost: 0, travelAdvance: 0
//   });

//   const handleInputChange = (e) => {
//     const { id, value } = e.target;
//     setFormData(prev => ({ ...prev, [id]: value }));
//   };

//   const handleEmployeeChange = (e) => {
//     const emp = employeeOptions.find(opt => opt.id === e.target.value);
//     setFormData(prev => ({ ...prev, employeeId: e.target.value, employeeName: emp ? emp.name : '' }));
//   };

//   const calculateTotal = () => {
//     const mileage = parseFloat(formData.personalMiles || 0) * 0.655;
//     const costs = [
//       formData.transportCost, formData.miePerDiem, formData.lodgingActual,
//       formData.lodgingTaxes, formData.rentalTaxi, formData.parkingTolls, formData.otherCost
//     ];
//     return mileage + costs.reduce((sum, val) => sum + parseFloat(val || 0), 0);
//   };

//   const totalExpenses = calculateTotal();
//   const amountDue = totalExpenses - parseFloat(formData.travelAdvance || 0);

//   const handleSave = async (e) => {
//     if (e) e.preventDefault();
    
//     const payload = {
//       ...formData,
//       category: 'Travel',
//       userId: currentUserId,
//       contractShortName: formData.projectName 
//     };

//     try {
//       const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/subk-travel/new`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });

//       if (response.ok) {
//         alert("Statement Saved Successfully!");
//         if (onDataChanged) onDataChanged();
//       }
//     } catch (err) {
//       alert("Error saving statement: " + err.message);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-100 p-4 text-slate-800 font-sans">
//       <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-40px)]">
        
//         {/* --- LEFT PANEL: DATA ENTRY --- */}
//         <div className="w-full lg:w-1/3 bg-white rounded-xl shadow-lg overflow-y-auto p-6 border-t-4 border-blue-600">
//           <div className="flex items-center justify-between mb-6 border-b pb-4">
//             <div className="flex items-center gap-3">
//               <Pencil className="text-blue-600" size={24}/>
//               <h2 className="text-xl font-black text-slate-800 uppercase">Expense Entry</h2>
//             </div>
//             <button onClick={handleLogout} className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition">
//                 <LogOut size={20}/>
//             </button>
//           </div>
          
//           <form onSubmit={handleSave} className="space-y-4">
//              <section className="space-y-2">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Header Information</label>
//                 <select id="employeeId" className="w-full p-2 border rounded-lg bg-slate-50 text-sm" value={formData.employeeId} onChange={handleEmployeeChange}>
//                   <option value="">Select Employee ID / Name</option>
//                   {employeeOptions.map(emp => <option key={emp.id} value={emp.id}>{emp.id} - {emp.name}</option>)}
//                 </select>
//                 <select id="purpose" className="w-full p-2 border rounded-lg bg-slate-50 text-sm" value={formData.purpose} onChange={handleInputChange}>
//                   <option value="">Select Purpose of Trip</option>
//                   {purposeOptions.map(p => <option key={p} value={p}>{p}</option>)}
//                 </select>
//                 <select id="projectName" className="w-full p-2 border rounded-lg bg-slate-50 text-sm" value={formData.projectName} onChange={handleInputChange}>
//                   <option value="">Select Project Name</option>
//                   {contractOptions.map(opt => <option key={opt.id} value={opt.name}>{opt.name}</option>)}
//                 </select>
//              </section>

//              <section className="space-y-2 pt-4 border-t">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Travel Period & Per Diems</label>
//                 <div className="grid grid-cols-2 gap-2">
//                    <div className="flex flex-col">
//                      <span className="text-[9px] font-bold text-slate-500 mb-1">TRAVEL FROM</span>
//                      <input id="travelFrom" type="date" className="p-2 border rounded text-sm w-full" value={formData.travelFrom} onChange={handleInputChange}/>
//                    </div>
//                    <div className="flex flex-col">
//                      <span className="text-[9px] font-bold text-slate-500 mb-1">TRAVEL TO</span>
//                      <input id="travelTo" type="date" className="p-2 border rounded text-sm w-full" value={formData.travelTo} onChange={handleInputChange}/>
//                    </div>
//                    <input id="perDiemLodging" type="number" placeholder="Per Diem: Lodging" className="p-2 border rounded text-sm" onChange={handleInputChange}/>
//                    <input id="perDiemMIE" type="number" placeholder="Per Diem: M&IE" className="p-2 border rounded text-sm" onChange={handleInputChange}/>
//                 </div>
//              </section>

//              <section className="space-y-2 pt-4 border-t">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expense Rows</label>
//                 <div className="grid grid-cols-2 gap-2">
//                    <input id="personalMiles" type="number" placeholder="Auto Miles" className="p-2 border rounded text-sm" onChange={handleInputChange}/>
//                    <input id="transportCost" type="number" placeholder="Transport (Air/Train)" className="p-2 border rounded text-sm" onChange={handleInputChange}/>
//                    <input id="miePerDiem" type="number" placeholder="M&IE (Per Diem Only)" className="p-2 border rounded text-sm" onChange={handleInputChange}/>
//                    <input id="lodgingActual" type="number" placeholder="Lodging Room" className="p-2 border rounded text-sm" onChange={handleInputChange}/>
//                    <input id="lodgingTaxes" type="number" placeholder="Lodging Taxes" className="p-2 border rounded text-sm" onChange={handleInputChange}/>
//                    <input id="rentalTaxi" type="number" placeholder="Rental/Taxis" className="p-2 border rounded text-sm" onChange={handleInputChange}/>
//                    <input id="parkingTolls" type="number" placeholder="Parking/Tolls" className="p-2 border rounded text-sm" onChange={handleInputChange}/>
//                    <input id="otherCost" type="number" placeholder="Other Cost" className="p-2 border rounded text-sm" onChange={handleInputChange}/>
//                    <input id="otherSpecify" placeholder="Specify Other" className="p-2 border rounded text-sm col-span-2" onChange={handleInputChange}/>
//                    <input id="travelAdvance" type="number" placeholder="Less Travel Advance" className="p-2 border rounded text-sm col-span-2" onChange={handleInputChange}/>
//                 </div>
//              </section>

//              <button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all mt-4">
//                <CheckCircle size={18}/> SAVE TO DATABASE
//              </button>
//           </form>
//         </div>

//         {/* --- RIGHT PANEL: STATEMENT REPLICATION --- */}
//         <div className="w-full lg:w-2/3 bg-white rounded-xl shadow-inner overflow-y-auto p-8 border border-slate-200">
//           <div className="max-w-5xl mx-auto border-[1px] border-slate-400 p-8 shadow-sm text-blue-900 bg-white">
            
//             <div className="text-center mb-6">
//               <h1 className="text-2xl font-black uppercase tracking-tight">Infotrend Inc Travel Expense Statement</h1>
//             </div>

//             {/* Header */}
//             <div className="grid grid-cols-4 gap-x-4 text-[11px] mb-4">
//               <div className="col-span-2 border-b border-slate-400 pb-1 flex gap-2">
//                 <span className="font-bold">Employee:</span> <span className="text-slate-800 uppercase">{formData.employeeName}</span>
//               </div>
//               <div className="border-b border-slate-400 pb-1 flex gap-2">
//                 <span className="font-bold">Employee #:</span> <span className="text-slate-800">{formData.employeeId}</span>
//               </div>
//               <div className="border-b border-slate-400 pb-1 flex gap-2">
//                 <span className="font-bold">Date Prepared :</span> <span className="text-slate-800">{formData.datePrepared}</span>
//               </div>
//               <div className="col-span-4 border-b border-slate-400 pb-1 flex gap-2 mt-2">
//                 <span className="font-bold">Purpose of Trip:</span> <span className="text-slate-800 uppercase">{formData.purpose}</span>
//               </div>
//             </div>

//             {/* Table */}
//             <table className="w-full border-collapse border border-slate-500 text-[10px]">
//               <tbody>
//                 <tr className="bg-blue-50/50 font-bold uppercase">
//                   <td className="border border-slate-500 p-1 w-1/4">Date</td>
//                   <td className="border border-slate-500 p-1" colSpan="6"></td>
//                   <td className="border border-slate-500 p-2 w-[250px] text-center" rowSpan="6">
//                     <div className="font-black border-b border-blue-200 mb-1 pb-1 text-blue-800 text-[11px]">Receipt Requirements:</div>
//                     <div className="font-normal normal-case leading-tight text-slate-500 text-[9px] mt-1">
//                       * Receipts are required for all items (excluding M&IE perdiems & mileage charges)
//                     </div>
//                     <div className="mt-2 font-normal normal-case leading-tight text-slate-500 text-[9px]">
//                       ** Receipts are required for full amount
//                     </div>
//                   </td>
//                 </tr>
//                 <tr><td className="border border-slate-500 p-1 font-bold">Travel From:</td><td className="border border-slate-500 p-1 font-bold text-slate-700" colSpan="6">{formData.travelFrom}</td></tr>
//                 <tr><td className="border border-slate-500 p-1 font-bold">Travel To:</td><td className="border border-slate-500 p-1 font-bold text-slate-700" colSpan="6">{formData.travelTo}</td></tr>
//                 <tr>
//                   <td className="border border-slate-500 p-1 font-bold text-blue-800">Per Diem: Lodging</td>
//                   <td className="border border-slate-500 p-1 text-center bg-slate-100 italic">Input</td>
//                   <td className="border border-slate-500 p-1 text-center font-bold" colSpan="5">{formData.perDiemLodging || 0}</td>
//                 </tr>
//                 <tr>
//                   <td className="border border-slate-500 p-1 font-bold text-blue-800">Per Diem: M&IE</td>
//                   <td className="border border-slate-500 p-1 text-center bg-slate-100 italic">Input</td>
//                   <td className="border border-slate-500 p-1 text-center font-bold" colSpan="5">{formData.perDiemMIE || 0}</td>
//                 </tr>
//                 <tr><td className="border border-slate-500 p-1 font-bold text-blue-900 uppercase">Project Name :</td><td className="border border-slate-500 p-1 font-bold uppercase text-slate-800" colSpan="6">{formData.projectName}</td></tr>

//                 {/* Main Table Column Names */}
//                 <tr className="bg-slate-100 text-[9px] font-black text-center uppercase tracking-tighter">
//                    <td className="border border-slate-500 p-1 text-left">Description</td>
//                    <td className="border border-slate-500 p-1">Ref. No</td>
//                    <td className="border border-slate-500 p-1" colSpan="5">Total Paid by Employee</td>
//                    <td className="border border-slate-500 p-1">Cost in Excess of FAR</td>
//                    <td className="border border-slate-500 p-1">Comments</td>
//                 </tr>

//                 {/* Expense Rows */}
//                 <tr>
//                   <td className="border border-slate-500 p-1">Personal Auto Miles</td>
//                   <td className="border border-slate-500 p-1"></td>
//                   <td className="border border-slate-500 p-1 text-right" colSpan="5">$ -</td>
//                   <td className="border border-slate-500 p-1"></td>
//                   <td className="border border-slate-500 p-1 text-center text-blue-600 italic">To / From Airport</td>
//                 </tr>
//                 <tr>
//                   <td className="border border-slate-500 p-1 font-bold">Mileage ( 0.655 cents / mile)</td>
//                   <td className="border border-slate-500 p-1"></td>
//                   <td className="border border-slate-500 p-1 text-right font-black text-slate-900" colSpan="5">${(formData.personalMiles * 0.655).toFixed(2)}</td>
//                   <td className="border border-slate-500 p-1"></td>
//                   <td className="border border-slate-500 p-1 text-center text-slate-400">No receipts are required</td>
//                 </tr>
//                 <tr>
//                   <td className="border border-slate-500 p-1 font-bold">Transport (Airline/Train) **</td>
//                   <td className="border border-slate-500 p-1"></td>
//                   <td className="border border-slate-500 p-1 text-right font-black text-slate-900" colSpan="5">${parseFloat(formData.transportCost || 0).toFixed(2)}</td>
//                   <td className="border border-slate-500 p-1"></td>
//                   <td className="border border-slate-500 p-1"></td>
//                 </tr>
//                 <tr>
//                   <td className="border border-slate-500 p-1 font-bold">M&IE (Per Diem only)</td>
//                   <td className="border border-slate-500 p-1"></td>
//                   <td className="border border-slate-500 p-1 text-right font-black text-slate-900" colSpan="5">${parseFloat(formData.miePerDiem || 0).toFixed(2)}</td>
//                   <td className="border border-slate-500 p-1"></td>
//                   <td className="border border-slate-500 p-1 text-center text-slate-400">No receipts are required</td>
//                 </tr>

//                 {/* ORANGE SHADED ROWS (MANDATORY) */}
//                 <tr className="bg-[#B87333]/30 text-slate-900 font-bold">
//                   <td className="border border-slate-500 p-1">Lodging room (actuals) **</td>
//                   <td className="border border-slate-500 p-1"></td>
//                   <td className="border border-slate-500 p-1 text-right" colSpan="5">${parseFloat(formData.lodgingActual || 0).toFixed(2)}</td>
//                   <td className="border border-slate-500 p-1"></td>
//                   <td className="border border-slate-500 p-1 text-center text-blue-800 uppercase text-[8px]">Allowable Expenses</td>
//                 </tr>
//                 <tr className="bg-[#B87333]/30 font-bold">
//                   <td className="border border-slate-500 p-1">Lodging taxes (actuals) **</td>
//                   <td className="border border-slate-500 p-1"></td>
//                   <td className="border border-slate-500 p-1 text-right" colSpan="5">${parseFloat(formData.lodgingTaxes || 0).toFixed(2)}</td>
//                   <td className="border border-slate-500 p-1"></td>
//                   <td className="border border-slate-500 p-1"></td>
//                 </tr>
//                 <tr className="bg-[#B87333]/30 text-[9px] font-black italic">
//                    <td className="border border-slate-500 p-2" colSpan="8">
//                      Please do not enter any values in the shaded boxes (Rows 18-20)
//                    </td>
//                    <td className="border border-slate-500 p-2 text-center text-blue-800 uppercase text-[8px]">Unallowable Expenses</td>
//                 </tr>

//                 {/* Other Rows */}
//                 <tr><td className="border border-slate-500 p-1">Car Rental, Taxis *</td><td className="border border-slate-500 p-1"></td><td className="border border-slate-500 p-1 text-right font-bold text-slate-900" colSpan="5">${parseFloat(formData.rentalTaxi || 0).toFixed(2)}</td><td className="border border-slate-500 p-1"></td><td className="border border-slate-500 p-1"></td></tr>
//                 <tr><td className="border border-slate-500 p-1">Parking, Tolls *</td><td className="border border-slate-500 p-1"></td><td className="border border-slate-500 p-1 text-right font-bold text-slate-900" colSpan="5">${parseFloat(formData.parkingTolls || 0).toFixed(2)}</td><td className="border border-slate-500 p-1"></td><td className="border border-slate-500 p-1"></td></tr>
//                 <tr><td className="border border-slate-500 p-1">Other ( {formData.otherSpecify || 'specify'} ) *</td><td className="border border-slate-500 p-1"></td><td className="border border-slate-500 p-1 text-right font-bold text-slate-900" colSpan="5">${parseFloat(formData.otherCost || 0).toFixed(2)}</td><td className="border border-slate-500 p-1"></td><td className="border border-slate-500 p-1"></td></tr>

//                 {/* Summary Section */}
//                 <tr className="bg-blue-600 text-white font-black text-xs">
//                   <td className="border border-slate-500 p-3 text-right uppercase tracking-wider" colSpan="7">Total Expenses Paid</td>
//                   <td className="border border-slate-500 p-3 text-right text-lg">${totalExpenses.toFixed(2)}</td>
//                   <td className="border border-slate-500 p-3"></td>
//                 </tr>
//               </tbody>
//             </table>

//             {/* Verification Footer */}
//             <div className="mt-4 text-[9px] text-slate-500 italic leading-tight border-b border-slate-200 pb-10 mb-4">
//               I certify this statement is accurate and prepared in accordance with FAR Section 31 cost principles and all unallowable costs have been identified on this report.
//             </div>

//             <div className="grid grid-cols-2 gap-10 text-[11px]">
//                <div className="space-y-6">
//                  <div className="border-b border-slate-400 pb-1 flex justify-between"><span>Employee Signature</span><span>Date</span></div>
//                  <div className="border-b border-slate-400 pb-1"><span>Supervisor Signature</span></div>
//                  <div className="pt-2 text-[9px] font-bold">Purpose of Trip (Required For Audit Allowability): <span className="font-normal border-b border-slate-200 ml-1">{formData.purpose}</span></div>
//                </div>
//                <div className="space-y-2 text-right">
//                   <div className="flex justify-between border-b border-slate-100 pb-1"><span>Total Expenses Paid</span><span className="font-bold">${totalExpenses.toFixed(2)}</span></div>
//                   <div className="flex justify-between border-b border-slate-100 pb-1 text-red-600"><span>Less Travel Advance</span><span className="font-bold">(${parseFloat(formData.travelAdvance || 0).toFixed(2)})</span></div>
//                   <div className="flex justify-between pt-2">
//                     <span className="font-black text-sm text-blue-700 uppercase">Amount Due Employee</span>
//                     <span className="text-2xl font-black text-slate-900">${amountDue.toFixed(2)}</span>
//                   </div>
//                </div>
//             </div>
//             <div className="mt-6 flex justify-between text-[8px] font-black text-gray-400">
//                <span>Page 1 of 2</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TravelExpenses;


import React, { useState, useMemo } from 'react';
import { Pencil, Save, CheckCircle, LogOut, Eye, EyeOff, Search } from 'lucide-react';

const TravelExpenses = ({ 
  dataEntries = [], contractOptions = [], userName, handleLogout, currentUserId, onDataChanged 
}) => {
  const [isPreviewOn, setIsPreviewOn] = useState(false);
  const [searchValue, setSearchValue] = useState('');

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

  // Filter records specifically for the Travel category
  const travelRecords = useMemo(() => {
    return (dataEntries || []).filter(e => 
      e.category === 'Travel' && 
      Object.values(e).some(val => String(val).toLowerCase().includes(searchValue.toLowerCase()))
    );
  }, [dataEntries, searchValue]);

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

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    const payload = { ...formData, category: 'Travel', userId: currentUserId, contractShortName: formData.projectName };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/subk-travel/new`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        alert("Statement Saved!");
        if (onDataChanged) onDataChanged();
      }
    } catch (err) { alert("Error: " + err.message); }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 text-slate-800 font-sans">
      {/* Top Header */}
      <div className="flex justify-between items-center mb-4 bg-white p-3 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3">
          <Pencil className="text-2xl font-black text-blue-900 uppercase flex items-center gap-2" size={20}/>
          <h2 className="text-lg text-blue-800 uppercase tracking-tighter">Travel Expense Management</h2>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsPreviewOn(!isPreviewOn)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isPreviewOn ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
            }`}
          >
            {isPreviewOn ? <EyeOff size={14}/> : <Eye size={14}/>}
            {isPreviewOn ? 'PREVIEW ON' : 'PREVIEW OFF'}
          </button>
          <button onClick={handleLogout} className="p-1.5 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition">
            <LogOut size={18}/>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 h-full">
        
        {/* --- LEFT PANEL: ENTRY & TABLE --- */}
        <div className={`${isPreviewOn ? 'lg:w-1/2' : 'lg:w-full'} space-y-4 transition-all duration-500`}>
          
          {/* Form Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-600">
            <form onSubmit={handleSave} className="space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <section className="space-y-2">
                      <select id="employeeId" className="w-full p-2 border rounded-lg bg-slate-50 text-sm" value={formData.employeeId} onChange={handleEmployeeChange}>
                        <option value="">Select Employee</option>
                        {employeeOptions.map(emp => <option key={emp.id} value={emp.id}>{emp.id} - {emp.name}</option>)}
                      </select>
                      <select id="projectName" className="w-full p-2 border rounded-lg bg-slate-50 text-sm" value={formData.projectName} onChange={handleInputChange}>
                        <option value="">Select Project</option>
                        {contractOptions.map(opt => <option key={opt.id} value={opt.name}>{opt.name}</option>)}
                      </select>
                  </section>
                  <section className="grid grid-cols-2 gap-2">
                     <input id="travelFrom" type="date" className="p-2 border rounded text-sm w-full" value={formData.travelFrom} onChange={handleInputChange}/>
                     <input id="travelTo" type="date" className="p-2 border rounded text-sm w-full" value={formData.travelTo} onChange={handleInputChange}/>
                  </section>
               </div>
               <button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 rounded-lg shadow-md flex items-center justify-center gap-2 transition-all">
                 <Save size={16}/> SAVE
               </button>
            </form>
          </div>

          {/* Records Table Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-black uppercase text-slate-500 tracking-widest">Saved Travel Records</h3>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 text-slate-400" size={14}/>
                <input 
                  type="text" 
                  placeholder="Search records..." 
                  className="pl-8 p-1.5 border rounded-lg text-xs w-48 outline-none focus:ring-1 focus:ring-blue-500"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
            </div>
            
            <div className="overflow-x-auto max-h-[300px]">
              <table className="min-w-full divide-y divide-slate-200 text-xs">
                <thead className="bg-slate-50 font-bold text-slate-500 uppercase">
                  <tr>
                    <th className="px-4 py-2 text-left">Record No</th>
                    <th className="px-4 py-2 text-left">Traveler</th>
                    <th className="px-4 py-2 text-left">Project</th>
                    <th className="px-4 py-2 text-right">Amount</th>
                    <th className="px-4 py-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {travelRecords.map((entry) => (
                    <tr key={entry.id} className="hover:bg-blue-50 transition-colors cursor-pointer">
                      <td className="px-4 py-2 font-bold text-blue-800">{entry.prime_key || entry.primeKey}</td>
                      <td className="px-4 py-2 font-medium">{entry.employee_name || entry.subk_name || entry.employeeName}</td>
                      <td className="px-4 py-2 text-slate-500">{entry.project_name || entry.projectName}</td>
                      <td className="px-4 py-2 text-right font-black text-slate-900">
                        ${parseFloat(entry.charge_amount || entry.chargeAmount || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold text-[10px] uppercase">
                          {entry.status || 'Submitted'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {travelRecords.length === 0 && (
                <div className="py-10 text-center text-slate-400 italic">No travel records found.</div>
              )}
            </div>
          </div>
        </div>

        {/* --- RIGHT PANEL: PREVIEW MODE --- */}
        {isPreviewOn && (
          <div className="w-full lg:w-1/2 bg-white rounded-xl shadow-inner overflow-y-auto p-6 border border-slate-200 transition-all duration-500">
            <div className="max-w-4xl mx-auto border-[1px] border-slate-400 p-6 text-blue-900 bg-white">
              <h1 className="text-center text-lg font-black uppercase mb-4 tracking-tighter">Infotrend Inc Travel Expense Statement</h1>
              {/* High-fidelity statement preview logic */}
              <div className="grid grid-cols-2 text-[10px] mb-4 border-b pb-2">
                <div><span className="font-bold">Employee:</span> {formData.employeeName}</div>
                <div className="text-right"><span className="font-bold">Date Prepared:</span> {formData.datePrepared}</div>
              </div>
              <table className="w-full border-collapse border border-slate-500 text-[9px]">
                <tbody>
                  <tr className="bg-[#B87333]/30 font-bold text-slate-900 italic">
                    <td className="border border-slate-500 p-2" colSpan="8">Please do not enter any values in the shaded boxes (Rows 18-20)</td>
                  </tr>
                  <tr className="bg-blue-600 text-white font-black">
                    <td className="border border-slate-500 p-2 text-right uppercase tracking-wider" colSpan="7">Amount Due Employee</td>
                    <td className="border border-slate-500 p-2 text-right text-base">${amountDue.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelExpenses;
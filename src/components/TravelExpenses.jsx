
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
import { Pencil, Save, LogOut, Eye, EyeOff, FileText, CheckCircle } from 'lucide-react';

const TravelExpenses = ({ 
  dataEntries = [], contractOptions = [], handleLogout, currentUserId, onDataChanged 
}) => {
  const [isPreviewOn, setIsPreviewOn] = useState(false);

  // Dropdown Options
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

  const totalExpenses = calculateTotal();
  const amountDue = totalExpenses - parseFloat(formData.travelAdvance || 0);

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
      {/* Header */}
      <div className="flex justify-between items-center mb-4 bg-white p-3 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3">
          <FileText className="text-blue-600" size={24}/>
          <h2 className="text-lg font-black uppercase tracking-tight text-blue-900">Travel Management System</h2>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsPreviewOn(!isPreviewOn)} 
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${isPreviewOn ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
          >
            {isPreviewOn ? <EyeOff size={14}/> : <Eye size={14}/>} {isPreviewOn ? 'PREVIEW ON' : 'PREVIEW OFF'}
          </button>
          <button onClick={handleLogout} className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100"><LogOut size={20}/></button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-120px)]">
        
        {/* --- LEFT PANEL: DATA ENTRY --- */}
        <div className={`${isPreviewOn ? 'lg:w-1/3' : 'lg:w-full max-w-5xl mx-auto'} bg-white rounded-xl shadow-lg overflow-y-auto p-6 border-t-4 border-blue-600 transition-all duration-300`}>
          <form onSubmit={handleSave} className="space-y-4">
             <section className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Employee & Project Details</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <select id="employeeId" className="p-2 border rounded-lg text-sm bg-slate-50" value={formData.employeeId} onChange={handleEmployeeChange}>
                    <option value="">Select Employee</option>
                    {employeeOptions.map(emp => <option key={emp.id} value={emp.id}>{emp.id} - {emp.name}</option>)}
                  </select>
                  <select id="purpose" className="p-2 border rounded-lg text-sm bg-slate-50" value={formData.purpose} onChange={handleInputChange}>
                    <option value="">Purpose of Trip</option>
                    {purposeOptions.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <select id="projectName" className="p-2 border rounded-lg text-sm bg-slate-50 col-span-2" value={formData.projectName} onChange={handleInputChange}>
                    <option value="">Select Project</option>
                    {contractOptions.map(opt => <option key={opt.id} value={opt.name}>{opt.name}</option>)}
                  </select>
                </div>
             </section>

             <section className="space-y-3 pt-4 border-t">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Timeline & Rates</label>
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-slate-500 uppercase">From</span>
                      <input id="travelFrom" type="date" className="w-full p-2 border rounded text-sm" value={formData.travelFrom} onChange={handleInputChange}/>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-slate-500 uppercase">To</span>
                      <input id="travelTo" type="date" className="w-full p-2 border rounded text-sm" value={formData.travelTo} onChange={handleInputChange}/>
                    </div>
                    <input id="perDiemLodging" type="number" placeholder="Per Diem: Lodging Rate" className="p-2 border rounded text-sm" onChange={handleInputChange}/>
                    <input id="perDiemMIE" type="number" placeholder="Per Diem: M&IE Rate" className="p-2 border rounded text-sm" onChange={handleInputChange}/>
                </div>
             </section>

             <section className="space-y-3 pt-4 border-t">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expense Entry</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <input id="personalMiles" type="number" placeholder="Auto Miles" className="p-2 border rounded text-sm" onChange={handleInputChange}/>
                  <input id="transportCost" type="number" placeholder="Transport Cost" className="p-2 border rounded text-sm" onChange={handleInputChange}/>
                  <input id="miePerDiem" type="number" placeholder="M&IE (Per Diem Only)" className="p-2 border rounded text-sm" onChange={handleInputChange}/>
                  <input id="lodgingActual" type="number" placeholder="Lodging Room" className="p-2 border rounded text-sm" onChange={handleInputChange}/>
                  <input id="lodgingTaxes" type="number" placeholder="Lodging Taxes" className="p-2 border rounded text-sm" onChange={handleInputChange}/>
                  <input id="rentalTaxi" type="number" placeholder="Rental/Taxis" className="p-2 border rounded text-sm" onChange={handleInputChange}/>
                  <input id="parkingTolls" type="number" placeholder="Parking/Tolls" className="p-2 border rounded text-sm" onChange={handleInputChange}/>
                  <input id="otherCost" type="number" placeholder="Other Amount" className="p-2 border rounded text-sm" onChange={handleInputChange}/>
                  <input id="travelAdvance" type="number" placeholder="Less Travel Advance" className="p-2 border rounded text-sm" onChange={handleInputChange}/>
                  <input id="otherSpecify" placeholder="Specify Other Expense" className="p-2 border rounded text-sm col-span-full" onChange={handleInputChange}/>
                </div>
             </section>

             <button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white font-black py-3 rounded-lg shadow-md flex items-center justify-center gap-2 uppercase tracking-tighter">
               <Save size={18}/> Save
             </button>
          </form>
        </div>

        {/* --- RIGHT PANEL: HIGH-FIDELITY PREVIEW --- */}
        {isPreviewOn && (
          <div className="w-full lg:w-2/3 bg-white rounded-xl shadow-inner overflow-y-auto p-8 border border-slate-200">
            <div className="max-w-5xl mx-auto border-[1px] border-black p-8 text-blue-900 bg-white">
              <h1 className="text-center text-2xl font-black uppercase mb-6 tracking-tight">Infotrend Inc Travel Expense Statement</h1>
              
              {/* Header Details */}
              <div className="grid grid-cols-4 gap-4 text-[11px] mb-4">
                <div className="col-span-2 border-b border-black pb-1 flex gap-2">
                  <strong>Employee:</strong> <span className="text-black uppercase">{formData.employeeName}</span>
                </div>
                <div className="border-b border-black pb-1 flex gap-2">
                  <strong>Employee #:</strong> <span className="text-black">{formData.employeeId}</span>
                </div>
                <div className="border-b border-black pb-1 flex gap-2">
                  <strong>Date Prepared:</strong> <span className="text-black">{formData.datePrepared}</span>
                </div>
                <div className="col-span-4 border-b border-black pb-1 pt-2 flex gap-2">
                  <strong>Purpose of Trip:</strong> <span className="text-black uppercase">{formData.purpose}</span>
                </div>
              </div>

              {/* Exact Design Table */}
              <table className="w-full border-collapse border-[1px] border-black text-[10px]">
                <tbody>
                  <tr className="bg-blue-50/50 font-bold uppercase">
                    <td className="border border-black p-1 w-1/4">Date</td>
                    <td className="border border-black p-1" colSpan="6"></td>
                    <td className="border border-black p-2 w-[280px] text-center align-top bg-white" rowSpan="6">
                      <div className="font-black border-b border-black mb-1 pb-1 text-blue-800 text-[11px]">Receipt Requirements:</div>
                      <div className="font-normal normal-case leading-tight text-slate-500 text-[9px]">
                        * Receipts are required for all items (excluding M&IE perdiems & mileage charges)
                      </div>
                      <div className="mt-2 font-normal normal-case leading-tight text-slate-500 text-[9px]">
                        ** Receipts are required for full amount
                      </div>
                    </td>
                  </tr>
                  <tr><td className="border border-black p-1 font-bold">Travel From:</td><td className="border border-black p-1 uppercase text-black" colSpan="6">{formData.travelFrom}</td></tr>
                  <tr><td className="border border-black p-1 font-bold">Travel To:</td><td className="border border-black p-1 uppercase text-black" colSpan="6">{formData.travelTo}</td></tr>
                  <tr>
                    <td className="border border-black p-1 font-bold">Per Diem: Lodging</td>
                    <td className="border border-black p-1 bg-slate-100 text-center italic">Input</td>
                    <td className="border border-black p-1 text-center font-bold text-black" colSpan="5">{formData.perDiemLodging || 0}</td>
                  </tr>
                  <tr>
                    <td className="border border-black p-1 font-bold">Per Diem: M&IE</td>
                    <td className="border border-black p-1 bg-slate-100 text-center italic">Input</td>
                    <td className="border border-black p-1 text-center font-bold text-black" colSpan="5">{formData.perDiemMIE || 0}</td>
                  </tr>
                  <tr><td className="border border-black p-1 font-bold uppercase tracking-tighter">Project Name :</td><td className="border border-black p-1 uppercase text-black font-bold" colSpan="6">{formData.projectName}</td></tr>

                  {/* Main Grid Headers */}
                  <tr className="bg-slate-100 font-black text-center uppercase text-[9px] tracking-tighter">
                    <td className="border border-black p-1 text-left">Description</td>
                    <td className="border border-black p-1">Ref No.</td>
                    <td className="border border-black p-1" colSpan="5">Total Paid by Employee</td>
                    <td className="border border-black p-1">Excess FAR</td>
                    <td className="border border-black p-1">Comments</td>
                  </tr>

                  {/* Field Mapping Rows */}
                  <tr><td className="border border-black p-1">Personal Auto Miles</td><td className="border border-black p-1" colSpan="6"></td><td className="border border-black p-1 text-right text-slate-400">$ -</td><td className="border border-black p-1"></td><td className="border border-black p-1 text-center text-blue-500 italic">Airport</td></tr>
                  <tr><td className="border border-black p-1 font-bold italic">Mileage ( 0.655 cents / mile)</td><td className="border border-black p-1" colSpan="6"></td><td className="border border-black p-1 text-right font-black text-black">${(formData.personalMiles * 0.655).toFixed(2)}</td><td className="border border-black p-1"></td><td className="border border-black p-1"></td></tr>
                  <tr><td className="border border-black p-1">Transport (Airline/Train) **</td><td className="border border-black p-1" colSpan="6"></td><td className="border border-black p-1 text-right font-bold text-black">${parseFloat(formData.transportCost || 0).toFixed(2)}</td><td className="border border-black p-1"></td><td className="border border-black p-1"></td></tr>
                  <tr><td className="border border-black p-1">M&IE (Per Diem only)</td><td className="border border-black p-1" colSpan="6"></td><td className="border border-black p-1 text-right font-bold text-black">${parseFloat(formData.miePerDiem || 0).toFixed(2)}</td><td className="border border-black p-1"></td><td className="border border-black p-1 italic text-blue-500">No Receipt</td></tr>
                  
                  {/* ORANGE SHADED RESTRICTION AREA */}
                  <tr className="bg-[#B87333]/30 text-slate-900 font-bold">
                    <td className="border border-black p-1">Lodging room (actuals) **</td><td className="border border-black p-1" colSpan="6"></td><td className="border border-black p-1 text-right font-black">${parseFloat(formData.lodgingActual || 0).toFixed(2)}</td><td className="border border-black p-1"></td><td className="border border-black p-1"></td>
                  </tr>
                  <tr className="bg-[#B87333]/30 font-bold">
                    <td className="border border-black p-1">Lodging taxes (actuals) **</td><td className="border border-black p-1" colSpan="6"></td><td className="border border-black p-1 text-right font-black">${parseFloat(formData.lodgingTaxes || 0).toFixed(2)}</td><td className="border border-black p-1"></td><td className="border border-black p-1"></td>
                  </tr>
                  <tr className="bg-[#B87333]/30 font-black italic text-[9px] uppercase tracking-tighter">
                    <td className="border border-black p-2" colSpan="8">Please do not enter any values in the shaded boxes (Rows 18-20)</td>
                    <td className="border border-black p-1 text-center text-blue-800">UNALLOWABLE</td>
                  </tr>

                  {/* Remaining Categories */}
                  <tr><td className="border border-black p-1">Car Rental, Taxis *</td><td className="border border-black p-1" colSpan="6"></td><td className="border border-black p-1 text-right font-bold text-black">${parseFloat(formData.rentalTaxi || 0).toFixed(2)}</td><td className="border border-black p-1"></td><td className="border border-black p-1"></td></tr>
                  <tr><td className="border border-black p-1">Parking, Tolls *</td><td className="border border-black p-1" colSpan="6"></td><td className="border border-black p-1 text-right font-bold text-black">${parseFloat(formData.parkingTolls || 0).toFixed(2)}</td><td className="border border-black p-1"></td><td className="border border-black p-1"></td></tr>
                  <tr><td className="border border-black p-1">Other ( {formData.otherSpecify || 'specify'} ) *</td><td className="border border-black p-1" colSpan="6"></td><td className="border border-black p-1 text-right font-bold text-black">${parseFloat(formData.otherCost || 0).toFixed(2)}</td><td className="border border-black p-1"></td><td className="border border-black p-1"></td></tr>

                  {/* Summary Footer */}
                  <tr className="bg-blue-700 text-white font-black text-xs uppercase tracking-widest">
                    <td className="border border-black p-3 text-right" colSpan="7">Total Expenses Paid</td>
                    <td className="border border-black p-3 text-right text-lg font-black">${totalExpenses.toFixed(2)}</td>
                    <td className="border border-black p-1"></td><td className="border border-black p-1"></td>
                  </tr>
                </tbody>
              </table>

              {/* Signature & Audit Section */}
              <div className="mt-6 grid grid-cols-2 gap-10 text-[10px]">
                 <div className="space-y-6">
                    <div className="border-b border-black pb-1 flex justify-between"><span>Employee Signature</span><span>Date</span></div>
                    <div className="border-b border-black pb-1 w-full"><span>Supervisor Signature</span></div>
                    <div className="italic text-[9px] pt-1 leading-tight text-slate-500">I certify this statement is accurate and prepared in accordance with FAR Section 31 principles.</div>
                 </div>
                 <div className="space-y-2 text-right">
                    <div className="flex justify-between border-b border-slate-200"><span>Total Expenses Paid</span><span className="font-bold">${totalExpenses.toFixed(2)}</span></div>
                    <div className="flex justify-between border-b border-slate-200"><span>Less Travel Advance</span><span className="font-bold">(${parseFloat(formData.travelAdvance || 0).toFixed(2)})</span></div>
                    <div className="flex justify-between pt-2 border-t-2 border-blue-600">
                       <span className="font-black text-blue-700 uppercase">Amount Due Employee</span>
                       <span className="text-2xl font-black text-black tracking-tighter">${amountDue.toFixed(2)}</span>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelExpenses;
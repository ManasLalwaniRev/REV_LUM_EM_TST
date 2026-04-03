

import React, { useState } from 'react';
import { Save, LogOut, Eye, EyeOff, Plus, Trash2, Briefcase, FileText, MapPin, Loader2, Utensils } from 'lucide-react';

const ExpenseManagementSystem = ({ 
  contractOptions = [], 
  handleLogout, 
  currentUserId, 
  onDataChanged 
}) => {
  const [activeTab, setActiveTab] = useState('travel'); // 'travel', 'misc', or 'meals'
  const [isPreviewOn, setIsPreviewOn] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // --- SHARED DATA ---
  const employeeOptions = [
    { id: 'EMP001', name: 'Manas Lalwani' },
    { id: 'EMP002', name: 'Nilesh Peswani' },
    { id: 'EMP003', name: 'Abdul Shaikh' }
  ];

  // ==========================================
  // 1. TRAVEL STATE
  // ==========================================
  const purposeOptions = ['Client Meeting', 'Site Visit', 'Conference', 'Relocation', 'Internal Audit'];
  const [travelForm, setTravelForm] = useState({
    employeeName: '', employeeId: '', datePrepared: new Date().toISOString().split('T')[0],
    purpose: '', travelFrom: '', travelTo: '', perDiemLodging: 0, perDiemMIE: 0,
    projectName: '', personalMiles: 0, transportCost: 0, miePerDiem: 0,
    lodgingActual: 0, lodgingTaxes: 0, rentalTaxi: 0, parkingTolls: 0,
    otherSpecify: '', otherCost: 0, travelAdvance: 0
  });

  const handleTravelChange = (e) => {
    const { id, value } = e.target;
    setTravelForm(prev => ({ ...prev, [id]: value }));
  };
  const handleTravelEmployeeChange = (e) => {
    const emp = employeeOptions.find(opt => opt.id === e.target.value);
    setTravelForm(prev => ({ ...prev, employeeId: e.target.value, employeeName: emp ? emp.name : '' }));
  };
  const calculateTravelTotal = () => {
    const mileage = parseFloat(travelForm.personalMiles || 0) * 0.655;
    const costs = [
      travelForm.transportCost, travelForm.miePerDiem, travelForm.lodgingActual,
      travelForm.lodgingTaxes, travelForm.rentalTaxi, travelForm.parkingTolls, travelForm.otherCost
    ];
    return mileage + costs.reduce((sum, val) => sum + parseFloat(val || 0), 0);
  };
  const travelTotal = calculateTravelTotal();
  const travelDue = travelTotal - parseFloat(travelForm.travelAdvance || 0);

  // ==========================================
  // 2. MISC STATE
  // ==========================================
  const [miscForm, setMiscForm] = useState({
    employeeName: '', officeLocation: '',
    items: [{ date: '', description: '', vendor: '', purpose: '', amount: '' }]
  });
  const handleMiscHeaderChange = (e) => setMiscForm(prev => ({ ...prev, [e.target.id]: e.target.value }));
  const handleMiscEmployeeChange = (e) => setMiscForm(prev => ({ ...prev, employeeName: e.target.value }));
  const handleMiscItemChange = (index, field, value) => {
    const newItems = [...miscForm.items];
    newItems[index][field] = value;
    setMiscForm(prev => ({ ...prev, items: newItems }));
  };
  const addMiscRow = () => setMiscForm(prev => ({ ...prev, items: [...prev.items, { date: '', description: '', vendor: '', purpose: '', amount: '' }] }));
  const removeMiscRow = (index) => {
    if (miscForm.items.length > 1) {
      setMiscForm(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
    }
  };
  const miscTotal = miscForm.items.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);

  // ==========================================
  // 3. BUSINESS MEALS STATE
  // ==========================================
  const [mealsForm, setMealsForm] = useState({
    employeeName: '',
    items: [{ date: '', purpose: '', location: '', attendees: '', totalExpense: '', unallowable: '' }]
  });
  const handleMealsEmployeeChange = (e) => setMealsForm(prev => ({ ...prev, employeeName: e.target.value }));
  const handleMealsItemChange = (index, field, value) => {
    const newItems = [...mealsForm.items];
    newItems[index][field] = value;
    setMealsForm(prev => ({ ...prev, items: newItems }));
  };
  const addMealsRow = () => setMealsForm(prev => ({ ...prev, items: [...prev.items, { date: '', purpose: '', location: '', attendees: '', totalExpense: '', unallowable: '' }] }));
  const removeMealsRow = (index) => {
    if (mealsForm.items.length > 1) {
      setMealsForm(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
    }
  };
  const mealsTotalExpense = mealsForm.items.reduce((sum, item) => sum + parseFloat(item.totalExpense || 0), 0);
  const mealsTotalUnallowable = mealsForm.items.reduce((sum, item) => sum + parseFloat(item.unallowable || 0), 0);
  const mealsTotalAllowable = mealsTotalExpense - mealsTotalUnallowable;

  // ==========================================
  // GLOBAL SAVE
  // ==========================================
  const handleSave = async (e) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);

    let payload = {};
    let endpoint = '';
    const API_BASE = import.meta.env.VITE_API_BASE_URL;

    if (activeTab === 'travel') {
       payload = { ...travelForm, contractShortName: travelForm.projectName, category: 'Travel', userId: currentUserId };
       endpoint = `${API_BASE}/subk-travel/new`;
    } else if (activeTab === 'misc') {
       payload = { employeeName: miscForm.employeeName, officeLocation: miscForm.officeLocation, items: miscForm.items, userId: currentUserId };
       endpoint = `${API_BASE}/misc-expenses/new`;
    } else if (activeTab === 'meals') {
       payload = { employeeName: mealsForm.employeeName, items: mealsForm.items, userId: currentUserId };
       endpoint = `${API_BASE}/business-meals/new`;
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Report Saved! \nRecord ID: ${data.prime_key}`);
        if (onDataChanged) onDataChanged();
        window.location.reload();
      } else {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to save');
      }
    } catch (err) {
      console.error("Save Error:", err);
      alert("Error: " + err.message);
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 text-slate-800 font-sans">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 bg-white p-3 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-4 w-full md:w-auto">
           <h1 className="text-lg font-black tracking-tight text-blue-900 hidden md:block ">Expense System</h1>
           <div className="flex bg-slate-100 p-1 rounded-lg w-full md:w-auto justify-center md:justify-start">
              <button onClick={() => setActiveTab('travel')} className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-md text-xs font-black tracking-wider transition-all ${activeTab === 'travel' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}><Briefcase size={14}/> Travel</button>
              <button onClick={() => setActiveTab('misc')} className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-md text-xs font-black tracking-wider transition-all ${activeTab === 'misc' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}><FileText size={14}/> Misc</button>
              <button onClick={() => setActiveTab('meals')} className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-md text-xs font-black tracking-wider transition-all ${activeTab === 'meals' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}><Utensils size={14}/> Meals</button>
           </div>
        </div>
        <div className="flex items-center gap-2 mt-3 md:mt-0 w-full md:w-auto justify-end">
          <button onClick={() => setIsPreviewOn(!isPreviewOn)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${isPreviewOn ? 'bg-yellow-600 text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}>{isPreviewOn ? <EyeOff size={14}/> : <Eye size={14}/>} {isPreviewOn ? 'Hide Preview' : 'Show Preview'}</button>
          <button onClick={handleLogout} className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100"><LogOut size={20}/></button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-140px)]">
        
        {/* --- LEFT PANEL: FORMS --- */}
        <div className={`${isPreviewOn ? 'lg:w-1/3' : 'lg:w-full max-w-5xl mx-auto'} bg-white rounded-xl shadow-lg overflow-y-auto p-6 border-t-4 border-blue-600 transition-all duration-300`}>
          <form onSubmit={handleSave} className="space-y-6">
            
            {/* 1. TRAVEL FORM */}
            {activeTab === 'travel' && (
              <>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b"><Briefcase className="text-blue-600" size={18} /><h2 className="font-black text-slate-700  tracking-wide text-sm">Travel Details</h2></div>
                <section className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400  tracking-widest">Employee & Project</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <select id="employeeId" className="p-2 border rounded-lg text-sm bg-slate-50" value={travelForm.employeeId} onChange={handleTravelEmployeeChange}>
                      <option value="">Select Employee</option>
                      {employeeOptions.map(emp => <option key={emp.id} value={emp.id}>{emp.id} - {emp.name}</option>)}
                    </select>
                    <select id="purpose" className="p-2 border rounded-lg text-sm bg-slate-50" value={travelForm.purpose} onChange={handleTravelChange}>
                      <option value="">Purpose of Trip</option>
                      {purposeOptions.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <select id="projectName" className="p-2 border rounded-lg text-sm bg-slate-50 col-span-2" value={travelForm.projectName} onChange={handleTravelChange}>
                      <option value="">Select Project</option>
                      {contractOptions.map(opt => <option key={opt.id} value={opt.name}>{opt.name}</option>)}
                    </select>
                  </div>
                </section>
                <section className="space-y-3 pt-4 border-t border-slate-100">
                    <label className="text-[10px] font-black text-slate-400 tracking-widest">Timeline & Rates</label>
                    <div className="grid grid-cols-2 gap-3">
                        <input id="travelFrom" type="date" className="p-2 border rounded text-sm" value={travelForm.travelFrom} onChange={handleTravelChange}/>
                        <input id="travelTo" type="date" className="p-2 border rounded text-sm" value={travelForm.travelTo} onChange={handleTravelChange}/>
                        <input id="perDiemLodging" type="number" placeholder="Per Diem: Lodging" className="p-2 border rounded text-sm" onChange={handleTravelChange}/>
                        <input id="perDiemMIE" type="number" placeholder="Per Diem: M&IE" className="p-2 border rounded text-sm" onChange={handleTravelChange}/>
                    </div>
                </section>
                <section className="space-y-3 pt-4 border-t border-slate-100">
                  <label className="text-[10px] font-black text-slate-400 tracking-widest">Expenses</label>
                  <div className="grid grid-cols-2 gap-3">
                    <input id="personalMiles" type="number" placeholder="Auto Miles" className="p-2 border rounded text-sm" onChange={handleTravelChange}/>
                    <input id="transportCost" type="number" placeholder="Transport Cost" className="p-2 border rounded text-sm" onChange={handleTravelChange}/>
                    <input id="miePerDiem" type="number" placeholder="M&IE (Per Diem)" className="p-2 border rounded text-sm" onChange={handleTravelChange}/>
                    <input id="lodgingActual" type="number" placeholder="Lodging Room" className="p-2 border rounded text-sm" onChange={handleTravelChange}/>
                    <input id="lodgingTaxes" type="number" placeholder="Lodging Taxes" className="p-2 border rounded text-sm" onChange={handleTravelChange}/>
                    <input id="rentalTaxi" type="number" placeholder="Rental/Taxis" className="p-2 border rounded text-sm" onChange={handleTravelChange}/>
                    <input id="parkingTolls" type="number" placeholder="Parking/Tolls" className="p-2 border rounded text-sm" onChange={handleTravelChange}/>
                    <input id="otherCost" type="number" placeholder="Other Amount" className="p-2 border rounded text-sm" onChange={handleTravelChange}/>
                    <input id="travelAdvance" type="number" placeholder="Less Advance" className="p-2 border rounded text-sm" onChange={handleTravelChange}/>
                    <input id="otherSpecify" placeholder="Specify Other" className="p-2 border rounded text-sm col-span-full" onChange={handleTravelChange}/>
                  </div>
                </section>
              </>
            )}

            {/* 2. MISC FORM */}
            {activeTab === 'misc' && (
              <>
                 <div className="flex items-center gap-2 mb-4 pb-2 border-b"><FileText className="text-blue-600" size={18} /><h2 className="font-black text-slate-700 tracking-wide text-sm">Misc Report Details</h2></div>
                 <section className="space-y-3">
                  <label className="text-[15px] font-black text-slate-400  tracking-widest">Header Information</label>
                  <div className="grid grid-cols-1 gap-3">
                    <select id="employeeName" className="p-2 border rounded-lg text-sm bg-slate-50" value={miscForm.employeeName} onChange={handleMiscEmployeeChange}>
                      <option value="">Select Employee</option>
                      {employeeOptions.map(emp => <option key={emp.id} value={emp.name}>{emp.name}</option>)}
                    </select>
                    <input id="officeLocation" placeholder="Office Location" className="w-full p-2 border rounded text-sm" value={miscForm.officeLocation} onChange={handleMiscHeaderChange}/>
                  </div>
                 </section>
                 <section className="space-y-3 pt-4 border-t border-slate-100">
                    <div className="flex justify-between items-center">
                       <label className="text-[15px] font-black text-slate-400  tracking-widest">Itemized Expenses</label>
                       <button type="button" onClick={addMiscRow} className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full hover:bg-blue-100 font-bold flex gap-1 items-center"><Plus size={12}/> Add Item</button>
                    </div>
                    <div className="space-y-3">
                      {miscForm.items.map((item, index) => (
                        <div key={index} className="bg-slate-50 p-4 rounded-lg border border-slate-200 relative">
                           <div className="grid grid-cols-12 gap-2 mb-2">
                              <div className="col-span-7"><input type="date" className="w-full p-1 border rounded text-xs bg-white" value={item.date} onChange={(e) => handleMiscItemChange(index, 'date', e.target.value)} /></div>
                              <div className="col-span-5"><input type="number" placeholder="Amount" className="w-full p-1 border rounded text-xs font-bold text-right bg-white" value={item.amount} onChange={(e) => handleMiscItemChange(index, 'amount', e.target.value)} /></div>
                           </div>
                           <input placeholder="Item Description" className="w-full p-1.5 border rounded text-xs bg-white mb-2" value={item.description} onChange={(e) => handleMiscItemChange(index, 'description', e.target.value)} />
                           <div className="grid grid-cols-2 gap-2">
                              <input placeholder="Vendor Name" className="w-full p-1.5 border rounded text-xs bg-white" value={item.vendor} onChange={(e) => handleMiscItemChange(index, 'vendor', e.target.value)} />
                              <input placeholder="Purpose" className="w-full p-1.5 border rounded text-xs bg-white" value={item.purpose} onChange={(e) => handleMiscItemChange(index, 'purpose', e.target.value)} />
                           </div>
                           {miscForm.items.length > 1 && <button type="button" onClick={() => removeMiscRow(index)} className="absolute -top-2 -right-2 bg-red-100 text-red-500 p-1 rounded-full"><Trash2 size={12}/></button>}
                        </div>
                      ))}
                    </div>
                 </section>
              </>
            )}

            {/* 3. BUSINESS MEALS FORM */}
            {activeTab === 'meals' && (
              <>
                 <div className="flex items-center gap-2 mb-4 pb-2 border-b"><Utensils className="text-blue-600" size={18} /><h2 className="font-black text-slate-700  tracking-wide text-sm">Business Meals Details</h2></div>
                 <section className="space-y-3">
                  <label className="text-[15px] font-black text-slate-400  tracking-widest">Employee Information</label>
                  <select id="employeeName" className="w-full p-2 border rounded-lg text-sm bg-slate-50" value={mealsForm.employeeName} onChange={handleMealsEmployeeChange}>
                      <option value="">Select Employee</option>
                      {employeeOptions.map(emp => <option key={emp.id} value={emp.name}>{emp.name}</option>)}
                  </select>
                 </section>
                 <section className="space-y-3 pt-4 border-t border-slate-100">
                    <div className="flex justify-between items-center">
                       <label className="text-[15px] font-black text-slate-400 tracking-widest">Meal Entries</label>
                       <button type="button" onClick={addMealsRow} className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full hover:bg-blue-100 font-bold flex gap-1 items-center"><Plus size={12}/> Add Meal</button>
                    </div>
                    <div className="space-y-3">
                      {mealsForm.items.map((item, index) => (
                        <div key={index} className="bg-slate-50 p-4 rounded-lg border border-slate-200 relative">
                           <div className="grid grid-cols-2 gap-2 mb-2">
                              <input type="date" className="w-full p-1 border rounded text-xs bg-white" value={item.date} onChange={(e) => handleMealsItemChange(index, 'date', e.target.value)} />
                              <input placeholder="Location / Place" className="w-full p-1 border rounded text-xs bg-white" value={item.location} onChange={(e) => handleMealsItemChange(index, 'location', e.target.value)} />
                           </div>
                           <input placeholder="Business Purpose / Technical" className="w-full p-1.5 border rounded text-xs bg-white mb-2" value={item.purpose} onChange={(e) => handleMealsItemChange(index, 'purpose', e.target.value)} />
                           <textarea placeholder="List of Attendees" className="w-full p-1.5 border rounded text-xs bg-white mb-2 h-16" value={item.attendees} onChange={(e) => handleMealsItemChange(index, 'attendees', e.target.value)} />
                           
                           <div className="grid grid-cols-2 gap-2 bg-yellow-50 p-2 rounded border border-yellow-200">
                              <div>
                                <span className="text-[9px] font-bold text-slate-500">Total Expense</span>
                                <input type="number" className="w-full p-1 border rounded text-xs font-bold" value={item.totalExpense} onChange={(e) => handleMealsItemChange(index, 'totalExpense', e.target.value)} />
                              </div>
                              <div>
                                <span className="text-[9px] font-bold text-red-500">Alcohol / Unallowable</span>
                                <input type="number" className="w-full p-1 border rounded text-xs font-bold text-red-600" value={item.unallowable} onChange={(e) => handleMealsItemChange(index, 'unallowable', e.target.value)} />
                              </div>
                           </div>
                           {mealsForm.items.length > 1 && <button type="button" onClick={() => removeMealsRow(index)} className="absolute -top-2 -right-2 bg-red-100 text-red-500 p-1 rounded-full"><Trash2 size={12}/></button>}
                        </div>
                      ))}
                    </div>
                 </section>
              </>
            )}

            <button type="submit" disabled={isSaving} className={`w-full text-white font-black py-4 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2  tracking-tighter text-sm mt-6 ${isSaving ? 'bg-slate-400 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600'}`}>
              {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18}/>} 
              {isSaving ? 'Saving...' : `Save Report`}
            </button>
          </form>
        </div>

        {/* --- RIGHT PANEL: PREVIEWS --- */}
        {isPreviewOn && (
          <div className="w-full lg:w-2/3 bg-white rounded-xl shadow-inner overflow-y-auto p-8 border border-slate-200">
            
            {/* TRAVEL PREVIEW */}
            {activeTab === 'travel' && (
              <div className="max-w-5xl mx-auto border-[1px] border-black p-8 text-blue-900 bg-white shadow-2xl">
                 {/* ... (Kept existing Travel Preview) ... */}
                 <h1 className="text-center text-2xl font-black uppercase mb-6 tracking-tight">Infotrend Inc Travel Expense Statement</h1>
                 {/* (Rest of Travel Preview Code from previous step) */}
                 <div className="grid grid-cols-4 gap-4 text-[11px] mb-4">
                  <div className="col-span-2 border-b border-black pb-1 flex gap-2"><strong>Employee:</strong> <span className="text-black uppercase">{travelForm.employeeName}</span></div>
                  <div className="border-b border-black pb-1 flex gap-2"><strong>Employee #:</strong> <span className="text-black">{travelForm.employeeId}</span></div>
                  <div className="border-b border-black pb-1 flex gap-2"><strong>Date Prepared:</strong> <span className="text-black">{travelForm.datePrepared}</span></div>
                  <div className="col-span-4 border-b border-black pb-1 pt-2 flex gap-2"><strong>Purpose of Trip:</strong> <span className="text-black uppercase">{travelForm.purpose}</span></div>
                </div>
                <table className="w-full border-collapse border-[1px] border-black text-[10px]">
                  <tbody>
                    <tr className="bg-blue-50/50 font-bold uppercase">
                      <td className="border border-black p-1 w-1/4">Date</td>
                      <td className="border border-black p-1" colSpan="6"></td>
                      <td className="border border-black p-2 w-[280px] text-center align-top bg-white" rowSpan="6">
                        <div className="font-black border-b border-black mb-1 pb-1 text-blue-800 text-[11px]">Receipt Requirements:</div>
                        <div className="font-normal normal-case leading-tight text-slate-500 text-[9px] mt-1">* Receipts are required for all items (excluding M&IE perdiems & mileage)</div>
                      </td>
                    </tr>
                    <tr><td className="border border-black p-1 font-bold">Travel From:</td><td className="border border-black p-1 uppercase text-black" colSpan="6">{travelForm.travelFrom}</td></tr>
                    <tr><td className="border border-black p-1 font-bold">Travel To:</td><td className="border border-black p-1 uppercase text-black" colSpan="6">{travelForm.travelTo}</td></tr>
                    <tr><td className="border border-black p-1 font-bold">Per Diem: Lodging</td><td className="border border-black p-1 bg-slate-100 text-center italic">Input</td><td className="border border-black p-1 text-center font-bold text-black" colSpan="5">{travelForm.perDiemLodging || 0}</td></tr>
                    <tr><td className="border border-black p-1 font-bold">Per Diem: M&IE</td><td className="border border-black p-1 bg-slate-100 text-center italic">Input</td><td className="border border-black p-1 text-center font-bold text-black" colSpan="5">{travelForm.perDiemMIE || 0}</td></tr>
                    <tr><td className="border border-black p-1 font-bold uppercase tracking-tighter">Project Name :</td><td className="border border-black p-1 uppercase text-black font-bold" colSpan="6">{travelForm.projectName}</td></tr>
                    <tr className="bg-slate-100 font-black text-center uppercase text-[9px] tracking-tighter"><td className="border border-black p-1 text-left">Description</td><td className="border border-black p-1">Ref No.</td><td className="border border-black p-1" colSpan="5">Total Paid by Employee</td><td className="border border-black p-1">Excess FAR</td><td className="border border-black p-1">Comments</td></tr>
                    <tr><td className="border border-black p-1">Personal Auto Miles</td><td className="border border-black p-1" colSpan="6"></td><td className="border border-black p-1 text-right text-slate-400">$ -</td><td className="border border-black p-1"></td><td className="border border-black p-1 text-center text-blue-500 italic">Airport</td></tr>
                    <tr><td className="border border-black p-1 font-bold italic">Mileage ( 0.655 cents / mile)</td><td className="border border-black p-1" colSpan="6"></td><td className="border border-black p-1 text-right font-black text-black">${(travelForm.personalMiles * 0.655).toFixed(2)}</td><td className="border border-black p-1"></td><td className="border border-black p-1"></td></tr>
                    <tr><td className="border border-black p-1">Transport (Airline/Train) **</td><td className="border border-black p-1" colSpan="6"></td><td className="border border-black p-1 text-right font-bold text-black">${parseFloat(travelForm.transportCost || 0).toFixed(2)}</td><td className="border border-black p-1"></td><td className="border border-black p-1"></td></tr>
                    <tr><td className="border border-black p-1">M&IE (Per Diem only)</td><td className="border border-black p-1" colSpan="6"></td><td className="border border-black p-1 text-right font-bold text-black">${parseFloat(travelForm.miePerDiem || 0).toFixed(2)}</td><td className="border border-black p-1"></td><td className="border border-black p-1 italic text-blue-500">No Receipt</td></tr>
                    <tr className="bg-[#B87333]/30 text-slate-900 font-bold"><td className="border border-black p-1">Lodging room (actuals) **</td><td className="border border-black p-1" colSpan="6"></td><td className="border border-black p-1 text-right font-black">${parseFloat(travelForm.lodgingActual || 0).toFixed(2)}</td><td className="border border-black p-1"></td><td className="border border-black p-1"></td></tr>
                    <tr className="bg-[#B87333]/30 font-bold"><td className="border border-black p-1">Lodging taxes (actuals) **</td><td className="border border-black p-1" colSpan="6"></td><td className="border border-black p-1 text-right font-black">${parseFloat(travelForm.lodgingTaxes || 0).toFixed(2)}</td><td className="border border-black p-1"></td><td className="border border-black p-1"></td></tr>
                    <tr className="bg-[#B87333]/30 font-black italic text-[9px] uppercase tracking-tighter"><td className="border border-black p-2" colSpan="8">Please do not enter any values in the shaded boxes</td><td className="border border-black p-1 text-center text-blue-800">UNALLOWABLE</td></tr>
                    <tr><td className="border border-black p-1">Car Rental, Taxis *</td><td className="border border-black p-1" colSpan="6"></td><td className="border border-black p-1 text-right font-bold text-black">${parseFloat(travelForm.rentalTaxi || 0).toFixed(2)}</td><td className="border border-black p-1"></td><td className="border border-black p-1"></td></tr>
                    <tr><td className="border border-black p-1">Parking, Tolls *</td><td className="border border-black p-1" colSpan="6"></td><td className="border border-black p-1 text-right font-bold text-black">${parseFloat(travelForm.parkingTolls || 0).toFixed(2)}</td><td className="border border-black p-1"></td><td className="border border-black p-1"></td></tr>
                    <tr><td className="border border-black p-1">Other ( {travelForm.otherSpecify || 'specify'} ) *</td><td className="border border-black p-1" colSpan="6"></td><td className="border border-black p-1 text-right font-bold text-black">${parseFloat(travelForm.otherCost || 0).toFixed(2)}</td><td className="border border-black p-1"></td><td className="border border-black p-1"></td></tr>
                    <tr className="bg-blue-700 text-white font-black text-xs uppercase tracking-widest">
                      <td className="border border-black p-3 text-right" colSpan="7">Total Expenses Paid</td>
                      <td className="border border-black p-3 text-right text-lg font-black">${travelTotal.toFixed(2)}</td>
                      <td className="border border-black p-1"></td><td className="border border-black p-1"></td>
                    </tr>
                  </tbody>
                </table>
                 <div className="mt-6 grid grid-cols-2 gap-10 text-[10px]">
                   <div className="space-y-6">
                      <div className="border-b border-black pb-1 flex justify-between"><span>Employee Signature</span><span>Date</span></div>
                      <div className="border-b border-black pb-1 w-full"><span>Supervisor Signature</span></div>
                      <div className="italic text-[9px] pt-1 leading-tight text-slate-500">I certify this statement is accurate and prepared in accordance with FAR Section 31 principles.</div>
                   </div>
                   <div className="space-y-2 text-right">
                      <div className="flex justify-between border-b border-slate-200"><span>Total Expenses Paid</span><span className="font-bold">${travelTotal.toFixed(2)}</span></div>
                      <div className="flex justify-between border-b border-slate-200"><span>Less Travel Advance</span><span className="font-bold">(${parseFloat(travelForm.travelAdvance || 0).toFixed(2)})</span></div>
                      <div className="flex justify-between pt-2 border-t-2 border-blue-600">
                         <span className="font-black text-blue-700 uppercase">Amount Due Employee</span>
                         <span className="text-2xl font-black text-black tracking-tighter">${travelDue.toFixed(2)}</span>
                      </div>
                   </div>
                </div>
              </div>
            )}

            {/* MISC PREVIEW */}
            {activeTab === 'misc' && (
               <div className="max-w-4xl mx-auto border-[1px] border-black p-12 text-black bg-white min-h-[900px] flex flex-col shadow-2xl relative">
                  <div className="mb-8"><h1 className="text-3xl font-serif font-bold text-black tracking-wide">Infotrend Inc</h1></div>
                  <div className="text-center mb-10"><h2 className="text-xl font-bold uppercase underline tracking-wider">Miscellaneous Expense Report</h2></div>
                  <div className="grid grid-cols-1 gap-4 mb-8 text-sm max-w-lg">
                     <div className="grid grid-cols-[140px_1fr] items-end"><span className="font-bold">Employee Name:</span><span className="border-b border-black uppercase px-2">{miscForm.employeeName}</span></div>
                     <div className="grid grid-cols-[140px_1fr] items-end"><span className="font-bold">Office Location:</span><span className="border-b border-black uppercase px-2">{miscForm.officeLocation}</span></div>
                  </div>
                  <p className="mb-2 text-sm font-bold">The following table:</p>
                  <div className="flex-grow">
                     <table className="w-full border-collapse border border-black text-xs">
                        <thead>
                           <tr className="bg-white font-bold text-center">
                              <td className="border border-black p-2 w-[15%]">Date</td>
                              <td className="border border-black p-2 w-[35%]">Item Description</td>
                              <td className="border border-black p-2 w-[20%]">Vendor</td>
                              <td className="border border-black p-2 w-[20%]">Business Purpose</td>
                              <td className="border border-black p-2 w-[10%]">Total Expense</td>
                           </tr>
                        </thead>
                        <tbody>
                           {miscForm.items.map((item, idx) => (
                              <tr key={idx} className="h-8">
                                 <td className="border border-black p-2 text-center">{item.date}</td>
                                 <td className="border border-black p-2">{item.description}</td>
                                 <td className="border border-black p-2">{item.vendor}</td>
                                 <td className="border border-black p-2">{item.purpose}</td>
                                 <td className="border border-black p-2 text-right">{item.amount ? `$${parseFloat(item.amount).toFixed(2)}` : ''}</td>
                              </tr>
                           ))}
                           {[...Array(Math.max(0, 10 - miscForm.items.length))].map((_, i) => (
                              <tr key={`fill-${i}`} className="h-8"><td className="border border-black p-2">&nbsp;</td><td className="border border-black p-2">&nbsp;</td><td className="border border-black p-2">&nbsp;</td><td className="border border-black p-2">&nbsp;</td><td className="border border-black p-2">&nbsp;</td></tr>
                           ))}
                        </tbody>
                        <tfoot>
                           <tr className="font-bold">
                              <td className="border border-black p-2 text-right uppercase" colSpan="4">Totals</td>
                              <td className="border border-black p-2 text-right text-sm bg-yellow-50">${miscTotal.toFixed(2)}</td>
                           </tr>
                        </tfoot>
                     </table>
                  </div>
                  <div className="mt-16 grid grid-cols-2 gap-20 text-sm">
                     <div className="border-t border-black pt-2"><div className="font-bold">Employee Signature</div></div>
                     <div className="border-t border-black pt-2"><div className="font-bold">Supervisor Signature</div></div>
                  </div>
                  <div className="absolute bottom-8 left-0 right-0 text-center text-xs text-slate-400">Infotrend Inc Internal Document</div>
               </div>
            )}

            {/* MEALS PREVIEW */}
            {activeTab === 'meals' && (
              <div className="max-w-4xl mx-auto border-[1px] border-black p-12 text-black bg-white min-h-[900px] flex flex-col shadow-2xl relative">
                  <div className="mb-8"><h1 className="text-3xl font-serif font-bold text-black tracking-wide">Infotrend Inc</h1></div>
                  <div className="text-center mb-10"><h2 className="text-xl font-bold uppercase underline tracking-wider">Business Meal Expense Report</h2></div>
                  
                  <div className="grid grid-cols-[140px_1fr] items-end mb-8 text-sm w-1/2">
                      <span className="font-bold">Employee Name:</span>
                      <span className="border-b border-black uppercase px-2">{mealsForm.employeeName}</span>
                  </div>

                  <p className="mb-2 text-sm font-bold">The following table:</p>
                  <div className="flex-grow">
                     <table className="w-full border-collapse border border-black text-xs">
                        <thead>
                           <tr className="bg-white font-bold text-center align-bottom">
                              <td className="border border-black p-2 w-[12%]">Date</td>
                              <td className="border border-black p-2 w-[20%]">Purpose / Technical</td>
                              <td className="border border-black p-2 w-[20%]">Location / Place</td>
                              <td className="border border-black p-2 w-[30%]">List of Attendees</td>
                              <td className="border border-black p-2 w-[18%]">Total Expense</td>
                           </tr>
                        </thead>
                        <tbody>
                           {mealsForm.items.map((item, idx) => (
                              <tr key={idx}>
                                 <td className="border border-black p-2 text-center align-top">{item.date}</td>
                                 <td className="border border-black p-2 align-top">{item.purpose}</td>
                                 <td className="border border-black p-2 align-top">{item.location}</td>
                                 <td className="border border-black p-2 align-top whitespace-pre-wrap">{item.attendees}</td>
                                 <td className="border border-black p-2 text-right align-top">{item.totalExpense ? `$${parseFloat(item.totalExpense).toFixed(2)}` : ''}</td>
                              </tr>
                           ))}
                           {/* Empty Filler Rows */}
                           {[...Array(Math.max(0, 8 - mealsForm.items.length))].map((_, i) => (
                              <tr key={`fill-${i}`} className="h-12">
                                 <td className="border border-black p-2"></td><td className="border border-black p-2"></td><td className="border border-black p-2"></td><td className="border border-black p-2"></td><td className="border border-black p-2"></td>
                              </tr>
                           ))}
                           
                           {/* Important Note Row */}
                           <tr>
                              <td className="border border-black p-2 italic text-center" colSpan="4">
                                Please list the amount within the total expense related to alcohol or other unallowables
                              </td>
                              <td className="border border-black p-2 text-right font-bold text-red-600">
                                ${mealsTotalUnallowable.toFixed(2)}
                              </td>
                           </tr>
                        </tbody>
                     </table>
                  </div>

                  {/* Finance Section */}
                  <div className="mt-8 border border-black p-4 bg-slate-50">
                     <h3 className="font-bold underline mb-2 text-sm">For Finance Use Only</h3>
                     <table className="w-full border-collapse border border-black text-xs text-center">
                        <thead>
                           <tr className="font-bold">
                              <td className="border border-black p-2">Total Expense</td>
                              <td className="border border-black p-2">Unallowable</td>
                              <td className="border border-black p-2">Allowable</td>
                           </tr>
                        </thead>
                        <tbody>
                           <tr>
                              <td className="border border-black p-2 text-lg font-bold">${mealsTotalExpense.toFixed(2)}</td>
                              <td className="border border-black p-2 text-lg text-red-600">${mealsTotalUnallowable.toFixed(2)}</td>
                              <td className="border border-black p-2 text-lg text-green-700">${mealsTotalAllowable.toFixed(2)}</td>
                           </tr>
                        </tbody>
                     </table>
                  </div>

                  {/* Signatures */}
                  <div className="mt-12 grid grid-cols-2 gap-20 text-sm">
                     <div className="border-t border-black pt-2"><div className="font-bold">Employee Signature</div></div>
                     <div className="border-t border-black pt-2"><div className="font-bold">Supervisor Signature</div></div>
                  </div>

                  {/* Total Amount Due */}
                  <div className="mt-8 flex justify-end items-center gap-4 border-t-2 border-black pt-4">
                     <span className="font-bold text-lg uppercase">Total Amount Due to the Employee:</span>
                     <span className="text-2xl font-black underline">${mealsTotalAllowable.toFixed(2)}</span>
                  </div>

                  <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-slate-400">Infotrend Inc Internal Document</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseManagementSystem; 
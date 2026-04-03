
// import React, { useState } from 'react';

import React, { useState, useEffect, Fragment } from 'react';
import { Layout, Plus, Save, LogOut, Eye, EyeOff, Trash2, Briefcase, FileText, UserCheck, List, Edit } from 'lucide-react';

const SubcontractorAssignments = ({ 
  dataEntries = [], userName, handleLogout, 
  currentUserId, onDataChanged
//     userName,
// handleLogout,
// currentUserId
}) => {
  const [activeTab, setActiveTab] = useState('list'); // 'list', 'new', 'mod'
  const [isPreviewOn, setIsPreviewOn] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
//   const [entries, setEntries] = useState([]);
  const [expandedRow,setExpandedRow]=useState(null);
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

        // const loadData = async () => {

        // try{

        // const res = await fetch(`${API_BASE}/subcontractor-actions`);

        // if(!res.ok)
        // throw new Error("Failed to fetch");

        // const data = await res.json();

        // console.log("Loaded:",data);

        // setEntries(data);

        // }catch(err){

        // console.error(err);

        // }   

        // }; 
        // useEffect(()=>{

        // loadData();

        // },[]);

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
              {/* <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">{entries.length} Records</span> */}
           </div>
           {/* <div className="overflow-x-auto border rounded-lg"> */}
           <div className="overflow-x-auto border rounded-lg max-w-full">
             <table className="min-w-full divide-y text-sm">
               <thead className="bg-slate-50 font-bold text-slate-500 text-xs">
                 {/* <tr>
                   <th className="px-6 py-3 text-left">Serial Number</th>
                   <th className="px-6 py-3 text-left">Project</th>
                   <th className="px-6 py-3 text-left">Type</th>
                   <th className="px-6 py-3 text-left">Amount</th>
                   <th className="px-6 py-3 text-left">Status</th>
                 </tr> */}

                    <tr>
                        <th className="px-6 py-3 text-left">Serial Number</th>
                        <th className="px-6 py-3 text-left">Project</th>
                        <th className="px-6 py-3 text-left">Program Manager</th>
                        <th className="px-6 py-3 text-left">Company</th>
                        <th className="px-6 py-3 text-left">Type</th>
                        <th className="px-6 py-3 text-left">Agreement</th>
                        <th className="px-6 py-3 text-left">Total Labor</th>
                        <th className="px-6 py-3 text-left">Travel</th>
                        <th className="px-6 py-3 text-left">ODC</th>
                        <th className="px-6 py-3 text-left">Amount</th>
                        <th className="px-6 py-3 text-left">Status</th>
                        </tr>

               </thead>
           <tbody className="bg-white divide-y">
             {dataEntries.map(entry => (
                <Fragment key={entry.id || entry.prime_key}>
                <tr
                    onDoubleClick={() =>  setExpandedRow(expandedRow === entry.id ? null : entry.id )}>
                    <td className="px-6 py-3 font-bold text-blue-600">
                    {entry.prime_key}
                    </td>

                    <td className="px-6 py-3">
                    {entry.project_name}
                    </td>

                    <td className="px-6 py-3">
                    {entry.program_manager}
                    </td>

                    <td className="px-6 py-3">
                    {entry.company_name || '-'}
                    </td>

                    <td className="px-6 py-3">
                    {entry.request_type}
                    </td>

                    <td className="px-6 py-3">
                    {entry.agreement_type}
                    </td>

                    <td className="px-6 py-3 font-mono">
                    ${parseFloat(entry.total_labor || 0).toFixed(2)}
                    </td>

                    <td className="px-6 py-3 font-mono">
                    ${parseFloat(entry.total_travel || 0).toFixed(2)}
                    </td>

                    <td className="px-6 py-3 font-mono">
                    ${parseFloat(entry.total_odc || 0).toFixed(2)}
                    </td>

                    <td className="px-6 py-3 font-bold text-green-700">
                    ${parseFloat(entry.grand_total || 0).toFixed(2)}
                    </td>

                    <td className="px-6 py-3">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-[10px] font-bold">
                    {entry.status || 'Submitted'}
                    </span>
                    </td>
                </tr>

                {expandedRow === entry.id && (
                    <tr className="bg-slate-50">
                    <td colSpan="11" className="p-6">
                    <div className="grid grid-cols-3 gap-6 text-sm">
                    <div>
                    <div className="font-bold text-slate-500">
                    POP Start
                    </div>
                    <div>
                    {entry.pop_start?.split('T')[0]}
                    </div>
                    </div>

                    <div>
                    <div className="font-bold text-slate-500">
                    POP End
                    </div>
                    <div>
                    {entry.pop_end?.split('T')[0]}
                    </div>
                    </div>

                    <div>
                    <div className="font-bold text-slate-500">
                    Funding
                    </div>
                    <div>
                    ${entry.funding_auth_amount}
                    </div>
                    </div>

                    </div>
                    </td>
                    </tr>
                )}
                </Fragment>
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




// import React from 'react';
// import { Upload, Plus, Trash2, Save, UserCircle, LogOut } from 'lucide-react';

// const ProjectSetupForm = ({ 
//   userName = 'Admin', 
//   userAvatar, 
//   handleLogout 
// }) => {
    
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     alert("Project Setup Form saved as Draft! ");
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 sm:p-6 lg:p-8 text-gray-100 flex justify-center items-start">
//       <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-full text-gray-800">
        
//         {/* --- HEADER SECTION --- */}
//         <div className="flex justify-between items-center mb-8">
//           {/* Left: Title */}
//           <div className="w-1/3">
//             <h1 className="text-3xl font-extrabold">
//               <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-blue-600 leading-tight">
//                 Project Setup Form
//               </span>
//             </h1>
//           </div>

//           {/* Center: Logo */}
//           <div className="w-1/3 flex justify-center">
//             {/* <img 
//               src="/Lumina_logo.png" 
//               alt="Lumina Logo" 
//               className="h-12 opacity-100"
//             /> */}
//           </div>

//           {/* Right: User Profile & Logout */}
//           <div className="w-1/3 flex justify-end items-center gap-4">
//             <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-lg">
//               {userAvatar ? (
//                 <img src={userAvatar} alt="User Avatar" className="w-10 h-10 rounded-full object-cover" />
//               ) : (
//                 <UserCircle size={32} className="text-gray-500" />
//               )}
//               <span className="text-lg font-medium text-gray-700 hidden sm:block">
//                 Welcome, {userName}
//               </span>
//             </div>
//             <button 
//               onClick={handleLogout} 
//               className="p-3 bg-red-100 hover:bg-red-200 rounded-full text-red-600 transition-colors"
//               title="Logout"
//             >
//               <LogOut size={20} />
//             </button>
//           </div>
//         </div>

//         {/* --- FORM SECTION --- */}
//         <form onSubmit={handleSubmit} className="space-y-10">
          
//           {/* Section A: Identification */}
//           <section className="space-y-6">
//             <h2 className="text-lg font-bold text-blue-800 border-b-2 border-blue-200 pb-1">A. Project Identification</h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//               <div className="space-y-1">
//                 {/* PROJECT NAME - MANDATORY */}
//                 <label className="text-xs font-bold text-gray-500 uppercase">
//                   Project Name <span className="text-red-500">*</span>
//                 </label>
//                 <input className="w-full p-2 border-b-2 border-gray-300 focus:border-blue-600 outline-none transition-colors text-base" type="text" placeholder="e.g. Solar Phase II" />
//               </div>
//               <div className="space-y-1">
//                 <label className="text-xs font-bold text-gray-500 uppercase">Submitter Name</label>
//                 <input className="w-full p-2 border-b-2 border-gray-300 focus:border-blue-600 outline-none transition-colors text-base" type="text" />
//               </div>
//               <div className="space-y-1">
//                 <label className="text-xs font-bold text-gray-500 uppercase">Submission Date</label>
//                 <input className="w-full p-2 border-b-2 border-gray-300 focus:border-blue-600 outline-none transition-colors text-base" type="date" />
//               </div>
//             </div>
//           </section>

//           {/* Section B: Contract Details */}
//           <section className="space-y-6">
//             <h2 className="text-lg font-bold text-blue-800 border-b-2 border-blue-200 pb-1">B. Contract Basics</h2>
            
//             <div className="space-y-3">
//               <label className="block text-sm font-bold text-gray-700">1. Is this a New Contract or Extension of existing contract?</label>
//               <div className="flex flex-col sm:flex-row gap-4">
//                 <select className="flex-grow p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white">
//                   <option>Select Option...</option>
//                   <option>New Contract</option>
//                   <option>Extension / Modification</option>
//                 </select>
//                 <button type="button" className="flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 px-6 py-2 rounded-lg border-2 border-dashed border-gray-300 transition-all text-sm font-semibold">
//                   <Upload size={16} />
//                   <span>Attach Document</span>
//                 </button>
//               </div>
//             </div>

//             <div className="bg-blue-50 p-6 rounded-xl space-y-4 border border-blue-100">
//               <label className="block text-sm font-bold text-gray-700">2. Customer Information (For New Contracts)</label>
//               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                 <input className="p-2 border border-gray-300 rounded-lg bg-white text-sm md:col-span-2" type="text" placeholder="Customer Name" />
//                 <select className="p-2 border border-gray-300 rounded-lg bg-white text-sm">
//                   <option>Customer Type...</option>
//                   <option>Commercial</option>
//                   <option>Government</option>
//                 </select>
//                 <input className="p-2 border border-gray-300 rounded-lg bg-white text-sm" type="text" placeholder="Payment Term" />
//                 <input className="p-2 border border-gray-300 rounded-lg bg-white text-sm md:col-span-2" type="text" placeholder="Contact Person" />
//                 <textarea className="md:col-span-4 p-2 border border-gray-300 rounded-lg bg-white text-sm" placeholder="Customer Address" rows="2"></textarea>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               <div className="space-y-2">
//                 {/* CONTRACT TYPE - MANDATORY */}
//                 <label className="block text-sm font-bold text-gray-700">
//                   3. Contract Type <span className="text-red-500">*</span>
//                 </label>
//                 <select className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white">
//                   <option>T&M (Time & Material)</option>
//                   <option>FFP (Firm Fixed Price)</option>
//                   <option>CPFF (Cost Plus Fixed Fee)</option>
//                 </select>
//               </div>
//               <div className="space-y-2">
//                 {/* CONTRACT & FUNDING - MANDATORY */}
//                 <label className="block text-sm font-bold text-gray-700">
//                   4. Contract & Funding Value <span className="text-red-500">*</span>
//                 </label>
//                 <div className="flex gap-4">
//                   <input className="w-1/2 p-2 border border-gray-300 rounded-lg text-sm" type="text" placeholder="Contract Val ($)" />
//                   <input className="w-1/2 p-2 border border-gray-300 rounded-lg text-sm" type="text" placeholder="Funding Val ($)" />
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* Section C: Project Structure */}
//           <section className="space-y-6">
//             <h2 className="text-lg font-bold text-blue-800 border-b-2 border-blue-200 pb-1">C. Project Structure & Workforce</h2>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               <div className="space-y-1">
//                 <label className="block text-xs font-bold text-gray-600">6. Prime / Sub / PO / TO Nos.</label>
//                 <input className="w-full p-2 border border-gray-300 rounded-lg text-sm" type="text" />
//               </div>
//               <div className="space-y-1">
//                 <label className="block text-xs font-bold text-gray-600">7. Project Manager</label>
//                 <input className="w-full p-2 border border-gray-300 rounded-lg text-sm" type="text" />
//               </div>
//               <div className="space-y-1">
//                 {/* OWNING ORG - MANDATORY */}
//                 <label className="block text-xs font-bold text-gray-600">
//                   8. Owning Org/Division <span className="text-red-500">*</span>
//                 </label>
//                 <input className="w-full p-2 border border-gray-300 rounded-lg text-sm" type="text" />
//               </div>
//               <div className="space-y-1">
//                 <label className="block text-xs font-bold text-gray-600">9. PoP Dates</label>
//                 <div className="flex gap-2">
//                   <input className="w-1/2 p-2 border border-gray-300 rounded-lg text-xs" type="date" />
//                   <input className="w-1/2 p-2 border border-gray-300 rounded-lg text-xs" type="date" />
//                 </div>
//               </div>
//             </div>

//             {/* Workforce Table */}
//             <div className="space-y-4 pt-2">
//               <div className="flex justify-between items-center">
//                 <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">10. Workforce Information Table</label>
//                 <button type="button" className="text-blue-700 px-3 py-1 rounded-md hover:bg-blue-100 flex items-center gap-2 text-xs font-bold transition-colors">
//                   <Plus size={14} /> Add New Resource
//                 </button>
//               </div>
//               <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
//                 <table className="min-w-full divide-y divide-gray-200 text-sm">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-4 py-3 text-left font-bold text-gray-600 uppercase text-xs">Employee / Vendor</th>
//                       <th className="px-4 py-3 text-left font-bold text-gray-600 uppercase text-xs">Labor Category</th>
//                       <th className="px-4 py-3 text-left font-bold text-gray-600 uppercase text-xs">CLIN Description</th>
//                       <th className="px-4 py-3 text-left font-bold text-gray-600 uppercase text-xs">Rate ($)</th>
//                       <th className="px-4 py-3 text-center font-bold text-gray-600 uppercase text-xs">Action</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-200 bg-white">
//                     {[1, 2, 3].map(row => (
//                       <tr key={row} className="hover:bg-blue-50 transition-colors">
//                         <td className="p-2"><input className="w-full p-2 border border-transparent hover:border-gray-200 rounded text-sm focus:ring-1 focus:ring-blue-500" type="text" placeholder="Name..." /></td>
//                         <td className="p-2"><input className="w-full p-2 border border-transparent hover:border-gray-200 rounded text-sm focus:ring-1 focus:ring-blue-500" type="text" placeholder="PLC..." /></td>
//                         <td className="p-2"><input className="w-full p-2 border border-transparent hover:border-gray-200 rounded text-sm focus:ring-1 focus:ring-blue-500" type="text" placeholder="CLIN..." /></td>
//                         <td className="p-2"><input className="w-full p-2 border border-transparent hover:border-gray-200 rounded text-sm focus:ring-1 focus:ring-blue-500" type="text" placeholder="0.00" /></td>
//                         <td className="p-2 text-center">
//                           <button type="button" className="text-gray-400 hover:text-red-500 transition-colors">
//                             <Trash2 size={18} className="mx-auto" />
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </section>

//           {/* Section D: Billing & Overrides */}
//           <section className="space-y-6">
//             <h2 className="text-lg font-bold text-blue-800 border-b-2 border-blue-200 pb-1">D. Billing & Overrides</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               <div className="space-y-2">
//                 <label className="block text-sm font-bold text-gray-700">11. Cost Ceiling / Burden / Fee Overrides</label>
//                 <textarea className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" rows="3" placeholder="Detail any CLIN overrides..."></textarea>
//               </div>
//               <div className="space-y-2">
//                 <label className="block text-sm font-bold text-gray-700">12. Billing Instructions</label>
//                 <textarea className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" rows="3" placeholder="Enter format, emails, etc..."></textarea>
//               </div>
//             </div>
//           </section>

//           {/* --- FOOTER BUTTONS --- */}
//           <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
//                <button 
//                 type="submit" 
//                 className="flex items-center gap-2 px-8 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-extrabold rounded-lg shadow-md transform transition-all active:scale-95 text-sm"
//               >
//                 <Upload size={18} />
//                 Import Project Data
//               </button>
//               <button 
//                 type="button" 
//                 className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-600 font-bold hover:bg-gray-100 transition-all text-sm shadow-sm"
//               >
//                 Save as Draft
//               </button>
//               <button 
//                 type="submit" 
//                 className="flex items-center gap-2 px-8 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-extrabold rounded-lg shadow-md transform transition-all active:scale-95 text-sm"
//               >
//                 <Save size={18} />
//                 Submit Project Setup Form
//               </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ProjectSetupForm;


// Deployed version above 


import React, { useState } from 'react';
import { Save, LogOut, Eye, EyeOff, Plus, Trash2, Briefcase, FileText, Loader2, Upload, UserCircle } from 'lucide-react';

const ProjectSetupForm = ({ 
  userName = 'Admin', 
  userAvatar, 
  handleLogout 
}) => {
  const [activeTab, setActiveTab] = useState('form'); // 'form' or 'list'
  const [isPreviewOn, setIsPreviewOn] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [submittedProjects, setSubmittedProjects] = useState([]);

  // Form State for Live Preview
  const [formData, setFormData] = useState({
    projectName: '',
    submitterName: '',
    submissionDate: new Date().toISOString().split('T')[0],
    contractType: 'T&M (Time & Material)',
    customerName: '',
    contractValue: '0',
    fundingValue: '0',
    projectManager: '',
    owningOrg: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);

    // Simulate API delay
    setTimeout(() => {
      const newProject = {
        id: Date.now(),
        ...formData
      };
      setSubmittedProjects([newProject, ...submittedProjects]);
      alert("Project Setup Form saved successfully!");
      setIsSaving(false);
      setActiveTab('list');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 text-slate-800 font-sans">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 bg-white p-3 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-4 w-full md:w-auto">
           <h1 className="text-lg font-black tracking-tight text-blue-900 hidden md:block ">Lumina System</h1>
           <div className="flex bg-slate-100 p-1 rounded-lg w-full md:w-auto justify-center md:justify-start">
              <button 
                onClick={() => setActiveTab('form')} 
                className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-md text-xs font-black tracking-wider transition-all ${activeTab === 'form' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <Briefcase size={14}/> Setup Form
              </button>
              <button 
                onClick={() => setActiveTab('list')} 
                className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-md text-xs font-black tracking-wider transition-all ${activeTab === 'list' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <FileText size={14}/> New Projects
              </button>
           </div>
        </div>
        <div className="flex items-center gap-2 mt-3 md:mt-0 w-full md:w-auto justify-end">
          <button 
            onClick={() => setIsPreviewOn(!isPreviewOn)} 
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${isPreviewOn ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
          >
            {isPreviewOn ? <EyeOff size={14}/> : <Eye size={14}/>} {isPreviewOn ? 'Hide Preview' : 'Show Preview'}
          </button>
          <div className="h-8 w-[1px] bg-slate-200 mx-2 hidden md:block"></div>
          <button onClick={handleLogout} className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100"><LogOut size={20}/></button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-140px)]">
        
        {/* --- LEFT PANEL: FORMS --- */}
        <div className={`${isPreviewOn && activeTab === 'form' ? 'lg:w-1/3' : 'lg:w-full max-w-5xl mx-auto'} bg-white rounded-xl shadow-lg overflow-y-auto p-6 border-t-4 border-blue-600 transition-all duration-300`}>
          
          {activeTab === 'form' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b">
                <Briefcase className="text-blue-600" size={18} />
                <h2 className="font-black text-slate-700 tracking-wide text-sm">Project Identification</h2>
              </div>

              <section className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Project Name *</label>
                  <input name="projectName" required className="w-full p-2 border rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none" type="text" value={formData.projectName} onChange={handleInputChange} placeholder="e.g. Solar Phase II" />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Submitter</label>
                    <input name="submitterName" className="w-full p-2 border rounded-lg text-sm bg-slate-50" type="text" value={formData.submitterName} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Date</label>
                    <input name="submissionDate" className="w-full p-2 border rounded-lg text-sm bg-slate-50" type="date" value={formData.submissionDate} onChange={handleInputChange} />
                  </div>
                </div>
              </section>

              <div className="flex items-center gap-2 mb-4 pb-2 border-b pt-4">
                <FileText className="text-blue-600" size={18} />
                <h2 className="font-black text-slate-700 tracking-wide text-sm">Contract Basics</h2>
              </div>

              <section className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Contract Type</label>
                  <select name="contractType" className="w-full p-2 border rounded-lg text-sm bg-slate-50" value={formData.contractType} onChange={handleInputChange}>
                    <option>T&M (Time & Material)</option>
                    <option>FFP (Firm Fixed Price)</option>
                    <option>CPFF (Cost Plus Fixed Fee)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Contract Val ($)</label>
                    <input name="contractValue" className="w-full p-2 border rounded-lg text-sm bg-slate-50" type="number" value={formData.contractValue} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Funding Val ($)</label>
                    <input name="fundingValue" className="w-full p-2 border rounded-lg text-sm bg-slate-50" type="number" value={formData.fundingValue} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Customer Name</label>
                  <input name="customerName" className="w-full p-2 border rounded-lg text-sm bg-slate-50" type="text" value={formData.customerName} onChange={handleInputChange} />
                </div>
              </section>

              <button type="submit" disabled={isSaving} className={`w-full text-white font-black py-4 rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 tracking-tighter text-sm mt-6 ${isSaving ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
                {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18}/>} 
                {isSaving ? 'Processing...' : `Submit Project Setup`}
              </button>
            </form>
          ) : (
            /* --- LIST VIEW --- */
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b">
                <h2 className="text-xl font-black text-slate-800 tracking-tight">New Projects Records</h2>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-black">{submittedProjects.length} Total</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b">
                      <th className="px-4 py-3">Project Name</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Value</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {submittedProjects.map(proj => (
                      <tr key={proj.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-4 font-bold text-slate-700">{proj.projectName}</td>
                        <td className="px-4 py-4 text-slate-500">{proj.contractType}</td>
                        <td className="px-4 py-4 font-black">${parseFloat(proj.contractValue).toLocaleString()}</td>
                        <td className="px-4 py-4">
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-[10px] font-black uppercase">Active</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* --- RIGHT PANEL: LIVE PREVIEW --- */}
        {isPreviewOn && activeTab === 'form' && (
          <div className="w-full lg:w-2/3 bg-white rounded-xl shadow-inner overflow-y-auto p-8 border border-slate-200">
            <div className="max-w-4xl mx-auto border-[1px] border-black p-12 text-black bg-white shadow-2xl min-h-[800px] relative flex flex-col">
              
              <div className="mb-8 flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-serif font-bold text-black tracking-wide">Infotrend Inc</h1>
                  <p className="text-[10px] uppercase font-bold text-slate-500">Project Management Office</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black border border-black px-2 py-1 uppercase">Internal Use Only</span>
                </div>
              </div>

              <div className="text-center mb-10">
                <h2 className="text-xl font-bold uppercase underline tracking-wider">Project Setup Authorization</h2>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
                <div className="space-y-4">
                  <div className="grid grid-cols-[120px_1fr] items-end">
                    <span className="font-bold">Project Name:</span>
                    <span className="border-b border-black uppercase px-2 truncate font-medium">{formData.projectName || '---'}</span>
                  </div>
                  <div className="grid grid-cols-[120px_1fr] items-end">
                    <span className="font-bold">Contract Type:</span>
                    <span className="border-b border-black px-2">{formData.contractType}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-[120px_1fr] items-end">
                    <span className="font-bold">Setup Date:</span>
                    <span className="border-b border-black px-2">{formData.submissionDate}</span>
                  </div>
                  <div className="grid grid-cols-[120px_1fr] items-end">
                    <span className="font-bold">Submitter:</span>
                    <span className="border-b border-black uppercase px-2">{formData.submitterName || userName}</span>
                  </div>
                </div>
              </div>

              <table className="w-full border-collapse border border-black text-xs mb-8">
                <thead>
                  <tr className="bg-slate-50 font-bold uppercase">
                    <td className="border border-black p-2" colSpan="2">Financial Parameters</td>
                    <td className="border border-black p-2 text-right">Amount (USD)</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-black p-2 font-bold w-1/3">Contract Value</td>
                    <td className="border border-black p-2 italic text-slate-500">Total authorized ceiling</td>
                    <td className="border border-black p-2 text-right font-bold text-base">${parseFloat(formData.contractValue).toLocaleString()}.00</td>
                  </tr>
                  <tr>
                    <td className="border border-black p-2 font-bold">Funding Value</td>
                    <td className="border border-black p-2 italic text-slate-500">Current allotted funds</td>
                    <td className="border border-black p-2 text-right font-bold text-base">${parseFloat(formData.fundingValue).toLocaleString()}.00</td>
                  </tr>
                  <tr>
                    <td className="border border-black p-2 font-bold">Customer</td>
                    <td className="border border-black p-2 uppercase" colSpan="2">{formData.customerName || 'Pending Designation'}</td>
                  </tr>
                </tbody>
              </table>

              <div className="flex-grow">
                <div className="border border-black p-4 bg-slate-50">
                  <h3 className="font-bold underline mb-3 text-sm uppercase">Compliance & Authorization</h3>
                  <div className="space-y-2 text-[11px] leading-tight">
                    <p>1. This project is established under the guidelines of FAR Section 31.</p>
                    <p>2. Charge codes will be generated within 24 hours of supervisor approval.</p>
                    <p>3. Owning Division is responsible for PoP (Period of Performance) monitoring.</p>
                  </div>
                </div>
              </div>

              <div className="mt-16 grid grid-cols-2 gap-20 text-sm pb-12">
                <div className="border-t border-black pt-2"><div className="font-bold">Project Manager Signature</div></div>
                <div className="border-t border-black pt-2"><div className="font-bold">Finance Controller Approval</div></div>
              </div>

              <div className="absolute bottom-4 left-0 right-0 text-center text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                Lumina Management Systems • Document Ref: {formData.projectName ? formData.projectName.substring(0,3).toUpperCase() : 'PRJ'}-{Date.now().toString().slice(-4)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectSetupForm;
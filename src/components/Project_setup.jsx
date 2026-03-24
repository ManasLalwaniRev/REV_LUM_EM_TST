
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
import { Upload, Plus, Trash2, Save, UserCircle, LogOut, List, ClipboardList, CheckCircle2 } from 'lucide-react';

const ProjectSetupForm = ({ 
  userName = 'Admin', 
  userAvatar, 
  handleLogout 
}) => {
  const [activeTab, setActiveTab] = useState('form'); 
  const [submittedProjects, setSubmittedProjects] = useState([]);
  
  // State for automatic form filling and status tracking
  const [formData, setFormData] = useState({
    projectName: '',
    submitterName: userName,
    submissionDate: new Date().toISOString().split('T')[0],
    contractBasics: 'New Contract',
    customerName: '',
    customerType: 'Commercial',
    paymentTerm: '',
    contactPerson: '',
    customerAddress: '',
    contractType: 'T&M (Time & Material)',
    contractVal: '',
    fundingVal: '',
    referenceNos: '',
    projectManager: '',
    owningOrg: '',
    popStart: '',
    popEnd: '',
    billingOverrides: '',
    billingInstructions: '',
    status: 'draft'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Import logic to auto-fill the form
  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target.result);
          setFormData(prev => ({
            ...prev,
            ...imported,
            status: 'draft' // Reset to draft on new import
          }));
          alert("Project data imported successfully!");
        } catch (err) {
          alert("Error: Please upload a valid JSON file.");
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = (e, finalStatus) => {
    if (e) e.preventDefault();
    
    const newProject = {
      ...formData,
      id: Date.now(),
      status: finalStatus,
      date: formData.submissionDate || new Date().toLocaleDateString(),
    };

    setSubmittedProjects([...submittedProjects, newProject]);
    alert(`Project ${finalStatus} successfully!`);
    setActiveTab('list');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 sm:p-6 lg:p-8 text-gray-100 flex justify-center items-start">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-full text-gray-800">
        
        {/* --- HEADER SECTION --- */}
        <div className="flex justify-between items-center mb-8">
          <div className="w-1/3">
            <h1 className="text-3xl font-extrabold">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-blue-600 leading-tight">
                Project Setup
              </span>
            </h1>
          </div>

          <div className="w-1/3 flex justify-center">
            <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
              <button 
                onClick={() => setActiveTab('form')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'form' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <ClipboardList size={16} /> Setup Form
              </button>
              <button 
                onClick={() => setActiveTab('list')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'list' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <List size={16} /> New Projects
              </button>
            </div>
          </div>

          <div className="w-1/3 flex justify-end items-center gap-4">
            <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-lg">
              {userAvatar ? (
                <img src={userAvatar} alt="User Avatar" className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <UserCircle size={32} className="text-gray-500" />
              )}
              <span className="text-lg font-medium text-gray-700 hidden sm:block">
                Welcome, {userName}
              </span>
            </div>
            <button onClick={handleLogout} className="p-3 bg-red-100 hover:bg-red-200 rounded-full text-red-600 transition-colors">
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {activeTab === 'form' ? (
          <form className="space-y-10">
            {/* Section A: Identification */}
            <section className="space-y-6">
              <h2 className="text-lg font-bold text-blue-800 border-b-2 border-blue-200 pb-1">A. Project Identification</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Project Name <span className="text-red-500">*</span></label>
                  <input name="projectName" value={formData.projectName} onChange={handleInputChange} required className="w-full p-2 border-b-2 border-gray-300 focus:border-blue-600 outline-none transition-colors text-base" type="text" placeholder="e.g. Solar Phase II" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Submitter Name</label>
                  <input name="submitterName" value={formData.submitterName} onChange={handleInputChange} className="w-full p-2 border-b-2 border-gray-300 focus:border-blue-600 outline-none transition-colors text-base" type="text" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Submission Date</label>
                  <input name="submissionDate" value={formData.submissionDate} onChange={handleInputChange} className="w-full p-2 border-b-2 border-gray-300 focus:border-blue-600 outline-none transition-colors text-base" type="date" />
                </div>
              </div>
            </section>

            {/* Section B: Contract Details */}
            <section className="space-y-6">
              <h2 className="text-lg font-bold text-blue-800 border-b-2 border-blue-200 pb-1">B. Contract Basics</h2>
              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-700">1. Is this a New Contract or Extension?</label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <select name="contractBasics" value={formData.contractBasics} onChange={handleInputChange} className="flex-grow p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white">
                    <option>New Contract</option>
                    <option>Extension / Modification</option>
                  </select>
                  <button type="button" className="flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 px-6 py-2 rounded-lg border-2 border-dashed border-gray-300 transition-all text-sm font-semibold">
                    <Upload size={16} /> <span>Attach Document</span>
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-xl space-y-4 border border-blue-100">
                <label className="block text-sm font-bold text-gray-700">2. Customer Information</label>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <input name="customerName" value={formData.customerName} onChange={handleInputChange} className="p-2 border border-gray-300 rounded-lg bg-white text-sm md:col-span-2" type="text" placeholder="Customer Name" />
                  <select name="customerType" value={formData.customerType} onChange={handleInputChange} className="p-2 border border-gray-300 rounded-lg bg-white text-sm">
                    <option>Commercial</option>
                    <option>Government</option>
                  </select>
                  <input name="paymentTerm" value={formData.paymentTerm} onChange={handleInputChange} className="p-2 border border-gray-300 rounded-lg bg-white text-sm" type="text" placeholder="Payment Term" />
                  <input name="contactPerson" value={formData.contactPerson} onChange={handleInputChange} className="p-2 border border-gray-300 rounded-lg bg-white text-sm md:col-span-2" type="text" placeholder="Contact Person" />
                  <textarea name="customerAddress" value={formData.customerAddress} onChange={handleInputChange} className="md:col-span-4 p-2 border border-gray-300 rounded-lg bg-white text-sm" placeholder="Customer Address" rows="2"></textarea>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">3. Contract Type <span className="text-red-500">*</span></label>
                  <select name="contractType" value={formData.contractType} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white">
                    <option>T&M (Time & Material)</option>
                    <option>FFP (Firm Fixed Price)</option>
                    <option>CPFF (Cost Plus Fixed Fee)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">4. Contract & Funding Value <span className="text-red-500">*</span></label>
                  <div className="flex gap-4">
                    <input name="contractVal" value={formData.contractVal} onChange={handleInputChange} className="w-1/2 p-2 border border-gray-300 rounded-lg text-sm" type="number" placeholder="Contract Val ($)" />
                    <input name="fundingVal" value={formData.fundingVal} onChange={handleInputChange} className="w-1/2 p-2 border border-gray-300 rounded-lg text-sm" type="number" placeholder="Funding Val ($)" />
                  </div>
                </div>
              </div>
            </section>

            {/* Section C: Project Structure */}
            <section className="space-y-6">
              <h2 className="text-lg font-bold text-blue-800 border-b-2 border-blue-200 pb-1">C. Project Structure & Workforce</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-600">6. Prime / Sub / PO / TO Nos.</label>
                  <input name="referenceNos" value={formData.referenceNos} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-lg text-sm" type="text" />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-600">7. Project Manager</label>
                  <input name="projectManager" value={formData.projectManager} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-lg text-sm" type="text" />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-600">8. Owning Org/Division <span className="text-red-500">*</span></label>
                  <input name="owningOrg" value={formData.owningOrg} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-lg text-sm" type="text" />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-600">9. PoP Dates</label>
                  <div className="flex gap-2">
                    <input name="popStart" value={formData.popStart} onChange={handleInputChange} className="w-1/2 p-2 border border-gray-300 rounded-lg text-xs" type="date" />
                    <input name="popEnd" value={formData.popEnd} onChange={handleInputChange} className="w-1/2 p-2 border border-gray-300 rounded-lg text-xs" type="date" />
                  </div>
                </div>
              </div>

              {/* Workforce Table */}
              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">10. Workforce Information Table</label>
                  <button type="button" className="text-blue-700 px-3 py-1 rounded-md hover:bg-blue-100 flex items-center gap-2 text-xs font-bold transition-colors">
                    <Plus size={14} /> Add New Resource
                  </button>
                </div>
                <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-bold text-gray-600 uppercase text-xs">Employee / Vendor</th>
                        <th className="px-4 py-3 text-left font-bold text-gray-600 uppercase text-xs">Labor Category</th>
                        <th className="px-4 py-3 text-left font-bold text-gray-600 uppercase text-xs">CLIN Description</th>
                        <th className="px-4 py-3 text-left font-bold text-gray-600 uppercase text-xs">Rate ($)</th>
                        <th className="px-4 py-3 text-center font-bold text-gray-600 uppercase text-xs">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {[1, 2, 3].map(row => (
                        <tr key={row} className="hover:bg-blue-50 transition-colors">
                          <td className="p-2"><input className="w-full p-2 border border-transparent hover:border-gray-200 rounded text-sm" type="text" placeholder="Name..." /></td>
                          <td className="p-2"><input className="w-full p-2 border border-transparent hover:border-gray-200 rounded text-sm" type="text" placeholder="PLC..." /></td>
                          <td className="p-2"><input className="w-full p-2 border border-transparent hover:border-gray-200 rounded text-sm" type="text" placeholder="CLIN..." /></td>
                          <td className="p-2"><input className="w-full p-2 border border-transparent hover:border-gray-200 rounded text-sm" type="text" placeholder="0.00" /></td>
                          <td className="p-2 text-center"><button type="button" className="text-gray-400 hover:text-red-500"><Trash2 size={18} className="mx-auto" /></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Section D: Billing & Overrides */}
            <section className="space-y-6">
              <h2 className="text-lg font-bold text-blue-800 border-b-2 border-blue-200 pb-1">D. Billing & Overrides</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">11. Cost Ceiling / Burden / Fee Overrides</label>
                  <textarea name="billingOverrides" value={formData.billingOverrides} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" rows="3"></textarea>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">12. Billing Instructions</label>
                  <textarea name="billingInstructions" value={formData.billingInstructions} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" rows="3"></textarea>
                </div>
              </div>
            </section>

            {/* --- FOOTER BUTTONS WITH STATUS & IMPORT --- */}
            <div className="flex flex-wrap justify-end gap-4 pt-6 border-t border-gray-100">
                <input type="file" id="import-json" className="hidden" accept=".json" onChange={handleImport} />
                <button 
                  type="button" 
                  onClick={() => document.getElementById('import-json').click()}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg transition-all text-sm shadow-sm"
                >
                  <Upload size={18} /> Import Project Data
                </button>
                <button 
                  type="button" 
                  onClick={() => handleSubmit(null, 'draft')}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-600 font-bold hover:bg-gray-100 transition-all text-sm shadow-sm"
                >
                  Save as Draft
                </button>
                <button 
                  type="button" 
                  onClick={() => handleSubmit(null, 'submitted')}
                  className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-lg shadow-md transition-all text-sm"
                >
                  <Save size={18} /> Submit Setup Form
                </button>
                {userName === 'Admin' && (
                  <button 
                    type="button" 
                    onClick={() => handleSubmit(null, 'approved')}
                    className="flex items-center gap-2 px-8 py-2.5 bg-green-600 hover:bg-green-700 text-white font-extrabold rounded-lg shadow-md transition-all text-sm"
                  >
                    <CheckCircle2 size={18} /> Approve Project
                  </button>
                )}
            </div>
          </form>
        ) : (
          /* --- LIST VIEW WITH STATUS --- */
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">Projects Overview</h2>
            <div className="overflow-x-auto border border-gray-200 rounded-xl">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold text-gray-600 uppercase text-xs">Project Name</th>
                    <th className="px-6 py-4 text-left font-bold text-gray-600 uppercase text-xs">Submitter</th>
                    <th className="px-6 py-4 text-left font-bold text-gray-600 uppercase text-xs">Date</th>
                    <th className="px-6 py-4 text-center font-bold text-gray-600 uppercase text-xs">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {submittedProjects.map((project) => (
                    <tr key={project.id} className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-blue-700">{project.projectName}</td>
                      <td className="px-6 py-4 text-gray-600">{project.submitterName}</td>
                      <td className="px-6 py-4 text-gray-600">{project.date}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          project.status === 'approved' ? 'bg-green-100 text-green-700' : 
                          project.status === 'submitted' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {project.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {submittedProjects.length === 0 && (
                    <tr><td colSpan="4" className="px-6 py-10 text-center text-gray-400 italic">No projects found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectSetupForm;
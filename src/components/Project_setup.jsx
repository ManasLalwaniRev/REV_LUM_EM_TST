
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
import { 
  Upload, Plus, Trash2, Save, UserCircle, LogOut, 
  List, ClipboardList, CheckCircle2, Download 
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const ProjectSetupForm = ({ userName = 'Admin', userAvatar, handleLogout }) => {
  const [activeTab, setActiveTab] = useState('form'); 
  const [submittedProjects, setSubmittedProjects] = useState([]);
  
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

  // --- NEW: Download Excel Template ---
  const handleDownloadTemplate = () => {
    const templateData = [{
      "Project Name": "Sample Project",
      "Submitter Name": userName,
      "Submission Date": "2026-03-24",
      "Contract Type": "T&M (Time & Material)",
      "Contract Val": 10000,
      "Funding Val": 5000,
      "Project Manager": "John Doe",
      "Owning Org": "Sales"
    }];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ProjectTemplate");
    
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(data, "Project_Setup_Template.xlsx");
  };

  // --- UPDATED: Excel Import Logic ---
  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet)[0]; // Get first row

        if (json) {
          setFormData(prev => ({
            ...prev,
            projectName: json["Project Name"] || prev.projectName,
            submitterName: json["Submitter Name"] || prev.submitterName,
            submissionDate: json["Submission Date"] || prev.submissionDate,
            contractType: json["Contract Type"] || prev.contractType,
            contractVal: json["Contract Val"] || prev.contractVal,
            fundingVal: json["Funding Val"] || prev.fundingVal,
            projectManager: json["Project Manager"] || prev.projectManager,
            owningOrg: json["Owning Org"] || prev.owningOrg,
            status: 'draft'
          }));
          alert("Excel data imported successfully!");
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleSubmit = (e, finalStatus) => {
    if (e) e.preventDefault();
    const newProject = { ...formData, id: Date.now(), status: finalStatus };
    setSubmittedProjects([...submittedProjects, newProject]);
    alert(`Project ${finalStatus} successfully!`);
    setActiveTab('list');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 sm:p-6 lg:p-8 text-gray-100 flex justify-center items-start">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-full text-gray-800">
        
        {/* --- HEADER SECTION --- */}
        <div className="flex justify-between items-center mb-8">
          <div className="w-1/3"><h1 className="text-3xl font-extrabold text-blue-800">Project Setup</h1></div>
          <div className="w-1/3 flex justify-center">
            <div className="flex bg-gray-100 p-1 rounded-lg border">
              <button onClick={() => setActiveTab('form')} className={`px-4 py-2 rounded-md text-sm font-bold ${activeTab === 'form' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500'}`}><ClipboardList size={16} className="inline mr-2" /> Setup Form</button>
              <button onClick={() => setActiveTab('list')} className={`px-4 py-2 rounded-md text-sm font-bold ${activeTab === 'list' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500'}`}><List size={16} className="inline mr-2" /> View List</button>
            </div>
          </div>
          <div className="w-1/3 flex justify-end items-center gap-4">
            <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-lg">
              <UserCircle size={32} className="text-gray-500" />
              <span className="text-lg font-medium text-gray-700 hidden sm:block">Welcome, {userName}</span>
            </div>
            <button onClick={handleLogout} className="p-3 bg-red-100 text-red-600 rounded-full"><LogOut size={20} /></button>
          </div>
        </div>

        {activeTab === 'form' ? (
          <form className="space-y-10">
            {/* Template & Import Actions */}
            <div className="flex gap-4 mb-4">
              <button type="button" onClick={handleDownloadTemplate} className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg font-bold text-sm hover:bg-green-100">
                <Download size={16} /> Download Excel Template
              </button>
              <label className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg font-bold text-sm cursor-pointer hover:bg-blue-100">
                <Upload size={16} /> Import Excel
                <input type="file" className="hidden" accept=".xlsx, .xls" onChange={handleImport} />
              </label>
            </div>

            {/* Section A: Identification */}
            <section className="space-y-6">
              <h2 className="text-lg font-bold text-blue-800 border-b-2 border-blue-200 pb-1">A. Project Identification</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Project Name *</label>
                  <input name="projectName" value={formData.projectName} onChange={handleInputChange} className="w-full p-2 border-b-2 border-gray-300 outline-none focus:border-blue-600" type="text" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Submitter Name</label>
                  <input name="submitterName" value={formData.submitterName} onChange={handleInputChange} className="w-full p-2 border-b-2 border-gray-300 outline-none focus:border-blue-600" type="text" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Submission Date</label>
                  <input name="submissionDate" value={formData.submissionDate} onChange={handleInputChange} className="w-full p-2 border-b-2 border-gray-300 outline-none focus:border-blue-600" type="date" />
                </div>
              </div>
            </section>

            {/* Section B: Contract Details */}
            <section className="space-y-6">
              <h2 className="text-lg font-bold text-blue-800 border-b-2 border-blue-200 pb-1">B. Contract Basics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">Contract Type *</label>
                  <select name="contractType" value={formData.contractType} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-lg bg-white">
                    <option>T&M (Time & Material)</option>
                    <option>FFP (Firm Fixed Price)</option>
                    <option>CPFF (Cost Plus Fixed Fee)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">Financials *</label>
                  <div className="flex gap-4">
                    <input name="contractVal" value={formData.contractVal} onChange={handleInputChange} className="w-1/2 p-2 border border-gray-300 rounded-lg" type="number" placeholder="Contract ($)" />
                    <input name="fundingVal" value={formData.fundingVal} onChange={handleInputChange} className="w-1/2 p-2 border border-gray-300 rounded-lg" type="number" placeholder="Funding ($)" />
                  </div>
                </div>
              </div>
            </section>

            {/* Section C: Project Structure */}
            <section className="space-y-6">
              <h2 className="text-lg font-bold text-blue-800 border-b-2 border-blue-200 pb-1">C. Project Structure</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Project Manager</label>
                  <input name="projectManager" value={formData.projectManager} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-lg" type="text" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Owning Org</label>
                  <input name="owningOrg" value={formData.owningOrg} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-lg" type="text" />
                </div>
              </div>
            </section>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t">
                <button type="button" onClick={() => handleSubmit(null, 'draft')} className="px-6 py-2.5 border border-gray-300 rounded-lg font-bold hover:bg-gray-100">Save as Draft</button>
                <button type="button" onClick={() => handleSubmit(null, 'submitted')} className="px-8 py-2.5 bg-blue-600 text-white font-extrabold rounded-lg hover:bg-blue-700 shadow-md">Submit Form</button>
                {userName === 'Admin' && (
                  <button type="button" onClick={() => handleSubmit(null, 'approved')} className="px-8 py-2.5 bg-green-600 text-white font-extrabold rounded-lg hover:bg-green-700 shadow-md">Approve Project</button>
                )}
            </div>
          </form>
        ) : (
          /* List View */
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">Projects Overview</h2>
            <div className="overflow-x-auto border rounded-xl">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold text-gray-600 text-xs uppercase">Project Name</th>
                    <th className="px-6 py-4 text-left font-bold text-gray-600 text-xs uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y">
                  {submittedProjects.map((p) => (
                    <tr key={p.id}>
                      <td className="px-6 py-4 font-bold text-blue-700">{p.projectName}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${p.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
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
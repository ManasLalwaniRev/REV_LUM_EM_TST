
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

// latest Version Below 


// import React, { useState, useEffect } from 'react';
// import { 
//   Upload, Plus, Trash2, Save, UserCircle, LogOut, 
//   List, ClipboardList, CheckCircle2, Download 
// } from 'lucide-react';
// import * as XLSX from 'xlsx';
// import { saveAs } from 'file-saver';

// const ProjectSetupForm = ({ 
//   userName = 'Admin', 
//   userAvatar, 
//   handleLogout 
// }) => {
//   const [activeTab, setActiveTab] = useState('form'); 
//   const [submittedProjects, setSubmittedProjects] = useState([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // --- 1. INITIAL STATE (ALL DB FIELDS) ---
//   const [formData, setFormData] = useState({
//     projectName: '',
//     submitterName: userName,
//     submissionDate: new Date().toISOString().split('T')[0],
//     contractBasics: 'New Contract',
//     customerName: '',
//     customerType: 'Commercial',
//     paymentTerm: '',
//     contactPerson: '',
//     customerAddress: '',
//     contractType: 'T&M (Time & Material)',
//     contractVal: '',
//     fundingVal: '',
//     referenceNos: '',
//     projectManager: '',
//     owningOrg: '',
//     popStart: '',
//     popEnd: '',
//     billingOverrides: '',
//     billingInstructions: '',
//     status: 'draft'
//   });

//   // --- 2. DATA FETCHING (GET API) ---
//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/projects`);
//         if (response.ok) {
//           const data = await response.json();
//           setSubmittedProjects(data);
//         }
//       } catch (error) {
//         console.error("Error fetching projects:", error);
//       }
//     };

//     if (activeTab === 'list') {
//       fetchProjects();
//     }
//   }, [activeTab]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   // --- 3. EXCEL TEMPLATE DOWNLOAD ---
//   const handleDownloadTemplate = () => {
//     const templateData = [{
//       "Project Name": "Required",
//       "Submitter Name": userName,
//       "Submission Date": formData.submissionDate,
//       "Contract Basics": "New Contract",
//       "Customer Name": "",
//       "Customer Type": "Commercial",
//       "Payment Term": "",
//       "Contact Person": "",
//       "Customer Address": "",
//       "Contract Type": "T&M (Time & Material)",
//       "Contract Val": 0,
//       "Funding Val": 0,
//       "Reference Nos": "",
//       "Project Manager": "",
//       "Owning Org": "Required",
//       "PoP Start": "",
//       "PoP End": "",
//       "Billing Overrides": "",
//       "Billing Instructions": ""
//     }];

//     const ws = XLSX.utils.json_to_sheet(templateData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Template");
//     const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
//     const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
//     saveAs(data, "Project_Setup_Template.xlsx");
//   };

//   // --- 4. EXCEL IMPORT WITH VALIDATION ---
//   const handleImport = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const data = new Uint8Array(e.target.result);
//       const workbook = XLSX.read(data, { type: 'array' });
//       const json = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]])[0];

//       if (json) {
//         // Required Fields Check
//         if (!json["Project Name"] || !json["Owning Org"] || json["Project Name"] === "Required") {
//           alert("Import Failed: Please fill in 'Project Name' and 'Owning Org' in the Excel file.");
//           return;
//         }

//         setFormData({
//           projectName: json["Project Name"],
//           submitterName: json["Submitter Name"] || userName,
//           submissionDate: json["Submission Date"] || formData.submissionDate,
//           contractBasics: json["Contract Basics"] || 'New Contract',
//           customerName: json["Customer Name"] || '',
//           customerType: json["Customer Type"] || 'Commercial',
//           paymentTerm: json["Payment Term"] || '',
//           contactPerson: json["Contact Person"] || '',
//           customerAddress: json["Customer Address"] || '',
//           contractType: json["Contract Type"] || 'T&M (Time & Material)',
//           contractVal: json["Contract Val"] || '',
//           fundingVal: json["Funding Val"] || '',
//           referenceNos: json["Reference Nos"] || '',
//           projectManager: json["Project Manager"] || '',
//           owningOrg: json["Owning Org"],
//           popStart: json["PoP Start"] || '',
//           popEnd: json["PoP End"] || '',
//           billingOverrides: json["Billing Overrides"] || '',
//           billingInstructions: json["Billing Instructions"] || '',
//           status: 'draft'
//         });
//         alert("Excel data imported successfully!");
//       }
//     };
//     reader.readAsArrayBuffer(file);
//   };

//   // --- 5. SUBMIT TO BACKEND (POST API) ---
//   const handleSubmit = async (finalStatus) => {
//     if (!formData.projectName || !formData.owningOrg) {
//       alert("Missing Required Fields: Project Name and Owning Org are mandatory.");
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/projects/new`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ ...formData, status: finalStatus, userId: 1 }), // Replace userId with dynamic ID
//       });

//       if (response.ok) {
//         alert(`Project ${finalStatus} successfully!`);
//         setActiveTab('list');
//       } else {
//         const err = await response.json();
//         alert(`Error: ${err.error}`);
//       }
//     } catch (error) {
//       alert("Connection failed. Check if server is running.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 sm:p-6 lg:p-8 text-gray-100 flex justify-center items-start">
//       <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-full text-gray-800">
        
//         {/* HEADER */}
//         <div className="flex justify-between items-center mb-8">
//           <div className="w-1/3"><h1 className="text-3xl font-extrabold text-blue-800">Project Setup</h1></div>
//           <div className="w-1/3 flex justify-center">
//             <div className="flex bg-gray-100 p-1 rounded-lg border">
//               <button onClick={() => setActiveTab('form')} className={`px-4 py-2 rounded-md text-sm font-bold ${activeTab === 'form' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500'}`}><ClipboardList size={16} className="inline mr-2" /> Setup Form</button>
//               <button onClick={() => setActiveTab('list')} className={`px-4 py-2 rounded-md text-sm font-bold ${activeTab === 'list' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500'}`}><List size={16} className="inline mr-2" /> View List</button>
//             </div>
//           </div>
//           <div className="w-1/3 flex justify-end gap-4">
//             <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border">
//               <UserCircle size={32} className="text-gray-400" />
//               <span className="text-sm font-bold text-gray-700">{userName}</span>
//               <button onClick={handleLogout} className="text-red-500 hover:bg-red-50 p-1 rounded"><LogOut size={18} /></button>
//             </div>
//           </div>
//         </div>

//         {activeTab === 'form' ? (
//           <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>
            
//             {/* EXCEL TOOLS */}
//             <div className="flex gap-4 p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
//               <button type="button" onClick={handleDownloadTemplate} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-bold text-sm hover:bg-green-700 shadow-md">
//                 <Download size={16} /> Download Template
//               </button>
//               <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm cursor-pointer hover:bg-blue-700 shadow-md">
//                 <Upload size={16} /> Import Excel
//                 <input type="file" className="hidden" accept=".xlsx, .xls" onChange={handleImport} />
//               </label>
//             </div>

//             {/* SECTION A */}
//             <section className="space-y-6">
//               <h2 className="text-lg font-bold text-blue-800 border-b-2 border-blue-200 pb-1">A. Project Identification</h2>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//                 <div className="space-y-1">
//                   <label className="text-xs font-bold text-gray-500 uppercase">Project Name *</label>
//                   <input name="projectName" value={formData.projectName} onChange={handleInputChange} className="w-full p-2 border-b-2 border-gray-300 focus:border-blue-600 outline-none" type="text" />
//                 </div>
//                 <div className="space-y-1">
//                   <label className="text-xs font-bold text-gray-500 uppercase">Submitter Name</label>
//                   <input name="submitterName" value={formData.submitterName} onChange={handleInputChange} className="w-full p-2 border-b-2 border-gray-300 focus:border-blue-600 outline-none" type="text" />
//                 </div>
//                 <div className="space-y-1">
//                   <label className="text-xs font-bold text-gray-500 uppercase">Submission Date</label>
//                   <input name="submissionDate" value={formData.submissionDate} onChange={handleInputChange} className="w-full p-2 border-b-2 border-gray-300 focus:border-blue-600 outline-none" type="date" />
//                 </div>
//               </div>
//             </section>

//             {/* SECTION B */}
//             <section className="space-y-6">
//               <h2 className="text-lg font-bold text-blue-800 border-b-2 border-blue-200 pb-1">B. Contract Basics</h2>
//               <div className="space-y-3">
//                 <label className="block text-sm font-bold text-gray-700">1. New or Extension?</label>
//                 <select name="contractBasics" value={formData.contractBasics} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-lg bg-white">
//                   <option>New Contract</option>
//                   <option>Extension / Modification</option>
//                 </select>
//               </div>

//               <div className="bg-blue-50 p-6 rounded-xl space-y-4">
//                 <label className="block text-sm font-bold text-gray-700">2. Customer Info</label>
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                   <input name="customerName" value={formData.customerName} onChange={handleInputChange} className="p-2 border border-gray-300 rounded-lg col-span-2" placeholder="Customer Name" />
//                   <select name="customerType" value={formData.customerType} onChange={handleInputChange} className="p-2 border border-gray-300 rounded-lg">
//                     <option>Commercial</option>
//                     <option>Government</option>
//                   </select>
//                   <input name="paymentTerm" value={formData.paymentTerm} onChange={handleInputChange} className="p-2 border border-gray-300 rounded-lg" placeholder="Payment Term" />
//                   <input name="contactPerson" value={formData.contactPerson} onChange={handleInputChange} className="p-2 border border-gray-300 rounded-lg col-span-2" placeholder="Contact Person" />
//                   <textarea name="customerAddress" value={formData.customerAddress} onChange={handleInputChange} className="col-span-4 p-2 border border-gray-300 rounded-lg" placeholder="Address" rows="2" />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                 <div className="space-y-2">
//                   <label className="block text-sm font-bold text-gray-700">3. Contract Type *</label>
//                   <select name="contractType" value={formData.contractType} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-lg bg-white">
//                     <option>T&M (Time & Material)</option>
//                     <option>FFP (Firm Fixed Price)</option>
//                     <option>CPFF (Cost Plus Fixed Fee)</option>
//                   </select>
//                 </div>
//                 <div className="space-y-2">
//                   <label className="block text-sm font-bold text-gray-700">4. Value ($) *</label>
//                   <div className="flex gap-4">
//                     <input name="contractVal" value={formData.contractVal} onChange={handleInputChange} className="w-1/2 p-2 border border-gray-300 rounded-lg" type="number" placeholder="Contract" />
//                     <input name="fundingVal" value={formData.fundingVal} onChange={handleInputChange} className="w-1/2 p-2 border border-gray-300 rounded-lg" type="number" placeholder="Funding" />
//                   </div>
//                 </div>
//               </div>
//             </section>

//             {/* SECTION C */}
//             <section className="space-y-6">
//               <h2 className="text-lg font-bold text-blue-800 border-b-2 border-blue-200 pb-1">C. Structure & Workforce</h2>
//               <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//                 <input name="referenceNos" value={formData.referenceNos} onChange={handleInputChange} className="p-2 border border-gray-300 rounded-lg text-sm" placeholder="Prime/Sub/PO Nos" />
//                 <input name="projectManager" value={formData.projectManager} onChange={handleInputChange} className="p-2 border border-gray-300 rounded-lg text-sm" placeholder="PM Name" />
//                 <input name="owningOrg" value={formData.owningOrg} onChange={handleInputChange} className="p-2 border border-gray-300 rounded-lg text-sm" placeholder="Owning Org *" />
//                 <div className="flex gap-2">
//                   <input name="popStart" value={formData.popStart} onChange={handleInputChange} className="w-1/2 p-2 border border-gray-300 rounded-lg text-xs" type="date" />
//                   <input name="popEnd" value={formData.popEnd} onChange={handleInputChange} className="w-1/2 p-2 border border-gray-300 rounded-lg text-xs" type="date" />
//                 </div>
//               </div>

//               {/* Workforce Placeholder Table */}
//               <div className="overflow-x-auto border border-gray-200 rounded-xl">
//                 <table className="min-w-full divide-y divide-gray-200 text-sm">
//                   <thead className="bg-gray-50">
//                     <tr><th className="px-4 py-3 text-left">Resource</th><th className="px-4 py-3 text-left">Category</th><th className="px-4 py-3 text-left">Rate ($)</th><th className="px-4 py-3 text-center">Action</th></tr>
//                   </thead>
//                   <tbody>
//                     <tr><td className="p-2"><input className="w-full border-none text-sm" placeholder="Name..." /></td><td className="p-2"><input className="w-full border-none text-sm" placeholder="PLC..." /></td><td className="p-2"><input className="w-full border-none text-sm" placeholder="0.00" /></td><td className="p-2 text-center"><Trash2 size={16} className="mx-auto text-gray-300" /></td></tr>
//                   </tbody>
//                 </table>
//               </div>
//             </section>

//             {/* SECTION D */}
//             <section className="space-y-6">
//               <h2 className="text-lg font-bold text-blue-800 border-b-2 border-blue-200 pb-1">D. Billing & Overrides</h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                 <textarea name="billingOverrides" value={formData.billingOverrides} onChange={handleInputChange} className="p-2 border border-gray-300 rounded-lg text-sm" rows="3" placeholder="Billing Overrides..." />
//                 <textarea name="billingInstructions" value={formData.billingInstructions} onChange={handleInputChange} className="p-2 border border-gray-300 rounded-lg text-sm" rows="3" placeholder="Billing Instructions..." />
//               </div>
//             </section>

//             {/* FOOTER ACTIONS */}
//             <div className="flex justify-end gap-4 pt-6 border-t">
//               <button type="button" onClick={() => handleSubmit('draft')} disabled={isSubmitting} className="px-6 py-2 border border-gray-300 rounded-lg font-bold hover:bg-gray-50">Save Draft</button>
//               <button type="button" onClick={() => handleSubmit('submitted')} disabled={isSubmitting} className="px-8 py-2 bg-blue-600 text-white rounded-lg font-extrabold hover:bg-blue-700 shadow-md">Submit Setup</button>
//               {userName === 'Admin' && (
//                 <button type="button" onClick={() => handleSubmit('approved')} disabled={isSubmitting} className="px-8 py-2 bg-green-600 text-white rounded-lg font-extrabold hover:bg-green-700 shadow-md">Approve</button>
//               )}
//             </div>
//           </form>
//         ) : (
//           /* LIST VIEW */
//           <div className="space-y-6">
//             <h2 className="text-xl font-bold text-gray-800">Projects Overview</h2>
//             <div className="overflow-x-auto border border-gray-200 rounded-xl">
//               <table className="min-w-full divide-y divide-gray-200 text-sm">
//                 <thead className="bg-gray-50">
//                   <tr><th className="px-6 py-4 text-left font-bold text-gray-600">Project Name</th><th className="px-6 py-4 text-left font-bold text-gray-600">Status</th><th className="px-6 py-4 text-left font-bold text-gray-600">Submitter</th></tr>
//                 </thead>
//                 <tbody className="divide-y">
//                   {submittedProjects.map((p) => (
//                     <tr key={p.id} className="hover:bg-blue-50">
//                       <td className="px-6 py-4 font-bold text-blue-700">{p.project_name}</td>
//                       <td className="px-6 py-4">
//                         <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${p.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{p.status}</span>
//                       </td>
//                       <td className="px-6 py-4 text-gray-500">{p.submitter_name}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProjectSetupForm;


// Latest Version Above



import React, { useState, useEffect } from 'react';

const ProjectSetup = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch projects from the database
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/projects`);
        if (!response.ok) throw new Error('Failed to fetch projects');
        const data = await response.json();
        setProjects(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleRowDoubleClick = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  if (loading) return <div className="p-10 text-white text-center">Loading List...</div>;
  if (error) return <div className="p-10 text-red-500 text-center">Error: {error}</div>;

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Project List View</h1>

      {/* Main List View: Scrollable Table */}
      <div className="flex-1 overflow-auto border border-gray-700 rounded-lg bg-gray-800 shadow-xl">
        <table className="w-full text-left border-collapse min-w-max">
          <thead className="sticky top-0 bg-gray-700 shadow-md">
            <tr>
              <th className="p-4 border-b border-gray-600 font-bold uppercase text-xs text-gray-400">Project ID</th>
              <th className="p-4 border-b border-gray-600 font-bold uppercase text-xs text-gray-400">Project Name</th>
              <th className="p-4 border-b border-gray-600 font-bold uppercase text-xs text-gray-400">Client</th>
              <th className="p-4 border-b border-gray-600 font-bold uppercase text-xs text-gray-400">Status</th>
            </tr>
          </thead>
          <tbody>
            {projects.length > 0 ? (
              projects.map((project) => (
                <tr 
                  key={project.project_id || Math.random()} 
                  onDoubleClick={() => handleRowDoubleClick(project)}
                  className="hover:bg-gray-700 cursor-pointer border-b border-gray-700 transition-colors"
                >
                  <td className="p-4 text-sm">{project.project_id}</td>
                  <td className="p-4 text-sm font-medium">{project.project_name}</td>
                  <td className="p-4 text-sm">{project.client_name}</td>
                  <td className="p-4 text-sm">
                    <span className="bg-blue-900 text-blue-200 px-2 py-1 rounded text-xs">
                      {project.status || 'Active'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-10 text-center text-gray-500">No records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Form View: Read-Only Modal */}
      {isModalOpen && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-gray-800 border border-gray-700 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-gray-800/50">
              <h2 className="text-xl font-bold text-blue-400">Project Details (Read-Only)</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white text-2xl">&times;</button>
            </div>
            
            {/* Scrollable form if there are many fields */}
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto">
              {Object.entries(selectedProject).map(([key, value]) => (
                <div key={key} className="flex flex-col space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{key.replace(/_/g, ' ')}</label>
                  <input 
                    readOnly 
                    value={value || 'N/A'} 
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-gray-200 outline-none cursor-default"
                  />
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-gray-700 flex justify-end">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded font-bold transition-all"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectSetup;
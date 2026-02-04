import React, { useState, useMemo, useEffect } from 'react';
import { ChevronDown, ChevronRight, Plus, Pencil, Search, LogOut, X, Save, Send, CheckCircle, XCircle } from 'lucide-react';

const formatDate = (iso) => iso ? new Date(iso).toLocaleDateString() : 'N/A';

const Subk_Travel_Combined = ({ 
  dataEntries, userName, userAvatar, handleLogout, 
  currentUserRole, currentUserId, onDataChanged, contractOptions = [] 
}) => {
  const [activeCategory, setActiveCategory] = useState('Subk');
  const [searchValue, setSearchValue] = useState('');
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [isAdding, setIsAdding] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  const [formData, setFormData] = useState({
    contractShortName: '', projectName: '', pmName: '', email: '', 
    ccRecipients: '', chargeAmount: '', chargeDate: '', pdfFilePath: '', 
    notes: '', isApproved: false, subkName: '', laborCategory: ''
  });

  const resetForm = () => {
    setFormData({
      contractShortName: '', projectName: '', pmName: '', email: '', 
      ccRecipients: '', chargeAmount: '', chargeDate: '', pdfFilePath: '', 
      notes: '', isApproved: false, subkName: '', laborCategory: ''
    });
    setIsAdding(false);
    setEditingEntry(null);
  };

  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [id]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = async (e, shouldNotify = false) => {
    if (e) e.preventDefault();
    if (currentUserRole === 'Admin' && !formData.isApproved && !formData.notes) {
      return alert("Admin: Reason for rejection required.");
    }

    const method = editingEntry ? 'PATCH' : 'POST';
    const url = editingEntry 
      ? `${import.meta.env.VITE_API_BASE_URL}/subk-travel/${editingEntry.id}`
      : `${import.meta.env.VITE_API_BASE_URL}/subk-travel/new`;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, category: activeCategory, userId: currentUserId }),
      });

      if (onDataChanged) onDataChanged();

      if (shouldNotify) {
        const saved = await res.json();
        const body = `Action Required: New ${activeCategory} entry ${saved.prime_key}\nProject: ${formData.projectName}\nLogin: https://rev-lum-em-tst.vercel.app`;
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/send-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ recipient: formData.email, cc: formData.ccRecipients, subject: `${activeCategory} Notification`, bodyContent: body }),
        });
      }
      resetForm();
    } catch (err) { alert("Error saving record."); }
  };

  const filteredEntries = useMemo(() => {
    return (dataEntries || []).filter(entry => 
      entry.category === activeCategory &&
      Object.values(entry).some(val => String(val).toLowerCase().includes(searchValue.toLowerCase()))
    );
  }, [dataEntries, activeCategory, searchValue]);

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-gray-800">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b pb-4">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-black text-blue-900 uppercase tracking-tight">Subk & Travel</h1>
            <select 
              value={activeCategory} 
              onChange={(e) => { setActiveCategory(e.target.value); resetForm(); }}
              className="p-2 border-2 border-blue-600 rounded-lg font-bold text-blue-700 bg-blue-50 focus:outline-none"
            >
              <option value="Subk">Basis: SubK Assignments</option>
              <option value="Travel">Basis: Travel Expenses</option>
            </select>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right"><p className="text-sm font-bold">{userName}</p></div>
            <button onClick={handleLogout} className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"><LogOut size={20}/></button>
          </div>
        </div>

        {/* Form */}
        {(isAdding || editingEntry) && (
          <div className="mb-8 p-6 border-2 border-blue-200 rounded-xl bg-blue-50">
            <div className="flex justify-between items-center mb-4"><h2 className="text-lg font-bold text-blue-900 uppercase">Entry Details</h2><button onClick={resetForm}><X/></button></div>
            <form onSubmit={(e) => handleSave(e)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div><label className="block text-xs font-bold mb-1">CONTRACT *</label>
                <select id="contractShortName" className="w-full p-2 border rounded" value={formData.contractShortName} onChange={handleInputChange} required>
                  <option value="">Select Contract</option>
                  {contractOptions.map(opt => <option key={opt.id} value={opt.name}>{opt.name}</option>)}
                </select>
              </div>
              <div><label className="block text-xs font-bold mb-1">PROJECT NAME *</label><input id="projectName" className="w-full p-2 border rounded" value={formData.projectName} onChange={handleInputChange} required /></div>
              <div><label className="block text-xs font-bold mb-1">PM NAME *</label><input id="pmName" className="w-full p-2 border rounded" value={formData.pmName} onChange={handleInputChange} required /></div>
              <div><label className="block text-xs font-bold mb-1 text-blue-700">NOTIFY EMAIL *</label><input id="email" type="email" className="w-full p-2 border rounded" value={formData.email} onChange={handleInputChange} required /></div>
              <div><label className="block text-xs font-bold mb-1">CC RECIPIENTS</label><input id="ccRecipients" className="w-full p-2 border rounded" value={formData.ccRecipients} onChange={handleInputChange} /></div>
              
              {activeCategory === 'Subk' && (
                <>
                  <div><label className="block text-xs font-bold mb-1 text-lime-700 uppercase">Subk Name *</label><input id="subkName" className="w-full p-2 border border-lime-200 rounded" value={formData.subkName} onChange={handleInputChange} required /></div>
                  <div><label className="block text-xs font-bold mb-1 text-lime-700 uppercase">Labor Category</label><input id="laborCategory" className="w-full p-2 border border-lime-200 rounded" value={formData.laborCategory} onChange={handleInputChange} /></div>
                </>
              )}

              <div><label className="block text-xs font-bold mb-1 uppercase">Amount *</label><input id="chargeAmount" type="number" className="w-full p-2 border rounded" value={formData.chargeAmount} onChange={handleInputChange} required /></div>
              <div><label className="block text-xs font-bold mb-1 uppercase">Date</label><input id="chargeDate" type="date" className="w-full p-2 border rounded" value={formData.chargeDate} onChange={handleInputChange} required /></div>
              <div className="lg:col-span-2"><label className="block text-xs font-bold mb-1 uppercase text-gray-400">PDF Path</label><input id="pdfFilePath" className="w-full p-2 border rounded" value={formData.pdfFilePath} onChange={handleInputChange} /></div>
              <div className="lg:col-span-4"><label className="block text-xs font-bold mb-1 uppercase">Notes / Reason</label><textarea id="notes" rows="1" className={`w-full p-2 border rounded ${currentUserRole === 'Admin' && !formData.isApproved ? 'bg-red-50 border-red-400' : ''}`} value={formData.notes} onChange={handleInputChange} required={currentUserRole === 'Admin' && !formData.isApproved} /></div>

              {/* Status Section */}
              <div className="lg:col-span-4 flex gap-4 mt-2">
                <button type="button" disabled={currentUserRole !== 'Admin'} onClick={() => setFormData(p => ({ ...p, isApproved: true }))} className={`px-6 py-2 rounded-lg border-2 w-fit font-bold ${formData.isApproved ? 'bg-green-100 border-green-500' : 'bg-white border-gray-200'} ${currentUserRole !== 'Admin' ? 'opacity-40 grayscale' : ''}`}>APPROVE</button>
                <button type="button" disabled={currentUserRole !== 'Admin'} onClick={() => setFormData(p => ({ ...p, isApproved: false }))} className={`px-6 py-2 rounded-lg border-2 w-fit font-bold ${!formData.isApproved ? 'bg-red-100 border-red-500' : 'bg-white border-gray-200'} ${currentUserRole !== 'Admin' ? 'opacity-40 grayscale' : ''}`}>REJECT</button>
              </div>

              <div className="lg:col-span-4 flex justify-end gap-3 mt-4 border-t pt-4">
                <button type="submit" className="bg-blue-600 text-white px-8 py-2 rounded-lg flex items-center gap-2 transition hover:bg-blue-700"><Save size={18}/> Save</button>
                <button type="button" onClick={(e) => handleSave(e, true)} className="bg-yellow-500 text-white px-8 py-2 rounded-lg flex items-center gap-2 transition hover:bg-yellow-600"><Send size={18}/> Save & Notify</button>
              </div>
            </form>
          </div>
        )}

        {/* List Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex gap-3">
            <button onClick={() => setIsAdding(true)} className="bg-yellow-500 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold"><Plus size={20}/> ADD {activeCategory.toUpperCase()}</button>
          </div>
          <div className="flex items-center border rounded-lg bg-gray-50 px-3 py-2 w-full md:w-96">
            <Search size={18} className="text-gray-400 mr-2"/><input type="text" placeholder={`Search ${activeCategory}...`} className="bg-transparent w-full outline-none text-sm" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 font-bold uppercase text-gray-600">
              <tr>
                <th className="px-6 py-3 text-left">Record No</th>
                <th className="px-6 py-3 text-left">Project / PM</th>
                <th className="px-6 py-3 text-left">Contract</th>
                {activeCategory === 'Subk' && <th className="px-6 py-3 text-left">Subk Name</th>}
                <th className="px-6 py-3 text-left">Amount</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">PDF</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y">
              {filteredEntries.map(entry => (
                <tr key={entry.id} className="hover:bg-blue-50">
                  <td className="px-6 py-3 font-medium">{entry.prime_key}</td>
                  <td className="px-6 py-3"><div>{entry.project_name}</div><div className="text-xs text-gray-500">{entry.pm_name}</div></td>
                  <td className="px-6 py-3">{entry.contract_short_name}</td>
                  {activeCategory === 'Subk' && <td className="px-6 py-3">{entry.subk_name}</td>}
                  <td className="px-6 py-3 font-bold">${parseFloat(entry.charge_amount).toFixed(2)}</td>
                  <td className={`px-6 py-3 font-bold ${entry.is_approved ? 'text-green-600' : 'text-red-600'}`}>{entry.is_approved ? 'Approved' : 'Rejected'}</td>
                  <td className="px-6 py-3 text-blue-600 underline"><a href={entry.pdf_file_path} target="_blank" rel="noreferrer">View</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Subk_Travel_Combined;
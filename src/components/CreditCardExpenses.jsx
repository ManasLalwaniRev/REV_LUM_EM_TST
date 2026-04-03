import React, { useState, useMemo, useEffect } from 'react';
import { ChevronDown, ChevronRight, Plus, Pencil, Search, LogOut, X, Save, Send, CheckCircle, XCircle, Clock } from 'lucide-react';

const CreditCardExpenses = ({ 
  dataEntries, isLoading, userName = 'User', userAvatar, handleLogout, 
  currentUserRole, currentUserId, onDataChanged, contractOptions = [], creditCardOptions = []
}) => {
  const [vendorOptions, setVendorOptions] = useState([]);
  const [searchColumn, setSearchColumn] = useState('all');
  const [searchValue, setSearchValue] = useState('');
  const [showOnlyLatest, setShowOnlyLatest] = useState(false);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [localEntries, setLocalEntries] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  const pmEmailOptions = [
    'Manas.Lalwani@revolvespl.com',
    'Nilesh.Peswani@revolvespl.com',
    'abdulraees.shaikh@revolvespl.com',
    'jony.rodrigues@revolvespl.com'
  ];

  const searchableColumns = [
    { key: 'all', name: 'All Fields' },
    { key: 'creditCard', name: 'Credit Card' },
    { key: 'vendorId', name: 'Vendor ID' },
    { key: 'vendorName', name: 'Vendor Name' },
    { key: 'contractShortName', name: 'Contract' },
  ];

  const [formData, setFormData] = useState({
    creditCard: '', vendorId: '', vendorName: '', contractShortName: '', 
    chargeDate: '', chargeAmount: '', pmEmail: '', chargeCode: '',
    status: 'Submitted', notes: '', pdfFilePath: '',
  });

  useEffect(() => {
    setLocalEntries(dataEntries || []);
    // Fetch Master Vendors for the dropdown
    fetch(`${import.meta.env.VITE_API_BASE_URL}/vendors`)
      .then(res => res.json())
      .then(data => setVendorOptions(data))
      .catch(err => console.error("Error fetching vendors:", err));
  }, [dataEntries]);

  // --- Logic ---
  const handleVendorChange = (e) => {
    const selectedId = e.target.value;
    const selectedVendor = vendorOptions.find(v => v.vendor_id === selectedId);
    setFormData(prev => ({
      ...prev, 
      vendorId: selectedId, 
      vendorName: selectedVendor ? selectedVendor.vendor_name : ''
    }));
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const setStatus = (newStatus) => {
    if (userName !== 'Revolve') {
      alert("Permission Denied: Only Admins can Approve or Reject.");
      return;
    }
    setFormData(prev => ({ ...prev, status: newStatus }));
  };

  const resetForm = () => {
    setFormData({
      creditCard: '', vendorId: '', vendorName: '', contractShortName: '', chargeDate: '',
      chargeAmount: '', pmEmail: '', chargeCode: '',
      status: 'Submitted', notes: '', pdfFilePath: ''
    });
    setIsAdding(false);
    setEditingEntry(null);
  };

  const startEdit = () => {
    const entryId = Array.from(selectedRows)[0];
    const entry = localEntries.find(e => e.id === entryId);
    if (entry) {
      setEditingEntry(entry);
      setIsAdding(false);
      setFormData({
        creditCard: entry.credit_card || entry.creditCard || '',
        vendorId: entry.vendor_id || entry.vendorId || '',
        vendorName: entry.vendor_name || entry.vendorName || '',
        contractShortName: entry.contract_short_name || entry.contractShortName || '',
        chargeDate: (entry.charge_date || entry.chargeDate)?.split('T')[0] || '',
        chargeAmount: entry.charge_amount || entry.chargeAmount || '',
        pmEmail: entry.pm_email || entry.pmEmail || '',
        chargeCode: entry.charge_code || entry.chargeCode || '',
        status: entry.status || 'Submitted',
        notes: entry.notes || '',
        pdfFilePath: entry.pdf_file_path || entry.pdfFilePath || '',
      });
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (userName === 'Revolve' && formData.status === 'Rejected' && !formData.notes) {
      return alert("Notes are required for rejection.");
    }
    try {
      const url = editingEntry 
        ? `${import.meta.env.VITE_API_BASE_URL}/credit-card-expenses/${editingEntry.id}`
        : `${import.meta.env.VITE_API_BASE_URL}/credit-card-expenses/new`;

      await fetch(url, {
        method: editingEntry ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userId: currentUserId }),
      });
      if (onDataChanged) onDataChanged();
      resetForm();
    } catch (err) { alert("Save error"); }
  };

  const groupedEntries = useMemo(() => {
    const groups = localEntries.reduce((acc, entry) => {
      const baseKey = String(entry.prime_key || entry.primeKey || '').split('.')[0];
      if (!baseKey) return acc;
      if (!acc[baseKey]) acc[baseKey] = [];
      acc[baseKey].push(entry);
      return acc;
    }, {});
    for (const key in groups) {
      groups[key].sort((a, b) => parseFloat(b.prime_key || b.primeKey || 0) - parseFloat(a.prime_key || a.primeKey || 0));
    }
    let filteredGroups = Object.values(groups);
    if (searchValue) {
      const lowVal = searchValue.toLowerCase();
      filteredGroups = filteredGroups.filter(group =>
        group.some(e => {
          if (searchColumn === 'all') return Object.values(e).some(v => String(v).toLowerCase().includes(lowVal));
          return String(e[searchColumn] || '').toLowerCase().includes(lowVal);
        })
      );
    }
    return showOnlyLatest ? filteredGroups.map(g => [g[0]]) : filteredGroups;
  }, [localEntries, searchColumn, searchValue, showOnlyLatest]);

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-gray-800">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h1 className="text-3xl font-extrabold text-blue-800  tracking-tighter">Credit Card Expenses</h1>
          <div className="flex items-center gap-4">
            <div className="bg-gray-100 p-2 rounded-lg flex items-center gap-2 border">
              <img src={userAvatar || "/default-avatar.png"} alt="Avatar" className="w-8 h-8 rounded-full" />
              <span className="text-sm font-bold">{userName}</span>
            </div>
            <button onClick={handleLogout} className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"><LogOut/></button>
          </div>
        </div>

        {/* Form with Vendor Mapping */}
        {(isAdding || editingEntry) && (
          <div className="mb-8 p-6 border-2 border-blue-200 rounded-xl bg-blue-50 relative z-30 shadow-xl">
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div><label className="block text-xs font-bold mb-1">CREDIT CARD *</label>
                  <select id="creditCard" className="w-full p-2 border rounded bg-white" value={formData.creditCard} onChange={handleInputChange} required>
                    <option value="">Select Card</option>
                    {creditCardOptions.map(opt => <option key={opt.id} value={opt.name}>{opt.name}</option>)}
                  </select>
                </div>
                <div><label className="block text-xs font-bold mb-1">VENDOR ID *</label>
                  <select className="w-full p-2 border rounded bg-white" value={formData.vendorId} onChange={handleVendorChange} required>
                    <option value="">Select Vendor</option>
                    {vendorOptions.map(v => <option key={v.vendor_id} value={v.vendor_id}>{v.vendor_id}</option>)}
                  </select>
                </div>
                <div><label className="block text-xs font-bold mb-1 text-gray-400 uppercase">Vendor Name (Auto)</label>
                  <input className="w-full p-2 border rounded bg-gray-100" value={formData.vendorName} readOnly />
                </div>
                <div><label className="block text-xs font-bold mb-1">CONTRACT *</label>
                  <select id="contractShortName" className="w-full p-2 border rounded bg-white" value={formData.contractShortName} onChange={handleInputChange} required>
                    <option value="">Select Contract</option>
                    {contractOptions.map(opt => <option key={opt.id} value={opt.name}>{opt.name}</option>)}
                  </select>
                </div>
                <div><label className="block text-xs font-bold mb-1 text-blue-700 ">NOTIFY PM *</label>
                  <select id="pmEmail" className="w-full p-2 border rounded bg-white" value={formData.pmEmail} onChange={handleInputChange} required>
                    <option value="">Select PM</option>
                    {pmEmailOptions.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
                <div><label className="block text-xs font-bold mb-1 uppercase">Amount *</label><input id="chargeAmount" type="number" step="0.01" className="w-full p-2 border rounded bg-white" value={formData.chargeAmount} onChange={handleInputChange} required /></div>
                <div><label className="block text-xs font-bold mb-1 uppercase">Date *</label><input id="chargeDate" type="date" className="w-full p-2 border rounded bg-white" value={formData.chargeDate} onChange={handleInputChange} required /></div>
                <div><label className="block text-xs font-bold mb-1 uppercase">PDF Path *</label><input id="pdfFilePath" type="text" className="w-full p-2 border rounded bg-white" value={formData.pdfFilePath} onChange={handleInputChange} required /></div>
              </div>

              <div><label className="block text-xs font-bold mb-1 uppercase text-gray-500">Notes / Reason</label>
                <textarea id="notes" rows="1" className={`w-full p-2 border rounded bg-white ${userName === 'Revolve' && formData.status === 'Rejected' ? 'border-red-500' : ''}`} value={formData.notes} onChange={handleInputChange} />
              </div>

              {/* Status Section */}
              <div className="p-4 bg-white border-2 border-dashed rounded-lg flex flex-wrap items-center justify-between gap-4">
                <div className="flex gap-2">
                  <button type="button" onClick={() => setStatus('Submitted')} className={`px-4 py-2 rounded font-bold text-xs transition-all ${formData.status === 'Submitted' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>SUBMITTED</button>
                  <button type="button" onClick={() => setStatus('Approved')} className={`px-4 py-2 rounded font-bold text-xs transition-all ${formData.status === 'Approved' ? 'bg-green-600 text-white shadow-md' : 'bg-gray-100 text-gray-400'} ${userName !== 'Revolve' ? 'opacity-30' : ''}`}>APPROVE</button>
                  <button type="button" onClick={() => setStatus('Rejected')} className={`px-4 py-2 rounded font-bold text-xs transition-all ${formData.status === 'Rejected' ? 'bg-red-600 text-white shadow-md' : 'bg-gray-100 text-gray-400'} ${userName !== 'Revolve' ? 'opacity-30' : ''}`}>REJECT</button>
                </div>
                <div className="flex gap-2">
                   <button type="button" onClick={resetForm} className="px-6 py-2 bg-gray-200 rounded font-bold text-xs">CANCEL</button>
                   <button type="submit" className="bg-blue-600 text-white px-8 py-2 rounded font-bold shadow-lg hover:bg-blue-700 transition flex items-center gap-2"><Save size={18}/> SAVE RECORD</button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Search Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-gray-100 p-4 rounded-lg mb-6 gap-3">
            <div className="flex items-center border rounded-lg bg-white flex-grow">
                <select value={searchColumn} onChange={(e) => setSearchColumn(e.target.value)} className="p-2 bg-transparent border-r text-sm">
                    {searchableColumns.map(col => <option key={col.key} value={col.key}>{col.name}</option>)}
                </select>
                <input type="text" placeholder="Search credit card entries..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)} className="w-full p-2 text-sm outline-none" />
                <Search size={18} className="text-gray-400 mr-3" />
            </div>
            <label className="flex items-center cursor-pointer gap-2 text-sm font-bold">
                Latest Only
                <input type="checkbox" checked={showOnlyLatest} onChange={(e) => setShowOnlyLatest(e.target.checked)} className="w-4 h-4" />
            </label>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
            {!isAdding && !editingEntry && <button onClick={() => { resetForm(); setIsAdding(true); }} className="bg-yellow-500 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold shadow-md hover:bg-yellow-600 transition"><Plus size={20}/> Add</button>}
            <button onClick={() => alert("Notification sent to selected items")} className="bg-yellow-500 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold shadow-md hover:bg-yellow-600 transition"><Send size={20}/> Notify Selection </button>
            <button disabled={selectedRows.size !== 1} onClick={startEdit} className="bg-gray-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 disabled:opacity-50 font-bold transition"><Pencil size={20}/> Edit</button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border rounded-lg shadow-sm">
          <table className="min-w-full divide-y text-sm">
            <thead className="bg-gray-50 uppercase font-bold text-gray-600">
              <tr>
                <th className="p-4 w-12 text-center"></th>
                <th className="px-6 py-3 text-left">Record</th>
                <th className="px-6 py-3 text-left">Credit Card</th>
                <th className="px-6 py-3 text-left">Vendor Name</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y">
              {groupedEntries.map(group => {
                const baseKey = String(group[0].prime_key || group[0].primeKey || '').split('.')[0];
                const hasHistory = group.length > 1;
                return (
                  <React.Fragment key={group[0].id}>
                    <tr onClick={() => { const s = new Set(); s.add(group[0].id); setSelectedRows(s); }} className={`hover:bg-blue-50 cursor-pointer ${selectedRows.has(group[0].id) ? 'bg-blue-50' : ''}`}>
                      <td className="p-4 text-center"><input type="checkbox" checked={selectedRows.has(group[0].id)} readOnly /></td>
                      <td className="px-6 py-3 ">
                        {hasHistory && (
                          <button onClick={(e) => { e.stopPropagation(); const next = new Set(expandedRows); next.has(baseKey) ? next.delete(baseKey) : next.add(baseKey); setExpandedRows(next); }} className="mr-2">
                            {expandedRows.has(baseKey) ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
                          </button>
                        )}
                        {group[0].prime_key || group[0].primeKey}
                      </td>
                      <td className="px-6 py-3">{group[0].credit_card || group[0].creditCard}</td>
                      <td className="px-6 py-3">{group[0].vendor_name || group[0].vendorName}</td>
                      <td className="px-6 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${group[0].status === 'Approved' ? 'bg-green-100 text-green-700' : group[0].status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>{group[0].status || 'Submitted'}</span>
                      </td>
                      {/* <td className="px-6 py-3 font-black">${parseFloat(group[0].charge_amount || 0).toFixed(2)}</td> */}
                      <td className="px-6 py-3 font-black">${parseFloat(group[0].charge_amount || group[0].chargeAmount || 0).toFixed(2)}</td>

                    </tr>
                    {/* History Rows Logic */}
                    {expandedRows.has(baseKey) && group.slice(1).map(hEntry => (
                      <tr key={hEntry.id} className="bg-gray-50 italic text-gray-400 border-l-4 border-yellow-400">
                        <td className="p-4"></td>
                        <td className="px-6 py-3 pl-12 font-bold">{hEntry.prime_key || hEntry.primeKey}</td>
                        <td className="px-6 py-3">{hEntry.credit_card || hEntry.creditCard}</td>
                        <td className="px-6 py-3">{hEntry.vendor_name || hEntry.vendorName}</td>
                        <td className="px-6 py-3 uppercase text-xs">{hEntry.status || 'Submitted'}</td>
                        <td className="px-6 py-3">${parseFloat(hEntry.charge_amount || 0).toFixed(2)}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CreditCardExpenses;

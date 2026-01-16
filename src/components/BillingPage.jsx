import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Pencil, Download, Search, LogOut, X, Save } from 'lucide-react';
import * as XLSX from 'xlsx';

const formatDateForDisplay = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return 'Invalid Date';
  return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'UTC' });
};

const BillingPage = ({ 
  dataEntries, 
  isLoading, 
  error, 
  userName = 'User', 
  userAvatar, 
  handleLogout, 
  currentUserRole,
  currentUserId,
  onDataChanged 
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [isExporting, setIsExporting] = useState(false);
  
  // --- DEMO CACHE LOGIC ---
  const [localEntries, setLocalEntries] = useState([]);

  // Mock initial billing data for demo
  const dummyBilling = [
    { id: 'b1', invoiceNo: 'INV-2025-001', clientName: 'Vertex Solutions', amount: 4500.00, billingDate: '2026-01-01', dueDate: '2026-02-01', status: 'Paid', submitter: 'Admin' },
    { id: 'b2', invoiceNo: 'INV-2025-002', clientName: 'Nexus Corp', amount: 1250.50, billingDate: '2026-01-10', dueDate: '2026-02-10', status: 'Pending', submitter: 'Admin' }
  ];

  useEffect(() => {
    // Merge live entries (filtered by category if available) with dummy data
    const liveBilling = (dataEntries || []).filter(en => en.category === 'billing');
    setLocalEntries([...dummyBilling, ...liveBilling]);
  }, [dataEntries]);

  // Inline Form State
  const [isAdding, setIsAdding] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [formData, setFormData] = useState({
    invoiceNo: '',
    clientName: '',
    amount: '',
    billingDate: '',
    dueDate: '',
    status: 'Pending',
    notes: ''
  });

  const filteredEntries = useMemo(() => {
    return localEntries.filter(entry => 
      Object.values(entry).some(val => String(val).toLowerCase().includes(searchValue.toLowerCase()))
    );
  }, [localEntries, searchValue]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const resetForm = () => {
    setFormData({ invoiceNo: '', clientName: '', amount: '', billingDate: '', dueDate: '', status: 'Pending', notes: '' });
    setIsAdding(false);
    setEditingEntry(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const newRecord = {
      ...formData,
      id: editingEntry ? editingEntry.id : Date.now(),
      submitter: userName,
      category: 'billing'
    };

    // Immediate Cache Update
    if (editingEntry) {
      setLocalEntries(prev => prev.map(en => en.id === editingEntry.id ? newRecord : en));
    } else {
      setLocalEntries(prev => [newRecord, ...prev]);
    }

    // Backend API Call (Sync)
    try {
      const method = editingEntry ? 'PATCH' : 'POST';
      const url = editingEntry ? `${import.meta.env.VITE_API_BASE_URL}/entries/${editingEntry.id}` : `${import.meta.env.VITE_API_BASE_URL}/entries/new`;
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userId: currentUserId, submitter: userName, category: 'billing' }),
      });
      if (onDataChanged) onDataChanged();
    } catch (err) {
      console.warn("Backend save skipped/failed, keeping local cache for demo.");
    }
    resetForm();
  };

  const startEdit = () => {
    const entryId = Array.from(selectedRows)[0];
    const entry = localEntries.find(e => e.id === entryId);
    if (entry) {
      setEditingEntry(entry);
      setFormData({
        invoiceNo: entry.invoiceNo || '',
        clientName: entry.clientName || '',
        amount: entry.amount || '',
        billingDate: entry.billingDate || '',
        dueDate: entry.dueDate || '',
        status: entry.status || 'Pending',
        notes: entry.notes || ''
      });
      setIsAdding(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 sm:p-6 lg:p-8 text-gray-100 flex justify-center items-start">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-full text-gray-800">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-3xl font-extrabold text-lime-800">Billing Management</h1>
          <div className="flex items-center gap-4">
            <img src="/Lumina_logo.png" alt="Logo" className="h-10 pr-4" />
            <div className="flex items-center gap-3 bg-gray-100 p-2 rounded-lg text-gray-700">
              <img src={userAvatar} alt="Avatar" className="w-10 h-10 rounded-full border" />
              <span className="font-medium">Welcome, {userName}</span>
            </div>
            <button onClick={handleLogout} className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"><LogOut size={20}/></button>
          </div>
        </div>

        {/* Inline Form */}
        {(isAdding || editingEntry) && (
          <div className="mb-8 p-6 border-2 border-purple-200 rounded-xl bg-purple-50 animate-in fade-in slide-in-from-top-4">
            <div className="flex justify-between items-center mb-4 text-purple-900">
              <h2 className="text-xl font-bold">{editingEntry ? 'Edit Invoice' : 'Generate New Invoice'}</h2>
              <button onClick={resetForm} className="text-gray-500 hover:text-red-500"><X /></button>
            </div>
            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1">INVOICE NO *</label>
                <input id="invoiceNo" type="text" className="w-full p-2 border rounded" value={formData.invoiceNo} onChange={handleInputChange} required />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">CLIENT NAME *</label>
                <input id="clientName" type="text" className="w-full p-2 border rounded" value={formData.clientName} onChange={handleInputChange} required />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">AMOUNT *</label>
                <input id="amount" type="number" step="0.01" className="w-full p-2 border rounded" value={formData.amount} onChange={handleInputChange} required />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">STATUS</label>
                <select id="status" className="w-full p-2 border rounded" value={formData.status} onChange={handleInputChange}>
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">BILLING DATE *</label>
                <input id="billingDate" type="date" className="w-full p-2 border rounded" value={formData.billingDate} onChange={handleInputChange} required />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">DUE DATE *</label>
                <input id="dueDate" type="date" className="w-full p-2 border rounded" value={formData.dueDate} onChange={handleInputChange} required />
              </div>
              <div className="lg:col-span-2">
                <label className="block text-xs font-bold mb-1">NOTES</label>
                <input id="notes" type="text" className="w-full p-2 border rounded" value={formData.notes} onChange={handleInputChange} />
              </div>
              <div className="lg:col-span-4 flex justify-end">
                <button type="submit" className="bg-purple-600 text-white px-8 py-2 rounded-lg hover:bg-purple-700 transition flex items-center gap-2">
                  <Save size={18}/> {editingEntry ? 'Update' : 'Save Invoice'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-gray-100 p-4 rounded-lg mb-6 gap-3">
          <div className="flex items-center border rounded-lg bg-white flex-grow">
            <Search size={18} className="text-gray-400 ml-3" />
            <input type="text" placeholder="Search invoices..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)} className="w-full p-2 text-sm focus:outline-none" />
          </div>
          <div className="flex gap-2">
            <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 bg-yellow-500 text-white px-5 py-2.5 rounded-lg hover:bg-yellow-600 transition"><Plus size={20}/> Add</button>
            <button onClick={startEdit} disabled={selectedRows.size !== 1} className="flex items-center gap-2 bg-gray-600 text-white px-5 py-2.5 rounded-lg disabled:opacity-50"><Pencil size={20}/> Edit</button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 w-12 text-center">
                  <input type="checkbox" onChange={(e) => setSelectedRows(e.target.checked ? new Set(filteredEntries.map(en => en.id)) : new Set())} checked={filteredEntries.length > 0 && selectedRows.size === filteredEntries.length} />
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Invoice No</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Client</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Billing Date</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Due Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y">
              {filteredEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-purple-50 transition-colors">
                  <td className="p-4 text-center">
                    <input type="checkbox" checked={selectedRows.has(entry.id)} onChange={() => {
                       const next = new Set(selectedRows);
                       next.has(entry.id) ? next.delete(entry.id) : next.add(entry.id);
                       setSelectedRows(next);
                    }} />
                  </td>
                  <td className="px-6 py-3 text-sm font-bold text-gray-900">{entry.invoiceNo}</td>
                  <td className="px-6 py-3 text-sm text-gray-700">{entry.clientName}</td>
                  <td className="px-6 py-3 text-sm text-gray-700 font-semibold">${parseFloat(entry.amount).toFixed(2)}</td>
                  <td className="px-6 py-3 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      entry.status === 'Paid' ? 'bg-green-100 text-green-700' : 
                      entry.status === 'Overdue' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {entry.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">{formatDateForDisplay(entry.billingDate)}</td>
                  <td className="px-6 py-3 text-sm text-gray-700">{formatDateForDisplay(entry.dueDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
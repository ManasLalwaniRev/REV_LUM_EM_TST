import React, { useState, useMemo, useEffect } from 'react';
import { ChevronDown, ChevronRight, Plus, Pencil, Download, Search, LogOut, X, Save, Mail } from 'lucide-react';

const formatDateForDisplay = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return 'Invalid Date';
  return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'UTC' });
};

const EmailRecords = ({ 
  dataEntries = [], 
  isLoading, 
  error, 
  userName = 'User', 
  userAvatar, 
  handleLogout, 
  currentUserRole,
  currentUserId,
  onDataChanged,
  contractOptions = []
}) => {
  const [searchColumn, setSearchColumn] = useState('all');
  const [searchValue, setSearchValue] = useState('');
  const [showOnlyLatest, setShowOnlyLatest] = useState(false);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [isAdding, setIsAdding] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  const [formData, setFormData] = useState({
    contractShortName: '',
    vendorName: '',
    subject: '',
    emailDate: '',
    sender: '',
    recipient: '',
    notes: '',
    pdfFilePath: '',
  });

  const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/email-records`;

  const searchableColumns = [
    { key: 'all', name: 'All Fields' },
    { key: 'subject', name: 'Subject' },
    { key: 'sender', name: 'Sender' },
    { key: 'vendorName', name: 'Vendor' },
    { key: 'contractShortName', name: 'Contract' },
  ];

  // --- Grouping, Sorting, and Search Logic ---
  const groupedEntries = useMemo(() => {
    const groups = (dataEntries || []).reduce((acc, entry) => {
      const baseKey = String(entry.primeKey).split('.')[0];
      if (!acc[baseKey]) acc[baseKey] = [];
      acc[baseKey].push(entry);
      return acc;
    }, {});

    for (const key in groups) {
      groups[key].sort((a, b) => parseFloat(b.primeKey) - parseFloat(a.primeKey));
    }

    let filteredGroups = Object.values(groups);

    if (searchValue) {
      const lowercasedValue = searchValue.toLowerCase();
      filteredGroups = filteredGroups.filter(group =>
        group.some(entry => {
          if (searchColumn === 'all') {
            return Object.values(entry).some(value => 
              String(value || '').toLowerCase().includes(lowercasedValue)
            );
          } else {
            return String(entry[searchColumn] || '').toLowerCase().includes(lowercasedValue);
          }
        })
      );
    }

    return showOnlyLatest ? filteredGroups.map(group => [group[0]]) : filteredGroups;
  }, [dataEntries, searchColumn, searchValue, showOnlyLatest]);

  const visibleEntryIds = useMemo(() => groupedEntries.flat().map(entry => entry.id), [groupedEntries]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const resetForm = () => {
    setFormData({ contractShortName: '', vendorName: '', subject: '', emailDate: '', sender: '', recipient: '', notes: '', pdfFilePath: '' });
    setIsAdding(false);
    setEditingEntry(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const method = editingEntry ? 'PATCH' : 'POST';
    const url = editingEntry ? `${API_BASE_URL}/${editingEntry.id}` : `${API_BASE_URL}/new`;
    
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userId: currentUserId }),
      });
      if (res.ok) {
        onDataChanged();
        resetForm();
      }
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  const Row = ({ entry, isHistory = false }) => (
    <React.Fragment>
      <td className="p-0 text-center">
        <label className="flex items-center justify-center p-4 cursor-pointer">
          <input type="checkbox" checked={selectedRows.has(entry.id)} onChange={() => {
            const next = new Set(selectedRows);
            next.has(entry.id) ? next.delete(entry.id) : next.add(entry.id);
            setSelectedRows(next);
          }} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
        </label>
      </td>
      <td className={`px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900 ${isHistory ? 'pl-12' : ''}`}>
        {!isHistory && groupedEntries.find(g => g[0].id === entry.id)?.length > 1 ? (
          <button onClick={() => {
            const baseKey = String(entry.primeKey).split('.')[0];
            const next = new Set(expandedRows);
            next.has(baseKey) ? next.delete(baseKey) : next.add(baseKey);
            setExpandedRows(next);
          }} className="mr-2 inline-block">
            {expandedRows.has(String(entry.primeKey).split('.')[0]) ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
          </button>
        ) : isHistory ? null : <span className="w-6 inline-block"/>}
        {entry.primeKey}
      </td>
      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">{entry.contractShortName}</td>
      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700 font-semibold">{entry.subject}</td>
      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">{entry.sender}</td>
      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">{formatDateForDisplay(entry.emailDate)}</td>
      <td className="px-6 py-3 whitespace-nowrap text-sm text-blue-600">
        {entry.pdfFilePath ? <a href={entry.pdfFilePath} target="_blank" rel="noreferrer" className="hover:underline">View PDF</a> : 'N/A'}
      </td>
    </React.Fragment>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 sm:p-6 lg:p-8 text-gray-100 flex justify-center items-start">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-full text-gray-800">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-3xl font-extrabold text-blue-900 flex items-center gap-3"><Mail size={32}/> Email Records</h1>
          <div className="flex items-center gap-4">
            <img src="/Lumina_logo.png" alt="Logo" className="h-10 pr-4" />
            <div className="flex items-center gap-3 bg-gray-100 p-2 rounded-lg">
              <img src={userAvatar} alt="Avatar" className="w-10 h-10 rounded-full border" />
              <span className="font-medium text-gray-700">Welcome, {userName}</span>
            </div>
            <button onClick={handleLogout} className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"><LogOut size={20}/></button>
          </div>
        </div>

        {/* Inline Form */}
        {(isAdding || editingEntry) && (
          <div className="mb-8 p-6 border-2 border-blue-200 rounded-xl bg-blue-50">
            <div className="flex justify-between items-center mb-4 text-blue-900">
              <h2 className="text-xl font-bold">{editingEntry ? 'Edit Email Record' : 'Add New Email Record'}</h2>
              <button onClick={resetForm} className="text-gray-500 hover:text-red-500"><X /></button>
            </div>
            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-2">
                <label className="block text-xs font-bold mb-1">SUBJECT *</label>
                <input id="subject" type="text" className="w-full p-2 border rounded" value={formData.subject} onChange={handleInputChange} required />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">CONTRACT *</label>
                <select id="contractShortName" className="w-full p-2 border rounded" value={formData.contractShortName} onChange={handleInputChange} required>
                  <option value="">Select Contract</option>
                  {contractOptions.map(opt => <option key={opt.id} value={opt.name}>{opt.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">EMAIL DATE *</label>
                <input id="emailDate" type="date" className="w-full p-2 border rounded" value={formData.emailDate} onChange={handleInputChange} required />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">SENDER *</label>
                <input id="sender" type="text" className="w-full p-2 border rounded" value={formData.sender} onChange={handleInputChange} required />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">RECIPIENT *</label>
                <input id="recipient" type="text" className="w-full p-2 border rounded" value={formData.recipient} onChange={handleInputChange} required />
              </div>
              <div className="lg:col-span-2">
                <label className="block text-xs font-bold mb-1">PDF PATH</label>
                <input id="pdfFilePath" type="text" className="w-full p-2 border rounded" value={formData.pdfFilePath} onChange={handleInputChange} />
              </div>
              <div className="lg:col-span-4 flex justify-end">
                <button type="submit" className="bg-blue-600 text-white px-8 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                  <Save size={18}/> {editingEntry ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-gray-100 p-4 rounded-lg mb-6 gap-3">
          <div className="flex items-center border rounded-lg bg-white flex-grow">
            <select value={searchColumn} onChange={(e) => setSearchColumn(e.target.value)} className="p-2 bg-transparent border-r text-sm">
              {searchableColumns.map(col => <option key={col.key} value={col.key}>{col.name}</option>)}
            </select>
            <input type="text" placeholder="Search emails..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)} className="w-full p-2 text-sm focus:outline-none" />
            <Search size={18} className="text-gray-400 mr-3" />
          </div>
          <label className="flex items-center cursor-pointer gap-3 text-sm font-medium text-gray-700">
            Show Latest Only
            <input type="checkbox" checked={showOnlyLatest} onChange={(e) => setShowOnlyLatest(e.target.checked)} className="w-4 h-4" />
          </label>
        </div>

        <div className="flex gap-3 mb-6">
          <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition"><Plus size={20}/> Add New</button>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
              <tr>
                <th className="p-4 w-12 text-center"><input type="checkbox" onChange={(e) => setSelectedRows(e.target.checked ? new Set(visibleEntryIds) : new Set())} /></th>
                <th className="px-6 py-3 text-left">Record No</th>
                <th className="px-6 py-3 text-left">Contract</th>
                <th className="px-6 py-3 text-left">Subject</th>
                <th className="px-6 py-3 text-left">Sender</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">PDF</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y">
              {groupedEntries.length > 0 ? groupedEntries.map((group) => (
                <React.Fragment key={group[0].id}>
                  <tr className="hover:bg-blue-50"><Row entry={group[0]} /></tr>
                  {expandedRows.has(String(group[0].primeKey).split('.')[0]) && group.slice(1).map(h => (
                    <tr key={h.id} className="bg-gray-50 border-l-4 border-blue-400"><Row entry={h} isHistory={true} /></tr>
                  ))}
                </React.Fragment>
              )) : <tr><td colSpan="7" className="p-6 text-center italic text-gray-500">No email records found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmailRecords;
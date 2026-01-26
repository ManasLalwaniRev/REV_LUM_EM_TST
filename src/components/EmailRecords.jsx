import React, { useState, useMemo, useEffect } from 'react';
import { ChevronDown, ChevronRight, Plus, Pencil, Search, LogOut, X, Save, Mail, Copy, Check } from 'lucide-react';

const formatDateForDisplay = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
};

const EmailRecords = ({ 
  dataEntries = [], 
  isLoading, 
  userName = 'User', 
  userAvatar, 
  handleLogout, 
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
  const [copied, setCopied] = useState(false);

  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    subject: '',
    recipient: '', // Sent To
    task: '',
    bodyType: '',
    bodyContent: '',
    contractShortName: '',
    sender: userName,
    pdfFilePath: '',
  });

  // Dynamic Body Templates
  const bodyTemplates = {
    'Report': `Dear Team,\n\nPlease find the attached report for your review.\n\nBest regards,\n${userName}`,
    'Approver': `Hi,\n\nThis record has been submitted and is awaiting your approval.\n\nRegards,\n${userName}`,
    'Verification': `Hello,\n\nPlease verify the details of this communication as requested.\n\nThank you,\n${userName}`,
    'Correction': `Hi,\n\nA correction has been made to the previously submitted task. Please review the updated details.\n\nBest,\n${userName}`
  };

  const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/email-records`;

  const searchableColumns = [
    { key: 'all', name: 'All Fields' },
    { key: 'subject', name: 'Subject' },
    { key: 'recipient', name: 'Sent To' },
    { key: 'task', name: 'Task' }
  ];

  // --- GROUPING & SEARCH LOGIC ---
  const groupedEntries = useMemo(() => {
    if (!dataEntries || !Array.isArray(dataEntries)) return [];

    const safeIncludes = (val, search) => {
      if (val === null || val === undefined) return false;
      return String(val).toLowerCase().includes(search.toLowerCase());
    };

    const groups = dataEntries.reduce((acc, entry) => {
      const pk = entry.primeKey || entry.prime_key || "0";
      const baseKey = String(pk).split('.')[0];
      if (!acc[baseKey]) acc[baseKey] = [];
      acc[baseKey].push(entry);
      return acc;
    }, {});

    for (const key in groups) {
      groups[key].sort((a, b) => parseFloat(b.primeKey || b.prime_key) - parseFloat(a.primeKey || a.prime_key));
    }

    let filteredGroups = Object.values(groups);

    if (searchValue.trim()) {
      const term = searchValue.toLowerCase();
      filteredGroups = filteredGroups.filter(group =>
        group.some(entry => {
          if (searchColumn === 'all') {
            return Object.values(entry).some(val => safeIncludes(val, term));
          } else {
            return safeIncludes(entry[searchColumn], term);
          }
        })
      );
    }

    return showOnlyLatest ? filteredGroups.map(group => [group[group.length - 1]]) : filteredGroups;
  }, [dataEntries, searchColumn, searchValue, showOnlyLatest]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [id]: value };
      if (id === 'bodyType') {
        newData.bodyContent = bodyTemplates[value] || '';
      }
      return newData;
    });
  };

  const resetForm = () => {
    setFormData({ subject: '', recipient: '', task: '', bodyType: '', bodyContent: '', contractShortName: '', sender: userName, pdfFilePath: '' });
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
    } catch (err) { console.error("Save error:", err); }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formData.bodyContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const Row = ({ entry, isHistory = false }) => (
    <React.Fragment>
      <td className="p-4 text-center">
        <input type="checkbox" checked={selectedRows.has(entry.id)} onChange={() => {
          const next = new Set(selectedRows);
          next.has(entry.id) ? next.delete(entry.id) : next.add(entry.id);
          setSelectedRows(next);
        }} className="h-4 w-4 rounded border-gray-300 text-blue-600"/>
      </td>
      <td className={`px-6 py-3 text-sm font-medium ${isHistory ? 'pl-12 text-gray-400 italic' : 'text-gray-900'}`}>
        {!isHistory && (groupedEntries.find(g => g[0].id === entry.id)?.length > 1) && (
          <button onClick={() => {
            const base = String(entry.primeKey || entry.prime_key).split('.')[0];
            const next = new Set(expandedRows);
            next.has(base) ? next.delete(base) : next.add(base);
            setExpandedRows(next);
          }} className="mr-2">
            {expandedRows.has(String(entry.primeKey || entry.prime_key).split('.')[0]) ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
          </button>
        )}
        {entry.primeKey || entry.prime_key}
      </td>
      <td className="px-6 py-3 text-sm">{entry.subject}</td>
      <td className="px-6 py-3 text-sm">{entry.recipient}</td>
      <td className="px-6 py-3 text-sm">{entry.task}</td>
      <td className="px-6 py-3 text-sm">{entry.sender}</td>
      <td className="px-6 py-3 text-sm font-bold text-blue-600">
        {entry.pdfFilePath ? <a href={entry.pdfFilePath} target="_blank" rel="noreferrer">View PDF</a> : 'N/A'}
      </td>
    </React.Fragment>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-extrabold text-blue-900 flex items-center gap-2"><Mail /> Email Records</h1>
          <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border">
            <img src={userAvatar} className="w-10 h-10 rounded-full border" alt="avatar" />
            <span className="font-semibold text-gray-700">{userName}</span>
            <button onClick={handleLogout} className="p-2 text-red-500 hover:bg-red-50 rounded-full"><LogOut size={20}/></button>
          </div>
        </div>

        {/* Action Form */}
        {(isAdding || editingEntry) && (
          <div className="mb-8 p-6 bg-blue-50/50 border-2 border-blue-100 rounded-xl animate-in slide-in-from-top-2">
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-bold text-blue-800">{editingEntry ? 'Edit Record' : 'Create New Email Record'}</h2>
              <button onClick={resetForm} className="text-gray-400 hover:text-red-500"><X /></button>
            </div>
            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-2">
                <label className="text-xs font-bold uppercase text-gray-500">Subject *</label>
                <input id="subject" type="text" className="w-full p-2 border rounded mt-1" value={formData.subject} onChange={handleInputChange} required />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-gray-500">Sent To *</label>
                <input id="recipient" type="text" className="w-full p-2 border rounded mt-1" value={formData.recipient} onChange={handleInputChange} required />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-gray-500">Task *</label>
                <input id="task" type="text" className="w-full p-2 border rounded mt-1" value={formData.task} onChange={handleInputChange} required />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-gray-500">Body Type *</label>
                <select id="bodyType" className="w-full p-2 border rounded mt-1 bg-white" value={formData.bodyType} onChange={handleInputChange} required>
                  <option value="">Select Type</option>
                  <option value="Report">Report</option>
                  <option value="Approver">Approver</option>
                  <option value="Verification">Verification</option>
                  <option value="Correction">Correction</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-gray-500">Contract</label>
                <select id="contractShortName" className="w-full p-2 border rounded mt-1 bg-white" value={formData.contractShortName} onChange={handleInputChange}>
                  <option value="">N/A</option>
                  {contractOptions.map(opt => <option key={opt.id} value={opt.name}>{opt.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-gray-500">Sender</label>
                <input className="w-full p-2 border rounded mt-1 bg-gray-100" value={formData.sender} readOnly />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-gray-500">PDF Path</label>
                <input id="pdfFilePath" type="text" className="w-full p-2 border rounded mt-1" value={formData.pdfFilePath} onChange={handleInputChange} />
              </div>

              <div className="lg:col-span-4 mt-2">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold uppercase text-gray-500">Email Body Preview</label>
                  <button type="button" onClick={copyToClipboard} className="text-xs text-blue-600 flex items-center gap-1 font-bold">
                    {copied ? <><Check size={14}/> Copied</> : <><Copy size={14}/> Copy Text</>}
                  </button>
                </div>
                <textarea id="bodyContent" rows="4" className="w-full p-3 border rounded bg-white italic text-sm text-gray-600" value={formData.bodyContent} onChange={handleInputChange} />
              </div>

              <div className="lg:col-span-4 flex justify-end gap-3">
                <button type="submit" className="bg-blue-600 text-white px-10 py-2 rounded-lg font-bold hover:bg-blue-700 flex items-center gap-2">
                  <Save size={18}/> {editingEntry ? 'Update Version' : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex flex-grow items-center border rounded-lg bg-white overflow-hidden">
            <select value={searchColumn} onChange={(e) => setSearchColumn(e.target.value)} className="p-2 bg-gray-50 border-r text-sm outline-none">
              {searchableColumns.map(col => <option key={col.key} value={col.key}>{col.name}</option>)}
            </select>
            <input type="text" placeholder="Search records..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)} className="flex-grow p-2 text-sm outline-none" />
            <Search size={18} className="text-gray-400 mx-3" />
          </div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-600 cursor-pointer">
            <input type="checkbox" checked={showOnlyLatest} onChange={(e) => setShowOnlyLatest(e.target.checked)} className="rounded" />
            Show Latest Only
          </label>
          <button onClick={() => setIsAdding(true)} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2"><Plus size={20}/> Add New</button>
        </div>

        {/* Table */}
        <div className="border rounded-xl overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
              <tr>
                <th className="p-4 w-10"></th>
                <th className="px-6 py-3 text-left">Record No</th>
                <th className="px-6 py-3 text-left">Subject</th>
                <th className="px-6 py-3 text-left">Sent To</th>
                <th className="px-6 py-3 text-left">Task</th>
                <th className="px-6 py-3 text-left">Sender</th>
                <th className="px-6 py-3 text-left">PDF</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {groupedEntries.map(group => (
                <React.Fragment key={group[0].id}>
                  <tr className="hover:bg-blue-50/50 transition-colors"><Row entry={group[0]} /></tr>
                  {expandedRows.has(String(group[0].primeKey || group[0].prime_key).split('.')[0]) && group.slice(1).map(h => (
                    <tr key={h.id} className="bg-gray-50/50"><Row entry={h} isHistory={true} /></tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmailRecords;
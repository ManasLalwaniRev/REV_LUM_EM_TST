import React, { useState, useMemo, useEffect } from 'react';
import { ChevronDown, ChevronRight, Plus, Pencil, Download, Search, LogOut, X, Save, Mail, Copy, Check } from 'lucide-react';

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
  const [copied, setCopied] = useState(false);

  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    contractShortName: '',
    vendorName: '',
    subject: '',
    emailDate: new Date().toISOString().split('T')[0],
    sender: userName,
    recipient: '',
    task: '',
    bodyType: '',
    bodyContent: '',
    pdfFilePath: '',
  });

  // Body Templates Mapping
  const bodyTemplates = {
    'Report': `Dear Team,\n\nPlease find the attached report for your review.\n\nBest regards,\n${userName}`,
    'Approver': `Hi,\n\nThis record has been submitted and is awaiting your approval.\n\nRegards,\n${userName}`,
    'Verification': `Hello,\n\nPlease verify the details of the attached transaction.\n\nThank you,\n${userName}`,
    'Correction': `Hi,\n\nA correction has been made to the previously submitted record. Please review the updated details.\n\nBest,\n${userName}`
  };

  const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/email-records`;

  const searchableColumns = [
    { key: 'all', name: 'All Fields' },
    { key: 'subject', name: 'Subject' },
    { key: 'recipient', name: 'Sent To' },
    { key: 'task', name: 'Task' },
    { key: 'contractShortName', name: 'Contract' },
  ];

  // --- CRASH-PROOF SEARCH & GROUPING LOGIC ---
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
      groups[key].sort((a, b) => {
        const pkA = parseFloat(a.primeKey || a.prime_key || 0);
        const pkB = parseFloat(b.primeKey || b.prime_key || 0);
        return pkB - pkA;
      });
    }

    let filteredGroups = Object.values(groups);

    if (searchValue && searchValue.trim() !== '') {
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

    return showOnlyLatest ? filteredGroups.map(group => [group[0]]) : filteredGroups;
  }, [dataEntries, searchColumn, searchValue, showOnlyLatest]);

  const visibleEntryIds = useMemo(() => groupedEntries.flat().map(entry => entry.id), [groupedEntries]);

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
    setFormData({
      contractShortName: '', vendorName: '', subject: '', emailDate: new Date().toISOString().split('T')[0],
      sender: userName, recipient: '', task: '', bodyType: '', bodyContent: '', pdfFilePath: ''
    });
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
      console.error("Save error:", err);
    }
  };

  const copyToClipboard = () => {
    if (!formData.bodyContent) return;
    navigator.clipboard.writeText(formData.bodyContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
        {!isHistory && (groupedEntries.find(g => g[0].id === entry.id)?.length > 1) ? (
          <button onClick={() => {
            const baseKey = String(entry.primeKey || entry.prime_key).split('.')[0];
            const next = new Set(expandedRows);
            next.has(baseKey) ? next.delete(baseKey) : next.add(baseKey);
            setExpandedRows(next);
          }} className="mr-2 inline-block">
            {expandedRows.has(String(entry.primeKey || entry.prime_key).split('.')[0]) ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
          </button>
        ) : isHistory ? null : <span className="w-6 inline-block"/>}
        {entry.primeKey || entry.prime_key}
      </td>
      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">{entry.contractShortName}</td>
      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700 font-semibold">{entry.subject}</td>
      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">{entry.recipient}</td>
      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">{entry.task}</td>
      <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">{formatDateForDisplay(entry.emailDate)}</td>
      <td className="px-6 py-3 whitespace-nowrap text-sm text-blue-600">
        {entry.pdfFilePath ? <a href={entry.pdfFilePath} target="_blank" rel="noreferrer" className="hover:underline">View PDF</a> : 'N/A'}
      </td>
    </React.Fragment>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 sm:p-6 lg:p-8 text-gray-100 flex justify-center items-start">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-full text-gray-800">
        {/* Header */}
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
          <div className="mb-8 p-6 border-2 border-blue-200 rounded-xl bg-blue-50 animate-in fade-in slide-in-from-top-4">
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
                <label className="block text-xs font-bold mb-1">SENT TO (RECIPIENT) *</label>
                <input id="recipient" type="text" className="w-full p-2 border rounded" value={formData.recipient} onChange={handleInputChange} required />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">TASK *</label>
                <input id="task" type="text" className="w-full p-2 border rounded" value={formData.task} onChange={handleInputChange} placeholder="e.g. Monthly Audit" required />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">BODY TYPE *</label>
                <select id="bodyType" className="w-full p-2 border rounded bg-white" value={formData.bodyType} onChange={handleInputChange} required>
                  <option value="">Select Type</option>
                  <option value="Report">Report</option>
                  <option value="Approver">Approver</option>
                  <option value="Verification">Verification</option>
                  <option value="Correction">Correction</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">CONTRACT</label>
                <select id="contractShortName" className="w-full p-2 border rounded bg-white" value={formData.contractShortName} onChange={handleInputChange}>
                  <option value="">Select Contract</option>
                  {contractOptions.map(opt => <option key={opt.id} value={opt.name}>{opt.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">SENDER (AUTO)</label>
                <input id="sender" type="text" className="w-full p-2 border rounded bg-gray-100" value={formData.sender} readOnly />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">EMAIL DATE</label>
                <input id="emailDate" type="date" className="w-full p-2 border rounded" value={formData.emailDate} onChange={handleInputChange} />
              </div>

              <div className="lg:col-span-4">
                <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold uppercase">Email Body Preview</label>
                    <button type="button" onClick={copyToClipboard} className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-800 font-bold">
                        {copied ? <><Check size={14}/> Copied</> : <><Copy size={14}/> Copy Body</>}
                    </button>
                </div>
                <textarea id="bodyContent" rows="4" className="w-full p-3 border rounded bg-white italic text-gray-600 text-sm" value={formData.bodyContent} onChange={handleInputChange} placeholder="Select a Body Type to generate text..."/>
              </div>

              <div className="lg:col-span-4 flex justify-end gap-3 mt-2">
                <button type="button" onClick={resetForm} className="px-6 py-2 border rounded-lg text-gray-500 hover:bg-gray-50 font-bold">Cancel</button>
                <button type="submit" className="bg-blue-600 text-white px-8 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 font-bold transition-all">
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
            <input type="text" placeholder="Search email records..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)} className="w-full p-2 text-sm focus:outline-none" />
            <Search size={18} className="text-gray-400 mr-3" />
          </div>
          <label className="flex items-center cursor-pointer gap-3 text-sm font-medium text-gray-700">
            Show Latest Only
            <input type="checkbox" checked={showOnlyLatest} onChange={(e) => setShowOnlyLatest(e.target.checked)} className="w-4 h-4 rounded" />
          </label>
        </div>

        <div className="flex gap-3 mb-6">
          {!isAdding && !editingEntry && (
            <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition shadow-md font-bold">
                <Plus size={20}/> Add New Record
            </button>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="p-4 w-12 text-center">
                    <input type="checkbox" onChange={(e) => setSelectedRows(e.target.checked ? new Set(visibleEntryIds) : new Set())} checked={visibleEntryIds.length > 0 && selectedRows.size === visibleEntryIds.length} />
                </th>
                <th className="px-6 py-3 text-left">Record No</th>
                <th className="px-6 py-3 text-left">Contract</th>
                <th className="px-6 py-3 text-left">Subject</th>
                <th className="px-6 py-3 text-left">Sent To</th>
                <th className="px-6 py-3 text-left">Task</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">PDF</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {groupedEntries.length > 0 ? groupedEntries.map((group) => (
                <React.Fragment key={group[0].id}>
                  <tr className="hover:bg-blue-50 transition-colors"><Row entry={group[0]} /></tr>
                  {expandedRows.has(String(group[0].primeKey || group[0].prime_key).split('.')[0]) && group.slice(1).map(h => (
                    <tr key={h.id} className="bg-gray-50 border-l-4 border-blue-400 italic text-gray-500"><Row entry={h} isHistory={true} /></tr>
                  ))}
                </React.Fragment>
              )) : <tr><td colSpan="8" className="p-10 text-center italic text-gray-400">No email records found. Add a record to get started.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmailRecords;
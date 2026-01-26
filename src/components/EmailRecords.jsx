import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, Plus, Pencil, Search, LogOut, X, Save, Mail, Copy, Check } from 'lucide-react';

const formatDateForDisplay = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'UTC' });
};

const EmailRecords = ({ dataEntries = [], isLoading, userName, userAvatar, handleLogout, currentUserId, onDataChanged, contractOptions = [] }) => {
  const [searchColumn, setSearchColumn] = useState('all');
  const [searchValue, setSearchValue] = useState('');
  const [showOnlyLatest, setShowOnlyLatest] = useState(false);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [isAdding, setIsAdding] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    subject: '', recipient: '', task: '', bodyType: '', bodyContent: '', contractShortName: '', sender: userName, pdfFilePath: '', emailDate: new Date().toISOString().split('T')[0]
  });

  const bodyTemplates = {
    'Report': `Dear Team,\n\nPlease find the attached report for your review.\n\nBest regards,\n${userName}`,
    'Approver': `Hi,\n\nThis record is awaiting your approval.\n\nRegards,\n${userName}`,
    'Verification': `Hello,\n\nPlease verify the details of this communication.\n\nThank you,\n${userName}`,
    'Correction': `Hi,\n\nA correction has been made to the previously submitted record.\n\nBest,\n${userName}`
  };

  const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/email-records`;

  const groupedEntries = useMemo(() => {
    if (!dataEntries || !Array.isArray(dataEntries)) return [];
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
    let filtered = Object.values(groups);
    if (searchValue.trim()) {
      filtered = filtered.filter(g => g.some(e => String(Object.values(e)).toLowerCase().includes(searchValue.toLowerCase())));
    }
    return showOnlyLatest ? filtered.map(g => [g[g.length - 1]]) : filtered;
  }, [dataEntries, searchValue, showOnlyLatest]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [id]: value };
      if (id === 'bodyType') newData.bodyContent = bodyTemplates[value] || '';
      return newData;
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const method = editingEntry ? 'PATCH' : 'POST';
    const url = editingEntry ? `${API_BASE_URL}/${editingEntry.id}` : `${API_BASE_URL}/new`;
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, userId: currentUserId }),
    });
    if (res.ok) { onDataChanged(); resetForm(); }
  };

  const resetForm = () => {
    setFormData({ subject: '', recipient: '', task: '', bodyType: '', bodyContent: '', contractShortName: '', sender: userName, pdfFilePath: '', emailDate: new Date().toISOString().split('T')[0] });
    setIsAdding(false); setEditingEntry(null);
  };

  const Row = ({ entry, isHistory = false }) => (
    <React.Fragment>
      <td className="p-4 text-center">
        <input type="checkbox" checked={selectedRows.has(entry.id)} onChange={() => {
          const next = new Set(selectedRows);
          next.has(entry.id) ? next.delete(entry.id) : next.add(entry.id);
          setSelectedRows(next);
        }} />
      </td>
      <td className={`px-6 py-3 text-sm font-medium ${isHistory ? 'pl-12 text-gray-400 italic' : 'text-gray-900'}`}>
        {!isHistory && groupedEntries.find(g => g[0].id === entry.id)?.length > 1 && (
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
      <td className="px-6 py-3 text-sm font-bold">{entry.subject}</td>
      <td className="px-6 py-3 text-sm">{entry.recipient}</td>
      <td className="px-6 py-3 text-sm text-gray-500 max-w-xs truncate" title={entry.bodyContent || entry.body_content}>
        {entry.bodyContent || entry.body_content || '---'}
      </td>
      <td className="px-6 py-3 text-sm">{entry.task}</td>
      <td className="px-6 py-3 text-sm">{formatDateForDisplay(entry.emailDate)}</td>
      <td className="px-6 py-3 text-sm font-bold text-blue-600">
        {entry.pdfFilePath ? <a href={entry.pdfFilePath} target="_blank" rel="noreferrer">PDF</a> : 'N/A'}
      </td>
    </React.Fragment>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8 flex justify-center items-start">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full text-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-blue-900 flex items-center gap-3"><Mail size={32}/> Email Records</h1>
          <div className="flex items-center gap-3 bg-gray-100 p-2 rounded-lg border">
            <img src={userAvatar} className="w-10 h-10 rounded-full border" alt="avatar" />
            <span className="font-bold">{userName}</span>
            <button onClick={handleLogout} className="p-2 text-red-500"><LogOut size={20}/></button>
          </div>
        </div>

        {(isAdding || editingEntry) && (
          <form onSubmit={handleSave} className="mb-8 p-6 bg-blue-50 border-2 border-blue-100 rounded-xl grid grid-cols-1 md:grid-cols-4 gap-4 animate-in slide-in-from-top-2">
            <div className="md:col-span-2">
              <label className="text-xs font-bold uppercase text-gray-400">Subject *</label>
              <input id="subject" type="text" className="w-full p-2 border rounded" value={formData.subject} onChange={handleInputChange} required />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-gray-400">Sent To *</label>
              <input id="recipient" type="text" className="w-full p-2 border rounded" value={formData.recipient} onChange={handleInputChange} required />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-gray-400">Task *</label>
              <input id="task" type="text" className="w-full p-2 border rounded" value={formData.task} onChange={handleInputChange} required />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-gray-400">Body Type *</label>
              <select id="bodyType" className="w-full p-2 border rounded bg-white" value={formData.bodyType} onChange={handleInputChange} required>
                <option value="">Select Type</option>
                <option value="Report">Report</option>
                <option value="Approver">Approver</option>
                <option value="Verification">Verification</option>
                <option value="Correction">Correction</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-gray-400">Contract</label>
              <select id="contractShortName" className="w-full p-2 border rounded bg-white" value={formData.contractShortName} onChange={handleInputChange}>
                <option value="">N/A</option>
                {contractOptions.map(opt => <option key={opt.id} value={opt.name}>{opt.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-gray-400">Date</label>
              <input id="emailDate" type="date" className="w-full p-2 border rounded" value={formData.emailDate} onChange={handleInputChange} />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-gray-400">PDF Path</label>
              <input id="pdfFilePath" type="text" className="w-full p-2 border rounded" value={formData.pdfFilePath} onChange={handleInputChange} />
            </div>
            <div className="md:col-span-4 mt-2">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold uppercase text-gray-400">Body Preview</label>
                <button type="button" onClick={() => { navigator.clipboard.writeText(formData.bodyContent); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="text-xs text-blue-600 font-bold flex items-center gap-1">
                  {copied ? <Check size={14}/> : <Copy size={14}/>} {copied ? 'Copied' : 'Copy Text'}
                </button>
              </div>
              <textarea id="bodyContent" rows="3" className="w-full p-3 border rounded italic text-sm text-gray-600" value={formData.bodyContent} onChange={handleInputChange} />
            </div>
            <div className="md:col-span-4 flex justify-end gap-3">
              <button type="submit" className="bg-blue-600 text-white px-10 py-2 rounded-lg font-bold hover:bg-blue-700 flex items-center gap-2 shadow-lg"><Save size={18}/> Save Record</button>
            </div>
          </form>
        )}

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex flex-grow items-center border rounded-lg bg-white overflow-hidden shadow-sm">
            <select value={searchColumn} onChange={(e) => setSearchColumn(e.target.value)} className="p-2 bg-gray-50 border-r text-sm outline-none">
              <option value="all">All Fields</option>
              <option value="subject">Subject</option>
              <option value="recipient">Sent To</option>
              <option value="task">Task</option>
            </select>
            <input type="text" placeholder="Search records..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)} className="flex-grow p-2 text-sm outline-none" />
            <Search size={18} className="text-gray-400 mx-3" />
          </div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-600 cursor-pointer">
            <input type="checkbox" checked={showOnlyLatest} onChange={(e) => setShowOnlyLatest(e.target.checked)} className="rounded" /> Show Latest Only
          </label>
          <button onClick={() => setIsAdding(true)} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 shadow-md hover:bg-blue-700 transition-all"><Plus size={20}/> Add New</button>
        </div>

        <div className="border rounded-xl overflow-hidden shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
              <tr>
                <th className="p-4 w-10"></th>
                <th className="px-6 py-3 text-left">Record No</th>
                <th className="px-6 py-3 text-left">Subject</th>
                <th className="px-6 py-3 text-left">Sent To</th>
                <th className="px-6 py-3 text-left">Content Preview</th>
                <th className="px-6 py-3 text-left">Task</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">PDF</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {groupedEntries.map(group => (
                <React.Fragment key={group[0].id}>
                  <tr className="hover:bg-blue-50/50 transition-colors"><Row entry={group[0]} /></tr>
                  {expandedRows.has(String(group[0].primeKey || group[0].prime_key).split('.')[0]) && group.slice(1).map(h => (
                    <tr key={h.id} className="bg-gray-50/50 italic text-gray-500"><Row entry={h} isHistory={true} /></tr>
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
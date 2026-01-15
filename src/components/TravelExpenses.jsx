import React, { useState, useMemo } from 'react';
import { Plus, Pencil, Download, Search, LogOut, X, Save } from 'lucide-react';
import * as XLSX from 'xlsx';

const TravelExpenses = ({ 
  dataEntries, 
  isLoading, 
  error, 
  userName = 'User', 
  userAvatar, 
  handleLogout, 
  currentUserRole,
  onDataChanged // Callback to refresh global data in App.jsx
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [isExporting, setIsExporting] = useState(false);
  
  // Local state for Add/Edit features
  const [isAdding, setIsAdding] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [formData, setFormData] = useState({
    pdfFilePath: '',
    contractShortName: '',
    notes: ''
  });

  const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/entries`;

  // Filter entries to show only travel-related data if a category exists, 
  // otherwise show all entries with the new column mapping
  const filteredEntries = useMemo(() => {
    if (!dataEntries) return [];
    return dataEntries.filter(entry => 
      Object.values(entry).some(val => 
        String(val).toLowerCase().includes(searchValue.toLowerCase())
      )
    );
  }, [dataEntries, searchValue]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const resetForm = () => {
    setFormData({ pdfFilePath: '', contractShortName: '', notes: '' });
    setIsAdding(false);
    setEditingEntry(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const method = editingEntry ? 'PATCH' : 'POST';
    const url = editingEntry ? `${API_BASE_URL}/${editingEntry.id}` : `${API_BASE_URL}/new`;
    
    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData, 
          submitter: userName,
          category: 'travel' // Tagging as travel for future filtering
        }),
      });

      if (!response.ok) throw new Error('Failed to save travel expense');
      
      if (onDataChanged) onDataChanged(); // Refresh App.jsx data
      resetForm();
    } catch (err) {
      alert(err.message);
    }
  };

  const startEdit = () => {
    const entryId = Array.from(selectedRows)[0];
    const entry = dataEntries.find(e => e.id === entryId);
    if (entry) {
      setEditingEntry(entry);
      setFormData({
        pdfFilePath: entry.pdfFilePath || '',
        contractShortName: entry.contractShortName || '',
        notes: entry.notes || ''
      });
      setIsAdding(false);
    }
  };

  const handleExport = async () => {
    if (selectedRows.size > 0) {
      setIsExporting(true);
      try {
        const dataToExport = dataEntries.filter(entry => selectedRows.has(entry.id));
        const dataForSheet = dataToExport.map(entry => ({
          "Travel Form Path": entry.pdfFilePath,
          "Project for Travel": entry.contractShortName,
          "Notes": entry.notes,
          "Submitter": entry.submitter
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataForSheet);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "TravelExpenses");
        XLSX.writeFile(workbook, "TravelExpensesExport.xlsx");
      } catch (err) {
        console.error("Export error:", err);
      } finally {
        setIsExporting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 sm:p-6 lg:p-8 text-gray-100 flex justify-center items-start">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-full text-gray-800">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-3xl font-extrabold text-lime-800">Travel Expenses</h1>
          <div className="flex items-center gap-4">
            <img src="/Lumina_logo.png" alt="Logo" className="h-10 pr-4" />
            <div className="flex items-center gap-3 bg-gray-100 p-2 rounded-lg">
              <img src={userAvatar} alt="Avatar" className="w-10 h-10 rounded-full border" />
              <span className="font-medium text-gray-700">Welcome, {userName}</span>
            </div>
            <button onClick={handleLogout} className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200">
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Inline Add/Edit Form */}
        {(isAdding || editingEntry) && (
          <div className="mb-8 p-6 border-2 border-lime-200 rounded-xl bg-lime-50 animate-in fade-in slide-in-from-top-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-lime-900">
                {editingEntry ? 'Edit Travel Expense' : 'Add New Travel Expense'}
              </h2>
              <button onClick={resetForm} className="text-gray-500 hover:text-red-500"><X /></button>
            </div>
            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Project for Travel</label>
                <input 
                  id="contractShortName" type="text" required
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-lime-500"
                  value={formData.contractShortName} onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Attach Travel Form (Path/Link)</label>
                <input 
                  id="pdfFilePath" type="text" required
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-lime-500"
                  value={formData.pdfFilePath} onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Notes</label>
                <input 
                  id="notes" type="text"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-lime-500"
                  value={formData.notes} onChange={handleInputChange}
                />
              </div>
              <div className="md:col-span-3 flex justify-end">
                <button type="submit" className="flex items-center gap-2 bg-lime-600 text-white px-6 py-2 rounded-lg hover:bg-lime-700 transition">
                  <Save size={18} /> {editingEntry ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
          <div className="flex gap-2">
            {!isAdding && !editingEntry && (
              <button 
                onClick={() => setIsAdding(true)}
                className="flex items-center gap-2 bg-yellow-500 text-white px-5 py-2.5 rounded-lg hover:bg-yellow-600 transition"
              >
                <Plus size={20} /> Add
              </button>
            )}
            <button 
              onClick={startEdit}
              disabled={selectedRows.size !== 1}
              className="flex items-center gap-2 bg-gray-600 text-white px-5 py-2.5 rounded-lg hover:bg-gray-700 disabled:opacity-50 transition"
            >
              <Pencil size={20} /> Edit
            </button>
            <button onClick={handleExport} disabled={selectedRows.size === 0} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition">
              <Download size={20} /> Export {selectedRows.size > 0 && `(${selectedRows.size})`}
            </button>
          </div>
          
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" placeholder="Search travel..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-lime-500"
              value={searchValue} onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto rounded-lg border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 w-12">
                  <input 
                    type="checkbox" 
                    onChange={(e) => setSelectedRows(e.target.checked ? new Set(filteredEntries.map(en => en.id)) : new Set())}
                    checked={filteredEntries.length > 0 && selectedRows.size === filteredEntries.length}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Project for Travel</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Travel Form</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Notes</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Submitter</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y">
              {isLoading ? (
                <tr><td colSpan="5" className="text-center py-10">Loading travel records...</td></tr>
              ) : filteredEntries.length > 0 ? (
                filteredEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-lime-50 transition">
                    <td className="p-4 text-center">
                      <input 
                        type="checkbox" 
                        checked={selectedRows.has(entry.id)}
                        onChange={() => {
                          const next = new Set(selectedRows);
                          next.has(entry.id) ? next.delete(entry.id) : next.add(entry.id);
                          setSelectedRows(next);
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 font-medium">{entry.contractShortName}</td>
                    <td className="px-6 py-4">
                      {entry.pdfFilePath ? (
                        <a href={entry.pdfFilePath} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">View Form</a>
                      ) : 'No Form'}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{entry.notes || '—'}</td>
                    <td className="px-6 py-4 text-sm">{entry.submitter}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" className="text-center py-10 text-gray-500 italic">No travel expenses found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TravelExpenses;
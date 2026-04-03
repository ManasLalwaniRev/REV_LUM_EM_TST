
import React, { useState, useMemo } from 'react';
import { 
  Save, Search, LogOut, Mail, FileText, Book, AlertCircle, CheckCircle2, Loader, Clock
} from 'lucide-react';

// --- EXPANDED DATASET ---
const INITIAL_DATA = [
  // VENDOR EXPENSES
  { id: 1, primeKey: "V-101", moduleType: "vendor", contractShortName: "Cloud Services", vendorName: "Amazon AWS", chargeAmount: 1250.00, chargeDate: "2026-02-01", infoReceivedDate: "2026-02-01", dateProcessed: "2026-02-01", accountingProcessed: "T" },
  { id: 2, primeKey: "V-102", moduleType: "vendor", contractShortName: "Marketing", vendorName: "Google Ads", chargeAmount: 2500.00, chargeDate: "2026-02-05", infoReceivedDate: "2026-02-05", dateProcessed: "2026-02-07", accountingProcessed: "F" },
  { id: 3, primeKey: "V-103", moduleType: "vendor", contractShortName: "Logistics", vendorName: "FedEx", chargeAmount: 450.00, chargeDate: "2026-02-08", infoReceivedDate: "2026-02-08", dateProcessed: "2026-02-12", accountingProcessed: "T" },
  { id: 4, primeKey: "V-104", moduleType: "vendor", contractShortName: "Hardware", vendorName: "Apple Inc", chargeAmount: 3200.00, chargeDate: "2026-02-10", infoReceivedDate: "2026-02-10", dateProcessed: null, accountingProcessed: "F" },

  // EMAIL RECORDS
  { id: 5, primeKey: "E-201", moduleType: "email", subject: "Tax Query", recipient: "tax@co.com", task: "Clarification", emailDate: "2026-02-10", infoReceivedDate: "2026-02-10", dateProcessed: "2026-02-11", accountingProcessed: "F" },
  { id: 6, primeKey: "E-202", moduleType: "email", subject: "Payroll Sync", recipient: "hr@co.com", task: "Update", emailDate: "2026-02-11", infoReceivedDate: "2026-02-11", dateProcessed: "2026-02-13", accountingProcessed: "T" },
  { id: 7, primeKey: "E-203", moduleType: "email", subject: "Audit Docs", recipient: "audit@co.com", task: "Filing", emailDate: "2026-02-01", infoReceivedDate: "2026-02-01", dateProcessed: "2026-02-05", accountingProcessed: "F" },
  { id: 8, primeKey: "E-204", moduleType: "email", subject: "Vendor Setup", recipient: "procure@co.com", task: "Onboarding", emailDate: "2026-02-12", infoReceivedDate: "2026-02-12", dateProcessed: null, accountingProcessed: "F" },

  // BILLING
  { id: 9, primeKey: "B-301", moduleType: "bill", contractShortName: "Lease", invoiceNo: "INV-99", billingPeriod: "Feb 2026", amount: 5000.00, infoReceivedDate: "2026-02-01", dateProcessed: "2026-02-01", accountingProcessed: "T" },
  { id: 10, primeKey: "B-302", moduleType: "bill", contractShortName: "Utility", invoiceNo: "INV-100", billingPeriod: "Jan 2026", amount: 800.00, infoReceivedDate: "2026-02-01", dateProcessed: "2026-02-03", accountingProcessed: "T" },
  { id: 11, primeKey: "B-303", moduleType: "bill", contractShortName: "Insurance", invoiceNo: "INV-101", billingPeriod: "Annual", amount: 12000.00, infoReceivedDate: "2026-02-01", dateProcessed: "2026-02-10", accountingProcessed: "F" },
  { id: 12, primeKey: "B-304", moduleType: "bill", contractShortName: "Software", invoiceNo: "INV-102", billingPeriod: "Monthly", amount: 150.00, infoReceivedDate: "2026-02-10", dateProcessed: null, accountingProcessed: "F" },
];

const getAutoStatus = (infoDateStr, processDateStr) => {
  if (!infoDateStr || !processDateStr) return { text: 'Awaiting Dates', color: 'text-gray-400', bg: 'bg-gray-50' };
  const infoDate = new Date(infoDateStr);
  const processDate = new Date(processDateStr);
  const i = Date.UTC(infoDate.getUTCFullYear(), infoDate.getUTCMonth(), infoDate.getUTCDate());
  const p = Date.UTC(processDate.getUTCFullYear(), processDate.getUTCMonth(), processDate.getUTCDate());
  const diffDays = Math.floor((p - i) / (1000 * 60 * 60 * 24));

  if (diffDays > 2) return { text: 'Deadline crossed', color: 'text-red-600 font-bold', bg: 'bg-red-50' };
  if (diffDays === 2) return { text: 'On deadline', color: 'text-yellow-600 font-bold', bg: 'bg-yellow-50' };
  return { text: 'Before Deadline', color: 'text-green-600 font-bold', bg: 'bg-green-50' };
};

const formatDateForInput = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  return isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
};

const SLA = () => {
  const [dataEntries, setDataEntries] = useState(INITIAL_DATA);
  const [activeTab, setActiveTab] = useState('vendor');
  const [searchValue, setSearchValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const tabConfig = {
    vendor: { label: 'Vendor Expenses', icon: <FileText size={18} />, columns: ['Contract', 'Vendor Name', 'Amount', 'Charge Date'], keys: ['displayContract', 'displayName', 'displayAmount', 'displayDate'] },
    email: { label: 'Email Records', icon: <Mail size={18} />, columns: ['Subject', 'Sent To', 'Task', 'Email Date'], keys: ['displaySubject', 'displayRecipient', 'displayTask', 'displayDate'] },
    bill: { label: 'Billing', icon: <Book size={18} />, columns: ['Contract', 'Invoice No', 'Period', 'Amount'], keys: ['displayContract', 'displayInvoice', 'displayPeriod', 'displayAmount'] }
  };

  const normalizedData = useMemo(() => {
    return dataEntries.map(entry => ({
      ...entry,
      pKey: entry.primeKey || "0",
      displayContract: entry.contractShortName || 'N/A',
      displayDate: entry.chargeDate || entry.emailDate || 'N/A',
      displayAmount: entry.chargeAmount || entry.amount || 0,
      displayName: entry.vendorName,
      displaySubject: entry.subject,
      displayRecipient: entry.recipient,
      displayTask: entry.task,
      displayInvoice: entry.invoiceNo,
      displayPeriod: entry.billingPeriod,
      mType: entry.moduleType
    }));
  }, [dataEntries]);

  const filteredData = useMemo(() => {
    const tabFiltered = normalizedData.filter(entry => entry.mType === activeTab);
    if (!searchValue.trim()) return tabFiltered;
    const term = searchValue.toLowerCase();
    return tabFiltered.filter(e => Object.values(e).some(val => String(val || '').toLowerCase().includes(term)));
  }, [normalizedData, activeTab, searchValue]);

  const handleLocalEdit = (id, field, value) => {
    setDataEntries(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const simulateSave = () => {
    setIsSaving(true);
    setTimeout(() => { setIsSaving(false); alert("Records updated successfully!"); }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 sm:p-6 lg:p-8 text-gray-100 flex justify-center items-start">
      {/* Full width container */}
      <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-none text-gray-800">
        
        {/* Header - Restored Design */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-black text-blue-800 tracking-tighter">SLA Monitoring</h1>
          </div>
          <div className="flex items-center gap-3 bg-gray-50 p-2 pr-4 rounded-full border">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border-2 border-white shadow-sm">R</div>
            <span className="text-sm font-bold text-gray-700 leading-tight">Revolve</span>
            <button onClick={() => window.location.reload()} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"><LogOut size={16}/></button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
          {Object.entries(tabConfig).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold transition-all ${
                activeTab === key ? 'bg-white text-lime-700 shadow-sm' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {config.icon} {config.label}
            </button>
          ))}
        </div>

        {/* Global Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder={`Search ${tabConfig[activeTab].label}...`}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-100 rounded-xl focus:border-lime-500 outline-none transition-all"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
          
          <button 
            onClick={simulateSave} 
            disabled={isSaving} 
            className="bg-yellow-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-lime-900 transition-colors disabled:bg-gray-400 shadow-md"
          >
            {isSaving ? <Loader className="animate-spin" size={20} /> : <Save size={20} />}
            {isSaving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto rounded-2xl border-2 border-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Ref No</th>
                {tabConfig[activeTab].columns.map(col => (
                  <th key={col} className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">{col}</th>
                ))}
                <th className="px-6 py-4 text-center text-[10px] font-black text-blue-600 uppercase bg-blue-50/50 border-x">SLA Status</th>
                <th className="px-6 py-4 text-center text-[10px] font-black text-gray-400 uppercase">Proc.</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase">Info Received</th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase">Processed Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredData.length === 0 ? (
                <tr><td colSpan="10" className="p-12 text-center text-gray-400 italic">No records found.</td></tr>
              ) : filteredData.map((entry) => {
                const status = getAutoStatus(entry.infoReceivedDate, entry.dateProcessed);
                return (
                  <tr key={entry.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap font-black text-gray-900 text-sm">{entry.pKey}</td>
                    {tabConfig[activeTab].keys.map(key => (
                      <td key={key} className="px-6 py-4 text-xs font-bold text-gray-600">
                        {key.includes('Amount') 
                          ? `$${parseFloat(entry[key] || 0).toLocaleString(undefined, {minimumFractionDigits:2})}` 
                          : entry[key] || '---'}
                      </td>
                    ))}
                    
                    {/* Visual SLA Status Column */}
                    <td className={`px-6 py-4 text-center text-[10px] font-black uppercase ${status.color} ${status.bg} border-x`}>
                      <div className="flex items-center justify-center gap-1.5">
                        {status.text === 'Before Deadline' && <CheckCircle2 size={12} />}
                        {status.text === 'On deadline' && <Clock size={12} />}
                        {status.text === 'Deadline crossed' && <AlertCircle size={12} />}
                        {status.text}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <input 
                        type="checkbox" 
                        checked={entry.accountingProcessed === 'T'}
                        onChange={e => handleLocalEdit(entry.id, 'accountingProcessed', e.target.checked ? 'T' : 'F')}
                        className="w-4 h-4 rounded accent-lime-600 cursor-pointer"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input 
                        type="date" 
                        value={formatDateForInput(entry.infoReceivedDate)}
                        onChange={e => handleLocalEdit(entry.id, 'infoReceivedDate', e.target.value)}
                        className="text-xs font-bold border rounded p-1.5 focus:ring-2 focus:ring-lime-500 outline-none bg-white shadow-sm"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input 
                        type="date" 
                        value={formatDateForInput(entry.dateProcessed)}
                        onChange={e => handleLocalEdit(entry.id, 'dateProcessed', e.target.value)}
                        className="text-xs font-bold border rounded p-1.5 focus:ring-2 focus:ring-lime-500 outline-none bg-white shadow-sm"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Summary Row */}
        <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center text-xs font-bold text-gray-500">
          <div className="flex gap-4">
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> Before Deadline</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-500"></div> On Deadline</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> Overdue</span>
          </div>
          <p>Total {filteredData.length} records in this view</p>
        </div>

      </div>
    </div>
  );
};

export default SLA;
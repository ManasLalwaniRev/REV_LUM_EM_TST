import React, { useState } from 'react';
import { LayoutDashboard, FileText, TrendingUp, DollarSign, Wallet, ArrowUpCircle, ArrowDownCircle, LogOut, Briefcase } from 'lucide-react';

const FinancialDashboard = ({ userName = 'User', userAvatar, handleLogout }) => {
  const [activeTab, setActiveTab] = useState('income');
  const [selectedProject, setSelectedProject] = useState('22002');

  // --- DUMMY DATA ---
  const projects = [
    { id: '22002', name: '22002 - Enhanced 911 Tech JBER' },
    { id: '22003', name: '22003 - Global Security Upgrade' },
    { id: '22004', name: '22004 - Cloud Infrastructure Phase II' }
  ];

  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  const psrData = {
    '22002': [
      { category: 'Contract Revenue', monthly: 50000 },
      { category: 'Direct Labor', monthly: 15000 },
      { category: 'ODCs (Direct)', monthly: 5000 },
      { category: 'Total Direct Costs', monthly: 20000, isBold: true },
      { category: 'Gross Profit', monthly: 30000, isBold: true },
      { category: 'Indirect Burdens', monthly: 10000 },
      { category: 'Net Profit / Fee', monthly: 20000, isBlue: true },
    ],
    '22003': [
      { category: 'Contract Revenue', monthly: 80000 },
      { category: 'Direct Labor', monthly: 25000 },
      { category: 'ODCs (Direct)', monthly: 8000 },
      { category: 'Total Direct Costs', monthly: 33000, isBold: true },
      { category: 'Gross Profit', monthly: 47000, isBold: true },
      { category: 'Indirect Burdens', monthly: 15000 },
      { category: 'Net Profit / Fee', monthly: 32000, isBlue: true },
    ],
    '22004': [
      { category: 'Contract Revenue', monthly: 120000 },
      { category: 'Direct Labor', monthly: 40000 },
      { category: 'ODCs (Direct)', monthly: 12000 },
      { category: 'Total Direct Costs', monthly: 52000, isBold: true },
      { category: 'Gross Profit', monthly: 68000, isBold: true },
      { category: 'Indirect Burdens', monthly: 20000 },
      { category: 'Net Profit / Fee', monthly: 48000, isBlue: true },
    ]
  };

  const incomeStatement = {
    summary: [
      { label: 'Total Revenue', value: '$450,000', change: '+12%', icon: <TrendingUp className="text-green-600" /> },
      { label: 'Cost of Goods', value: '$180,000', change: '+5%', icon: <ArrowDownCircle className="text-red-500" /> },
      { label: 'Gross Profit', value: '$270,000', change: '+18%', icon: <TrendingUp className="text-green-600" /> },
      { label: 'Net Income', value: '$125,000', change: '+22%', icon: <DollarSign className="text-blue-600" /> },
    ],
    rows: [
      { category: 'Operating Revenue', monthly: '$35,000', quarterly: '$105,000', yearly: '$420,000' },
      { category: 'Service Income', monthly: '$2,500', quarterly: '$7,500', yearly: '$30,000' },
      { category: 'Direct Labor', monthly: '($12,000)', quarterly: '($36,000)', yearly: '($144,000)' },
      { category: 'Marketing Expenses', monthly: '($3,000)', quarterly: '($9,000)', yearly: '($36,000)' },
      { category: 'Taxes', monthly: '($2,500)', quarterly: '($7,500)', yearly: '($30,000)' },
    ]
  };

  const balanceSheet = {
    summary: [
      { label: 'Total Assets', value: '$1,200,000', change: 'Stable', icon: <Wallet className="text-purple-600" /> },
      { label: 'Total Liabilities', value: '$450,000', change: '-2%', icon: <ArrowDownCircle className="text-green-500" /> },
      { label: 'Equity', value: '$750,000', change: '+5%', icon: <TrendingUp className="text-blue-600" /> },
    ],
    rows: [
      { item: 'Cash & Equivalents', type: 'Asset', current: '$250,000', previous: '$210,000' },
      { item: 'Accounts Receivable', type: 'Asset', current: '$150,000', previous: '$130,000' },
      { item: 'Accounts Payable', type: 'Liability', current: '$80,000', previous: '$95,000' },
      { item: 'Long-term Debt', type: 'Liability', current: '$370,000', previous: '$380,000' },
      { item: 'Retained Earnings', type: 'Equity', current: '$400,000', previous: '$350,000' },
    ]
  };

  const cashFlow = {
    summary: [
      { label: 'Operating Cash Flow', value: '$85,000', icon: <ArrowUpCircle className="text-green-600" /> },
      { label: 'Investing Cash Flow', value: '($20,000)', icon: <ArrowDownCircle className="text-red-500" /> },
      { label: 'Financing Cash Flow', value: '($15,000)', icon: <ArrowDownCircle className="text-blue-500" /> },
      { label: 'Net Cash Increase', value: '$50,000', icon: <TrendingUp className="text-green-600" /> },
    ]
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'income':
        return (
          <div className="animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {incomeStatement.summary.map((item, i) => (
                <div key={i} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase">{item.label}</p>
                    <h3 className="text-xl font-bold text-gray-800">{item.value}</h3>
                    <span className="text-xs font-semibold text-green-600">{item.change}</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">{item.icon}</div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <table className="min-w-full divide-y divide-gray-200 text-gray-700">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-500">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-500">Monthly</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-500">Quarterly</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-500">Yearly</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {incomeStatement.rows.map((row, i) => (
                    <tr key={i} className="hover:bg-blue-50">
                      <td className="px-6 py-4 font-medium">{row.category}</td>
                      <td className="px-6 py-4">{row.monthly}</td>
                      <td className="px-6 py-4">{row.quarterly}</td>
                      <td className="px-6 py-4">{row.yearly}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'balance':
        return (
          <div className="animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {balanceSheet.summary.map((item, i) => (
                <div key={i} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase">{item.label}</p>
                    <h3 className="text-xl font-bold text-gray-800">{item.value}</h3>
                    <span className="text-xs font-semibold text-gray-500">{item.change}</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">{item.icon}</div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <table className="min-w-full divide-y divide-gray-200 text-gray-700">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-500">Line Item</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-500">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-500">Current Value</th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase text-gray-500">Previous Period</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {balanceSheet.rows.map((row, i) => (
                    <tr key={i} className="hover:bg-purple-50">
                      <td className="px-6 py-4 font-medium">{row.item}</td>
                      <td className="px-6 py-4 text-xs font-bold uppercase text-gray-400">{row.type}</td>
                      <td className="px-6 py-4 font-semibold">{row.current}</td>
                      <td className="px-6 py-4">{row.previous}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'cash':
        return (
          <div className="animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {cashFlow.summary.map((item, i) => (
                <div key={i} className="bg-white p-8 rounded-xl border-l-4 border-lime-500 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-bold uppercase mb-1">{item.label}</p>
                    <h3 className="text-3xl font-bold text-gray-800">{item.value}</h3>
                  </div>
                  <div className="p-4 bg-lime-50 rounded-full">{item.icon}</div>
                </div>
              ))}
            </div>
            <div className="bg-lime-50 p-6 rounded-xl border border-lime-100 text-center text-gray-600 italic">
               Visual cash flow analytics for the Q1-Q4 period are currently being aggregated.
            </div>
          </div>
        );
      case 'psr':
        return (
          <div className="animate-in fade-in duration-500">
            {/* PSR Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <label className="text-[10px] font-bold text-blue-800 uppercase block mb-1">Top Level Project</label>
                <select 
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="w-full bg-gray-50 border-none rounded-lg p-2 font-bold text-gray-800 focus:ring-2 focus:ring-blue-500"
                >
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <label className="text-[10px] font-bold text-blue-800 uppercase block mb-1">Project Level</label>
                <select className="w-full bg-gray-50 border-none rounded-lg p-2 font-bold text-gray-800">
                  <option>Level 1</option>
                  <option>Level 2</option>
                </select>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <label className="text-[10px] font-bold text-blue-800 uppercase block mb-1">Fiscal Year</label>
                <select className="w-full bg-gray-50 border-none rounded-lg p-2 font-bold text-gray-800">
                  <option>2025</option>
                  <option>2026</option>
                </select>
              </div>
            </div>

            {/* PSR Table */}
            <div className="bg-[#1e293b] rounded-xl overflow-hidden shadow-xl border border-gray-700">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-[#1e293b]">
                    <tr>
                      <th className="px-4 py-6 text-left text-[10px] font-bold uppercase text-gray-400 w-64 border-r border-gray-700">Financial Items</th>
                      {months.map(m => (
                        <th key={m} className="px-4 py-3 text-center border-r border-gray-700">
                          <span className="block text-[10px] font-bold text-gray-300">{m}</span>
                          <span className="block text-[8px] font-medium text-gray-500 uppercase">Forecast</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {psrData[selectedProject].map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <td className={`px-4 py-4 text-sm border-r border-gray-100 ${row.isBold ? 'font-bold' : 'text-gray-600'} ${row.isBlue ? 'text-blue-700 font-bold' : ''}`}>
                          {row.category}
                        </td>
                        {months.map(m => (
                          <td key={m} className={`px-2 py-4 text-center text-sm border-r border-gray-100 ${row.isBlue ? 'text-blue-600 font-bold' : 'text-gray-400'}`}>
                            {row.monthly ? `$${row.monthly.toLocaleString()}` : '—'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 sm:p-6 lg:p-8 text-gray-100 flex justify-center items-start">
      <div className="bg-gray-50 p-6 rounded-xl shadow-2xl w-full max-w-full text-gray-800">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-3xl font-extrabold text-blue-800  tracking-tighter">Financial Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-white p-2 rounded-lg shadow-sm border">
              <img src={userAvatar || "https://via.placeholder.com/40"} alt="Avatar" className="w-10 h-10 rounded-full border" />
              <span className="font-medium text-gray-700">Welcome, {userName}</span>
            </div>
            <button onClick={handleLogout} className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200">
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap gap-2 mb-8 bg-gray-200 p-1 rounded-xl w-fit">
          <button 
            onClick={() => setActiveTab('income')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold transition-all ${activeTab === 'income' ? 'bg-white text-lime-800 shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <FileText size={18} /> Income Statement
          </button>
          <button 
            onClick={() => setActiveTab('balance')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold transition-all ${activeTab === 'balance' ? 'bg-white text-lime-800 shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <LayoutDashboard size={18} /> Balance Sheet
          </button>
          <button 
            onClick={() => setActiveTab('cash')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold transition-all ${activeTab === 'cash' ? 'bg-white text-lime-800 shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <TrendingUp size={18} /> Cash Flow
          </button>
          <button 
            onClick={() => setActiveTab('psr')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold transition-all ${activeTab === 'psr' ? 'bg-white text-blue-800 shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Briefcase size={18} /> PSR
          </button>
        </div>

        {/* Dashboard Content */}
        {renderTabContent()}
      </div>
    </div>
  );
};

export default FinancialDashboard;
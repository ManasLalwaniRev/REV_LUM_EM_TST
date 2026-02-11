import React, { useState } from 'react';
import { LayoutDashboard, FileText, TrendingUp, DollarSign, Wallet, ArrowUpCircle, ArrowDownCircle, LogOut } from 'lucide-react';

const FinancialDashboard = ({ userName = 'User', userAvatar, handleLogout }) => {
  const [activeTab, setActiveTab] = useState('income');

  // --- DUMMY DATA ---
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
            <img src="/Lumina_logo.png" alt="Logo" className="h-10 pr-4" />
            <div className="flex items-center gap-3 bg-white p-2 rounded-lg shadow-sm">
              <img src={userAvatar} alt="Avatar" className="w-10 h-10 rounded-full border" />
              <span className="font-medium text-gray-700">Welcome, {userName}</span>
            </div>
            <button onClick={handleLogout} className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200">
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 mb-8 bg-gray-200 p-1 rounded-xl w-fit">
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
        </div>

        {/* Dashboard Content */}
        {renderTabContent()}
      </div>
    </div>
  );
};

export default FinancialDashboard;

import React, { useState, useEffect } from 'react';
import LoginPage from '@/components/LoginPage.jsx';
import Sidebar from '@/components/Sidebar.jsx';
import AddDataModal from '@/components/AddDataModal.jsx';
import EditDataModal from '@/components/EditDataModal.jsx';
import ExportModal from '@/components/ExportModal.jsx';
import SettingsAndProfilePage from '@/components/SettingsAndProfilePage.jsx';
import AboutPage from '@/components/AboutPage.jsx';
import FinancialDashboard from '@/components/FinancialDashboard';

// Renamed Components
import Vendor_Expenses from '@/components/Vendor_Expenses.jsx'; 
import SLA from '@/components/SLA.jsx';

// Page Imports
import CreditCardExpenses from '@/components/CreditCardExpenses.jsx';
import TravelExpenses from '@/components/TravelExpenses.jsx';
import SubcontractorAssignments from '@/components/SubcontractorAssignments.jsx';
import AddSubcontractorModal from '@/components/AddSubcontractorModal.jsx';
import EditSubcontractorModal from '@/components/EditSubcontractorModal.jsx';
import BillingPage from '@/components/BillingPage.jsx';
import EmailRecords from '@/components/EmailRecords.jsx';

const DEFAULT_AVATAR = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Scott';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('luminaUser'));
  const [currentPage, setCurrentPage] = useState('view');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Modal States
  const [showEditSubkModal, setShowEditSubkModal] = useState(false);
  const [selectedEntryForEdit, setSelectedEntryForEdit] = useState(null);
  const [showAddDataModal, setShowAddDataModal] = useState(false);
  const [showEditDataModal, setShowEditDataModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showAddSubkModal, setShowAddSubkModal] = useState(false);

  // User State
  const [currentUserId, setCurrentUserId] = useState(() => localStorage.getItem('luminaUserId'));
  const [currentUsername, setCurrentUsername] = useState(() => localStorage.getItem('luminaUsername'));
  const [currentUserRole, setCurrentUserRole] = useState(() => localStorage.getItem('luminaUserRole'));
  const [currentUserAvatar, setCurrentUserAvatar] = useState(() => localStorage.getItem('luminaUserAvatar') || DEFAULT_AVATAR);

  // Data State
  const [dataEntries, setDataEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contractOptions, setContractOptions] = useState([]);
  const [creditCardOptions, setCreditCardOptions] = useState([]);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  // --- Helper: Snake Case to Camel Case ---
  const snakeToCamel = (obj) => {
    if (Array.isArray(obj)) return obj.map(v => snakeToCamel(v));
    if (obj !== null && typeof obj === 'object') {
      return Object.keys(obj).reduce((acc, key) => {
        let camelKey = key.replace(/_([a-z])/g, g => g[1].toUpperCase());
        if (key === 'vendor_id') camelKey = 'vendorId'; 
        if (key === 'prime_key') camelKey = 'primeKey'; // Explicit mapping for versioning
        acc[camelKey] = snakeToCamel(obj[key]);
        return acc;
      }, {});
    }
    return obj;
  };

  // --- REFACTORED FETCH LOGIC ---
  const fetchEntries = async () => {
    if (!isLoggedIn) return;
    setIsLoading(true);
    setError(null);

    try {
      // 1. Check if we are on the SLA (Accountant) page - This requires MULTIPLE endpoints
      if (currentPage === 'accountant') {
        const [vendorRes, emailRes, billRes] = await Promise.all([
          fetch(`${API_BASE_URL}/vendor-expenses`),
          fetch(`${API_BASE_URL}/email-records`),
          fetch(`${API_BASE_URL}/billing`)
        ]);

        const [vendors, emails, bills] = await Promise.all([
          vendorRes.json(),
          emailRes.json(),
          billRes.json()
        ]);

        // Merge all records and tag them for the SLA Tabs to filter
        const mergedData = [
          ...vendors.map(v => ({ ...v, moduleType: 'vendor' })),
          ...emails.map(e => ({ ...e, moduleType: 'email' })),
          ...bills.map(b => ({ ...b, moduleType: 'bill' }))
        ];

        setDataEntries(snakeToCamel(mergedData));
      } else {
        // 2. Standard single-screen fetching
        const endpointMap = {
          'view': 'vendor-expenses',
          'credit-card-expenses': 'credit-card-expenses',
          'travel-expenses': 'travel-expenses',
          'subcontractor-assignments': 'subcontractor-assignments',
          'bill': 'billing',
          'emails': 'email-records'
        };

        const currentEndpoint = endpointMap[currentPage] || 'vendor-expenses';
        const response = await fetch(`${API_BASE_URL}/${currentEndpoint}?userId=${currentUserId}&userRole=${currentUserRole}`);
        
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        
        // Add moduleType even for single screens to keep structure consistent
        const taggedData = data.map(item => ({
            ...item,
            moduleType: currentPage === 'view' ? 'vendor' : currentPage === 'emails' ? 'email' : 'bill'
        }));

        setDataEntries(snakeToCamel(taggedData));
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setError('Failed to load data. Please check your connection.');
      setDataEntries([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOptions = async () => {
    try {
      const [contractsRes, cardsRes] = await Promise.allSettled([
        fetch(`${API_BASE_URL}/contract-options`),
        fetch(`${API_BASE_URL}/credit-card-options`),
      ]);
      if (contractsRes.status === 'fulfilled' && contractsRes.value.ok) setContractOptions(await contractsRes.value.json());
      if (cardsRes.status === 'fulfilled' && cardsRes.value.ok) setCreditCardOptions(await cardsRes.value.json());
    } catch (error) { console.error("Options failed", error); }
  };

  useEffect(() => {
    if (isLoggedIn && currentUserId) {
      fetchEntries();
      fetchOptions();
    }
  }, [isLoggedIn, currentUserId, currentPage]);

  const handleLoginSuccess = (userId, username, role, avatar) => {
    const selectedAvatar = avatar || DEFAULT_AVATAR;
    localStorage.setItem('luminaUser', 'true');
    localStorage.setItem('luminaUserId', userId);
    localStorage.setItem('luminaUsername', username);
    localStorage.setItem('luminaUserRole', role);
    localStorage.setItem('luminaUserAvatar', selectedAvatar);
    setIsLoggedIn(true);
    setCurrentUserId(userId);
    setCurrentUsername(username);
    setCurrentUserRole(role);
    setCurrentUserAvatar(selectedAvatar);
    setCurrentPage('view');
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setCurrentPage('login');
  };

  const commonProps = {
    dataEntries, isLoading, error, handleLogout, currentUserRole, currentUserId, 
    contractOptions, creditCardOptions, userName: currentUsername, userAvatar: currentUserAvatar,
    onDataChanged: fetchEntries, openEditDataModal: () => setShowEditDataModal(true), openExportModal: () => setShowExportModal(true),
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'view': return <Vendor_Expenses {...commonProps} openAddDataModal={() => setShowAddDataModal(true)} />;
      case 'credit-card-expenses': return <CreditCardExpenses {...commonProps} openAddDataModal={() => setShowAddDataModal(true)} />;
      case 'travel-expenses': return <TravelExpenses {...commonProps} openAddDataModal={() => setShowAddDataModal(true)} />;
      case 'subcontractor-assignments':
        return <SubcontractorAssignments {...commonProps} openAddSubkModal={() => setShowAddSubkModal(true)} openEditSubkModal={(e) => { setSelectedEntryForEdit(e); setShowEditSubkModal(true); }} />;
      case 'bill': return <BillingPage {...commonProps} />;  
      case 'dashboard': return <FinancialDashboard {...commonProps} />;
      case 'accountant': return <SLA {...commonProps} fetchEntries={fetchEntries} userId={currentUserId} />;
      case 'settings':
      case 'user-profile': return <SettingsAndProfilePage {...commonProps} setCurrentPage={setCurrentPage} onAvatarChange={setCurrentUserAvatar} />;
      case 'about': return <AboutPage setCurrentPage={setCurrentPage} handleLogout={handleLogout} />;
      case 'emails': return <EmailRecords {...commonProps} />;
      case 'subk-travel':
      return <Subk_Travel_Combined 
                dataEntries={subkTravelData} // Ensure you are fetching this data
                userName={user.username}
                userAvatar={user.avatar}
                handleLogout={handleLogout}
                currentUserRole={user.role}
                currentUserId={user.userId}
                onDataChanged={fetchSubkTravelData}
                contractOptions={contractOptions}
             />;
      default: return <Vendor_Expenses {...commonProps} openAddDataModal={() => setShowAddDataModal(true)} />;
    }
  };

  if (!isLoggedIn) return <LoginPage onLoginSuccess={handleLoginSuccess} />;

  return (
    <div className="relative min-h-screen w-full bg-gray-100 flex">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} currentUserRole={currentUserRole} handleLogout={handleLogout} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main className={`transition-all duration-300 flex-grow ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {renderContent()}
      </main>
      
      {showAddDataModal && <AddDataModal onClose={() => setShowAddDataModal(false)} userId={currentUserId} username={currentUsername} contractOptions={contractOptions} creditCardOptions={creditCardOptions} onDataAdded={fetchEntries} />}
      {showAddSubkModal && <AddSubcontractorModal onClose={() => setShowAddSubkModal(false)} userId={currentUserId} username={currentUsername} onDataAdded={fetchEntries} />}
      {showEditDataModal && <EditDataModal onClose={() => setShowEditDataModal(false)} userId={currentUserId} userRole={currentUserRole} username={currentUsername} contractOptions={contractOptions} creditCardOptions={creditCardOptions} onDataEdited={fetchEntries} />}
      {showExportModal && <ExportModal onClose={() => setShowExportModal(false)} dataEntries={dataEntries} contractOptions={contractOptions} creditCardOptions={creditCardOptions} />}
      {showEditSubkModal && <EditSubcontractorModal onClose={() => setShowEditSubkModal(false)} userId={currentUserId} userRole={currentUserRole} entry={selectedEntryForEdit} onDataEdited={fetchEntries} />}
    </div>
  );
};

export default App;
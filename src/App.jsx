

//LATEST VERSION //


// import React, { useState } from 'react';
// import LoginPage from '@/components/LoginPage.jsx';
// import HomePage from '@/components/HomePage.jsx';
// // REMOVED: import PlaceholderPage from '@/components/PlaceholderPage.jsx';
// import AddDataModal from '@/components/AddDataModal.jsx';
// import EditDataModal from '@/components/EditDataModal.jsx';
// import ViewPage from '@/components/ViewPage.jsx';
// import AccountantPage from '@/components/AccountantPage.jsx';
// import UserProfilePage from '@/components/UserProfilePage.jsx'; // CORRECTED: Import UserProfilePage

// const App = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [currentPage, setCurrentPage] = useState('home');
//   const [showAddDataModal, setShowAddDataModal] = useState(false);
//   const [showEditDataModal, setShowEditDataModal] = useState(false); 
  
//   // State for user ID, username, and role
//   const [currentUserId, setCurrentUserId] = useState(null);
//   const [currentUsername, setCurrentUsername] = useState(null);
//   const [currentUserRole, setCurrentUserRole] = useState(null);

//   const handleLoginSuccess = (userId, username, role) => {
//     setIsLoggedIn(true);
//     setCurrentUserId(userId);
//     setCurrentUsername(username);
//     setCurrentUserRole(role);
//     setCurrentPage('home');
//   };

//   const handleLogout = () => {
//     setIsLoggedIn(false);
//     setCurrentUserId(null);
//     setCurrentUsername(null);
//     setCurrentUserRole(null);
//     setCurrentPage('login');
//   };

//   const renderContent = () => {
//     if (!isLoggedIn) {
//       return <LoginPage onLoginSuccess={handleLoginSuccess} />;
//     }

//     switch (currentPage) {
//       case 'home':
//         return (
//           <HomePage
//             setCurrentPage={setCurrentPage}
//             openAddDataModal={() => setShowAddDataModal(true)}
//             openEditDataModal={() => setShowEditDataModal(true)} 
//             currentUserRole={currentUserRole}
//           />
//         );
//       case 'manage-database':
//         // This case will now display a generic message, as its functionality is moved
//         return (
//           <div className="flex justify-center items-center h-screen bg-gray-100">
//             <h1 className="text-xl">Manage Database Page Content Placeholder (Consider integrating into UserProfilePage)</h1>
//             <button
//               onClick={() => setCurrentPage('home')}
//               className="ml-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
//             >
//               Back to Home
//             </button>
//           </div>
//         );
//       case 'user-profile':
//         // Render UserProfilePage and pass user info
//         return (
//           <UserProfilePage
//             setCurrentPage={setCurrentPage}
//             currentUserId={currentUserId}
//             currentUsername={currentUsername}
//             currentUserRole={currentUserRole}
//           />
//         );
//       case 'view':
//         return <ViewPage setCurrentPage={setCurrentPage} userId={currentUserId} userRole={currentUserRole} />;
//       case 'accountant':
//         return <AccountantPage setCurrentPage={setCurrentPage} userId={currentUserId} userRole={currentUserRole} />;
//       default:
//         return (
//           <HomePage
//             setCurrentPage={setCurrentPage}
//             openAddDataModal={() => setShowAddDataModal(true)}
//             openEditDataModal={() => setShowEditDataModal(true)} 
//             currentUserRole={currentUserRole}
//           />
//         );
//     }
//   };

//   return (
//     <div className="font-sans antialiased text-gray-900 min-h-screen w-full flex flex-col">
//       {isLoggedIn && (
//         <nav className="bg-white shadow-md p-4 sticky top-0 z-40">
//           <div className="container mx-auto flex justify-between items-center">
//             <div className="text-2xl font-bold text-gray-800">Revolve LLC</div> {/* Updated Company Name */}
//             <ul className="flex space-x-6">
//               <li>
//                 <button
//                   onClick={() => setCurrentPage('home')}
//                   className={`text-lg font-medium transition duration-300 ease-in-out ${
//                     currentPage === 'home' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'
//                   }`}
//                 >
//                   Home
//                 </button>
//               </li>
//               {/* Removed Accountant and User Profile buttons from the global navigation bar */}
//               <li>
//                 {currentUsername && currentUserRole && (
//                   <span className="text-gray-700 text-lg font-medium mr-4">
//                     Logged in as: {currentUsername} ({currentUserRole})
//                   </span>
//                 )}
//                 <button
//                   onClick={handleLogout}
//                   className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105"
//                 >
//                   Logout
//                 </button>
//               </li>
//             </ul>
//           </div>
//         </nav>
//       )}

//       <main className="flex-grow w-full">
//         {renderContent()}
//       </main>

//       {showAddDataModal && <AddDataModal onClose={() => setShowAddDataModal(false)} userId={currentUserId} username={currentUsername} />}
//       {showEditDataModal && <EditDataModal onClose={() => setShowEditDataModal(false)} userId={currentUserId} userRole={currentUserRole} />}
//     </div>
//   );
// };

// export default App;


//LATEST VERSION END //


// import React, { useState, useEffect } from 'react';
// import LoginPage from '@/components/LoginPage.jsx';
// import HomePage from '@/components/HomePage.jsx';
// import AddDataModal from '@/components/AddDataModal.jsx';
// import EditDataModal from '@/components/EditDataModal.jsx';
// import ViewPage from '@/components/ViewPage.jsx';
// import AccountantPage from '@/components/AccountantPage.jsx';
// import UserProfilePage from '@/components/UserProfilePage.jsx';
// import SettingsPage from '@/components/SettingsPage.jsx'; // Import the new SettingsPage

// const App = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [currentPage, setCurrentPage] = useState('home');
//   const [showAddDataModal, setShowAddDataModal] = useState(false);
//   const [showEditDataModal, setShowEditDataModal] = useState(false);

//   const [currentUserId, setCurrentUserId] = useState(null);
//   const [currentUsername, setCurrentUsername] = useState(null);
//   const [currentUserRole, setCurrentUserRole] = useState(null);

//   // --- NEW: State for dropdown options ---
//   const [contractOptions, setContractOptions] = useState([]);
//   const [creditCardOptions, setCreditCardOptions] = useState([]);

//   // Fetch dropdown options when the user logs in
//   useEffect(() => {
//     if (isLoggedIn) {
//       const fetchOptions = async () => {
//         try {
//           // const [contractsRes, cardsRes] = await Promise.all([
//           //   fetch('https://rev-lumina.onrender.com/api/contract-options'),
//           //   fetch('https://rev-lumina.onrender.com/api/credit-card-options'),
//           // ]);
//           const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://rev-lumina.onrender.com/api';
//           const [contractsRes, cardsRes] = await Promise.all([
//           fetch(`${API_BASE_URL}/contract-options`),
//           fetch(`${API_BASE_URL}/credit-card-options`),
//          ]);
//           const contracts = await contractsRes.json();
//           const cards = await cardsRes.json();
//           setContractOptions(contracts);
//           setCreditCardOptions(cards);
//         } catch (error) {
//           console.error("Failed to fetch dropdown options:", error);
//         }
//       };
//       fetchOptions();
//     }
//   }, [isLoggedIn]);


//   const handleLoginSuccess = (userId, username, role) => {
//     setIsLoggedIn(true);
//     setCurrentUserId(userId);
//     setCurrentUsername(username);
//     setCurrentUserRole(role);
//     setCurrentPage('home');
//   };

//   const handleLogout = () => {
//     setIsLoggedIn(false);
//     setCurrentUserId(null);
//     setCurrentUsername(null);
//     setCurrentUserRole(null);
//     setCurrentPage('login');
//   };

//   const renderContent = () => {
//     if (!isLoggedIn) {
//       return <LoginPage onLoginSuccess={handleLoginSuccess} />;
//     }

//     switch (currentPage) {
//       case 'home':
//         return (
//           <HomePage
//             setCurrentPage={setCurrentPage}
//             openAddDataModal={() => setShowAddDataModal(true)}
//             openEditDataModal={() => setShowEditDataModal(true)}
//             currentUserRole={currentUserRole}
//           />
//         );
//       // --- NEW: Add case for settings page ---
//       case 'settings':
//         return <SettingsPage setCurrentPage={setCurrentPage} currentUserRole={currentUserRole} />;
//       case 'user-profile':
//         return (
//           <UserProfilePage
//             setCurrentPage={setCurrentPage}
//             currentUserId={currentUserId}
//             currentUsername={currentUsername}
//             currentUserRole={currentUserRole}
//           />
//         );
//       case 'view':
//         return <ViewPage setCurrentPage={setCurrentPage} userId={currentUserId} userRole={currentUserRole} />;
//       case 'accountant':
//         return <AccountantPage setCurrentPage={setCurrentPage} userId={currentUserId} userRole={currentUserRole} />;
//       default:
//         return (
//           <HomePage
//             setCurrentPage={setCurrentPage}
//             openAddDataModal={() => setShowAddDataModal(true)}
//             openEditDataModal={() => setShowEditDataModal(true)}
//             currentUserRole={currentUserRole}
//           />
//         );
//     }
//   };

//   return (
//     <div className="font-sans antialiased text-gray-900 min-h-screen w-full flex flex-col">
//       {isLoggedIn && (
//         <nav className="bg-white shadow-md p-4 sticky top-0 z-40">
//           <div className="container mx-auto flex justify-between items-center">
//             <div className="text-2xl font-bold text-gray-800">Revolve LLC</div>
//             <ul className="flex space-x-6">
//               <li>
//                 <button
//                   onClick={() => setCurrentPage('home')}
//                   className={`text-lg font-medium transition duration-300 ease-in-out ${
//                     currentPage === 'home' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'
//                   }`}
//                 >
//                   Home
//                 </button>
//               </li>
//               <li>
//                 {currentUsername && currentUserRole && (
//                   <span className="text-gray-700 text-lg font-medium mr-4">
//                     Logged in as: {currentUsername} ({currentUserRole})
//                   </span>
//                 )}
//                 <button
//                   onClick={handleLogout}
//                   className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105"
//                 >
//                   Logout
//                 </button>
//               </li>
//             </ul>
//           </div>
//         </nav>
//       )}

//       <main className="flex-grow w-full">
//         {renderContent()}
//       </main>

//         {showAddDataModal &&
//         <AddDataModal
//             onClose={() => setShowAddDataModal(false)}
//             userId={currentUserId}
//             username={currentUsername}
//             contractOptions={contractOptions}
//             creditCardOptions={creditCardOptions}
//         />}
//         {showEditDataModal &&
//         <EditDataModal
//             onClose={() => setShowEditDataModal(false)}
//             userId={currentUserId}
//             userRole={currentUserRole}
//             username={currentUsername}
//             contractOptions={contractOptions}
//             creditCardOptions={creditCardOptions}
//         />}
//     </div>
//   );
// };

// export default App;



// import React, { useState, useEffect } from 'react';
// import LoginPage from '@/components/LoginPage.jsx';
// import Sidebar from '@/components/Sidebar.jsx'; // Import the new Sidebar
// import AddDataModal from '@/components/AddDataModal.jsx';
// import EditDataModal from '@/components/EditDataModal.jsx';
// import ViewPage from '@/components/ViewPage.jsx';
// import AccountantPage from '@/components/AccountantPage.jsx';
// import UserProfilePage from '@/components/UserProfilePage.jsx';
// import SettingsPage from '@/components/SettingsPage.jsx';

// const App = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   // Default to 'view' page after login
//   const [currentPage, setCurrentPage] = useState('view');
//   const [showAddDataModal, setShowAddDataModal] = useState(false);
//   const [showEditDataModal, setShowEditDataModal] = useState(false);

//   const [currentUserId, setCurrentUserId] = useState(null);
//   const [currentUsername, setCurrentUsername] = useState(null);
//   const [currentUserRole, setCurrentUserRole] = useState(null);

//   const [contractOptions, setContractOptions] = useState([]);
//   const [creditCardOptions, setCreditCardOptions] = useState([]);

//   useEffect(() => {
//     if (isLoggedIn) {
//       const fetchOptions = async () => {
//         try {
//           const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://rev-lumina.onrender.com/api';
//           const [contractsRes, cardsRes] = await Promise.all([
//             fetch(`${API_BASE_URL}/contract-options`),
//             fetch(`${API_BASE_URL}/credit-card-options`),
//           ]);
//           const contracts = await contractsRes.json();
//           const cards = await cardsRes.json();
//           setContractOptions(contracts);
//           setCreditCardOptions(cards);
//         } catch (error) {
//           console.error("Failed to fetch dropdown options:", error);
//         }
//       };
//       fetchOptions();
//     }
//   }, [isLoggedIn]);

//   const handleLoginSuccess = (userId, username, role) => {
//     setIsLoggedIn(true);
//     setCurrentUserId(userId);
//     setCurrentUsername(username);
//     setCurrentUserRole(role);
//     // Set default page to 'view' on login
//     setCurrentPage('view');
//   };

//   const handleLogout = () => {
//     setIsLoggedIn(false);
//     setCurrentUserId(null);
//     setCurrentUsername(null);
//     setCurrentUserRole(null);
//   };

//   const renderContent = () => {
//     switch (currentPage) {
//       case 'view':
//         return (
//           <ViewPage
//             setCurrentPage={setCurrentPage}
//             userId={currentUserId}
//             userRole={currentUserRole}
//             openAddDataModal={() => setShowAddDataModal(true)}
//             openEditDataModal={() => setShowEditDataModal(true)}
//           />
//         );
//       case 'settings':
//         return <SettingsPage setCurrentPage={setCurrentPage} currentUserRole={currentUserRole} />;
//       case 'user-profile':
//         return (
//           <UserProfilePage
//             setCurrentPage={setCurrentPage}
//             currentUserId={currentUserId}
//             currentUsername={currentUsername}
//             currentUserRole={currentUserRole}
//           />
//         );
//       case 'accountant':
//         return <AccountantPage setCurrentPage={setCurrentPage} userId={currentUserId} userRole={currentUserRole} />;
//       default:
//         // Fallback to view page
//         return <ViewPage setCurrentPage={setCurrentPage} userId={currentUserId} userRole={currentUserRole} />;
//     }
//   };

//   if (!isLoggedIn) {
//     return <LoginPage onLoginSuccess={handleLoginSuccess} />;
//   }

//   return (
//     <div className="flex min-h-screen w-full bg-gray-100">
//       <Sidebar
//         setCurrentPage={setCurrentPage}
//         currentPage={currentPage}
//         currentUserRole={currentUserRole}
//         handleLogout={handleLogout}
//       />
//       <main className="flex-grow p-8 overflow-auto">
//         {renderContent()}
//       </main>

//       {showAddDataModal &&
//         <AddDataModal
//           onClose={() => setShowAddDataModal(false)}
//           userId={currentUserId}
//           username={currentUsername}
//           contractOptions={contractOptions}
//           creditCardOptions={creditCardOptions}
//         />}
//       {showEditDataModal &&
//         <EditDataModal
//           onClose={() => setShowEditDataModal(false)}
//           userId={currentUserId}
//           userRole={currentUserRole}
//           username={currentUsername}
//           contractOptions={contractOptions}
//           creditCardOptions={creditCardOptions}
//         />}
//     </div>
//   );
// };

// export default App;
// src/App.jsx


// Stable 1 START ///

// import React, { useState, useEffect } from 'react';
// import LoginPage from '@/components/LoginPage.jsx';
// import Sidebar from '@/components/Sidebar.jsx';
// import AddDataModal from '@/components/AddDataModal.jsx';
// import EditDataModal from '@/components/EditDataModal.jsx';
// import ViewPage from '@/components/ViewPage.jsx';
// import AccountantPage from '@/components/AccountantPage.jsx';
// import UserProfilePage from '@/components/UserProfilePage.jsx';
// import SettingsPage from '@/components/SettingsPage.jsx';
// import ExportModal from '@/components/ExportModal.jsx'; // Make sure ExportModal is imported

// const App = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [currentPage, setCurrentPage] = useState('view');
//   const [showAddDataModal, setShowAddDataModal] = useState(false);
//   const [showEditDataModal, setShowEditDataModal] = useState(false);
//   const [showExportModal, setShowExportModal] = useState(false); // State for the export modal
//   const [sidebarOpen, setSidebarOpen] = useState(true);

//   // User State
//   const [currentUserId, setCurrentUserId] = useState(null);
//   const [currentUsername, setCurrentUsername] = useState(null);
//   const [currentUserRole, setCurrentUserRole] = useState(null);

//   // Centralized Data State
//   const [dataEntries, setDataEntries] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Dropdown options state
//   const [contractOptions, setContractOptions] = useState([]);
//   const [creditCardOptions, setCreditCardOptions] = useState([]);

//   // Centralized Data Fetching Function
//   const fetchEntries = async () => {
//     if (!isLoggedIn) return;
//     setIsLoading(true);
//     setError(null);
//     try {
//       const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://rev-lumina.onrender.com/api';
//       const response = await fetch(`${API_BASE_URL}/entries?userId=${currentUserId}&userRole=${currentUserRole}`);
//       if (!response.ok) {
//         throw new Error('Failed to fetch data entries');
//       }
//       const data = await response.json();
//       const snakeToCamel = (obj) => {
//         if (Array.isArray(obj)) return obj.map(v => snakeToCamel(v));
//         if (obj !== null && typeof obj === 'object') {
//           return Object.keys(obj).reduce((acc, key) => {
//             const camelKey = key.replace(/_([a-z])/g, g => g[1].toUpperCase());
//             acc[camelKey] = snakeToCamel(obj[key]);
//             return acc;
//           }, {});
//         }
//         return obj;
//       };
//       setDataEntries(snakeToCamel(data));
//     } catch (err) {
//       console.error('Error fetching data entries:', err);
//       setError('Failed to load data. Please try again later.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Fetch initial data
//   useEffect(() => {
//     if (isLoggedIn && currentUserId && currentUserRole) {
//       fetchEntries();
//       const fetchOptions = async () => {
//         try {
//           const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://rev-lumina.onrender.com/api';
//           const [contractsRes, cardsRes] = await Promise.all([
//             fetch(`${API_BASE_URL}/contract-options`),
//             fetch(`${API_BASE_URL}/credit-card-options`),
//           ]);
//           const contracts = await contractsRes.json();
//           const cards = await cardsRes.json();
//           setContractOptions(contracts);
//           setCreditCardOptions(cards);
//         } catch (error) {
//           console.error("Failed to fetch dropdown options:", error);
//         }
//       };
//       fetchOptions();
//     }
//   }, [isLoggedIn, currentUserId, currentUserRole]);

//   const handleLoginSuccess = (userId, username, role) => {
//     setIsLoggedIn(true);
//     setCurrentUserId(userId);
//     setCurrentUsername(username);
//     setCurrentUserRole(role);
//     setCurrentPage('view');
//   };

//   const handleLogout = () => {
//     setIsLoggedIn(false);
//     setCurrentUserId(null);
//     setCurrentUsername(null);
//     setCurrentUserRole(null);
//     setDataEntries([]);
//   };

//   const renderContent = () => {
//     switch (currentPage) {
//       case 'view':
//         return (
//           <ViewPage
//             dataEntries={dataEntries}
//             isLoading={isLoading}
//             error={error}
//             openAddDataModal={() => setShowAddDataModal(true)}
//             openEditDataModal={() => setShowEditDataModal(true)}
//             openExportModal={() => setShowExportModal(true)}
//           />
//         );
//       case 'accountant':
//         return (
//           <AccountantPage
//             dataEntries={dataEntries}
//             isLoading={isLoading}
//             error={error}
//             fetchEntries={fetchEntries}
//             userId={currentUserId}
//             userRole={currentUserRole}
//           />
//         );
//       case 'settings':
//         return <SettingsPage setCurrentPage={setCurrentPage} currentUserRole={currentUserRole} />;
//       case 'user-profile':
//         return (
//           <UserProfilePage
//             setCurrentPage={setCurrentPage}
//             currentUserId={currentUserId}
//             currentUsername={currentUsername}
//             currentUserRole={currentUserRole}
//           />
//         );
//       default:
//         return <ViewPage dataEntries={dataEntries} isLoading={isLoading} error={error} openExportModal={() => setShowExportModal(true)} />;
//     }
//   };

//   if (!isLoggedIn) {
//     return <LoginPage onLoginSuccess={handleLoginSuccess} />;
//   }

//   return (
//     <div className="relative min-h-screen w-full bg-gray-100">
//       <Sidebar
//         currentPage={currentPage}
//         setCurrentPage={setCurrentPage}
//         currentUserRole={currentUserRole}
//         handleLogout={handleLogout}
//         sidebarOpen={sidebarOpen}
//         setSidebarOpen={setSidebarOpen}
//       />
//       <main className={`transition-all duration-300 ease-in-out p-8 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
//         {renderContent()}
//       </main>

//       {showAddDataModal &&
//         <AddDataModal
//           onClose={() => setShowAddDataModal(false)}
//           userId={currentUserId}
//           username={currentUsername}
//           contractOptions={contractOptions}
//           creditCardOptions={creditCardOptions}
//           onDataAdded={fetchEntries}
//         />}
//       {showEditDataModal &&
//         <EditDataModal
//           onClose={() => setShowEditDataModal(false)}
//           userId={currentUserId}
//           userRole={currentUserRole}
//           username={currentUsername}
//           contractOptions={contractOptions}
//           creditCardOptions={creditCardOptions}
//           onDataEdited={fetchEntries}
//         />}
//       {showExportModal &&
//         <ExportModal
//           onClose={() => setShowExportModal(false)}
//           dataEntries={dataEntries}
//           contractOptions={contractOptions}
//           creditCardOptions={creditCardOptions}
//         />}
//     </div>
//   );
// };

// export default App;

// Stable 1 END ///


// import React, { useState, useEffect } from 'react';
// import LoginPage from '@/components/LoginPage.jsx';
// import Sidebar from '@/components/Sidebar.jsx';
// import AddDataModal from '@/components/AddDataModal.jsx';
// import EditDataModal from '@/components/EditDataModal.jsx';
// import ViewPage from '@/components/ViewPage.jsx';
// import AccountantPage from '@/components/AccountantPage.jsx';
// import UserProfilePage from '@/components/UserProfilePage.jsx';
// import SettingsPage from '@/components/SettingsPage.jsx';
// import ExportModal from '@/components/ExportModal.jsx';
// import SettingsAndProfilePage from '@/components/SettingsAndProfilePage.jsx';

// const App = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [currentPage, setCurrentPage] = useState('view');
//   const [showAddDataModal, setShowAddDataModal] = useState(false);
//   const [showEditDataModal, setShowEditDataModal] = useState(false);
//   const [showExportModal, setShowExportModal] = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(true);

//   // User State
//   const [currentUserId, setCurrentUserId] = useState(null);
//   const [currentUsername, setCurrentUsername] = useState(null);
//   const [currentUserRole, setCurrentUserRole] = useState(null);

//   // Centralized Data State
//   const [dataEntries, setDataEntries] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Dropdown options state
//   const [contractOptions, setContractOptions] = useState([]);
//   const [creditCardOptions, setCreditCardOptions] = useState([]);

//   // Centralized Data Fetching Function
//   const fetchEntries = async () => {
//     if (!isLoggedIn) return;
//     setIsLoading(true);
//     setError(null);
//     try {
//       const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://rev-lumina.onrender.com/api';
//       const response = await fetch(`${API_BASE_URL}/entries?userId=${currentUserId}&userRole=${currentUserRole}`);
//       if (!response.ok) {
//         throw new Error('Failed to fetch data entries');
//       }
//       const data = await response.json();
//       const snakeToCamel = (obj) => {
//         if (Array.isArray(obj)) return obj.map(v => snakeToCamel(v));
//         if (obj !== null && typeof obj === 'object') {
//           return Object.keys(obj).reduce((acc, key) => {
//             const camelKey = key.replace(/_([a-z])/g, g => g[1].toUpperCase());
//             acc[camelKey] = snakeToCamel(obj[key]);
//             return acc;
//           }, {});
//         }
//         return obj;
//       };
//       setDataEntries(snakeToCamel(data));
//     } catch (err) {
//       console.error('Error fetching data entries:', err);
//       setError('Failed to load data. Please try again later.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Fetch initial data
//   useEffect(() => {
//     if (isLoggedIn && currentUserId && currentUserRole) {
//       fetchEntries();
//       const fetchOptions = async () => {
//         try {
//           const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://rev-lumina.onrender.com/api';
//           const [contractsRes, cardsRes] = await Promise.all([
//             fetch(`${API_BASE_URL}/contract-options`),
//             fetch(`${API_BASE_URL}/credit-card-options`),
//           ]);
//           const contracts = await contractsRes.json();
//           const cards = await cardsRes.json();
//           setContractOptions(contracts);
//           setCreditCardOptions(cards);
//         } catch (error) {
//           console.error("Failed to fetch dropdown options:", error);
//         }
//       };
//       fetchOptions();
//     }
//   }, [isLoggedIn, currentUserId, currentUserRole]);

//   const handleLoginSuccess = (userId, username, role) => {
//     setIsLoggedIn(true);
//     setCurrentUserId(userId);
//     setCurrentUsername(username);
//     setCurrentUserRole(role);
//     setCurrentPage('view');
//   };

//   const handleLogout = () => {
//     setIsLoggedIn(false);
//     setCurrentUserId(null);
//     setCurrentUsername(null);
//     setCurrentUserRole(null);
//     setDataEntries([]);
//   };

//   const renderContent = () => {
//     switch (currentPage) {
//       case 'view':
//         return (
//           <ViewPage
//             dataEntries={dataEntries}
//             isLoading={isLoading}
//             error={error}
//             openAddDataModal={() => setShowAddDataModal(true)}
//             openEditDataModal={() => setShowEditDataModal(true)}
//             openExportModal={() => setShowExportModal(true)}
//             userName={currentUsername} // <-- Here is the change
//           />
//         );
//       case 'accountant':
//         return (
//           <AccountantPage
//             dataEntries={dataEntries}
//             isLoading={isLoading}
//             error={error}
//             fetchEntries={fetchEntries}
//             userId={currentUserId}
//             userRole={currentUserRole}
//             userName={currentUsername}
//           />
//         );
//       case 'settings':
//         return <SettingsPage setCurrentPage={setCurrentPage} currentUserRole={currentUserRole} />;
//       case 'user-profile':
//         return (
//           <UserProfilePage
//             setCurrentPage={setCurrentPage}
//             currentUserId={currentUserId}
//             currentUsername={currentUsername}
//             currentUserRole={currentUserRole}
//           />
//         );
//         case 'settings':
//     case 'user-profile':
//       return (
//         <SettingsAndProfilePage
//           setCurrentPage={setCurrentPage}
//           currentUserId={currentUserId}
//           currentUsername={currentUsername}
//           currentUserRole={currentUserRole}
//         />
//       );
//       default:
//         return <ViewPage dataEntries={dataEntries} isLoading={isLoading} error={error} openExportModal={() => setShowExportModal(true)} />;
//     }
//   };

//   if (!isLoggedIn) {
//     return <LoginPage onLoginSuccess={handleLoginSuccess} />;
//   }

//   return (
//     <div className="relative min-h-screen w-full bg-gray-100">
//       <Sidebar
//         currentPage={currentPage}
//         setCurrentPage={setCurrentPage}
//         currentUserRole={currentUserRole}
//         handleLogout={handleLogout}
//         sidebarOpen={sidebarOpen}
//         setSidebarOpen={setSidebarOpen}
//       />
//       {/* <main className={`transition-all duration-300 ease-in-out p-8 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}> */}
//       {/* <main className={`transition-all duration-300 ease-in-out ${sidebarOpen ? 'ml-64' : 'ml-20'}`}> */}
//       {/* <main className={`transition-all duration-300 ease-in-out ${sidebarOpen ? 'ml-64' : 'ml-20'} bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8`}> */}
//       <main className={`transition-all duration-300 ease-in-out ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
//         {renderContent()}
//       </main>

//       {showAddDataModal &&
//         <AddDataModal
//           onClose={() => setShowAddDataModal(false)}
//           userId={currentUserId}
//           username={currentUsername}
//           contractOptions={contractOptions}
//           creditCardOptions={creditCardOptions}
//           onDataAdded={fetchEntries}
//         />}
//       {showEditDataModal &&
//         <EditDataModal
//           onClose={() => setShowEditDataModal(false)}
//           userId={currentUserId}
//           userRole={currentUserRole}
//           username={currentUsername}
//           contractOptions={contractOptions}
//           creditCardOptions={creditCardOptions}
//           onDataEdited={fetchEntries}
//         />}
//       {showExportModal &&
//         <ExportModal
//           onClose={() => setShowExportModal(false)}
//           dataEntries={dataEntries}
//           contractOptions={contractOptions}
//           creditCardOptions={creditCardOptions}
//         />}
//     </div>
//   );
// };

// export default App;



// STABLE 2 END ///

/// STABLE 3 START ///


// import React, { useState, useEffect } from 'react';
// import LoginPage from '@/components/LoginPage.jsx';
// import Sidebar from '@/components/Sidebar.jsx';
// import AddDataModal from '@/components/AddDataModal.jsx';
// import EditDataModal from '@/components/EditDataModal.jsx';
// import ViewPage from '@/components/ViewPage.jsx';
// import AccountantPage from '@/components/AccountantPage.jsx';
// import ExportModal from '@/components/ExportModal.jsx';
// import SettingsAndProfilePage from '@/components/SettingsAndProfilePage.jsx'; // The only settings/profile page you need

// const App = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [currentPage, setCurrentPage] = useState('view');
//   const [showAddDataModal, setShowAddDataModal] = useState(false);
//   const [showEditDataModal, setShowEditDataModal] = useState(false);
//   const [showExportModal, setShowExportModal] = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [currentUserAvatar, setCurrentUserAvatar] = useState(null); // <-- Add this line

//   // User State
//   const [currentUserId, setCurrentUserId] = useState(null);
//   const [currentUsername, setCurrentUsername] = useState(null);
//   const [currentUserRole, setCurrentUserRole] = useState(null);

//   // Centralized Data State
//   const [dataEntries, setDataEntries] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Dropdown options state
//   const [contractOptions, setContractOptions] = useState([]);
//   const [creditCardOptions, setCreditCardOptions] = useState([]);

//   // Centralized Data Fetching Function
//   const fetchEntries = async () => {
//     if (!isLoggedIn) return;
//     setIsLoading(true);
//     setError(null);
//     try {
//       const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://rev-lumina.onrender.com/api';
//       const response = await fetch(`${API_BASE_URL}/entries?userId=${currentUserId}&userRole=${currentUserRole}`);
//       if (!response.ok) {
//         throw new Error('Failed to fetch data entries');
//       }
//       const data = await response.json();
//       const snakeToCamel = (obj) => {
//         if (Array.isArray(obj)) return obj.map(v => snakeToCamel(v));
//         if (obj !== null && typeof obj === 'object') {
//           return Object.keys(obj).reduce((acc, key) => {
//             const camelKey = key.replace(/_([a-z])/g, g => g[1].toUpperCase());
//             acc[camelKey] = snakeToCamel(obj[key]);
//             return acc;
//           }, {});
//         }
//         return obj;
//       };
//       setDataEntries(snakeToCamel(data));
//     } catch (err) {
//       console.error('Error fetching data entries:', err);
//       setError('Failed to load data. Please try again later.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Fetch initial data
//   useEffect(() => {
//     if (isLoggedIn && currentUserId && currentUserRole) {
//       fetchEntries();
//       const fetchOptions = async () => {
//         try {
//           const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://rev-lumina.onrender.com/api';
//           const [contractsRes, cardsRes] = await Promise.all([
//             fetch(`${API_BASE_URL}/contract-options`),
//             fetch(`${API_BASE_URL}/credit-card-options`),
//           ]);
//           const contracts = await contractsRes.json();
//           const cards = await cardsRes.json();
//           setContractOptions(contracts);
//           setCreditCardOptions(cards);
//         } catch (error) {
//           console.error("Failed to fetch dropdown options:", error);
//         }
//       };
//       fetchOptions();
//     }
//   }, [isLoggedIn, currentUserId, currentUserRole]);

//   const handleLoginSuccess = (userId, username, role) => {
//     setIsLoggedIn(true);
//     setCurrentUserId(userId);
//     setCurrentUsername(username);
//     setCurrentUserRole(role);
//     setCurrentPage('view');
//     setCurrentUserAvatar(avatar);
//   };

//   const handleLogout = () => {
//     setIsLoggedIn(false);
//     setCurrentUserId(null);
//     setCurrentUsername(null);
//     setCurrentUserRole(null);
//     setCurrentUserAvatar(null);
//     setDataEntries([]);
//   };

//   const renderContent = () => {
//     switch (currentPage) {
//       case 'view':
//         return (
//           <ViewPage
//             dataEntries={dataEntries}
//             isLoading={isLoading}
//             error={error}
//             openAddDataModal={() => setShowAddDataModal(true)}
//             openEditDataModal={() => setShowEditDataModal(true)}
//             openExportModal={() => setShowExportModal(true)}
//             userAvatar={currentUserAvatar}
//             userName={currentUsername}
//           />
//         );
//       case 'accountant':
//         return (
//           <AccountantPage
//             dataEntries={dataEntries}
//             isLoading={isLoading}
//             error={error}
//             fetchEntries={fetchEntries}
//             userId={currentUserId}
//             userRole={currentUserRole}
//             userName={currentUsername}
//             userAvatar={currentUserAvatar}
//           />
//         );
//       // CORRECTED: Combined case for the new component
//       case 'settings':
//       case 'user-profile':
//         return (
//           <SettingsAndProfilePage
//             setCurrentPage={setCurrentPage}
//             currentUserId={currentUserId}
//             currentUsername={currentUsername}
//             currentUserRole={currentUserRole}
//           />
//         );
//       default:
//         return <ViewPage dataEntries={dataEntries} isLoading={isLoading} error={error} openExportModal={() => setShowExportModal(true)} />;
//     }
//   };

//   if (!isLoggedIn) {
//     return <LoginPage onLoginSuccess={handleLoginSuccess} />;
//   }

//   return (
//     <div className="relative min-h-screen w-full bg-gray-100">
//       <Sidebar
//         currentPage={currentPage}
//         setCurrentPage={setCurrentPage}
//         currentUserRole={currentUserRole}
//         handleLogout={handleLogout}
//         sidebarOpen={sidebarOpen}
//         setSidebarOpen={setSidebarOpen}
//       />
//       {/* CLEANED UP: Only one main tag */}
//       <main className={`transition-all duration-300 ease-in-out ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
//         {renderContent()}
//       </main>

//       {showAddDataModal &&
//         <AddDataModal
//           onClose={() => setShowAddDataModal(false)}
//           userId={currentUserId}
//           username={currentUsername}
//           contractOptions={contractOptions}
//           creditCardOptions={creditCardOptions}
//           onDataAdded={fetchEntries}
//         />}
//       {showEditDataModal &&
//         <EditDataModal
//           onClose={() => setShowEditDataModal(false)}
//           userId={currentUserId}
//           userRole={currentUserRole}
//           username={currentUsername}
//           contractOptions={contractOptions}
//           creditCardOptions={creditCardOptions}
//           onDataEdited={fetchEntries}
//         />}
//       {showExportModal &&
//         <ExportModal
//           onClose={() => setShowExportModal(false)}
//           dataEntries={dataEntries}
//           contractOptions={contractOptions}
//           creditCardOptions={creditCardOptions}
//         />}
//     </div>
//   );
// };

// export default App;


// STABLE 3 END ///

import React, { useState, useEffect } from 'react';
import LoginPage from '@/components/LoginPage.jsx';
import Sidebar from '@/components/Sidebar.jsx';
import AddDataModal from '@/components/AddDataModal.jsx';
import EditDataModal from '@/components/EditDataModal.jsx';
import ViewPage from '@/components/ViewPage.jsx';
import AccountantPage from '@/components/AccountantPage.jsx';
import ExportModal from '@/components/ExportModal.jsx';
import SettingsAndProfilePage from '@/components/SettingsAndProfilePage.jsx';
import AboutPage from '@/components/AboutPage.jsx';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('view');
  const [showAddDataModal, setShowAddDataModal] = useState(false);
  const [showEditDataModal, setShowEditDataModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // User State
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUsername, setCurrentUsername] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [currentUserAvatar, setCurrentUserAvatar] = useState(null);

  // Centralized Data State
  const [dataEntries, setDataEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dropdown options state
  const [contractOptions, setContractOptions] = useState([]);
  const [creditCardOptions, setCreditCardOptions] = useState([]);

  const fetchEntries = async () => {
    if (!isLoggedIn) return;
    setIsLoading(true);
    setError(null);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://rev-lumina.onrender.com/api';
      const response = await fetch(`${API_BASE_URL}/entries?userId=${currentUserId}&userRole=${currentUserRole}`);
      if (!response.ok) throw new Error('Failed to fetch data entries');
      const data = await response.json();
      const snakeToCamel = (obj) => {
        if (Array.isArray(obj)) return obj.map(v => snakeToCamel(v));
        if (obj !== null && typeof obj === 'object') {
          return Object.keys(obj).reduce((acc, key) => {
            const camelKey = key.replace(/_([a-z])/g, g => g[1].toUpperCase());
            acc[camelKey] = snakeToCamel(obj[key]);
            return acc;
          }, {});
        }
        return obj;
      };
      setDataEntries(snakeToCamel(data));
    } catch (err) {
      console.error('Error fetching data entries:', err);
      setError('Failed to load data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn && currentUserId && currentUserRole) {
      fetchEntries();
      const fetchOptions = async () => {
        try {
          const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://rev-lumina.onrender.com/api';
          const [contractsRes, cardsRes] = await Promise.all([
            fetch(`${API_BASE_URL}/contract-options`),
            fetch(`${API_BASE_URL}/credit-card-options`),
          ]);
          const contracts = await contractsRes.json();
          const cards = await cardsRes.json();
          setContractOptions(contracts);
          setCreditCardOptions(cards);
        } catch (error) {
          console.error("Failed to fetch dropdown options:", error);
        }
      };
      fetchOptions();
    }
  }, [isLoggedIn, currentUserId, currentUserRole]);

  const handleLoginSuccess = (userId, username, role, avatar) => {
    setIsLoggedIn(true);
    setCurrentUserId(userId);
    setCurrentUsername(username);
    setCurrentUserRole(role);
    setCurrentUserAvatar(avatar);
    setCurrentPage('view');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUserId(null);
    setCurrentUsername(null);
    setCurrentUserRole(null);
    setCurrentUserAvatar(null);
    setDataEntries([]);
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'view':
        return (
          <ViewPage
            dataEntries={dataEntries}
            isLoading={isLoading}
            error={error}
            openAddDataModal={() => setShowAddDataModal(true)}
            openEditDataModal={() => setShowEditDataModal(true)}
            openExportModal={() => setShowExportModal(true)}
            userName={currentUsername}
            userAvatar={currentUserAvatar}
            handleLogout={handleLogout}
            currentUserRole={currentUserRole}
          />
        );
      case 'accountant':
        return (
          <AccountantPage
            dataEntries={dataEntries}
            isLoading={isLoading}
            error={error}
            fetchEntries={fetchEntries}
            userId={currentUserId}
            userRole={currentUserRole}
            userName={currentUsername}
            userAvatar={currentUserAvatar}
            handleLogout={handleLogout}
          />
        );
      case 'settings':
      case 'user-profile':
        return (
          <SettingsAndProfilePage
            setCurrentPage={setCurrentPage}
            currentUserId={currentUserId}
            currentUsername={currentUsername}
            currentUserRole={currentUserRole}
          />
        );
        case 'about':
      // return <AboutPage setCurrentPage={setCurrentPage} />;
      return <AboutPage setCurrentPage={setCurrentPage} handleLogout={handleLogout} />;

      default:
        return <ViewPage dataEntries={dataEntries} isLoading={isLoading} error={error} openExportModal={() => setShowExportModal(true)} userName={currentUsername} userAvatar={currentUserAvatar}   currentUserRole={currentUserRole} />;
    }
  };

  if (!isLoggedIn) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="relative min-h-screen w-full bg-gray-100">
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        currentUserRole={currentUserRole}
        handleLogout={handleLogout}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <main className={`transition-all duration-300 ease-in-out ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {renderContent()}
      </main>

      {showAddDataModal &&
        <AddDataModal
          onClose={() => setShowAddDataModal(false)}
          userId={currentUserId}
          username={currentUsername}
          contractOptions={contractOptions}
          creditCardOptions={creditCardOptions}
          onDataAdded={fetchEntries}
        />}
      {showEditDataModal &&
        <EditDataModal
          onClose={() => setShowEditDataModal(false)}
          userId={currentUserId}
          userRole={currentUserRole}
          username={currentUsername}
          contractOptions={contractOptions}
          creditCardOptions={creditCardOptions}
          onDataEdited={fetchEntries}
        />}
      {showExportModal &&
        <ExportModal
          onClose={() => setShowExportModal(false)}
          dataEntries={dataEntries}
          contractOptions={contractOptions}
          creditCardOptions={creditCardOptions}
        />}
    </div>
  );
};

export default App;
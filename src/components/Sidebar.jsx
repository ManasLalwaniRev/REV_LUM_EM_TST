// // src/components/Sidebar.jsx
// import React from 'react';
// import {
//   Menu,
//   Database,
//   Briefcase,
//   Users,
//   Settings,
//   LogOut,
// } from "lucide-react";

// // Individual Sidebar Item Component
// const SidebarItem = ({ icon, text, page, currentPage, setCurrentPage, isCollapsed }) => (
//   <button
//     onClick={() => setCurrentPage(page)}
//     className={`flex items-center w-full p-3 my-1 rounded-lg transition-colors duration-200 group cursor-pointer ${
//       currentPage === page
//         ? "bg-green-600 text-white font-semibold shadow" // Active item style
//         : "text-green-800 hover:bg-green-100" // Inactive item style
//     }`}
//   >
//     {icon}
//     <span
//       className={`ml-4 transition-opacity duration-200 whitespace-nowrap ${
//         isCollapsed ? "opacity-0 hidden" : "opacity-100"
//       }`}
//     >
//       {text}
//     </span>
//   </button>
// );

// export default function Sidebar({ currentPage, setCurrentPage, currentUserRole, handleLogout, sidebarOpen, setSidebarOpen }) {
  
//   const navItems = [
//     { page: 'view', label: 'View/Edit Data', icon: <Database className="h-5 w-5" />, roles: ['user', 'admin', 'accountant'] },
//     { page: 'accountant', label: 'Accountant View', icon: <Briefcase className="h-5 w-5" />, roles: ['admin', 'accountant'] },
//     // { page: 'user-profile', label: 'User Management', icon: <Users className="h-5 w-5" />, roles: ['admin'] },
//     // { page: 'settings', label: 'Settings', icon: <Settings className="h-5 w-5" />, roles: ['admin'] },
//     { page: 'user-profile', label: 'Settings & Profile', icon: <Settings className="h-5 w-5" />, roles: ['user', 'admin', 'accountant'] },
//   ];

//   return (
//     <div
//       className={`fixed inset-y-0 left-0 bg-green-50 text-gray-800 shadow-lg z-40 flex flex-col border-r border-green-200 transition-all duration-300 ${
//         sidebarOpen ? "w-64" : "w-20"
//       }`}
//     >
//       <div className="flex flex-col flex-1 p-3 overflow-y-auto">
//         {/* Header with Menu Toggle */}
//         <div
//           className={`flex items-center mb-4 p-2 ${
//             sidebarOpen ? "justify-start" : "justify-center"
//           }`}
//         >
//           <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 rounded-lg hover:bg-green-100">
//             <Menu className="h-6 w-6 text-green-800" />
//           </button>
//           <span
//             className={`ml-3 text-lg font-bold text-green-900 transition-all duration-200 ${
//               sidebarOpen ? "opacity-100" : "opacity-0 hidden"
//             }`}
//           >
//             Lumina
//           </span>
//         </div>

//         {/* Navigation Items */}
//         <nav className="flex-grow">
//           {navItems.map(item =>
//             item.roles.includes(currentUserRole) && (
//               <SidebarItem
//                 key={item.page}
//                 icon={item.icon}
//                 text={item.label}
//                 page={item.page}
//                 currentPage={currentPage}
//                 setCurrentPage={setCurrentPage}
//                 isCollapsed={!sidebarOpen}
//               />
//             )
//           )}
//         </nav>

//         {/* Logout Button */}
//         <div className="pt-2 mt-auto border-t border-green-200">
//           <button
//             onClick={handleLogout}
//             className={`flex items-center w-full p-3 my-1 rounded-lg transition-colors duration-200 group cursor-pointer text-red-700 hover:bg-red-100 ${
//               !sidebarOpen ? "justify-center" : ""
//             }`}
//           >
//             <LogOut className="h-5 w-5" />
//             <span
//               className={`ml-4 font-semibold transition-opacity duration-200 ${
//                 !sidebarOpen ? "opacity-0 hidden" : "opacity-100"
//               }`}
//             >
//               Logout
//             </span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// STABLE 1 //



// import React from 'react';
// import {
//   Menu,
//   Database,
//   Briefcase,
//   Settings,
//   LogOut,
// } from "lucide-react";

// // Individual Sidebar Item Component
// const SidebarItem = ({ icon, text, page, currentPage, setCurrentPage, isCollapsed }) => (
//   <button
//     onClick={() => setCurrentPage(page)}
//     // className={`flex items-center w-full p-3 my-1 rounded-lg transition-colors duration-200 group cursor-pointer ${
//     //   currentPage === page
//     //     ? "bg-green-600 text-white font-semibold shadow" // Active item style
//     //     : "text-green-800 hover:bg-green-100" // Inactive item style
//     // }`}
//     className={`flex items-center w-full p-3 my-1 rounded-lg transition-colors duration-200 group cursor-pointer ${
//   currentPage === page
//     ? "bg-yellow-600 text-white font-semibold shadow" // Active item style
//     : "text-yellow-800 hover:bg-yellow-100" // Inactive item style
// }`}
//   >
//     {icon}
//     <span
//       className={`ml-4 transition-opacity duration-200 whitespace-nowrap ${
//         isCollapsed ? "opacity-0 hidden" : "opacity-100"
//       }`}
//     >
//       {text}
//     </span>
//   </button>
// );

// export default function Sidebar({ currentPage, setCurrentPage, currentUserRole, handleLogout, sidebarOpen, setSidebarOpen }) {
  
//   const navItems = [
//     { page: 'view', label: 'View/Edit Data', icon: <Database className="h-5 w-5" />, roles: ['user', 'admin', 'accountant'] },
//     { page: 'accountant', label: 'Accountant View', icon: <Briefcase className="h-5 w-5" />, roles: ['admin', 'accountant'] },
//     { page: 'user-profile', label: 'Settings & Profile', icon: <Settings className="h-5 w-5" />, roles: ['user', 'admin', 'accountant'] },
//   ];

//   return (
//     // <div
//     //   className={`fixed inset-y-0 left-0 bg-green-50 text-gray-800 shadow-lg z-40 flex flex-col border-r border-green-200 transition-all duration-300 ${
//     //     sidebarOpen ? "w-64" : "w-20"
//     //   }`}
//     // >
//     <div
//   className={`fixed inset-y-0 left-0 bg-yellow-100 text-gray-800 shadow-lg z-40 flex flex-col border-r border-yellow-200 transition-all duration-300 ${
//     sidebarOpen ? "w-64" : "w-20"
//   }`}
// >
//       <div className="flex flex-col flex-1 p-3 overflow-y-auto">
//         {/* Header with Menu Toggle */}
//         <div
//           className={`flex items-center mb-4 p-2 ${
//             sidebarOpen ? "justify-start" : "justify-center"
//           }`}
//         >
//           {/* <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 rounded-lg hover:bg-green-100">
//             <Menu className="h-6 w-6 text-green-800" />
//           </button>
//           <span
//             className={`ml-3 text-lg font-bold text-green-900 transition-all duration-200 ${
//               sidebarOpen ? "opacity-100" : "opacity-0 hidden"
//             }`}
//           >
//            Powered by Revolve
//           </span> */}
//           <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 rounded-lg hover:bg-yellow-100">
//   <Menu className="h-6 w-6 text-yellow-800" />
// </button>
// <span
//   className={`ml-3 text-lg font-bold text-yellow-900 transition-all duration-200 ${
//     sidebarOpen ? "opacity-100" : "opacity-0 hidden"
//   }`}
// >
//   Powered by Revolve
// </span>
//         </div>
//         {/* Navigation Items */}
//         <nav className="flex-grow">
//           {navItems.map(item =>
//             item.roles.includes(currentUserRole) && (
//               <SidebarItem
//                 key={item.page}
//                 icon={item.icon}
//                 text={item.label}
//                 page={item.page}
//                 currentPage={currentPage}
//                 setCurrentPage={setCurrentPage}
//                 isCollapsed={!sidebarOpen}
//               />
//             )
//           )}
//         </nav>

//         {/* Logout Button */}
//         {/* <div className="pt-2 mt-auto border-t border-green-200"> */}
//         {/* <div className="pt-2 mt-auto border-t border-yellow-200">
//           <button
//             onClick={handleLogout}
//             className={`flex items-center w-full p-3 my-1 rounded-lg transition-colors duration-200 group cursor-pointer text-red-700 hover:bg-red-100 ${
//               !sidebarOpen ? "justify-center" : ""
//             }`}
//           >
//             <LogOut className="h-5 w-5" />
//             <span
//               className={`ml-4 font-semibold transition-opacity duration-200 ${
//                 !sidebarOpen ? "opacity-0 hidden" : "opacity-100"
//               }`}
//             >
//               Logout
//             </span>
//           </button>
//         </div> */}
//       </div>
//     </div>
//   );
// }


// STABLE 1 ENDS //


import React from 'react';
import AboutPage from '@/components/AboutPage.jsx';
import {
  Menu,
  Database,
  Briefcase,
  Settings,
  LogOut,
  Info, // 1. Import the 'Info' icon for the About page
} from "lucide-react";

// Individual Sidebar Item Component (no changes needed here)
const SidebarItem = ({ icon, text, page, currentPage, setCurrentPage, isCollapsed }) => (
  <button
    onClick={() => setCurrentPage(page)}
    className={`relative flex items-center w-full p-3 my-1 rounded-lg transition-colors duration-200 group cursor-pointer ${
      currentPage === page
        ? "bg-yellow-600 text-white font-semibold shadow"
        : "text-yellow-800 hover:bg-yellow-100"
    }`}
  >
    {icon}
    <span
      className={`ml-4 transition-opacity duration-200 whitespace-nowrap ${
        isCollapsed ? "opacity-0 hidden" : "opacity-100"
      }`}
    >
      {text}
    </span>
    {isCollapsed && (
        <div className="absolute left-full rounded-md px-2 py-1 ml-6 bg-gray-900 text-white text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0">
            {text}
        </div>
    )}
  </button>
);

export default function Sidebar({ currentPage, setCurrentPage, currentUserRole, handleLogout, sidebarOpen, setSidebarOpen }) {
  
  // 2. Update the navigation items
  const navItems = [
    { page: 'view', label: 'Expense Entries', icon: <Database className="h-5 w-5" />, roles: ['user', 'admin', 'accountant'] },
    { page: 'accountant', label: 'Voucher Entries', icon: <Briefcase className="h-5 w-5" />, roles: ['admin', 'accountant'] },
    { page: 'user-profile', label: 'Settings & Profile', icon: <Settings className="h-5 w-5" />, roles: ['user', 'admin', 'accountant'] },
    { page: 'about', label: 'About', icon: <Info className="h-5 w-5" />, roles: ['user', 'admin', 'accountant'] }, // New "About" item
  ];

  return (
    <div
      className={`fixed inset-y-0 left-0 bg-yellow-100 text-gray-800 shadow-lg z-40 flex flex-col border-r border-yellow-200 transition-all duration-300 ${
        sidebarOpen ? "w-64" : "w-20"
      }`}
    >
      <div className="flex flex-col flex-1 p-3 overflow-y-auto">
        {/* Header with Menu Toggle */}
        <div
          className={`flex items-center mb-4 p-2 ${
            sidebarOpen ? "justify-start" : "justify-center"
          }`}
        >
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 rounded-lg hover:bg-yellow-100">
            <Menu className="h-6 w-6 text-yellow-800" />
          </button>
          <span
            className={`ml-3 text-lg font-bold text-yellow-900 transition-all duration-200 ${
              sidebarOpen ? "opacity-100" : "opacity-0 hidden"
            }`}
          >
            {/* 3. Change header text */}
            Expense Management
          </span>
        </div>
        
        {/* Navigation Items */}
        <nav className="flex-grow">
          {navItems.map(item =>
            item.roles.includes(currentUserRole) && (
              <SidebarItem
                key={item.page}
                icon={item.icon}
                text={item.label}
                page={item.page}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                isCollapsed={!sidebarOpen}
              />
            )
          )}
        </nav>

        {/* --- DIVIDER & LOGOUT BUTTON (UNCOMMENTED) --- */}
        <div className="pt-2 mt-auto border-t border-yellow-200">
          {/* <button
            onClick={handleLogout}
            className={`relative flex items-center w-full p-3 my-1 rounded-lg transition-colors duration-200 group cursor-pointer text-red-700 hover:bg-red-100 ${
              !sidebarOpen ? "justify-center" : ""
            }`}
          > */}
            {/* <LogOut className="h-5 w-5" /> */}
            {/* <span
              className={`ml-4 font-semibold transition-opacity duration-200 ${
                !sidebarOpen ? "opacity-0 hidden" : "opacity-100"
              }`}
            >
              Logout
            </span> */}
             {/* Tooltip for collapsed state */}
            {/* {!sidebarOpen && (
                <div className="absolute left-full rounded-md px-2 py-1 ml-6 bg-gray-900 text-white text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0">
                    Logout
                </div>
            )}
          </button> */}
        </div>

        {/* --- 4. "POWERED BY" TEXT AT THE BOTTOM --- */}
        <div className="pt-2 text-center">
            <span className={`text-xs text-yellow-800 transition-opacity duration-200 ${!sidebarOpen ? 'hidden' : 'opacity-100'}`}>
                Powered by Revolve
            </span>
        </div>
      </div>
    </div>
  );
}
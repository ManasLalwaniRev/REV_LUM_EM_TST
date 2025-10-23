
// import React from 'react';

// const HomePage = ({ setCurrentPage, openAddDataModal, openEditDataModal, currentUserRole }) => {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 p-8"> {/* Updated gradient classes */}
//       <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-4xl text-center">
//         <h1 className="text-5xl font-extrabold text-gray-800 mb-8">
//           <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
//             Welcome to Lumina Vendor Portal
//           </span>
//         </h1>
//         <p className="text-xl text-gray-600 mb-12">
//           {/* Your centralized platform for managing vendor data efficiently. */}
//         </p>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {/* Always visible buttons */}
//           <button
//             onClick={openAddDataModal}
//             className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
//           >
//             Add Data
//           </button>
//           <button
//             onClick={openEditDataModal}
//             className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-4 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
//           >
//             Edit Data
//           </button>
//           <button
//             onClick={() => setCurrentPage('view')}
//             className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
//           >
//             View All Data
//           </button>

//           {/* Conditional rendering for Accountant and User Profile buttons */}
//           {currentUserRole === 'admin' && (
//             <>
//               <button
//                 onClick={() => setCurrentPage('accountant')}
//                 className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
//               >
//                 Accountant
//               </button>
//               <button
//                 onClick={() => setCurrentPage('user-profile')}
//                 className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-4 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
//               >
//                 User Profile
//               </button>
//             </>
//           )}
//           {/* You can add more buttons here */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HomePage;


//LATEST VERSION ENDS //

// src/components/HomePage.jsx
// import React from 'react';

// const HomePage = ({ setCurrentPage, openAddDataModal, openEditDataModal, currentUserRole }) => {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 p-8"> {/* Updated gradient classes */}
//       <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-4xl text-center">
//         <h1 className="text-5xl font-extrabold text-gray-800 mb-8">
//           <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
//             Welcome to Lumina Vendor Portal
//           </span>
//         </h1>
//         <p className="text-xl text-gray-600 mb-12">
//           {/* Your centralized platform for managing vendor data efficiently. */}
//         </p>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {/* Always visible buttons */}
//           <button
//             onClick={openAddDataModal}
//             className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
//           >
//             Add Data
//           </button>
//           <button
//             onClick={openEditDataModal}
//             className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-4 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
//           >
//             Edit Data
//           </button>
//           <button
//             onClick={() => setCurrentPage('view')}
//             className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
//           >
//             View All Data
//           </button>

//           {/* Conditional rendering for Admin buttons */}
//           {currentUserRole === 'admin' && (
//             <>
//               <button
//                 onClick={() => setCurrentPage('accountant')}
//                 className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
//               >
//                 Accountant
//               </button>
//               <button
//                 onClick={() => setCurrentPage('user-profile')}
//                 className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-4 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
//               >
//                 User Profile
//               </button>
//               {/* --- NEW Settings Button --- */}
//               <button
//                 onClick={() => setCurrentPage('settings')}
//                 className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-4 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
//                 >
//                 Settings
//               </button>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HomePage;


// src/components/HomePage.jsx
import React from 'react';

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 p-8">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-4xl text-center">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-8">
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            Welcome to Lumina Vendor Portal
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          {/* Use the sidebar to navigate through the application. */}
        </p>
      </div>
    </div>
  );
};

export default HomePage;
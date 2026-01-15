
// import React, { useState, useEffect } from 'react';
// import bcrypt from 'bcryptjs'; // Import bcryptjs for hashing on the frontend (for demonstration, ideally done on backend)

// const API_BASE_URL = 'https://rev-lumina.onrender.com/api'; // Your deployed backend API base URL

// const UserProfilePage = ({ setCurrentPage, currentUserId, currentUsername, currentUserRole }) => {
//   const [newUsername, setNewUsername] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [newUserRole, setNewUserRole] = useState('user'); // Default new user role
//   const [message, setMessage] = useState(''); // For success/error messages
//   const [isLoading, setIsLoading] = useState(false);

//   // Clear message after a few seconds
//   useEffect(() => {
//     if (message) {
//       const timer = setTimeout(() => setMessage(''), 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [message]);

//   const handleCreateUser = async (e) => {
//     e.preventDefault();
//     setMessage('');
//     setIsLoading(true);

//     if (!newUsername || !newPassword) {
//       setMessage('Username and password are required.');
//       setIsLoading(false);
//       return;
//     }

//     try {
//       // Hash password on the frontend (for demonstration purposes only)
//       // In a production app, password hashing should ALWAYS occur on the backend.
//       const hashedPassword = await bcrypt.hash(newPassword, 10); // 10 salt rounds

//       const response = await fetch(`${API_BASE_URL}/users/new`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           username: newUsername,
//           password_hash: hashedPassword, // Send the hashed password
//           role: newUserRole,
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to create user');
//       }

//       setMessage('User created successfully!');
//       setNewUsername('');
//       setNewPassword('');
//       setNewUserRole('user'); // Reset role to default
//     } catch (err) {
//       console.error('Error creating user:', err);
//       setMessage(`Error: ${err.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center min-h-screen w-full bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 p-4 sm:p-8">
//       <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-2xl text-center max-w-4xl w-full">
//         <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-8 sm:mb-12 leading-normal">
//           <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
//             User Profile & Management
//           </span>
//         </h1>

//         {/* Current User Information */}
//         <div className="mb-10 p-6 bg-gray-50 rounded-lg shadow-inner">
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Profile</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
//             <div>
//               <p className="text-gray-700 font-semibold">Username:</p>
//               <p className="text-gray-900 text-lg">{currentUsername || 'N/A'}</p>
//             </div>
//             <div>
//               <p className="text-gray-700 font-semibold">Role:</p>
//               <p className="text-gray-900 text-lg">{currentUserRole || 'N/A'}</p>
//             </div>
//           </div>
//         </div>

//         {/* Create New User Section (Admin Only) */}
//         {currentUserRole === 'admin' && (
//           <div className="mb-10 p-6 bg-blue-50 rounded-lg shadow-inner">
//             <h2 className="text-2xl font-bold text-blue-800 mb-4">Create New User</h2>
//             {message && (
//               <p className={`mb-4 text-center ${message.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>
//                 {message}
//               </p>
//             )}
//             <form onSubmit={handleCreateUser} className="space-y-4">
//               <div>
//                 <label htmlFor="newUsername" className="sr-only">New Username</label>
//                 <input
//                   type="text"
//                   id="newUsername"
//                   className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//                   placeholder="New Username"
//                   value={newUsername}
//                   onChange={(e) => setNewUsername(e.target.value)}
//                   required
//                 />
//               </div>
//               <div>
//                 <label htmlFor="newPassword" className="sr-only">New Password</label>
//                 <input
//                   type="password"
//                   id="newPassword"
//                   className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//                   placeholder="New Password"
//                   value={newPassword}
//                   onChange={(e) => setNewPassword(e.target.value)}
//                   required
//                 />
//               </div>
//               <div>
//                 <label htmlFor="newUserRole" className="block text-sm font-medium text-gray-700 text-left mb-1">Role</label>
//                 <select
//                   id="newUserRole"
//                   className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//                   value={newUserRole}
//                   onChange={(e) => setNewUserRole(e.target.value)}
//                   required
//                 >
//                   <option value="user">User</option>
//                   <option value="admin">Admin</option>
//                   <option value="accountant">Accountant</option>
//                 </select>
//               </div>
//               <button
//                 type="submit"
//                 className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
//                 disabled={isLoading}
//               >
//                 {isLoading ? 'Creating User...' : 'Create User'}
//               </button>
//             </form>
//           </div>
//         )}

//         {/* Back to Home Button */}
//         <div className="mt-8 text-center">
//           <button
//             onClick={() => setCurrentPage('home')}
//             className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105"
//           >
//             Back to Home
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserProfilePage;


// import React, { useState, useEffect } from 'react';
// import bcrypt from 'bcryptjs'; // For hashing on the frontend (for demonstration)

// const API_BASE_URL = 'https://rev-lumina.onrender.com/api'; // Your deployed backend API base URL

// const UserProfilePage = ({ setCurrentPage, currentUserId, currentUsername, currentUserRole }) => {
//   const [newUsername, setNewUsername] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [newUserRole, setNewUserRole] = useState('user'); // Default new user role
//   const [message, setMessage] = useState(''); // For success/error messages for user creation
//   const [isLoading, setIsLoading] = useState(false); // For user creation form
//   const [users, setUsers] = useState([]); // State to store fetched users
//   const [filteredUsers, setFilteredUsers] = useState([]); // State to store filtered users
//   const [usersLoading, setUsersLoading] = useState(false); // For fetching user list
//   const [usersError, setUsersError] = useState(null); // For fetching user list error
//   const [searchQuery, setSearchQuery] = useState(''); // State for search query

//   // Clear message after a few seconds
//   useEffect(() => {
//     if (message) {
//       const timer = setTimeout(() => setMessage(''), 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [message]);

//   // Function to fetch all users (admin only)
//   const fetchUsers = async () => {
//     if (currentUserRole !== 'admin') {
//       setUsersError('You do not have permission to view this list.');
//       return;
//     }
//     setUsersLoading(true);
//     setUsersError(null);
//     try {
//       // Pass userRole as a query parameter for backend authorization
//       const response = await fetch(`${API_BASE_URL}/users?userRole=${currentUserRole}`);
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to fetch users');
//       }
//       const data = await response.json();
//       setUsers(data); // Store all fetched users
//     } catch (err) {
//       console.error('Error fetching users:', err);
//       setUsersError(`Error loading users: ${err.message}`);
//     } finally {
//       setUsersLoading(false);
//     }
//   };

//   // Fetch users when component mounts or currentUserRole changes (if admin)
//   useEffect(() => {
//     if (currentUserRole === 'admin') {
//       fetchUsers();
//     }
//   }, [currentUserRole]); // Dependency on currentUserRole

//   // useEffect to filter users whenever 'users' or 'searchQuery' changes
//   useEffect(() => {
//     const lowercasedQuery = searchQuery.toLowerCase();
//     const currentFilteredUsers = users.filter(user => {
//       return (
//         String(user.username).toLowerCase().includes(lowercasedQuery) ||
//         String(user.role).toLowerCase().includes(lowercasedQuery)
//       );
//     });
//     setFilteredUsers(currentFilteredUsers);
//   }, [users, searchQuery]); // Dependencies: users data and search query


//   const handleCreateUser = async (e) => {
//     e.preventDefault();
//     setMessage('');
//     setIsLoading(true);

//     if (!newUsername || !newPassword) {
//       setMessage('Username and password are required.');
//       setIsLoading(false);
//       return;
//     }

//     try {
//       // Hash password on the frontend (for demonstration purposes only)
//       // In a production app, password hashing should ALWAYS occur on the backend.
//       const hashedPassword = await bcrypt.hash(newPassword, 10); // 10 salt rounds

//       const response = await fetch(`${API_BASE_URL}/users/new`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           username: newUsername,
//           password_hash: hashedPassword, // Send the hashed password
//           role: newUserRole,
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to create user');
//       }

//       setMessage('User created successfully!');
//       setNewUsername('');
//       setNewPassword('');
//       setNewUserRole('user'); // Reset role to default
//       if (currentUserRole === 'admin') {
//         fetchUsers(); // Re-fetch user list after creation if admin
//       }
//     } catch (err) {
//       console.error('Error creating user:', err);
//       setMessage(`Error: ${err.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center min-h-screen w-full bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 p-4 sm:p-8">
//       <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-2xl text-center max-w-4xl w-full">
//         <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-8 sm:mb-12 leading-normal">
//           <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
//             User Profile & Management
//           </span>
//         </h1>

//         {/* Current User Information */}
//         <div className="mb-10 p-6 bg-gray-50 rounded-lg shadow-inner">
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Profile</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
//             <div>
//               <p className="text-gray-700 font-semibold">Username:</p>
//               <p className="text-gray-900 text-lg">{currentUsername || 'N/A'}</p>
//             </div>
//             <div>
//               <p className="text-gray-700 font-semibold">Role:</p>
//               <p className="text-gray-900 text-lg">{currentUserRole || 'N/A'}</p>
//             </div>
//           </div>
//         </div>

//         {/* Create New User Section (Admin Only) */}
//         {currentUserRole === 'admin' && (
//           <div className="mb-10 p-6 bg-blue-50 rounded-lg shadow-inner">
//             <h2 className="text-2xl font-bold text-blue-800 mb-4">Create New User</h2>
//             {message && (
//               <p className={`mb-4 text-center ${message.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>
//                 {message}
//               </p>
//             )}
//             <form onSubmit={handleCreateUser} className="space-y-4">
//               <div>
//                 <label htmlFor="newUsername" className="sr-only">New Username</label>
//                 <input
//                   type="text"
//                   id="newUsername"
//                   className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//                   placeholder="New Username"
//                   value={newUsername}
//                   onChange={(e) => setNewUsername(e.target.value)}
//                   required
//                 />
//               </div>
//               <div>
//                 <label htmlFor="newPassword" className="sr-only">New Password</label>
//                 <input
//                   type="password"
//                   id="newPassword"
//                   className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//                   placeholder="New Password"
//                   value={newPassword}
//                   onChange={(e) => setNewPassword(e.target.value)}
//                   required
//                 />
//               </div>
//               <div>
//                 <label htmlFor="newUserRole" className="block text-sm font-medium text-gray-700 text-left mb-1">Role</label>
//                 <select
//                   id="newUserRole"
//                   className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//                   value={newUserRole}
//                   onChange={(e) => setNewUserRole(e.target.value)}
//                   required
//                 >
//                   <option value="user">User</option>
//                   <option value="admin">Admin</option>
//                   <option value="accountant">Accountant</option>
//                 </select>
//               </div>
//               <button
//                 type="submit"
//                 className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
//                 disabled={isLoading}
//               >
//                 {isLoading ? 'Creating User...' : 'Create User'}
//               </button>
//             </form>
//           </div>
//         )}

//         {/* Existing Users List (Admin Only) */}
//         {currentUserRole === 'admin' && (
//           <div className="mb-10 p-6 bg-gray-50 rounded-lg shadow-inner">
//             <h2 className="text-2xl font-bold text-gray-800 mb-4">Existing Users</h2>
            
//             {/* Search Input Field */}
//             <div className="mb-4">
//               <input
//                 type="text"
//                 placeholder="Search users by username or role..."
//                 className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-150 ease-in-out"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>

//             {usersLoading && <p className="text-center text-gray-600">Loading users...</p>}
//             {usersError && <p className="text-center text-red-600">{usersError}</p>}
            
//             {!usersLoading && !usersError && (
//               <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
//                 <table className="min-w-full divide-y divide-gray-200 table-fixed">
//                   <thead className="bg-gray-100">
//                     <tr>
//                       {/* Apply w-1/2, px-6 py-3 for padding, and flex for centering content */}
//                       <th scope="col" className="px-6 py-3 w-1/2">
//                         <div className="flex justify-center items-center h-full text-xs font-medium uppercase tracking-wider text-gray-500">
//                           Username
//                         </div>
//                       </th>
//                       <th scope="col" className="px-6 py-3 w-1/2">
//                         <div className="flex justify-center items-center h-full text-xs font-medium uppercase tracking-wider text-gray-500">
//                           Role
//                         </div>
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {filteredUsers.length > 0 ? ( // Display filtered users
//                       filteredUsers.map((user) => (
//                         <tr key={user.id} className="hover:bg-gray-50">
//                           {/* Apply w-1/2, px-6 py-4 for padding, and flex for centering content */}
//                           <td className="px-6 py-4 w-1/2">
//                             <div className="flex justify-center items-center h-full whitespace-nowrap text-sm text-gray-700">
//                               {user.username}
//                             </div>
//                           </td>
//                           <td className="px-6 py-4 w-1/2">
//                             <div className="flex justify-center items-center h-full whitespace-nowrap text-sm text-gray-700">
//                               {user.role}
//                             </div>
//                           </td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td colSpan="2" className="px-6 py-4 text-center text-gray-600 italic">
//                           {searchQuery ? 'No matching users found.' : 'No users found.'}
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         )}


//         {/* Back to Home Button */}
//         <div className="mt-8 text-center">
//           <button
//             onClick={() => setCurrentPage('home')}
//             className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105"
//           >
//             Back to Home
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserProfilePage;

// Stable 1 //

// import React, { useState, useEffect } from 'react';
// import bcrypt from 'bcryptjs';

// // const API_BASE_URL = 'https://rev-lumina.onrender.com/api'; 
// const API_BASE_URL = 'http://localhost:5000/api'; 

// const UserProfilePage = ({ setCurrentPage, currentUserId, currentUsername, currentUserRole }) => {
//   const [newUsername, setNewUsername] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [newUserRole, setNewUserRole] = useState('user');
//   const [message, setMessage] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [users, setUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [usersLoading, setUsersLoading] = useState(false);
//   const [usersError, setUsersError] = useState(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [editedRoles, setEditedRoles] = useState({});

//   useEffect(() => {
//     if (message) {
//       const timer = setTimeout(() => setMessage(''), 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [message]);

//   const fetchUsers = async () => {
//     if (currentUserRole !== 'admin') {
//       setUsersError('You do not have permission to view this list.');
//       return;
//     }
//     setUsersLoading(true);
//     setUsersError(null);
//     try {
//       const response = await fetch(`${API_BASE_URL}/users?userRole=${currentUserRole}`);
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to fetch users');
//       }
//       const data = await response.json();
//       setUsers(data);
//     } catch (err) {
//       console.error('Error fetching users:', err);
//       setUsersError(`Error loading users: ${err.message}`);
//     } finally {
//       setUsersLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (currentUserRole === 'admin') {
//       fetchUsers();
//     }
//   }, [currentUserRole]);

//   useEffect(() => {
//     const lowercasedQuery = searchQuery.toLowerCase();
//     const currentFilteredUsers = users.filter(user => {
//       return (
//         String(user.username).toLowerCase().includes(lowercasedQuery) ||
//         String(user.role).toLowerCase().includes(lowercasedQuery)
//       );
//     });
//     setFilteredUsers(currentFilteredUsers);
//   }, [users, searchQuery]);

//   const handleCreateUser = async (e) => {
//     e.preventDefault();
//     setMessage('');
//     setIsLoading(true);

//     if (!newUsername || !newPassword) {
//       setMessage('Username and password are required.');
//       setIsLoading(false);
//       return;
//     }

//     try {
//       const hashedPassword = await bcrypt.hash(newPassword, 10);

//       const response = await fetch(`${API_BASE_URL}/users/new`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           username: newUsername,
//           password_hash: hashedPassword,
//           role: newUserRole,
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to create user');
//       }

//       setMessage('User created successfully!');
//       setNewUsername('');
//       setNewPassword('');
//       setNewUserRole('user');
//       if (currentUserRole === 'admin') {
//         fetchUsers();
//       }
//     } catch (err) {
//       console.error('Error creating user:', err);
//       setMessage(`Error: ${err.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleRoleChange = (userId, newRole) => {
//     setEditedRoles(prev => ({
//       ...prev,
//       [userId]: newRole
//     }));
//   };

//   const handleSaveRole = async (userId) => {
//     const newRole = editedRoles[userId];
//     if (!newRole) return;

//     try {
//       const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ role: newRole, adminRole: currentUserRole }), // Pass adminRole for authorization
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to update role');
//       }

//       // Refresh users list and clear the edited state for this user
//       fetchUsers();
//       setEditedRoles(prev => {
//         const newEditedRoles = { ...prev };
//         delete newEditedRoles[userId];
//         return newEditedRoles;
//       });
//       setMessage(`Successfully updated role for user ID ${userId}.`);
//     } catch (err) {
//       console.error('Error updating role:', err);
//       setMessage(`Error: ${err.message}`);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center min-h-screen w-full bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 p-4 sm:p-8">
//       <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-2xl text-center max-w-4xl w-full">
//         <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-8 sm:mb-12 leading-normal">
//           <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
//             User Profile & Management
//           </span>
//         </h1>

//         <div className="mb-10 p-6 bg-gray-50 rounded-lg shadow-inner">
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Profile</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
//             <div>
//               <p className="text-gray-700 font-semibold">Username:</p>
//               <p className="text-gray-900 text-lg">{currentUsername || 'N/A'}</p>
//             </div>
//             <div>
//               <p className="text-gray-700 font-semibold">Role:</p>
//               <p className="text-gray-900 text-lg">{currentUserRole || 'N/A'}</p>
//             </div>
//           </div>
//         </div>

//         {currentUserRole === 'admin' && (
//           <div className="mb-10 p-6 bg-blue-50 rounded-lg shadow-inner">
//             <h2 className="text-2xl font-bold text-blue-800 mb-4">Create New User</h2>
//             {message && (
//               <p className={`mb-4 text-center ${message.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>
//                 {message}
//               </p>
//             )}
//             <form onSubmit={handleCreateUser} className="space-y-4">
//               <div>
//                 <label htmlFor="newUsername" className="sr-only">New Username</label>
//                 <input
//                   type="text"
//                   id="newUsername"
//                   className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//                   placeholder="New Username"
//                   value={newUsername}
//                   onChange={(e) => setNewUsername(e.target.value)}
//                   required
//                 />
//               </div>
//               <div>
//                 <label htmlFor="newPassword" className="sr-only">New Password</label>
//                 <input
//                   type="password"
//                   id="newPassword"
//                   className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//                   placeholder="New Password"
//                   value={newPassword}
//                   onChange={(e) => setNewPassword(e.target.value)}
//                   required
//                 />
//               </div>
//               <div>
//                 <label htmlFor="newUserRole" className="block text-sm font-medium text-gray-700 text-left mb-1">Role</label>
//                 <select
//                   id="newUserRole"
//                   className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//                   value={newUserRole}
//                   onChange={(e) => setNewUserRole(e.target.value)}
//                   required
//                 >
//                   <option value="user">User</option>
//                   <option value="admin">Admin</option>
//                   <option value="accountant">Accountant</option>
//                 </select>
//               </div>
//               <button
//                 type="submit"
//                 className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
//                 disabled={isLoading}
//               >
//                 {isLoading ? 'Creating User...' : 'Create User'}
//               </button>
//             </form>
//           </div>
//         )}

//         {currentUserRole === 'admin' && (
//           <div className="mb-10 p-6 bg-gray-50 rounded-lg shadow-inner">
//             <h2 className="text-2xl font-bold text-gray-800 mb-4">Existing Users</h2>
            
//             <div className="mb-4">
//               <input
//                 type="text"
//                 placeholder="Search users by username or role..."
//                 className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-150 ease-in-out"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>

//             {usersLoading && <p className="text-center text-gray-600">Loading users...</p>}
//             {usersError && <p className="text-center text-red-600">{usersError}</p>}
            
//             {!usersLoading && !usersError && (
//               <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-100">
//                     <tr>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
//                       {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th> */}
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {filteredUsers.length > 0 ? (
//                       filteredUsers.map((user) => (
//                         <tr key={user.id} className="hover:bg-gray-50">
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.username}</td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                             <select
//                               value={editedRoles[user.id] || user.role}
//                               onChange={(e) => handleRoleChange(user.id, e.target.value)}
//                               className="p-2 border border-gray-300 rounded-lg shadow-sm"
//                             >
//                               <option value="user">User</option>
//                               <option value="admin">Admin</option>
//                               <option value="accountant">Accountant</option>
//                             </select>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                             {editedRoles[user.id] && editedRoles[user.id] !== user.role && (
//                               <button
//                                 onClick={() => handleSaveRole(user.id)}
//                                 className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full shadow-md"
//                               >
//                                 Save
//                               </button>
//                             )}
//                           </td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td colSpan="3" className="px-6 py-4 text-center text-gray-600 italic">
//                           {searchQuery ? 'No matching users found.' : 'No users found.'}
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         )}

//         <div className="mt-8 text-center">
//           <button
//             onClick={() => setCurrentPage('home')}
//             className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105"
//           >
//             Back to Home
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserProfilePage;


import React, { useState, useEffect,LogOut } from 'react';
import bcrypt from 'bcryptjs';
import { Save, UserPlus, Users } from 'lucide-react';

// const API_BASE_URL = 'http://localhost:5000/api';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const avatarOptions = [
      'https://api.dicebear.com/7.x/avataaars/svg?seed=Scott',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Peter',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Laura',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Chris',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
];

const UserProfilePage = ({ setCurrentPage, currentUserId, currentUsername, currentUserRole, handleLogout }) => {
  const [currentAvatar, setCurrentAvatar] = useState(avatarOptions[0]);
  const [hasProfileChanged, setHasProfileChanged] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('user');
  const [newAvatar, setNewAvatar] = useState(avatarOptions[0]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editedRoles, setEditedRoles] = useState({});
  

  useEffect(() => {
    // In a real app, you would fetch and set the user's saved avatar URL here.
  }, [currentUserId]);
  
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchUsers = async () => {
    if (currentUserRole !== 'admin') {
      setUsersError('You do not have permission to view this list.');
      return;
    }
    setUsersLoading(true);
    setUsersError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/users?userRole=${currentUserRole}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setUsersError(`Error loading users: ${err.message}`);
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    if (currentUserRole === 'admin') {
      fetchUsers();
    }
  }, [currentUserRole]);

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const currentFilteredUsers = users.filter(user => 
      String(user.username).toLowerCase().includes(lowercasedQuery) ||
      String(user.role).toLowerCase().includes(lowercasedQuery)
    );
    setFilteredUsers(currentFilteredUsers);
  }, [users, searchQuery]);

  const handleAvatarSelect = (avatarUrl) => {
    setCurrentAvatar(avatarUrl);
    setHasProfileChanged(true);
  };

  const handleProfileSave = async () => {
    setMessage('');
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users/${currentUserId}/avatar`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar: currentAvatar, adminRole: currentUserRole }),
      });
      if (!response.ok) throw new Error('Failed to update profile.');
      
      setHasProfileChanged(false);
      setMessage('Profile updated successfully!');
    } catch (err) {
        setMessage(`Error: ${err.message}`);
    } finally {
        setIsLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);
    if (!newUsername || !newPassword) {
      setMessage('Username and password are required.');
      setIsLoading(false);
      return;
    }
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const response = await fetch(`${API_BASE_URL}/users/new`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: newUsername,
          password_hash: hashedPassword,
          role: newUserRole,
          avatar: newAvatar,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create user');
      }
      setMessage('User created successfully!');
      setNewUsername('');
      setNewPassword('');
      setNewUserRole('user');
      setNewAvatar(avatarOptions[0]);
      if (currentUserRole === 'admin') {
        fetchUsers();
      }
    } catch (err) {
      console.error('Error creating user:', err);
      setMessage(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = (userId, newRole) => {
    setEditedRoles(prev => ({ ...prev, [userId]: newRole }));
  };

  const handleSaveRole = async (userId) => {
    const newRole = editedRoles[userId];
    if (!newRole) return;
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole, adminRole: currentUserRole }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update role');
      }
      fetchUsers();
      setEditedRoles(prev => {
        const newEditedRoles = { ...prev };
        delete newEditedRoles[userId];
        return newEditedRoles;
      });
      setMessage(`Successfully updated role for user ID ${userId}.`);
    } catch (err) {
      console.error('Error updating role:', err);
      setMessage(`Error: ${err.message}`);
    }
  };

  return (
    // <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-8">
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            User Profile & Management
          </span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-8">
                <div className="bg-gray-50/70 p-6 rounded-lg border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Your Profile</h2>
                    <div className="flex flex-col items-center space-y-4">
                        <img src={currentAvatar} alt="Current Avatar" className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-white" />
                        <div>
                            <p className="text-2xl font-bold text-gray-900 text-center">{currentUsername || 'N/A'}</p>
                            <p className="text-sm text-gray-500 text-center capitalize">{currentUserRole || 'N/A'}</p>
                        </div>
                    </div>

                    <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-600 mb-2">Select Your Avatar</label>
                        <div className="grid grid-cols-4 gap-3">
                            {avatarOptions.map((avatar, index) => (
                                <img
                                    key={index}
                                    src={avatar}
                                    alt={`Avatar ${index + 1}`}
                                    onClick={() => handleAvatarSelect(avatar)}
                                    className={`w-16 h-16 rounded-full object-cover cursor-pointer transition-all duration-200 ${currentAvatar === avatar ? 'ring-4 ring-blue-500' : 'hover:scale-110'}`}
                                />
                            ))}
                        </div>
                    </div>
                    
                    {hasProfileChanged && (
                        <button
                            onClick={handleProfileSave}
                            disabled={isLoading}
                            className="w-full mt-6 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition-colors disabled:bg-blue-400"
                        >
                            <Save size={18} />
                            {isLoading ? 'Saving...' : 'Save Profile'}
                        </button>
                    )}
                </div>
            </div>

            <div className="lg:col-span-2 space-y-8">
                {currentUserRole === 'admin' && (
                    <>
                        <div className="bg-gray-50/70 p-6 rounded-lg border border-gray-200">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2"><UserPlus size={22}/> Create New User</h2>
                            <form onSubmit={handleCreateUser} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <input type="text" className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="New Username" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} required />
                                    <input type="password" className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                                </div>
                                <select className="w-full p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500" value={newUserRole} onChange={(e) => setNewUserRole(e.target.value)}>
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                    <option value="accountant">Accountant</option>
                                </select>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Select Avatar for New User</label>
                                    <div className="flex flex-wrap gap-2">
                                        {avatarOptions.map((avatar, index) => (
                                            <img
                                                key={index}
                                                src={avatar}
                                                alt={`New user avatar ${index + 1}`}
                                                onClick={() => setNewAvatar(avatar)}
                                                className={`w-12 h-12 rounded-full object-cover cursor-pointer transition-all ${newAvatar === avatar ? 'ring-4 ring-blue-500' : 'hover:scale-110'}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-sm" disabled={isLoading}>
                                    {isLoading ? 'Creating...' : 'Create User'}
                                </button>
                            </form>
                        </div>

                        <div className="bg-gray-50/70 p-6 rounded-lg border border-gray-200">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2"><Users size={22}/> Existing Users</h2>
                            <div className="mb-4">
                                <input type="text" placeholder="Search users by username or role..." className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                            </div>
                            {usersLoading && <p className="text-center text-sm text-gray-500">Loading users...</p>}
                            {usersError && <p className="text-center text-sm text-red-600">{usersError}</p>}
                            {!usersLoading && !usersError && (
                                <div className="overflow-x-auto rounded-md border border-gray-200">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredUsers.length > 0 ? (
                                              filteredUsers.map((user) => (
                                                <tr key={user.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                        <select value={editedRoles[user.id] || user.role} onChange={(e) => handleRoleChange(user.id, e.target.value)} className="p-2 border border-gray-300 rounded-md shadow-sm bg-white">
                                                            <option value="user">User</option>
                                                            <option value="admin">Admin</option>
                                                            <option value="accountant">Accountant</option>
                                                        </select>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        {editedRoles[user.id] && editedRoles[user.id] !== user.role && (
                                                            <button onClick={() => handleSaveRole(user.id)} className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-1.5 px-3 rounded-md shadow-sm transition-colors">
                                                                <Save size={14} /> Save
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))) : (
                                                <tr><td colSpan="3" className="px-6 py-4 text-center text-gray-500 italic">{searchQuery ? 'No matching users found.' : 'No users found.'}</td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            <div className="mt-8 text-center">
                <button
                onClick={() => setCurrentPage('view')}
                className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-5 rounded-lg shadow-sm"
                >
                Back to Home
                </button>
            </div>
            </div>
        </div>
    </div>
  );
};

export default UserProfilePage;
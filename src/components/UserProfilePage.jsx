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
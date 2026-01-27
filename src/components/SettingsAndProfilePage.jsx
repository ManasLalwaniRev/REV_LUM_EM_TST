
import React, { useState, useEffect } from 'react';
import bcrypt from 'bcryptjs';
import { Save, UserPlus, Users, PlusCircle, Trash2, ArrowLeft, Loader, LogOut } from 'lucide-react';

// Use environment variable with a fallback to ensure connectivity
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

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

const SettingsAndProfilePage = ({ setCurrentPage, currentUserId, currentUsername, currentUserRole, handleLogOut, currentUserAvatar, onAvatarChange }) => {
    const [currentAvatar, setCurrentAvatar] = useState(currentUserAvatar || avatarOptions[0]);
    const [hasProfileChanged, setHasProfileChanged] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newUserRole, setNewUserRole] = useState('user');
    const [newAvatar, setNewAvatar] = useState(avatarOptions[0]);
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(true);
    const [usersError, setUsersError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [editedRoles, setEditedRoles] = useState({});
    
    // Options State
    const [contractOptions, setContractOptions] = useState([]);
    const [creditCardOptions, setCreditCardOptions] = useState([]);
    const [newContract, setNewContract] = useState('');
    const [newCard, setNewCard] = useState('');
    const [optionsLoading, setOptionsLoading] = useState(true);
    
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Normalize role for comparison to avoid case-sensitivity bugs
    const isAdmin = currentUserRole?.toLowerCase() === 'admin';

    const fetchUsers = async () => {
        setUsersLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/users?userRole=${currentUserRole}`);
            if (!response.ok) throw new Error('Failed to fetch users');
            const data = await response.json();
            setUsers(data);
        } catch (err) {
            setUsersError(`Error: ${err.message}`);
        } finally {
            setUsersLoading(false);
        }
    };

    // Separated fetch logic to ensure one failure doesn't block the other
    const fetchOptions = async () => {
        setOptionsLoading(true);
        try {
            const [contractsRes, cardsRes] = await Promise.allSettled([
                fetch(`${API_BASE_URL}/contract-options`),
                fetch(`${API_BASE_URL}/credit-card-options`),
            ]);

            if (contractsRes.status === 'fulfilled' && contractsRes.value.ok) {
                setContractOptions(await contractsRes.value.json());
            }
            if (cardsRes.status === 'fulfilled' && cardsRes.value.ok) {
                setCreditCardOptions(await cardsRes.value.json());
            }
        } catch (err) {
            console.error("Option fetch error:", err);
        } finally {
            setOptionsLoading(false);
        }
    };

    useEffect(() => {
        if (isAdmin) {
            fetchUsers();
            fetchOptions();
        }
    }, [currentUserRole]);

    useEffect(() => {
        const lowercasedQuery = searchQuery.toLowerCase();
        setFilteredUsers(users.filter(user =>
            String(user.username).toLowerCase().includes(lowercasedQuery) ||
            String(user.role).toLowerCase().includes(lowercasedQuery)
        ));
    }, [users, searchQuery]);

    const handleAddOption = async (type) => {
        const isContract = type === 'contract';
        const name = isContract ? newContract : newCard;
        const endpoint = isContract ? 'contract-options' : 'credit-card-options';
        const setOptions = isContract ? setContractOptions : setCreditCardOptions;
        const resetInput = isContract ? setNewContract : setNewCard;

        if (!name.trim()) return;

        try {
            const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, userRole: currentUserRole }),
            });

            if (!response.ok) throw new Error(`Failed to add ${type}`);
            
            const addedOption = await response.json();
            setOptions(prev => [...prev, addedOption].sort((a, b) => a.name.localeCompare(b.name)));
            resetInput('');
            setMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} added successfully!`);
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        }
    };

    const handleDeleteOption = async (id, type) => {
        const endpoint = type === 'contract' ? 'contract-options' : 'credit-card-options';
        const setOptions = type === 'contract' ? setContractOptions : setCreditCardOptions;

        try {
            const response = await fetch(`${API_BASE_URL}/${endpoint}/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userRole: currentUserRole }),
            });

            if (!response.ok) throw new Error(`Failed to delete ${type}`);
            setOptions(prev => prev.filter(opt => opt.id !== id));
            setMessage(`${type} deleted.`);
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        }
    };

    const handleProfileSave = async () => {
        setMessage('');
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/users/${currentUserId}/avatar`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ avatar: currentAvatar }),
            });
            if (!response.ok) throw new Error('Update failed');
            setHasProfileChanged(false);
            setMessage('Profile updated!');
            if (onAvatarChange) onAvatarChange(currentAvatar);
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-800 min-h-screen p-8 shadow-lg w-full text-white">
            <h1 className="text-3xl font-bold mb-8">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    Settings & Management
                </span>
            </h1>

            {message && (
                <div className={`text-center p-3 rounded-lg mb-6 text-sm ${message.startsWith('Error') ? 'bg-red-900/50 text-red-200' : 'bg-green-900/50 text-green-200'}`}>
                    {message}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Section */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-gray-700/50 p-6 rounded-lg border border-gray-600">
                        <h2 className="text-xl font-bold mb-4">Your Profile</h2>
                        <div className="flex flex-col items-center space-y-4">
                            <img src={currentAvatar} alt="Avatar" className="w-24 h-24 rounded-full border-4 border-blue-500 shadow-xl" />
                            <div className="text-center">
                                <p className="text-xl font-bold">{currentUsername}</p>
                                <p className="text-xs text-gray-400 uppercase tracking-widest">{currentUserRole}</p>
                            </div>
                        </div>
                        <div className="mt-6">
                            <label className="block text-xs font-bold text-gray-400 mb-3 uppercase">Change Avatar</label>
                            <div className="grid grid-cols-4 gap-2">
                                {avatarOptions.map((url, i) => (
                                    <img key={i} src={url} onClick={() => { setCurrentAvatar(url); setHasProfileChanged(true); }}
                                        className={`w-12 h-12 rounded-full cursor-pointer border-2 transition-all ${currentAvatar === url ? 'border-blue-500 scale-110' : 'border-transparent hover:border-gray-400'}`} />
                                ))}
                            </div>
                        </div>
                        {hasProfileChanged && (
                            <button onClick={handleProfileSave} className="w-full mt-6 bg-blue-600 hover:bg-blue-500 py-2 rounded font-bold flex justify-center items-center gap-2">
                                <Save size={16} /> Save Profile
                            </button>
                        )}
                    </div>
                </div>

                {/* Admin Management Column */}
                <div className="lg:col-span-2 space-y-8">
                    {isAdmin ? (
                        <>
                            {/* Manage Credit Cards Section */}
                            <div className="bg-gray-700/50 p-6 rounded-lg border border-gray-600">
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">Manage Credit Cards</h2>
                                <div className="flex mb-4 gap-2">
                                    <input type="text" value={newCard} onChange={(e) => setNewCard(e.target.value)}
                                        className="bg-gray-800 border border-gray-600 rounded p-2 flex-grow text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Enter new credit card name..." />
                                    <button onClick={() => handleAddOption('card')} className="bg-blue-600 p-2 rounded hover:bg-blue-500">
                                        <PlusCircle size={20} />
                                    </button>
                                </div>
                                <div className="max-h-48 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                    {optionsLoading ? <Loader className="animate-spin mx-auto" /> : 
                                     creditCardOptions.length > 0 ? creditCardOptions.map(opt => (
                                        <div key={opt.id} className="flex justify-between items-center p-2 bg-gray-800 rounded border border-gray-600">
                                            <span className="text-sm">{opt.name}</span>
                                            <button onClick={() => handleDeleteOption(opt.id, 'card')} className="text-gray-500 hover:text-red-400">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    )) : <p className="text-center text-gray-500 text-sm italic">No cards added yet.</p>}
                                </div>
                            </div>

                            {/* Manage Contracts Section */}
                            <div className="bg-gray-700/50 p-6 rounded-lg border border-gray-600">
                                <h2 className="text-xl font-bold mb-4">Manage Contract Names</h2>
                                <div className="flex mb-4 gap-2">
                                    <input type="text" value={newContract} onChange={(e) => setNewContract(e.target.value)}
                                        className="bg-gray-800 border border-gray-600 rounded p-2 flex-grow text-sm"
                                        placeholder="Enter new contract name..." />
                                    <button onClick={() => handleAddOption('contract')} className="bg-blue-600 p-2 rounded hover:bg-blue-500">
                                        <PlusCircle size={20} />
                                    </button>
                                </div>
                                <div className="max-h-48 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                    {contractOptions.length > 0 ? contractOptions.map(opt => (
                                        <div key={opt.id} className="flex justify-between items-center p-2 bg-gray-800 rounded border border-gray-600">
                                            <span className="text-sm">{opt.name}</span>
                                            <button onClick={() => handleDeleteOption(opt.id, 'contract')} className="text-gray-500 hover:text-red-400">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    )) : <p className="text-center text-gray-500 text-sm italic">No contracts added yet.</p>}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="p-12 text-center bg-gray-700/20 rounded-xl border border-dashed border-gray-600">
                            <Users size={48} className="mx-auto text-gray-600 mb-4" />
                            <h3 className="text-lg font-bold text-gray-400">Admin Privileges Required</h3>
                            <p className="text-sm text-gray-500">Management tools are only visible to system administrators.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-12 text-center">
                <button onClick={() => setCurrentPage('view')} className="text-gray-400 hover:text-white flex items-center gap-2 mx-auto transition-colors">
                    <ArrowLeft size={18} /> Back to Dashboard
                </button>
            </div>
        </div>
    );
};

export default SettingsAndProfilePage;
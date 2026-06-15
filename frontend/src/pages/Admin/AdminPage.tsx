import React, { useState, useEffect } from 'react';
import { uacApi } from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

interface UserProfile {
    id: number;
    username: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    role: 'USER' | 'ADMIN';
    isEnabled: boolean;
}

const AdminPage: React.FC = () => {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await uacApi.get<UserProfile[]>('/uac/v1/admin/users');
            setUsers(response.data);
        } catch (err: any) {
            console.error('Failed to fetch users:', err);
            setError('Unauthorized error. Make sure you have admin rights.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleToggleStatus = async (userId: number, currentStatus: boolean) => {
        try {
            await uacApi.put(`/uac/v1/admin/users/${userId}/status?enabled=${!currentStatus}`);
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, isEnabled: !currentStatus } : u));
        } catch (err: any) {
            alert('Failed to update status');
        }
    };

    const handleChangeRole = async (userId: number, currentRole: string) => {
        const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
        if (!window.confirm(`Change ${users.find(u => u.id === userId)?.username} to ${newRole}?`)) return;

        try {
            await uacApi.put(`/uac/v1/admin/users/${userId}/role?role=${newRole}`);
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole as any } : u));
        } catch (err: any) {
            alert('Failed to update role');
        }
    };

    const filteredUsers = users.filter(u => 
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading && users.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-black dark:text-white mb-2 tracking-tight">Admin Dashboard</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage JobAcer users, roles, and account permissions.</p>
                </div>
                <div className="relative w-full dark:text-white md:w-64">
                    <input 
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all"
                    />
                    <svg className="w-4 h-4 absolute left-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-100 text-red-600 rounded-2xl mb-8 flex items-center gap-3">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </div>
            )}

            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {filteredUsers.map((u) => (
                                <tr key={u.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-xs">
                                                {u.username.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-bold text-black dark:text-white">{u.username}</div>
                                                <div className="text-xs text-gray-400">{u.firstName} {u.lastName}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-600 dark:text-gray-300">{u.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                                            u.role === 'ADMIN' 
                                                ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' 
                                                : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                                        }`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 min-w-30">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${u.isEnabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'}`}></div>
                                            <span className="text-sm text-gray-500">{u.isEnabled ? 'Active' : 'Disabled'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                onClick={() => handleChangeRole(u.id, u.role)}
                                                className="p-2 text-gray-400 hover:text-brand-primary transition-colors"
                                                title="Switch Role"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                </svg>
                                            </button>
                                            <button 
                                                onClick={() => handleToggleStatus(u.id, u.isEnabled)}
                                                disabled={u.id === currentUser?.id}
                                                className={`p-2 transition-colors ${u.id === currentUser?.id ? 'opacity-20 cursor-not-allowed' : 'text-gray-400 hover:text-red-500'}`}
                                                title={u.isEnabled ? "Disable User" : "Enable User"}
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredUsers.length === 0 && (
                    <div className="py-12 text-center text-gray-500">No users found matching your search.</div>
                )}
            </div>
        </div>
    );
};

export default AdminPage;

import React, { useState, useEffect } from 'react';
import {llmApi, uacApi} from '../../api/axios';
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

interface AIMetric {
    id: number;
    userId: number | null;
    ipAddress: string;
    endpoint: string;
    statusCode: number;
    timestamp: string;
}

interface AIMetricSummary {
    minute: string;
    totalRequests: number;
    successCount: number;
    rateLimitCount: number;
    errorCount: number;
    uniqueUsers: number;
}

const AdminPage: React.FC = () => {
    const { user: currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState<'users' | 'monitoring'>('users');
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [metrics, setMetrics] = useState<AIMetric[]>([]);
    const [summary, setSummary] = useState<AIMetricSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    
    // Time Range Selection (Default to last hour)
    const [startTime, setStartTime] = useState(() => {
        const d = new Date();
        d.setHours(d.getHours() - 1);
        return d.toISOString().slice(0, 16);
    });
    const [endTime, setEndTime] = useState(() => {
        return new Date().toISOString().slice(0, 16);
    });

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

    const fetchMonitoringData = async () => {
        setIsLoading(true);
        setError('');
        try {
            // Spring LocalDateTime likes YYYY-MM-DDTHH:mm:ss
            const startIso = startTime.length === 16 ? `${startTime}:00` : startTime;
            const endIso = endTime.length === 16 ? `${endTime}:00` : endTime;

            const [metricsRes, summaryRes] = await Promise.all([
                llmApi.get<AIMetric[]>('/admin/v1/metrics'),
                llmApi.get<AIMetricSummary[]>(`/admin/v1/metrics/summary?start=${startIso}&end=${endIso}`)
            ]);
            setMetrics(metricsRes.data.reverse());
            setSummary(summaryRes.data);
        } catch (err: any) {
            console.error('Failed to fetch monitoring data:', err);
            setError('Failed to load AI metrics. Check if dates are valid.');
        } finally {
            setIsLoading(false);
        }
    };

    const formatLocalDateTime = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const handlePastHour = () => {
        const end = new Date();
        const start = new Date();
        start.setHours(start.getHours() - 1);
        setStartTime(formatLocalDateTime(start));
        setEndTime(formatLocalDateTime(end));
    };

    const handleShiftHour = (direction: number) => {
        const start = new Date(startTime);
        const end = new Date(endTime);
        start.setHours(start.getHours() + direction);
        end.setHours(end.getHours() + direction);
        setStartTime(formatLocalDateTime(start));
        setEndTime(formatLocalDateTime(end));
    };

    useEffect(() => {
        if (activeTab === 'users') {
            fetchUsers();
        } else {
            fetchMonitoringData();
        }
    }, [activeTab, startTime, endTime]);

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

    // Chart Components & Helpers
    const renderLineChart = () => {
        if (summary.length === 0) return <div className="h-64 flex items-center justify-center text-gray-400">No data for selected range.</div>;

        const width = 800;
        const height = 300;
        const paddingLeft = 50;
        const paddingRight = 40;
        const paddingTop = 40;
        const paddingBottom = 40;

        const maxVal = Math.max(...summary.map(s => Math.max(s.totalRequests, s.uniqueUsers, 1))) + 2;
        
        const getX = (index: number) => paddingLeft + (index * (width - paddingLeft - paddingRight)) / (summary.length - 1 || 1);
        const getY = (val: number) => height - paddingBottom - (val * (height - paddingTop - paddingBottom)) / maxVal;

        const createPath = (key: keyof AIMetricSummary) => {
            return summary.map((s, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(s[key] as number)}`).join(' ');
        };

        return (
            <div className="overflow-x-auto">
                <svg width={width} height={height} className="mx-auto overflow-visible">
                    {/* Y-Axis Labels & Grid Lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map(p => {
                        const val = Math.round(maxVal * p);
                        const y = getY(val);
                        return (
                            <g key={p}>
                                <line 
                                    x1={paddingLeft} y1={y} 
                                    x2={width - paddingRight} y2={y} 
                                    stroke="rgba(0,0,0,0.05)" strokeDasharray="4" 
                                />
                                <text 
                                    x={paddingLeft - 10} y={y + 4} 
                                    textAnchor="end" 
                                    className="text-[10px] fill-gray-400 font-mono"
                                >
                                    {val}
                                </text>
                            </g>
                        );
                    })}

                    {/* Paths */}
                    <path d={createPath('totalRequests')} fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" />
                    <path d={createPath('rateLimitCount')} fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
                    <path d={createPath('errorCount')} fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                    <path d={createPath('uniqueUsers')} fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeDasharray="4" />

                    {/* Data Points & Labels */}
                    {summary.length < 120 && summary.map((s, i) => (
                        <g key={i}>
                            {/* Total Requests Dot */}
                            <circle cx={getX(i)} cy={getY(s.totalRequests)} r="3" fill="#6366f1" />
                            
                            {/* Unique Users Dot & Label */}
                            <circle cx={getX(i)} cy={getY(s.uniqueUsers)} r="3" fill="#10b981" />
                            {s.uniqueUsers > 0 && (
                                <text 
                                    x={getX(i)} y={getY(s.uniqueUsers) - 8} 
                                    textAnchor="middle" 
                                    className="text-[9px] font-bold fill-[#10b981]"
                                >
                                    {s.uniqueUsers}
                                </text>
                            )}

                            {/* Rate Limit Dots (Only if error exists) */}
                            {s.rateLimitCount > 0 && (
                                <circle cx={getX(i)} cy={getY(s.rateLimitCount)} r="3" fill="#f97316" />
                            )}
                        </g>
                    ))}

                    {/* Legend */}
                    <g transform={`translate(${paddingLeft}, 20)`}>
                        <circle cx="0" cy="0" r="4" fill="#6366f1" /> <text x="10" y="4" className="text-[10px] fill-gray-500 font-bold">Total Req</text>
                        <circle cx="90" cy="0" r="4" fill="#f97316" /> <text x="100" y="4" className="text-[10px] fill-gray-500 font-bold">429 Errors</text>
                        <circle cx="180" cy="0" r="4" fill="#ef4444" /> <text x="190" y="4" className="text-[10px] fill-gray-500 font-bold">500 Errors</text>
                        <circle cx="270" cy="0" r="4" fill="#10b981" /> <text x="280" y="4" className="text-[10px] fill-gray-500 font-bold">Unique Users</text>
                    </g>

                    {/* X-Axis labels */}
                    {[0, Math.floor(summary.length / 2), summary.length - 1].map(i => (
                        summary[i] && (
                            <text key={i} x={getX(i)} y={height - 10} textAnchor="middle" className="text-[10px] fill-gray-400 font-bold">
                                {new Date(summary[i].minute).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </text>
                        )
                    ))}
                </svg>
            </div>
        );
    };

    if (isLoading && users.length === 0 && metrics.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-black dark:text-white mb-2 tracking-tight">Admin Dashboard</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage JobAcer users and monitor AI system performance.</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b border-gray-100 dark:border-gray-800">
                <button 
                    onClick={() => setActiveTab('users')}
                    className={`pb-4 text-sm font-bold transition-all px-2 ${activeTab === 'users' ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    User Management
                </button>
                <button 
                    onClick={() => setActiveTab('monitoring')}
                    className={`pb-4 text-sm font-bold transition-all px-2 ${activeTab === 'monitoring' ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    AI Performance Monitoring
                </button>
            </div>

            {error && (activeTab === 'users' ? users.length === 0 : summary.length === 0) && (
                <div className="p-4 bg-red-100 text-red-600 rounded-2xl mb-8 flex items-center gap-3">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                </div>
            )}

            {activeTab === 'users' ? (
                <>
                    <div className="relative w-full dark:text-white md:w-64 mb-6">
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

                    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden rounded-2xl">
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
                </>
            ) : (
                <div className="space-y-8">
                    {/* Interval Selection */}
                    <div className="p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-wrap gap-4 items-end">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase">Start Time</label>
                            <input 
                                type="datetime-local" 
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="block w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-sm dark:text-white"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase">End Time</label>
                            <input 
                                type="datetime-local" 
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="block w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-sm dark:text-white"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => handleShiftHour(-1)}
                                className="px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-200 transition-all cursor-pointer"
                                title="Previous Hour"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button 
                                onClick={handlePastHour}
                                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-bold rounded-xl text-xs hover:bg-gray-200 transition-all cursor-pointer"
                            >
                                Past Hour
                            </button>
                            <button 
                                onClick={() => handleShiftHour(1)}
                                className="px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-200 transition-all cursor-pointer"
                                title="Next Hour"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                        <button 
                            onClick={fetchMonitoringData}
                            className="px-6 py-2 bg-brand-primary text-white font-bold rounded-xl text-sm hover:bg-brand-secondary transition-all active:scale-95 cursor-pointer ml-auto"
                        >
                            Update Graph
                        </button>
                    </div>

                    {/* Time Series Chart */}
                    <div className="p-8 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <h3 className="text-lg font-bold text-black dark:text-white mb-6">Minute-by-Minute System Performance</h3>
                        {renderLineChart()}
                        <p className="text-xs text-gray-400 text-center mt-4">Graph shows the correlation between user load and system errors (429/500).</p>
                    </div>

                    {/* Recent Logs */}
                    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden rounded-2xl">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                            <h3 className="font-bold text-black dark:text-white">Recent AI Interactions</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-gray-800/50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        <th className="px-6 py-3">Timestamp</th>
                                        <th className="px-6 py-3">User ID</th>
                                        <th className="px-6 py-3">IP Address</th>
                                        <th className="px-6 py-3">Endpoint</th>
                                        <th className="px-6 py-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
                                    {metrics.slice(0, 20).map((m) => (
                                        <tr key={m.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                                            <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                                                {new Date(m.timestamp).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 font-mono text-xs text-gray-400">
                                                {m.userId || 'Guest'}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                                {m.ipAddress}
                                            </td>
                                            <td className="px-6 py-4">
                                                <code className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-xs text-brand-accent">
                                                    {m.endpoint.replace('/llm/v1', '')}
                                                </code>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                    m.statusCode === 200 ? 'bg-green-100 text-green-600' :
                                                    m.statusCode === 429 ? 'bg-orange-100 text-orange-600' :
                                                    'bg-red-100 text-red-600'
                                                }`}>
                                                    {m.statusCode}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPage;

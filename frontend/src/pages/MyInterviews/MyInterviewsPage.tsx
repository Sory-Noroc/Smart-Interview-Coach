import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { llmApi } from '../../api/axios';
import Button from '../../components/ui/Button';

interface InterviewSummary {
    id: number;
    name: string;
    status: 'STARTED' | 'IN_PROGRESS' | 'COMPLETED';
    createdAt: string;
}

const DashboardPage: React.FC = () => {
    const { user } = useAuth();
    const [interviews, setInterviews] = useState<InterviewSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchInterviews = async () => {
            if (!user?.id) return;
            try {
                const response = await llmApi.get<InterviewSummary[]>(`/interview/v1/interviews/user/${user.id}`);
                setInterviews(response.data);
            } catch (err: any) {
                console.error('Failed to fetch interviews:', err);
                setError('Failed to load your interview history.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchInterviews();
    }, [user?.id]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'IN_PROGRESS': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
            </div>
        );
    }

    const completedCount = interviews.filter(i => i.status === 'COMPLETED').length;
    const activeCount = interviews.filter(i => i.status !== 'COMPLETED').length;

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-black dark:text-white mb-2 tracking-tight">
                        Welcome back, <span className="text-brand-primary">{user?.username}</span>!
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-lg">Here is your interview preparation progress.</p>
                </div>
                <Link to="/setup">
                    <Button variant="primary" className="shadow-xl shadow-brand-primary/20 px-8 py-4 rounded-2xl text-lg hover:scale-105 active:scale-95 transition-all">
                        Start New Simulation
                    </Button>
                </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="p-8 rounded-[2rem] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Total Simulations</p>
                    <p className="text-5xl font-black text-black dark:text-white">{interviews.length}</p>
                </div>
                <div className="p-8 rounded-[2rem] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Completed</p>
                    <p className="text-5xl font-black text-green-500">{completedCount}</p>
                </div>
                <div className="p-8 rounded-[2rem] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">In Progress</p>
                    <p className="text-5xl font-black text-blue-500">{activeCount}</p>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-100 text-red-600 rounded-2xl mb-8">
                    {error}
                </div>
            )}

            <h2 className="text-2xl font-bold text-black dark:text-white mb-8">Recent Interview Sessions</h2>

            {interviews.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/50 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-800">
                    <div className="text-6xl mb-6">🎯</div>
                    <h3 className="text-2xl font-bold text-black dark:text-white mb-3">No interviews yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-10 max-w-sm mx-auto text-lg">
                        You haven't started any interview simulations. Ready to practice for your dream job?
                    </p>
                    <Link to="/setup">
                        <Button variant="outline" className="px-10 py-4 rounded-2xl">Create your first interview</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {interviews.map((interview) => (
                        <div 
                            key={interview.id} 
                            className="group p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col justify-between overflow-hidden relative"
                        >
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${getStatusColor(interview.status)}`}>
                                        {interview.status.replace('_', ' ')}
                                    </span>
                                    <span className="text-xs font-bold text-gray-400">
                                        {new Date(interview.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-bold text-black dark:text-white mb-3 group-hover:text-brand-primary transition-colors leading-tight">
                                    {interview.name}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-8 font-medium leading-relaxed">
                                    Personalized AI interview based on your CV and the specific job requirements.
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 relative z-10">
                                <Link to={`/interview/${interview.id}`} state={{ initialViewMode: 'chat' }} className="w-full">
                                    <Button variant="outline" className="w-full py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:border-brand-primary transition-all">
                                        {interview.status === 'COMPLETED' ? 'History' : 'Continue'}
                                    </Button>
                                </Link>
                                {interview.status === 'COMPLETED' && (
                                    <Link to={`/interview/${interview.id}`} state={{ initialViewMode: 'feedback' }} className="w-full">
                                        <Button variant="primary" className="w-full py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all">
                                            Results
                                        </Button>
                                    </Link>
                                )}
                            </div>

                            {/* Decorative background element on hover */}
                            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-brand-primary/5 rounded-full blur-3xl group-hover:bg-brand-primary/10 transition-colors duration-500"></div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DashboardPage;

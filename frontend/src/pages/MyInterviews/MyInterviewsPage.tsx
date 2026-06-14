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

const MyInterviewsPage: React.FC = () => {
    const { user } = useAuth();
    const [interviews, setInterviews] = useState<InterviewSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchInterviews = async () => {
            if (!user?.id) return;
            try {
                const response = await llmApi.get<InterviewSummary[]>(`/llm/v1/interviews/user/${user.id}`);
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

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-black dark:text-white mb-2">My Interviews</h1>
                    <p className="text-gray-500 dark:text-gray-400">Review your past performance and continue active simulations.</p>
                </div>
                <Link to="/dashboard">
                    <Button variant="primary" className="shadow-lg shadow-brand-primary/20">
                        Start New Interview
                    </Button>
                </Link>
            </div>

            {error && (
                <div className="p-4 bg-red-100 text-red-600 rounded-2xl mb-8">
                    {error}
                </div>
            )}

            {interviews.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                    <div className="text-5xl mb-4">🎯</div>
                    <h3 className="text-xl font-bold text-black dark:text-white mb-2">No interviews yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">
                        You haven't started any interview simulations. Ready to practice for your dream job?
                    </p>
                    <Link to="/dashboard">
                        <Button variant="outline">Create your first interview</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {interviews.map((interview) => (
                        <div 
                            key={interview.id} 
                            className="group p-6 rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${getStatusColor(interview.status)}`}>
                                        {interview.status.replace('_', ' ')}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {new Date(interview.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-black dark:text-white mb-2 group-hover:text-brand-primary transition-colors">
                                    {interview.name}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-6">
                                    Simulated technical interview for this position.
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3 mt-4">
                                <Link to={`/interview/${interview.id}`} state={{ initialViewMode: 'chat' }} className="w-full">
                                    <Button variant="outline" className="w-full py-2.5 rounded-2xl group-hover:border-brand-primary transition-all text-xs">
                                        {interview.status === 'COMPLETED' ? 'History' : 'Continue'}
                                    </Button>
                                </Link>
                                {interview.status === 'COMPLETED' && (
                                    <Link to={`/interview/${interview.id}`} state={{ initialViewMode: 'feedback' }} className="w-full">
                                        <Button variant="primary" className="w-full py-2.5 rounded-2xl transition-all text-xs">
                                            Results
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyInterviewsPage;

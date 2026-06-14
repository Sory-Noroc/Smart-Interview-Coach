import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { llmApi } from '../../api/axios';
import ChatContainer from '../../components/chat/ChatContainer';
import ChatInput from '../../components/chat/ChatInput';

interface Message {
    id: string;
    text: string;
    isAI: boolean;
    timestamp: string;
}

interface Feedback {
    technicalScore: number;
    communicationScore: number;
    overallGrade: number;
    strengths: string[];
    weaknesses: string[];
    improvementTips: string[];
    summary: string;
}

const InterviewPage: React.FC = () => {
    const { interviewId } = useParams<{ interviewId: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [messages, setMessages] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [isFinishing, setIsFinishing] = useState(false);
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'chat' | 'feedback'>('chat');

    const hasFetched = useRef(false);

    const formatTime = (dateStr?: string) => {
        const date = dateStr ? new Date(dateStr) : new Date();
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Fetch message history on mount
    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        const loadData = async () => {
            try {
                // Fetch Interview Details to check status
                const interviewRes = await llmApi.get(`/llm/v1/interviews/${interviewId}`);
                const isCompleted = interviewRes.data.status === 'COMPLETED';

                // Fetch feedback if completed
                if (isCompleted) {
                    try {
                        const feedbackRes = await llmApi.get(`/llm/v1/interviews/${interviewId}/feedback`);
                        if (feedbackRes.status === 200 && feedbackRes.data) {
                            setFeedback(feedbackRes.data);
                            // Setting initial viewMode (if exists) or default (feedback)
                            const initialMode = location.state?.initialViewMode || 'feedback';
                            setViewMode(initialMode);
                        }
                    } catch (fErr) {
                        console.warn('Feedback not found even if completed:', fErr);
                    }
                }

                // Fetch messages
                const response = await llmApi.get(`/llm/v1/interviews/${interviewId}/messages`);
                if (response.data && response.data.length > 0) {
                    const mapped = response.data.map((msg: any) => ({
                        id: msg.id?.toString() || Math.random().toString(),
                        text: msg.content,
                        isAI: msg.role === 'ASSISTANT',
                        timestamp: formatTime(msg.createdAt)
                    }));
                    setMessages(mapped);
                } else if (location.state?.initialQuestion) {
                    setMessages([
                        {
                            id: 'first',
                            text: location.state.initialQuestion,
                            isAI: true,
                            timestamp: formatTime()
                        }
                    ]);
                }
            } catch (err: any) {
                console.error('Failed to fetch data:', err);
                setError('Failed to load interview details.');
            }
        };

        loadData();
    }, [interviewId, location.state]);

    const handleSendMessage = async (text: string) => {
        if (!text.trim() || isTyping) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text,
            isAI: false,
            timestamp: formatTime()
        };

        setMessages(prev => [...prev, userMsg]);
        setIsTyping(true);

        const aiMessageId = (Date.now() + 1).toString();
        const placeholderMsg: Message = {
            id: aiMessageId,
            text: 'Thinking...',
            isAI: true,
            timestamp: formatTime()
        };

        setMessages(prev => [...prev, placeholderMsg]);

        try {
            const response = await llmApi.post<string>(`/llm/v1/interviews/${interviewId}/user/${user?.id || 0}`, {
                prompt: text
            });

            const aiText = response.data;

            // Update AI message text with the complete response
            setMessages(prev =>
                prev.map(m => m.id === aiMessageId ? { ...m, text: aiText } : m)
            );
        } catch (err: any) {
            console.error('Request failed:', err);
            setMessages(prev =>
                prev.map(m =>
                    m.id === aiMessageId
                        ? { ...m, text: 'Sorry, I encountered an issue. Please try sending your response again.' }
                        : m
                )
            );
        } finally {
            setIsTyping(false);
        }
    };

    const handleFinishInterview = async () => {
        setIsFinishing(true);
        setError(null);

        try {
            const response = await llmApi.post(`/llm/v1/interviews/${interviewId}/user/${user?.id || 0}/finish`);
            setFeedback(response.data);
            setViewMode('feedback');
        } catch (err: any) {
            console.error('Failed to finish interview:', err);
            setError('Could not compile feedback. Make sure you answered enough questions before finishing.');
        } finally {
            setIsFinishing(false);
        }
    };

    if (error && !feedback) {
        return (
            <div className="max-w-md mx-auto my-12 text-center p-8 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-950 text-red-500 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h2 className="text-xl font-bold mb-2 text-black dark:text-white">An Error Occurred</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">{error}</p>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="px-6 py-2.5 bg-brand-primary text-white rounded-xl hover:bg-brand-accent transition-all active:scale-95 cursor-pointer"
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    if (feedback && viewMode === 'feedback') {
        return (
            <div className="max-w-5xl mx-auto px-4 py-12 transition-colors duration-300">
                <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <span className="text-xs font-bold text-brand-accent tracking-widest uppercase bg-brand-accent/10 px-3 py-1 rounded-full">
                            Interview Simulation Report
                        </span>
                        <h1 className="text-4xl font-extrabold text-black dark:text-white mt-2 mb-1">
                            Your Performance Feedback
                        </h1>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setViewMode('chat')}
                            className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-200 transition-all active:scale-95 cursor-pointer"
                        >
                            View Chat History
                        </button>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="px-6 py-3 bg-brand-primary hover:bg-brand-secondary text-white font-medium rounded-xl shadow-lg shadow-gray-200 dark:shadow-none transition-all active:scale-95 cursor-pointer"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>

                {/* Score Summary Dashboard */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Overall Grade Card */}
                    <div className="p-8 bg-gradient-to-br from-brand-primary to-brand-accent text-white rounded-3xl shadow-xl flex flex-col items-center justify-center text-center relative overflow-hidden">
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-xl pointer-events-none"></div>
                        <h3 className="text-lg font-medium opacity-80 mb-4">Overall Score</h3>
                        <div className="relative flex items-center justify-center">
                            {/* Radial Grade Display */}
                            <svg className="w-32 h-32 transform -rotate-90">
                                <circle cx="64" cy="64" r="54" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="transparent" />
                                <circle
                                    cx="64"
                                    cy="64"
                                    r="54"
                                    stroke="white"
                                    strokeWidth="8"
                                    fill="transparent"
                                    strokeDasharray={2 * Math.PI * 54}
                                    strokeDashoffset={2 * Math.PI * 54 * (1 - feedback.overallGrade / 10)}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <span className="absolute text-3xl font-black">{feedback.overallGrade} <span className="text-sm font-normal opacity-70">/10</span></span>
                        </div>
                        <p className="mt-4 text-xs opacity-75">Calculated using combined evaluation metrics</p>
                    </div>

                    {/* Technical Score Card */}
                    <div className="p-8 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-lg">
                        <h3 className="text-gray-500 dark:text-gray-400 font-medium mb-1">Technical Ability</h3>
                        <div className="flex items-baseline gap-1 mb-4">
                            <span className="text-4xl font-extrabold text-black dark:text-white">{feedback.technicalScore}</span>
                            <span className="text-gray-400">/ 10</span>
                        </div>
                        {/* Progress bar */}
                        <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-green-500 rounded-full transition-all duration-500"
                                style={{ width: `${feedback.technicalScore * 10}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-gray-400 mt-3">Reflects correctness, detail and accuracy of technical replies.</p>
                    </div>

                    {/* Communication Score Card */}
                    <div className="p-8 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-lg">
                        <h3 className="text-gray-500 dark:text-gray-400 font-medium mb-1">Communication Style</h3>
                        <div className="flex items-baseline gap-1 mb-4">
                            <span className="text-4xl font-extrabold text-black dark:text-white">{feedback.communicationScore}</span>
                            <span className="text-gray-400">/ 10</span>
                        </div>
                        {/* Progress bar */}
                        <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                                style={{ width: `${feedback.communicationScore * 10}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-gray-400 mt-3">Reflects structure, vocabulary, tone, and delivery clarity.</p>
                    </div>
                </div>

                {/* Feedback Details */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Summary */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="p-8 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-lg">
                            <h2 className="text-xl font-bold text-black dark:text-white mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Executive Evaluation Summary
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line text-sm md:text-base">
                                {feedback.summary}
                            </p>
                        </div>

                        {/* Actionable tips */}
                        <div className="p-8 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-lg">
                            <h2 className="text-xl font-bold text-black dark:text-white mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Recommended Tips to Improve
                            </h2>
                            <ul className="space-y-3">
                                {feedback.improvementTips.map((tip, index) => (
                                    <li key={index} className="flex gap-3 text-gray-600 dark:text-gray-300 text-sm md:text-base">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-500 dark:text-blue-400 flex items-center justify-center text-xs font-bold">{index + 1}</span>
                                        <span>{tip}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Right: Strengths & Weaknesses */}
                    <div className="space-y-6">
                        {/* Strengths */}
                        <div className="p-8 bg-green-50/50 dark:bg-green-950/20 border border-green-100/50 dark:border-green-900/30 rounded-3xl">
                            <h2 className="text-lg font-bold text-green-800 dark:text-green-400 mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Key Strengths
                            </h2>
                            <ul className="space-y-3">
                                {feedback.strengths.map((str, index) => (
                                    <li key={index} className="flex gap-2 items-start text-sm text-green-900 dark:text-green-300">
                                        <span className="text-green-500 mt-1">✦</span>
                                        <span>{str}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Weaknesses */}
                        <div className="p-8 bg-red-50/50 dark:bg-red-950/20 border border-red-100/50 dark:border-red-900/30 rounded-3xl">
                            <h2 className="text-lg font-bold text-red-800 dark:text-red-400 mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                Areas for Growth
                            </h2>
                            <ul className="space-y-3">
                                {feedback.weaknesses.map((weak, index) => (
                                    <li key={index} className="flex gap-2 items-start text-sm text-red-900 dark:text-red-300">
                                        <span className="text-red-400 mt-1">✦</span>
                                        <span>{weak}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-73px)] bg-white dark:bg-black transition-colors duration-300">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white/80 dark:bg-black/80 backdrop-blur-md sticky top-0 z-10">
                <div>
                    <h2 className="text-xl font-bold text-black dark:text-white">AI Interview Simulation</h2>
                    <p className="text-xs text-brand-primary font-semibold uppercase tracking-wider">
                        {feedback ? 'Review Mode' : 'Live Session'}
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    {feedback && (
                        <button
                            onClick={() => setViewMode('feedback')}
                            className="px-4 py-2 text-xs md:text-sm font-bold bg-green-500 hover:bg-green-600 text-white rounded-xl cursor-pointer transition-all active:scale-95"
                        >
                            View Feedback
                        </button>
                    )}
                    {!feedback && (
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Connected</span>
                        </div>
                    )}
                    {!feedback && (
                        <button
                            onClick={handleFinishInterview}
                            disabled={isFinishing}
                            className="px-4 py-2 text-xs md:text-sm font-bold bg-brand-accent hover:bg-brand-accent/90 text-white rounded-xl cursor-pointer disabled:opacity-50 transition-all active:scale-95"
                        >
                            {isFinishing ? 'Processing...' : 'Finish Interview'}
                        </button>
                    )}
                </div>
            </div>

            {/* Chat Messages */}
            <ChatContainer messages={messages} isTyping={isTyping} />

            {/* Input Bar - only show if not finished */}
            {!feedback && (
                <div className="max-w-4xl w-full mx-auto">
                    <ChatInput onSendMessage={handleSendMessage} disabled={isTyping || isFinishing} />
                </div>
            )}
            
            {feedback && (
                <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 text-center text-sm text-gray-500 italic">
                    This interview is completed. You can review the messages above or switch to the feedback report.
                </div>
            )}
        </div>
    );
};

export default InterviewPage;

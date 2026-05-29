import React, { useState, useEffect, useRef } from 'react';
import ChatContainer from '../../components/chat/ChatContainer';
import ChatInput from '../../components/chat/ChatInput';

interface Message {
    id: string;
    text: string;
    isAI: boolean;
    timestamp: string;
}

const DEMO_QUESTIONS = [
    "Hello! I'm your PrepForge AI coach. Ready for a quick demo? Let's start: Can you tell me a bit about yourself?",
    "That's interesting! Now, what would you say is your greatest professional achievement?",
    "Great! And finally, why do you want to work with us specifically?",
    "Thank you for participating in this demo! In the full version, I will analyze your CV and the job description to give you personalized feedback. Ready to ace your real interview?"
];

const DemoPage: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const hasInitialized = useRef(false);

    const getTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const addAIMessage = (text: string) => {
        setIsTyping(true);
        // Timeout for thinking time
        setTimeout(() => {
            const newMessage: Message = {
                id: Date.now().toString(),
                text,
                isAI: true,
                timestamp: getTime()
            };
            setMessages(prev => [...prev, newMessage]);
            setIsTyping(false);
        }, 2000);
    };

    useEffect(() => {
        if (!hasInitialized.current) {
            addAIMessage(DEMO_QUESTIONS[0]);
            hasInitialized.current = true;
        }
    }, []);

    const handleSendMessage = (text: string) => {
        const userMsg: Message = {
            id: (Date.now() + 1).toString(),
            text,
            isAI: false,
            timestamp: getTime()
        };
        setMessages(prev => [...prev, userMsg]);

        // Trigger next question if available
        if (questionIndex < DEMO_QUESTIONS.length - 1) {
            const nextIndex = questionIndex + 1;
            setQuestionIndex(nextIndex);
            addAIMessage(DEMO_QUESTIONS[nextIndex]);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-73px)] bg-white dark:bg-black transition-colors duration-300">

            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white/80 dark:bg-black/80 backdrop-blur-md sticky top-0 z-10">
                <div>
                    <h2 className="text-xl font-bold text-black dark:text-white">Demo Interview</h2>
                    <p className="text-xs text-brand-primary font-semibold uppercase tracking-wider">Simulation Mode</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-sm font-medium text-gray-500">Live AI Coach</span>
                </div>
            </div>

            <ChatContainer messages={messages} isTyping={isTyping} />

            <div className="max-w-4xl w-full mx-auto">
                <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
            </div>
        </div>
    );
};

export default DemoPage;

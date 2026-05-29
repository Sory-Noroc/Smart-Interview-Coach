import React from 'react';

interface ChatBubbleProps {
    message: string;
    isAI: boolean;
    timestamp?: string;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isAI, timestamp }) => {
    return (
        <div className={`flex w-full mb-4 ${isAI ? 'justify-start' : 'justify-end animate-in slide-in-from-right duration-300'}`}>
            <div className={`max-w-[80%] md:max-w-[70%] px-5 py-3 rounded-2xl shadow-sm
                ${isAI 
                    ? 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white rounded-tl-none' 
                    : 'bg-brand-primary text-white rounded-tr-none shadow-brand-primary/20'
                }`}
            >
                <div className="text-sm md:text-base leading-relaxed">
                    {message}
                </div>
                {timestamp && (
                    <div className={`text-[10px] mt-1 opacity-50 ${isAI ? 'text-left' : 'text-right'}`}>
                        {timestamp}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatBubble;

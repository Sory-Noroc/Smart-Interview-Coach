import React, { useEffect, useRef } from 'react';
import ChatBubble from './ChatBubble';

interface Message {
    id: string;
    text: string;
    isAI: boolean;
    timestamp: string;
}

interface ChatContainerProps {
    messages: Message[];
    isTyping?: boolean;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ messages, isTyping }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    return (
        <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 md:p-6 space-y-2 scroll-smooth"
        >
            {messages.map((msg) => (
                <ChatBubble 
                    key={msg.id}
                    message={msg.text}
                    isAI={msg.isAI}
                    timestamp={msg.timestamp}
                />
            ))}
            
            {isTyping && (
                <div className="flex justify-start mb-4">
                    <div className="bg-gray-100 dark:bg-gray-800 px-5 py-3 rounded-2xl rounded-tl-none">
                        <div className="flex gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatContainer;

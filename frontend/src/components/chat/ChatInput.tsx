import React, { useState } from 'react';

interface ChatInputProps {
    onSendMessage: (message: string) => void;
    disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() && !disabled) {
            onSendMessage(message);
            setMessage('');
        }
    };

    return (
        <form 
            onSubmit={handleSubmit}
            className="flex flex-row items-center gap-2 p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800"
        >
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={disabled ? "AI is typing..." : "Type your answer..."}
                disabled={disabled}
                className="flex-1 px-4 py-3 rounded-xl bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all dark:text-white disabled:opacity-50"
            />
            <button
                type="submit"
                disabled={!message.trim() || disabled}
                className="p-3 rounded-xl bg-brand-primary text-white hover:bg-brand-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 cursor-pointer"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                </svg>
            </button>
        </form>
    );
};

export default ChatInput;

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => {
    return (
        <div className="flex flex-col gap-2 w-full">
            {label && (
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {label}
                </label>
            )}
            <input
                className={`px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 
                bg-white dark:bg-gray-900 text-black dark:text-white 
                focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${className}`}
                {...props}
            />
        </div>
    );
};

export default Input;

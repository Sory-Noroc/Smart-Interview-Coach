import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'ghost';
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
    variant = 'primary', 
    children, 
    className = '', 
    ...props 
}) => {
    const baseStyles = "px-5 py-2 rounded-xl font-bold transition-all active:scale-95 cursor-pointer text-sm md:text-base";

    const variants = {
        primary: "bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200",
        outline: "border border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black",
        ghost: "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200"
    };

    return (
        <button 
            className={`${baseStyles} ${variants[variant]} ${className}`} 
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;

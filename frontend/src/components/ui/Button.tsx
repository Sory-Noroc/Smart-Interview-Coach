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
        primary: "bg-white text-black dark:bg-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800",
        outline: "border border-white dark:border-black text-white dark:text-black hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white",
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

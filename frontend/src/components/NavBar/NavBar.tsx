import { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext.tsx";
import Button from "../ui/Button.tsx";
import { MoonIcon, SunIcon } from "../ui/Icons.tsx";

const MenuIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
    </svg>
);

const CloseIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
    </svg>
);

function NavBar() {
    const { theme, toggleTheme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="relative bg-black dark:bg-white text-white dark:text-black shadow-md transition-colors duration-300 z-50">
            <div className="flex flex-row items-center justify-between px-4 md:px-8 py-4">
                <Link to="/" className="text-xl md:text-2xl font-extrabold tracking-tight cursor-pointer md:min-w-65">
                    Job<span className="text-blue-500">Acer</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex flex-row items-center gap-4 lg:gap-8 font-light text-gray-400">
                    <Link to="/" className="hover:text-gray-800 dark:hover:text-gray-200 transition-colors cursor-pointer font-medium">Home</Link>
                    <Link to="/about" className="hover:text-gray-800 dark:hover:text-gray-200 transition-colors cursor-pointer font-medium">About</Link>
                    <Link to="/demo" className="hover:text-gray-800 dark:hover:text-gray-200 transition-colors cursor-pointer font-medium">Demo</Link>
                </div>

                <div className="flex flex-row items-center gap-2 md:gap-4">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-all cursor-pointer"
                        aria-label="Toggle Theme"
                    >
                        {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                    </button>

                    <div className="hidden md:flex flex-row items-center gap-2 lg:gap-4">
                        <Link to="/login">
                            <Button variant="primary" className="min-w-22">Log In</Button>
                        </Link>
                        <Link to="/register">
                            <Button variant="outline">Register</Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-all cursor-pointer"
                    >
                        {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-black dark:bg-white border-t border-gray-800 dark:border-gray-200 flex flex-col p-4 gap-4 shadow-xl animate-in slide-in-from-top duration-200">
                    <Link to="/" onClick={() => setIsMenuOpen(false)} className="py-2 text-lg font-medium border-b border-gray-800 dark:border-gray-100">Home</Link>
                    <Link to="/about" onClick={() => setIsMenuOpen(false)} className="py-2 text-lg font-medium border-b border-gray-800 dark:border-gray-100">About</Link>
                    <Link to="/demo" onClick={() => setIsMenuOpen(false)} className="py-2 text-lg font-medium border-b border-gray-800 dark:border-gray-100">Demo</Link>
                    <div className="flex flex-col gap-3 pt-2">
                        <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                            <Button variant="primary" className="w-full">Log In</Button>
                        </Link>
                        <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                            <Button variant="outline" className="w-full">Register</Button>
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    )
}

export default NavBar



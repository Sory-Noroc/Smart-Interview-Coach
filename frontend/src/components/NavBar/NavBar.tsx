import {useState} from "react";
import {useTheme} from "../../context/ThemeContext.tsx";

function NavBar() {
    const [isLogged] = useState(0)
    const {theme, toggleTheme} = useTheme()

    return (
        <nav className="flex flex-row items-center justify-between px-8 py-4 bg-black dark:bg-white text-white dark:text-black shadow-md">
            <h2 className="text-2xl font-extrabold tracking-tight cursor-pointer">
                Smart <span className="text-blue-500">Interview</span> Coach
            </h2>

            <div className="flex flex-row items-center gap-8 font-light text-gray-400">
                <p className="hover:text-gray-800 transition-colors cursor-pointer">Home</p>
                <p className="hover:text-gray-800 transition-colors cursor-pointer">About</p>
                <p className="hover:text-gray-800 transition-colors cursor-pointer">Demo</p>

            </div>
            <div className="flex flex-row items-center gap-4">
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-black hover:bg-gray-200 dark:hover:bg-gray-800 transition-all cursor-pointer text-xl"
                >
                    {theme === 'light' ? '🌙' : '☀️'}
                </button>

                <button className="bg-white text-black dark:bg-black dark:text-white px-5 py-2 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-800 transition-all active:scale-95 cursor-pointer">
                    Log In
                </button>
                <button className="border border-white dark:border-black px-5 py-2 rounded-xl hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white transition-all active:scale-95 cursor-pointer">
                    Register
                </button>
            </div>
        </nav>
    )
}

export default NavBar

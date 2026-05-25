import { useTheme } from "../../context/ThemeContext.tsx";
import Button from "../ui/Button.tsx";
import { MoonIcon, SunIcon } from "../ui/Icons.tsx";

function NavBar() {
    const { theme, toggleTheme } = useTheme();

    return (
        <nav className="flex flex-row items-center justify-between px-8 py-4 bg-black dark:bg-white text-white dark:text-black shadow-md transition-colors duration-300">
            <h2 className="text-2xl font-extrabold tracking-tight cursor-pointer">
                Smart <span className="text-blue-500">Interview</span> Coach
            </h2>

            <div className="flex flex-row items-center gap-8 font-light text-gray-400">
                <p className="hover:text-gray-800 dark:hover:text-gray-200 transition-colors cursor-pointer">Home</p>
                <p className="hover:text-gray-800 dark:hover:text-gray-200 transition-colors cursor-pointer">About</p>
                <p className="hover:text-gray-800 dark:hover:text-gray-200 transition-colors cursor-pointer">Demo</p>
            </div>

            <div className="flex flex-row items-center gap-4">
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg bg-white text-black dark:bg-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800 transition-all cursor-pointer"
                    aria-label="Toggle Theme"
                >
                    {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                </button>

                <Button variant="primary">
                    Log In
                </Button>
                <Button variant="outline">
                    Register
                </Button>
            </div>
        </nav>
    )
}

export default NavBar

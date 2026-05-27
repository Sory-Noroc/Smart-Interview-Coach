import React from 'react';
import { Link } from 'react-router-dom';
import Button from "../../components/ui/Button.tsx";

const HomePage: React.FC = () => {
    return (
        <div className="relative overflow-hidden bg-white dark:bg-black transition-colors duration-300">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden opacity-20 dark:opacity-30">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-purple-600 rounded-full blur-[100px]"></div>
            </div>

            {/* Hero Section */}
            <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 px-4">
                <div className="max-w-5xl mx-auto text-center">
                    <div className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wide text-blue-600 uppercase bg-blue-50 dark:bg-blue-900/30 rounded-full">
                        Powered by AI
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-black dark:text-white mb-8 leading-[1.1]">
                        Are you tired of stress blocking your <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-500">full potential</span> on job interviews?
                    </h1>
                    
                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
                        Try <span className="font-bold text-black dark:text-white">PrepForge</span>! Our app uses state-of-the-art artificial intelligence to simulate real job interview vibes and tailored questions, helping you practice and ace your next big opportunity.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/register">
                            <Button variant="primary" className="w-full sm:w-auto px-10 py-4 text-lg rounded-2xl shadow-lg shadow-blue-500/20">
                                Get Started Now
                            </Button>
                        </Link>
                        <Link to="/demo">
                            <Button variant="outline" className="w-full sm:w-auto px-10 py-4 text-lg rounded-2xl">
                                Watch Demo
                            </Button>
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-8 items-center justify-center max-w-3xl mx-auto pt-10 border-t border-gray-100 dark:border-gray-800">
                        <div>
                            <p className="text-3xl font-bold text-black dark:text-white">100%</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Context-Aware</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-black dark:text-white">Gemini</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Powered Brain</p>
                        </div>
                        <div className="hidden md:block">
                            <p className="text-3xl font-bold text-black dark:text-white">Real-time</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Feedback Loop</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default HomePage;

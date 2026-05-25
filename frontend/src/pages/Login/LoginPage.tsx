import React, { useState } from 'react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Logging in with:', { username, password });
        // API call logic
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8 bg-white dark:bg-black transition-colors duration-300">
            <div className="w-full max-w-md p-6 md:p-10 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl bg-white dark:bg-gray-900">
                <div className="text-center mb-8 md:mb-10">
                    <h1 className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-2">Welcome Back</h1>
                    <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">Please enter your details to sign in</p>
                </div>

                <form onSubmit={handleLogin} className="flex flex-col gap-6">
                    <Input 
                        label="Username"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    
                    <Input 
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 cursor-pointer text-gray-600 dark:text-gray-400">
                            <input type="checkbox" className="rounded border-gray-300 dark:border-gray-700" />
                            Remember me
                        </label>
                        <a href="#" className="text-blue-500 hover:underline">Forgot password?</a>
                    </div>

                    <Button type="submit" variant="primary" className="w-full py-3 mt-2">
                        Sign In
                    </Button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    Don't have an account?{' '}
                    <a href="#" className="text-blue-500 font-bold hover:underline">Sign up for free</a>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

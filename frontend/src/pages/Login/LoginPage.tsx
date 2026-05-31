import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const LoginPage: React.FC = () => {
    const [usernameOrEmail, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await api.post('/uac/v1/auth/login', {
                usernameOrEmail,
                password
            });

            const { accessToken, refreshToken, username: userRes, role } = response.data;
            
            login(accessToken, refreshToken, userRes, role);
            navigate('/');
        } catch (err: any) {
            // for debugging only
            console.log(err)
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError('Invalid username or password. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8 bg-white dark:bg-black transition-colors duration-300">
            <div className="w-full max-w-md p-6 md:p-10 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl bg-white dark:bg-gray-900">
                <div className="text-center mb-8 md:mb-10">
                    <h1 className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-2">Welcome Back</h1>
                    <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">Please enter your details to sign in</p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-xl border border-red-200 dark:border-red-800">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="flex flex-col gap-6">
                    <Input 
                        label="Username"
                        placeholder="Enter your username"
                        value={usernameOrEmail}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                    
                    <Input 
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                    />

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 cursor-pointer text-gray-600 dark:text-gray-400">
                            <input type="checkbox" className="rounded border-gray-300 dark:border-gray-700" />
                            Remember me
                        </label>
                        <a href="#" className="text-blue-500 hover:underline">Forgot password?</a>
                    </div>

                    <Button 
                        type="submit" 
                        variant="primary" 
                        className="w-full py-3 mt-2"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </Button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    Don't have an account?{' '}
                    <a href="/register" className="text-blue-500 font-bold hover:underline">Sign up for free</a>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

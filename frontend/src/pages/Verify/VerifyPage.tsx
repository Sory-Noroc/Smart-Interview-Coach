import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import api from '../../api/axios';

const VerifyPage: React.FC = () => {
    const [token, setToken] = useState('');
    const [error, setError] = useState('');
    const [success, setResetSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || "";

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await api.post('/uac/v1/auth/verify', { token });
            setResetSuccess('Account verified successfully! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Verification failed. Please check your code.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (!email) return;
        setError('');
        setResetSuccess('');
        setIsLoading(true);

        try {
            await api.post('/uac/v1/auth/resend-verification', { email });
            setResetSuccess('New verification code sent to your email!');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to resend code.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8 bg-white dark:bg-black transition-colors duration-300">
            <div className="w-full max-w-md p-6 md:p-10 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl bg-white dark:bg-gray-900">
                <div className="text-center mb-8 md:mb-10">
                    <h1 className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-2">Verify Your Account</h1>
                    <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">
                        {email ? `We've sent a verification code to ${email}` : "Please enter the verification code sent to your email"}
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-xl border border-red-200 dark:border-red-800">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm rounded-xl border border-green-200 dark:border-green-800">
                        {success}
                    </div>
                )}

                <form onSubmit={handleVerify} className="flex flex-col gap-6">
                    <Input 
                        label="Verification Code"
                        placeholder="Enter the 6-character code"
                        value={token}
                        onChange={(e) => setToken(e.target.value.toUpperCase())}
                        required
                        disabled={isLoading || (!!success && success.includes('verified'))}
                    />

                    <Button 
                        type="submit" 
                        variant="primary" 
                        className="w-full py-3 mt-2"
                        disabled={isLoading || (!!success && success.includes('verified'))}
                    >
                        {isLoading ? 'Verifying...' : 'Verify Account'}
                    </Button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    Didn't receive a code?{' '}
                    <button 
                        onClick={handleResend}
                        disabled={isLoading || !email}
                        className="text-blue-500 font-bold hover:underline cursor-pointer disabled:opacity-50"
                    >
                        Resend code
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VerifyPage;

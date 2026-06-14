import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { uacApi } from '../../api/axios';

const ForgotPasswordPage: React.FC = () => {
    const [step, setStep] = useState<'request' | 'reset'>('request');
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const navigate = useNavigate();

    const handleRequestReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await uacApi.post('/uac/v1/auth/forgot-password', { email });
            setSuccess('Reset code sent to your email!');
            setStep('reset');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to send reset code. Please check your email.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match!');
            return;
        }

        setIsLoading(true);

        try {
            await uacApi.post('/uac/v1/auth/reset-password', {
                token,
                newPassword
            });
            setSuccess('Password reset successfully! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to reset password. The code might be invalid or expired.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8 bg-white dark:bg-black transition-colors duration-300">
            <div className="w-full max-w-md p-6 md:p-10 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl bg-white dark:bg-gray-900">
                <div className="text-center mb-8 md:mb-10">
                    <h1 className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-2">
                        {step === 'request' ? 'Forgot Password?' : 'Reset Your Password'}
                    </h1>
                    <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">
                        {step === 'request' 
                            ? "No worries! Enter your email and we'll send you a reset code." 
                            : "Enter the code you received and choose a new password."}
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

                {step === 'request' ? (
                    <form onSubmit={handleRequestReset} className="flex flex-col gap-6">
                        <Input 
                            label="Email Address"
                            type="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                        <Button type="submit" variant="primary" className="w-full py-3" disabled={isLoading}>
                            {isLoading ? 'Sending...' : 'Send Reset Code'}
                        </Button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword} className="flex flex-col gap-6">
                        <Input 
                            label="Reset Code"
                            placeholder="Enter the 6-character code"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            required
                            disabled={isLoading || success.includes('successfully')}
                        />
                        <div className="grid grid-cols-1 gap-4">
                            <Input 
                                label="New Password"
                                type="password"
                                placeholder="••••••••"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                disabled={isLoading || success.includes('successfully')}
                            />
                            <Input 
                                label="Confirm New Password"
                                type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                disabled={isLoading || success.includes('successfully')}
                            />
                        </div>
                        <Button type="submit" variant="primary" className="w-full py-3" disabled={isLoading || success.includes('successfully')}>
                            {isLoading ? 'Resetting...' : 'Reset Password'}
                        </Button>
                        <button 
                            type="button" 
                            onClick={() => setStep('request')} 
                            className="text-sm text-gray-500 hover:text-brand-primary"
                        >
                            ← Back to email request
                        </button>
                    </form>
                )}

                <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    Remember your password?{' '}
                    <Link to="/login" className="text-blue-500 font-bold hover:underline">Log in</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;

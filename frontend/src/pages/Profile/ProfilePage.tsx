import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { uacApi } from '../../api/axios';

const ProfilePage: React.FC = () => {
    const { user, logout } = useAuth();

    // Profile State
    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        username: ''
    });
    const [isProfileLoading, setIsProfileLoading] = useState(true);
    const [profileError, setProfileError] = useState('');
    const [profileSuccess, setProfileSuccess] = useState('');

    // Password Reset Flow State
    const [resetStep, setResetStep] = useState<'request' | 'verify' | 'completed'>('request');
    const [resetData, setResetData] = useState({
        token: '',
        newPassword: '',
        confirmNewPassword: ''
    });
    const [isResetLoading, setIsResetLoading] = useState(false);
    const [resetError, setResetError] = useState('');
    const [resetSuccess, setResetSuccess] = useState('');

    // Fetch user details on mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await uacApi.get('/uac/v1/users/me');
                setProfileData({
                    firstName: response.data.firstName || '',
                    lastName: response.data.lastName || '',
                    email: response.data.email || '',
                    username: response.data.username || ''
                });
            } catch (err: any) {
                console.error('Failed to fetch profile:', err);
                setProfileError('Failed to load profile details.');
            } finally {
                setIsProfileLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setProfileError('');
        setProfileSuccess('');
        setIsProfileLoading(true);

        try {
            await uacApi.put('/uac/v1/users/me', {
                firstName: profileData.firstName,
                lastName: profileData.lastName
            });
            setProfileSuccess('Profile updated successfully!');
        } catch (err: any) {
            setProfileError(err.response?.data?.error || 'Failed to update profile.');
        } finally {
            setIsProfileLoading(false);
        }
    };

    const handleRequestReset = async () => {
        setResetError('');
        setResetSuccess('');
        setIsResetLoading(true);

        try {
            await uacApi.post('/uac/v1/auth/forgot-password', {
                email: profileData.email
            });
            setResetSuccess('Reset code sent to your email!');
            setResetStep('verify');
        } catch (err: any) {
            setResetError(err.response?.data?.error || 'Failed to send reset code.');
        } finally {
            setIsResetLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setResetError('');
        setResetSuccess('');

        if (resetData.newPassword !== resetData.confirmNewPassword) {
            setResetError('New passwords do not match!');
            return;
        }

        setIsResetLoading(true);

        try {
            await uacApi.post('/uac/v1/auth/reset-password', {
                token: resetData.token,
                newPassword: resetData.newPassword
            });

            setResetSuccess('Password has been reset successfully! Please log in again.');
            setResetStep('completed');

            // timeout to let the user read the login required message
            setTimeout(() => {
                logout();
            }, 3000);

        } catch (err: any) {
            setResetError(err.response?.data?.error || 'Failed to reset password. Token might be invalid or expired.');
        } finally {
            setIsResetLoading(false);
        }
    };

    if (isProfileLoading && !profileData.username) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-12 transition-colors duration-300">
            <div className="mb-12">
                <h1 className="text-4xl font-extrabold text-black dark:text-white mb-2">My Profile</h1>
                <p className="text-gray-500 dark:text-gray-400 text-lg">Manage your account settings and security.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: User Summary */}
                <div className="lg:col-span-1">
                    <div className="p-8 rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl flex flex-col items-center text-center sticky top-24">
                        <div className="w-24 h-24 rounded-full bg-brand-primary text-white flex items-center justify-center text-4xl font-bold mb-4 shadow-lg shadow-brand-primary/20">
                            {profileData.username?.charAt(0).toUpperCase()}
                        </div>
                        <h2 className="text-2xl font-bold text-black dark:text-white">{profileData.username}</h2>
                        <p className="text-sm font-medium text-brand-primary uppercase tracking-wider mt-1">{user?.role}</p>
                        <p className="text-xs text-gray-400 mt-2">{profileData.email}</p>

                        <div className="mt-8 w-full border-t border-gray-100 dark:border-gray-800 pt-6">
                            <Button
                                variant="outline"
                                className="w-full text-red-500 border-red-100 hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-900/10"
                                onClick={logout}
                            >
                                Log Out
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Forms */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Profile Information Form */}
                    <div className="p-8 rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg">
                        <h3 className="text-xl font-bold text-black dark:text-white mb-6 flex items-center gap-2">
                            <svg className="w-5 h-5 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Personal Information
                        </h3>

                        {profileError && <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-xl text-sm">{profileError}</div>}
                        {profileSuccess && !resetSuccess && <div className="mb-4 p-3 bg-green-100 text-green-600 rounded-xl text-sm">{profileSuccess}</div>}

                        <form onSubmit={handleProfileUpdate} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="First Name"
                                    value={profileData.firstName}
                                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                                />
                                <Input
                                    label="Last Name"
                                    value={profileData.lastName}
                                    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                                />
                            </div>
                            <Input label="Email" value={profileData.email} disabled className="opacity-60 cursor-not-allowed" />
                            <Input label="Username" value={profileData.username} disabled className="opacity-60 cursor-not-allowed" />

                            <Button type="submit" variant="primary" disabled={isProfileLoading}>
                                {isProfileLoading ? 'Saving...' : 'Update Profile'}
                            </Button>
                        </form>
                    </div>

                    {/* Secure Password Reset Flow */}
                    <div className="p-8 rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg">
                        <h3 className="text-xl font-bold text-black dark:text-white mb-6 flex items-center gap-2">
                            <svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            Security & Password
                        </h3>

                        {resetError && <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-xl text-sm">{resetError}</div>}
                        {resetSuccess && <div className="mb-4 p-3 bg-green-100 text-green-600 rounded-xl text-sm">{resetSuccess}</div>}

                        {resetStep === 'request' && (
                            <div className="space-y-6">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    To change your password, we need to verify your identity. We will send a secure reset token to your email: <strong>{profileData.email}</strong>
                                </p>
                                <Button
                                    onClick={handleRequestReset}
                                    variant="primary"
                                    disabled={isResetLoading}
                                >
                                    {isResetLoading ? 'Sending Email...' : 'Send Reset Code'}
                                </Button>
                            </div>
                        )}

                        {resetStep === 'verify' && (
                            <form onSubmit={handleResetPassword} className="space-y-6">
                                <Input
                                    label="Verification Token"
                                    placeholder="Paste the code from your email"
                                    value={resetData.token}
                                    onChange={(e) => setResetData({ ...resetData, token: e.target.value })}
                                    required
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                        label="New Password"
                                        type="password"
                                        value={resetData.newPassword}
                                        onChange={(e) => setResetData({ ...resetData, newPassword: e.target.value })}
                                        required
                                    />
                                    <Input
                                        label="Confirm New Password"
                                        type="password"
                                        value={resetData.confirmNewPassword}
                                        onChange={(e) => setResetData({ ...resetData, confirmNewPassword: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <Button type="submit" variant="primary" disabled={isResetLoading}>
                                        {isResetLoading ? 'Resetting...' : 'Complete Reset'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setResetStep('request')}
                                        disabled={isResetLoading}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        )}

                        {resetStep === 'completed' && (
                            <div className="text-center py-4">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-4">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300">You will be logged out in a few seconds...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;

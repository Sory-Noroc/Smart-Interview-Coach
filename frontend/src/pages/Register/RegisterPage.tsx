import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from "../../api/axios.ts";
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import RegisterRequest from "../../dto/RegisterRequest.tsx";

const RegisterPage: React.FC = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        setIsLoading(true);

        try {
            const requestBody = new RegisterRequest(
                formData.username,
                formData.email,
                formData.firstName,
                formData.lastName,
                formData.password
            );

            await api.post('/uac/v1/auth/register', requestBody);

            navigate('/verify', { state: { email: formData.email } });

        } catch (err: any) {
            console.error(err);
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError('Registration failed. Please check your data and try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-12 bg-white dark:bg-black transition-colors duration-300">
            <div className="w-full max-w-lg p-6 md:p-10 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl bg-white dark:bg-gray-900">
                <div className="text-center mb-8 md:mb-10">
                    <h1 className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-2">Create an Account</h1>
                    <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">Join us to start coaching your interviews</p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-xl border border-red-200 dark:border-red-800">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="flex flex-col gap-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Input
                            label="First Name"
                            name="firstName"
                            placeholder="Tom"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                        />
                        <Input
                            label="Last Name"
                            name="lastName"
                            placeholder="Sawyer"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <Input
                        label="Email"
                        type="email"
                        name="email"
                        placeholder="tomsaywer@company.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                    />

                    <Input
                        label="Username"
                        name="username"
                        placeholder="Your Username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Input
                            label="Password"
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                        />
                        <Input
                            label="Confirm Password"
                            type="password"
                            name="confirmPassword"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        className="w-full py-3 mt-4"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-500 font-bold hover:underline">Log in</Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const RegisterPage: React.FC = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Registering with:', formData);
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-12 bg-white dark:bg-black transition-colors duration-300">
            <div className="w-full max-w-lg p-6 md:p-10 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl bg-white dark:bg-gray-900">
                <div className="text-center mb-8 md:mb-10">
                    <h1 className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-2">Create an Account</h1>
                    <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">Join us to start coaching your interviews</p>
                </div>

                <form onSubmit={handleRegister} className="flex flex-col gap-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Input 
                            label="First Name"
                            name="firstName"
                            placeholder="Sorin"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                        <Input 
                            label="Last Name"
                            name="lastName"
                            placeholder="Noroc"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <Input 
                        label="Email"
                        type="email"
                        name="email"
                        placeholder="sorin@company.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <Input 
                        label="Username"
                        name="username"
                        placeholder="sorinnoroc123"
                        value={formData.username}
                        onChange={handleChange}
                        required
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
                        />
                        <Input 
                            label="Confirm Password"
                            type="password"
                            name="confirmPassword"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <Button type="submit" variant="primary" className="w-full py-3 mt-4">
                        Create Account
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

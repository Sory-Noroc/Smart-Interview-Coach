import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    id: number;
    username: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    login: (accessToken: string, refreshToken: string, id: number, username: string, role: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const idStr = localStorage.getItem('id');
        const username = localStorage.getItem('username');
        const role = localStorage.getItem('role');
        const token = localStorage.getItem('accessToken');

        if (idStr && username && role && token) {
            setUser({ id: parseInt(idStr, 10), username, role });
        }
    }, []);

    const login = (accessToken: string, refreshToken: string, id: number, username: string, role: string) => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('id', id.toString());
        localStorage.setItem('username', username);
        localStorage.setItem('role', role);
        setUser({ id, username, role });
    };

    const logout = () => {
        localStorage.clear();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};

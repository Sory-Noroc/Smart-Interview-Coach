import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    id: number;
    username: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    login: (accessToken: string, refreshToken: string, id: number, username: string, role: string, rememberMe: boolean) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Helper to check both storage locations
        const getFromAnyStorage = (key: string) => localStorage.getItem(key) || sessionStorage.getItem(key);
        
        const idStr = getFromAnyStorage('id');
        const username = getFromAnyStorage('username');
        const role = getFromAnyStorage('role');
        const token = getFromAnyStorage('accessToken');

        if (idStr && username && role && token) {
            setUser({ id: parseInt(idStr, 10), username, role });
        }
    }, []);

    const login = (accessToken: string, refreshToken: string, id: number, username: string, role: string, rememberMe: boolean = false) => {
        const storage = rememberMe ? localStorage : sessionStorage;
        
        storage.setItem('accessToken', accessToken);
        storage.setItem('refreshToken', refreshToken);
        storage.setItem('id', id.toString());
        storage.setItem('username', username);
        storage.setItem('role', role);
        
        setUser({ id, username, role });
    };

    const logout = () => {
        localStorage.clear();
        sessionStorage.clear();
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

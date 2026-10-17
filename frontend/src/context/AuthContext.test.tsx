import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthProvider, useAuth } from './AuthContext';

describe('AuthContext', () => {
    beforeEach(() => {
        localStorage.clear();
        sessionStorage.clear();
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
    );

    it('initializes with default state when storage is empty', () => {
        const { result } = renderHook(() => useAuth(), { wrapper });
        
        expect(result.current.user).toBeNull();
        expect(result.current.isAuthenticated).toBe(false);
        expect(result.current.isLoading).toBe(false); 
    });

    it('hydrates user data from localStorage on mount', () => {
        localStorage.setItem('id', '99');
        localStorage.setItem('username', 'testadmin');
        localStorage.setItem('role', 'admin');
        localStorage.setItem('accessToken', 'mock-token');

        const { result } = renderHook(() => useAuth(), { wrapper });

        expect(result.current.user).toEqual({
            id: 99,
            username: 'testadmin',
            role: 'admin'
        });
        expect(result.current.isAuthenticated).toBe(true);
    });

    it('login() with rememberMe = true saves to localStorage', () => {
        const { result } = renderHook(() => useAuth(), { wrapper });

        act(() => {
            result.current.login('access123', 'refresh123', 1, 'johndoe', 'user', true);
        });

        // State should update
        expect(result.current.user).toEqual({ id: 1, username: 'johndoe', role: 'user' });
        expect(result.current.isAuthenticated).toBe(true);

        // Should be in local storage
        expect(localStorage.getItem('accessToken')).toBe('access123');
        expect(localStorage.getItem('username')).toBe('johndoe');
        
        // Should NOT be in session storage
        expect(sessionStorage.getItem('accessToken')).toBeNull();
    });

    it('login() with rememberMe = false saves to sessionStorage', () => {
        const { result } = renderHook(() => useAuth(), { wrapper });

        act(() => {
            result.current.login('access456', 'refresh456', 2, 'janedoe', 'editor', false);
        });

        // Should be in session storage
        expect(sessionStorage.getItem('accessToken')).toBe('access456');
        expect(sessionStorage.getItem('username')).toBe('janedoe');
        
        // Should NOT be in local storage
        expect(localStorage.getItem('accessToken')).toBeNull();
    });

    it('logout() clears state and all storages', () => {
        const { result } = renderHook(() => useAuth(), { wrapper });

        // First, log in
        act(() => {
            result.current.login('token', 'refresh', 1, 'bob', 'user', true);
        });
        
        // Ensure storage has data
        expect(localStorage.getItem('accessToken')).toBe('token');

        // Now, log out
        act(() => {
            result.current.logout();
        });

        // Verify everything is wiped
        expect(result.current.user).toBeNull();
        expect(result.current.isAuthenticated).toBe(false);
        expect(localStorage.length).toBe(0);
        expect(sessionStorage.length).toBe(0);
    });

    it('throws an error if useAuth is used outside of AuthProvider', () => {
        // Temporarily suppress console.error so the terminal doesn't look messy during the expected throw
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        
        // Render WITHOUT the wrapper
        expect(() => renderHook(() => useAuth())).toThrow(
            'useAuth must be used within an AuthProvider'
        );
        
        consoleSpy.mockRestore();
    });
});
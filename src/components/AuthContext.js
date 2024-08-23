import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setAuth] = useState(null);

    const login = (user, token) => {
        setAuth({ user_Name: user.user_Name, token });
    }

    const logout = () => {
        setAuth(null);
    }

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setAuth(JSON.parse(storedUser));
        }
    }, [setAuth]);

    useEffect(() => {
        localStorage.setItem('user', JSON.stringify(user));
    }, [user]);

    const isAdmin = user && user.role_Name === 'Admin';

    return (
        <AuthContext.Provider value={{ user, setAuth, login, logout, isAdmin }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;
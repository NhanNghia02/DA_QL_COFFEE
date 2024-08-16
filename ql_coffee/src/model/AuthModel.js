import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from './Firebase-config';
import { onAuthStateChanged } from 'firebase/auth';

const setUserInLocalStorage = (user) => {
    if (user) {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 1);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('userExpiration', expirationDate.toISOString());
    } else {
        localStorage.removeItem('user');
        localStorage.removeItem('userExpiration');
    }
};

const getUserFromLocalStorage = () => {
    const user = localStorage.getItem('user');
    const expiration = localStorage.getItem('userExpiration');
    
    if (!user || !expiration) return null;

    const expirationDate = new Date(expiration);
    if (new Date() > expirationDate) {
        localStorage.removeItem('user');
        localStorage.removeItem('userExpiration');
        return null;
    }

    return JSON.parse(user);
};

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(getUserFromLocalStorage());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            setCurrentUser(user);
            setUserInLocalStorage(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

export { setUserInLocalStorage };

// contexts/AuthContext.tsx
"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { auth } from "@/firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";

interface AuthContextType {
    user: User | null;
}

const AuthContext = createContext<AuthContextType>({ user: null });

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
        });
        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

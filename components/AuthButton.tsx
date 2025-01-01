"use client";
import './layout/header/header.scss';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/firebaseConfig"; // Import Firebase config
import { onAuthStateChanged, signOut } from "firebase/auth";

const AuthButton = () => {
    const [user, setUser] = useState<any | null>(null);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            router.push("/");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <button
            className='header__nav-button'
            onClick={user ? handleLogout : () => router.push("/login")}
        >
            <span className='header__nav-text'>
                {user ? "Logout" : "Login"}
            </span>
        </button>
    );
};

export default AuthButton;




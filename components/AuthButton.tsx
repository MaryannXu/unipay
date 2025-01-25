"use client";
import './layout/header/header.scss';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useAuth } from "@/app/AuthContext";

const AuthButton = () => {
    const { user } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push("/");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const handleLogin = () => {
        router.push("/login");
    };

    return (
        <button
            className='header__nav-button'
            onClick={user ? handleLogout : handleLogin}
        >
            <span className='header__nav-text'>
                {user ? "Logout" : "Login"}
            </span>
        </button>
    );
};

export default AuthButton;




"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/firebaseConfig"; // Import Firebase config
import {
    GoogleAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
} from "firebase/auth";
import "@/styles/login.scss";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const router = useRouter();

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            router.push("/dashboard");
        } catch (error: any) {
            console.error("Google Sign-In failed", error);
            setErrorMessage("Google Sign-In failed.");
        }
    };

    const handleEmailLogin = async () => {
        setErrorMessage("");

        if (!email || !password) {
            setErrorMessage("Please fill out all fields.");
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push("/dashboard");
        } catch (error: any) {
            console.error("Email/Password Login failed", error);
            setErrorMessage(
                "Invalid username or password. Please try again."
            );
        }
    };

    const handleRegister = async () => {
        setErrorMessage("");

        if (!email || !password) {
            setErrorMessage("Please fill out all fields.");
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            router.push("/dashboard");
        } catch (error: any) {
            console.error("Registration failed", error);
            setErrorMessage("Registration failed. Please try again.");
        }
    };

    return (
        <div className="login-container">
            <h1>{isRegistering ? "Register" : "Login"}</h1>

            <div className="login-section">
                {errorMessage && <p className="error-message">{errorMessage}</p>}

                <div className="login-form">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                        onClick={isRegistering ? handleRegister : handleEmailLogin}
                        className="primary-button"
                    >
                        {isRegistering ? "Register" : "Login"}
                    </button>
                </div>

                <button onClick={handleGoogleLogin} className="google-button">
                    Sign in with Google
                </button>
            </div>

            <p onClick={() => setIsRegistering(!isRegistering)} className="toggle-link">
                {isRegistering
                    ? "Already have an account? Login"
                    : "Don't have an account? Register"}
            </p>
            {isRegistering && (
                <p onClick={() => router.push("/eligibility")} className="eligible-link">
                    Not sure if you are eligible? Check here
                </p>
            )}
        </div>
    );
};

export default Login;

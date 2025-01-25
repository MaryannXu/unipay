// "use client";
//
// import React, { useState, useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { auth } from "@/firebaseConfig";
// import {
//     GoogleAuthProvider,
//     signInWithPopup,
//     signInWithEmailAndPassword,
//     createUserWithEmailAndPassword,
//     getAdditionalUserInfo, // <-- Import helper
//     UserCredential,
//     AdditionalUserInfo,
// } from "firebase/auth";
// import "@/styles/login.scss";
// import Image from "next/image";
// import googleLogo from "@/public/img/google-logo.png";
//
// const Login = () => {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [isRegistering, setIsRegistering] = useState(false);
//     const [errorMessage, setErrorMessage] = useState<string>("");
//     const router = useRouter();
//     const searchParams = useSearchParams();
//     const registeringParam = searchParams.get("registering");
//
//     useEffect(() => {
//         if (registeringParam === "true") {
//             setIsRegistering(true);
//         }
//     }, [registeringParam]);
//
//     const handleGoogleLogin = async () => {
//         const provider = new GoogleAuthProvider();
//         try {
//             // Sign in the user
//             const userCredential = await signInWithPopup(auth, provider);
//
//             // Extract the AdditionalUserInfo object
//             const additionalUserInfo = getAdditionalUserInfo(userCredential);
//
//             console.log("Full UserCredential:", userCredential);
//             console.log("AdditionalUserInfo:", additionalUserInfo);
//
//             // Check if the user is new
//             if (additionalUserInfo?.isNewUser) {
//                 console.log("New user - redirecting to /loan-application");
//                 router.push("/loan-application");
//             } else {
//                 console.log("Existing user - redirecting to /dashboard");
//                 //TEMP TEMP TEMP TEMP TEMP TEMP
//                 //router.push("/loan-application");
//                 router.push("/dashboard");
//             }
//         } catch (error: any) {
//             console.error("Google Sign-In failed", error);
//             setErrorMessage("Google Sign-In failed.");
//         }
//     };
//
//
//     const handleEmailLogin = async () => {
//         setErrorMessage("");
//
//         if (!email || !password) {
//             setErrorMessage("Please fill out all fields.");
//             return;
//         }
//
//         try {
//             await signInWithEmailAndPassword(auth, email, password);
//             router.push("/dashboard");
//         } catch (error: any) {
//             console.error("Email/Password Login failed", error);
//             setErrorMessage("Invalid username or password. Please try again.");
//         }
//     };
//
//     const handleRegister = async () => {
//         setErrorMessage("");
//
//         if (!email || !password) {
//             setErrorMessage("Please fill out all fields.");
//             return;
//         }
//
//         try {
//             await createUserWithEmailAndPassword(auth, email, password);
//             router.push("/loan-application");
//         } catch (error: any) {
//             console.error("Registration failed", error);
//             setErrorMessage("Registration failed. Please try again.");
//         }
//     };
//
//     return (
//         <div className="login-container">
//             <h1>{isRegistering ? "Register" : "Login"}</h1>
//
//             <div className="login-section">
//                 {errorMessage && <p className="error-message">{errorMessage}</p>}
//
//                 <div className="login-form">
//                     <input
//                         type="email"
//                         placeholder="Email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                     />
//
//                     <input
//                         type="password"
//                         placeholder="Password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                     />
//
//                     <button
//                         onClick={isRegistering ? handleRegister : handleEmailLogin}
//                         className="primary-button"
//                     >
//                         {isRegistering ? "Register" : "Login"}
//                     </button>
//                 </div>
//
//                 <button onClick={handleGoogleLogin} className="google-button">
//                     <Image className="google-logo" src={googleLogo} alt="Google" />
//                     Sign in with Google
//                 </button>
//             </div>
//
//             <p onClick={() => setIsRegistering(!isRegistering)} className="toggle-link">
//                 {isRegistering
//                     ? "Already have an account? Login"
//                     : "Don't have an account? Register"}
//             </p>
//             {isRegistering && (
//                 <p onClick={() => router.push("/eligibility")} className="eligible-link">
//                     Not sure if you are eligible? Check here
//                 </p>
//             )}
//         </div>
//     );
// };
//
// export default Login;



"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth } from "@/firebaseConfig";
import {
    GoogleAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    getAdditionalUserInfo,
} from "firebase/auth";
import "@/styles/login.scss";
import Image from "next/image";
import googleLogo from "@/public/img/google-logo.png";

export const dynamic = "force-dynamic";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const registeringParam = searchParams.get("registering");

    useEffect(() => {
        if (registeringParam === "true") {
            setIsRegistering(true);
        }
    }, [registeringParam]);

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const userCredential = await signInWithPopup(auth, provider);
            const additionalUserInfo = getAdditionalUserInfo(userCredential);

            if (additionalUserInfo?.isNewUser) {
                router.push("/loan-application");
            } else {
                router.push("/dashboard");
            }
        } catch (error: any) {
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
            setErrorMessage("Invalid username or password. Please try again.");
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
            router.push("/loan-application");
        } catch (error: any) {
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
                    <Image className="google-logo" src={googleLogo} alt="Google" />
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

export default function SuspenseWrapper() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Login />
        </Suspense>
    );
}

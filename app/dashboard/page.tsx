"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/firebaseConfig"; // Firebase config

const Dashboard = () => {
    const router = useRouter();

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) {
            router.push("/login"); // Redirect to login if user is not authenticated
        }
    }, [router]);

    return (
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <h1>Welcome to Your Dashboard</h1>
            <p>This page is only accessible to logged-in users.</p>
        </div>
    );
};

export default Dashboard;

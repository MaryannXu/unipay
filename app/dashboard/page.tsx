"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { auth, db } from "@/firebaseConfig";
import {
    collection,
    getDocs,
    doc,
    getDoc,
    DocumentData,
} from "firebase/firestore";
import Link from "next/link";
import "@/styles/dashboard.scss";
import { SettingsContent } from "./settings/page";
import { HomeContent } from "./user-information/page";

// A simple "menu" enumeration to track which sidebar tab is active
type MenuOption = "home" | "tasks" | "payments" | "applications" | "balance" | "product" | "settings";

const DashboardPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const product = searchParams.get("product");

    const [selectedProduct, setSelectedProduct] = useState<string>();
    const [selectedMenu, setSelectedMenu] = useState<MenuOption>("home");
    const [loading, setLoading] = useState<boolean>(true);

    // Store the list of applications from Firestore
    const [applications, setApplications] = useState<DocumentData[]>([]);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (!user) {
                router.push("/login");
            } else {
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, [router]);

    // Set product as the active menu item if it exists in the URL
    useEffect(() => {
        if (product && ["credit", "lending", "banking"].includes(product)) {
            handleMenuClick("product")
            setSelectedProduct(product);
        }
    }, [product]);
    useEffect(() => {
        if (pathname === "/dashboard/settings") {
            setSelectedMenu("settings");
        } else if (pathname === "/dashboard") {
            // Default selection for main dashboard
            setSelectedMenu("home");
        }
    }, [pathname]);

    // Whenever user clicks menu options or navigates to Applications,
    // fetch all docs from /users/<uid>/loanApplications
    // if user on product or settings switch to /dashboard
    const handleMenuClick = async (option: MenuOption) => {
        setSelectedMenu(option);
        if ((option !== "product" && searchParams.has("product")) || 
        (option !== "settings" && searchParams.has("settings"))) {
            router.push("/dashboard"); // Resets the URL to clean state
        }
        
        if (option === "applications") {
            const user = auth.currentUser;
            if (!user) return;

            const colRef = collection(db, "users", user.uid, "loanApplications");
            const snap = await getDocs(colRef);
            const apps: DocumentData[] = [];
            snap.forEach((doc) => {
                apps.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });
            setApplications(apps);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="dashboard-container">
            {/* LEFT SIDEBAR */}
            <aside className="dashboard-sidebar">
                <nav className="sidebar-nav">
                    <button
                        className={selectedMenu === "home" ? "active" : ""}
                        onClick={() => handleMenuClick("home")}
                    >
                        Home
                    </button>
                    <button
                        className={selectedMenu === "tasks" ? "active" : ""}
                        onClick={() => handleMenuClick("tasks")}
                    >
                        Tasks
                    </button>
                    <button
                        className={selectedMenu === "payments" ? "active" : ""}
                        onClick={() => handleMenuClick("payments")}
                    >
                        Payments
                    </button>
                    <button
                        className={selectedMenu === "applications" ? "active" : ""}
                        onClick={() => handleMenuClick("applications")}
                    >
                        Applications
                    </button>
                    <button
                        className={selectedMenu === "balance" ? "active" : ""}
                        onClick={() => handleMenuClick("balance")}
                    >
                        Balance
                    </button>
                </nav>
            </aside>

            {/* MAIN CONTENT */}
            <main className="dashboard-main">
                {selectedMenu === "home" && (
                    <div className="dashboard-home">
                        <h2>Welcome to Your Dashboard</h2>
                        <p>This page is only accessible to logged-in users.</p>
                        {/* Example "Balance" card, etc. */}
                        <div className="balance-card">
                            <h3>Your Financial Health</h3>
                            <HomeContent/>
                        </div>
                    </div>
                )}

                {selectedMenu === "tasks" && (
                    <div className="dashboard-tasks">
                        <h2>Tasks</h2>
                        <p>Manage your tasks here.</p>
                    </div>
                )}

                {selectedMenu === "payments" && (
                    <div className="dashboard-payments">
                        <h2>Payments</h2>
                        <p>Manage your payments here.</p>
                    </div>
                )}

                {selectedMenu === "applications" && (
                    <div className="dashboard-applications">
                        <h2>My Applications</h2>

                        {/* Render existing apps from Firestore */}
                        <div className="application-cards">
                            {applications.map((app) => (
                                <div key={app.id} className="application-card">
                                    <h3>{app.step4currentUniversityName || "Untitled Application"}</h3>
                                    <p>Status: {app.step0Verified ? "Complete" : "Incomplete"}</p>
                                    <p>Amount: US ${app.step1totalAcademicFunding || "N/A"}</p>
                                    <button
                                        onClick={() => router.push(`/applications/${app.id}`)}
                                    >
                                        View Summary
                                    </button>
                                </div>
                            ))}

                            {/* Add a new application card */}
                            <div className="application-card add-new">
                                <h3>Add another application</h3>
                                <p>Submit a new loan application form</p>
                                <button onClick={() => router.push("/loan-application")}>
                                    + New Application
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {/* Current balance of loans */}
                {selectedMenu === "balance" && (
                    <div className="dashboard-balance">
                        <h2>Balance</h2>
                        <p>View your balances here.</p>
                    </div>
                )}
                
                {/* Credit, Lending and Banking discover pages */}
                {selectedMenu === "product" && selectedProduct === "credit" && (
                    <div className="dashboard-balance">
                        <h2>Credit</h2>
                        <p>enter function here</p>
                    </div>
                )}
                {selectedMenu === "product" && selectedProduct === "lending" && (
                    <div className="dashboard-balance">
                        <h2>Lending</h2>
                        <p>enter function here</p>
                    </div>
                )}
                {selectedMenu === "product" && selectedProduct === "banking" && (
                    <div className="dashboard-balance">
                        <h2>Banking</h2>
                        <p>enter function here</p>
                    </div>
                )}

                {/* User Settings */}
                {selectedMenu === "settings" && (
                    <div className="dashboard-balance">
                        <h2>Settings</h2>
                        <SettingsContent/>
                    </div>
                )}

               
               
            </main>
        </div>
    );
};

export default DashboardPage;


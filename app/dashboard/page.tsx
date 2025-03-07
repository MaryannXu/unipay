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
import { Services } from "./products/page";

// A simple "menu" enumeration to track which sidebar tab is active
type MenuOption = "home" | "my services" | "lending" | "credit" | "banking" | "product" | "settings";

const DashboardPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const product = searchParams.get("product");

    const [selectedProduct, setSelectedProduct] = useState<string>();
    const [selectedMenu, setSelectedMenu] = useState<MenuOption>("home");
    const [loading, setLoading] = useState<boolean>(true);

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
                        className={selectedMenu === "lending" ? "active" : ""}
                        onClick={() => handleMenuClick("lending")}
                    >
                        Lending
                    </button>
                    <button
                        className={selectedMenu === "credit" ? "active" : ""}
                        onClick={() => handleMenuClick("credit")}
                    >
                        Credit
                    </button>
                    <button
                        className={selectedMenu === "banking" ? "active" : ""}
                        onClick={() => handleMenuClick("banking")}
                    >
                        Banking
                    </button>
                    <button
                        className={selectedMenu === "my services" ? "active" : ""}
                        onClick={() => handleMenuClick("my services")}
                    >
                        My Services
                    </button>
                    <button
                        className={selectedMenu === "settings" ? "active" : ""}
                        onClick={() => handleMenuClick("settings")}
                    >
                        Settings
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
                        <div className="dashboard-section">
                            <h3>Your Financial Health</h3>
                            <HomeContent/>
                        </div>
                    </div>
                )}

                {selectedMenu === "my services" && (
                    <div className="dashboard-Credit">
                        <h2>Credit</h2>
                        <p>Manage your Credit here.</p>
                    </div>
                )}


                {/* Credit, Lending and Banking discover pages */}
                {selectedMenu === "credit" && (
                    <div className="dashboard-balance">
                        <h2>Credit</h2>
                    <p>enter function here</p>
                </div>
                )}
                {selectedMenu === "lending" && (
                    
                    <Services product={"lending"}/>
                )}
                {selectedMenu === "banking" && (
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


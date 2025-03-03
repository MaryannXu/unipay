"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "@/styles/settings.scss";
import { auth, db } from "@/firebaseConfig";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import {
    collection,
    getDocs,
    doc,
    getDoc,
    DocumentData,
} from "firebase/firestore";
import DashboardPage from "../page";


export function SettingsContent(){ 
    const [settingsFields, setSettingsFields] = useState<{ name: string; email: string }>({
        name: "Unknown",
        email: "No email available"
    });
    {/* Retrieve username, email and name */}
    useEffect(() => {
        const handleSettingsFields = async () => {
            const user = auth.currentUser;
            if (!user) return;

            setSettingsFields({
                name: user.displayName || "No name available",
                email: user.email || "No email available"
            });
        };

        handleSettingsFields();
    }, []);
    
    return( 
        <div> 
            <h3>Name: {settingsFields.name}</h3>
            <p>Email: {settingsFields.email}</p>
        </div>
    ) }

export default function Setttings() {
    const router = useRouter();
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

    
    return (
        <>
       <DashboardPage/>
        </>
    );
}

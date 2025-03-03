"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import DashboardPage from "../dashboard/page";



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
        <div>
            <p>contact section specifically for people signed in</p>
            <p>modify navigation.tsx such that user can go back to dashboard</p>

        </div>
        </>
    );
}

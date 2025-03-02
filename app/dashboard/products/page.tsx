"use client"; 

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/firebaseConfig";
import DashboardPage from "../page";

export default function Products() { 
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(true);

    type MenuOption = "home" | "tasks" | "payments" | "applications" | "balance";

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
    

    return(
        <>
        <DashboardPage/>
        </>
    )
}
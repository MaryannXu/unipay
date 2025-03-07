"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import scoreDescriptions from "@/public/credit-status/scoreDescriptions.json";
import "@/styles/home_page.scss";
import { auth, db } from "@/firebaseConfig";
import { motion } from "framer-motion";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import {
    collection,
    getDocs,
    doc,
    getDoc,
} from "firebase/firestore";
import DashboardPage from "../page";


const creditFactors = [
    { label: "New Credit", weight: "10%", statusKey: "new_credit_status" },
    { label: "Amounts Owed", weight: "30%", statusKey: "credit_utilization_status" },
    { label: "Length of Credit History", weight: "15%", statusKey: "credit_history_status" },
    { label: "Credit Mix", weight: "10%", statusKey: "credit_mix_status" },
    { label: "Payment History", weight: "35%", statusKey: "payment_history_status" },
];

export function HomeContent(){ 
    const [creditScoreFields, setCreditScoreFields] =useState({
        credit_history_score: 0,
        credit_utilization_status: 0,
        credit_history_status: 0,
        new_credit_status: 0,
        credit_mix_status: 0,
        ficoScore: 0,
    });
    const [hoveredId, setHoveredId] = useState<number | null>(null);

    const getFicoScoreCategory = (score) => {
        if (score < 500) return "Poor";
        if (score >= 500 && score < 750) return "Mediocre";
        if (score >= 750) return "Good";
        return "Unknown";
    };
    
    {/* Retrieve username, email and name */}
    useEffect(() => {
        const fetchCreditScoreData = async () => {
            const user = auth.currentUser;
            if (!user) return;

            try {
                const docRef = collection(db, "users", user.uid, "creditScoreResponses");
                const querySnapshot = await getDocs(docRef);
                
                const allData = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    allData.push({
                        id: doc.id,
                        ...data
                    });

                    if (allData.length === 1) {
                        setCreditScoreFields({
                            credit_history_score: data.fico_score_data?.credit_history_score || 0,
                            credit_mix_status: data.fico_score_data?.credit_mix_score || 0,
                            credit_utilization_status: data.fico_score_data?.credit_utilization_score || 0,
                            new_credit_status: data.fico_score_data?.credit_utilization_score || 0,
                            credit_history_status: data.fico_score_data?.credit_history_status || 0,
                            ficoScore: data.fico_score_data?.ficoScore || 0,
                        });
                    }
                });
            } catch (error) {
                console.error("Error fetching credit score data:", error);
            }
        };

        fetchCreditScoreData();
    }, []);
    

    return (
        <ul className="credit-advice-container">
        {creditFactors.map((factor, index) => {
            const scoreCategory = getFicoScoreCategory(creditScoreFields.ficoScore);

            return (
                <motion.li 
                    key={index}
                    className="credit-advice-item"
                    onMouseEnter={() => setHoveredId(index)}
                    onMouseLeave={() => setHoveredId(null)}
                    animate={{
                        flex: hoveredId === index ? 2 : 1, // Expands when hovered
                        backgroundColor: hoveredId === index ? "#e1e1e1" : "#f3f3f3",
                        transition: { duration: 0.3, ease: "easeInOut" }
                    }}
                >
                    <p
                        className="credit-status"
                       // style={{ color: scoreCategory === "Good" ? "green" : scoreCategory === "Mediocre" ? "orange" : "red" }}
                    >
                        {factor.label}
                    </p>
                    <motion.div 
                        className="advice-content-wrapper"
                        initial={{ opacity: 0, height: 0}}
                        animate={{ opacity: hoveredId === index ? 1 : 0, height: hoveredId === index ? "auto" : 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <motion.p 
                            className="advice-content"
                            initial={{ opacity: 0,height: 0, y: -10 }}
                            animate={{ opacity: hoveredId === index ? 1 : 0, height: hoveredId === index ? "auto" : 0, y: hoveredId === index ? 0 : -10 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                            {scoreDescriptions[factor.label as keyof typeof scoreDescriptions]?.[scoreCategory as keyof typeof scoreDescriptions[keyof typeof scoreDescriptions]]} 
                        </motion.p>  
                    </motion.div>
                    
                </motion.li>
            );
        })}
    </ul>
    );
}

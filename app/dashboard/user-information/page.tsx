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
} from "firebase/firestore";
import DashboardPage from "../page";


export function HomeContent(){ 
    const [creditScoreFields, setCreditScoreFields] =useState({
        credit_history_score: 0,
        credit_mix_score: 0,
        credit_utilization_score: 0,
        ficoScore: 0,
    });
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
                            credit_mix_score: data.fico_score_data?.credit_mix_score || 0,
                            credit_utilization_score: data.fico_score_data?.credit_utilization_score || 0,
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


  
    
    return( 
        <div>
            <h1>Credit Score Data</h1>
            <p>Credit History Score: {creditScoreFields.credit_history_score}</p>
            <p>Credit Mix Score: {creditScoreFields.credit_mix_score}</p>
            <p>Credit Utilization Score: {creditScoreFields.credit_utilization_score}</p>
            <p>FICO Score: {creditScoreFields.ficoScore}</p>
        </div>
    ) }


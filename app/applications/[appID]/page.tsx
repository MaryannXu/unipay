"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { auth, db } from "@/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default function ApplicationSummaryPage() {
    const router = useRouter();
    const params = useParams();
    const appId = params?.appID;
    console.log("params object:", params);
    console.log("appID:", appId);

    const [appData, setAppData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = auth.currentUser;

        // 1) If not logged in, set loading to false, then redirect
        if (!user) {
            setLoading(false);
            router.push("/login");
            return;
        }

        // 2) If no appId, set loading to false, then return
        if (!appId) {
            console.error("No appId found in URL");
            setLoading(false);
            return;
        }

        // 3) Otherwise, fetch Firestore doc
        const fetchApplication = async () => {
            try {
                const docRef = doc(db, `users/${user.uid}/loanApplications/${appId}`);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setAppData(docSnap.data());
                } else {
                    console.error("Document does not exist");
                }
            } catch (error) {
                console.error("Error fetching application doc:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchApplication();
    }, [router, appId]);

    if (loading) {
        return <div>Loading Application Summary...</div>;
    }

    if (!appData) {
        return <div>No data found for this application.</div>;
    }

    // Render the summary
    return (
        <div style={{ margin: "2rem" }}>
            <h1>Application Summary</h1>
            <p><strong>University Name:</strong> {appData.step4currentUniversityName}</p>
            <p><strong>Total Funding:</strong> {appData.step1totalAcademicFunding}</p>
            <p><strong>Visa Status:</strong> {appData.step2visaStatus}</p>

            <button onClick={() => router.push("/dashboard")}>
                Return to Dashboard
            </button>
        </div>
    );
}

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/firebaseConfig";
import {
    collection,
    query,
    orderBy,
    limit,
    getDocs,
    DocumentData,
} from "firebase/firestore";
import "@/styles/loan-offer.scss";

export default function LoanOfferPage() {
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    //store the user’s name (from step2fullNameOnVisa) in this
    const [visaName, setVisaName] = useState<string>("Friend");

    const [feesExpanded, setFeesExpanded] = useState(false);
    const [faqExpanded, setFaqExpanded] = useState(false);

    useEffect(() => {
        //check Auth
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (!user) {
                // Not logged in => redirect
                router.push("/login");
            } else {
                // If we have a user, fetch the most recent application doc
                try {
                    const colRef = collection(db, "users", user.uid, "loanApplications");
                    const qMostRecent = query(colRef, orderBy("createdAt", "desc"), limit(1));
                    const snap = await getDocs(qMostRecent);

                    // If there's at least one doc, grab that data
                    if (!snap.empty) {
                        const latestDoc = snap.docs[0];
                        const data = latestDoc.data() as DocumentData;
                        //user’s name on the Visa is stored at step2fullNameOnVisa
                        if (data.step2fullNameOnVisa) {
                            setVisaName(data.step2fullNameOnVisa);
                        }
                    }
                } catch (error) {
                    console.error("Error fetching most recent loan application:", error);
                }

                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [router]);

    //"Select offer" button
    const handleSelectOffer = () => {
        alert("Offer selected! We’ll begin processing your account information.");
        router.push("/dashboard");
    };

    if (loading) {
        return <div className="loan-offer-loading">Loading...</div>;
    }

    return (
        <div className="loan-offer-container">
            <div className="loan-offer-content">
                <h1 className="loan-offer-heading">
                    Here’s what we can do to help, {visaName}!
                </h1>
                <p className="loan-offer-subtitle">
                    You’re one step closer to getting your degree.
                </p>

                {/* Placeholder Loan Amount */}
                <h2 className="loan-offer-amount-label">Loan Amount:</h2>
                <h1 className="loan-offer-amount-value">$21,600</h1>

                {/* Offer table with placeholders */}
                <div className="loan-offer-table">
                    <div className="loan-offer-table-row">
                        <div className="loan-offer-table-cell">
                            <strong>5 Year</strong>
                            <div>$606.51/mo</div>
                        </div>
                        <div className="loan-offer-table-cell">
                            <strong>APR</strong>
                            <div>26.98%</div>
                        </div>
                        <div className="loan-offer-table-cell">
                            <strong>Loan Amount</strong>
                            <div>$21,600</div>
                        </div>
                        <div className="loan-offer-table-cell">
                            <strong>Origination fee</strong>
                            <div>$1,728.00</div>
                        </div>
                        <div className="loan-offer-table-cell">
                            <strong>You’ll receive</strong>
                            <div>$19,872.00</div>
                        </div>

                        <div className="loan-offer-table-cta">
                            <button onClick={handleSelectOffer} className="select-offer-button">
                                Select offer
                            </button>
                        </div>
                    </div>
                </div>

                <p className="loan-offer-expiration">
                    Your loan rates expire on <strong>February 9, 2025</strong>. Rates and approval
                    depend on verifying your information. We’ll begin processing your account
                    information as soon as you press “select offer” and confirm.
                </p>

                {/* Accordions (with original button styling) */}
                <div className={`loan-offer-accordion ${feesExpanded ? "active" : ""}`}>
                    <button
                        className="loan-offer-accordion-button"
                        onClick={() => setFeesExpanded((prev) => !prev)}
                    >
                        Fees Explained
                    </button>
                    {feesExpanded && (
                        <div className="loan-offer-accordion-content">
                            <p>Origination fees are charged as a percentage of the total loan amount.</p>
                        </div>
                    )}
                </div>

                <div className={`loan-offer-accordion ${faqExpanded ? "active" : ""}`}>
                    <button
                        className="loan-offer-accordion-button"
                        onClick={() => setFaqExpanded((prev) => !prev)}
                    >
                        Have more questions?
                    </button>
                    {faqExpanded && (
                        <div className="loan-offer-accordion-content">
                            <p>
                                We’ve got you covered! You can reach out to our support team at
                                support@example.com or schedule a call to discuss any questions
                                you may have.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

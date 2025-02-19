"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "@/styles/credit-score.scss";
import { auth, db } from "@/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { getDatabase, ref, onValue } from "firebase/database";


const CreditScore = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({
        rent_cost: "",
        ownership_status: "",
        other_ownership_status: "",
        employment_type: "",
        other_employment_type: "",
        total_income: "",
        account_balance: "",
        credit_length: "",
        credit_limit: "",
        credit_line_status: "",
        credit_overdue: "",
        total_loans: "",
        total_credit_cards: "",
    });
    
    
    // Only allow logged‑in users to view this page.
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

    const handleInputChange = (key: string, value: string) => {
        setFormData({ ...formData, [key]: value });
    };

    const handleNext = () => {
        setStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setStep((prev) => prev - 1);
    };

    const [ficoScore, setFicoScore] = useState(null); // State to store fico score
    interface ScoreStatus {
        payment_history_status: string;
        credit_utilization_status: string;
        credit_history_status: string;
        new_credit_status: string;
        credit_mix_status: string;
      }
    const [scoreStatus, setScoreStatus] = useState({
        payment_history_status: "",
        credit_utilization_status: "",
        credit_history_status: "", 
        new_credit_status: "", 
        credit_mix_status: ""
    })
    // send user_id and app_id after reviewing and submitting application
    async function sendApplicationSubmitted(userId: string, appId: string) {
        try {
            const auth = getAuth();
            const user = auth.currentUser;
            
            if (!user) {
                console.error("No authenticated user.");
                return;
            }
            console.log("authenticated user")
            // Get Firebase ID token
            const token = await user.getIdToken(); // Get JWT token
            console.log(token)
            const response = await fetch("/api/fico_score", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,  
                },
                body: JSON.stringify({
                    user_id: userId,
                    app_id: appId,
                }),
            });
    
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    
            const data = await response.json();
            setFicoScore(data?.['fico Score'])
            const scoreData = { 
                payment_history_status: data.payment_history_status, 
                credit_utilization_status: data.credit_utilization_status,
                credit_history_status: data.credit_history_status, 
                new_credit_status: data.new_credit_status, 
                credit_mix_status: data.credit_mix_status
            }   
            setScoreStatus(scoreData)
        
            console.log("Response from server:", data);
        } catch (error) {
            console.error("Error sending application submitted request:", error);
        }
    }
    // Save the ordered responses to Firestore.
    const saveOrderedUserData = async () => {
        const user = auth.currentUser;
        if (!user) {
            console.error("No authenticated user.");
            return;
        }

        try {
            const finalOwnershipStatus =
                formData.ownership_status === "Other"
                    ? formData.other_ownership_status
                    : formData.ownership_status;
            const finalEmploymentType =
                formData.employment_type === "Other"
                    ? formData.other_employment_type
                    : formData.employment_type;

            const orderedResponses = [
                { rent_cost: formData.rent_cost },
                { ownership_status: finalOwnershipStatus },
                { employment_type: finalEmploymentType },
                { total_income: formData.total_income },
                { account_balance: formData.account_balance },
                { credit_length: formData.credit_length },
                { credit_limit: formData.credit_limit },
                { credit_line_status: formData.credit_line_status },
                { credit_overdue: formData.credit_overdue },
                { total_loans: formData.total_loans },
                { total_credit_cards: formData.total_credit_cards },
            ];

            const docRef = await addDoc(collection(db, "users", user.uid, "creditScoreResponses"), {
                responses: orderedResponses,
                timestamp: new Date(),
            });
            setStep((prev) => prev + 1); // Increment the step
            if (docRef && docRef.id) { // Check if document reference and ID exist
                sendApplicationSubmitted(user.uid, docRef.id); // Call the function
                
            } else {
                console.error("Document creation failed. No ID returned.");
            }
        } catch (error) {
            console.error("Error saving credit score data:", error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }


    return (
        <div className="credit-score-container">
            <div className="credit-score-section">
                {step === 0 && (
                    <div>
                        <h1 className="highlight">Credit Score Information</h1>
                        <p>Please provide your housing information below.</p>
                        <label>
                            How much do you typically pay for rent each month?
                        </label>
                        <input
                            type="number"
                            placeholder="Enter rent cost"
                            className="text-input"
                            value={formData.rent_cost}
                            onChange={(e) => handleInputChange("rent_cost", e.target.value)}
                        />
                        <label>
                            Do you rent, own your home, or live with family/friends?
                        </label>
                        <select
                            className="text-input"
                            value={formData.ownership_status}
                            onChange={(e) =>
                                handleInputChange("ownership_status", e.target.value)
                            }
                        >
                            <option value="">Select</option>
                            <option value="Rent">Rent</option>
                            <option value="Own your home">Own your home</option>
                            <option value="Live with family/friends">
                                Live with family/friends
                            </option>
                            <option value="Other">Other</option>
                        </select>
                        {formData.ownership_status === "Other" && (
                            <div>
                                <input
                                    type="text"
                                    placeholder="Please specify other ownership status"
                                    className="text-input"
                                    value={formData.other_ownership_status}
                                    onChange={(e) =>
                                        handleInputChange("other_ownership_status", e.target.value)
                                    }
                                />
                            </div>
                        )}
                        <div className="navigation-buttons">
                            <button className="next-button" onClick={handleNext}>
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {step === 1 && (
                    <div>
                        <h1 className="highlight">Income Information</h1>
                        <label>
                            What type of employment are you currently in? (e.g., full-time,
                            part-time, student job, etc.)
                        </label>
                        <select
                            className="text-input"
                            value={formData.employment_type}
                            onChange={(e) =>
                                handleInputChange("employment_type", e.target.value)
                            }
                        >
                            <option value="">Select</option>
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Student job">Student job</option>
                            <option value="Other">Other</option>
                        </select>
                        {formData.employment_type === "Other" && (
                            <div>
                                <input
                                    type="text"
                                    placeholder="Please specify other employment type"
                                    className="text-input"
                                    value={formData.other_employment_type}
                                    onChange={(e) =>
                                        handleInputChange("other_employment_type", e.target.value)
                                    }
                                />
                            </div>
                        )}
                        <label>
                            What’s your total monthly income (before taxes)?
                        </label>
                        <input
                            type="number"
                            placeholder="Enter total income"
                            className="text-input"
                            value={formData.total_income}
                            onChange={(e) =>
                                handleInputChange("total_income", e.target.value)
                            }
                        />
                        <div className="navigation-buttons">
                            <button className="back-button" onClick={handleBack}>
                                Go Back
                            </button>
                            <button className="next-button" onClick={handleNext}>
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <h1 className="highlight">Account Balance</h1>
                        <label>
                            What’s the current balance in your primary bank account?
                        </label>
                        <input
                            type="number"
                            placeholder="Enter account balance"
                            className="text-input"
                            value={formData.account_balance}
                            onChange={(e) =>
                                handleInputChange("account_balance", e.target.value)
                            }
                        />
                        <div className="navigation-buttons">
                            <button className="back-button" onClick={handleBack}>
                                Go Back
                            </button>
                            <button className="next-button" onClick={handleNext}>
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div>
                        <h1 className="highlight">Credit History</h1>
                        <label>
                            How long have you had credit accounts (e.g., credit cards, loans)?
                        </label>
                        <select
                            className="text-input"
                            value={formData.credit_length}
                            onChange={(e) =>
                                handleInputChange("credit_length", e.target.value)
                            }
                        >
                            <option value="">Select</option>
                            <option value="< 1">&lt; 1 year</option>
                            {Array.from({ length: 20 }, (_, i) => i + 1).map((year) => (
                                <option key={year} value={year}>
                                    {year} {year === 1 ? "year" : "years"}
                                </option>
                            ))}
                        </select>
                        <label>
                            What’s the total credit limit on all your credit cards and lines
                            of credit?
                        </label>
                        <input
                            type="number"
                            placeholder="Enter credit limit"
                            className="text-input"
                            value={formData.credit_limit}
                            onChange={(e) =>
                                handleInputChange("credit_limit", e.target.value)
                            }
                        />
                        <label>
                            Have any of your credit lines been closed or suspended recently?
                        </label>
                        <select
                            className="text-input"
                            value={formData.credit_line_status}
                            onChange={(e) =>
                                handleInputChange("credit_line_status", e.target.value)
                            }
                        >
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                        <label>
                            Do you currently have any overdue payments on your credit accounts?
                        </label>
                        <select
                            className="text-input"
                            value={formData.credit_overdue}
                            onChange={(e) =>
                                handleInputChange("credit_overdue", e.target.value)
                            }
                        >
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                        <label>
                            How many active loans (e.g., student loans, car loans) do you have
                            right now?
                        </label>
                        <input
                            type="number"
                            placeholder="Enter number of loans"
                            className="text-input"
                            value={formData.total_loans}
                            onChange={(e) =>
                                handleInputChange("total_loans", e.target.value)
                            }
                        />
                        <label>
                            How many active credit cards do you have
                            right now?
                        </label>
                        <input
                            type="number"
                            placeholder="Enter number of credit lines"
                            className="text-input"
                            value={formData.total_credit_cards}
                            onChange={(e) =>
                                handleInputChange("total_credit_cards", e.target.value)
                            }
                        />
                        <div className="navigation-buttons">
                            <button className="back-button" onClick={handleBack}>
                                Go Back
                            </button>
                            <button className="next-button" onClick={handleNext}>
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div>
                        <h1 className="highlight">Review and Submit</h1>
                        <p>
                            Please review your information and click "Finish" to submit.
                        </p>
                        <div className="navigation-buttons">
                            <button className="back-button" onClick={handleBack}>
                                Go Back
                            </button>
                            <button className="next-button" onClick={saveOrderedUserData}>
                                Finish
                            </button>
                        </div>
                    </div>
                )}

                {step === 5 && (
                    <div className="final-credit-score-container">
                        {(() => {
                            const maxScore = 850;
                            const score = ficoScore ?? 0 ;
                            const ratio = score / maxScore;      // ~0.88
                            // At ratio=0 => degrees=90°, ratio=1 => degrees=270°
                            const degrees = 90 + 180 * ratio;
                            const getFicoScoreCategory = (score: number): string => {
                                if (score < 500) return "Poor";
                                if (score >= 500 && score < 750) return "Mediocre";
                                if (score >= 750) return "Good";
                                return "Unknown"; // Default case for unexpected values
                              };
                            

                            return (
                                <>
                                    <h1 className="credit-health-title">Credit Health</h1>
                                    <h2 className="credit-score-subtitle">
                                        {score} out of {maxScore}
                                    </h2>

                                    <div className="credit-score-content">
                                        <div className="score-gauge">
                                            {/* 1) Container is half-circle shape (150x75) */}
                                            <div className="gauge-container">
                                                {/* 2) Full circle with conic gradient */}
                                                <div
                                                    className="gauge"
                                                    style={{ "--progress": `${degrees}deg` } as React.CSSProperties}
                                                />
                                                {/* 3) Score text centered on top */}
                                                <div className="gauge-score">{score === 0 ? "..." : score}</div>
                                            </div>

                                            <p className="score-text">
                                                FICO SCORE
                                                <br />
                                                {getFicoScoreCategory(score)}
                                            </p>
                                        </div>

                                        {/* Right side: Credit factors, disclaimers, etc. */}
                                        <div className="credit-factors">
                                            <h3>Credit Factors</h3>
                                            <p>
                                                Dig into your credit card and payment history first. You can improve those factors quickly.
                                            </p>
                                            <ul>
                                                <li><span>New Credit</span><span>10%</span></li>
                                                <p style={{ color: scoreStatus.new_credit_status !== "Good" ? "red" : "green" }}>
                                                    {scoreStatus.new_credit_status}
                                                </p>
                                                <li><span>Amounts Owed</span><span>30%</span></li>
                                                <p style={{ color: scoreStatus.credit_utilization_status !== "Good" ? "red" : "green" }}>
                                                    {scoreStatus.credit_utilization_status}
                                                </p>
                                                <li><span>Length of Credit History</span><span>15%</span></li>
                                                <p style={{ color: scoreStatus.credit_history_status !== "Good" ? "red" : "green" }}> 
                                                    {scoreStatus.credit_history_status}
                                                </p>
                                                <li><span>Credit Mix</span><span>10%</span></li>
                                                <p style={{ color: scoreStatus.credit_mix_status !== "Good" ? "red" : "green" }}>
                                                    {scoreStatus.credit_mix_status}
                                                </p>
                                                <li><span>Payment History</span><span>35%</span></li>
                                                <p style={{ color: scoreStatus.payment_history_status !== "Good" ? "red" : "green" }}>
                                                    {scoreStatus.payment_history_status}
                                                </p>
                                            </ul>
                                            <p className="disclaimer">
                                                In no way is this a precise reflection of the actual FICO/Vantage score. This is strictly
                                                for demonstration purposes and does not represent any form of financial equivalence.
                                            </p>
                                        </div>
                                    </div>

                                    <button className="first-back-button" onClick={() => router.push("/")}>
                                        Return to Home
                                    </button>
                                </>
                            );
                        })()}
                    </div>
                )}


            </div>
        </div>
    );
};

export default CreditScore;


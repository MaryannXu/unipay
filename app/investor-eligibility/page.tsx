"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import "@/styles/investor-eligibility.scss";

/**
 *   Step 0: Are you an individual or institutional investor?
 *   Step 1: Are you an accredited investor?
 *   Step 2: What type of account do you want to open?
 *   Step 3: Congrats / Not Eligible final page
 */

const InvestorEligibility: React.FC = () => {
    const router = useRouter();
    const { width, height } = useWindowSize();

    const [step, setStep] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);
    const [isEligible, setIsEligible] = useState<boolean | null>(null);

    // Store user answers here
    const [formData, setFormData] = useState({
        investorType: "",    // "Individual" or "Institution"
        accreditation: "",   // "200k" | "1M" | "seriesLicense" | "anotherWay" | "none"
        accountType: "",     // "Individual" | "Joint" | "Retirement" | "Entity"
    });

    // Navigation between steps
    const handleNext = () => {
        // Evaluate on last step before going to final screen
        if (step === 2) evaluateEligibility();
        setStep(step + 1);
    };

    const handleBack = () => setStep(step - 1);

    // Update a single field in formData
    const handleInputChange = (key: string, value: string) => {
        setFormData({ ...formData, [key]: value });
    };

    // Simple eligibility check:
    // If accreditation == "none", user is not eligible; otherwise they are eligible.
    const evaluateEligibility = () => {
        setIsEligible(formData.accreditation !== "none");
    };

    // Show confetti on final step if user is eligible
    useEffect(() => {
        if (step === 4 && isEligible) {
            setShowConfetti(true);
            const timeout = setTimeout(() => setShowConfetti(false), 4000);
            return () => clearTimeout(timeout);
        }
    }, [step, isEligible]);

    return (
        <div className="investor-eligibility-container">
            
            <div className="investor-eligibility-section">
            <AnimatePresence mode="wait">
            <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="step-container"
                >
                {/**
                 * STEP 0
                 */}
                {step === 0 && (
                    <div>
                        <h1>What type of company are you?</h1>
                        <p>Lending service, banking, credit?</p>
                        <div className="options">
                            {["Lending", "Banking", "Credit", "Other"].map((option) => (
                                <button
                                    key={option}
                                    className="option-button"
                                    onClick={() => {
                                        handleInputChange("investorType", option);
                                        handleNext();
                                    }}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                        <div className="navigation-buttons">
                            <button
                                className="back-button"
                                onClick={() => router.push("/")} // If user wants to exit
                            >
                                Go Back
                            </button>
                        </div>
                    </div>
                )}

                {/**
                 * STEP 1
                 */}
                {step === 1 && (
                    <div>
                        <h1>Are you a licensed financial institution</h1>
                        <p>To ensure the safety of UniPay and it's members, we need to make sure you're legit.</p>
                        <div className="options">
                            {["Yes", "No"].map((option) => (
                                <button
                                    key={option}
                                    className="option-button"
                                    onClick={() => {
                                        handleInputChange("investorType", option);
                                        handleNext();
                                    }}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                        <div className="navigation-buttons">
                            <button className="back-button" onClick={handleBack}>
                                Go Back
                            </button>
                        </div>
                    </div>
                )}

                {/**
                 * STEP 2
                 */}
                {step === 2 && (
                    <div>
                        <h1>Why are you interested in partnering with UniPay?</h1>
                        <p>
                            We're here to serve those who lack U.S credit scores by utilizing alternative data. If this interests please continue!
                        </p>
                        <div className="options">
                            <input
                                type="text"
                                className="option-input"
                                placeholder="Enter your response"
                                onChange={(e) => handleInputChange("investorType", e.target.value)}
                            />
                            <button className="option-button" onClick={handleNext}>
                                Next
                            </button>
                        </div>
                        <div className="navigation-buttons">
                            <button className="back-button" onClick={handleBack}>
                                Go Back
                            </button>
                        </div>
                    </div>
                )}
                 {/**
                 * STEP 3
                 */}
                {step === 3 && (
                    <div>
                        <h1>Contact Information</h1>
                        <p>
                            
                        </p>
                        <div className="options">
                        <div className="input-group">
                            <label className="input-label">Company</label>
                            <input
                                type="text"
                                className="option-input"
                                placeholder="company name"
                                onChange={(e) => handleInputChange("investorType", e.target.value)}
                            />
                            <label className="input-label">Name</label>
                            <input
                                type="text"
                                className="option-input"
                                placeholder="your name"
                                onChange={(e) => handleInputChange("investorType", e.target.value)}
                            />
                            <label className="input-label">email</label>
                            <input
                                type="text"
                                className="option-input"
                                placeholder="company email"
                                onChange={(e) => handleInputChange("investorType", e.target.value)}
                            />
                            </div>
                            <button className="option-button" onClick={handleNext}>
                                Next
                            </button>
                        <div className="navigation-buttons">
                            <button className="back-button" onClick={handleBack}>
                                Go Back
                            </button>
                        </div>
                        </div>
                    </div>
                )}

                {/**
                 * STEP 4 (FINAL)
                 */}
                {step === 4 && (
                    <div>
                        {/* If user is eligible, show confetti for a few seconds */}
                        {showConfetti && (
                            <Confetti
                                width={width}
                                height={height}
                                colors={["#1CA76B", "#6FC8AA", "#98D2DC", "#D2DEA5"]}
                            />
                        )}
                        {isEligible ? (
                            <span>
                <h1 className="congrats-decision">
                  Congratulations! We're excited you'd like to work with us.
                </h1>
                <p>We'll be in contact shortly. Feel free to contact us</p>
                <button
                    className="begin-button"
                    onClick={() => router.push("/#contact")}
                >
                  Contact Us
                </button>
              </span>
                        ) : (
                            <span>
                <h1 className="congrats-decision">
                  Sorry, it looks like you are not eligible to invest right now.
                </h1>
                <p>
                  You may still qualify in the future. Contact us for more details
                    <a href="/#contact" className="not-eligible-link">
                    {" "} here
                  </a>
                  .
                </p>
                <button
                    className="begin-button"
                    onClick={() => router.push("/")}
                >
                  Return to Home
                </button>
              </span>
                        )}
                    </div>
                )}
                </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default InvestorEligibility;

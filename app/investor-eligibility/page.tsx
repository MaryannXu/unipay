"use client";

import React, { useState, useEffect } from "react";
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
        if (step === 3 && isEligible) {
            setShowConfetti(true);
            const timeout = setTimeout(() => setShowConfetti(false), 4000);
            return () => clearTimeout(timeout);
        }
    }, [step, isEligible]);

    return (
        <div className="investor-eligibility-container">
            <div className="investor-eligibility-section">
                {/**
                 * STEP 0
                 */}
                {step === 0 && (
                    <div>
                        <h1>Are you an individual or institutional investor?</h1>
                        <p>You can invest as an individual or on behalf of an institution.</p>
                        <div className="options">
                            {["Individual", "Institution"].map((option) => (
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
                        <h1>Are you an accredited investor?</h1>
                        <p>To invest in UniPay, you need to be an accredited investor.</p>
                        <div className="options">
                            {/* Example accredited options. You can adjust these as needed */}
                            <button
                                className="option-button"
                                onClick={() => {
                                    handleInputChange("accreditation", "200k");
                                    handleNext();
                                }}
                            >
                                I earn $200k+ yearly (or $300k+ if filing jointly)
                            </button>
                            <button
                                className="option-button"
                                onClick={() => {
                                    handleInputChange("accreditation", "1M");
                                    handleNext();
                                }}
                            >
                                I have $1M+ in assets, excluding primary residence
                            </button>
                            <button
                                className="option-button"
                                onClick={() => {
                                    handleInputChange("accreditation", "seriesLicense");
                                    handleNext();
                                }}
                            >
                                I hold a current Series 7, 65 or 82 license
                            </button>
                            <button
                                className="option-button"
                                onClick={() => {
                                    handleInputChange("accreditation", "anotherWay");
                                    handleNext();
                                }}
                            >
                                I am accredited in another way
                            </button>
                            <button
                                className="option-button"
                                onClick={() => {
                                    handleInputChange("accreditation", "none");
                                    handleNext();
                                }}
                            >
                                None of the above. I am not accredited
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
                 * STEP 2
                 */}
                {step === 2 && (
                    <div>
                        <h1>What type of account do you want to open?</h1>
                        <p>
                            Your account can be set up as an individual, joint, retirement,
                            or entity.
                        </p>
                        <div className="options">
                            {["Individual", "Joint", "Retirement", "Entity"].map((option) => (
                                <button
                                    key={option}
                                    className="option-button"
                                    onClick={() => {
                                        handleInputChange("accountType", option);
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
                 * STEP 3 (FINAL)
                 */}
                {step === 3 && (
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
                  Congratulations! You are eligible to invest.
                </h1>
                <p>Next step is to get in touch with us.</p>
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
                  You may still qualify in the future. Check out what we look
                  for on our{" "}
                    <a href="/" className="not-eligible-link">
                    homepage
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
            </div>
        </div>
    );
};

export default InvestorEligibility;

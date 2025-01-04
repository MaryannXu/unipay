"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "@/styles/eligibility.scss";

const Eligibility = () => {
    const router = useRouter();
    const [step, setStep] = useState(0); // Start from step 0 for the new initial page
    const [formData, setFormData] = useState({
        currentStatus: "",
        school: "",
        customSchool: "",
        graduationDate: "",
        highestDegree: "",
        otherDegree: "",
        pursuingDegree: "",
        pursuingOtherDegree: "",
        gpa: "",
        homeCountry: "",
        customCountry: "",
    });

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);
    const handleInputChange = (key: string, value: string) => {
        setFormData({ ...formData, [key]: value });
    };

    return (
        <div className="eligibility-container">
            <div className="eligibility-section">
            {step === 0 && (
                <div>
                    <h1 className="highlight">Eligibility Form</h1>
                    <p>
                        To start, fill out this quick eligibility form to check if UniPay is the right service for you.
                    </p>
                    <div className="button-container">
                        <button className="begin-button" onClick={handleNext}>
                            Begin Form
                        </button>
                        <button className="first-back-button" onClick={() => router.push("/")}>
                            Go Back
                        </button>
                    </div>
                </div>
            )}
                {step === 1 && (
                    <div>
                        <h1>What is your current status?</h1>
                        <p>To ensure we are on the same page, provide the current stage of the process you are in.</p>
                        <div className="options">
                            {["Incoming University Student", "Thinking about studying", "Applied, awaiting admission", "Accepted, yet to start"].map((option) => (
                                <button
                                    key={option}
                                    className="option-button"
                                    onClick={() => {
                                        handleInputChange("currentStatus", option);
                                        handleNext();
                                    }}
                                >
                                    {option}
                                </button>
                            ))}
                            <div className="navigation-buttons">
                                <button className="back-button" onClick={handleBack}>
                                    Go Back
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {step === 2 && (
                    <div>
                        <h1>Select a School:</h1>
                        <select
                            className="dropdown"
                            onChange={(e) => handleInputChange("school", e.target.value)}
                            value={formData.school}
                    >
                        <option value="">Select a University</option>
                        <option value="Harvard University">Harvard University</option>
                        <option value="Stanford University">Stanford University</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Enter your school if not listed"
                        className="text-input"
                        onChange={(e) => handleInputChange("customSchool", e.target.value)}
                        value={formData.customSchool}
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
                    <h1>Additional Information</h1>
                    <label>What is your expected graduation date?</label>
                    <input
                        type="date"
                        className="date-picker"
                        onChange={(e) => handleInputChange("graduationDate", e.target.value)}
                        value={formData.graduationDate}
                    />
                    <label>What is your highest academic degree?</label>
                    <select
                        className="dropdown"
                        onChange={(e) => handleInputChange("highestDegree", e.target.value)}
                        value={formData.highestDegree}
                    >
                        <option value="">Select</option>
                        <option value="High School Diploma">High School Diploma</option>
                        <option value="Associate Degree">Associate Degree</option>
                        <option value="Bachelor's Degree">Bachelor's Degree</option>
                        <option value="Master's Degree">Master's Degree</option>
                        <option value="Doctoral Degree">Doctoral Degree</option>
                        <option value="Other">Other</option>
                    </select>
                    {formData.highestDegree === "Other" && (
                        <input
                            type="text"
                            placeholder="Please specify"
                            className="text-input"
                            onChange={(e) => handleInputChange("otherDegree", e.target.value)}
                            value={formData.otherDegree}
                        />
                    )}
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
                    <h1>Select your Home Country</h1>
                    <select
                        className="dropdown"
                        onChange={(e) => handleInputChange("homeCountry", e.target.value)}
                        value={formData.homeCountry}
                    >
                        <option value="">Select a Country</option>
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Enter your country if not listed"
                        className="text-input"
                        onChange={(e) => handleInputChange("customCountry", e.target.value)}
                        value={formData.customCountry}
                    />
                    <div className="navigation-buttons">
                        <button className="back-button" onClick={handleBack}>
                            Go Back
                        </button>
                    </div>
                </div>
            )}
            </div>
        </div>
    );
};

export default Eligibility;

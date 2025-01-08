
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "@/styles/eligibility.scss";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import Link from "next/link";
import Select from 'react-select';

const universities = [
    { value: "", label: "Select" },
    { value: "Harvard University", label: "Harvard University" },
    { value: "Stanford University", label: "Stanford University" },
    { value: "Massachusetts Institute of Technology", label: "Massachusetts Institute of Technology" },
    { value: "University of California, Berkeley", label: "University of California, Berkeley" },
    { value: "California Institute of Technology", label: "California Institute of Technology" },
    { value: "University of Chicago", label: "University of Chicago" },
    { value: "University of Southern California", label: "University of Southern California" },
    { value: "University of California, Los Angeles", label: "University of California, Los Angeles" },
];

const degrees = [
    { value: "", label: "Select" },
    { value: "Associate's Degree", label: "Associate's Degree" },
    { value: "Bachelor's Degree", label: "Bachelor's Degree" },
    { value: "Master's Degree", label: "Master's Degree" },
    { value: "Doctoral Degree", label: "Doctoral Degree" },
];

const countries = [
    { value: "", label: "Select" },
    { value: "China", label: "China" },
    { value: "India", label: "India" },
    { value: "Korea", label: "Korea" },
    { value: "Canada", label: "Canada" },
];

const Eligibility = () => {
    const router = useRouter();
    const { width, height } = useWindowSize(); // get current window dimensions for confetti
    const [step, setStep] = useState(0);

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

    const [isEligible, setIsEligible] = useState<boolean | null>(null);
    const [showConfetti, setShowConfetti] = useState(false);

    const handleNext = () => {
        if (step === 4) {
            evaluateEligibility();
        }
        setStep(step + 1);
    };

    const handleBack = () => setStep(step - 1);

    const handleInputChange = (key: string, value: string) => {
        setFormData({ ...formData, [key]: value });
    };

    // ---- Update this function to check your criteria and set isEligible ----
    const evaluateEligibility = () => {
        /**
         * Criteria to be eligible:
         * 1. currentStatus ∈ ["Applied, awaiting admission", "Accepted, yet to start", "Returning University Student"]
         * 2. school ∈ ["Harvard University", "University of Southern California"]
         * 3. highestDegree ∈ ["Bachelor's Degree", "Master's Degree", "Doctoral Degree"]
         * 4. gpa >= 3.2
         * 5. homeCountry ∈ ["India", "China", "Korea"]
         */
        const validStatuses = [
            "Applied, awaiting admission",
            "Accepted, yet to start",
            "Returning University Student",
        ];
        const validSchools = ["Harvard University", "University of Southern California"];
        const validDegrees = ["Bachelor's Degree", "Master's Degree", "Doctoral Degree"];
        const validCountries = ["India", "China", "Korea"];

        const meetsCriteria =
            validStatuses.includes(formData.currentStatus) &&
            validSchools.includes(formData.school) &&
            validDegrees.includes(formData.highestDegree) &&
            Number(formData.gpa) >= 3.2 &&
            validCountries.includes(formData.homeCountry);

        setIsEligible(meetsCriteria);
    };
    // -----------------------------------------------------------------------

    // Show confetti for ~4.2 seconds if eligible
    useEffect(() => {
        if (step === 5 && isEligible) {
            setShowConfetti(true);
            const timeout = setTimeout(() => setShowConfetti(false), 4200);
            return () => clearTimeout(timeout);
        }
    }, [step, isEligible]);

    const goToRegister = () => {
        router.push("/login?registering=true");
    };

    function generateGPAOptions() {
        const options = [];
        for (let gpa = 4.0; gpa >= 0.0; gpa -= 0.1) {
            options.push(gpa.toFixed(1));
        }
        return options;
    }

    // ---- Make sure we're storing the correct property in formData ----
    const [selectedOptionSchool, setSelectedOptionSchool] = useState(null);
    const handleChangeSchool = (selected) => {
        setSelectedOptionSchool(selected);
        handleInputChange("school", selected?.value || "");
    };

    const [selectedOptionDegree, setSelectedOptionDegree] = useState(null);
    const handleChangeDegree = (selected) => {
        setSelectedOptionDegree(selected);
        // IMPORTANT: store under "highestDegree" to match your formData key
        handleInputChange("highestDegree", selected?.value || "");
    };

    const [selectedOptionCountry, setSelectedOptionCountry] = useState(null);
    const handleChangeCountry = (selected) => {
        setSelectedOptionCountry(selected);
        // IMPORTANT: store under "homeCountry" to match your formData key
        handleInputChange("homeCountry", selected?.value || "");
    };
    // ------------------------------------------------------------------

    return (
        <div className="eligibility-container">
            <div className="eligibility-section">
                {step === 0 && (
                    <div>
                        <h1 className="highlight">Eligibility Form</h1>
                        <p>
                            To start, fill out this quick eligibility form to check if UniPay is the right
                            service for you.
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
                            {[
                                "Thinking about studying",
                                "Applied, awaiting admission",
                                "Accepted, yet to start",
                                "Returning University Student",
                            ].map((option) => (
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
                        </div>
                        <div className="navigation-buttons">
                            <button className="back-button" onClick={handleBack}>
                                Go Back
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <h1>Select a School:</h1>
                        <Select
                            className="dropdown"
                            options={universities}
                            value={selectedOptionSchool}
                            onChange={handleChangeSchool}
                            placeholder="Select a University"
                            isSearchable
                        />
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
                        <div style={{ display: "flex", alignItems: "center", gap: "0px" }}>
                            <input
                                type="date"
                                className="date-picker"
                                onChange={(e) => handleInputChange("graduationDate", e.target.value)}
                                value={formData.graduationDate !== "N/A" ? formData.graduationDate : ""}
                                disabled={formData.graduationDate === "N/A"}
                            />
                            <input
                                type="checkbox"
                                onChange={(e) => handleInputChange("graduationDate", e.target.checked ? "N/A" : "")}
                                checked={formData.graduationDate === "N/A"}
                            />
                            <span style={{ marginLeft: "8px" }}>N/A</span>
                        </div>

                        <label>What academic degree are you pursuing?</label>
                        <Select
                            className="dropdown"
                            options={degrees}
                            value={selectedOptionDegree}
                            onChange={handleChangeDegree}
                            placeholder="Select a Degree Type"
                            isSearchable
                        />

                        {formData.highestDegree === "Other" && (
                            <input
                                type="text"
                                placeholder="Please specify"
                                className="text-input"
                                onChange={(e) => handleInputChange("otherDegree", e.target.value)}
                                value={formData.otherDegree}
                            />
                        )}

                        <label>What is your current GPA?</label>
                        <select
                            className="gpa-dropdown"
                            onChange={(e) => handleInputChange("gpa", e.target.value)}
                            value={formData.gpa}
                        >
                            <option value="">Select</option>
                            {generateGPAOptions().map((gpa) => (
                                <option key={gpa} value={gpa}>
                                    {gpa}
                                </option>
                            ))}
                        </select>

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
                        <Select
                            className="dropdown"
                            options={countries}
                            value={selectedOptionCountry}
                            onChange={handleChangeCountry}
                            placeholder="Select a Home Country"
                            isSearchable
                        />
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
                            <button className="next-button" onClick={handleNext}>
                                Finish
                            </button>
                        </div>
                    </div>
                )}

                {step === 5 && (
                    <div>
                        {showConfetti && (
                            <Confetti
                                width={width}
                                height={height}
                                colors={["#1CA76B", "#6FC8AA", "#98D2DC", "#D2DEA5"]}
                            />
                        )}
                        {isEligible === true ? (
                            <span>
                <h1 className="congrats-decision">Congratulations! You are eligible for UniPay.</h1>
                <p>The next step is to make an account.</p>
                <button className="first-back-button" onClick={goToRegister}>
                  Go to Register
                </button>
              </span>
                        ) : (
                            <span>
                <h1 className="congrats-decision">
                  Sorry, it looks like you are not eligible for UniPay right now.
                </h1>
                <p className="checkout">
                  Just because we can't support you now, doesn't mean we can't in the future.{" "}
                </p>
                <p>
                  Check out the kind of students we look for
                  <Link className="not-eligible-link" href="/">
                    {" "}
                      here.
                  </Link>
                </p>
                <button className="first-back-button" onClick={() => router.push("/")}>
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

export default Eligibility;

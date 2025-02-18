"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "@/styles/eligibility.scss";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import Link from "next/link";
import Select, { SingleValue } from "react-select";

import { auth, db } from "@/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

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

type Option = {
    value: string;
    label: string;
};

const Eligibility = () => {
    const router = useRouter();
    const { width, height } = useWindowSize();
    const [step, setStep] = useState(0);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
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

    // Function to save ordered user data into Firestore
    const saveOrderedUserData = async () => {
        try {
            // Create an ordered array of responses.
            const orderedResponses = [
                {First_Name: formData.firstName },
                {Last_Name: formData.lastName },
                {Email: formData.email },
                {Current_Status: formData.currentStatus },
                {School: formData.school || formData.customSchool },
                {Graduation_Date: formData.graduationDate },
                {Highest_Degree: formData.highestDegree },
                {GPA: formData.gpa },
                {Home_Country: formData.homeCountry || formData.customCountry },
            ];

            // Save the ordered array in your document
            await addDoc(collection(db, "interestedUsers"), {
                responses: orderedResponses,
                timestamp: new Date(),
            });

            // Optionally, evaluate eligibility and move to the next step
            evaluateEligibility();
            setStep((prev) => prev + 1);
        } catch (error) {
            console.error("Error saving user info:", error);
        }
    };

    // For all steps except the final one we simply move to the next step.
    const handleNext = () => {
        if (step !== 4) {
            setStep((prev) => prev + 1);
        }
    };

    const handleBack = () => setStep((prev) => prev - 1);

    const handleInputChange = (key: string, value: string) => {
        setFormData({ ...formData, [key]: value });
    };

    // ---- Eligibility criteria (update as needed) ----
    const evaluateEligibility = () => {
        const validStatuses = ["Accepted, yet to start", "Returning University Student"];
        const meetsCriteria = validStatuses.includes(formData.currentStatus);
        setIsEligible(meetsCriteria);
    };
    // --------------------------------------------------

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

    // React-select states and handlers:
    const [selectedOptionSchool, setSelectedOptionSchool] = useState<SingleValue<Option>>(null);
    const handleChangeSchool = (selected: SingleValue<Option>) => {
        setSelectedOptionSchool(selected);
        handleInputChange("school", selected?.value || "");
    };

    const [selectedOptionDegree, setSelectedOptionDegree] = useState<SingleValue<Option>>(null);
    const handleChangeDegree = (selected: SingleValue<Option>) => {
        setSelectedOptionDegree(selected);
        handleInputChange("highestDegree", selected?.value || "");
    };

    const [selectedOptionCountry, setSelectedOptionCountry] = useState<SingleValue<Option>>(null);
    const handleChangeCountry = (selected: SingleValue<Option>) => {
        setSelectedOptionCountry(selected);
        handleInputChange("homeCountry", selected?.value || "");
    };

    return (
        <div className="eligibility-container">
            <div className="eligibility-section">
                {step === 0 && (
                    <div>
                        <h1 className="highlight">Student Eligibility Form</h1>
                        <p>
                            UniPay is looking forward to helping you. We're on this journey together! Start by filling out this quick eligibility form.
                        </p>
                        {/* FIRST NAME */}
                        <input
                            type="text"
                            placeholder="First Name"
                            className="text-input"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange("firstName", e.target.value)}
                        />
                        {/* LAST NAME */}
                        <input
                            type="text"
                            placeholder="Last Name"
                            className="text-input"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange("lastName", e.target.value)}
                        />
                        {/* EMAIL */}
                        <input
                            type="email"
                            placeholder="Email"
                            className="text-input"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                        />
                        <div className="button-container">
                            {/* Simply move to the next step without saving partial data */}
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
                            classNamePrefix="react-select"
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
                            classNamePrefix="react-select"
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
                            classNamePrefix="react-select"
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
                            {/* On Finish, save all answers (including name, email, etc.) to "interestedUsers" */}
                            <button className="next-button" onClick={saveOrderedUserData}>
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
                  Just because we can't support you now, doesn't mean we can't in the future.
                </p>
                <p>
                  Contact us for more info
                  <Link className="not-eligible-link" href="/#contact">
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

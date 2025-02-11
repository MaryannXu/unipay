"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/firebaseConfig";
import { doc, collection, addDoc } from "firebase/firestore";
import "@/styles/loan-application.scss";
import { getAuth } from "firebase/auth";


// Steps data (unchanged)
const steps = [
    { label: "Persona Verification" },
    { label: "Financial Status" },
    { label: "Visa Information" },
    { label: "Prior Academic History" },
    { label: "Current Education" },
    { label: "Review and Submit" },
];

export default function LoanApplicationPage() {
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [activeStep, setActiveStep] = useState(0);

    // Whether Persona script is loaded
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);

    // Step 0
    const [step0Verified, setStep0Verified] = useState(true); // TEMP TRUE FOR DEV ENVIRONMENT

    // Step 3: Prior Education
    const [step3priorEducations, setPriorEducations] = useState([
        {
            id: 1,
            universityName: "",
            degreeType: "",
            majorField: "",
            gpa: "",
        },
    ]);

    // Step 1: Financial Status
    const [step1totalAcademicFunding, setTotalAcademicFunding] = useState("");
    const [step1fundsAllocation, setFundsAllocation] = useState("");
    const [step1externalFunding, setExternalFunding] = useState("");
    const [step1isEmployed, setIsEmployed] = useState("");

    // Step 2: Visa
    const [step2visaStatus, setVisaStatus] = useState("");
    const [step2visaType, setVisaType] = useState("");
    const [step2fullNameOnVisa, setFullNameOnVisa] = useState("");
    const [step2visaNumber, setVisaNumber] = useState("");
    const [step2visaIssuanceDate, setVisaIssuanceDate] = useState("");
    const [step2visaExpirationDate, setVisaExpirationDate] = useState("");
    const [step2sevisId, setSevisId] = useState("");

    // Step 4: Current Education
    const [step4currentUniversityName, setCurrentUniversityName] = useState("");
    const [step4isCurrentlyAttending, setIsCurrentlyAttending] = useState("");
    const [step4expectedGraduationDate, setExpectedGraduationDate] = useState("");
    const [step4startDate, setStartDate] = useState("");
    const [step4degreeTypeCurrent, setDegreeTypeCurrent] = useState("");
    const [step4majorFieldCurrent, setMajorFieldCurrent] = useState("");
    const [step4gpaCurrent, setGpaCurrent] = useState("");
    const [step4estimatedCostOfAttendance, setEstimatedCostOfAttendance] =
        useState("");
    const [step4isReceivingScholarship, setIsReceivingScholarship] =
        useState("");

    // Check auth
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
            const response = await fetch("/api/application_submitted", {
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
            console.log("Response from server:", data);
        } catch (error) {
            console.error("Error sending application submitted request:", error);
        }
    }
    // Submit function that CREATES a new doc each time
    const handleSubmitApplication = async () => {
        try {
            const user = auth.currentUser;
            if (!user) {
                alert("No user is logged in. Unable to save data.");
                return;
            }
            // Gather all form data
            const applicationData = {
                step0Verified,
                step3priorEducations,
                // Step 1
                step1totalAcademicFunding,
                step1fundsAllocation,
                step1externalFunding,
                step1isEmployed,
                // Step 2
                step2visaStatus,
                step2visaType,
                step2fullNameOnVisa,
                step2visaNumber,
                step2visaIssuanceDate,
                step2visaExpirationDate,
                step2sevisId,
                // Step 4
                step4currentUniversityName,
                step4isCurrentlyAttending,
                step4expectedGraduationDate,
                step4startDate,
                step4degreeTypeCurrent,
                step4majorFieldCurrent,
                step4gpaCurrent,
                step4estimatedCostOfAttendance,
                step4isReceivingScholarship,
                // metadata
                createdAt: new Date().toISOString(),
            };

            // CREATE a new doc in /users/<uid>/loanApplications
            const docRef = await addDoc(
                collection(db, "users", user.uid, "loanApplications"),
                applicationData
                );   
            
         
            sendApplicationSubmitted(user.uid, docRef.id);
            // Redirect to dashboard
            router.push("/loan-offer");
        } catch (error) {
            console.error("Error saving application data:", error);
            alert("Could not save application data. Check console for details.");
        }
    };

    // Persona verification
    const handlePersonaClick = () => {
        if (isScriptLoaded) {
            initializePersonaClient();
            return;
        }
        const script = document.createElement("script");
        script.src = "https://cdn.withpersona.com/dist/persona-v5.1.2.js";
        script.integrity =
            "sha384-nuMfOsYXMwp5L13VJicJkSs8tObai/UtHEOg3f7tQuFWU5j6LAewJbjbF5ZkfoDo";
        script.crossOrigin = "anonymous";
        script.onload = () => {
            setIsScriptLoaded(true);
            initializePersonaClient();
        };
        document.body.appendChild(script);
    };

    const initializePersonaClient = () => {
        const templateId = process.env.NEXT_PUBLIC_PERSONA_TEMPLATE_ID;
        const environmentId = process.env.NEXT_PUBLIC_PERSONA_ENVIRONMENT_ID;
        if (!templateId || !environmentId) {
            console.error("Persona environment variables are not set.");
            return;
        }
        const client = new (window as any).Persona.Client({
            templateId,
            environmentId,
            onReady: () => client.open(),
            onComplete: ({ status }: any) => {
                if (status === "completed") {
                    setStep0Verified(true);
                } else {
                    alert("Verification not successful.");
                }
            },
        });
    };

    // Step navigation
    const goToStep = (index: number) => {
        if (index > 0 && !step0Verified) {
            alert("Please complete Persona Verification first.");
            return;
        }
        setActiveStep(index);
    };

    const nextStep = () => {
        if (activeStep === 0 && !step0Verified) {
            alert("Please complete Persona Verification first.");
            return;
        }
        setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
    };
    const prevStep = () => {
        setActiveStep((prev) => Math.max(prev - 1, 0));
    };

    // Prior education logic
    const handleAddUniversity = () => {
        setPriorEducations((prev) => [
            ...prev,
            {
                id: Date.now(),
                universityName: "",
                degreeType: "",
                majorField: "",
                gpa: "",
            },
        ]);
    };

    const handleRemoveUniversity = (idToRemove: number) => {
        setPriorEducations((prev) => prev.filter((p) => p.id !== idToRemove));
    };

    const handleChangeUniversity = (
        index: number,
        field: string,
        value: string
    ) => {
        setPriorEducations((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    if (loading) {
        return <div className="loan-application-loading">Loading...</div>;
    }

    return (
        // Outer container that centers the content on a colored background
        <div className="loan-application-container">
            {/* New wrapper for the white, bordered panel */}
            <div className="loan-application-content">
                {/* LEFT-SIDE: Progress Bar */}
                <aside className="loan-application-sidebar">
                    <div className="progress-container">
                        <div className="progress-line" />
                        <div
                            className="progress-line-filled"
                            style={{
                                height: `${(activeStep / (steps.length - 1)) * 100}%`,
                            }}
                        />
                        {steps.map((step, index) => {
                            const isCompleted = index <= activeStep;
                            return (
                                <div key={index} className="step-wrapper">
                                    <button
                                        className={`step-circle ${isCompleted ? "completed" : ""}`}
                                        onClick={() => goToStep(index)}
                                        aria-label={`Step ${index + 1}: ${step.label}`}
                                    >
                                        <span>{index + 1}</span>
                                    </button>
                                    <span className="step-label">{step.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </aside>

                {/* MAIN CONTENT AREA */}
                <main className="loan-application-main">
                    <h1 className="loan-application-step-title">
                        {steps[activeStep].label}
                    </h1>

                    {/* STEP 0: Persona Verification */}
                    {activeStep === 0 && (
                        <div className="persona-verification-container">
                            {!step0Verified ? (
                                <span>
                  <p>
                    Click the button below to verify your identity securely.
                  </p>
                  <button
                      className="persona-button"
                      onClick={handlePersonaClick}
                  >
                    Start Verification
                  </button>
                </span>
                            ) : (
                                <span>
                  <p>You have successfully verified your identity!</p>
                  <button
                      className="persona-button"
                      onClick={handlePersonaClick}
                  >
                    Verify Again
                  </button>
                </span>
                            )}
                        </div>
                    )}

                    {/* STEP 1: Financial Status */}
                    {activeStep === 1 && (
                        <div className="financial-status-step">
                            <h2>Your Financial Status</h2>
                            <p>
                                The information provided is collected to assess your financial
                                eligibility, ensure the accuracy of your loan application, and
                                comply with legal and regulatory requirements. This helps us
                                process your application fairly and transparently while
                                safeguarding your data.
                            </p>

                            <hr />

                            <h3>Academic Funding</h3>
                            <label>
                                Provide the total academic funding you are looking to receive
                                from this loan
                                <br />
                                <input
                                    type="number"
                                    placeholder="$"
                                    value={step1totalAcademicFunding}
                                    onChange={(e) => setTotalAcademicFunding(e.target.value)}
                                />
                            </label>

                            <label>
                                What will these funds be allocated towards?
                                <br />
                                <select
                                    value={step1fundsAllocation}
                                    onChange={(e) => setFundsAllocation(e.target.value)}
                                >
                                    <option value="" disabled hidden>
                                        Select an option
                                    </option>
                                    <option value="Tuition">
                                        Tuition and other academic expenses on my university billing
                                    </option>
                                    <option value="Housing">Housing expenses</option>
                                    <option value="Living">Living expenses</option>
                                </select>
                            </label>

                            <label>
                                How much funding will you receive outside of this loan to
                                support your study abroad?
                                <br />
                                <input
                                    type="number"
                                    placeholder="$"
                                    value={step1externalFunding}
                                    onChange={(e) => setExternalFunding(e.target.value)}
                                />
                            </label>

                            <label>
                                Are you currently employed?
                                <br />
                                <select
                                    value={step1isEmployed}
                                    onChange={(e) => setIsEmployed(e.target.value)}
                                >
                                    <option value="" disabled hidden>
                                        Select
                                    </option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </select>
                            </label>

                            <hr />

                            <h3>Financial Verification Documents</h3>
                            <p>
                                <strong>Proof of Employment</strong>
                            </p>
                            <p>
                                Provide the most recent form of one of the following:
                                <ul>
                                    <li>Salary slips</li>
                                    <li>Tax returns</li>
                                </ul>
                            </p>
                            <div className="upload-container">
                                <label>
                                    <input type="file" multiple accept=".pdf,.jpg,.png" />
                                    <span>Upload files: .pdf, .jpg, .png</span>
                                </label>
                            </div>

                            <p>
                                <strong>Provide one of the following:</strong>
                                <ul>
                                    <li>
                                        A bank statement in English showing adequate liquid funds exist
                                        in the account(s) to cover the cost of your program.
                                    </li>
                                    <li>
                                        A certified letter in English from a financial institution stating
                                        adequate liquid funds exist in the account(s) to cover the cost of
                                        your program.
                                    </li>
                                    <li>
                                        A sponsor letter in English stating that adequate funds are
                                        available to cover the cost of your program.
                                    </li>
                                </ul>
                            </p>
                            <div className="upload-container">
                                <label>
                                    <input type="file" multiple accept=".pdf,.jpg,.png" />
                                    <span>Upload files: .pdf, .jpg, .png</span>
                                </label>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: Visa Information */}
                    {activeStep === 2 && (
                        <div className="visa-status-step">
                            <h2>Visa Status</h2>
                            <p>
                                Let’s make sure everything is in order! We want to make sure your
                                time studying abroad is as smooth as possible.
                            </p>

                            <h3>Visa Information</h3>
                            <label>
                                What is the current status of your Visa?
                                <br />
                                <select
                                    value={step2visaStatus}
                                    onChange={(e) => setVisaStatus(e.target.value)}
                                >
                                    <option value="" disabled hidden>
                                        Select your Visa status
                                    </option>
                                    <option value="approved">Approved</option>
                                    <option value="in-process">In Process</option>
                                    <option value="expired">Expired</option>
                                    <option value="not-applied">Not Applied Yet</option>
                                </select>
                            </label>

                            <label>
                                What is your Visa type?
                                <br />
                                <select
                                    value={step2visaType}
                                    onChange={(e) => setVisaType(e.target.value)}
                                >
                                    <option value="" disabled hidden>
                                        Select your Visa type
                                    </option>
                                    <option value="F-1">F-1</option>
                                    <option value="J-1">J-1</option>
                                    <option value="M-1">M-1</option>
                                    <option value="other">Other</option>
                                </select>
                            </label>

                            <label>
                                What is the full name as it appears on the Visa
                                <br />
                                <input
                                    type="text"
                                    placeholder="Full Name on Visa"
                                    value={step2fullNameOnVisa}
                                    onChange={(e) => setFullNameOnVisa(e.target.value)}
                                />
                            </label>

                            <label>
                                Visa number
                                <br />
                                <input
                                    type="text"
                                    placeholder="Visa Number"
                                    value={step2visaNumber}
                                    onChange={(e) => setVisaNumber(e.target.value)}
                                />
                            </label>

                            <label>
                                Issuance Date:
                                <br />
                                <input
                                    type="date"
                                    value={step2visaIssuanceDate}
                                    onChange={(e) => setVisaIssuanceDate(e.target.value)}
                                />
                            </label>

                            <label>
                                Expiration Date:
                                <br />
                                <input
                                    type="date"
                                    value={step2visaExpirationDate}
                                    onChange={(e) => setVisaExpirationDate(e.target.value)}
                                />
                            </label>

                            <h4>Verify your Visa</h4>
                            <p>Provide a picture or PDF of your visa</p>
                            <div className="upload-container">
                                <label>
                                    <input type="file" multiple accept=".pdf,.jpg,.png" />
                                    <span>Upload files: .pdf, .jpg, .png</span>
                                </label>
                            </div>

                            <label>
                                SEVIS ID
                                <br />
                                <input
                                    type="text"
                                    placeholder="Enter SEVIS ID found on your I-20 or DS-2019 form"
                                    value={step2sevisId}
                                    onChange={(e) => setSevisId(e.target.value)}
                                />
                            </label>
                        </div>
                    )}

                    {/* STEP 3: Prior Academic History */}
                    {activeStep === 3 && (
                        <div className="prior-academic-history-step">
                            <h2>Your Academic Status</h2>
                            <p>
                                We’re still getting to know you! In order to see your growth potential,
                                provide a few details about your academics.
                            </p>

                            <h3>Prior Education</h3>
                            {step3priorEducations.map((edu, index) => (
                                <div className="academic-history-card" key={edu.id}>
                                    {index > 0 && (
                                        <button
                                            type="button"
                                            className="remove-card-button"
                                            onClick={() => handleRemoveUniversity(edu.id)}
                                        >
                                            X
                                        </button>
                                    )}

                                    <label>
                                        University name
                                        <br />
                                        <input
                                            type="text"
                                            placeholder="e.g. University of Example"
                                            value={edu.universityName}
                                            onChange={(e) =>
                                                handleChangeUniversity(index, "universityName", e.target.value)
                                            }
                                        />
                                    </label>

                                    <label>
                                        Degree type
                                        <br />
                                        <input
                                            type="text"
                                            placeholder="e.g. Bachelor's, Master's"
                                            value={edu.degreeType}
                                            onChange={(e) =>
                                                handleChangeUniversity(index, "degreeType", e.target.value)
                                            }
                                        />
                                    </label>

                                    <label>
                                        Major/Field of study
                                        <br />
                                        <input
                                            type="text"
                                            placeholder="e.g. Computer Science"
                                            value={edu.majorField}
                                            onChange={(e) =>
                                                handleChangeUniversity(index, "majorField", e.target.value)
                                            }
                                        />
                                    </label>

                                    <label>
                                        GPA
                                        <br />
                                        <select
                                            value={edu.gpa}
                                            onChange={(e) =>
                                                handleChangeUniversity(index, "gpa", e.target.value)
                                            }
                                        >
                                            <option value="" disabled hidden>
                                                Select GPA
                                            </option>
                                            <option value="4.0">4.0</option>
                                            <option value="3.5">3.5</option>
                                            <option value="3.0">3.0</option>
                                            <option value="2.5">2.5</option>
                                        </select>
                                    </label>

                                    <h4>Proof of Attendance</h4>
                                    <p>
                                        Provide a university transcript covering the entirety of your studies at this particular
                                        university
                                    </p>
                                    <div className="upload-container">
                                        <label>
                                            <input type="file" multiple accept=".pdf,.jpg,.png" />
                                            <span>Upload files: .pdf, .jpg, .png</span>
                                        </label>
                                    </div>

                                    <h4>Diploma/Certificate of Completion</h4>
                                    <p>
                                        If degree was completed, provide an official university document stating degree
                                        completion
                                    </p>
                                    <div className="upload-container">
                                        <label>
                                            <input type="file" multiple accept=".pdf,.jpg,.png" />
                                            <span>Upload files: .pdf, .jpg, .png</span>
                                        </label>
                                    </div>
                                </div>
                            ))}

                            <button
                                type="button"
                                className="add-university-button"
                                onClick={handleAddUniversity}
                            >
                                + Add a university
                            </button>
                        </div>
                    )}

                    {/* STEP 4: Current Education */}
                    {activeStep === 4 && (
                        <div className="current-education-step">
                            <h2>Where are you going now</h2>
                            <p>
                                We can’t wait to see where you’re off to. Let’s get a better understanding of what your
                                future looks like!
                            </p>

                            <h3>Current Education</h3>
                            <div className="academic-history-card">
                                <label>
                                    University name
                                    <br />
                                    <input
                                        type="text"
                                        placeholder="e.g. University of Example"
                                        value={step4currentUniversityName}
                                        onChange={(e) => setCurrentUniversityName(e.target.value)}
                                    />
                                </label>

                                <label>
                                    Are you currently attending this university?
                                    <br />
                                    <select
                                        value={step4isCurrentlyAttending}
                                        onChange={(e) => setIsCurrentlyAttending(e.target.value)}
                                    >
                                        <option value="" disabled hidden>
                                            Select
                                        </option>
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                    </select>
                                </label>

                                <label>
                                    Expected graduation date
                                    <br />
                                    <input
                                        type="date"
                                        value={step4expectedGraduationDate}
                                        onChange={(e) => setExpectedGraduationDate(e.target.value)}
                                    />
                                </label>

                                <label>
                                    Start date
                                    <br />
                                    <input
                                        type="date"
                                        value={step4startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </label>

                                <label>
                                    Degree type
                                    <br />
                                    <input
                                        type="text"
                                        placeholder="e.g. Bachelor's, Master's"
                                        value={step4degreeTypeCurrent}
                                        onChange={(e) => setDegreeTypeCurrent(e.target.value)}
                                    />
                                </label>

                                <label>
                                    Major/Field of study
                                    <br />
                                    <input
                                        type="text"
                                        placeholder="e.g. Computer Science"
                                        value={step4majorFieldCurrent}
                                        onChange={(e) => setMajorFieldCurrent(e.target.value)}
                                    />
                                </label>

                                <label>
                                    GPA
                                    <br />
                                    <select
                                        value={step4gpaCurrent}
                                        onChange={(e) => setGpaCurrent(e.target.value)}
                                    >
                                        <option value="" disabled hidden>
                                            Select GPA
                                        </option>
                                        <option value="4.0">4.0</option>
                                        <option value="3.5">3.5</option>
                                        <option value="3.0">3.0</option>
                                        <option value="2.5">2.5</option>
                                    </select>
                                </label>

                                <h4>Proof of Attendance</h4>
                                <p>
                                    If currently attending, provide a university transcript covering the entirety of your studies at
                                    this particular university
                                </p>
                                <div className="upload-container">
                                    <label>
                                        <input type="file" multiple accept=".pdf,.jpg,.png" />
                                        <span>Upload files: .pdf, .jpg, .png</span>
                                    </label>
                                </div>

                                <h4>Proof of Admission</h4>
                                <p>
                                    If you are soon to attend this university, provide a letter of admissions provided by the school.
                                </p>
                                <div className="upload-container">
                                    <label>
                                        <input type="file" multiple accept=".pdf,.jpg,.png" />
                                        <span>Upload files: .pdf, .jpg, .png</span>
                                    </label>
                                </div>
                            </div>

                            <hr className="section-divider" />

                            <h2>How are we going to help you</h2>
                            <p>
                                We’re here to support you! Provide us with information that will help us uplift your educational journey.
                            </p>

                            <h3>University Billing</h3>
                            <label>
                                Estimated Cost of Attendance
                                <br />
                                <input
                                    type="number"
                                    placeholder="What is the expected cost of attendance including housing?"
                                    value={step4estimatedCostOfAttendance}
                                    onChange={(e) => setEstimatedCostOfAttendance(e.target.value)}
                                />
                            </label>

                            <label>
                                Are you receiving financial assistance from the university in the form of scholarship?
                                <br />
                                <select
                                    value={step4isReceivingScholarship}
                                    onChange={(e) => setIsReceivingScholarship(e.target.value)}
                                >
                                    <option value="" disabled hidden>
                                        Select
                                    </option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </select>
                            </label>

                            <h4>Proof of Scholarship</h4>
                            <p>
                                Provide one of the following:
                                <ul>
                                    <li>Letter of scholarship</li>
                                    <li>Scholarship billing statement</li>
                                </ul>
                            </p>
                            <div className="upload-container">
                                <label>
                                    <input type="file" multiple accept=".pdf,.jpg,.png" />
                                    <span>Upload files: .pdf, .jpg, .png</span>
                                </label>
                            </div>

                            <h4>Proof of Cost of Attendance</h4>
                            <p>Provide a university billing statement containing the total owed.</p>
                            <div className="upload-container">
                                <label>
                                    <input type="file" multiple accept=".pdf,.jpg,.png" />
                                    <span>Upload files: .pdf, .jpg, .png</span>
                                </label>
                            </div>
                        </div>
                    )}

                    {/* STEP 5: Review and Submit */}
                    {activeStep === 5 && (
                        <div className="review-and-submit-step">
                            <p>Please review all the information you have entered before submitting.</p>
                            {/* You can add a summary of all form data here, or any final instructions */}
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="loan-application-step-navigation">
                        <button
                            type="button"
                            className="back-button"
                            disabled={activeStep === 0}
                            onClick={prevStep}
                        >
                            Previous
                        </button>
                        {activeStep < steps.length - 1 ? (
                            <button type="button" className="next-button" onClick={nextStep}>
                                Next
                            </button>
                        ) : (
                            <button type="button" className="submit-button" onClick={handleSubmitApplication}>
                                Submit Application
                            </button>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

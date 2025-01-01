"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const Eligibility = () => {
    const router = useRouter();

    return (
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <h1>Eligibility Page</h1>
            <p>form goes here</p>
        </div>
    );
};

export default Eligibility;
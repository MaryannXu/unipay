import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/firebaseConfig";

const ProtectedPage = () => {
    const router = useRouter();

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) {
            router.push("/login"); // Redirect if not authenticated
        }
    }, [router]);

    return <div>This is a protected page, only accessible by logged-in users.</div>;
};

export default ProtectedPage;

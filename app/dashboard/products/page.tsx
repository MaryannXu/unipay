"use client"; 

import React, { useEffect, useState } from "react";
import "@/styles/products.scss";
import Icon_arrow from  '@/components/icons/icon-arrow'
import productDescription from "@/public/credit-status/productDescription.json";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { auth, db } from "@/firebaseConfig";
import DashboardPage from "../page";
import {
    collection,
    getDocs,
    query,
    where
} from "firebase/firestore";
import Modal from "@/components/layout/modal/modal";


export function Services({ product }: {product: string}) {
    const [isOpen, setIsOpen] = useState(false)
    const [products, setProducts] = useState<{ id: string; company: string; name: string; type: string, link: string, description: string}[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<{ id: string; company: string; name: string; type: string; link: string} | null>(null);

    const router = useRouter(); 

    useEffect(() => {
        const fetchProductData = async () => {
            const user = auth.currentUser;
            if (!user) return;

            try {
                // Query partnerProducts collection for documents where 'type' matches the product
                const productsRef = collection(db, "partnerProducts");
                const q = query(productsRef, where("type", "==", product));
                const querySnapshot = await getDocs(q);

                // Extract relevant data from query results
                const allData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...(doc.data() as { company: string; name: string; type: string, link: string;  })
                }));

                setProducts(allData);
            } catch (error) {
                console.error("Error fetching product data:", error);
            }
        };

        fetchProductData();
    }, [product]);
    return( 
        <>
        <div>
            {products.map((data) => (
                <div key={data.id} style={{ position: "relative" }}>
                    <div className="product-container" onClick={() => {setSelectedProduct(data); setIsOpen(true)}}>
                        <img 
                        src={`/img/partners/${data.company}.jpg`} // Corrected image path
                        alt={data.company} 
                        className="product-image"
                    />
                        <button className="sign-up-button" onClick={(e) => { e.stopPropagation(); router.push(data.link) }}>
                        <span>sign up</span>
                        </button>
                        <ul>
                            {productDescription.companies[data.company as keyof typeof productDescription.companies]?.descriptions.map((desc, index) => (
                                <li key={index}>
                                    <p>{desc}</p>
                                </li>
                            ))}
                        </ul>
                        <div className="modal-arrow-container">
                            <span className="arrow-icon">
                                <Icon_arrow direction='right'/>
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
        <AnimatePresence>
            {isOpen && <Modal onClose={() => setIsOpen(false)} company={selectedProduct.company}/>}
        </AnimatePresence>
        </>
    )
}


export default function Products() { 
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(true);

    type MenuOption = "home" | "tasks" | "payments" | "applications" | "balance";

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
    

    return(
        <>
        <DashboardPage/>
        </>
    )
}
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDOtb6YCz277ulMA94ehs_yM3mDDT5lnF4",
    authDomain: "unipayf24.firebaseapp.com",
    projectId: "unipayf24",
    storageBucket: "unipayf24.firebasestorage.app",
    messagingSenderId: "611946450050",
    appId: "1:611946450050:web:39b94fae0051e7bf3cb89b",
    measurementId: "G-XW6S94C7H8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db};
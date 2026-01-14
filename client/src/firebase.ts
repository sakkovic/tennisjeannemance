// Firebase configuration
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyAbJBsH6hRNA8jEuoJDP91S0nffTUHJ71Q",
    authDomain: "sakka-tennis.firebaseapp.com",
    projectId: "sakka-tennis",
    storageBucket: "sakka-tennis.firebasestorage.app",
    messagingSenderId: "847375040884",
    appId: "1:847375040884:web:32683bbb8652ae9f752c21",
    measurementId: "G-HHRTZYFVLJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

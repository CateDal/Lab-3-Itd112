// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Import Firestore
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCyPWZ7r9jWEwU9fK-nVFTD4Mirr3vG1s0",
  authDomain: "lab3-76c67.firebaseapp.com",
  projectId: "lab3-76c67",
  storageBucket: "lab3-76c67.firebasestorage.app",
  messagingSenderId: "585917402080",
  appId: "1:585917402080:web:cc307035d82f46a1a5b985",
  measurementId: "G-SBR865QRNM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Initialize Firestore
const analytics = getAnalytics(app); // Initialize Analytics

// Export the initialized instances
export { db, analytics };

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC_xaal1uUh66dy7KOi1sx6i4QKslPBn5E",
  authDomain: "e-learning-rabea.firebaseapp.com",
  projectId: "e-learning-rabea",
  storageBucket: "e-learning-rabea.firebasestorage.app",
  messagingSenderId: "417528235701",
  appId: "1:417528235701:web:d72e589f596fb1fb1be0fc",
  measurementId: "G-NT48GE1FM9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

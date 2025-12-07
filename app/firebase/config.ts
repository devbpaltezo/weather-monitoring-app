// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDH1ocHmyllc4xQ-5VG1-ZRCGwrz72Ioys",
  authDomain: "coastal-weather-monitoring.firebaseapp.com",
  projectId: "coastal-weather-monitoring",
  storageBucket: "coastal-weather-monitoring.firebasestorage.app",
  messagingSenderId: "494713860331",
  appId: "1:494713860331:web:722005016cace4d0568eae",
  measurementId: "G-KXXNY36XYH"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
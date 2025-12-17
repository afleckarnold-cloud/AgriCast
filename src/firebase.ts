// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCpKlhG2BtdJ-xUiAWyfajdKI3S128EmFs",
  authDomain: "agricast-32b60.firebaseapp.com",
  projectId: "agricast-32b60",
  storageBucket: "agricast-32b60.firebasestorage.app",
  messagingSenderId: "1025897344986",
  appId: "1:1025897344986:web:09d08c180d2fef22dc9ae3",
  measurementId: "G-HSPZX4C467"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { db, app, analytics };

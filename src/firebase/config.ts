// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCoPCQ5KQz-bZ8zFqb8xi6Y0Ye8XWj-VBQ",
  authDomain: "no-code-b1abc.firebaseapp.com",
  projectId: "no-code-b1abc",
  storageBucket: "no-code-b1abc.appspot.com",
  messagingSenderId: "752754624519",
  appId: "1:752754624519:web:7edd5d9239f2746808c2a2",
  measurementId: "G-VN44EJ7CDF"
};

// Initialize Firebase
let firebase_app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export default firebase_app;

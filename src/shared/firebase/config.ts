// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAD6tvCAnnMgFTwNyizmqTUer6-nc6SKDE",
  authDomain: "jeuxgratis-116b3.firebaseapp.com",
  projectId: "jeuxgratis-116b3",
  databaseURL: "https://jeuxgratis-116b3-default-rtdb.europe-west1.firebasedatabase.app", 
  storageBucket: "jeuxgratis-116b3.firebasestorage.app",
  messagingSenderId: "321489028962",
  appId: "1:321489028962:web:d1478d0b8f352aa4e2ce3b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app)
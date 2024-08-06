// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore'; 
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from "firebase/auth";
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA2yBVDYkn6VTsmq3l5TMYxfdzItq7AVGY",
  authDomain: "coffee18-2.firebaseapp.com",
  projectId: "coffee18-2",
  storageBucket: "coffee18-2.appspot.com",
  messagingSenderId: "430248158024",
  appId: "1:430248158024:web:bee91114ef47ef2e92497d",
  measurementId: "G-SS9E9R2FW8"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); 
const analytics = getAnalytics(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, analytics, auth, storage };
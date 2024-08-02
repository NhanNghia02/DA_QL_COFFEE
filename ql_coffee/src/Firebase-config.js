// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore'; 
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCOi8pMSqzEjwnEpatKmxcSjBVQW5AZ6c0",
  authDomain: "coffee18-6e703.firebaseapp.com",
  projectId: "coffee18-6e703",
  storageBucket: "coffee18-6e703.appspot.com",
  messagingSenderId: "432638222376",
  appId: "1:432638222376:web:766411ee2adeb8586c951d",
  measurementId: "G-N9KMCQ6K1K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); 
const analytics = getAnalytics(app);

export { db, analytics };
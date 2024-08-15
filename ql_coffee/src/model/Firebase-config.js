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
  apiKey: "AIzaSyARcz-Z_WaQZkL6X8fTmbYm873SjLZ63DU",
  authDomain: "coffee18-duphong.firebaseapp.com",
  projectId: "coffee18-duphong",
  storageBucket: "coffee18-duphong.appspot.com",
  messagingSenderId: "337132271739",
  appId: "1:337132271739:web:3d3c0b5d98a50395b78ade",
  measurementId: "G-L9TC7741ZF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); 
const analytics = getAnalytics(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, analytics, auth, storage };
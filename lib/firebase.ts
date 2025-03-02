// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCXESewMc6LK2jsv_stYzpm0OzLwgbndNM",
  authDomain: "supportplus-1e264.firebaseapp.com",
  projectId: "supportplus-1e264",
  storageBucket: "supportplus-1e264.firebasestorage.app",
  messagingSenderId: "106856340374",
  appId: "1:106856340374:web:6dabcfad0259791be9dbb7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

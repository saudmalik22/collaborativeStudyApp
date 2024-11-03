// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {getAuth} from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAuZuUZU2n8bS5pkEjWpwjVfGarnv9hLdw",
    authDomain: "socialmedia-a13f2.firebaseapp.com",
    projectId: "socialmedia-a13f2",
    storageBucket: "socialmedia-a13f2.appspot.com",
    messagingSenderId: "479127414801",
    appId: "1:479127414801:web:23ac8365dd461ccccea9b0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth =getAuth(app);
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD7H4eU4L_1tPQspookP-x4ifaWkDUPhB4",
    authDomain: "pacient-table.firebaseapp.com",
    projectId: "pacient-table",
    storageBucket: "pacient-table.appspot.com",
    messagingSenderId: "86939412524",
    appId: "1:86939412524:web:f9f415fbf13b8d87f64989",
    measurementId: "G-QZ7Z4JH8JV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
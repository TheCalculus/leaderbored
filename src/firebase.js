import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseApp = initializeApp({
    apiKey: "AIzaSyAIzsUMpUC6_zSlZtTHLmiA5UGlYZl3CPY",
    authDomain: "leaderbored-c1ea2.firebaseapp.com",
    projectId: "leaderbored-c1ea2",
    storageBucket: "leaderbored-c1ea2.appspot.com",
    messagingSenderId: "1043865417419",
    appId: "1:1043865417419:web:970c2594274dc4d2798d4e",
    measurementId: "G-18P8KDGWMY",
});

export const db = getFirestore(firebaseApp);

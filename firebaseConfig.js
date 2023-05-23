import { initializeApp } from 'firebase/app';
import {FIREBASE_API_KEY} from '@env'

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
import {getFirestore} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
    apiKey: {FIREBASE_API_KEY},
    authDomain: "finalwork-recipeapp.firebaseapp.com",
    projectId: "finalwork-recipeapp",
    storageBucket: "finalwork-recipeapp.appspot.com",
    messagingSenderId: "253167603919",
    appId: "1:253167603919:web:607abf97e1025ba18d27ba",
    measurementId: "G-4JYNGWPB89"
  };

const app = initializeApp(firebaseConfig);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
export const DATABASE = getFirestore(app);

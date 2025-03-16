// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAqWDe3Dcw38IV0FHz5-cdEngXgfX90FKo",
  authDomain: "storyvault-c1f17.firebaseapp.com",
  projectId: "storyvault-c1f17",
  storageBucket: "storyvault-c1f17.firebasestorage.app",
  messagingSenderId: "241732485569",
  appId: "1:241732485569:web:c55b253aa6770fd15f6f40",
  measurementId: "G-R9CRNTWQDD",
};

const app = initializeApp(firebaseConfig);



export const auth = getAuth(app);
export default app;

import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-web-app-1ca7f.firebaseapp.com",
  projectId: "real-estate-web-app-1ca7f",
  storageBucket: "real-estate-web-app-1ca7f.appspot.com",
  messagingSenderId: "224392003912",
  appId: "1:224392003912:web:2f2e4d8cb997914a5a337d"
};


export const app = initializeApp(firebaseConfig);
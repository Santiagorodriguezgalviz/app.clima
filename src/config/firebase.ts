import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBVShfUiSzKEIz_xbC22hQ-KjVmA7aPq6k",
  authDomain: "portafolio-70ae4.firebaseapp.com",
  projectId: "portafolio-70ae4",
  storageBucket: "portafolio-70ae4.firebasestorage.app",
  messagingSenderId: "380997181256",
  appId: "1:380997181256:web:8b98f6d709e7a2f9dd1d7d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
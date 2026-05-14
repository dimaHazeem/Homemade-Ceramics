// Firebase Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCYkhV_WA4MpAZENSnGT6DRfxW9YX6p6X8",
  authDomain: "homemade-ceramics.firebaseapp.com",
  projectId: "homemade-ceramics",
  storageBucket: "homemade-ceramics.firebasestorage.app",
  messagingSenderId: "627950501053",
  appId: "1:627950501053:web:420482bdb001f9c7610bd4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Export
export {
  auth,
  googleProvider
};
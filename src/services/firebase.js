// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBQ6Z-zU-V0U--uZG-DPXJKmXYnm3D6R9I",
  authDomain: "examen1-5517c.firebaseapp.com",
  projectId: "examen1-5517c",
  storageBucket: "examen1-5517c.firebasestorage.app",
  messagingSenderId: "16016275446",
  appId: "1:16016275446:web:c3d06810155c420db2f9d7",
  measurementId: "G-X4V9ZC9XRC"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
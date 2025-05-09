  // services/firebase.ts
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBLXtnUx-pn71OkGXNqznIQVsZevFwhlH0",
  authDomain: "farm2fork-74eed.firebaseapp.com",
  projectId: "farm2fork-74eed",
  storageBucket: "farm2fork-74eed.firebasestorage.app",
  messagingSenderId: "1064051054292",
  appId: "1:1064051054292:web:fd670bda04f22fd49d8d41",
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getDatabase(app);

export { auth, db };

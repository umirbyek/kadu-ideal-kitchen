import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBRvFGN6I7nP6obb-iygTi3qtt61nof61A",
  authDomain: "kaduidealkitcheb.firebaseapp.com",
  projectId: "kaduidealkitcheb",
  storageBucket: "kaduidealkitcheb.firebasestorage.app",
  messagingSenderId: "281683504716",
  appId: "1:281683504716:web:797a0b65f7ed8f6c12cee9",
  measurementId: "G-Y4JFYPP2NX"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

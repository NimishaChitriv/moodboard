import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Paste your Firebase project config here:
// Firebase console → Project settings → Your apps → SDK setup and config
const firebaseConfig = {
  apiKey: "AIzaSyCranXLG_kuDebbc2AVCtyzzk9kI6JKihY",
  authDomain: "moodboard-4e6f9.firebaseapp.com",
  projectId: "moodboard-4e6f9",
  storageBucket: "moodboard-4e6f9.firebasestorage.app",
  messagingSenderId: "591808864295",
  appId: "1:591808864295:web:1b2206607d4929c3abae02",
  measurementId: "G-PPJY13LJBN",
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

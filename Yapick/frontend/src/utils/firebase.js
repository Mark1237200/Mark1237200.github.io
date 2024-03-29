import firebase from 'firebase/compat/app';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  GithubAuthProvider,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FB_API_KEY,
  authDomain: process.env.REACT_APP_FB_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FB_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FB_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FB_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FB_API_ID,
};

const app = firebase.initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth();

export {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  auth,
  collection,
  getDocs,
  addDoc,
};

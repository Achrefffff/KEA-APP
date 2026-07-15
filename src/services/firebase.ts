import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCX6K8Vhenwj8w_z_7ZovG_9IFXWUCbJtU",
  authDomain: "sustained-hold-400914.firebaseapp.com",
  projectId: "sustained-hold-400914",
  storageBucket: "sustained-hold-400914.firebasestorage.app",
  messagingSenderId: "132842544109",
  appId: "1:132842544109:android:5d2d184ab00e9be3a8a5e4",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

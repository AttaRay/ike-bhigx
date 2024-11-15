// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyDBYf-uSORbYkqaPQ8iSBgngSCMDtChRV0",
  authDomain: "ikebhigx.firebaseapp.com",
  projectId: "ikebhigx",
  storageBucket: "ikebhigx.appspot.com",
  messagingSenderId: "854625027767",
  appId: "1:854625027767:ios:d9f359a0ee57171d0e6f32",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


export { app, db };

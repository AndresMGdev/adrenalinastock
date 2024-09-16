import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC175iV3ZgwNXSpLc-9hM-oo03ymz3f6QE",
  authDomain: "adrenalinastock.firebaseapp.com",
  projectId: "adrenalinastock",
  storageBucket: "adrenalinastock.appspot.com",
  messagingSenderId: "156321290778",
  appId: "1:156321290778:web:aedde9a7fd4d1c99558fa3"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

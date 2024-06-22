import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDIZGFhZDrtJ5Si2idBK_eU8TFSU3pzdBg",
    authDomain: "easybookmark-c1e81.firebaseapp.com",
    projectId: "easybookmark-c1e81",
    storageBucket: "easybookmark-c1e81.appspot.com",
    messagingSenderId: "120874097785",
    appId: "1:120874097785:web:5c71a7d35f1ce7d3b408a8"
};

// init firebase app
const app = initializeApp(firebaseConfig);

// init services
const auth = getAuth();

export { app, auth };
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBK16awFSWBtgmuhjJrNzCjhLgaUkmyOW8",
    authDomain: "react-native-database-76e2e.firebaseapp.com",
    projectId: "react-native-database-76e2e",
    storageBucket: "react-native-database-76e2e.appspot.com",
    messagingSenderId: "433540127354",
    appId: "1:433540127354:web:c1baaf52bd78ae61a579c3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export default db
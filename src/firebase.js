import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
        apiKey: "AIzaSyApg1DuvJ_YvVzu6m2Z1SWaDmC40cJcakM",
        authDomain: "react-messenger-app-2b619.firebaseapp.com",
        databaseURL: "https://react-messenger-app-2b619.firebaseio.com",
        projectId: "react-messenger-app-2b619",
        storageBucket: "react-messenger-app-2b619.appspot.com",
        messagingSenderId: "247507371384",
        appId: "1:247507371384:web:767b59012b5c1dc6fb748d",
        measurementId: "G-YE0KGMBJV8"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();

export { db, auth };
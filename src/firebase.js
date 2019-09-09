import firebase from 'firebase';

// Initialize Firebase
// USE YOUR CONFIG OBJECT
const firebaseConfig = {
  apiKey: "AIzaSyDU-GNRgG6ZSSOgcP2Da9A8HqvCwxRgMSU",
  authDomain: "snapswatch-f84d0.firebaseapp.com",
  databaseURL: "https://snapswatch-f84d0.firebaseio.com",
  projectId: "snapswatch-f84d0",
  storageBucket: "",
  messagingSenderId: "654240180155",
  appId: "1:654240180155:web:4c8f5662bdf59595dac69e"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// this exports the CONFIGURED version of firebase
export default firebase;
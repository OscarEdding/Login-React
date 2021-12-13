// Import the functions you need from the SDKs you need
import app from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCt_-oLyFUo_eMe59NwqtEb_FXsy4lKL9k",
  authDomain: "login-react-f9a22.firebaseapp.com",
  projectId: "login-react-f9a22",
  storageBucket: "login-react-f9a22.appspot.com",
  messagingSenderId: "460350512928",
  appId: "1:460350512928:web:969b872adecf26e7f84145"
};

// Initialize Firebase
app.initializeApp(firebaseConfig);

const db = app.firestore();
const auth = app.auth();

export {db, auth}
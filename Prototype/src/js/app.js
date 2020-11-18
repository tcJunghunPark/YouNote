var database;

var firebaseConfig = {
    apiKey: "AIzaSyC70xfIYYV8Zpw3dk0XbpT1DwDHOr06vCM",
    authDomain: "cse323-younote.firebaseapp.com",
    databaseURL: "https://cse323-younote.firebaseio.com",
    projectId: "cse323-younote",
    storageBucket: "cse323-younote.appspot.com",
    messagingSenderId: "865383462194",
    appId: "1:865383462194:web:1731c4cb2d08af15e7132b",
    measurementId: "G-GN9QCDKG9Y"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  database = firebase.firestore();
  console.log("database init!");

 
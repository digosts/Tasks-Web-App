import firebase from "firebase/app";

import "firebase/auth";
import "firebase/database";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.React_App_Api_Key,
  authDomain: process.env.React_App_Auth_Domain,
  databaseURL: process.env.React_App_Database_URL,
  projectId: process.env.React_App_Project_Id,
  storageBucket: process.env.React_App_Storage_Bucket,
  messagingSenderId: process.env.React_App_Messaging_Sender_Id,
  appId: process.env.React_App_App_Id,
  measurementId: process.env.React_App_Measurement_Id,
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const database = firebase.database();

export { auth, database, firebase };

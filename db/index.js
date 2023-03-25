
import * as fs from 'fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore/lite';



let qs_content = fs.readFileSync("./questionnaire.json");
let questionnaire = JSON.parse(qs_content);

const config = {
    apiKey: "AIzaSyAGga2hghh4Vl0gcRVdcGgVtzLXVkLVVLk",
    authDomain: "react2023-8d864.firebaseapp.com",
    // Other configuration options, such as the Realtime Database / Firestore details...
    projectId: "react2023-8d864",
    storageBucket: "react2023-8d864.appspot.com",
    messagingSenderId: "90773956317",
    appId: "1:90773956317:web:6278b8d3c040506a3f1d34"
};





const app = initializeApp(config);
const db = getFirestore(app);


const coll = collection(db, "questionnaires");

addDoc(coll, questionnaire)
    .then(docRef => {
        console.log("Document has been added successfully");
    })
    .catch(error => {
        console.log(error);
    })
export default questionnaire;



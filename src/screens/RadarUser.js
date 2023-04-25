import React from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import 'bootstrap/dist/css/bootstrap.min.css';
import {List, Col, Row, Table, Button} from 'reactstrap';
import { query, where } from "firebase/firestore";

function RadarFrom() {
    // Get current user's id and then get the reference to the db
    const uid = firebase.auth().currentUser.uid;
    const questionnaireSnap = firebase.firestore().collection('userQuestionnaires').doc(uid);

    // get de toutes la listes de questionnaires
    questionnaireSnap.get().then((doc) => {
        if (doc.exists) {

            const questionnaireData = doc.data().questionnaires;
            // replace with the actual name of your object field
            const datetimeToSearch = new Date('2023-04-25T16:12:14');

            let arrayContainingDatetime;
            for (const key in questionnaireData) {
                const array = questionnaireData[key];
                if (Array.datetime === datetimeToSearch.toISOString()) {
                    //arrayContainingDatetime = array
                    //break;
                    arrayContainingDatetime = array.find(
                        (arrayItem) => arrayItem.datetime === datetimeToSearch.toISOString()
                    );
                    if (arrayContainingDatetime) {
                        break;
                   }
                }
            }
            console.log(questionnaireData)
            console.log(arrayContainingDatetime)

        } else {
            console.log('No such document!');
        }
    }).catch((error) => {
        console.log('Error getting document:', error);
    });

    return(
        <>
            <Col>bonjour</Col>
        </>
    )
}

export default function MyFunction() {
    return (
            <RadarFrom/>
        )
};

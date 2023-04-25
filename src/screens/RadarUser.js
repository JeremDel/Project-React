import React, {useEffect, useState} from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Timestamp } from "firebase/firestore";
import {MyRecommendations, MyResponsiveRadar, MyResults} from "./RadarPlotUser";
import {Col, List, Row} from "reactstrap";

function RadarFrom() {
    // State where the radar (from RadarPlotUser.js) will be stored to be displayed
    const [radar, setRadar] = useState(<></>);
    const [results, setResults] = useState(<></>);
    const [recommendations, setRecommendations] = useState(<></>);

    useEffect(() => {
        // Get current user's id and the reference to the db document with the user's filled questionnaires (aka forms :D)
        const uid = firebase.auth().currentUser.uid;
        const userForms = firebase.firestore().collection('userQuestionnaires').doc(uid);

        userForms.get().then((doc) => {
            if (doc.exists) {
                // Store all the forms in a variable
                const forms = doc.data().questionnaires;

                // TODO: remove this, testing purposes --> We should get the date as an argument
                const originalDate = new Date('April 25, 2023 8:16:44 PM UTC+2');

                // Convert the date to a timestamp, since that's how firestore stores dates
                const timestampToSearch = Timestamp.fromDate(originalDate);

                let arrayContainingDatetime; // Empty variable that will store the form once it has been found
                for (const formObject in forms) {
                    const form = forms[formObject];

                    // Store the date of the form in a variable for easy access
                    const dateTime = form.datetime;

                    // TODO: show the formattedDate variable in the list of checkups
                    // Pretty format the timestamp from the db
                    const date = dateTime.toDate();
                    const formattedDate = date.toLocaleString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false,
                    }).replace('/', '.').replace('/', '.').replace(' ', ' @ ').replace(',', '');
                    // End of pretty format


                    // TODO: the radarplot receives the pretty formatted date and uses this code to retrieve the dateObject which is correct :D
                    // Try to go back
                    const isDateString = formattedDate.replace(/(\d{2})\.(\d{2})\.(\d{4}) @/, '$3-$2-$1T').replace(/\s/, '');
                    const dateObject = new Date(Date.parse(isDateString));

                    console.log(dateObject === dateTime.toDate()); // Doesn't work
                    console.log(dateTime.toDate().toISOString().substring(0, 19) === dateObject.toISOString().substring(0, 19)); // Works
                    // End try to go back

                    // Find the right questionnaire by the given date --> Needs to use a substring because there can be a slight difference in the milliseconds
                    if(dateTime.toDate().toISOString().substring(0, 19) === timestampToSearch.toDate().toISOString().substring(0, 19)){
                        arrayContainingDatetime = form;
                        break;
                    }
                }
                console.log(arrayContainingDatetime);

                // Set the radar with the data of the form
                setRadar(MyResponsiveRadar(arrayContainingDatetime));
                setResults(MyResults(arrayContainingDatetime.themes));
                setRecommendations(MyRecommendations(arrayContainingDatetime.themes));
            } else {
                console.log('No such document!');
            }
        }).catch((error) => {
            console.log('Error getting document:', error);
        });
    }, []);

    return(
        <>
            <Row style={{height: "65vh", marginTop: '2vh'}}>
                <h2>Radar</h2>
                {radar}
            </Row>
            <Row style={{marginTop: '10vh'}}>
                <Col md={3}>
                    <h2>Results</h2>
                    <List type={"unstyled"}>
                        {results}
                    </List>
                </Col>
                <Col md={9}>
                    <h2>Recommendations</h2>
                    <List type={"unstyled"}>
                        {recommendations}
                    </List>
                </Col>
            </Row>
        </>
    )
}

export default function MyFunction() {
    return (
            <RadarFrom/>
        )
};

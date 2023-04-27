import React, {useEffect, useState} from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Timestamp } from "firebase/firestore";
import {MyRecommendations, MyResponsiveRadar, MyResults, MyAnswers} from "./RadarPlotUser";
import {
    Col,
    List,
    ListGroup,
    ListGroupItem,
    Row
} from "reactstrap";
import {useParams} from "react-router-dom";


import firebaseApp from '../initFirebase';
import {useNavigate} from "react-router-dom";


function RadarFrom() {
    // Get the date from the parameter
    const givenDate = useParams();
    const d = Timestamp.fromDate(new Date(givenDate.date));

    // State where the radar (from RadarPlotUser.js) will be stored to be displayed
    const [radar, setRadar] = useState(<></>);
    const [results, setResults] = useState(<></>);
    const [recommendations, setRecommendations] = useState(<></>);
    const [answers, setAnswers] = useState(<></>);

    function setForm(form) {
        // Set the radar with the data of the form
        setRadar(MyResponsiveRadar(form));
        setResults(MyResults(form.themes));
        setRecommendations(MyRecommendations(form.themes));
        setAnswers(MyAnswers(form.themes));
    }

    useEffect(() => {
        // Get current user's id and the reference to the db document with the user's filled questionnaires (aka forms :D)
        const uid = firebase.auth().currentUser.uid;
        const userForms = firebase.firestore().collection('userQuestionnaires').doc(uid);

        userForms.get().then((doc) => {
            if (doc.exists) {
                // Store all the forms in a variable
                const forms = doc.data().questionnaires;

                let form = forms.find(f => f.datetime.toDate().getTime() === parseInt(givenDate.date));
                if (form) {
                    return setForm(form);
                }

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
            <Row style={{marginTop: '10vh', justifyContent: "center"}}>
                <Col md={4}>
                    <h2>Results</h2>
                    <List type={"unstyled"}>
                        {results}
                    </List>
                </Col>
                <Col md={8} style={{display: "flex", justifyContent: "center", flexDirection: "column"}}>
                    <h2>Recommendations</h2>
                    <List type={"unstyled"}>
                        {recommendations}
                    </List>
                </Col>
            </Row>
            <Row style={{marginTop: "10vh"}}>
                <Col>
                    <h2>Your answers</h2>
                    {answers}
                </Col>
            </Row>
        </>
    )
}


export function CheckUpList() {
    const navigate = useNavigate();

    // State to store the content that will be rendered at the website
    const [checkups, setCheckups] = useState(<></>);

    const [isHovered, setIsHovered] = useState(false);

    // Current user's id
    const uid = firebaseApp.auth().currentUser.uid;

    // Document with all the user's forms
    const doc = firebaseApp.firestore().collection('userQuestionnaires').doc(uid);


    const getRadar = (formDate) => {

        // const date = Timestamp.fromDate(formDate).toS
        // const date = new Date(Date.parse(prettydate.replace(/(\d{2})\.(\d{2})\.(\d{4}) @/, '$3-$2-$1T').replace(/\s/, '')));

        navigate(`/radar/${formDate.getTime()}`);
    }


    useEffect(() => {
        doc.get().then((snapshot) => {
            if(snapshot.exists){
                // The user has already filled at least 1 checkup

                const checkups = snapshot.data().questionnaires;
                const dates = checkups.map((checkup, index) => {
                    const formDate = checkup.datetime.toDate();
                    const prettyDate = formDate.toLocaleString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false,
                    }).replace('/', '.').replace('/', '.').replace(' ', ' @ ').replace(',', '');

                    console.log('Im here');

                    return(
                        <ListGroupItem key={index} style={{cursor: 'pointer', textAlign: 'center'}} onClick={() => getRadar(formDate)}>
                            {prettyDate}
                        </ListGroupItem>
                    );
                });

                // Store the formatted dates in the state to be rendered
                setCheckups(dates);
            } else {

            }
        }).catch((error) => {
            console.log('Oh no! There was an error: ', error);
        });
    }, []);

    return(
        <>
            <h3 style={{textAlign: "center", marginTop: "5vh", marginBottom: "2vh"}}>My checkups</h3>
            <ListGroup>
                {checkups}
            </ListGroup>
        </>

    );

}


export default function MyFunction() {
    return (
        <RadarFrom/>
    )
};

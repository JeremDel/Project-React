import React, {useEffect, useRef, useState} from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Timestamp } from "firebase/firestore";
import {
    Button,
    Col,
    List,
    ListGroup,
    ListGroupItem,
    Row, Table
} from "reactstrap";
import {useParams} from "react-router-dom";
import "firebase/compat/auth";
import "firebase/compat/firestore"; // Import Firestore
import 'bootstrap/dist/css/bootstrap.min.css';


import firebaseApp from '../initFirebase';
import {useNavigate} from "react-router-dom";
import {toBlob} from "html-to-image";
import {ResponsiveRadar} from "@nivo/radar";


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

    //This part if for share the image of the radar
    const radarImgRef = useRef(null);
    const handleShare = async () => {
        const newFile = await toBlob(radarImgRef.current);
        const data = {
            files: [
                new File([newFile], 'myRadar.png', {
                    type: newFile.type,
                }),
            ],
            title: 'Image',
            text: 'image',
        };

        try {
            if (!navigator.canShare(data)) {
                console.error("Can't share");
            }
            await navigator.share(data);
        } catch (err) {
            console.error(err);
        }
    }

    return(
        <>
            <h2>Radar</h2>
            <div ref={radarImgRef} style={{height: '100vh'}}>
                {radar}
            </div>
            <Button onClick={handleShare}>Share</Button>
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

function extractResults(data) {
    return data.map((theme) => {
        let radarPoints;

        if (theme.radarInversePoints)
            radarPoints = 100 - ((theme.totPoints/theme.maxPoints) * 100);
        else
            radarPoints = (theme.totPoints / theme.maxPoints) * 100;

        return {
            theme: theme.radarName,
            points: radarPoints
        }
    });
}

/**
 * Radar according to the total points obtained in each theme
 * @returns {JSX.Element}
 * @constructor
 */
export const MyResponsiveRadar = ({themes}) =>{
    const extractedData = extractResults(themes);

    return (
        <>

            <ResponsiveRadar
                data={extractedData}
                keys={  ["points"]
                }
                indexBy= "theme"
                valueFormat=">-.2f"
                margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
                borderColor={{ from: 'color' }}
                gridLevels={10}
                gridLabelOffset={36}
                dotSize={5}
                dotColor={{ theme: 'background' }}
                dotBorderWidth={2}
                colors={{ scheme: 'nivo' }}
                blendMode="multiply"
                motionConfig="wobbly"
                isInteractive={false}
            />

        </>
    );
}



/**
 * List of total points by theme
 * @returns {JSX.Element}
 * @constructor
 */
export const MyResults = (data) => {
    const extractedData = extractResults(data);
    return (
        <>
            {extractedData.map((data, index) => (
                <li key={index} style={{marginBottom: '2vh'}}>{data.theme}: {Math.round(data.points*100)/100}</li>
            ))}
        </>
    )
}

/**
 * List of recommendations
 * @param data
 * @returns {JSX.Element}
 * @constructor
 */
export const MyRecommendations = (data) => {
    let recommendations = [];

    // Loop through every theme of the form
    for(let i = 0; i < data.length; i++){
        const themeRecommendations = data[i].recommendations;

        // Loop through every recommendation
        for(let j = 0; j < themeRecommendations.length; j++){
            const recos = themeRecommendations[j];

            // If there is a text element, there are brochures, so we show everything
            if (recos.text){
                let text = recos.text;
                let brochures = [];
                for(let k = 0; k < recos.brochure.length; k++){
                    const brochure = recos.brochure[k].link;
                    brochures.push(brochure);
                }

                // TODO: Change this code so that it returns actual links instead of only the text
                for(let k = 0; k < brochures.length; k++){
                    text = text + ' ' + brochures[k];
                }

                recommendations.push(text);
            } else { // Else we just store the recommendation
                recommendations.push(recos);
            }
        }
    }
    return(
        <>
            {recommendations.map((recommendation, index) => (
                <li key={index} style={{marginBottom: '2vh'}}>{recommendation}</li>
            ))}
        </>
    )
}

/**
 * Extract all themes, questions and answers
 * @param data
 * @returns {*|FlatArray<*, 3>[]}
 */
function extractQandA(data) {
    return data.map((data) =>
        data.questions.map((question) =>
            question.answers.map((answer) => {
                return {
                    theme: data.name,
                    question: question.label,
                    answer: answer
                };
            })
        )).flat(3);
}

/**
 * Group questions and answers by theme
 * @param data
 * @returns {*}
 */
function groupDataByTheme(data) {
    return extractQandA(data).reduce((acc, cur) => {
        const { theme, question, answer } = cur;
        if (!acc[theme]) {
            acc[theme] = [];
        }
        acc[theme].push({ question, answer });
        return acc;
    }, {});
}

/**
 * Table that contains all questions and answers of the log user
 * @param data
 * @returns {JSX.Element}
 * @constructor
 */
export const MyAnswers = (data) => {
    return (
        <>
            <Table borderless>
                <tbody>
                {Object.entries(groupDataByTheme(data)).map(([theme, questions]) => (
                    <React.Fragment key={theme}>
                        <tr style={{borderBottom: "1px solid black"}}>
                            <th>{theme}</th>
                        </tr>
                        {questions.map((q) => (
                            <tr key={`${q.question}-${q.answer}`}>
                                <td>{q.question}</td>
                                <td>{q.answer}</td>
                            </tr>
                        ))}
                    </React.Fragment>
                ))}
                </tbody>
            </Table>
        </>
    )
}


export default function MyFunction() {
    return (
        <RadarFrom/>
    )
};

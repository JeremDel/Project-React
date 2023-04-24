import React, { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore"; // Import Firestore
import firebaseApp from "../initFirebase";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import {List, Form, Col, Row, Table, Button} from 'reactstrap';

// Fonctionnement: on séllectionne dans la liste demmy checkup une date qui ouvre cette fenêtre
/*
// Merge the JSONs
const result = [];
// Après faire un array avec tous les objets form de la DB appelée inputJSONs --> À modifier parce que le nom est null à chier, le reste c'est pas con
for (let i = 0; i < inputJSONs.length; i++) {
    const inputJSON = inputJSONs[i]; //On garde le json avec les réponses dans une variable inputJSON --> Nom null à chier :)
    const uid = inputJSON.uid; // On garde l'uid de chaque user --> TODO récupérer le nom de l'user pour l'ajouter à la place de l'uid
    for (let j = 0; j < inputJSON.themes.length; j++) {
        const theme = inputJSON.themes[j].name;
        const points = inputJSON.themes[j].points;
        // TODO ajouter le machin points/maxPoints pour avoir le pourcentage
        const itemIndex = result.findIndex(item => item.theme === theme);



        // Si le theme n'existe pas encore dans le result, on le crée, sinon on ajoute juste les points de l'user



        if (itemIndex === -1) {
            result.push({
                theme: theme,
                [uid]: points
            });
        } else {
            result[itemIndex][uid] = points;
        }
    }
}*/

/**
 * Retrieve data for Radar
 */
const extractedData = dataset[0].userid34[0].themes.map(theme => {
    return {
        theme: theme.radarName,
        totalPoints: theme.totalPoints
    };
});

// variable data = json
/**
 * Table that will contain the recommendations
 * @type {*[]}
 */
let recommendations = [];

/**
 * Function that will find and put all recommendations in the table
 * @param obj
 */
function findRecommendations(obj) {
    if (obj && typeof obj === 'object') { // Si l'objet qu'on passe n'est pas null et c'est de type 'object' => clause de finitude
        if (obj.recommendation) { // Si c'est une recommandation on l'ajoute à notre array
            recommendations.push(obj.recommendation);
        }
        Object.values(obj).forEach(val => findRecommendations(val)); // Et on continue à chercher avec les valeurs du node qu'on a passé :3
    }
}

/**
 * Calling the method
 */
findRecommendations(dataset);

/**
 * Retrieve data for Q&A
 * @type {*|FlatArray<*, 3>[]}
 */
const extractedDataQandA = dataset[0].userid34[0].themes.map((theme) =>
    theme.questions.map((question) =>
        question.answers.map((answer) => {
            return {
                theme: theme.name,
                question: question.label,
                answer: answer.label
            };
        })
    )
).flat(3);

/**
 * Extract data for Q&A
 * @type {T}
 */
const groupedData = extractedDataQandA.reduce((acc, cur) => {
    const { theme, question, answer } = cur;
    if (!acc[theme]) {
        acc[theme] = [];
    }
    acc[theme].push({ question, answer });
    return acc;
}, {});

/**
 * Radar according to the total points obtained in each theme
 * @returns {JSX.Element}
 * @constructor
 */
const MyResponsiveRadar = () => (
    <>
        <ResponsiveRadar
            data={extractedData}
            keys={  ["totalPoints"]
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
)

/**
 * List of total points by theme
 * @returns {JSX.Element}
 * @constructor
 */
const MyResults = () => (
    <>
        {extractedData.map((data, index) => (
            <List type="unstyled" key={index}>
                <li>{data.theme}: {data.totalPoints}</li>
            </List>
        ))}
    </>
)

/**
 * List of recommendations
 * @param data
 * @returns {JSX.Element}
 * @constructor
 */
const MyRecommendations = ({ data }) => (
    <>
        {data.map(recommendation => (
            <List type="unstyled">
                <li>{recommendation}</li>
            </List>
        ))}
    </>
)

/**
 * Table that contains all questions and answers of the log user
 * @returns {JSX.Element}
 * @constructor
 */
const MyAnswers = () => (
    <>
        <Table borderless>
            <tbody>
            {Object.entries(groupedData).map(([theme, questions]) => (
                <React.Fragment key={theme}>
                    <tr style={{borderBottom: "1px solid black"}}>
                        <th>{theme}</th>
                    </tr>
                    <tr>
                        <td>{questions[0].question}</td>
                        <td>{questions[0].answer}</td>
                    </tr>
                    {questions.slice(1).map((q) => (
                        <tr key={q.question}>
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

/**
 * Form that contains all information (radar, results, recommendations and Q&A)
 * @returns {JSX.Element}
 * @constructor
 */
const Checkup = () => (
    <>
        <Form>
            <Row style={{height: "90vh"}}>
                <h2>Radar</h2>
                <MyResponsiveRadar/>
            </Row>
            <Row style={{marginTop: "10vh"}}>
                <Col md={6}>
                    <h2>Results</h2>
                    <div>
                        <MyResults/>
                    </div>
                </Col>
                <Col md={6} style={{display: "flex", justifyContent: "center", flexDirection: "column"}}>
                    <h2>Recommendations</h2>
                    <MyRecommendations data={recommendations}/>
                </Col>
            </Row>
            <Row style={{marginTop: "10vh"}}>
                <Col>
                    <h2>Your answers</h2>
                    <MyAnswers/>
                </Col>
            </Row>
        </Form>
    </>
)

export default Checkup;
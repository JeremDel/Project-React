import React from "react";
import "firebase/compat/auth";
import "firebase/compat/firestore"; // Import Firestore
import 'bootstrap/dist/css/bootstrap.min.css';
import {Col, Form, List, Row, Table} from 'reactstrap';
import {ResponsiveRadar} from '@nivo/radar';

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
/*const extractedData = dataset[0].userid34[0].themes.map(theme => {
    return {
        theme: theme.radarName,
        totalPoints: theme.totalPoints
    };
});*/

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
// TODO: <--------------------------->
// TODO: Find every object recursively
// TODO: <--------------------------->
/*function findRecommendations(obj) {
    if (obj && typeof obj === 'object') { // Si l'objet qu'on passe n'est pas null et c'est de type 'object' => clause de finitude
        if (obj.recommendation) { // Si c'est une recommandation on l'ajoute à notre array
            recommendations.push(obj.recommendation);
        }
        Object.values(obj).forEach(val => findRecommendations(val)); // Et on continue à chercher avec les valeurs du node qu'on a passé :3
    }
}*/

/**
 * Calling the method
 */
// TODO : THIS WAS NOT COMMENTED
//findRecommendations(dataset);

/**
 * Retrieve data for Q&A
 * @type {*|FlatArray<*, 3>[]}
 */
// TODO : THIS WAS NOT COMMENTED
/*const extractedDataQandA = dataset[0].userid34[0].themes.map((theme) =>
    theme.questions.map((question) =>
        question.answers.map((answer) => {
            return {
                theme: theme.name,
                question: question.label,
                answer: answer.label
            };
        })
    )
).flat(3);*/

/**
 * Extract data for Q&A
 * @type {T}
 */
// TODO : THIS WAS NOT COMMENTED
/*const groupedData = extractedDataQandA.reduce((acc, cur) => {
    const { theme, question, answer } = cur;
    if (!acc[theme]) {
        acc[theme] = [];
    }
    acc[theme].push({ question, answer });
    return acc;
}, {});*/

/*
* Takes an array from the questionnaire and extracts the data in a format to be directly used by the nivo chart
* Hope it works :D
*
* @returns array
* */
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
export const MyResponsiveRadar = (data) =>{
    const extractedData = extractResults(data.themes);

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
// TODO : THIS WAS NOT COMMENTED
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

/*export const MyResults = (data) => {
    return data.map((theme, index) =>(
        <li key={index} style={{marginBottom: '2vh'}}>{theme.name}: {theme.totPoints}</li>
    ));
};*/

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
 * @returns {JSX.Element}
 * @constructor
 */
// TODO : THIS WAS NOT COMMENTED
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

/**
 * Form that contains all information (radar, results, recommendations and Q&A)
 * @returns {JSX.Element}
 * @constructor
 */
// TODO : THIS WAS NOT COMMENTED
/*const Checkup = () => (
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
)*/
// TODO : THIS WAS NOT COMMENTED
//export default Checkup;
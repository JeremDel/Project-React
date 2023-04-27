import React from "react";
import "firebase/compat/auth";
import "firebase/compat/firestore"; // Import Firestore
import 'bootstrap/dist/css/bootstrap.min.css';
import {Table} from 'reactstrap';
import {ResponsiveRadar} from '@nivo/radar';

// Fonctionnement: on sélectionne dans la liste demmy checkup une date qui ouvre cette fenêtre

/**
 * Extract theme name and convert totPoints for radarPlot
 * @param data
 * @returns {*}
 */
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
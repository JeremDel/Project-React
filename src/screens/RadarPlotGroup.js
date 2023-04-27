import React, {useEffect, useState} from 'react';
import "firebase/compat/auth";
import "firebase/compat/firestore";
import 'bootstrap/dist/css/bootstrap.min.css';
import {ResponsiveRadar} from '@nivo/radar';
import firebaseApp from "../initFirebase";
import {useParams} from "react-router-dom";
import {Row} from "reactstrap";

async function extractMembersData(data) {
    // Get the collections we'll use to get the forms and the users data
    const userForms = firebaseApp.firestore().collection('userQuestionnaires');
    const users = firebaseApp.firestore().collection('users');

    // For each user, get their last form, get the user's data, insert the firstname in the form and return the form
    const questionnaires = await Promise.all(
        data.map(async (user) => {
            // Get form
            const doc = await userForms.doc(user).get();
            if(doc.exists){
                const membersQuestionnaire = doc.data().questionnaires[0];

                // Get user data and insert firstname in form
                const userData = await users.doc(user).get();
                membersQuestionnaire.firstName = userData.data().firstName;

                return membersQuestionnaire;
            }
        })
    );

    return questionnaires;
}

async function getNames(data){
    return data.map((form) => {
        return form.firstName
    });
}

function formatMembersData(data) {
    // Simplify the passed forms to end up with the ideal layout for a nivo chart
    return data.reduce((result, inputJSON) => {
        const { firstName, themes } = inputJSON;

        // For each form calculate the correct amount of points and store the theme name, the first name and the correct points
        themes.forEach((theme) => {
            const calculatePointsForRadar = theme.radarInversePoints
            const percentPoints = calculatePointsForRadar ? 100 - ((theme.totPoints/theme.maxPoints) * 100) : (theme.totPoints / theme.maxPoints) * 100;
            const { name } = theme;

            // If the theme has already been added to the array, add the results, else create a new entry with the user's results
            const item = result.find((item) => item.theme === name);
            if (!item) {
                result.push({ theme: name, [firstName]: percentPoints });
            } else {
                item[firstName] = percentPoints;
            }
        });
        return result;
    }, []);
}

export default function ResponsiveRadarGroup() {
    const givenData = useParams();
    const users = givenData.members.split(',');

    // States that will be used to render the page
    const[formattedData, setFormattedData] = useState([]);
    const[isLoading, setIsLoading] = useState(true);
    const[userNames, setUserNames] = useState([]);
    const [content, setContent] = useState(<></>);

    // At render, get the data for the users and set the states to display the correct elements
    useEffect(() => {
        // Call to the functions that will get the data in the right format
        async function fetchData() {
            let extractedData = await extractMembersData(users);

            //Filter the object to not take into consideration the undefined
            extractedData = extractedData.filter(obj => obj !== undefined);

            const formattedData = await formatMembersData(extractedData);
            setUserNames(await getNames(extractedData));

            // Update the states to display the right element
            setFormattedData(formattedData);
            setIsLoading(false);

            if (formattedData.length !== 0 && formattedData !== undefined){
                setContent(
                    <div style={{height: '80vh'}}>
                        <ResponsiveRadar
                            data={formattedData}
                            keys={ userNames }
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
                            isInteractive={true}
                            legends={[
                                {
                                    anchor: 'top-left',
                                    direction: 'column',
                                    translateX: -50,
                                    translateY: -40,
                                    itemWidth: 80,
                                    itemHeight: 30,
                                    itemTextColor: '#999',
                                    symbolSize: 12,
                                    symbolShape: 'circle',
                                    effects: [
                                        {
                                            on: 'hover',
                                            style: {
                                                itemTextColor: '#000'
                                            }
                                        }
                                    ]
                                }
                            ]}
                        />
                    </div>
                );
            } else {
                setContent(
                    <Row style={{marginTop: '50vh', textAlign: 'center'}}>
                        <h3>Your group has not yet filled any form</h3>
                    </Row>
                );
            }
        }

        fetchData();
    }, [])

    return (
        <>
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                content
            )}
        </>
    );
}
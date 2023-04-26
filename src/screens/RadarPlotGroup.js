import React, {useEffect, useState} from 'react';
import "firebase/compat/auth";
import "firebase/compat/firestore"; // Import Firestore
import 'bootstrap/dist/css/bootstrap.min.css';
import {ResponsiveRadar} from '@nivo/radar';
import firebaseApp from "../initFirebase";

/**
 * Extract theme name and convert totPoints for radarPlot
 * @param data
 * @returns {*}
 */
/*function extractResults(data) {
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
}*/

async function extractMembersData(data) {
    const resultForms = firebaseApp.firestore().collection('userQuestionnaires');
    const userForms = firebaseApp.firestore().collection('users');

    const questionnaires = await Promise.all(data.map(async (user) => {
        const doc = await resultForms.doc(user).get();
        const membersQuestionnaire = doc.data().questionnaires[0];
        const userData = await userForms.doc(user).get();
        membersQuestionnaire.firstName = userData.data().firstName;
        return membersQuestionnaire;
    }));

    return questionnaires;
/*    // la partie qui extract les questionnaire de chaque membre
    const resultForms = firebaseApp.firestore().collection('userQuestionnaires');
    const userForms = firebaseApp.firestore().collection('users');

    const promises = data.map((user) => {
        return resultForms.doc(user).get().then((doc) => {
            const membersQuestionnaire = doc.data()?.questionnaires?.[0];
            if (!membersQuestionnaire) {
                return null;
            }
            return userForms.doc(user).get().then(userData => {
                const firstName = userData?.data()?.firstName;
                if (!firstName) {
                    return null;
                }
                membersQuestionnaire.firstName = firstName;
                return membersQuestionnaire;
            });
        });
    });

    return Promise.all(promises).then(lastQuestionnaire => {
        return lastQuestionnaire.filter(Boolean);
    });*/

/*    // la partie qui extract les questionnaire de chaque membre
    const resultForms = firebaseApp.firestore().collection('userQuestionnaires');
    let lastQuestionnaire = []

    data.forEach((user) => {
        resultForms.doc(user).get().then((doc) => { // on a récupérer tous les questionnaires
           const membersQuestionnaire = doc.data().questionnaires[0]; // questionnaire des memberes dans une variable
            userForms.doc(user).get().then(userData => {
                //firstname.push(userData.data().firstName);
                membersQuestionnaire.firstName = userData.data().firstName;
                lastQuestionnaire.push(membersQuestionnaire)
            });
        });
    });

    return lastQuestionnaire;*/

    // la partie qui extract les noms de chaque membre
/*    const userForms = firebaseApp.firestore().collection('users');
    let firstname = [];
    data.forEach((user) => {
        userForms.doc(user).get().then(userData => {
            firstname.push(userData.data().firstName);
        });
    });*/
    //// Construction data
    // theme : physical activity
    // member1 : 16
    // member2 : 16
    // theme : pain
    // member1 : 16
    // member2 : 16 et ainsi de suite
    // Maintenant faut fusionner les 2 sous cette forme

}

function formatMembersData(data) {
/*    // Merge the JSONs
    const result = [];
    console.log("IIIIIICCCCCIIIII")
    console.log(data)
    // Après faire un array avec tous les objets form de la DB appelée inputJSONs --> À modifier parce que le nom est null à chier, le reste c'est pas co
    for (let i = 0; i < data.length; i++) {
        const inputJSON = data[i];
        //On garde le json avec les réponses dans une variable inputJSON --> Nom null à chier :)
        const uid = inputJSON.uid; // On garde l'uid de chaque user -->
        // TODO récupérer le nom de l'user pour l'ajouter à la place de l'uid
        for (let j = 0; j < inputJSON.themes.length; j++) {
            const theme = inputJSON.themes[j].name;

            const points = inputJSON.themes[j].totPoints; // TODO changer la formule pour prendre le bon calcul des points
            const itemIndex = result.findIndex(item => item.theme === theme); // Si le theme n'existe pas encore dans le result, on le crée, sinon on ajoute juste les points de l'user
            if (itemIndex === -1) {
                result.push({
                    theme: theme,
                    [uid]: points
                });
            } else {
                result[itemIndex][uid] = points;
            }
        }
    }
    return result;*/

    return data.reduce((result, inputJSON) => {
        const { uid, firstName, themes } = inputJSON;
        themes.forEach((theme) => {
            const calculatePointsForRadar = theme.radarInversePoints
            //var points;
            const percentPoints = calculatePointsForRadar ? 100 - ((theme.totPoints/theme.maxPoints) * 100) : (theme.totPoints / theme.maxPoints) * 100;
            /*if (calculatePointsForRadar)
                points = 100 - ((theme.totPoints/theme.maxPoints) * 100);
            else
                points = (theme.totPoints / theme.maxPoints) * 100;*/
            const { name } = theme;
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

export default async function ResponsiveRadarGroup() {

    const[formatedDatad, setFormatedData] = useState([]);

    useEffect(async () => {
        const members = ['mtQPlpToEkezKMVPrlnvkHoAzT12', 'FmngqJEmWWbDTciCeTmNQtJBxB43']
        const extractedData = await extractMembersData(members); //points dans les thèmes du dernier truc rempli
        //console.log(extractedData)
        const formatedData = formatMembersData(extractedData)
        console.log(formatedData)
        setFormatedData(formatedData)
    }, [])
    return (
        <>
            <ResponsiveRadar
                data={formatedDatad}
                //// Construction data
                // theme : physical activity
                // member1 : 16
                // member2 : 16
                // theme : pain
                // member1 : 16
                // member2 : 16 et ainsi de suite

                //Keys = members[name1, name2] dans user
                keys={ ["points"] }
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
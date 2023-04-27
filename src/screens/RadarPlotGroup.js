import React from "react";
import "firebase/compat/auth";
import "firebase/compat/firestore"; // Import Firestore
import 'bootstrap/dist/css/bootstrap.min.css';
import {ResponsiveRadar} from '@nivo/radar';

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

function ResponsiveRadarGroup(data) {
    // les données qu'on lui passe son les ids des membres du groupe
    // il faut extraire le dernier (position 0)
    const extractedMember = extractMember(data);
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
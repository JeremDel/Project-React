import { Link } from "react-router-dom";

import {useParams} from "react-router-dom"
import { useState } from 'react'; 

import { produce } from "immer"
import questionnaire from "../data/questionnaire";



import QuestionnaireNavBar from "./QuestionnaireNavBar";
import QuestionnaireTheme from "./QuestionnaireTheme";
import { useEffect } from "react";
import { Button } from "reactstrap";


import firebase from "firebase/compat/app";
import "firebase/compat/firestore";



export default function Questionnaire() {
  
  const { active_theme } = useParams();

  const [q, setQ] = useState(questionnaire);
  const [uq, setUQ] = useState({
    uid: "UID1",
    themes: questionnaire.themes.map(element => { return null })
  });
  const [themes, setThemes] = useState(questionnaire.themes.map(element => { return null }));
  
  const id = firebase.auth().currentUser.uid;
  const user = firebase.firestore().collection('users').doc(id);

  useEffect(() => {
    console.log(themes);
  }, [themes])

  function saveQuestionnaire() {

  }

  function setThemeInfo(id, info) {
   // console.log(id, info);
    setQ(questionnaire => {
      const nextState = produce(questionnaire, draftState => {
        if (info.valid) {
          draftState.themes[id].points = info.totPoints;
          draftState.themes[id].recommendations = info.recommendations;
        } else {

        }
        
        // draftState[id] = info;
      });

      return nextState;
    })
/*     setThemes(t => {
      const nextState = produce(t, draftState => {
        if (info.valid) {
          themes[active_theme] = info;
        } else {

        }

        draftState[id] = info;
      })  
      return nextState;
    }) */
  }

  let themeIndex = parseInt(active_theme)

  return (
    <div>
      <h1>Checkup</h1>

      <QuestionnaireNavBar themes={ questionnaire.themes } activeTheme={ active_theme } filledThemes={ themes } />

      <QuestionnaireTheme 
        theme={ questionnaire.themes[themeIndex] } 
        themeId={themeIndex}
        key={ "active_theme-" + active_theme } 
        onThemeChange={ setThemeInfo }></QuestionnaireTheme>

      <Button onClick={ saveQuestionnaire }>Save</Button>
      
     
    </div>
  );
}

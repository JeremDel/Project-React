import { Link } from "react-router-dom";

import {useParams} from "react-router-dom"
import { useState } from 'react'; 

import { produce } from "immer"
import questionnaire from "../data/questionnaire";

import QuestionnaireNavBar from "./QuestionnaireNavBar";
import QuestionnaireTheme from "./QuestionnaireTheme";
import { useEffect } from "react";
import { Button } from "reactstrap";

import { addUserQuestionnaire } from '../data/userQuestionnaire';


export default function Questionnaire() {
  
  const { active_theme } = useParams();

  const [q, setQ] = useState(questionnaire);
  const [uq, setUQ] = useState({
    uid: "UID1",
    themes: questionnaire.themes.map(element => { return null })
  });
  const [themes, setThemes] = useState(questionnaire.themes.map((element, i) => { return i === 0 ? true: false }));

  useEffect(() => {
    console.log(themes);
  }, [themes])

  async function saveQuestionnaire() {
    console.log('saveQuestionnaire')
    addUserQuestionnaire(q)
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
      });

      return nextState;
    })

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

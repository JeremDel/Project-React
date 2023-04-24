import { Link } from "react-router-dom";

import {useParams} from "react-router-dom"
import { useState } from 'react'; 

import { produce } from "immer"
import questionnaire from "../data/questionnaire";



import QuestionnaireNavBar from "./QuestionnaireNavBar";
import QuestionnaireTheme from "./QuestionnaireTheme";
import { useEffect } from "react";
export default function Questionnaire() {
  
  const { active_theme } = useParams();

  const [q, setQ] = useState(questionnaire);
  const [uq, setUQ] = useState({
    uid: "UID1",
    themes: questionnaire.themes.map(element => { return null })
  });
  const [themes, setThemes] = useState(questionnaire.themes.map(element => { return null }));

  useEffect(() => {
    console.log(themes);
  }, [themes])

  function setThemeInfo(id, info) {
   // console.log(id, info);
    setThemes(t => {
      const nextState = produce(t, draftState => {
        draftState[id] = info;
      })  
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
     
    </div>
  );
}

import { Link } from "react-router-dom";

import {useParams} from "react-router-dom"

import questionnaire from "../data/questionnaire";



import QuestionnaireNavBar from "./QuestionnaireNavBar";
import QuestionnaireTheme from "./QuestionnaireTheme";
export default function Questionnaire() {
  
  const { active_theme } = useParams();
  let themeIndex = parseInt(active_theme)

  return (
    <div>
      <h1>Checkup</h1>

      <QuestionnaireNavBar themes={ questionnaire.themes } activeTheme={ active_theme } />

      <QuestionnaireTheme theme={ questionnaire.themes[themeIndex] } key={ "active_theme-" + active_theme }></QuestionnaireTheme>

      <hr/>
        <Link to="https://stackoverflow.com/questions/27864951/how-to-access-a-childs-state-in-react/27875018#27875018">Some ideas</Link>
      
    </div>
  );
}

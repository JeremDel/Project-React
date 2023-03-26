import { Link } from "react-router-dom";

import questionnaire from "../data/questionnaire";

import QuestionnaireNavBar from "./QuestionnaireNavBar";
import QuestionnaireTheme from "./QuestionnaireTheme";
import QuestionnaireQuestion from "./QuestionnaireQuestion";
export default function Questionnaire() {

  return (
    <div>
        <p>QuestionnaireNavBar: </p>
      <QuestionnaireNavBar questionnaire={questionnaire}></QuestionnaireNavBar>
      <hr/>
        <p>QuestionnaireTheme</p>
        <QuestionnaireTheme theme={questionnaire.themes[0]}></QuestionnaireTheme>
        <hr/>
        <p>QuestionnaireQuestion</p>
        <QuestionnaireQuestion question={questionnaire.themes[1].questions[0]}></QuestionnaireQuestion>
      <hr/>
        <Link to="https://stackoverflow.com/questions/27864951/how-to-access-a-childs-state-in-react/27875018#27875018">Some ide</Link>
        <p>Fill out the questionnaire!</p>
      <p>
        <Link to="/">Go To The Home Page</Link>
      </p>
    </div>
  );
}

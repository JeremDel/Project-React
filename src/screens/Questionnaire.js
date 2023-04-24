import { Link } from "react-router-dom";

import {useParams} from "react-router-dom"
import { Nav, NavItem, NavLink } from "reactstrap";
import React, { useState } from 'react'; 

import { produce } from "immer"
import questionnaire from "../data/questionnaire";

import QuestionnaireNavBar from "./QuestionnaireNavBar";
import QuestionnaireTheme from "./QuestionnaireTheme";
import { useEffect } from "react";
import { Button } from "reactstrap";

import { addUserQuestionnaire } from '../data/userQuestionnaire';


export default class Questionnaire extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      questionnaire: questionnaire,
      currentTheme: 0,
      valid: false
    };
    this.setThemeInfo = this.setThemeInfo.bind(this);
    this.saveQuestionnaire = this.saveQuestionnaire.bind(this);
  } 

  // const { active_theme } = useParams();

  // const [q, setQ] = useState(questionnaire);
  // const [uq, setUQ] = useState({
  //   uid: "UID1",
  //   themes: questionnaire.themes.map(element => { return null })
  // });
  // const [themes, setThemes] = useState(questionnaire.themes.map((element, i) => { return i === 0 ? true: false }));

  // useEffect(() => {
  //   console.log(themes);
  // }, [themes])

  async saveQuestionnaire() {
    console.log('saveQuestionnaire')
    addUserQuestionnaire(this.state.questionnaire)
  }


  setThemeInfo(id, theme) {
   // console.log(id, info);
    this.setState(state => {
      const nextState = produce(state.questionnaire, draftState => {
        draftState.themes[id] = theme;
        // if (info.valid) {
        //   draftState.themes[id].points = info.totPoints;
        //   draftState.themes[id].recommendations = info.recommendations;
        // } else {

        // }
      });

      console.log(nextState)
      return { questionnaire: nextState };
    })

  }



  // let themeIndex = parseInt(active_theme)

  render() {
    let themes = this.state.questionnaire.themes;
    let activeTheme = themes[this.state.currentTheme];
    return (
      <div>
        <h1>Checkup</h1>

        <Nav tabs>

        {
            this.state.questionnaire.themes.map((theme, index) => (
                <NavItem key={ 'theme-' + index}>
                    <NavLink
                        className={this.state.currentTheme === index ? "active" : ""}
                        onClick={() => {
                            this.setState({ currentTheme: index });
                        }}
                        role="button"
                    >
                        {theme.name}
                    </NavLink>
                </NavItem>
            )) 
        }
        </Nav>

        <QuestionnaireTheme 
          theme={ this.state.questionnaire.themes[this.state.currentTheme] } 
          themeId={this.state.currentTheme}
          key={ "active_theme-" + this.state.currentTheme } 
          onThemeChange={ this.setThemeInfo }></QuestionnaireTheme>

        <Button onClick={ this.saveQuestionnaire }>Save</Button>
        
      
      </div>
    );
  }
}

import { Nav, NavItem, NavLink } from "reactstrap";
import React from 'react'; 

import { produce } from "immer"
import questionnaire from "../data/questionnaire";

import QuestionnaireTheme from "./QuestionnaireTheme";
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

  async saveQuestionnaire() {
    console.log('saveQuestionnaire')
    addUserQuestionnaire(this.state.questionnaire)
  }


  setThemeInfo(id, theme) {
    this.setState(state => {
      const nextState = produce(state.questionnaire, draftState => {
        draftState.themes[id] = theme;
      });

      console.log(nextState)
      return { questionnaire: nextState };
    })
  }

  
  render() {
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

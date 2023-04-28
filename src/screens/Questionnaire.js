import { Nav, NavItem, NavLink } from "reactstrap";
import React from 'react'; 
import { Navigate } from "react-router-dom";

import { produce } from "immer"
import getQuestionnaire from "../data/questionnaire";

import QuestionnaireTheme from "./QuestionnaireTheme";
import { Button } from "reactstrap";

import { addUserQuestionnaire } from '../data/userQuestionnaire';


export default class Questionnaire extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      questionnaire: null,
      currentTheme: 0,
      valid: false,
      savedRef: false
    };
    this.setThemeInfo = this.setThemeInfo.bind(this);
    this.saveQuestionnaire = this.saveQuestionnaire.bind(this);

    getQuestionnaire().then(questionnaire => {
      this.setState({questionnaire});
    });
  } 

  async saveQuestionnaire() {
    console.log('saveQuestionnaire')
    let ref = await addUserQuestionnaire(this.state.questionnaire)
    this.setState({ savedRef: ref });
  }


  setThemeInfo(id, theme) {
    this.setState(state => {
      const nextState = produce(state.questionnaire, draftState => {
        draftState.themes[id] = theme;
        draftState.valid = draftState.themes.find(theme => ! theme.valid) === undefined;
      });

      return { questionnaire: nextState };
    })
  }

  
  render() {
    return (
      <div style={{marginTop: "10vh"}}>
        <h1 style={{marginBottom: "5vh"}}>Checkup</h1>

        { this.state.questionnaire ? (
          <>
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
                          disabled={ index > 0 && ! this.state.questionnaire.themes[index -  1].valid }
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


          <p>
            <Button 
              onClick={ 
                () => this.setState(state => ({
                  currentTheme: state.currentTheme - 1
                }))
              }
              disabled={ this.state.currentTheme === 0 }
              >
              Previous theme
            </Button>

            <Button 
              onClick={ 
                () => this.setState(state => ({
                  currentTheme: state.currentTheme + 1
                }))
              }
              disabled={ 
                ! this.state.questionnaire.themes[this.state.currentTheme].valid
                ||
                this.state.currentTheme + 1 === this.state.questionnaire.themes.length
              }
              color={this.state.questionnaire.valid ? 'secondary' : 'primary' }
              >
              Next theme
            </Button>

          </p>

          {
            this.state.questionnaire.valid ? (
              <Button size="lg" onClick={ this.saveQuestionnaire } disabled={ ! this.state.questionnaire.valid } color="primary">Save</Button>
            ) : <></>
            
          }
          
          </>
        ) : (
          <>Loading...</>
        )}

        { this.state.savedRef && <Navigate to={ "/radar/" + this.state.savedRef } replace={true} /> }
      </div>
    );
  }
}

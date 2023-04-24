// import { Link } from "react-router-dom";
import React from 'react';
import { produce } from "immer"

import QuestionnaireQuestion from './QuestionnaireQuestion';
import { Col, Row } from 'reactstrap';
export default class QuestionnaireTheme extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            theme: this.props.theme,
        //   questions: this.props.theme.questions.map((e, i) => null),
            currentQuestion: 0,
        //   totPoints: 0,
        //   recommendations: [],
        //   valid: false
        };
        this.onQuestionStateChange = this.onQuestionStateChange.bind(this);
        this.onFlowQuestionChange = this.onFlowQuestionChange.bind(this);
      }    

    themeInfo() {
        if ( this.props.theme.info) {
            return <p><em>{ this.props.theme.info }</em></p>
        }
    }

    /* onThemeChange() {
        this.props.onThemeChange(this.state);
    } */

    onQuestionStateChange(questionId, qState) {

        // console.log(questionId, qState);
        // return
        this.setState(state => {

            const nextState = produce(state.theme, draftState => {

                
                draftState.questions[questionId].selectedOptions = qState;

                let validQuestions = 0;
                draftState.totPoints = 0;
                draftState.recommendations = [];

                draftState.questions.forEach((q, qi) => {
                    if (q.hasOwnProperty('selectedOptions')) {
                        if (q.selectedOptions.length) {
                            validQuestions++;
                        }

                        q.selectedOptions.forEach(ai => {
                            let answer = q.answers[ai];
                            draftState.totPoints += answer.points;

                            if (answer.recommendation) {
                                draftState.recommendations.push(answer.recommendation);
                            }
                            else if (answer.recommendations) {
                                draftState.recommendations = draftState.recommendations.concat(answer.recommendations)
                            }
                        })
                    }
                })

                draftState.valid = validQuestions === this.props.theme.questions.length;
            })

            return {theme: nextState}; 
        }, () => { 
            this.props.onThemeChange(this.props.themeId, this.state.theme) 
        })
    }

    onFlowQuestionChange(questionId, qState) {
        console.log(questionId, qState);

        this.setState(state => {

            const nextState = produce(state, draftState => {

                draftState.theme.questions[questionId].selectedOptions = qState;
                draftState.theme.totPoints = draftState.theme.defaultPoints;
                if (!state.theme.hasOwnProperty('recommendations')) {
                    draftState.theme.recommendations = [];
                }

                let answer = draftState.theme.questions[questionId].answers[qState[0]];

                if (answer.hasOwnProperty('points')) {
                    draftState.theme.totPoints = answer.points;
                }

                if (answer.recommendation) {
                    draftState.theme.recommendations.push(answer.recommendation);
                }
                else if (answer.recommendations) {
                    draftState.theme.recommendations = draftState.theme.recommendations.concat(answer.recommendations)
                }

                if (answer.goto) {
                    draftState.currentQuestion = draftState.theme.questions.findIndex(element => element.id === answer.goto);
                }
                else {
                    draftState.theme.valid = true;
                }
                // let answer

                /* 

                let validQuestions = 0;
                draftState.totPoints = 0;
                draftState.recommendations = [];

                draftState.questions.forEach((q, qi) => {
                    if (q.hasOwnProperty('selectedOptions')) {
                        if (q.selectedOptions.length) {
                            validQuestions++;
                        }

                        q.selectedOptions.forEach(ai => {
                            let answer = q.answers[ai];
                            draftState.totPoints += answer.points;

                            if (answer.recommendation) {
                                draftState.recommendations.push(answer.recommendation);
                            }
                            else if (answer.recommendations) {
                                draftState.recommendations = draftState.recommendations.concat(answer.recommendations)
                            }
                        })
                    }
                })

                draftState.valid = validQuestions === this.props.theme.questions.length; */
            })

            return nextState; 
        }, () => { 
            this.props.onThemeChange(this.props.themeId, this.state.theme) 
        })        
    }

    questions() {
        if (this.props.theme.type === 'Flow') {
            let question = this.props.theme.questions[this.state.currentQuestion];
            return (
                <QuestionnaireQuestion 
                    question={ question } 
                    questionId={ this.state.currentQuestion } 
                    type="Single" 
                    key={'q-' + this.state.currentQuestion} 
                    onStateChange={ this.onFlowQuestionChange } />
            )
        }
        else {
            let questionList = this.props.theme.questions;
            return (
                <>
                {
                    questionList.map((question, index) => <QuestionnaireQuestion question={ question } questionId={ index } type={ this.props.theme.type } key={'q-' + index} onStateChange={ this.onQuestionStateChange } />)
                }              
                </>
            );
        }
    }

    render() {
        return (
            <div>
                <Row>
                    <Col md={9}>
                        <h2>{ this.props.theme.name }</h2>


                        { this.themeInfo() } 
                        { this.questions() }                        
                    </Col>

                    <Col md={3}>
                        <pre>{ JSON.stringify(this.state, null, 4) }</pre>

                    </Col>
                </Row>


                
            </div>
        );
    } 
}

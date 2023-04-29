import React from 'react';
import { produce } from "immer"
import { Button } from "reactstrap";

import QuestionnaireQuestion from './QuestionnaireQuestion';

export default class QuestionnaireTheme extends React.Component {

    constructor(props) {
        super(props);


        let stateTheme = produce(this.props.theme, draftTheme => {
            if (draftTheme.type === 'Flow' && ! draftTheme.hasOwnProperty('flow'))
                draftTheme.flow = [0];
        });
        this.state = {
            theme: stateTheme,
            currentQuestion: 0
        };
        this.onQuestionStateChange = this.onQuestionStateChange.bind(this);
        this.onFlowQuestionChange = this.onFlowQuestionChange.bind(this);
      }    

    themeInfo() {
        if ( this.props.theme.info) {
            return <p><em>{ this.props.theme.info }</em></p>
        }
    }

    onQuestionStateChange(questionId, qState) {

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

    unsetRemovedFlowQuestions(questions, flow, currentQuestionFlowIndex) {
        let toUnsetQ = flow.slice(currentQuestionFlowIndex + 1);
        toUnsetQ.forEach(qIdx => {
            questions[qIdx].selectedOptions = [];
        });
    }

    onFlowQuestionChange(questionId, qState) {

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


                if (answer.goto) {
                    let nextQuestion = draftState.theme.questions.findIndex(element => element.id === answer.goto);
                    let currentQuestionFlowIndex = draftState.theme.flow.indexOf(draftState.currentQuestion);
                    let removingLength = draftState.theme.flow.length - currentQuestionFlowIndex + 1;
                     
                    this.unsetRemovedFlowQuestions(draftState.theme.questions, draftState.theme.flow, currentQuestionFlowIndex);
                    draftState.theme.flow.splice(currentQuestionFlowIndex + 1, removingLength, nextQuestion);
                    draftState.theme.valid = false;
                }
                else {
                    let currentQuestionFlowIndex = draftState.theme.flow.indexOf(draftState.currentQuestion);
                    let removingLength = draftState.theme.flow.length - currentQuestionFlowIndex + 1;
                    this.unsetRemovedFlowQuestions(draftState.theme.questions, draftState.theme.flow, currentQuestionFlowIndex);
                     
                    draftState.theme.flow.splice(currentQuestionFlowIndex + 1, removingLength);

                    draftState.theme.valid = true;

                    // Theme is valid, build recommendations
                    draftState.theme.recommendations = [];
                    draftState.theme.questions.forEach((q, qi) => {
                        
                        if (q.hasOwnProperty('selectedOptions')) {
                            q.selectedOptions.forEach(ai => {
                                let answer = q.answers[ai];
                                // draftState.totPoints += answer.points;
    
                                if (answer.recommendation) {
                                    draftState.theme.recommendations.push(answer.recommendation);
                                }
                                else if (answer.recommendations) {
                                    draftState.theme.recommendations = draftState.recommendations.concat(answer.recommendations)
                                }
                            })
                        }
                    })

    
                    if (draftState.theme.recommendations.length === 0){
                        draftState.theme.recommendations = [draftState.theme.defaultRecommendation];
                    }
                }
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
                <>
                    <QuestionnaireQuestion 
                        question={ question } 
                        questionId={ this.state.currentQuestion } 
                        type="Single" 
                        key={'q-' + this.state.currentQuestion} 
                        onStateChange={ this.onFlowQuestionChange } />
                    

                    <p>
                        <Button 
                            onClick={ 
                                () => this.setState(state => {
                                    let currentQuestionFlowIndex = state.theme.flow.indexOf(state.currentQuestion);
                                    return {
                                        currentQuestion: state.theme.flow[currentQuestionFlowIndex - 1]
                                    }
                                })
                            }
                            disabled={ this.state.currentQuestion === 0 }
                            size="sm"
                            >
                            Previous question
                        </Button>

                        <Button 
                            onClick={ 
                            () => this.setState(state => {
                                let currentQuestionFlowIndex = state.theme.flow.indexOf(state.currentQuestion);
                                return {
                                    currentQuestion: state.theme.flow[currentQuestionFlowIndex + 1]
                                }
                            })
                            }
                            disabled={ this.state.theme.flow.indexOf(this.state.currentQuestion) === this.state.theme.flow.length - 1 }
                            color={ this.state.theme.valid ? 'secondary' : 'primary' }
                            size="sm"
                            >
                            Next question
                        </Button>

                    </p>
                </>
                
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
                <h2>{ this.props.theme.name }</h2>

                { this.themeInfo() } 

                { this.questions() }                        
            </div>
        );
    } 
}
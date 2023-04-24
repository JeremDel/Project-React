// import { Link } from "react-router-dom";
import React from 'react';
import { produce } from "immer"

import QuestionnaireQuestion from './QuestionnaireQuestion';
import { Col, Row } from 'reactstrap';
export default class QuestionnaireTheme extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          questions: this.props.theme.questions.map((e, i) => null),
          currentQuestion: 0,
          totPoints: 0,
          recommendations: [],
          valid: false
        };
        this.onQuestionStateChange = this.onQuestionStateChange.bind(this);
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

        this.setState(state => {

            const nextState = produce(state, draftState => {
                draftState.questions[questionId] = qState;

                let validQuestions = 0;
                draftState.totPoints = 0;
                draftState.recommendations = [];
                this.props.theme.questions.forEach((q, qi) => {
                    if (draftState.questions[qi] !== null) {
                        if (draftState.questions[qi].length) {
                            validQuestions++;
                        }
                        draftState.questions[qi].forEach(ai => {
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

            return nextState
        }, () => { 
            this.props.onThemeChange(this.props.themeId, this.state) 
        })
    }

    onFlowQuestionChange() {

    }

    questions() {
        if (this.props.theme.type === 'Flow') {
            return <></>
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

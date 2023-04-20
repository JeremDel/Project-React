// import { Link } from "react-router-dom";
import React from 'react';
import QuestionnaireQuestion from './QuestionnaireQuestion';
import { Col, Row } from 'reactstrap';
export default class QuestionnaireTheme extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          questions: this.props.theme.questions.map((e, i) => { return { valid: false, answers: [] } })
        };
        this.onQuestionStateChange = this.onQuestionStateChange.bind(this);
      }    

    themeInfo() {
        if ( this.props.theme.info) {
            return <p><em>{ this.props.theme.info }</em></p>
        }
    }

    onQuestionStateChange(questionId, state) {

        this.setState(state => {
            let questions = state.questions
        })
        let newState = { answers: {}};
        newState.answers[questionId] = state.answers;

        if (this.props.theme === 'Flow') {
            this.setState (newState)
        }
        else {
           this.setState (newState)
        }
    }

    questions() {
        if (this.props.theme.type === 'Flow') {
            return <></>
        }
        else {
            let questionList = this.props.theme.questions;
            // console.log(questionList);
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

        // console.log(this.props);

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

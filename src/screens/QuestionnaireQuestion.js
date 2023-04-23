// import { Link } from "react-router-dom";
import React from 'react';
import {
    Button,
    Col,
    Form,
    FormGroup,
    Input,
    Label,
    ListGroup,
    ListGroupItem,
    Row,
    UncontrolledAlert
} from 'reactstrap'

export default class QuestionnaireQuestion extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          answers: [],
          disabledCheckbox: []
        };
        this.toggleRadio = this.toggleRadio.bind(this);
        this.toggleCheckbox = this.toggleCheckbox.bind(this);

       /*  this.answers = this.props.question.answers.map((a, i) => {
            return {
                answer: a,
                index: i
            };
        }) */

        this.exclusiveAnswers = [];
        this.nonExclusiveAnswers = [];

        this.props.question.answers.forEach((element, index) => {
            if (element.exclusive) {
                this.exclusiveAnswers.push(index);
            }
            else {
                this.nonExclusiveAnswers.push(index);
            }
        });

        // this.exclusiveAnswers = this.answers.filter(el => el.a.exclusive ? true: false).map(el => el.index)
      }
    
      toggleRadio(event) {
        this.setState({ answers: [ parseInt(event.target.value) ]}, this.triggerNewState);
      }

      triggerNewState() {
        this.props.onStateChange(this.props.questionId, this.state.answers)
      }

      toggleCheckbox(event) {
        let t = event.target;
        console.log(t.name, t.value);
        let value = parseInt(t.value);
        
        
        this.setState(state => { 
            let newState = {
                answers : [],
                disabledCheckbox : state.disabledCheckbox
            }

            if (t.checked) {
                newState.answers = [...state.answers, value].sort();

                if (this.props.question.answers[value].exclusive) {
                    // Disable other checkboxes
                    newState.disabledCheckbox = this.nonExclusiveAnswers;
                }
                else {
                    newState.disabledCheckbox = this.exclusiveAnswers;
                }
            } 
            else {
                newState.answers = state.answers.filter(v => v !== value).sort()

                if (newState.answers.length === 0) {
                    // remove disabling checkboxes
                    newState.disabledCheckbox = []
                }
            }
            
            //this.triggerNewState(newState)

            return newState
        }, this.triggerNewState)
    }

    formControl(questionId, answerId) {


        if (this.props.type === 'Single') {
            return <input 
                    type="radio" 
                    name={ questionId } 
                    value={ answerId } 
                    onChange={ this.toggleRadio }
                     />
        }

        if (this.props.type === 'Multiple') {
            console.log(typeof answerId);

            return <input 
                    type="checkbox" 
                    name={ questionId + "[" + answerId + "]"} 
                    value={ answerId } 
                    onChange={ this.toggleCheckbox }
                    disabled={ this.state.disabledCheckbox.indexOf(answerId) > -1 }
                     />
        }

    }

    render(){
        
        return (
            <div>
                <Row>
                    <Col md={9}>
                                
                        <p><b>{this.props.question.label}</b></p>
                        <ul className="answersList">
                            {
                                this.props.question.answers.map((answer, index) => {
                                    return (
                                        <li key={ 'a-' + index }>
                                            <label>
                                                { this.formControl(this.props.questionId, index) }
                                                &nbsp;
                                                { answer.label }
                                            </label>
                                        </li>
                                    )
                                })
                            }                
                        </ul>

                    </Col>
                    <Col md={3}>
                        <pre>{ JSON.stringify(this.state, null, 4) }</pre>
                    </Col>
                </Row>
            </div>
        );
    } 
}

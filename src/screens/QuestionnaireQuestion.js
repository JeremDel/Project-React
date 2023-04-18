// import { Link } from "react-router-dom";
import React from 'react';

export default class QuestionnaireQuestion extends React.Component {

    formControl(questionId, answerId) {


        if (this.props.type === 'Single') {
            return <input 
                    type="radio" 
                    name={ "answer[" + questionId + "]" } 
                    value={answerId} 
                    onChange={ e => this.toggleRadio(e.target) } />
        }

        if (this.props.type === 'Multiple') {
            return <input 
                    type="checkbox" 
                    name={ "answer[" + questionId + "][]"} 
                    value={ answerId } 
                    onChange={ e => this.toggleCheckbox(e.target) } />
        }

    }

    render(){
        
        return (
            <div>
                <p><b>{this.props.question.label}</b></p>
                <ul class="answersList">
                    {
                        this.props.question.answers.map((answer, index) => {
                            return (
                                <li>
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

            </div>
        );
    } 
}

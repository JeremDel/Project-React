import React from 'react';


export default class QuestionnaireQuestion extends React.Component {

    constructor(props) {
        super(props);

        let selectedOptions = [];
        if (this.props.question.hasOwnProperty('selectedOptions')) {
            selectedOptions = this.props.question.selectedOptions;
        }

        this.state = {
            selectedOptions: selectedOptions,
            disabledCheckbox: []
        };
        this.toggleRadio = this.toggleRadio.bind(this);
        this.toggleCheckbox = this.toggleCheckbox.bind(this);

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
      }
    
      toggleRadio(event) {
        this.setState({ selectedOptions: [ parseInt(event.target.value) ]}, this.triggerNewState);
      }

      triggerNewState() {
        this.props.onStateChange(this.props.questionId, this.state.selectedOptions)
      }

      toggleCheckbox(event) {
        let t = event.target;
        let value = parseInt(t.value);
                
        this.setState(state => { 
            let newState = {
                selectedOptions : [],
                disabledCheckbox : state.disabledCheckbox
            }

            if (t.checked) {
                newState.selectedOptions = [...state.selectedOptions, value].sort();

                if (this.props.question.answers[value].exclusive) {
                    // Disable other checkboxes
                    newState.disabledCheckbox = this.nonExclusiveAnswers;
                }
                else {
                    newState.disabledCheckbox = this.exclusiveAnswers;
                }
            } 
            else {
                newState.selectedOptions = state.selectedOptions.filter(v => v !== value).sort()

                if (newState.selectedOptions.length === 0) {
                    // remove disabling checkboxes
                    newState.disabledCheckbox = []
                }
            }

            return newState
        }, this.triggerNewState)
    }

    formControl(questionId, answerId, answer) {

        if (this.props.type === 'Single') {
            return <input 
                    type="radio" 
                    name={ questionId } 
                    value={ answerId }
                    checked={ this.state.selectedOptions.indexOf(answerId) > -1 }
                    onChange={ (e) => this.toggleRadio(e, answer) }
                     />
        }

        if (this.props.type === 'Multiple') {

            return <input 
                    type="checkbox" 
                    name={ questionId + "[" + answerId + "]"} 
                    value={ answerId } 
                    checked={ this.state.selectedOptions.indexOf(answerId) > -1 }
                    onChange={ (e) => this.toggleCheckbox(e, answer) }
                    disabled={ this.state.disabledCheckbox.indexOf(answerId) > -1 }
                     />
        }

    }

    render(){
        
        return (
            <>
                <p><b>{this.props.question.label}</b></p>
                <ul className="answersList">
                    {
                        this.props.question.answers.map((answer, index) => {
                            return (
                                <li key={ 'a-' + index }>
                                    <label>
                                        { this.formControl(this.props.questionId, index, answer) }
                                        &nbsp;
                                        { answer.label }
                                    </label>
                                </li>
                            )
                        })
                    }                
                </ul>
            </>
        );
    } 
}

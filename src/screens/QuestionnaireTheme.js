// import { Link } from "react-router-dom";
import React from 'react';
import QuestionnaireQuestion from './QuestionnaireQuestion';
export default class QuestionnaireTheme extends React.Component {

    themeInfo() {
        if ( this.props.theme.info) {
            return <p><em>{ this.props.theme.info }</em></p>
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
                    questionList.map((question, index) => <QuestionnaireQuestion question={ question } questionId={ index } type={ this.props.theme.type } key={'q-' + index} />)
                }              
                </>

            );
        }
    }

    render() {

        // console.log(this.props);

        return (
            <div>
                <h1>{ this.props.theme.name }</h1>
                { this.themeInfo() } 
                { this.questions() }

                
            </div>
        );
    } 
}

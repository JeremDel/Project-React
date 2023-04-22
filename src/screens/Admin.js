import React from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import questionnaire from '../data/questionnaire.js';

/** Firebase : Collection = questionnaires / document = 1PAYZF2hVLLz9GUyQQYA FUNCTIONAL COMPONENT*/

class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            json: JSON.stringify(questionnaire),
            errorMessage: null,
            successMessage: null,
            showSuccessMessage: false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ json: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();
        const db = firebase.firestore();
        try {
            const data = JSON.parse(this.state.json);
            db.collection('questionnaires')
                .doc('default')
                .set(data)
                .then(() => {
                    this.setState({
                        successMessage: 'Questionnaire successfully saved!',
                        showSuccessMessage: true,
                    });
                    setTimeout(
                        () => this.setState({ showSuccessMessage: false }),
                        5000
                    );
                })
                .catch((error) => {
                    this.setState({ errorMessage: error.message });
                });
        } catch (error) {
            this.setState({ errorMessage: error.message });
        }
    }

        render() {
            const { json } = this.state;
            const data = JSON.parse(json);
            return (
                <div>
                    <h2>Questionnaire Editor</h2>
                    {this.state.errorMessage && (
                        <p className="text-danger">{this.state.errorMessage}</p>
                    )}
                    <form onSubmit={this.handleSubmit}>
                        {data.themes.map((theme, themeIndex) => (
                            <div key={themeIndex} className="mb-4">
                                <h4>{theme.name}</h4>
                                {theme.questions.map((question, questionIndex) => (
                                    <div key={questionIndex} className="form-group">
                                        <label htmlFor={`question-${themeIndex}-${questionIndex}`}>
                                            Question
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id={`question-${themeIndex}-${questionIndex}`}
                                            value={question.label}
                                            onChange={(event) => {
                                                const value = event.target.value;
                                                const themes = [...data.themes];
                                                const questions = [...themes[themeIndex].questions];
                                                questions[questionIndex] = { ...question, label: value };
                                                themes[themeIndex] = { ...theme, questions };
                                                const updatedJson = JSON.stringify({ ...data, themes });
                                                this.setState({ json: updatedJson });
                                            }}
                                        />
                                        <label>Answers:</label>
                                        {question.answers.map((answer, answerIndex) => (
                                            <div key={answerIndex} className="form-group">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id={`answer-${themeIndex}-${questionIndex}-${answerIndex}`}
                                                    value={answer.label}
                                                    onChange={(event) => {
                                                        const value = event.target.value;
                                                        const themes = [...data.themes];
                                                        const questions = [...themes[themeIndex].questions];
                                                        const answers = [...questions[questionIndex].answers];
                                                        answers[answerIndex] = { ...answer, label: value };
                                                        questions[questionIndex] = { ...question, answers };
                                                        themes[themeIndex] = { ...theme, questions };
                                                        const updatedJson = JSON.stringify({ ...data, themes });
                                                        this.setState({ json: updatedJson });
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        ))}
                        <div className="fixed-bottom">
                            <button type="submit" className="btn btn-primary">
                                Save
                            </button>
                        </div>
                    </form>
                    {this.state.showSuccessMessage && (
                        <div
                            className="alert alert-success text-center position-fixed bottom-0 start-50 translate-middle-x"
                            role="alert"
                            style={{ zIndex: 9999 }}
                        >
                            {this.state.successMessage}
                        </div>
                    )}
                </div>
            );
        }



}

export default Admin;

import React from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import getQuestionnaire from '../data/questionnaire.js';
import {Nav, NavItem, NavLink} from "reactstrap";
import {produce} from 'immer';

/** Firebase : Collection = questionnaires / document = 1PAYZF2hVLLz9GUyQQYA*/

class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            questionnaire: null,
            errorMessage: null,
            successMessage: null,
            showSuccessMessage: false,
            active_theme: 0
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        getQuestionnaire().then(questionnaire => {
            this.setState({questionnaire});
        })
    }


    handleSubmit(event) {
        event.preventDefault();
        const db = firebase.firestore();
        try {
            db.collection('questionnaires')
                .doc('default')
                .set(this.state.questionnaire)
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
            return (
                <div>
                    <h2>Admin edition page</h2>

                    { this.state.questionnaire ? (
                    <>
                        <Nav tabs>

                        {
                            this.state.questionnaire.themes.map((theme, index) => (
                                <NavItem key={ 'theme-' + index}>
                                    <NavLink
                                        className={this.state.active_theme === index ? "active" : ""}
                                        onClick={() => {
                                            this.setState({active_theme: index});
                                        }}
                                        role="button"
                                    >
                                        {theme.name}
                                    </NavLink>
                                </NavItem>
                            ))
                        }
                        </Nav>

                        {this.state.errorMessage && (
                        <p className="text-danger">{this.state.errorMessage}</p>
                        )}
                        <form onSubmit={this.handleSubmit}>
                        {
                            this.state.questionnaire.themes.map((theme, themeIndex) => {

                                return themeIndex !== this.state.active_theme ? <></> : (
                                    <div key={themeIndex} className="mb-4">
                                        <h4>{theme.name}</h4>
                                        {theme.questions.map((question, questionIndex) => (
                                            <div key={questionIndex} className="form-group">
                                                <label htmlFor={`question-${themeIndex}-${questionIndex}`} className="mb-2">
                                                    Question :
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control mb-3"
                                                    id={`question-${themeIndex}-${questionIndex}`}
                                                    value={question.label}
                                                    onChange={(event) => {
                                                        this.setState(state => {
                                                            const nextState = produce(state.questionnaire, draftState => {
                                                                draftState.themes[themeIndex].questions[questionIndex].label = event.target.value;
                                                            });
                                                            return { questionnaire: nextState };
                                                        });
                                                    }}
                                                />
                                                <div className="mb-2">
                                                    <label>Answers :</label>
                                                </div>
                                                {question.answers.map((answer, answerIndex) => (
                                                    <div key={answerIndex} className="form-group">
                                                        <input
                                                            type="text"
                                                            className="form-control mb-3"
                                                            id={`answer-${themeIndex}-${questionIndex}-${answerIndex}`}
                                                            value={answer.label}
                                                            onChange={(event) => {
                                                                this.setState(state => {
                                                                    const nextState = produce(state.questionnaire, draftState => {
                                                                        draftState
                                                                            .themes[themeIndex]
                                                                            .questions[questionIndex]
                                                                            .answers[answerIndex]
                                                                            .label = event.target.value;
                                                                    });
                                                                    return { questionnaire: nextState };
                                                                });
                                                            }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                )
                            })
                        }
                        <div className="d-flex justify-content-end">
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
                    </>
                    ) : (
                    <>Loading...</>) 
                    }
                </div>
            );
        }
}

export default Admin;

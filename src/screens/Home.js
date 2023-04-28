import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import firebaseApp from "../initFirebase";
import { Button, Container, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Alert } from "reactstrap";

const Home = () => {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Check if the user is logged in, this will be used to change what the user sees on the home page
    useEffect(() => {
        firebaseApp.auth().onAuthStateChanged((user) => {
            setIsLoggedIn(!!user);
        });
    }, []);

    // Show/Hide the modal and remove the error if there was some
    const toggleModal = () => {
        setShowModal(!showModal);
        setError(null);
    };

    // Try to sign in the user after submitting their email and password
    const handleSignIn = (event) => {
        event.preventDefault();
        firebaseApp.auth().signInWithEmailAndPassword(email, password)
            .then(() => {
                // Hide the modal and redirect the user to their profile page
                toggleModal();
                navigate("/my-data");
            })
            .catch((error) => {
                // If there is an error, we say the email/password was wrong
                setError("The email or password is wrong");
            });
    };

    // Sign out the user
    const handleSignOut = () => {
        firebaseApp.auth().signOut()
            .then(() => {
                setIsLoggedIn(false);
            });
    };

    return (
        <Container className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
            <div className="d-flex justify-content-center mt-5">
                <img src="accueil_sport.jpeg" alt="sport" className="img-fluid" />
            </div>
            {
                // If user IS NOT logged in, show a text saying that it is necessary to be logged in to use the page, else, show a logout button (mainly used for testing purposes)
                !isLoggedIn ? (

                    <div className="text-center mt-5">
                        <h1 className="mb-4">Welcome to the Fitness Check !</h1>
                        <h2>Please, <span onClick={toggleModal} style={{ cursor: 'pointer', textDecoration: "underline", color: "blue"}}>log in</span> or{' '}
                            <span onClick={() => navigate('/signup')} style={{ cursor: 'pointer', textDecoration: "underline", color: "blue"}}>sign up for free</span>
                            {' '}in order to access the health checkup.
                        </h2>
                        <Modal isOpen={showModal} toggle={toggleModal}>
                            <ModalHeader toggle={toggleModal}>Welcome back!</ModalHeader>
                            <ModalBody>
                                {error && <Alert color="danger">{error}</Alert>}
                                <Form>
                                    <FormGroup>
                                        <Label for="email">Email</Label>
                                        <Input type="email" name="email" id="email" value={email} onChange={(event) => {setEmail(event.target.value)}} required />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="password">Password</Label>
                                        <Input type="password" name="password" id="password" value={password} onChange={(event) => {setPassword(event.target.value)}} required />
                                    </FormGroup>
                                </Form>
                            </ModalBody>
                            <ModalFooter>
                                <span style={{margin: "auto"}}>Not yet a member? <Link to={"/signup"}>Join now</Link></span>
                                <Button color="primary" onClick={handleSignIn}>Log In</Button>{' '}
                                <Button color="secondary" onClick={toggleModal}>Cancel</Button>
                            </ModalFooter>
                        </Modal>
                    </div>
                ) : (
                    <div style={{marginBottom: '10vh', textAlign:'center'}}>
                        <h1 className="mb-4">Welcome back to the Fitness Check !</h1>
                        <Button color="primary" onClick={handleSignOut}>Log Out</Button>{' '}
                    </div>
                )
            }
        </Container>
    );
};

export default Home;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import firebaseApp from "../initFirebase";
import { Button, Container } from "reactstrap";

import { StyledFirebaseAuth } from 'react-firebaseui';

const Home = ({ uiConfig }) => {
    const [showAuth, setShowAuth] = useState(false);
    const navigate = useNavigate();

    const handleLoginClick = () => {
        setShowAuth(!showAuth);
    };

    return (
        <Container className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
            <div className="d-flex justify-content-center mt-5">
                <img src="accueil_sport.jpeg" alt="sport" className="img-fluid" />
            </div>
            <div className="text-center mt-5">
                <h1 className="mb-4">Welcome to the Fitness Check !</h1>
                <h2>Please, <span onClick={handleLoginClick} className="text-primary cursor-pointer text-underline">log in</span> or{' '}
                    <Button onClick={() => navigate('/signup')} color="primary">sign up for free</Button> in order to access the health checkup.
                </h2>
                {showAuth && <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebaseApp.auth()} />}
            </div>
        </Container>
    );
};

export default Home;
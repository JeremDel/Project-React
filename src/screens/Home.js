import React, { useState } from 'react';
import firebaseApp from "../initFirebase";
import { Link } from "react-router-dom";
import { Button } from "reactstrap";
import { StyledFirebaseAuth } from 'react-firebaseui';
import './Home.css';

const Home = ({ uiConfig }) => {
    const [showAuth, setShowAuth] = useState(false);

    const handleLoginClick = () => {
        setShowAuth(!showAuth);
    };

    return (
        <div className="home-container">
            <div className="home-image">
                <img src="accueil_sport.jpeg" alt="sport" />
            </div>
            <div className="home-text">
                <h1>Welcome to the Fitness Check !</h1>
                <p>
                    <h2>Please, <span onClick={handleLoginClick} style={{ cursor: 'pointer', textDecoration: 'underline' }}>log in</span> or{' '}
                        <Link to="/signup">sign up for free</Link> in order to access the health checkup.
                    </h2>
                    {showAuth && <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebaseApp.auth()} />}
                </p>
            </div>
        </div>
    );
};

export default Home;
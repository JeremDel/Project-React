import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import firebaseApp from "../initFirebase";
import { Button } from "reactstrap";
import { StyledFirebaseAuth } from 'react-firebaseui';
import './Home.css';

const Home = ({ uiConfig, signInError }) => { // Ajoutez signInError en tant que prop
    // State hook to manage the visibility of the authentication UI
    const [showAuth, setShowAuth] = useState(false);
    // Hook to navigate to different routes in the application
    const navigate = useNavigate();

    // Handle the click event of the log in button
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
                        <Button onClick={() => navigate('/signup')}>sign up for free</Button> in order to access the health checkup.
                    </h2>
                    {/* Render the authentication UI if showAuth is true */}
                    {showAuth && <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebaseApp.auth()} />}
                </p>
                {signInError && <p style={{ color: "red" }}>{signInError}</p>} {/* Affichez le message d'erreur ici */}
            </div>
        </div>
    );
};

export default Home;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Ajoutez cette ligne
import firebaseApp from "../initFirebase";
import { Button } from "reactstrap";
import { StyledFirebaseAuth } from 'react-firebaseui';
import './Home.css';


// The Home component is responsible for rendering the homepage of the application and providing the option for users to log in or sign up.
const Home = ({ uiConfig }) => {
    // State hook to manage the visibility of the authentication UI
    const [showAuth, setShowAuth] = useState(false);
    // Hook to navigate to different routes in the application
    const navigate = useNavigate(); // Ajoutez cette ligne

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
            </div>
        </div>
    );
};

export default Home;

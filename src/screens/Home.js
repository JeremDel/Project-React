// Import React and useState for managing component state
import React, { useState } from 'react';
// Import useNavigate hook for navigation
import { useNavigate } from 'react-router-dom'; // Ajoutez cette ligne
// Import the initialized Firebase instance
import firebaseApp from "../initFirebase";
// Import Button component from reactstrap library
import { Button } from "reactstrap";
// Import StyledFirebaseAuth component for FirebaseUI styling
import { StyledFirebaseAuth } from 'react-firebaseui';
// Import CSS styles for the Home component
import './Home.css';


const Home = ({ uiConfig }) => {
    // State for toggling the visibility of the authentication component
    const [showAuth, setShowAuth] = useState(false);
    // Use the useNavigate hook for navigation
    const navigate = useNavigate(); // Ajoutez cette ligne

    // Handle click event for the login button
    const handleLoginClick = () => {
        setShowAuth(!showAuth);
    };

    // Return the JSX for the Home component
    return (
        <div className="home-container">
            <div className="home-image">
                {/* Image for the home page */}
                <img src="accueil_sport.jpeg" alt="sport" />
            </div>
            <div className="home-text">
                <h1>Welcome to the Fitness Check !</h1>
                <p>
                    <h2>Please, <span onClick={handleLoginClick} style={{ cursor: 'pointer', textDecoration: 'underline' }}>log in</span> or{' '}
                        {/* Navigate to the sign-up page when the button is clicked */}
                        <Button onClick={() => navigate('/signup')}>sign up for free</Button> in order to access the health checkup.
                    </h2>
                    {/* Display the StyledFirebaseAuth component if showAuth is true */}
                    {showAuth && <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebaseApp.auth()} />}
                </p>
            </div>
        </div>
    );
};

export default Home;

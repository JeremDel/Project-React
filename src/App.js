import "./App.css";
import firebase from "firebase/compat/app";
import firebaseApp from "./initFirebase";
import { StyledFirebaseAuth } from "react-firebaseui";
import { useEffect, useState } from "react";
import Questionnaire from "./screens/Questionnaire";
import Home from "./screens/Home";
import { Container } from "reactstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import PageHeader from "./layout/PageHeader";
import MyData from "./screens/MyData";
import { Routes, Route, Navigate } from "react-router-dom";

function App() {
    // Local signed-in state.
    const [isSignedIn, setIsSignedIn] = useState(null);
    const [error, setError] = useState(null); // Add error state

    // Handle sign-in errors and set the error state.
    const handleSignInError = (error) => {
        if (error.code === 'auth/user-not-found') {
            setError("This email doesn't exist");
        } else {
            setError(error.message);
        }
    };

    // Configure FirebaseUI.
    const uiConfig = {
        // Popup signin flow rather than redirect flow.
        signInFlow: "popup",
        // We will display Google and Facebook as auth providers.
        signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
        callbacks: {
            // Avoid redirects after sign-in.
            signInSuccessWithAuthResult: () => false,
            signInFailure: handleSignInError,
        },
    };

    // Listen to the Firebase Auth state and set the local state.
    useEffect(() => {
        const unregisterAuthObserver = firebaseApp
            .auth()
            .onAuthStateChanged((user) => {
                setIsSignedIn(!!user);
            });

        // Make sure we un-register Firebase observers when the component unmounts.
        return () => unregisterAuthObserver();
    }, []);

    // Not initialized yet - Render loading message
    if (isSignedIn === null) {
        return (
            <div className="App">
                <p>Loading...</p>
            </div>
        );
    }

    // Not signed in - Render auth screen
    if (!isSignedIn) {
        return (
            <div className="App">
                <Routes>
                    <Route path="/" element={<Home uiConfig={uiConfig} signInError={error} />} /> {/* Transmettez signInError ici */}
                    <Route path="/login" element={<StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebaseApp.auth()} signInFailure={handleSignInError} />} />
                    <Route path="/signup" element={<MyData />} />
                    <Route path="/*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        );
    }

    // Signed in - Render app
    return (
        <div className="AppContainer">
            <PageHeader></PageHeader>
            <Container>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/checkup" element={<Questionnaire />} />
                    <Route path="/my-data" element={<MyData />} />
                </Routes>
            </Container>
        </div>
    );
}

export default App;

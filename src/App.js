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
import Signup from "./screens/Signup";
import { Routes, Route, Navigate } from "react-router-dom";

function App() {
    // Initialize local states for signed-in status and errors
    const [isSignedIn, setIsSignedIn] = useState(null);
    const [error, setError] = useState(null);

    // Listen to the Firebase Auth state and update the local signed-in state accordingly
    useEffect(() => {
        const unregisterAuthObserver = firebaseApp
            .auth()
            .onAuthStateChanged((user) => {
                setIsSignedIn(!!user);
            });

        // Clean up Firebase observers when the component unmounts
        return () => unregisterAuthObserver();
    }, []);

    // Function to check if the user exists in the database
    const userExists = async (user) => {
        const db = firebaseApp.firestore();
        const userRef = db.collection('users').doc(user.uid);
        const doc = await userRef.get();
        return doc.exists;
    };

    // Configure FirebaseUI with desired settings for sign-in flow and providers
    const uiConfig = {
        // Popup signin flow rather than redirect flow.
        signInFlow: "popup",

        signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
        callbacks: {
            // Customize the sign-in success callback
            signInSuccessWithAuthResult: async (authResult, redirectUrl) => {
                const exists = await userExists(authResult.user);
                if (exists) {
                    // User exists, continue with the default behavior (no redirect)
                    return false;
                } else {
                    // User does not exist, display an error message
                    setError("L'utilisateur n'existe pas.");
                    // Sign out the user
                    firebaseApp.auth().signOut();
                    return false;
                }
            },
        },
    };

    // Display loading message if the signed-in state is not initialized
    if (isSignedIn === null) {
        return (
            <div className="App">
                <p>Loading...</p>
            </div>
        );
    }

    // Display the authentication screen if the user is not signed in
    if (!isSignedIn) {
        return (
            <div className="App">
                <Routes>
                    <Route path="/" element={<Home uiConfig={uiConfig} />} />
                    <Route path="/login" element={<StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebaseApp.auth()} />} />
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        );
    }

    // Render the main application when the user is signed in
    return (
        <div className="AppContainer">
            <PageHeader></PageHeader>
            <Container>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/checkup" element={<Questionnaire />} />
                    <Route path="/signup" element={<Signup />} />
                </Routes>
            </Container>
        </div>
    );
}

export default App;
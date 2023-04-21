import "./App.css";
import firebaseApp from "./initFirebase";
import { useEffect, useState } from "react";
import Questionnaire from "./screens/Questionnaire";
import Home from "./screens/Home";
import { Container } from "reactstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import PageHeader from "./layout/PageHeader";
import MyData from "./screens/MyData";
import { Routes, Route, Navigate } from "react-router-dom";

function App() {
    // Initialize local states for signed-in status and errors
    const [isSignedIn, setIsSignedIn] = useState(null);

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
                    <Route path="/" element={<Home />} />
                    <Route path="/signup" element={<MyData />} />
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
                    <Route path="/my-data" element={<MyData />} />
                </Routes>
            </Container>
        </div>
    );
}

export default App;
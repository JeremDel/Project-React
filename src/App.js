import "./App.css";
import firebaseApp from "./initFirebase";
import { useEffect, useState } from "react";
import {Routes, Route, Navigate} from "react-router-dom";
import Questionnaire from "./screens/Questionnaire";
import Home from "./screens/Home";
import Signup from "./screens/Signup";
import MyFunction from "./screens/RadarUser";
import { Container } from "reactstrap";
import {UserProvider} from "./context/UserContext";
import GroupRadar from "./screens/RadarPlotGroup";


import 'bootstrap/dist/css/bootstrap.min.css';
import PageHeader from "./layout/PageHeader";
import MyData from "./screens/MyData";
import Admin from "./screens/Admin";
import {CheckUpList} from "./screens/RadarUser";

function App() {
  // Local signed-in state.
  const [isSignedIn, setIsSignedIn] = useState(null);

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
  if (!isSignedIn)
    return (
      <div className="App">
          <PageHeader/>
          <Container>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/*" element={<Navigate to="/"/>}/>
            </Routes>
         </Container>
      </div>
    );

  // Signed in - Render app
  return (
    <div className="AppContainer">
      <UserProvider>
        <PageHeader/>
      </UserProvider>
      <Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/checkup" element={<Questionnaire/>} />
          <Route path="/my-data" element={<MyData />} />
          <Route path="/radar" element={<CheckUpList />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/radar/:date" element={<MyFunction />} />
            <Route path="/radarGroup/:members" element={<GroupRadar />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;

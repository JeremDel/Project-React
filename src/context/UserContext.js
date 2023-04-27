import React, {useState, useEffect, createContext} from "react";
import firebaseApp from "../initFirebase";

export const UserContext = createContext();

// User provider that will be used to wrap the children elements to give them access to the global context
export const UserProvider = ({children}) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // When the user changes, this code is executed
        const unsubscribe = firebaseApp.auth().onAuthStateChanged((authUser) => {
            // If the user is authenticated, we get his data and store it in the user state, else we store null in the state
            if(authUser){
                const userRef = firebaseApp.firestore().collection('users').doc(authUser.uid);
                userRef.get().then((doc) => {
                    if(doc.exists){
                        const userData = doc.data();
                        setUser(userData);
                    }
                }).catch((error) => {
                    console.log('Oh no! There was an error: ', error);
                });

                // Even if the user doesn't change, if the user object in the db changes, this code is executed to update the user's data
                const unsubscribe = userRef.onSnapshot((doc) => {
                    if(doc.exists){
                        const userData = doc.data();
                        setUser(userData);
                    }
                });

                return () => {
                    unsubscribe();
                }
            } else {
                setUser(null);
            }
        });

        return () => {
            unsubscribe();
        }
    }, []);

    return (
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    );
};
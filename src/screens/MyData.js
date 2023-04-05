import 'bootstrap/dist/css/bootstrap.min.css';
import {Alert, Button, Col, Form, FormGroup, Input, Label, Row} from 'reactstrap';
import React, {useEffect, useState} from 'react';
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

function UserForm(){
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [birthdate, setBirthdate] = useState("");
    const [sex, setSex] = useState("");

    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {

        // Get current user's id and then get the reference to the db
        const id = firebase.auth().currentUser.uid;
        const user = firebase.firestore().collection('users').doc(id);

        // Get the user when the page is loaded
        user.get().then((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                setFirstName(userData.firstname);
                setLastName(userData.lastname);
                setEmail(userData.email);
                setSex(userData.sex);
                setBirthdate(userData.birthdate);
            } else {
                console.log('No such document!');
            }
        }).catch((error) => {
            console.log('Error getting document:', error);
        });
    }, []);

    const handleSubmit = async(event)  => {
        event.preventDefault();

        // Get the current user
        const id = firebase.auth().currentUser.uid;
        const docRef = firebase.firestore().collection('users').doc(id);

        // Update the user's data
        docRef.update({
           firstname: firstName,
           lastname: lastName,
           email: email,
           birthdate: birthdate,
           sex: sex
        }).then(
            alertUser
        );
    };

    const alertUser = () => {
        setShowAlert(true);

        setTimeout(() => {
            setShowAlert(false);
        }, 2500);
    };

    return(
        <>
            <Form>
                <h2 style={{textAlign: "center", marginTop: "7vh", marginBottom: "5vh"}}>My personal data</h2>
                {
                    // First row: Firstname and Lastname
                }
                <Row>
                    <Col md={6}>
                        <FormGroup>
                            <Label htmlFor={"firstname"}>Firstname</Label>
                            <Input type="text" name="firstname" placeholder={"Firstname"} value={firstName} onChange={(event) => setFirstName(event.target.value)}/>
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <Label htmlFor={"lastname"}>Lastname</Label>
                            <Input type="text" name="lastname" placeholder={"Lastname"}  value={lastName} onChange={(event) => setLastName(event.target.value)}/>
                        </FormGroup>
                    </Col>
                </Row>

                {
                    // Second row: Email address
                }
                <FormGroup>
                    <Label htmlFor={"email"}>Email</Label>
                    <Input type="email" name="email" placeholder={"Email"} value={email} onChange={(event) => setEmail(event.target.value)}/>
                </FormGroup>

                {
                    // Third row : birthdate and sex
                }
                <Row>
                    <Col md={6}>
                        <FormGroup>
                            <Label htmlFor={"birthdate"}>Birthdate</Label>
                            <Input type="date" name="birthdate" placeholder={"Birthdate"} value={birthdate} onChange={(event) => setBirthdate(event.target.value)}/>
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <Col md={1}>
                            <label htmlFor={"sex"}>Sex</label>
                        </Col>
                        <Row style={{marginTop: "1.5vh"}}>
                            <Col md={4}>
                                <FormGroup check>
                                    <Input name={"sex"} type={"radio"} value={"woman"} checked={sex === "woman"} onChange={(event) => setSex(event.target.value)}/>
                                    <Label>Woman</Label>
                                </FormGroup>
                            </Col>
                            <Col md={4}>
                                <FormGroup check>
                                    <Input name={"sex"} type={"radio"} value={"man"} checked={sex === "man"} onChange={(event) => setSex(event.target.value)}/>
                                    <Label>Man</Label>
                                </FormGroup>
                            </Col>
                        </Row>
                    </Col>
                </Row>


                <Button onClick={handleSubmit} color="success" type={"submit"} style={{marginTop: "1vh", marginBottom: "2vh"}}>
                    Save changes
                </Button>
            </Form>

            {showAlert &&
                (
                    <Alert color={"info"} style={{position: 'absolute', bottom: '5vh', left: 0, right: 0, margin: 'auto', width: '75vw'}}>
                        Data updated successfully !
                    </Alert>
                )
            }
        </>
    );
}

export default UserForm;
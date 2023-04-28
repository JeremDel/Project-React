import React, { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore"; // Import Firestore
import firebaseApp from "../initFirebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Form, FormGroup, Label, Input, Alert, Col, Row} from 'reactstrap';

const Signup = () => {
    // Initialize state for form data
    const [formValues, setFormValues] = useState({
        firstName: '',
        lastName: '',
        email: '',
        birthdate: '',
        sex: '',
        password: '',
        repeatPassword: '',
        profileImage: null,
        isLeader: false
    });

    const [errorMessage, setErrorMessage] = useState(null);
    const [feedback, setFeedback] = useState('');
    const [groupName, setGroupName] = useState('');

    const navigate = useNavigate();

    // Update data when inputs change and check checkbox
    const handleInputChange = (event) => {
        const { name, value, type, checked } = event.target;
        setFormValues({ ...formValues, [name]: type === 'checkbox' ? checked : value });

        if (event.target.name === 'password'){
            if(value.length < 6){
                setFeedback('Password must be at least 6 characters long');
            } else {
                setFeedback('');
            }
        }
    };

    // Update profile picture
    const handleFileInputChange = (event) => {
        const file = event.target.files[0];
        setFormValues({ ...formValues, profileImage: file });
    };

    // Handle form submission and create a new user with the entered data
    const handleSubmit = async (e) => {
        e.preventDefault();

        const { firstName, lastName, email, birthdate, sex, password, repeatPassword, profileImage, isLeader } = formValues;

        // Checks before continuing
        if (password !== repeatPassword) {
            setErrorMessage("Passwords don't match");
            return;
        }
        if(password.length < 6){
            setErrorMessage("Password must be at least 6 characters long!");
            return;
        }
        if (isLeader && groupName.length === 0){
            setErrorMessage('You need to select a name for your group!');
            return;
        }

        try {
            // Create a new user with the email and password
            const userCredential = await firebaseApp
                .auth()
                .createUserWithEmailAndPassword(email, password);

            const user = userCredential.user;

            // Update the user's display name
            await user.updateProfile({
                displayName: `${firstName} ${lastName}`,
            });

            const storage = getStorage();

            // Save photo in Firebase
            let photoURL = '';
            if (profileImage) {
                const storageRef = ref(storage, 'images/' + profileImage.name);
                await uploadBytes(storageRef, profileImage);
                const downloadURL = await getDownloadURL(storageRef);
                photoURL = downloadURL;
            }

            // Save user data to Firestore
            const userRef = firebase.firestore().collection('users').doc(user.uid);

            // Save user data to Firestore
            await userRef.set({
                firstName,
                lastName,
                email,
                birthdate: birthdate,
                sex: sex,
                photoURL,
                isLeader
            });

            if(isLeader){
                const groupsCollection = firebaseApp.firestore().collection('groups');
                const newGroup = {
                    leader: user.uid,
                    members: [],
                    name: groupName
                };
                await  groupsCollection.add(newGroup);
            }

            navigate("/");
        } catch (error) {
            setErrorMessage("Oh no! There was an error! Control your inputs!");
            console.log(error)
        }
    };
    // Render the registration form
    return (
        <>
            <Form>
                {errorMessage && <Alert color="danger">{errorMessage}</Alert>}
                <h2 style={{textAlign: "center", marginTop: "7vh", marginBottom: "5vh"}}>Hi new member !</h2>
                {
                    // First row: Firstname and Lastname
                }
                <Row>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="firstName">First Name</Label>
                            <Input type="text" name="firstName" id="firstName" value={formValues.firstName} onChange={handleInputChange} required />
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="lastName">Last Name</Label>
                            <Input type="text" name="lastName" id="lastName" value={formValues.lastName} onChange={handleInputChange} required />
                        </FormGroup>
                    </Col>
                </Row>
                {
                    // Second row: Email address
                }
                <FormGroup>
                    <Label for="email">Email</Label>
                    <Input type="email" name="email" id="email" value={formValues.email} onChange={handleInputChange} required />
                </FormGroup>
                {
                    // Third row : birthdate and sex
                }
                <Row>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="birthdate">Birthdate</Label>
                            <Input type="date" name="birthdate" id="birthdate" value={formValues.birthdate} onChange={handleInputChange} required />
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup style={{textAlign: "center"}}>
                            <Col md={1}>
                                <Label>Sex</Label>
                            </Col>
                            <Row style={{marginTop: "1.5vh"}}>
                                <Col md={4}>
                                    <FormGroup check>
                                        <Label check>
                                            <Input type="radio" name="sex" value="male" onChange={handleInputChange} required />{' '}
                                            Male
                                        </Label>
                                    </FormGroup>
                                </Col>
                                <Col md={4}>
                                    <FormGroup check>
                                        <Label check>
                                            <Input type="radio" name="sex" value="female" onChange={handleInputChange} required />{' '}
                                            Female
                                        </Label>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </FormGroup>
                    </Col>
                </Row>
                {
                    // Information about password for security, check to be a team leader, profile picture and button sign up
                }
                <FormGroup>
                    <Label for="password">Password</Label>
                    <Input type="password" name="password" id="password" value={formValues.password} onChange={handleInputChange} required />
                    {feedback &&
                        (
                            <Label style={{color: "red"}}>Password must be at least 6 characters long.</Label>
                        )
                    }
                </FormGroup>
                <FormGroup>
                    <Label for="confirmPassword">Confirm Password</Label>
                    <Input type="password" name="repeatPassword" id="confirmPassword" value={formValues.repeatPassword} onChange={handleInputChange} required />
                </FormGroup>
                <FormGroup check style={{textAlign: "center"}}>
                    <Label check>
                        <Input type="checkbox" name="isLeader" onChange={handleInputChange} />{' '}
                        I want to be a group leader !
                    </Label>
                </FormGroup>
                {
                    formValues.isLeader && (
                        <FormGroup>
                            <Label htmlFor={"groupName"}>Group name</Label>
                            <Input type={"text"} name={"groupName"} onChange={(event) => {setGroupName(event.target.value)}}/>
                        </FormGroup>
                    )
                }
                <FormGroup>
                    <Label for="profileImage">Profile Image</Label>
                    <Input type="file" name="profileImage" id="profileImage" onChange={handleFileInputChange} />
                </FormGroup>
                <center>
                    <Button color="primary" type="submit" onClick={handleSubmit} disabled={feedback ? true : false}>Sign up</Button>
                </center>
            </Form>
        </>
    );
};
export default Signup;
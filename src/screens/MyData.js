import 'bootstrap/dist/css/bootstrap.min.css';
import {
    Button,
    Col,
    Form,
    FormGroup,
    Input,
    Label,
    ListGroup,
    ListGroupItem,
    Row,
    UncontrolledAlert
} from 'reactstrap';
import React, {useEffect, useState} from 'react';
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

function CustomAlert(props){
    return(
        <UncontrolledAlert color={props.color} style={{position: 'absolute', bottom: '5vh', left: 0, right: 0, margin: 'auto', width: '75vw'}}>
            {props.message}
        </UncontrolledAlert>
    );
}

function UserForm(){
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [birthdate, setBirthdate] = useState("");
    const [sex, setSex] = useState("");
    const [password, setPassword] = useState("");

    const [showAlert, setShowAlert] = useState(false);
    const [alert, setAlert] = useState(<></>);

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

        const user = firebase.auth().currentUser;
        const auth = firebase.auth();
        const credential = firebase.auth.EmailAuthProvider.credential(
            user.email,
            password
        );

        user.reauthenticateWithCredential(credential).then(() => {
            user.updateEmail(email).then(() => {
            }).catch((exception) => {
                console.log(exception);
            });
        }).catch((exception) => {
            console.log(exception);
        });

        // Update display name
        auth.currentUser.updateProfile({
            displayName: firstName + " " + lastName
        }).then(() => {

        }).catch((exception) => {
            console.log(exception);
        });

        // Update users collection
        docRef.update({
            firstname: firstName,
            lastname: lastName,
            email: email,
            birthdate: birthdate,
            sex: sex
        }).then(() => {
            setAlert(<CustomAlert color={"info"} message={"Data updated successfully !"}/>);
            alertUser();
        }).catch((exception) => {
            console.log("Oh no! There was an error: ", exception);
            setAlert(<CustomAlert color={"danger"} message={"There was an error while updating your data, please try again later"} />);
            alertUser();
        }).finally(() => {
            setPassword("");
        });
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

                {
                    // Last row: password for security
                }
                <Row>
                    <Col md={6}>
                        <FormGroup>
                            <Label htmlFor={"password"}>For security reasons, please insert your password</Label>
                            <Input name={"password"} type={"password"} value={password} onChange={(event) => {setPassword(event.target.value)}}/>
                        </FormGroup>
                    </Col>
                </Row>


                <Button onClick={handleSubmit} color="success" type={"submit"} style={{marginTop: "1vh", marginBottom: "2vh"}}>
                    Save changes
                </Button>
            </Form>

            {showAlert &&
                (
                    alert
                )
            }
        </>
    );
}

function TeamManagementForm(){
    const [isLeader, setLeader] = useState(false);
    const [groupUid, setGroupUid] = useState('');
    const [groupName, setGroupName] = useState('');
    const [members, setMembers] = useState([]);

    const [membersNames, setMembersNames] = useState([]);
    const[content, setContent] = useState([]);

    const [email, setEmail] = useState('');

    const[alert, setAlert] = useState(<></>);
    const[alertVisible, setAlertVisible] = useState(false);

    const[userAvailable, setUserAvailable] = useState(true);

    // Get the values of the group if the user is a leader
    useEffect(() => {
        const id = firebase.auth().currentUser.uid;
        const groups = firebase.firestore().collection("groups");

        // We only take the groups where this user is leader (there only should be one group at most!)
        const query = groups.where('leader', '==', id);
        query.get().then((group) => {
            if (!group.empty){
                // The user is a leader, we store the uid of the group to access it faster later
                setLeader(true);
                setGroupUid(group.docs[0].id);

                // Assign the values of the group to the state variables
                const data = group.docs[0].data();
                setGroupName(data.name);
                setMembers(data.members);
            }
        }).catch((error) => {
            console.log('Oh no! There was an error: ', error);
        });
    }, []);

    useEffect(() => {
        // For each member in the members list, get their name and add it to the membersnames list
        const memberNamePromises = members.map((member) => {
            const memberRef = firebase.firestore().collection('users').doc(member);
            return memberRef.get().then((member) => {
                const memberData = member.data();
                return memberData.firstname;
            }).catch((error) => {
                console.log('Oh no! There was an error: ', error);
            });
        });

        Promise.all(memberNamePromises).then((memberNames) => {
            // Once all member names have been retrieved, update the state variables
            setMembersNames(memberNames);

            const contentItems = memberNames.map((name, index) => (
                <>
                    <Row>
                        <Col md={9}>
                            <ListGroupItem key={index}>
                                {name}
                            </ListGroupItem>
                        </Col>
                        <Col md={3}>
                            <Button style={{width: '100%'}} color={"danger"} onClick={() => deleteMember(index)}>
                                Remove
                            </Button>
                        </Col>
                    </Row>
                </>
            ));
            setContent(contentItems);
        }).catch((error) => {
            console.log('Oh no! There was an error: ', error);
        });
    }, [members]);

    const deleteMember = (index) => {
      const newMembers = [...members];
      newMembers.splice(index, 1);
      setMembers(newMembers);

      const group = firebase.firestore().collection('groups').doc(groupUid);
      group.update({
          members: newMembers
      }).then(() => {
          setAlert(<CustomAlert color={"info"} message={"Member removed successfully"}/>);
          notifyUser();
      }).catch((exception) => {
          console.log('Crap! There was an error: ', exception);
      });
    };

    const addMember = (emailAddress) => {
        // Get the user by his email address
        const userCollection = firebase.firestore().collection('users');
        const query = userCollection.where('email', '==', emailAddress);

        query.get().then((users) => {
            if(!users.empty){
                // Get his uid
                const uid = users.docs[0].id;

                // Check that he's not already in a group
                const groupCollection = firebase.firestore().collection('groups');
                const groupQuery = groupCollection.where('members', "array-contains", uid);

                groupQuery.get().then((group) => {
                    if (!group.empty){
                        setUserAvailable(false);
                        console.log('Got im!');
                    } else {
                        setUserAvailable(true);
                    }
                }).catch((exception) => {
                    console.log('Oh no! There was an error: ', exception);
                });

                if(userAvailable){
                    const updatedMembers = [...members, uid];
                    setMembers(updatedMembers);

                    const groupRef = firebase.firestore().collection('groups').doc(groupUid);
                    groupRef.update({
                        members: updatedMembers
                    }).then(() => {
                        setAlert(<CustomAlert color={"info"} message={"Member added successfully"}/>);
                        notifyUser();
                        setEmail('');
                    }).catch((exception) => {
                        console.log('Oh no! There was an error: ', exception);
                    });
                } else {
                    setAlert(<CustomAlert color={"danger"} message={"Member is already in a group!"}/>);
                    notifyUser();
                    setEmail('');
                }
            }
        });
    };

    const notifyUser = () => {
      setAlertVisible(true);

      setTimeout(() => {
          setAlertVisible(false);
      }, 2500);
    };


    return(
        <>
            {
                isLeader &&
                (
                    <h3 style={{textAlign: "center", marginTop: "5vh", marginBottom: "2vh"}}>Manage my team: {groupName}</h3>
                )
            }
            <ListGroup>
                {
                    isLeader &&
                    (
                        content
                    )
                }
            </ListGroup>
                {
                    isLeader &&
                    (
                        <>
                            <Row style={{marginTop: '2vh'}}>
                                <Col md={9}>
                                    <Input type={"email"} placeholder={"New member's email address"} value={email} onChange={(event) => {setEmail(event.target.value)}}/>
                                </Col>
                                <Col md={3}>
                                    <Button color={"success"} style={{width: '100%'}} onClick={() => {addMember(email)}}>Add member</Button>
                                </Col>
                            </Row>
                        </>
                    )
                }
                {
                    alertVisible &&
                    (
                        alert
                    )
                }
        </>
    );
}

export default function MyFunction(){

    return(
        <>
            <UserForm/>
            <Row>
                <Col md={6}>
                    <TeamManagementForm/>
                </Col>
            </Row>
        </>
    );
}
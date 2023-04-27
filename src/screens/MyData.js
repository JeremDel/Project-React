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
import firebaseApp from '../initFirebase';
import "firebase/compat/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import {useNavigate} from "react-router-dom";

function CustomAlert(props){
    return(
        <UncontrolledAlert color={props.color} style={{position: 'absolute', bottom: '5vh', left: 0, right: 0, margin: 'auto', width: '75vw'}}>
            {props.message}
        </UncontrolledAlert>
    );
}

function UserForm(){
    const [userInfo, setUserInfo] = useState({
        firstName: "",
        lastName: "",
        email: "",
        birthdate: null,
        isLeader: false,
        photoURL: "",
        sex: ""
    });

    const [password, setPassword] = useState("");
    const [pfp, setPfp] = useState(null);
    const [imgChange, setImgChange] = useState(false);

    const [showAlert, setShowAlert] = useState(false);
    const [alert, setAlert] = useState(<></>);
    const [imageSrc, setImageSrc] = useState('');

    useEffect(() => {

        // Get current user's id and then get the reference to the db
        const id = firebase.auth().currentUser.uid;
        const user = firebase.firestore().collection('users').doc(id);

        // Get the user when the page is loaded
        user.get().then((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                setUserInfo({
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    email: userData.email,
                    birthdate: userData.birthdate,
                    isLeader: userData.isLeader,
                    photoURL: userData.photoURL,
                    sex: userData.sex
                });

                if(userData.photoURL && typeof userData.photoURL === 'string' && userData.photoURL.trim() !== ''){
                    setImageSrc(userData.photoURL);
                } else {
                    try {
                        const storageRef = ref(getStorage(), process.env.DEFAULT_PROFILE_PICTURE_PATH);
                        getDownloadURL(storageRef).then((url) => {
                            setImageSrc(url);
                        });
                    } catch (error) {
                        console.log('Error getting default image URL', error);
                    }
                }
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
            user.updateEmail(userInfo.email).then(() => {
            }).catch((exception) => {
                console.log(exception);
            });
        }).catch((exception) => {
            console.log(exception);
        });

        // Update display name
        auth.currentUser.updateProfile({
            displayName: userInfo.firstName + " " + userInfo.lastName
        }).then(() => {

        }).catch((exception) => {
            console.log(exception);
        });

        // Update users collection
        docRef.update({
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            email: userInfo.email,
            birthdate: userInfo.birthdate,
            sex: userInfo.sex
        }).then(async() => {
            if (imgChange){
                const storage = getStorage();
                const storageRef = ref(storage, 'images/' + pfp.name);
                await uploadBytes(storageRef, pfp);
                const downloadURL = await getDownloadURL(storageRef);

                console.log(userInfo.photoURL);
                if(userInfo.photoURL && typeof userInfo.photoURL === 'string' && userInfo.photoURL.trim() !== ''){
                    const oldImage = ref(storage, userInfo.photoURL);
                    deleteObject(oldImage);
                }
                setUserInfo({
                    ...userInfo,
                    photoURL: downloadURL
                });


                docRef.update({photoURL: downloadURL}).then(() => {
                    setAlert(<CustomAlert color={"info"} message={"Data updated successfully !"}/>);
                    alertUser();
                });

                setImageSrc(downloadURL);
                setImgChange(false);
            } else {
                setAlert(<CustomAlert color={"info"} message={"Data updated successfully !"}/>);
                alertUser();
            }
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

    const handleChange = (event) => {
        setUserInfo({
            ...userInfo,
            [event.target.name]: event.target.value
        })
    };

    const handleImgUpload = (event) => {
        setImgChange(true);
        setPfp(event.target.files[0]);
    };

    return(
        <>
            <Form style={{marginTop: "10vh"}}>
                <h2 style={{textAlign: "center", marginTop: "7vh", marginBottom: "5vh"}}>My personal data</h2>
                <Col md={6}>
                    <img src={imageSrc} style={{width: "150px", height: "200px", objectFit: "scale-down"}}/>
                </Col>
                <Col md={6}>
                    <Label htmlFor={"fileChoser"}>Profile picture</Label>
                    <Input type={"file"} accept={"image/*"} name={"fileChoser"} onChange={handleImgUpload}/>
                </Col>
                <br/>
                {
                    // First row: Firstname and Lastname
                }
                <Row>
                    <Col md={6}>
                        <FormGroup>
                            <Label htmlFor={"firstName"}>Firstname</Label>
                            <Input type="text" name="firstName" placeholder={"Firstname"} value={userInfo.firstName} onChange={handleChange}/>
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <Label htmlFor={"lastName"}>Lastname</Label>
                            <Input type="text" name="lastName" placeholder={"Lastname"}  value={userInfo.lastName} onChange={handleChange}/>
                        </FormGroup>
                    </Col>
                </Row>

                {
                    // Second row: Email address
                }
                <FormGroup>
                    <Label htmlFor={"email"}>Email</Label>
                    <Input type="email" name="email" placeholder={"Email"} value={userInfo.email} onChange={handleChange}/>
                </FormGroup>

                {
                    // Third row : birthdate and sex
                }
                <Row>
                    <Col md={6}>
                        <FormGroup>
                            <Label htmlFor={"birthdate"}>Birthdate</Label>
                            <Input type="date" name="birthdate" placeholder={"Birthdate"} value={userInfo.birthdate} onChange={handleChange}/>
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <Col md={1}>
                            <label htmlFor={"sex"}>Sex</label>
                        </Col>
                        <Row style={{marginTop: "1.5vh"}}>
                            <Col md={4}>
                                <FormGroup check>
                                    <Input name={"sex"} type={"radio"} value={"female"} checked={userInfo.sex === "female"} onChange={handleChange}/>
                                    <Label>Female</Label>
                                </FormGroup>
                            </Col>
                            <Col md={4}>
                                <FormGroup check>
                                    <Input name={"sex"} type={"radio"} value={"male"} checked={userInfo.sex === "male"} onChange={handleChange}/>
                                    <Label>Male</Label>
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


                <Button disabled={password.length === 0} onClick={handleSubmit} color="success" type={"submit"} style={{marginTop: "1vh", marginBottom: "2vh"}}>
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
    const navigate = useNavigate();
    // Current user's data
    const [isLeader, setLeader] = useState(false);
    const [isMember, setMember] = useState(false);

    // Current user's group data
    const [groupUid, setGroupUid] = useState('');
    const [members, setMembers] = useState([]);
    const [membersNames, setMembersNames] = useState([]);
    const [leaderName, setLeaderName] = useState('');

    // Display variable
    const [content, setContent] = useState([]);
    const [label, setLabel] = useState(<></>);

    // User-to-add data
    const [email, setEmail] = useState('');

    // Alert
    const [alert, setAlert] = useState(<></>);
    const [alertVisible, setAlertVisible] = useState(false);


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
                setMembers(data.members);

                setLabel(<h3 style={{textAlign: "center", marginTop: "5vh", marginBottom: "2vh"}}>Manage my team: {data.name}</h3>);
            } else {
                // User is not a leader, but maybe he's a member
                const query = groups.where('members', "array-contains", id);
                query.get().then((group) => {
                    if(!group.empty){
                        // User belongs to a group
                        setMember(true);
                        setGroupUid(group.docs[0].id);

                        const data = group.docs[0].data();
                        setLabel(<h3 style={{textAlign: "center", marginTop: "5vh", marginBottom: "2vh"}}>Member of the team: {data.name}</h3>);

                        // Store leader's name
                        const leaderDoc = firebase.firestore().collection('users').doc(data.leader);
                        leaderDoc.get().then((doc) => {
                            if(doc.exists){
                                const leaderData = doc.data();
                                setLeaderName(leaderData.firstName + ' ' + leaderData.lastName);
                            }
                        }).catch((error) => {
                            console.log('Oh no! There was an error: ', error);
                        });
                    }
                }).catch((error) => {
                    console.log('Oh no! There was an error: ', error);
                });
            }
        }).catch((error) => {
            console.log('Oh no! There was an error: ', error);
        });
    }, []);

    useEffect(() => {
        if (isLeader){
            // For each member in the members list, get their name and add it to the membersnames list
            const memberNamePromises = members.map((member) => {
                const memberRef = firebase.firestore().collection('users').doc(member);
                return memberRef.get().then((member) => {
                    const memberData = member.data();
                    return memberData.firstName;
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
        }
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
                        setAlert(<CustomAlert color={"danger"} message={"Member is already in a group!"}/>);
                        notifyUser();
                    } else {
                        // Check if user is a leader
                        const groupQuery = groupCollection.where('leader', "==", uid);
                        groupQuery.get().then((doc) => {
                            if(!doc.empty){
                                setAlert(<CustomAlert color={"danger"} message={"Member is already in a group!"}/>);
                                notifyUser();
                            } else {
                                const updatedMembers = [...members, uid];
                                setMembers(updatedMembers);

                                const groupRef = firebase.firestore().collection('groups').doc(groupUid);
                                groupRef.update({
                                    members: updatedMembers
                                }).then(() => {
                                    setAlert(<CustomAlert color={"info"} message={"Member added successfully"}/>);
                                    notifyUser();
                                }).catch((exception) => {
                                    console.log('Oh no! There was an error: ', exception);
                                });
                            }
                        });
                    }
                    setEmail('');
                }).catch((exception) => {
                    console.log('Oh no! There was an error: ', exception);
                });
            }
        });
    };

    const notifyUser = () => {
      setAlertVisible(true);

      setTimeout(() => {
          setAlertVisible(false);
      }, 2500);
    };

    function RadarPlotGroup() {
        navigate(`/radarGroup/${members}`);
    }

    return(
        <>
            {
                (isLeader || isMember) &&
                (
                    label
                )
            }
            {
                isLeader &&
                (
                    <>
                        <Row style={{justifyContent: "center", alignItems:"center", marginBottom:"2vh"}}>
                            <Button onClick={RadarPlotGroup} style={{width: "auto", height: "auto"}}>Display Group Radar</Button>
                        </Row>
                        <ListGroup>
                            {
                                isLeader &&
                                (
                                    content
                                )
                            }
                        </ListGroup>
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
                isMember &&
                (
                    <Row>
                        <Col md={3}>
                            <Label>Team manager: </Label>
                        </Col>
                        <Col>
                            <Label>
                                {leaderName}
                            </Label>
                        </Col>
                    </Row>
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

function CheckUpList() {
    const navigate = useNavigate();

    // State to store the content that will be rendered at the website
    const [checkups, setCheckups] = useState(<></>);

    const [isHovered, setIsHovered] = useState(false);

    // Current user's id
    const uid = firebaseApp.auth().currentUser.uid;

    // Document with all the user's forms
    const doc = firebaseApp.firestore().collection('userQuestionnaires').doc(uid);


    const getRadar = (prettydate) => {
        const date = new Date(Date.parse(prettydate.replace(/(\d{2})\.(\d{2})\.(\d{4}) @/, '$3-$2-$1T').replace(/\s/, '')));

        navigate(`/radar/${date}`);
    }


    useEffect(() => {
        doc.get().then((snapshot) => {
            if(snapshot.exists){
                // The user has already filled at least 1 checkup

                const checkups = snapshot.data().questionnaires;
                const dates = checkups.map((checkup, index) => {
                    const formDate = checkup.datetime.toDate();
                    const prettyDate = formDate.toLocaleString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false,
                    }).replace('/', '.').replace('/', '.').replace(' ', ' @ ').replace(',', '');

                    console.log('Im here');

                    return(
                        <ListGroupItem key={index} style={{cursor: 'pointer', textAlign: 'center'}} onClick={() => getRadar(prettyDate)}>
                            {prettyDate}
                        </ListGroupItem>
                    );
                });

                // Store the formatted dates in the state to be rendered
                setCheckups(dates);
            } else {

            }
        }).catch((error) => {
            console.log('Oh no! There was an error: ', error);
        });
    }, []);

    return(
        <>
            <h3 style={{textAlign: "center", marginTop: "5vh", marginBottom: "2vh"}}>My checkups</h3>
            <ListGroup>
                {checkups}
            </ListGroup>
        </>

    );

}

export default function MyFunction(){

    return(
        <>
            <UserForm/>
            <Row style={{marginBottom: "10vh"}}>
                <Col md={7}>
                    <TeamManagementForm/>
                </Col>
                <Col md={5}>
                    <CheckUpList/>
                </Col>
            </Row>
        </>
    );
}
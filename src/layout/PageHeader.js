import {
    Collapse, DropdownItem, DropdownMenu, DropdownToggle,
    Nav,
    Navbar,
    NavbarBrand, NavbarText,
    NavbarToggler,
    NavItem,
    NavLink, UncontrolledDropdown
} from "reactstrap";
import {useState, useContext, useEffect} from "react";
import {UserContext} from "../context/UserContext";
import {getDownloadURL, ref, getStorage} from "firebase/storage";
import {Link} from "react-router-dom";
import firebaseApp from '../initFirebase';

export default function PageHeader() {
    // Sign out
    const handleSignOutClick = async () => {
        await firebaseApp.auth().signOut();
    };

    const user = useContext(UserContext);
    const [isOpen, setIsOpen] = useState(false);
    const [imageSrc, setImageSrc] = useState('');

    useEffect(() => {
        if(user){
            if(user.photoURL){
                setImageSrc(user.photoURL);
            } else {
                const storage = getStorage();
                const defaultImageRef = ref(storage, 'assets/defaultPfp.png');
                getDownloadURL(defaultImageRef).then((url) => {
                    setImageSrc(url);
                }).catch((error) => {
                    console.log(error);
                });
            }
        }
    });

    const toggle = () => setIsOpen(!isOpen);

    return (
        <div>
            <Navbar
                color="dark"
                container="fluid"
                expand="md"
                dark>
                <NavbarBrand href="/">FitnessCheck</NavbarBrand>
                <NavbarToggler onClick={toggle} />
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="me-auto" navbar>
                        {
                            user && user.isAdmin ? (<>
                                <NavItem>
                                    <NavLink href="/admin">
                                        Admin
                                    </NavLink>
                                </NavItem>
                            
                            </>) : (
                                <>
                                    { user ? (<>
                                        <NavItem>
                                            <NavLink href="/checkup">Do Checkup</NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink href="/my-data">
                                                My data
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink href="/my-checkups">
                                                My Checkups
                                            </NavLink>
                                        </NavItem>                                     
                                    </>) : (<></>)}
                           
                                </>
                            )
                        }

                    </Nav>
                    {
                        user && (
                            <Nav navbar>
                                <UncontrolledDropdown nav inNavbar>
                                    <DropdownToggle nav caret style={{textDecoration: 'underline', textDecorationColor: 'gray', listStyleType: 'none'}}>
                                        <img src={imageSrc} width={30} height={30} className={"rounded-circle me-2"}/>
                                        <NavbarText>
                                            {user.firstName + ' ' + user.lastName}
                                        </NavbarText>
                                    </DropdownToggle>
                                    <DropdownMenu end>
                                        <Link to={'/my-data'} style={{textDecoration: 'none'}}><DropdownItem>My profile</DropdownItem></Link>
                                        <DropdownItem divider />
                                        <DropdownItem onClick={handleSignOutClick}>Log out</DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                            </Nav>
                        )
                    }
                </Collapse>
            </Navbar>
        </div>
    );
}

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
                const defaultImageRef = ref(storage, process.env.DEFAULT_PROFILE_PICTURE_PATH);
                getDownloadURL(defaultImageRef).then((url) => {
                    setImageSrc(url);
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
                        <NavItem>
                            <NavLink href="/checkup">Checkup</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="/my-data">
                                My data
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="/logout">
                                Logout
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="/radar">
                                Radar
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="/admin">
                                Admin
                            </NavLink>
                        </NavItem>
                    </Nav>
                    {
                        user && (
                            <Link to={'/'} style={{textDecoration: 'underline', textDecorationColor: 'gray', listStyleType: 'none', color: 'gray'}}>

                                <UncontrolledDropdown nav inNavbar>
                                    <DropdownToggle nav caret style={{textDecoration: 'underline', textDecorationColor: 'gray', listStyleType: 'none'}}>
                                        <img src={imageSrc} width={30} height={30} className={"rounded-circle me-2"}/>
                                        <NavbarText>
                                            {user.firstName + ' ' + user.lastName}
                                        </NavbarText>
                                    </DropdownToggle>
                                    <DropdownMenu right>
                                        <Link to={'/my-data'} style={{textDecoration: 'none'}}><DropdownItem>My profile</DropdownItem></Link>
                                        <DropdownItem divider />
                                        <DropdownItem onClick={handleSignOutClick}>Log out</DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                            </Link>
                        )
                    }
                </Collapse>
            </Navbar>
        </div>
    );
}

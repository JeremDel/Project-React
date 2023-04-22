// import firebaseApp from "../initFirebase";
// import { Link } from "react-router-dom";

import {
    Collapse, DropdownItem, DropdownMenu, DropdownToggle,
    Nav,
    Navbar,
    NavbarBrand, NavbarText,
    NavbarToggler,
    NavItem,
    NavLink,
    UncontrolledDropdown
} from "reactstrap";
import {useState} from "react";

export default function PageHeader() {
    // Sign out
    // const handleSignOutClick = async () => {
    //     await firebaseApp.auth().signOut();
    // };

    const [isOpen, setIsOpen] = useState(false);

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
                            <NavLink href="/admin">
                                Admin
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <NavbarText>Simple Text</NavbarText>
                </Collapse>
            </Navbar>
        </div>
    );
}

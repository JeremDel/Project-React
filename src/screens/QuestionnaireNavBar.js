// import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom"
import { Nav, NavItem, NavLink } from "reactstrap";
export default function QuestionnaireNavBar(props) {

    let active_theme = parseInt(props.activeTheme);
    // console.log(props.themes)

    const navigate  = useNavigate();
    const toggle = theme => {
        if (active_theme !== theme) {
            navigate(`/checkup/${theme}`);
        }
       }

    return (
        <Nav tabs>

        {
            props.themes.map((theme, index) => (
                <NavItem key={ 'theme-' + index}>
                    <NavLink
                        className={active_theme === index ? "active" : ""}
                        onClick={() => {
                            toggle(index);
                        }}
                        role="button"
                    >
                        {theme.name}
                    </NavLink>
                </NavItem>
            )) 
        }
        </Nav>
    );
}

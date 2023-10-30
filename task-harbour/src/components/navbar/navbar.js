import { NavLink, useLocation } from "react-router-dom";
import './navbar.css';

function NavBar() {
    const location = useLocation();
    return (
        <div class="navbar">
            <div class="dropdown">
                <button class="dropbtn">
                    <div class="div-icon"></div>
                    <div class="div-icon"></div>
                    <div class="div-icon"></div>
                </button>
                <div class="dropdown-content">
                    <li class="newProject">
                        <NavLink
                            to="/"
                            className={`nav-links${location.pathname === "/" ? " activated" : "" }`}
                        // onClick={closeMobileMenu}
                        > New Project
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/"
                            className={`nav-links${location.pathname === "/" ? " activated" : "" }`}
                        // onClick={closeMobileMenu}
                        > Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/signup"
                            className={`nav-links${location.pathname === "/signup" ? " activated" : "" }`}
                        // onClick={closeMobileMenu}
                        >
                            signup
                        </NavLink>
                    </li>
                    
                        
                </div>
            </div>
        </div>
    )
}
export default NavBar;
import { NavLink, useLocation } from "react-router-dom";
import './navbar.css';

function NavBar() {
    const location = useLocation();
    let signedIn = true;
    const projects = [
        { 'name': 'Project 1', 'url': 'project1', 'color': 'red' },
        { 'name': 'Project 2', 'url': 'project2', 'color': 'green' },
        { 'name': 'Project 3', 'url': 'project3', 'color': 'blue' }
    ]
    return (
        <div class="navbar">
            <div class="dropdown">
                <button class="dropbtn">
                    <div class="div-icon"></div>
                    <div class="div-icon"></div>
                    <div class="div-icon"></div>
                </button>
                <div class="dropdown-content">
                    <h2>
                    Task Harbor
                    </h2>
                    {/* Not Signed In Navbar */}
                    {!signedIn && (<>
                        <li>
                            <NavLink to="/">
                                Home
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/signup">
                                Sign Up
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/login">
                                Login
                            </NavLink>
                        </li>
                    </>)}
                    {/* Signed In Navbar */}
                    {signedIn && (<>
                        <li >
                            <NavLink to="/">
                                <div class="newProject">New Project</div>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/">
                                Home
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/projects">
                                Projects
                            </NavLink>
                            {(() => {
                                let projectsLinks = [];
                                projects.forEach(project => {
                                    let urllink = "/projects/" + project.url
                                    let color = project.color
                                    projectsLinks.push(<li class="projectlink"><NavLink to={urllink} ><div class="nameAndDot"><span style={{ backgroundColor:color }} class="dot"/> {project.name}</div></NavLink></li>)
                                });
                                return projectsLinks
                            })()}
                        </li>
                        <li>
                            <NavLink to="/logout">
                                Logout
                            </NavLink>
                        </li>
                    </>)}


                </div>
            </div>
        </div>
    )
}
export default NavBar;
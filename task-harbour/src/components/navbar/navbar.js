import { NavLink, useLocation } from "react-router-dom";
import './navbar.css';
import { useState } from "react";

function NavBar() {
    const location = useLocation();
    let signedIn = true;
    const [fakeLogin, setFakeLogin] = useState({
        loggedIn: false
    })
    const [fakeProjects, setFakeProjects] = useState({
        projects : [
            { 'name': 'Project 1', 'url': 'project1', 'color': 'red' },
            { 'name': 'Project 2', 'url': 'project2', 'color': 'green' },
            { 'name': 'Project 3', 'url': 'project3', 'color': 'blue' }
        ],
        currentNum : 3,
        colors : ['red','green','blue','purple','yellow']
    })
    function fakeProjectHelper(){
        
    }
    function fakeLoginHelper(){
        // setFakeLogin({loggedIn:!fakeLogin.loggedIn})
    }
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
                    {!fakeLogin.loggedIn && (<>
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
                            <NavLink to="/signin" onClick={fakeLoginHelper}>
                                Login
                            </NavLink>
                        </li>
                    </>)}
                    {/* Signed In Navbar */}
                    {fakeLogin.loggedIn && (<>
                        <li >
                            <NavLink to="/projectCreation">
                                <div class="newProject">New Project</div>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/">
                                Home
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/select-project">
                                Projects
                            </NavLink>
                            {(() => {
                                let projectsLinks = [];
                                fakeProjects.projects.forEach(project => {
                                    let urllink = "/projects/" + project.url
                                    let color = project.color
                                    projectsLinks.push(<li class="projectlink"><NavLink to={urllink} ><div class="nameAndDot"><span style={{ backgroundColor:color }} class="dot"/> {project.name}</div></NavLink></li>)
                                });
                                return projectsLinks
                            })()}
                        </li>
                        <li>
                            <NavLink to="/logout" onClick={fakeLoginHelper}>
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
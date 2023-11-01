import { NavLink, useLocation } from "react-router-dom";
import './navbar.css';
import { useState } from "react";

function NavBar() {
    const location = useLocation();
    const [projectsList, setProjectsList] = useState()

    function projectHelper() {
        if (projectsList) {
            return
        }
        const formData = { userID: JSON.parse(localStorage.getItem("authData")).username }
        fetch('https://rsf6bjt4de6goirsyfvxfs2zdy0vquva.lambda-url.us-east-1.on.aws/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        }).then(response => {
            return response.json()
        }).then(data => {
            let colorDict = {}
            data['data'].forEach(project => {
                var letters = '0123456789ABCDEF';
                var color = '#';
                for (var i = 0; i < 6; i++) {
                    color += letters[Math.floor(Math.random() * 16)];
                }
                colorDict[project.projectID] = color
            })
            data['color'] = colorDict
            setProjectsList(data)
        })
    }
    function loginHelper() {
        try {
            let token = JSON.parse(localStorage.getItem("authData")).authInfo.AccessToken
            projectHelper()
            return true
        } catch (error) {
            return false
        }
    }
    function tempLogout() {
        localStorage.removeItem("authData")
    }
    return (
        <div className="navbar">
            <div className="dropdown">
                <button className="dropbtn">
                    <div className="div-icon"></div>
                    <div className="div-icon"></div>
                    <div className="div-icon"></div>
                </button>
                <div className="dropdown-content">
                    <h2>
                        Task Harbor
                    </h2>
                    {/* Not Signed In Navbar */}
                    {!loginHelper() && (<>
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
                            <NavLink to="/signin">
                                Login
                            </NavLink>
                        </li>
                    </>)}
                    {/* Signed In Navbar */}
                    {loginHelper() && (<>
                        <li >
                            <NavLink to="/projectCreation">
                                <div className="newProject">New Project</div>
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
                        </li>
                        {/* List projects in Navbar */}
                        {(() => {
                            let projectsLinks = [];
                            if (!projectsList) {
                                return
                            }
                            projectsList['data'].forEach(project => {
                                let urllink = "/projects/" + project.projectID
                                var color = projectsList['color'][project.projectID]
                                projectsLinks.push(<li key={project.projectID} className="projectlink"><NavLink to={urllink} ><div className="nameAndDot"><span style={{ backgroundColor: color }} className="dot" /> {project.projectName}</div></NavLink></li>)
                            })
                            return projectsLinks
                        })()}
                        <li>
                            <NavLink to="/logout" onClick={tempLogout}>
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
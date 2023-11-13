import { NavLink, useLocation } from "react-router-dom";
import './navbar.css';
import { useState, useEffect } from "react";

function NavBar() {
    const location = useLocation();
    const [projectsList, setProjectsList] = useState([]);

    useEffect(() => {
        const authData = JSON.parse(localStorage.getItem("authData"));
        if (authData && authData.username) {
            fetchProjects(authData.username);
        }
    }, [location]);

    function fetchProjects(username) {
        const formData = { userID: username };
        fetch('https://rsf6bjt4de6goirsyfvxfs2zdy0vquva.lambda-url.us-east-1.on.aws/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(response => response.json())
        .then(data => {
            let colorDict = {};
            data['data'].forEach(project => {
                var color = '#' + Math.floor(Math.random()*16777215).toString(16);
                colorDict[project.projectID] = color;
            });
            data['color'] = colorDict;
            setProjectsList(data['data']);
        });
    }

    function isLoggedIn() {
        try {
            const authData = JSON.parse(localStorage.getItem("authData"));
            return authData && authData.authInfo && authData.authInfo.AccessToken;
        } catch (error) {
            return false;
        }
    }

    function tempLogout() {
        localStorage.removeItem("authData");
    }

    return (
        <div className="navbar">
            <div className="navbar-header">
                <h1>Task Harbor</h1>
            </div>
            <div className="navbar-content">
                {!isLoggedIn() && (
                    <>
                        <NavLink to="/">Home</NavLink>
                        <NavLink to="/signup">Sign Up</NavLink>
                        <NavLink to="/signin">Login</NavLink>
                    </>
                )}
                {isLoggedIn() && (
                    <>
                        <NavLink to="/projectCreation" className="newProject">+ New Project</NavLink>
                        <NavLink to="/">Home</NavLink>
                        <NavLink to="/select-project">Projects</NavLink>
                        <div className="projects-list">
                            {projectsList.map(project => {
                                let urlLink = "/projects/" + project.projectID;
                                var color = '#' + Math.floor(Math.random()*16777215).toString(16); 
                                return (
                                    <NavLink key={project.projectID} to={urlLink}>
                                        <span className="dot" style={{ backgroundColor: color }}></span>
                                        {project.projectName}
                                    </NavLink>
                                );
                            })}
                        </div>
                        <NavLink to="/logout" onClick={tempLogout}>Logout</NavLink>
                    </>
                )}
            </div>
        </div>
    );
}

export default NavBar;

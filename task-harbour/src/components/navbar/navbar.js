import { NavLink, useLocation } from "react-router-dom";
import './navbar.css';
import { useState, useEffect } from "react";

function NavBar() {
    const location = useLocation();
    const [projectsList, setProjectsList] = useState([]);
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [showProjectsDropdown, setShowProjectsDropdown] = useState(false);

    const toggleNavbar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const toggleProjectsDropdown = () => {
        setShowProjectsDropdown(prevState => !prevState);
    };

    useEffect(() => {
        const authData = JSON.parse(localStorage.getItem("authData"));
        if (authData && authData.username) {
            fetchProjects(authData.username);
        }
    }, [location]);

    function fetchProjects(username) {
        const formData = { userID: JSON.parse(localStorage.getItem("authData")).username };
        fetch('https://rsf6bjt4de6goirsyfvxfs2zdy0vquva.lambda-url.us-east-1.on.aws?' + new URLSearchParams({
            userID: JSON.parse(localStorage.getItem("authData")).username
        })).then(response => response.json())
        .then(data => {
            let colorDict = {};
            data['data'].forEach(project => {
                var letters = '0123456789ABCDEF';
                var color = '#';
                for (var i = 0; i < 6; i++) {
                    color += letters[Math.floor(Math.random() * 16)];
                }
                colorDict[project.projectID] = color;
            });
            data['color'] = colorDict;
            console.log(data);
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
        <div className={`navbar ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="navbar-header">
                <button onClick={toggleNavbar}><span></span></button>
            </div>
            
            <div className={`navbar-content ${isCollapsed ? 'hide' : ''}`}>
                <h1>Task Harbor</h1>
                {!isLoggedIn() && (
                    <>
                        <NavLink to="/">Home</NavLink>
                        <NavLink to="/signup">Sign Up</NavLink>
                        <NavLink to="/signin">Login</NavLink>
                    </>
                )}
                {isLoggedIn() && (
                    <>
                        <NavLink to="/create-project" className="newProject">+ New Project</NavLink>
                        <NavLink to="/">Home</NavLink>
                        <div  className="dropdown-link" onClick={toggleProjectsDropdown}>Projects</div>
                        {showProjectsDropdown && (
                            <div className={`projects-dropdown ${showProjectsDropdown ? 'show' : ''}`}>
                                {projectsList.map(project => {
                                    let urlLink = "/projects/" + project.projectID;
                                    let color = (projectsList && projectsList[0] && projectsList[0].color && projectsList[0].color[project.projectID]) || '#' + Math.floor(Math.random() * 16777215).toString(16);
                                    return (
                                        <div key={project.projectID} className="project-link">
                                            <NavLink to={urlLink} reloadDocument={true}>
                                                <span className="project-dot" style={{ backgroundColor: color }}></span>
                                                {project.projectName}
                                            </NavLink>
                                        </div>
                                    );
                                })}
                            </div>
                        )}                                        
                        <NavLink to="/logout" onClick={tempLogout}>Logout</NavLink>
                    </>
                )}
            </div>
        </div>
    );
}

export default NavBar;

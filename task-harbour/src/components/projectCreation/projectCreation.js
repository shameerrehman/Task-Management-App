import './projectCreation.css';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import UserSearchDropdown from '../UserSearchDropdown/user-search';


function ProjectCreation() {
    const [formData, setFormData] = useState({
        // make everything a required input
        // do error check for date format dd-mm-yyyy
        projectName: '',
        //  projectType: '', // is it necessary??? string
        teamMembers: '', // temporarily on hold (look into database design) - add a + and it creates a textbox to add team member into the list
        description: '',
        projectLead: '', // whoever created it USERID (DISPLAY NAME NOT ID on frontend) - drop down to get all users and select a user for lead (UUID)
        // teams??
        startTime: '', // string YYYY-MM-DD check if the end date is not before the start date
        endTime: '',
        userID: '',
        // goes to homepage and updates the nav bar
    });

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [startDateSelected, setStartDateSelected] = useState(false);
    
    // Get current date
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set time to the start of the day
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();

    const [projectLeadSelected, setProjectLead] = useState(null);

    const handleProjectLeadChange = selectedOption => {
        setProjectLead(selectedOption);
        // Extract the username from the selectedOption
        const selectedUsername = selectedOption ? selectedOption.value : '';

        // Update formData with the selected username
        setFormData({ ...formData, projectLead: selectedUsername });
    };

    function projectLeader () {
        try {
            return (JSON.parse(localStorage.getItem("authData")).username)
        } catch (error) {
            // console.log(error)
            return 'not_logged_in'
            
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const project_create = {
            projectName: formData.projectName,
            // projectType: formData.projectType,
            teamMembers: 'asdfukgafhs', //formData.members,
            // team: formData.team,
            description: formData.description,
            // files: formData.files,
            projectLead: formData.projectLead,
            startTime: startDate,
            endTime: endDate,
            userID: projectLeader() // formData.userID
        }

        fetch('https://c4ymylf7x27766avx4ms2huavi0xxahb.lambda-url.us-east-1.on.aws/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(project_create),
        })
            .then((response) => {
                // Check if the response is successful
                if (!response.ok) {
                    console.error('Network response was not ok');
                }
                return response.text();  // parsing the response to JSON
            })
            .then(data => {
                // Handle the data from the server
                // if (data.status !== 201 || data.status !== 200) {       
                //     console.error('Error:', data);
                // } else {
                    console.log('Success:', data);
                    setIsSubmitted(true);
                    window.location.href = '/select-project'
                // }
            })
            .catch((error) => {
                console.error('Error creating new project:', error);
            });
        // } 

        // else {
        //     const errorMessage = document.createElement('div');
        //     errorMessage.className = 'error'
        //     const errorClose = document.createElement('a')
        //     errorClose.className = 'error-btn'
        //     errorClose.addEventListener("click", function () {
        //         const errorElements = document.getElementsByClassName('error');
        //         for (let i = 0; i < errorElements.length; i++) {
        //             errorElements[i].style.display = 'none';
        //         }
        //     });
        //     errorClose.textContent = "X";
        //     errorMessage.appendChild(errorClose);
        //     document.getElementById('root').appendChild(errorMessage);
        // }
    };

    return (
        <div className="ProjectCreation">
            <h1>Create a New Project!</h1>
            {isSubmitted ? (
                <div>Form submitted successfully!</div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className='row'>
                        <label>Project Name: </label>
                        <input
                            type="text"
                            required={true}
                            value={formData.projectName}
                            onChange={(e) =>
                                setFormData({ ...formData, projectName: e.target.value })
                            }
                        />
                        {/* <input
                            type="text" //DROP DOWN??
                            placeholder="Project Type"
                            required={true}
                            value={formData.lastname}
                            onChange={(e) =>
                                setFormData({ ...formData, projectType: e.target.value })
                            }
                        /> */}
                    </div>

                    {/* <div className='row'>
                        <input
                            type="text" // GIVE OPTIONS????
                            placeholder="Members"
                            required={true}
                            value={formData.members}
                            onChange={(e) =>
                                setFormData({ ...formData, members: e.target.value })
                            }
                        />
                    </div> */}

                    {/* <div className='row'>
                        <input
                            type="text"
                            placeholder="Team"
                            required={true}
                            value={formData.team}
                            onChange={(e) =>
                                setFormData({ ...formData, team: e.target.value })
                            }
                        />
                    </div> */}

                    <div className='row'>
                        <label>Project Description:</label>
                        <textarea
                            type="text"
                            required={true}
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({ ...formData, description: e.target.value })
                            }
                        />
                    </div>
                    
                    {/* <div className='row'>
                        <input
                            type="text" // INSERT FILES
                            placeholder="Files"
                            required={true}
                            value={formData.files}
                            onChange={(e) =>
                                setFormData({ ...formData, files: e.target.value })
                            }
                        />
                    </div> */}
                    <div className='row'>
                        <label>Project Lead: </label>
                        <UserSearchDropdown 
                            onUserSelect={handleProjectLeadChange}
                            initialValue={projectLeadSelected}
                        />
                        {/* <input
                            type="text" // DEFAULT IS CREATOR
                            placeholder="Project Lead"
                            required={true}
                            value={formData.projectLead}
                            onChange={(e) =>
                                setFormData({ ...formData, projectLead: e.target.value })
                            }
                        /> */}
                    </div>

                    <div className='row'>
                        <div>
                            <label>Start Date: </label>
                            <DatePicker
                                required={true}
                                selectsStart
                                selected={startDate}
                                onChange={date => setStartDate(date)}
                                startDate={startDate}
                                minDate={currentDate}
                                onSelect={() => setStartDateSelected(true)}
                            />
                        </div>
                    </div>

                    <div className='row'>
                        <div>
                            <label>End Date: </label>
                            <DatePicker
                                required={true}
                                selectsEnd
                                selected={endDate}
                                onChange={date => setEndDate(date)}
                                endDate={endDate}
                                startDate={startDate}
                                minDate={startDate}
                                disabled={!startDateSelected}
                            />
                        </div>
                    </div>

                    <div className='create'>
                        <button type="submit">Create a New Project</button>
                    </div>
                </form>
            )}
        </div>
    );
}
export default ProjectCreation;
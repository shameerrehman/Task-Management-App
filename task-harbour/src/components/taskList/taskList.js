import './taskList.css';
import React, { useState } from 'react';
import {
    DataGrid, GridToolbar,
    GridToolbarContainer,
    GridToolbarColumnsButton,
    GridToolbarFilterButton,
    GridToolbarDensitySelector,
    GridToolbarExport
} from '@mui/x-data-grid';

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { NavLink, json } from "react-router-dom";

function ProjectCreation() {
    const [tasksList, setTasksList] = useState([{
        'taskLink': "LOADING",
        'id': 0,
        'assigneeUserID': "LOADING",
        'creatorUserID': "LOADING",
        'taskName': "LOADING",
        'taskDescription': "LOADING",
        'taskDueDate': "0",
        'DictionaryTaskTags': "LOADING",
        'status': "LOADING",
        'priority': "LOADING",
        'storyPoints': "LOADING",
    }])
    const [allowLoad, setAllowLoad] = useState(true)
    const [currentUserOnly, setCurrentUserOnly] = useState(false)
    
    function makeErrorMessage(errorText) {
        // Handle errors or display a message to the user
        console.error(errorText);
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error' + errorText
        errorMessage.textContent = errorText;
        const errorClose = document.createElement('a')
        errorClose.className = 'error-btn'
        errorClose.addEventListener("click", function () {
            const errorElements = document.getElementsByClassName(errorMessage.className);
            for (let i = 0; i < errorElements.length; i++) {
                errorElements[i].style.display = 'none';
            }
        });
        errorClose.textContent = "X";
        errorMessage.appendChild(errorClose);
        document.getElementById('root').appendChild(errorMessage);
    }

    function getProjectId() {
        try {
            return window.location.pathname.split('/')[2]
            // return "9e0cad6b-4645-45a2-849d-790f449a57c7" // temp
        } catch (error) {
            // Handle errors or display a message to the user
            console.error('Error getting project ID:', error);
            makeErrorMessage('Error getting project ID:' + error)
        }
    }

    function fetchTasks(){
        try {
            fetch('https://ogl7lxkrnfk5y6crhwzrdodzae0tmlyg.lambda-url.us-east-1.on.aws/?' +
                new URLSearchParams({
                    projectID: getProjectId()
                }), {
                method: 'GET'
            }
            ).then(response => {
                return response.json()

            })
            .then(jsonData => {
                console.log(jsonData)
                var sampledata = {
                    "data": []
                }
                var index = 0
                jsonData.data.forEach(task => {
                    //Get project name
                    fetch('https://seyi6tnkiy76d4eril23nq4uqm0nzaix.lambda-url.us-east-1.on.aws/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({}),
                    })
                    //Get user names
                    var username = JSON.parse(localStorage.getItem("authData")).username;
                    if(currentUserOnly | task.assigneeUserID == username | task.creatorUserID == username){
                        sampledata["data"].push(
                            {
                                'taskLink': task.taskID,
                                'id': index,
                                'TaskID': task.taskID,
                                'ProjectID': task.projectID,
                                'assigneeUserID': task.assigneeUserID,
                                'creatorUserID': task.creatorUserID,
                                'taskName': task.taskName,
                                'taskDescription': task.taskDescription,
                                'taskDueDate': task.taskDueDate,
                                'DictionaryTaskTags': JSON.stringify(task.taskTags),
                                'status': task.status,
                                'priority': task.priority,
                                'storyPoints': task.storyPoints,
                            }
                        )
                        index += 1;
                    }

                });
                setTasksList(sampledata.data)
            })
            .catch(error => {
                console.error(error)
                setTasksList({ "error": error.message })
            })
        setAllowLoad(false);
        } catch (error) {
            console.error("error getting tasks" + error)
            setTasksList("error getting tasks" + error)
            setAllowLoad(false);
        }
    }

    function getProjectTasks() {
        if (!allowLoad) {
            return
        }
        fetchTasks()
    }

    function userTasks(event){
        fetchTasks()
        setCurrentUserOnly(event.target.checked)
    }

    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                <GridToolbarColumnsButton />
                <GridToolbarFilterButton />
                <GridToolbarDensitySelector />
                <GridToolbarExport />
                <FormGroup>
                    <FormControlLabel control={<Switch checked={currentUserOnly} onChange={(e)=>userTasks(e)}/>} label="Only show my tasks" />
                </FormGroup>
            </GridToolbarContainer>
        );
    }

    const columns = [
        {
            field: 'taskLink',
            headerName: 'Task Link',
            // flex: 0.5,
            renderCell: (params) => (
                <NavLink to={`/task/${params.value}`}><button className={'taskLink'}>Open Task</button></NavLink>
            )
        },
        // {
        //     field: 'TaskID', 
        //     headerName: 'Task ID (remove?)', 
        //     width: 10
        //     // flex: 1,

        // },
        // {
        //     field: 'ProjectID',
        //     headerName: 'Project ID (remove?)',
        //     // flex: 1,
        //     width: 10,
        // },
        {
            field: 'assigneeUserID',
            headerName: 'Assignee User ID',
            // flex: 0.6,
            width: 130,
            renderCell: (params) => {
                if (params.value) {
                    return params.value
                } else {
                    return <label>-</label>
                }
            }
        },
        {
            field: 'creatorUserID',
            headerName: 'Creator User ID',
            // flex: 0.6,
            width: 130,
        },
        {
            field: 'taskName',
            headerName: 'Task Name',
            flex: 0.7,
        },
        {
            field: 'taskDescription',
            headerName: 'Task Description',
            description: 'This column has a value getter and is not sortable.',
            flex: 1.3,
        },
        {
            field: 'taskDueDate',
            headerName: 'Task Due Date',
            // flex: 1,
            width: 140,
            renderCell: (params) => {
                if (params.value) {
                    var parsedDate = new Date(params.value);
                    return parsedDate.toLocaleString('default', {
                        weekday: "short",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    });
                } else {
                    return <label>-</label>
                }
            }
        },
        {
            field: 'status',
            headerName: 'Task Status',
            // flex: 0.7,
            // width: 2,
            renderCell: (params) => (
                <label className={'statusLabel'}>{params.value}</label>
            )
        },
        {
            field: 'priority',
            headerName: 'Task Priority',
            // flex: 0.7,
            renderCell: (params) => {
                if (params.value == "Critical") {
                    return <label className={'criticalLabel'}>{params.value}</label>
                } else if (params.value == "Minor") {
                    return <label className={'minorLabel'}>{params.value}</label>
                } else if (params.value == "Major") {
                    return <label className={'majorLabel'}>{params.value}</label>
                } else {
                    return params.value
                }
                return
            }
        },
        {
            field: 'storyPoints',
            // headerName: 'Story Points',
            renderHeader: (params) => (
                <a className='tableHeaderBreak' >Story<br className='tableHeaderBreak'></br>Points</a>
            ),
            // flex: 0.4,  
            width: 60,
            renderCell: (params) => {
                if (params.value) {
                    return <label className={'pointsLabel'}>{params.value}</label>
                } else {
                    return <label className={'blankLabel'}>-</label>
                }
            }
        },
        {
            field: 'DictionaryTaskTags',
            headerName: 'Task Tags',
            flex: 1,
            renderCell: (params) => {
                if (params.value != "null") {
                    try {
                        var labelList = []
                        JSON.parse(params.value).forEach(tag => {
                            labelList.push(<label className={'taskLabel'}>{tag}</label>)
                            // labelList.push(<label className={'spacingLabel'}></label>)
                        })
                        // return labelList
                        return <div className='taskLabelDiv'>{labelList}</div>

                    } catch (error) {
                        return <label>{params.value}</label>
                    }

                    return <label>{params.value}</label>
                }
                return <label className={'blankLabel'}>-</label>
            }
        },

    ];

    const handleSubmit = (e) => {

    };
    getProjectTasks()
    return (
        <div className="taskList">
            {
                <DataGrid
                    rows={tasksList}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 5,
                            },
                        },
                    }}
                    pageSizeOptions={[5, 10, 15, 20, 25, 100]}
                    // checkboxSelection
                    disableRowSelectionOnClick
                    slots={{
                        // toolbar: GridToolbar 
                        toolbar: CustomToolbar
                    }}
                    slotProps={{
                        toolbar: {
                            showQuickFilter: true,
                        },
                    }}
                />
            }
            {(() => {
                // sample function
                // console.log(tasksList)
                // return JSON.stringify(tasksList)
            })()}
        </div>
    );
}

export default ProjectCreation;
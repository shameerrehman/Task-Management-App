import './taskList.css';
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
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

function TaskList() {
    const [loading, setLoading] = useState(true);
    const [tasksList, setTasksList] = useState([{
        'taskLink': "LOADING",
        'id': 0,
        'assigneeUserID': "LOADING",
        'creatorUserID': "LOADING",
        'taskName': "LOADING",
        'taskDescription': "LOADING",
        'taskDueDate': "LOADING",
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
        } catch (error) {
            // Handle errors or display a message to the user
            console.error('Error getting project ID:', error);
            makeErrorMessage('Error getting project ID:' + error)
        }
    }

    function CustomToolbar() {
        const navigate = useNavigate();

        const handleCreateTaskClick = () => {
            const projectId = getProjectId();
            navigate(`/create-task?projectId=${projectId}`);
        };


        return (
            <GridToolbarContainer>
                <GridToolbarColumnsButton />
                <GridToolbarFilterButton />
                <GridToolbarDensitySelector />
                <GridToolbarExport />
                <FormGroup>
                    <FormControlLabel control={<Switch checked={currentUserOnly} onChange={(e)=>userTasks(e)}/>} label="Only show my tasks" />
                </FormGroup>
                <button onClick={handleCreateTaskClick} className="create-task-btn" style={{ margin: "0.5rem" }}>
                    New Task
                </button>
            </GridToolbarContainer>
        );
    }

    // const CustomToolbar = () => {

    //     return (
    //         <div style={{ display: 'flex', alignItems: 'center' }}>
    //             <GridToolbar />
                
    //         </div>
    //     );
    // };

    function getProjectTasks(forceLoad=false) {
        if (!allowLoad && !forceLoad) {
            return;
        }
        setLoading(true);
        try {
            fetch('https://ogl7lxkrnfk5y6crhwzrdodzae0tmlyg.lambda-url.us-east-1.on.aws/?' +
                new URLSearchParams({
                    projectID: getProjectId()
                }), {
                method: 'GET'
            }).then(response => {
                return response.json()
            })
                .then(jsonData => {
                    // console.log(jsonData)
                    var sampledata = {
                        "data": []
                    }
                    var index = 0
                    jsonData.data.forEach(task => {
                        //Get project name
                        // fetch('https://seyi6tnkiy76d4eril23nq4uqm0nzaix.lambda-url.us-east-1.on.aws/', {
                        //     method: 'POST',
                        //     headers: {
                        //         'Content-Type': 'application/json',
                        //     },
                        //     body: JSON.stringify({}),
                        // })

                        // console.log({ task })
                        var username = JSON.parse(localStorage.getItem("authData")).username;
                        console.log(username);
                        if(allowLoad | currentUserOnly | task.assigneeUserID == username | task.creatorUserID == username){
                            sampledata["data"].push(
                                {
                                    'taskLink': task.taskID,
                                    'id': index,
                                    'TaskID': task.taskID,
                                    'taskKey': task.taskKey,
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
                        }
                        index += 1;
                    });
                    setTasksList(sampledata.data);
                    // console.log("setting to false")
                    setLoading(false);
                })
                .catch(error => {
                    console.error(error);
                    setTasksList({ "error": error.message });
                    // console.log("setting to false")
                    setLoading(false);
                })
            setAllowLoad(false);
            // console.log("setting to false")
            setLoading(false);
        } catch (error) {
            console.error("error getting tasks" + error);
            setTasksList("error getting tasks" + error);
            console.log("setting to false")
            setLoading(false);
        }
    }

    // function getProjectTasks() {
    //     if (!allowLoad) {
    //         return
    //     }
    //     fetchTasks()
    // }

    function userTasks(event){
        getProjectTasks(true)
        setCurrentUserOnly(event.target.checked)
    }

    const columns = [
        {
            field: 'taskLink',
            headerName: 'Task Actions',
            // flex: 1,
            width: 100,
            renderCell: (params) => (
                !loading ?
                    (
                        <>
                            {/* {console.log(tasksList[0])} */}
                            {/* <Link to={`/task/${params.value}`}><button className={'taskLink'} style={{ margin: "0.5rem" }}>Open Task</button></Link> */}
                            <Link to={{
                                pathname: `/update-task`,
                                search: `?projectId=${getProjectId()}`,

                            }} state={{ taskProperties: params.row }}>
                                <button className={'taskLink'} style={{ margin: "0.5rem" }}>Edit Task</button>
                            </Link>
                        </>
                    ) : "LOADING"
            )
        },
        {
            field: 'taskKey',
            headerName: 'Task Key',
            width: 100, 
            renderCell: (params) => {
                if (typeof params.value === 'string') {
                    return params.value
                } else {
                    return "N/A"
                }
            }
        },
        {
            field: 'assigneeUserID',
            headerName: 'Assignee User ID',
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
            width: 130,
        },
        {
            field: 'taskName',
            headerName: 'Task Name',
            width: 350,
        },
        {
            field: 'taskDescription',
            headerName: 'Task Description',
            description: 'This column has a value getter and is not sortable.',
            // flex: 1.3,
            width:300,
        },
        {
            field: 'taskDueDate',
            headerName: 'Task Due Date',
            width: 170,
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
            renderCell: (params) => (
                <label className={'statusLabel'}>{params.value}</label>
            )
        },
        {
            field: 'priority',
            headerName: 'Task Priority',
            renderCell: (params) => {
                if (params.value == "Critical") {
                    return <label className={'criticalLabel'}>{params.value}</label>
                } else if (params.value == "Minor") {
                    return <label className={'minorLabel'}>{params.value}</label>
                } else if (params.value == "Medium") {
                    return <label className={'mediumLabel'}>{params.value}</label>
                } else if (params.value == "Major") {
                    return <label className={'majorLabel'}>{params.value}</label>
                } else {
                    return params.value
                }
            }
        },
        {
            field: 'storyPoints',
            renderHeader: (params) => (
                <a className='tableHeaderBreak' >Story<br className='tableHeaderBreak'></br>Points</a>
            ),
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
            width:300,
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
                }
                return <label className={'blankLabel'}>-</label>
            }
        },

    ];

    useEffect(() => {
        getProjectTasks();
    }, []);

    return (
        <div className="taskList">
            {
                <DataGrid
                    className='taskListDataGrid'
                    rows={tasksList}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 10,
                            },
                        },
                    }}
                    pageSizeOptions={[5, 10, 15, 20, 25, 100]}
                    // checkboxSelection
                    // components={{
                    //     Toolbar: CustomToolbar,
                    // }}
                    disableRowSelectionOnClick
                    slots={{ toolbar: CustomToolbar }}
                    slotProps={{
                        toolbar: {
                            showQuickFilter: true,
                        },
                    }}
                />
            }
        </div>
    );
}

export default TaskList;
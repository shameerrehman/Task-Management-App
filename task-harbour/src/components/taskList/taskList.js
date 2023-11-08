import './taskList.css';
import React, { useState } from 'react';


function ProjectCreation() {
    const [tasksList, setTasksList] = useState()
    function makeErrorMessage(errorText){
        // Handle errors or display a message to the user
        console.error(errorText);
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error'+errorText
        errorMessage.textContent = errorText;
        const errorClose = document.createElement('a')
        errorClose.className = 'error-btn'
        errorClose.addEventListener("click", function() {
            const errorElements = document.getElementsByClassName(errorMessage.className);
            for (let i = 0; i < errorElements.length; i++) {
                errorElements[i].style.display = 'none';
            }
        });
        errorClose.textContent = "X";
        errorMessage.appendChild(errorClose);
        document.getElementById('root').appendChild(errorMessage);
    }

    function getProjectId(){
        try{
            // return window.location.pathname.split('/')[2]
            return "9e0cad6b-4645-45a2-849d-790f449a57c7" // temp
        }catch(error){
            // Handle errors or display a message to the user
            console.error('Error getting project ID:', error);
            makeErrorMessage('Error getting project ID:' + error)
        }
    }

    function getProjectTasks(){
        if (tasksList) {
            return
        }
        try{
            // fetch('https://ogl7lxkrnfk5y6crhwzrdodzae0tmlyg.lambda-url.us-east-1.on.aws/?' + 
            //     new URLSearchParams({
            //         projectID: getProjectId()
            //     }),{
            //         method: 'GET'
            //     }
            // ).then(response =>{
            //     return response.json()

            // })
            // .then(jsonData =>{
            //     setTasksList(jsonData)
            // })
            // .catch(error=>{
            //     console.error(error)
            //     setTasksList({"error":error.message})
            // })
            var sampledata = {
                "data":[]
            }
            for (let index = 0; index < 100; index++) {
                sampledata["data"].push(
                    {
                        'TaskID': "project"+index.toString(),
                        'ProjectID': getProjectId(),
                        'UserID': "user"+index.toString(),
                        'taskName': "task#"+index.toString(),
                        'taskDescription': 'taskDescription'+index.toString(),
                        'taskDueDate': (new Date()).toDateString(),
                        'DictionaryTaskTags': ['alltag','tag'+index.toString(),'againtag'+index.toString()]
                    }
                )
            }
            setTasksList(sampledata)
        }catch(error){
            console.error("error getting tasks"+error)
            setTasksList("error getting tasks"+error)
        }
    }

    const handleSubmit = (e) => {

    };
    getProjectTasks()
    return (
        <div className="taskList">
            {
                "hi from tasklist "
            }
            {
                getProjectId()
            }
            {(() => {
                console.log(tasksList)
                return JSON.stringify(tasksList)
            })()}
        </div>
    );
}

export default ProjectCreation;
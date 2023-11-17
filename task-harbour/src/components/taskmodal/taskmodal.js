import './taskmodal.css'; 
import React, { useState } from 'react'; 
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import UserSearchDropdown from '../UserSearchDropdown/user-search';

function TaskModal() {
    const [projectID, setProjectID] = useState(''); // needs to be implemented
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [taskDueDate, setTaskDueDate] = useState('');
    const [status, setStatus] = useState('');
    const [taskTags, setTaskTags] = useState([]);
    const [creatorUserID, setCreatorUserID] = useState('');
    const [assigneeUserID, setAssigneeUserID] = useState(null);
    const [priority, setPriority] = useState('low');
    const [storyPoints, setStoryPoints] = useState(0);

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [date, setDate] = useState(new Date());
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState(); 

    const handleAssigneeChange = selectedOption => {
      setAssigneeUserID(selectedOption);
    
      // Extract the username from the selectedOption
      const selectedUsername = selectedOption ? selectedOption.value : '';
  
    };
    
    const handleSubmit = (e) => {
      e.preventDefault(); //

        const newTask= {
          projectID:'1',
          taskName:'',
          taskDescription:'',
          taskDueDate,
          status:'',
          taskTags:'',
          creatorUserID:'',
          assigneeUserID: assigneeUserID,
          priority,
          storyPoints,
        }

    fetch('https://5k36hyuwslzt52zrpha5wcvfbe0grnmw.lambda-url.us-east-1.on.aws/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
    })

    .then(response => response.json())
    .then(data => {
      console.log('Success: Task created successfully!');
      setIsSubmitted(true);
      //window.location.href = '' <-- page redirection? I need to add the link

    }) 

    .catch((error) => {
      console.error('Error creating new task', error);
      console.log(newTask);
    });
}

return (
    <div className="TaskCreation">
      <h1>New Task</h1>
      {isSubmitted ? (
        <div>Task Created</div>
            ) : (
        <form onSubmit={handleSubmit}>
          <div className='row'>
              <input
              type="text"
              placeholder="Task Name"
              required={true}
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              />
          </div>
          <div className='row'>
              <input
              placeholder="Description"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              />
          </div>
          <div className='row'>
            <div>
                <DatePicker
                  placeholderText='Deadline'
                  required={true}
                  selectsEnd
                  selected={endDate}
                  onChange={date => setEndDate(date)}
                  endDate={endDate}
                />
            </div>
          </div>
          <div className='row'>
              <input
              type="text"
              placeholder="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              />
          </div>
          <div>
              <input
                type="text"
                placeholder="Tags (comma-separated)"
                value={taskTags.join(',')}
                onChange={(e) => setTaskTags(e.target.value.split(','))}
              />
          </div>
          <div className='row'>
              <label>Assignee: </label>
                <UserSearchDropdown 
                  onUserSelect={handleAssigneeChange}
                />
          </div>
          <div>
              <input 
                type="text"
                placeholder="Creator ID"
                value={creatorUserID}
                required={true}
                onChange={(e) => setCreatorUserID(e.target.value)}
              />
          </div>
          <div>
              <label>Priority:</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="mid">Medium</option>
                <option value="high">High</option>
              </select>
          </div>
          <div>
              <label>Story Points:</label>
              <input
                type="number"
                value={storyPoints}
                onChange={(e) => setStoryPoints(Number(e.target.value))}
              />
          </div>
          <button type="submit">Create Task</button>
          </form>  
            )}
      </div>
    );
  }

export default TaskModal;

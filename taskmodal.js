import './taskmodal.css';
import { useState } from 'react';

function TaskModal({ isOpen, onClose, onCreateTask, currentProject }) {
  console.log({ isOpen, onClose, onCreateTask, currentProject })
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [actualTime, setActualTime] = useState('');
  const [assignee, setAssignee] = useState('');
  const [creator, setCreator] = useState('');
  const [priority, setPriority] = useState('low');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTask = {
      project: currentProject,
      taskName,
      taskDescription,
      estimatedTime,
      actualTime,
      assignee,
      creator,
      priority,
    };
    onCreateTask(newTask);
    onClose();
  };

  return (
    <div className={`modal ${isOpen ? 'open' : 'closed'}`}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Create a New Task</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Project:</label>
            <input type="text" value={currentProject} disabled />
          </div>
          <div>
            <label>Task Name:</label>
            <input
              type="text"
              required
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />
            <label>Task Description:</label>
            <textarea
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
            ></textarea>
          </div>
          <div>
            <label>Estimated Time (1-5):</label>
            <input
              type="number"
              min="1"
              max="5"
              required
              value={estimatedTime}
              onChange={(e) => setEstimatedTime(e.target.value)}
            />
          </div>
          <div>
            <label>Actual Time (1-5):</label>
            <input
              type="number"
              min="1"
              max="5"
              value={actualTime}
              onChange={(e) => setActualTime(e.target.value)}
            />
          </div>
          <div>
            <label>Task Assignee:</label>
            <input
              type="text"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
            />
          </div>
          <div>
            <label>Task Creator:</label>
            <input
              type="text"
              value={creator}
              required
              onChange={(e) => setCreator(e.target.value)}
            />
          </div>
          <div>
            <label>Priority:</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="mid">Mid</option>
              <option value="high">High</option>
            </select>
          </div>
          <button type="submit">Create Task</button>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;

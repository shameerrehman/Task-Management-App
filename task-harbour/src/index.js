import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Signup from './components/signup/signup';
import NavBar from './components/navbar/navbar';
import Signin from './components/signin/signin';
import ProjectCreation from './components/projectCreation/projectCreation';
import ForgotPassword from './components/ForgotPassword/ForgotPassword'; 
import ConfirmCode from './components/confirmCode/confirmCode';
import EmailVerification from './components/EmailVerification/EmailVerification';
import TaskList from './components/taskList/taskList';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <NavBar/>
      <div>
        <Routes>
          {/* <Route path="/" element={} /> */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/projectCreation" element={<ProjectCreation />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/confirm-code" element={<ConfirmCode />} />
          <Route path="/verify-email" element={<EmailVerification />} />
          <Route path="/taskList/:id" element={<TaskList />} />
        </Routes>
      </div>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

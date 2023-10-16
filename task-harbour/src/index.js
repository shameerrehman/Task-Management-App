import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Signup from './components/signup/signup';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <div>
        <Routes>
          {/* <Route path="/" element={} /> */}
          <Route path="/signup" element={<Signup />} />
          {/* <Route path="/signin" element={<Signin />} /> */}
        </Routes>
      </div>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

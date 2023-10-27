import './signin.css';
import React, { useState } from 'react';

function Signin() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const login = (e) => {
    e.preventDefault();
    fetch('https://knesgczxc3ylg7qs4kfi4pdxvy0grqbc.lambda-url.us-east-1.on.aws', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })
          .then((response) => {
            if (response.status === 201) {
              setIsSubmitted(true);
            } else {
              // Handle errors or display a message to the user
              console.error('Error during login:', response.status);
            }
          })
          .catch((error) => {
            console.error('Error during login:', error);
          });
    }
      

  return (
    <div className="page">
      <div className="form-box">
        <div className="page-name">
          <h1>Login</h1>
        </div>
    
          <div className="button-box">
            <div id="btn"></div>
            {/* <button type="button" className="toggle-btn" onClick="login()">Login</button>
            <button type="button" className="toggle-btn-two" onClick="signup()">Signup</button> */}
          </div>
            
          <form id="login" className="input-group" onSubmit={login}>
            <input type="text" className="input-field" placeholder="Username" required
            value={formData.username} 
            onChange={(e) => setFormData({ ...formData, username: e.target.value })
              }></input>
            <input type="password" className="input-field" placeholder="Password" required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })
              }></input>
            <p className="forgot"><a href="#">Forgot Password?</a></p>
            <button type="submit" className="submit-btn">Login</button>
          </form>
          <div className="rememberme">
            <input type="checkbox" id="remember" name="remember"></input>
            <label htmlFor="remember">Remember Me</label>
          </div>
          <div className="copyright"> Copyright © TaskHarbour</div>
          </div>
    </div>
  );
}

export default Signin;

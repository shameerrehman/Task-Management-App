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
    fetch('https://unthuoqlirikkuba4rasubexvu0rubjj.lambda-url.us-east-1.on.aws/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })
          .then((response) => {
            if (response.status === 200) {
              setIsSubmitted(true);
              window.location.href = '/select-project'
            } else {
              // Handle errors or display a message to the user
              console.error('Error during login:', response.status);
              const errorMessage = document.createElement('div');
            }
          })
          .catch((error) => {
            console.error('Error during login:', error);
          });
    }
      

  return (
    <div className="Signin">
    <h1>Sign In</h1>
    {isSubmitted ? (
        <div>Form submitted successfully!</div>
      ) : (
        <form onSubmit={login}>
          <div className='row'>
            <input
                type="text"
                placeholder="Username"
                required={true}
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
            />
          </div>
          <div className='row'>
            <input
              type="password"
              placeholder="Password"
              required={true}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>
          <div className='submit'>
            <button type="submit">Sign In</button>
          </div>
        </form>
        )}
        <div className='signup'><a onClick={() => { window.location.href = '/signup' }}> Dont't already have an account? Signup </a></div>
        <div className='forgot-password'><a onClick={() => { window.location.href = '/forgot-password' }}> Forgot password? </a></div>
        <div className='copyright'>Copyright © TaskHarbor </div>
    </div>
  );
}

export default Signin;

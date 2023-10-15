import './signup.css';
import React, { useState, useEffect } from 'react';


function Signup() {
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        isPrivacyChecked: false,
      });
    
      
      const [isSubmitted, setIsSubmitted] = useState(false);
     
    
      const handleSubmit = (e) => {
        e.preventDefault();
        // Form is valid, you can submit the data to your backend here        
        if(formData.password === formData.confirmPassword){
          const user = {
            name: formData.firstname + ' ' + formData.lastname,
            email: formData.email,
            username: formData.username,
            password: formData.password,
          }
        fetch('https://knesgczxc3ylg7qs4kfi4pdxvy0grqbc.lambda-url.us-east-1.on.aws', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
        })
          .then((response) => {
            if (response.status === 201) {
              setIsSubmitted(true);
            } else {
              // Handle errors or display a message to the user
              console.error('Error during signup:', response.status);
            }
          })
          .catch((error) => {
            console.error('Error during signup:', error);
          });
        } else{
          const errorMessage = document.createElement('div');
          errorMessage.className = 'error'
          errorMessage.textContent = "Passwords don't match";
          const errorClose = document.createElement('a')
          errorClose.className = 'error-btn'
          errorClose.addEventListener("click", function() {
            const errorElements = document.getElementsByClassName('error');
            for (let i = 0; i < errorElements.length; i++) {
                errorElements[i].style.display = 'none';
            }
        });
          errorClose.textContent = "X";
          errorMessage.appendChild(errorClose);
          document.getElementById('root').appendChild(errorMessage);
        }
      };


  return (
    <div className="Signup">
    <h1>Sign Up</h1>
      {isSubmitted ? (
        <div>Form submitted successfully!</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className='row'>
            <input
              type="text"
              placeholder="First Name"
              required={true}
              value={formData.firstname}
              onChange={(e) =>
                setFormData({ ...formData, firstname: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Last Name"
              required={true}
              value={formData.lastname}
              onChange={(e) =>
                setFormData({ ...formData, lastname: e.target.value })
              }
            />
          </div>

          <div className='row'>
            <input
              type="email"
              placeholder="Email"
              required={true}
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

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

          <div className='row'>
            <input
              type="password"
              placeholder="Confirm Password"
              required={true}
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
            />
          </div>
          <div className='row piv-policy'>
            <label>
              <input
                type="checkbox"
                name="isPrivacyChecked"
                required={true}
                checked={formData.isPrivacyChecked}
                onChange={(e) =>
                  setFormData({ ...formData, isPrivacyChecked: e.target.checked })
                }
              />
               I Accept the Terms of Use & Privacy Policy
            </label>
          </div>
          <div className='submit'>
            <button type="submit">Sign Up</button>
          </div>
        </form>
      )}
    
    <div className='copyright'>Copyright © TaskHarbor </div>
    </div>
  );
}

export default Signup;

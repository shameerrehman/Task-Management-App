import React, { useState } from 'react';
import './confirmCode.css';

function ConfirmCode() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    code: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(formData.password === formData.confirmPassword){
      const resetUser = {
        username: formData.username,
        new_password: formData.password,
        task: 'confirm',
        confirmation_code: formData.code,
      }
    fetch('https://3mtotetvonmshmec7onxkpy76m0wuesj.lambda-url.us-east-1.on.aws/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(resetUser),
        })
          .then((response) => {
            if (response.status === 200) {
              window.location.href = './signin'
            } else {
              const errorMessage = document.createElement('div');
              errorMessage.className = 'error'
              errorMessage.textContent = "Invalid Code or Password Requirements Not Met";
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
              // Handle errors or display a message to the user
              console.error('Error during confirmation:', response.status);
            }
          })
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
  }
  return (
    <div className="ConfirmCode">
      <h1>Confirm Password Reset Code</h1>
      <p className='success-msg'>A link to reset your password has been sent to your email address.</p>
      <form onSubmit={handleSubmit}>
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
            placeholder="New Password"
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
            placeholder="Confirm New Password"
            required={true}
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
          />
        </div>
        <div className='row'>
          <input
            type="text"
            placeholder="XXXXXX"
            pattern="\d{6}"
            title="Please enter a 6-digit code"
            required={true}
            value={formData.code}
            onChange={(e) =>
              setFormData({ ...formData, code: e.target.value })
            }
          />
        </div>
        <div className='submit'>
          <button type="submit">Reset Password</button>
        </div>
      </form>

      <div className='copyright'>Copyright © TaskHarbour </div>
    </div>
  );
}

export default ConfirmCode;

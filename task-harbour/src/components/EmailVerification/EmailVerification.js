import React, { useState } from 'react';
import './emailVerification.css';

function EmailVerification() {
  const [formData, setFormData] = useState({
    username: '',
    verification_code: ''
  });

  const resendCode = async () => {
    console.log(formData.username === '')
    const resendData = {
      username: formData.username,
      resend_code: "true",
    }
    if (formData.username === ''){
      const errorMessage = document.createElement('div');
      errorMessage.className = 'error'
      errorMessage.textContent = "Username is blank";
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
    else{
      fetch('https://knesgczxc3ylg7qs4kfi4pdxvy0grqbc.lambda-url.us-east-1.on.aws', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resendData),
      })
      .then((response) => {
        const successMessage = document.createElement('div');
        successMessage.className = 'success'
        successMessage.textContent = "Code Resent Successful! Please check your email for a new code.";
        const successClose = document.createElement('a')
        successClose.className = 'error-btn'
        successClose.addEventListener("click", function() {
          const successElements = document.getElementsByClassName('success');
          for (let i = 0; i < successElements.length; i++) {
            successElements[i].style.display = 'none';
          }
      });
        successClose.textContent = "X";
        successMessage.appendChild(successClose);
        document.getElementById('root').appendChild(successMessage);
      })
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.username === ''){
      const errorMessage = document.createElement('div');
      errorMessage.className = 'error'
      errorMessage.textContent = "Username is blank";
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
    } else{
      console.log(formData)
    fetch('https://knesgczxc3ylg7qs4kfi4pdxvy0grqbc.lambda-url.us-east-1.on.aws', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
    .then((response) => {
      if (response.status === 200) {
        window.location.href = '/signin'
        return response.json()
      }else{
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error'
        errorMessage.textContent = "Invalid Code, please try again.";
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
    })
  }
  };

  return (
    <div className="EmailVerification">
      <h1>Email Verification</h1>
      <p>Please enter the verification code sent to your email.</p>
      <button className="resend-btn" type="button" onClick={resendCode}>Resend code</button>
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
            type="text"
            placeholder="XXXXXX"
            pattern="\d{6}"
            title="Please enter a 6-digit code"
            required={true}
            value={formData.verification_code}
            onChange={(e) =>
              setFormData({ ...formData, verification_code: e.target.value })
            }
          />
        </div>
        <div className='submit'>
          <button type="submit">Verify</button>
        </div>
      </form>
      <div className='signin'>
        <a onClick={() => { window.location.href = '/signin' }}>
          &lt;-- Back to signin
        </a>
      </div>
      <div className='copyright'>
        Copyright © TaskHarbour 
      </div>
    </div>
  );
}

export default EmailVerification;

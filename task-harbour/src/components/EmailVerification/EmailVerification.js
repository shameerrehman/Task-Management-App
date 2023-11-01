import React, { useState } from 'react';
import './emailVerification.css';

function EmailVerification() {
  const [formData, setFormData] = useState({
    username: '',
    verificationCode: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = {
      username: formData.username,
      verification_code: formData.verification_code
    };
    const verificationData = {
      code: formData.verificationCode,
    };
  const handleResendCode = () => {
    const user = {
      resend_code: "true",
      username: formData.username
    };
    fetch('https://knesgczxc3ylg7qs4kfi4pdxvy0grqbc.lambda-url.us-east-1.on.aws/verify-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(verificationData),
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();  
    })
    .then(data => {
      if (data.status === 200 || data.status === 201) {
        console.log('Email verification successful:', data);
        // Handle the success scenario (e.g., display a message, redirect user)
      } else {
        console.error('Error during email verification:', data);
        // Display an error message to the user
      }
    })
    .catch((error) => {
      console.error('Error during email verification:', error);
      // Display a user-friendly error message
    });
  };

  return (
    <div className="EmailVerification">
      <h1>Email Verification</h1>
      <p>Please enter the verification code sent to your email.</p>
      <form onSubmit={handleSubmit}>
        <div className='row'>
          <input
            type="text"
            placeholder="Verification Code"
            required={true}
            value={formData.verificationCode}
            onChange={(e) =>
              setFormData({ ...formData, verificationCode: e.target.value })
            }
          />
        </div>
        <div className='submit'>
          <button type="submit">Verify</button>
        </div>
      </form>
      <div className='resend-code'>
         <button onClick={handleResendCode}>Resend Code</button>
      </div>
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

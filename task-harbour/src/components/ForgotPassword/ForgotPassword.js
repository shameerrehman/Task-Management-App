import React, { useState } from 'react';
import './forgotPassword.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Call your backend API to initiate the password reset process
    // For example:
    // const response = await fetch('https://your-lambda-url/reset-password', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email }),
    // });
    // if (response.ok) setIsEmailSent(true);
    
    console.log('Password reset email sent to:', email);
    setIsEmailSent(true);
  };

  return (
    <div className="ForgotPassword">
      <h1>Forgot Password</h1>
      {isEmailSent ? (
        <div>A link to reset your password has been sent to your email address.</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className='row'>
            <input
              type="email"
              placeholder="Email"
              required={true}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className='submit'>
            <button type="submit">Send Reset Link</button>
          </div>
        </form>
      )}
    </div>
  );
}

export default ForgotPassword;

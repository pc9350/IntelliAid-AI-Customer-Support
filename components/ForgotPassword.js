// components/ForgotPassword.js
import React, { useState } from 'react';
import { auth } from '../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import './ForgotPassword.scss';
import { useRouter } from 'next/router';

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
        await sendPasswordResetEmail(auth, email);
        setMessage("Password reset email sent. You will be redirected in a few seconds. Please check your inbox.");
        
        // Refresh the page after displaying the success message
        setTimeout(() => {
          router.push("/signin")
        }, 7000); // Adjust the delay if needed
      } catch (error) {
        setMessage(`Error: ${error.message}`);
      }
    };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Send Reset Email</button>
      </form>
      {message && <div className="forgot-password-message">{message}</div>}
    </div>
  );
}

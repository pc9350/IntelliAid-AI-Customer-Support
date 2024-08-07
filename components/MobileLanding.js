// components/MobileLanding.js
import React from 'react';
import { useRouter } from 'next/router';
import './MobileLanding.scss';

export default function MobileLanding() {
  const router = useRouter();


  return (
    <div className="mobile-landing-container">
      <div className="welcome-text">
        <h1>Welcome to IntelliAid</h1>
        <p>An AI Customer Support platform</p>
      </div>
      <div className="mobile-buttons">
        <button onClick={() => router.push('/signin')}>Sign In</button>
        <button onClick={() => router.push('/signup')}>Create Account</button>
      </div>
    </div>
  );
}

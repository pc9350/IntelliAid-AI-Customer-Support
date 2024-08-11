// components/MobileLanding.js
import React from "react";
import { useRouter } from "next/router";
import styles from "./MobileLanding.module.scss";

export default function MobileLanding() {
  const router = useRouter();

  return (
    <div className={styles.mobileLandingContainer}>
      <div className={styles.welcomeText}>
        <h1>Welcome to TrendyThreads</h1>
        <p>Your ultimate destination for the latest in fashion and style.</p>
      </div>
      <div className={styles.mobileButtons}>
        <button onClick={() => router.push("/signin")}>Sign In</button>
        <button onClick={() => router.push("/signup")}>Create Account</button>
      </div>
    </div>
  );
}

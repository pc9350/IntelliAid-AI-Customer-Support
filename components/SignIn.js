import React, { useState, useEffect } from "react";
import styles from "./SignIn.module.scss";
import { auth, googleProvider, db } from "../firebase";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import GoogleIcon from "@mui/icons-material/Google";
import Link from "next/link";
import { useRouter } from "next/router";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isMobile, setIsMobile] = useState(false);


  const router = useRouter();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);


  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Retrieve user info from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        router.push("/landingPage");
      } else {
        console.error("No such document!");
      }
    } catch (error) {
      if (error.code === "auth/invalid-credential") {
        alert("Invalid password. Please try again.");
      } else {
        console.error("Error during sign in:", error);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Retrieve or create user info in Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          email: user.email,
          createdAt: new Date(),
          uid: user.uid,
        });
      }

      console.log("User signed in with Google:", user);
      router.push("/landingPage");
    } catch (error) {
      console.error("Error during Google sign in:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftSection}>
        <div className={styles.welcomeText}>
          <h1>Welcome to TrendyThreads</h1>
          <p>Your ultimate destination for the latest in fashion and style.</p>
        </div>
      </div>
      <div className={styles.rightSection}>
        <div className={styles.card}>
          <h2>Sign In</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.inputContainer}>
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit">Sign In</button>
            <button
              type="button"
              className={styles.googleSignIn}
              onClick={handleGoogleSignIn}
            >
              <GoogleIcon /> Sign In with Google
            </button>
            <div className={styles.links}>
              <Link href="/forgot-password" className={styles.forgotPassword}>
                Forgot password?
              </Link>
              <Link href="/signup" className={styles.signUp}>
                Create Account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

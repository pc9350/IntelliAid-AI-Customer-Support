import React, { useState, useEffect } from "react";
import styles from "./SignIn.module.scss";
import { auth, googleProvider, db } from "../firebase";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
} from "firebase/auth";
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
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await handleUserSignIn(user);
      }
    });

    return () => unsubscribe();
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
        // console.log("User exists in Firestore, redirecting to landing page...");
        router.push("/landingPage");
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
      console.log("Attempting Google sign-in...");

      // if (isMobile) {
      //   console.log("Redirecting to Google sign-in for mobile...");
      //   await signInWithRedirect(auth, googleProvider);
      // } else {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        await handleUserSignIn(user);
      // }
    } catch (error) {
      console.error("Error during Google sign in:", error);
    }
  };

  const handleUserSignIn = async (user) => {
    try {
      // Retrieve or create user info in Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        // console.log("New user detected, creating user document...");
        await setDoc(userDocRef, {
          email: user.email,
          createdAt: new Date(),
          uid: user.uid,
        });
      } 
      router.push("/landingPage");
    } catch (error) {
      console.error("Error handling user sign in:", error);
    }
  };

  useEffect(() => {
    const handleAuthRedirect = async () => {
      if (isMobile) {
        try {
          const result = await getRedirectResult(auth);
          if (result) {
            const user = result.user;
            await handleUserSignIn(user);
          }
        } catch (error) {
          console.error("Error handling redirect result:", error);
        }
      }
    };
  
    handleAuthRedirect();
  }, [isMobile]);

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

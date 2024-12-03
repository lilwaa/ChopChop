import React, { useState, useEffect } from 'react';
// css styling
import '../../styles/animate.css';
import '../../styles/icomoon.css';
import '../../styles/bootstrap.css';
import '../../styles/flexslider.css';
import '../../styles/style.css';

import {app, auth, db} from "../../firebase/firebaseConfig.js";
//import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js"
import { getDoc, doc, collection, addDoc, deleteDoc, setDoc } from 'firebase/firestore';
//import { getFirestore, doc, getDoc, setDoc, collection } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js"

import {getAuth, sendEmailVerification, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail} from "firebase/auth"; 

function ErrorPopup({ error, closeErrorPopup }) {
    const [isOpen, setIsOpen] = useState(true); // Popup visibility
    const [errorMessage, setErrorMessage] = useState(''); // Error message
  
    // changing error message depended on what error we put in
    useEffect(() => {
        let errMess = '';
        console.log(error);
        if (error === 'auth/email-already-in-use') {
            errMess = "Error: This user already exists!"; 
        } else if (error === 'auth/invalid-email') {
            errMess = "Error: Invalid email!"; 
        } else if (error === 'auth/weak-password') {
            errMess = "Error: Invalid password! Must be longer than 6 characters."; 
        } else if (error === 'auth/invalid-password') {
            errMess = "Error: Invalid password!"; 
        } else if (error === 'auth/invalid-email') {
            errMess = "Error: Invalid Email."; 
        } else if (error === 'auth/user-not-found') {
            errMess = "Error: User not found."; 
        } else if (error === 'auth/invalid-credential') {
            errMess = "Error: Invalid Credentials. Maybe an incorrect email or password?"; 
        } else if(error === 'auth/too-many-requests'){
            errMess = "Error: Too many failed login attempts. Reset password or try again later."; 
        } else if(error === 'auth/wrong-password'){
            errMess = "Error: Wrong password."; 
        } else if (error === 'auth/network-request-fail'){
            errMess = "Error: Network error. Please check your connection.";
        } else if (error === "auth/requires-recent-login"){
            errMess = "Error: Please log in again.";
        } else if (error === "auth/user-token-expired"){
            errMess = "Error: Token has expired. Logout and log in again.";
        } else if (error === "auth/unknown"){
            errMess = "Error: Unknown error.";
        }
        else {
            errMess = error; 
        }    
      setErrorMessage(errMess); // Set the error message when error prop changes
    }, [error]); // Only run this effect when 'error' changes
  
    // Function to close the popup
    const closePopup = () => {
      setIsOpen(false);
      closeErrorPopup(); // Close the error popup from the parent
    };
  
    return (
      <>
        {isOpen && (
          <div className="popup-overlay" id="popupOverlay">
            <div className="popup" style={{ display: 'block', zIndex: 999 }} id="popup">
              <span className="close" id="closePopup" onClick={closePopup}>
                &times;
              </span>
              <div className="popup-content" id="signupErrorContent">
                <p>{`${errorMessage}`}</p> {/* Display the error message */}
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
  
  
  export default ErrorPopup;
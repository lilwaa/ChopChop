import React, { useState, useEffect } from 'react';
// css styling
import '../../styles/animate.css';
import '../../styles/icomoon.css';
import '../../styles/bootstrap.css';
import '../../styles/flexslider.css';
import '../../styles/style.css';

import {app, auth, db} from "../../firebase/firebaseConfig.js";
import { getDoc, doc, collection, addDoc, deleteDoc, setDoc } from 'firebase/firestore';
import {EmailAuthProvider, deleteUser, reauthenticateWithCredential, getAuth, sendEmailVerification, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail} from "firebase/auth"; 
//import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js"
//import { getFirestore, doc, getDoc, setDoc, collection, deleteDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js"
//import {EmailAuthProvider, reauthenticateWithCredential, deleteUser, getAuth, sendEmailVerification, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail} from   "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js"; 
import ErrorPopup from './ErrorPopup.js';

// async function to delete user profile
async function deleteProf(uid) {
    await deleteDoc(doc(db, "userProfile", uid));
  }
  
  function ReauthenticateForDeletionModal({ closeReauthModal }) {
    const [isOpen, setIsOpen] = useState(true);
    const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMess, setErrorMess] = useState('');
  
    const openModal = () => setIsOpen(true);
    const closeModal = () => {
        setIsOpen(false);
        closeReauthModal();
    }
     // changing error message depended on what error we put in
  
  
    // open/close error popup
    const openErrorPopup = () => setIsErrorPopupOpen(true);
    const closeErrorPopup = () => setIsErrorPopupOpen(false);
  
    // handling form submission
    const loginHandler = async (e) => {
      e.preventDefault(); // prevent default form submission behavior
      const user = auth.currentUser;
      if (!user) {
        setErrorMess('No user is currently logged in.');
        openErrorPopup();
        return;
      }
  
      const credential = EmailAuthProvider.credential(email, password);
  
      try {
        // reauthenticate the user
        await reauthenticateWithCredential(user, credential);
  
        // delete firestore prof
        const uid = user.uid;
        await deleteProf(uid);
  
        // delete user from fb
        await deleteUser(user);
  
        console.log("User deletion successful");
        setErrorMess("Account deleted successfully.");
        openErrorPopup();
        closeReauthModal(); // close modal after successful deletion
      } catch (error) {
        console.error("Error during reauthentication or deletion:", error);
        setErrorMess(error.message || 'An error occurred');
        openErrorPopup();
      }
    };
  
    return (
      <>
        {isOpen && (
          <div id="login-modal" className="popup" style={{ zIndex: 999, display: 'block' }}>
            <br />
            <h3 style={{ textAlign: 'center' }}>Reauthenticate your account...</h3>
            <span className="close" id="close-login-button" onClick={closeModal}>&times;</span>
            <form id="login-form" style={{ padding: '20px', marginLeft: '5px' }}>
              <div className="input-field">
                <input
                  type="email"
                  id="login-email"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)} // email input
                  required
                />
              </div>
              <div className="input-field">
                <input
                  type="password"
                  id="login-password"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)} // password input
                  required
                />
              </div>
              <br />
              <button
                className="btn green darken-2 z-depth-0"
                style={{ margin: '0 auto', display: 'block' }}
                onClick={loginHandler} // pass event to login handler
              >
                Login
              </button>
            </form>
          </div>
        )}
        {/* error popup */}
        {isErrorPopupOpen && (
          <ErrorPopup error={errorMess} closeErrorPopup={closeErrorPopup} />
        )}
      </>
    );
  }
  
  export default ReauthenticateForDeletionModal;
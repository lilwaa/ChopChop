import React, { useState, useEffect } from 'react';
// css styling
import '../../styles/animate.css';
import '../../styles/icomoon.css';
import '../../styles/bootstrap.css';
import '../../styles/flexslider.css';
import '../../styles/style.css';

import {app, auth, db} from "../../firebase/firebaseConfig.js";
import { getDoc, doc, collection, addDoc, deleteDoc, setDoc } from 'firebase/firestore';
import {getAuth, sendEmailVerification, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail} from "firebase/auth"; 
//import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js"
//import { getFirestore, doc, getDoc, setDoc, collection } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js"
//import {getAuth, sendEmailVerification, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail} from   "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js"; 
import ErrorPopup from './ErrorPopup.js';


function LoginModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [isForgotPassModalOpen, setIsForgotPassModalOpen] = useState(false);
    const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMess, setErrorMess] = useState('');

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);
  
    //open/close forgot password modal
    const openForgotPassModal = () => {
        closeModal(); // close the login modal when forgot pass is clicked
        setIsForgotPassModalOpen(true); // open forgot pass modal
    };
    const closeForgotPassModal = () => setIsForgotPassModalOpen(false);


     //open/close forgot error popup
    const openErrorPopup = () => {
      setIsErrorPopupOpen(true); // open forgot pass modal
    };
    const closeErrorPopup = () => setIsErrorPopupOpen(false);

    //handling login form submission
    const loginHandler = (e) => {
        e.preventDefault(); // prevent default form submission behavior
    
        //  login function 
        signInWithEmailAndPassword(auth, email, password)
          .then((cred) => {
            // close modal and reset form
            closeModal();
            setEmail('');
            setPassword('');
          })
          .catch((error) => {
            setErrorMess(error.code);
            openErrorPopup();
            // error handling
          });
      };



  return (
    <>
      {isOpen && !isForgotPassModalOpen && (
        <div className="popup-overlay" id="popupOverlay">
        <div id="login-modal" className="popup" style={{ zIndex: 1, display: 'block' }}>
          <br />
          <h3 style={{ textAlign: 'center' }}>Log In</h3>
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
              onClick={(e) => loginHandler(e)} // pass event to login handler
            >
              Login
            </button>
          </form>
          <button 
            className="logged-out btn green darken-2 z-depth-0" 
            onClick={openForgotPassModal}>
            Forgot Password?
          </button>
        </div>
        </div>
      )}

      {/* forgot pass modal */}
      {isForgotPassModalOpen && (
        <ForgotPassModal closeForgotPassModal={closeForgotPassModal} />
      )}

      {/* error popup */}
      {isErrorPopupOpen && (
        <ErrorPopup error={errorMess} closeErrorPopup={closeErrorPopup} />
      )}

      {/* login button */}
      <button className="logged-out btn green darken-2 z-depth-0" onClick={openModal}>
        Login
      </button>
    </>
  );
}

function ForgotPassModal({ closeForgotPassModal }) {
    //modal visibility
    const [isPassModalOpen, setIsPassModalOpen] = useState(true);
    const [email, setEmail] = useState('');

    //error messages
    const [errorMess, setErrorMess] = useState('');
    const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false);


    //open/close forgot error popup
    const openErrorPopup = () => {
      setIsErrorPopupOpen(true); // open forgot pass modal
    };
    const closeErrorPopup = () => setIsErrorPopupOpen(false);

    //handling forgot password form submission
    const forgotPassHandler = (e) => {
        e.preventDefault(); // prevent default form submission behavior
        sendPasswordResetEmail(auth, email).then(() =>{
            closeForgotPassModal();
        }).catch((error) => {
            setErrorMess(error.code);
            openErrorPopup();
        });
    };

    const closePassModal = () => {
        setIsPassModalOpen(false);
        closeForgotPassModal(); // close forgot pass modal
    };
  
    return (
      <>
        {/* password reset modal*/}
        {isPassModalOpen && (
          <div id="pass-modal" className="popup" style={{ zIndex: 1, display: 'block' }}>
            <br />
            <h3 style={{ textAlign: 'center' }}>Password Reset</h3>
            <span className="close" id="close-pass-button" onClick={closePassModal}>&times;</span>
            <form id="pass-form" style={{ padding: '20px', marginLeft: '5px' }}>
              <div className="input-field">
                <input
                  type="email"
                  id="pass-email"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)} // email input
                  required
                />
              </div>
              <br />
              <button
                id="pass-submit"
                className="btn green darken-2 z-depth-0"
                style={{ margin: '0 auto', display: 'block' }}
                onClick={(e) => forgotPassHandler(e)}
              >
                Send
              </button>
            </form>
          </div>
        )}
        {isErrorPopupOpen && (
          <ErrorPopup error={errorMess} closeErrorPopup={closeErrorPopup} />
        )}
      </>
    );
}

export default LoginModal;

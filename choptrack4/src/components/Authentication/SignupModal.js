import React, { useState } from 'react';
// css styling
import '../../styles/animate.css';
import '../../styles/icomoon.css';
import '../../styles/bootstrap.css';
import '../../styles/flexslider.css';
import '../../styles/style.css';

//import firebase stuff
import {app, auth, db} from "../../firebase/firebaseConfig.js";
import { getDoc, doc, collection, addDoc, deleteDoc, setDoc } from 'firebase/firestore';
import {getAuth, sendEmailVerification, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail} from "firebase/auth"; 
//import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js"
//import { getFirestore, doc, getDoc, setDoc, collection } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js"
//import {getAuth, sendEmailVerification, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail} from   "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js"; 
import ErrorPopup from './ErrorPopup.js';

function SignupModal() {
    const [isOpen, setIsOpen] = useState(false);
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumberr, setPhoneNumber] = useState('');
    const [namee, setName] = useState('');

    //error messages
    const [errorMess, setErrorMess] = useState('');
    const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false);

    //open/close forgot error popup
    const openErrorPopup = () => {
      setIsErrorPopupOpen(true); // open forgot pass modal
    };
    const closeErrorPopup = () => setIsErrorPopupOpen(false);

    const signupHandler = (e) => {
        e.preventDefault();
        createUserWithEmailAndPassword(auth, email, password).then(
            cred => {
                console.log("user creation");
                
                const user = cred.user;
                const usersCollection = collection(db, 'userProfile'); 
    
                const docRef = doc(usersCollection, user.uid); 
                const data = {
                    name: namee,
                    phoneNumber: "+1"+ phoneNumberr,
                }
                try {
                    const docdoc = setDoc(docRef, data);
                    sendEmailVerification(auth.currentUser)
                    .then(() => {
                        console.log("verification sent");
                        setErrorMess("Check email " + email + " for verification!");
                        openErrorPopup();
                        // const element = document.getElementById("signupErrorContent");
                        // element.textContent = "Please check email for verification link!"; 
                        // openPopup();
                    });
                    closeModal();
                    setEmail('');
                    setPassword('');
                    setPhoneNumber('');
                    setName('');
                    signInWithEmailAndPassword(auth, email, password);
                } catch (e) {
                    console.error("Error adding document: ", e);
                }
            }
        ).catch ((error) =>{
          setErrorMess(error.code);
          openErrorPopup();
        });
    };

  
  return (
    <>
      {isOpen && (
        <div className="popup-overlay" id="popupOverlay">
        <div id="signup-modal" className="popup" style={{ zIndex: 1, display: 'block' }}>
          <br />
          <h3 style={{ textAlign: 'center' }}>Sign up</h3>
          <span className="close" id="close-signup-button" onClick={closeModal}>&times;</span>
          <form id="signup-form" style={{ padding: '20px', marginLeft: '5px' }}>
            <div className="input-field">
              <input
                type="text"
                id="signup-name"
                placeholder="Name"
                onChange={(e) => setName(e.target.value)} 
                required
              />
            </div>
            <div className="input-field">
              <input
                type="tel"
                id="signup-number"
                placeholder="Phone Number"
                onChange={(e) => setPhoneNumber(e.target.value)} 
                required
              />
            </div>
            <div className="input-field">
              <input
                type="email"
                id="signup-email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)} 
                required
              />
            </div>
            <div className="input-field">
              <input
                type="password"
                id="signup-password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)} 
                required
              />
            </div>
            <br />
            <button
              className="btn green darken-2 z-depth-0"
              style={{ margin: '0 auto', display: 'block' }}
              onClick={(e) => signupHandler(e)} // Pass event to signupHandler
            >
              Sign up
            </button>
          </form>
        </div>
        </div>
      )}
      {/* error popup */}
      {isErrorPopupOpen && (
        <ErrorPopup error={errorMess} closeErrorPopup={closeErrorPopup} />
      )}
      <button className="logged-out btn green darken-2 z-depth-0" onClick={openModal}>Sign Up</button>
    </>
  );
}

export default SignupModal;

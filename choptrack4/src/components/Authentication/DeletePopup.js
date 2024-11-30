import React, { useState, useEffect } from 'react';
// css styling
import '../../styles/animate.css';
import '../../styles/icomoon.css';
import '../../styles/bootstrap.css';
import '../../styles/flexslider.css';
import '../../styles/style.css';

//import {app, auth, db} from "../../firebase/firebaseConfig.js";
//import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js"
//import { getFirestore, doc, getDoc, setDoc, collection, deleteDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js"
//import {deleteUser, EmailAuthProvider, reauthenticateWithCredential, getAuth, sendEmailVerification, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail} from   "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js"; 
import ErrorPopup from './ErrorPopup.js';
import ReauthenticateForDeletionModal from './ReauthenticateModal.js';

function DeletePopup({ closeDeletePopup }) {
    const [isOpen, setIsOpen] = useState(true); // Popup visibility
     //error messages
     const [errorMess, setErrorMess] = useState('');
     const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false);
 
     //open/close forgot error popup
     const openErrorPopup = () => {
       setIsErrorPopupOpen(true); // open forgot pass modal
     };
     const closeErrorPopup = () => setIsErrorPopupOpen(false);

    //error messages
    const [isReauthenticatePopupOpen, setIsReauthenticatePopupOpen] = useState(false);

    //open/close forgot error popup
    const openReauthenticatePopup = () => {
        setIsReauthenticatePopupOpen(true); // open forgot pass modal
    };
    const closeReauthenticatePopup = () => setIsReauthenticatePopupOpen(false);

    // Function to close the popup
    const closePopup = (e) => {
      setIsOpen(false);
      closeDeletePopup(); // Close the error popup from the parent
    };

    //handling deletion, open reauthenticate for deletion
    const deleteHandler = (e) => {
        e.preventDefault();
        openReauthenticatePopup();
        console.log(isReauthenticatePopupOpen);
    };
  

    return (
      <>
        {isOpen && (
          <div className="popup-overlay" id="popupOverlay">
            <div className="popup" style={{ display: 'block', zIndex: 999 }} id="popup">
            <br />
            <br />
            <h3 style={{ textAlign: 'center' }}>Delete account?</h3>
              <span className="close" id="closePopup" onClick={closePopup}>
                &times;
              </span>
              <div className="popup-content" id="signupErrorContent">
              <button
                className="btn green darken-2 z-depth-0"
                style={{ margin: '0 auto', display: 'block' }}
                onClick={(e) => closePopup(e)}
              >
                No, not sure.
              </button>
              <br />
              <button
                className="btn darken-2 z-depth-0"
                style={{ margin: '0 auto', display: 'block', backgroundColor: 'red' }}
                onClick={(e) => deleteHandler(e)}
              >
                Delete.
              </button>
              </div>
            </div>
          </div>
        )}
        {/* error popup */}
        {isErrorPopupOpen && (
            <ErrorPopup error={errorMess} closeErrorPopup={closeErrorPopup} />
        )}
        {/* reauthenticate popup */}
        {isReauthenticatePopupOpen && (
            <ReauthenticateForDeletionModal closeReauthModal={closeReauthenticatePopup}/>
        )}
      </>
    );
  }
  
  
  export default DeletePopup;
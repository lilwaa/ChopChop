import React, { useEffect, useState } from 'react';

// import css files
import '../styles/style.css';

// firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc, collection } from 'firebase/firestore';
import { getAuth, sendPasswordResetEmail, verifyBeforeUpdateEmail} from "firebase/auth"; 
//import { getFirestore, doc, getDoc, updateDoc, collection } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
//import { getAuth, sendPasswordResetEmail, verifyBeforeUpdateEmail } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import {app, auth, db} from "../firebase/firebaseConfig.js";
import DeletePopup from '../components/Authentication/DeletePopup.js';


const AccountPage = () => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  //delete popup stuff
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);

  //open/close delete popup
  const openDeletePopup = () => {
    setIsDeletePopupOpen(true); // open forgot pass modal
  };
  const closeDeletePopup = () => setIsDeletePopupOpen(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
      if (authUser) {
        const getUserProfile = async () => {
          const usersCollection = collection(db, 'userProfile');
          const docRef = doc(usersCollection, authUser.uid);
          try {
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              setUserProfile(docSnap.data());
            } else {
              console.log("No such document!");
            }
          } catch (error) {
            console.error("Error fetching document:", error);
          }
        };

        getUserProfile();
      }
    });

    return () => unsubscribe(); // cleanup on component unmount
  }, []);
  useEffect(() => {
    // change the title dynamically
    document.title = 'Account';
  }, []); // runs only once after the component mounts


  const editHandler = () => {
    const nameField = document.getElementById("acc-name");
    const phoneField = document.getElementById("acc-number");
    const emailField = document.getElementById("acc-email");

    if (nameField.readOnly) {
      nameField.removeAttribute("readonly");
      phoneField.removeAttribute("readonly");
      emailField.removeAttribute("readonly");
      document.getElementById("acc-editsubmit").textContent = "Save";
    } else {
      // save updates
      const name = nameField.value;
      const phoneNumber = phoneField.value;
      const email = emailField.value;

      if (name || phoneNumber || email) {
        const updates = {};
        if (name) updates.name = name;
        if (phoneNumber) updates.phoneNumber = phoneNumber;

        const userDocRef = doc(db, 'userProfile', user.uid);
        updateDoc(userDocRef, updates).then(() => {
          console.log("Profile updated");
          document.getElementById("acc-editsubmit").textContent = "Edit";
          nameField.setAttribute("readonly", "readonly");
          phoneField.setAttribute("readonly", "readonly");
          emailField.setAttribute("readonly", "readonly");

          if (email) {
            verifyBeforeUpdateEmail(auth.currentUser, email).then(() => {
              console.log("Email updated successfully");
              window.location.reload();
            }).catch((error) => {
              console.log(error);
            });
          }
          else{
            window.location.reload();
          }
        }).catch((error) => {
          console.error("Error updating profile:", error);
        });
      }
      else{
        nameField.removeAttribute("readonly");
        phoneField.removeAttribute("readonly");
        emailField.removeAttribute("readonly");
        window.location.reload();
      }
    }
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    const email = user.email;
    sendPasswordResetEmail(auth, email).then(() => {
      console.log("Password reset email sent");
    }).catch((error) => {
      const errorElement = document.getElementById("signupErrorContent");
      errorElement.textContent = error.code;
    });
  };

  const deleteHandler = (e) => {
    e.preventDefault();
    openDeletePopup();
  }


  if (!user) {
    return (
      <div>
        <p style= {{textAlign: 'center', fontSize: '30px', padding: '3rem'}}>Please log in to view your account information.</p>
      </div>
    );
  }

  return (
    <>
      {/* account info */}
      {<div className="form-wrapper">
        <div className="form-container" style={{ textAlign: 'center' }}>
          <h3>Account Info</h3>
          <form id="account-form" style={{ padding: '20px', marginLeft: '5px' }}>
            <div className="input-field acc">
              <label htmlFor="acc-name">Name</label>
              <input
                type="text"
                id="acc-name"
                placeholder={userProfile ? userProfile.name : "Loading..."}
                readOnly
              />
            </div>
            <div className="input-field acc">
              <label htmlFor="acc-number">Phone Number</label>
              <input
                type="tel"
                id="acc-number"
                placeholder={userProfile ? userProfile.phoneNumber : "Loading..."}
                readOnly
              />
            </div>
            <div className="input-field acc">
              <label htmlFor="acc-email">Email</label>
              <input
                type="email"
                id="acc-email"
                placeholder={user.email}
                readOnly
              />
            </div>

            {/* reset password */}
            <div className="input-field acc">
              <label htmlFor="acc-reset-password">Password</label>
              <button
                type="button"
                id="acc-reset-password"
                className="btn-reset"
                onClick={handleResetPassword}
              >
                Reset Password
              </button>
            </div>
            <br/>
            {/* edit Button */}
            <button
              type="button"
              id="acc-editsubmit"
              className="btn green darken-2 z-depth-0"
              style={{ margin: '0 auto', display: 'block' }}
              onClick={(e) => editHandler(e)}
            >
              Edit
            </button>
            <br/>
            {/* delete button */}
            <button
                type="button"
                id="acc-editsubmit"
                className="btn green darken-2 z-depth-0"
                style={{ margin: '0 auto', display: 'block', backgroundColor: 'red'}}
                onClick={(e) => deleteHandler(e)}
              >
                Delete Account
              </button>
          </form>
          
        </div>
      </div>}
      {/* error popup */}
      {isDeletePopupOpen && (
        <DeletePopup closeDeletePopup={closeDeletePopup} />
      )}
    </>
  );
};

export default AccountPage;

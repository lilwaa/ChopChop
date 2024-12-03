import React, { useState, useEffect } from 'react';
// css styling
import '../../styles/animate.css';
import '../../styles/icomoon.css';
import '../../styles/bootstrap.css';
import '../../styles/flexslider.css';
import '../../styles/style.css';

import {app, auth, db} from "../../firebase/firebaseConfig.js";
import { getDoc, getDocs, doc, collection, addDoc, deleteDoc, setDoc, writeBatch} from 'firebase/firestore';
import {EmailAuthProvider, deleteUser, reauthenticateWithCredential, getAuth, sendEmailVerification, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail} from "firebase/auth"; 
import { getStorage, ref, listAll, deleteObject } from "firebase/storage";
//import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js"
//import { getFirestore, doc, getDoc, setDoc, collection, deleteDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js"
//import {EmailAuthProvider, reauthenticateWithCredential, deleteUser, getAuth, sendEmailVerification, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail} from   "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js"; 
import ErrorPopup from './ErrorPopup.js';

//FOLLOWING IS FOR DELETION FROM FIRESTORE:
// delete documents in a specific subcollection
async function deleteSubcollection(collectionRef) {
  const snapshot = await getDocs(collectionRef);

  if (snapshot.empty) {
    console.log(`No documents to delete in subcollection: ${collectionRef.path}`);
    return;
  }
  // delete all documents in this subcollection
  const batch = writeBatch(db);
  snapshot.forEach(doc => {
    batch.delete(doc.ref);
  });
  // commit the batch delete operation
  await batch.commit();
  console.log(`Deleted ${snapshot.size} documents in subcollection: ${collectionRef.path}`);
}

// main function to delete a document and its subcollections
async function deleteDocumentWithSubcollections(docPath) {
  const subcollections = ['clean-receipts', 'receipts', 'fridge'];

  try {
    const docRef = doc(db, docPath); // Create a reference to the document
    // delete known subcollections
    for (const subcollection of subcollections) {
      const subcollectionRef = collection(db, docPath, subcollection);
      await deleteSubcollection(subcollectionRef);
    }
    // delete the parent document after all subcollections are deleted
    await deleteDoc(docRef);
    console.log(`Deleted document: ${docRef.path}`);
  } catch (error) {
    console.error('Error during deletion:', error);
  }
}
//FOLLOWING IS FOR DELETION FROM FIREBASE STORAGE:
// firebase storage
const storage = getStorage();

//  delete all receipts for a specific user
async function deleteAllReceiptsForUser(uid) {
  try {
    //reference to user receipts folder
    const receiptsFolderRef = ref(storage, `users/${uid}/receipts/`);

    //all items in receipts folder
    const listResult = await listAll(receiptsFolderRef);

    // iterate through each file in the receipts folder and delete it
    for (const item of listResult.items) {
      await deleteObject(item);  // Delete each receipt
      console.log(`Deleted receipt: ${item.fullPath}`);
    }
    console.log(`All receipts for user ${uid} deleted successfully.`);
  } catch (error) {
    console.error('Error deleting receipts from Firebase Storage:', error);
  }
}


//FOLLOWING IS FOR COMBINING ABOVE:
// async function to delete userProfile and user documents, deletion from firebase storage
async function deleteProf(uid) {
    //single delete document from userProfile (not complex profile document)
    await deleteDoc(doc(db, "userProfile", uid));
    // path to the document in (the "users" collection and the document with the UID)
    const path = `users/${uid}`;
    // delete document and subcollections in firestore
    deleteDocumentWithSubcollections(path)
    .then(() => console.log('Deletion complete'))
    .catch((error) => console.error('Error deleting document:', error));
    //delete receipts from firebase storage
    deleteAllReceiptsForUser(uid)
    .then(() => console.log('Receipt deletion complete'))
    .catch((error) => console.error('Error deleting receipts:', error));
    
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
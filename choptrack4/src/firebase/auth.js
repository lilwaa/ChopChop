// Import Firebase modules
import { getFirestore, doc, getDoc, setDoc, collection } from "firebase/firestore"
import {getAuth, sendEmailVerification, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail} from "firebase/auth"; 
import {auth, app, db} from "./firebaseConfig.js";

//tracking of user authentication status
auth.onAuthStateChanged(user => {
    if (user){
        let elements = document.querySelectorAll(".logged-out");
        elements.forEach(element =>{
            element.style = 'display:none;'
        });
        elements = document.querySelectorAll(".logged-in");
        elements.forEach(element =>{
            element.style = 'display:compact;';
        });
        
    }
    else{
        let elements = document.querySelectorAll(".logged-in");
        elements.forEach(element =>{
            element.style = 'display:none;';
        });
        elements = document.querySelectorAll(".logged-out");
        elements.forEach(element =>{
            element.style = 'display:compact;';
        });
    }
    console.log(user);
});

//error pop-ups
const popupOverlay = document.getElementById('popupOverlay');
const popup = document.getElementById('popup');
const closePopup = document.getElementById('closePopup');
// Function to open the popup
export function openPopup() {
    popup.style.display = 'block';
}
// Function to close the popup
export function closePopupFunc() {
    popup.style.display = 'none';
}
// Event listeners
// Close the popup when the close button is clicked
closePopup.addEventListener('click', closePopupFunc);
// Close the popup when clicking outside the popup content
popupOverlay.addEventListener('click', function (event) {
    if (event.target === popupOverlay) {
        closePopupFunc();
    }
});



//signup functionalities
const signupButton = document.getElementById("signup-button");
const closeSignupButton = document.getElementById("close-signup-button");
const signupModal = document.getElementById("signup-modal");
const navsignup = document.getElementById("getstarted-signup");


function openSignupModal() {
    signupModal.style.display = 'block';
}
function closeSignupModal() {
    signupModal.style.display = 'none';
}   

signupButton.addEventListener('click', openSignupModal);
closeSignupButton.addEventListener('click', closeSignupModal);
navsignup.addEventListener('click', openSignupModal);


//sign-up
const signupform = document.querySelector('#signup-form');
    signupform.addEventListener('submit', (e) =>{
        //prevent default action of submission
        e.preventDefault();
    
        const email = signupform['signup-email'].value;
        const password = signupform['signup-password'].value;
        const name = signupform['signup-name'].value;
        const number = signupform['signup-number'].value;
    
        //sign up the user given the details
        createUserWithEmailAndPassword(auth, email, password).then(
            cred => {
                // console.log(cred.user);
                // console.log("user creation");
                // console.log(db);
                
                const user = cred.user;
                const usersCollection = collection(db, 'userProfile'); 
                // console.log("userCollection", usersCollection);
    
                const docRef = doc(usersCollection, user.uid); 
                const data = {
                    name: name,
                    phoneNumber: number,
                }
                try {
                    const docdoc = setDoc(docRef, data);
                    sendEmailVerification(auth.currentUser)
                    .then(() => {
                        // Email verification sent!
                        // ...
                        console.log("verification sent");
                        const element = document.getElementById("signupErrorContent");
                        element.textContent = "Please check email for verification link!"; 
                        openPopup();
                    });
                    signupform.reset();
                    closeSignupModal();
                } catch (e) {
                    console.error("Error adding document: ", e);
                }
            }
        ).catch ((e) =>{
            if (e.code === 'auth/email-already-in-use') {
                const element = document.getElementById("signupErrorContent");
                element.textContent = "This user already exists!"; 
                openPopup();
                //alert("This user already exists!");
            } else if (e.code === 'auth/invalid-email') {
                const element = document.getElementById("signupErrorContent");
                element.textContent = "Invalid email!"; 
                openPopup();
                //alert("Invalid email.");
            } else if (e.code === 'auth/weak-password') {
                const element = document.getElementById("signupErrorContent");
                element.textContent = "Invalid password! Must be longer than 6 characters."; 
                openPopup();
                //alert("Invalid password. Must be longer than 6 characters.");
            } else if (e.code === 'auth/invalid-password') {
                const element = document.getElementById("signupErrorContent");
                element.textContent = "Invalid password!"; 
                openPopup();
                //alert("Invalid password!");
            }else {
                const element = document.getElementById("signupErrorContent");
                element.textContent = e.message; 
                openPopup();
                //alert(e.message);
            }    
        });
    } ); //when the form submits, we want to add their user if it doesn't exist    
// login functionalities
const loginButton = document.getElementById("login-button");
const closeLoginButton = document.getElementById("close-login-button");
const loginModal = document.getElementById("login-modal");

function openLoginModal() {
    loginModal.style.display = 'block';

}
function closeLoginModal() {
    loginModal.style.display = 'none';
}
loginButton.addEventListener('click', openLoginModal);
closeLoginButton.addEventListener('click', closeLoginModal);

//login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
        // get user info
        const email = loginForm['login-email'].value;
        const password = loginForm['login-password'].value;
    
        // log the user in
        signInWithEmailAndPassword(auth, email, password).then((cred) => {
            // close the signup modal & reset form
            const modal = document.querySelector('#modal-login');
            loginForm.reset();
            closeLoginModal();
            }).catch ((e) =>{
            if (e.code === 'auth/invalid-email') {
                const element = document.getElementById("signupErrorContent");
                element.textContent = "Invalid Email."; 
                openPopup();
            } else if (e.code === 'auth/user-not-found') {
                const element = document.getElementById("signupErrorContent");
                element.textContent = "User not found."; 
                openPopup();
            } else if (e.code === 'auth/invalid-credential') {
                const element = document.getElementById("signupErrorContent");
                element.textContent = "Invalid Credentials. Maybe an incorrect email or password?"; 
                openPopup();
            } else if(e.code === 'auth/too-many-requests'){
                const element = document.getElementById("signupErrorContent");
                element.textContent = "Too many failed login attempts. Reset password or try again later."; 
                openPopup();
            }
            else {
                alert(e.message);
            }   
        });
});
//forgot password functionality
const forgotpassModal = document.getElementById("pass-modal");
function openForgotPassModal() {
    forgotpassModal.style.display = 'block';
}
const forgotpass = document.getElementById("forgot-password");
forgotpass.addEventListener('click', (e) => {
    closeLoginModal();
    openForgotPassModal();
});

const forgotCloseButton = document.getElementById("close-pass-button");
const forgotpassword = document.querySelector("#forgot-password");

function closeForgotPassModal() {
    forgotpassModal.style.display = 'none';
}   
forgotCloseButton.addEventListener('click', (e) =>{
    console.log("hi!!");
    closeForgotPassModal();
});
const passform = document.querySelector('#pass-form');
passform.addEventListener('submit', (e)=>{
    e.preventDefault();
    const email = passform['pass-email'].value;
    sendPasswordResetEmail(auth, email).then(() =>{
        console.log("success");
        closeForgotPassModal();
    }).catch((error) => {
        const element = document.getElementById("signupErrorContent");
        element.textContent = error.code; 
        openPopup();
    });
});
    

//logout
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut();
    window.location.href = "index.html";
    console.log("user logged out");
});

export {app, auth, db}
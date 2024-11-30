import React,  { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// css styling
import '../../styles/Navbar.css';

import {app, auth, db} from "../../firebase/firebaseConfig.js";

//import logo
import logo from "../../assets/placeholder.png";

function Navbar() {
  const [openLinks, setOpenLinks] = useState(false);
  const [user, setUser] = useState(null); // authstate tracking
  const toggleNavbar = () => {
    setOpenLinks(!openLinks);
  };

  useEffect(() => {
    const currentUser = auth.currentUser;
    setUser(currentUser); // set the current user in the state

    const intervalId = setInterval(() => {
      const user = auth.currentUser;
      setUser(user);
    }, 1000); // every 1 second (just an example)

    // clear the interval if the component unmounts
    return () => clearInterval(intervalId);
    }, []); // empty dependency array to only run on mount

     // logout handler
    const logoutHandler = () => {
      auth
        .signOut()
        .then(() => {
          console.log("User logged out successfully");
        })
        .catch((error) => {
          console.error("Error logging out: ", error);
        });
    };

  return (
    <div className="navbar">
      <img src={logo} width="75" alt="ChopChop Logo" />
      <div className="leftSide">
        <div className="hiddenLinks">
          <Link to="/">Home</Link>
          <Link to="/search">ChopGuide</Link>
          {user && (<Link to="/track">ChopTrack</Link>)}
          {user && (<Link to="/account">Account</Link>)}
          <div className="logout-wrapper">
          {user && (
            <p
              className="logoutButton"
              onClick={logoutHandler}
              style={{
                cursor: 'pointer',
              }}
            >
              Logout
          </p>)}
         </div>
        </div>
      </div>
      (<div className="rightSide">
        <Link to="/">Home</Link>
        <Link to="/search">ChopGuide</Link>
        {user && (<Link to="/track">ChopTrack</Link>)}
        {user && (<Link to="/account">Account</Link>)}
        {/* logout button display*/}
         {/* conditionally render Logout as text if user is logged in */}
         <div className="logout-wrapper">
          {user && (
            <p
              className="logoutButton"
              onClick={logoutHandler}
              style={{
                cursor: 'pointer',
              }}
            >
              Logout
          </p>)}
         </div>
        </div>)
        {/*navbar toggle -- i feel like it is not helpful
        <p id="navbarToggle" onClick={toggleNavbar}>
          ≡
        </p>
        */}
        
    </div>
  );
}

export default Navbar;
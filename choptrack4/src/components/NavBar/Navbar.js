import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import '../../styles/Navbar.css';

// Import logo
import logo from "../../assets/placeholder.png";

// Firebase auth
import { auth } from "../../firebase/firebaseConfig.js";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null); // Auth state tracking

  // Toggle the dropdown menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const currentUser = auth.currentUser;
    setUser(currentUser); // Set the current user in the state

    const intervalId = setInterval(() => {
      const user = auth.currentUser;
      setUser(user);
    }, 1000); // Check auth state every second

    return () => clearInterval(intervalId);
  }, []);

  // Logout handler
  const logoutHandler = () => {
    auth
      .signOut()
      .then(() => {
        console.log("User logged out successfully");
        setMenuOpen(false); // Close menu after logout
      })
      .catch((error) => {
        console.error("Error logging out: ", error);
      });
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        <img src={logo} alt="ChopChop Logo" width="75" />
      </div>

      {/* Hamburger menu button */}
      <button className="menu-toggle" onClick={toggleMenu}>
        {menuOpen ? "✖" : "☰"}
      </button>

      {/* Dropdown menu */}
      {menuOpen && (
        <div className="dropdown-menu">
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/search" onClick={() => setMenuOpen(false)}>ChopGuide</Link>
          {user && <Link to="/track" onClick={() => setMenuOpen(false)}>ChopTrack</Link>}
          {user && <Link to="/account" onClick={() => setMenuOpen(false)}>Account</Link>}
          {user && (
            <p
              className="logoutButton"
              onClick={logoutHandler}
              style={{
                cursor: "pointer",
              }}
            >
              Logout
            </p>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;

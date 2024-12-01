import React, { useState, useEffect } from "react";
import BannerImage from "../assets/cooking.jpg";
import "../styles/Home.css";

// import modals
import LoginModal from "../components/Authentication/LoginModal.js";
import SignupModal from "../components/Authentication/SignupModal.js";

// auth state imports
import {auth} from "../firebase/firebaseConfig.js";

function Home() {
    // auth state tracking
    const [user, setUser] = useState(null);

    useEffect(() => { 
        const currentUser = auth.currentUser;
        setUser(currentUser);

        const intervalId = setInterval(() => { //checks every now and then if we're still logged in
            const user = auth.currentUser;
            setUser(user);
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);
    useEffect(() => {
        // change the title dynamically
        document.title = 'Home';
      }, []); // runs only once after the component mounts
    

    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

    const closeLoginModal = () => setIsLoginModalOpen(false);
    const closeSignupModal = () => setIsSignupModalOpen(false);

    return (
        <div>
            {/* Hero Section */}
            <div className="home" style={{ backgroundImage: `url(${BannerImage})`, width: '100%' }}>
                <div className="headerContainer">
                    <h1>ChopChop</h1>
                    <p>Simplify your meal prep journey</p>
                    <div style={{ textAlign: "center" }}>
                        {!user && <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />}
                        {!user && <SignupModal isOpen={isSignupModalOpen} onClose={closeSignupModal} />}
                    </div>
                </div>
            </div>

            {/* About ChopChop Section */}
            <div id="about-section">
                <div className="container">
                    <div className="row text-center">
                        <h2 className="about-heading">About ChopChop</h2>
                        <p className="about-description">
                            ChopChop is your one-stop solution for meal planning, helping college students save time, money, and eat healthier. Our platform focuses on three key features that empower you to maintain a balanced lifestyle.
                        </p>
                    </div>
                    <div className="row features-row">
                        <div className="feature-box">
                            <span className="feature-icon">📊</span>
                            <h3 className="feature-title">ChopTrack</h3>
                            <p className="feature-description">
                                Monitor your nutrition and calories with personalized recipe recommendations tailored to your health goals.
                            </p>
                        </div>
                        <div className="feature-box">
                            <span className="feature-icon">🍳</span>
                            <h3 className="feature-title">ChopGuide</h3>
                            <p className="feature-description">
                                Find recipes based on ingredients you already have, saving you time and money.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;

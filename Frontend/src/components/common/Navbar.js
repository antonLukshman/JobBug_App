// src/components/common/Navbar.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ProfileDropdown from "./ProfileDropdown";
import "../../styles/components/navbar.css";
import JobBugLogo from "../../JobBug-logo.png"; // Ensure the path to the image is correct

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // const navigate = useNavigate();
  const { currentUser } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">
            <img src={JobBugLogo} alt="JobBug Logo" className="logo-image" />
          </div>
          <span className="logo-text">JobBug</span>
        </Link>

        <div className="navbar-links-container">
          <div className={`navbar-links ${isMenuOpen ? "active" : ""}`}>
            <Link to="/jobs" className="navbar-link">
              Find Jobs
            </Link>
            <Link to="/post-job" className="navbar-link">
              Post a Job
            </Link>
            <Link to="/track-application" className="navbar-link">
              Track Application
            </Link>

            {currentUser ? (
              <div className="navbar-auth">
                <ProfileDropdown />
              </div>
            ) : (
              <div className="navbar-auth">
                <Link to="/login" className="btn btn-outline">
                  Login
                </Link>
                <Link to="/signup" className="btn btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <button className="hamburger" onClick={toggleMenu}>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

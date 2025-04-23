import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/components/profileDropdown.css";
import defaultAvatar from "../../default-avatar.svg"; // Adjust the path as necessary

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { currentUser, logout } = useAuth();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="profile-dropdown" ref={dropdownRef}>
      <button className="profile-button" onClick={toggleDropdown}>
        {currentUser?.photoURL ? (
          <img
            src={currentUser.photoURL}
            alt="Profile"
            className="profile-image"
          />
        ) : (
          <img
            src={defaultAvatar}
            alt="Default Profile"
            className="profile-image"
          />
        )}
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-header">
            <div className="user-info">
              <div className="user-avatar">
                {currentUser?.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt="Profile"
                    className="profile-image-large"
                  />
                ) : (
                  <img
                    src={defaultAvatar}
                    alt="Default Profile"
                    className="profile-image-large"
                  />
                )}
              </div>
              <div className="user-details">
                <h3>{currentUser?.displayName || currentUser?.email}</h3>
                <p>{currentUser?.jobTitle || "Job Seeker"}</p>
              </div>
            </div>
            <Link
              to="/profile"
              className="view-profile-btn"
              onClick={() => setIsOpen(false)}
            >
              View Profile
            </Link>
          </div>

          <div className="dropdown-section">
            <h4>Account</h4>
            <ul>
              <li>
                <Link to="/settings" onClick={() => setIsOpen(false)}>
                  Settings & Privacy
                </Link>
              </li>
              <li>
                <Link to="/help" onClick={() => setIsOpen(false)}>
                  Help
                </Link>
              </li>
              <li>
                <Link to="/language" onClick={() => setIsOpen(false)}>
                  Language
                </Link>
              </li>
            </ul>
          </div>

          <div className="dropdown-section">
            <h4>Manage</h4>
            <ul>
              <li>
                <Link to="/posts" onClick={() => setIsOpen(false)}>
                  Posts & Activity
                </Link>
              </li>
              <li>
                <Link to="/job-posting" onClick={() => setIsOpen(false)}>
                  Job Posting Account
                </Link>
              </li>
              <li>
                <button className="sign-out-btn" onClick={handleLogout}>
                  Sign Out
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;

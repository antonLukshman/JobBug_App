import React from "react";
import { Link } from "react-router-dom";
import "../../styles/components/footer.css";
import JobBugLogo from "../../JobBug-logo.png"; // Import the logo image

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <div className="logo-icon">
                <img
                  src={JobBugLogo}
                  alt="JobBug Logo"
                  className="logo-image"
                />{" "}
                {/* Replace SVG with image */}
              </div>
              <span className="logo-text">JobBug</span>
            </Link>
            <p className="footer-description">
              The smarter way to find your next job. JobBug connects talented
              professionals with the best companies.
            </p>
            <div className="social-links">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.46 6C21.69 6.35 20.86 6.58 20 6.69C20.88 6.16 21.56 5.32 21.88 4.31C21.05 4.81 20.13 5.16 19.16 5.36C18.37 4.5 17.26 4 16 4C13.65 4 11.73 5.92 11.73 8.29C11.73 8.63 11.77 8.96 11.84 9.27C8.28 9.09 5.11 7.38 3 4.79C2.63 5.42 2.42 6.16 2.42 6.94C2.42 8.43 3.17 9.75 4.33 10.5C3.62 10.5 2.96 10.3 2.38 10V10.03C2.38 12.11 3.86 13.85 5.82 14.24C5.46 14.34 5.08 14.39 4.69 14.39C4.42 14.39 4.15 14.36 3.89 14.31C4.43 16 6 17.26 7.89 17.29C6.43 18.45 4.58 19.13 2.56 19.13C2.22 19.13 1.88 19.11 1.54 19.07C3.44 20.29 5.7 21 8.12 21C16 21 20.33 14.46 20.33 8.79C20.33 8.6 20.33 8.42 20.32 8.23C21.16 7.63 21.88 6.87 22.46 6Z"
                    fill="currentColor"
                  />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C18.34 21.21 22 17.06 22 12.06C22 6.53 17.5 2.04 12 2.04Z"
                    fill="currentColor"
                  />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM8.5 18.5H5.5V9.5H8.5V18.5ZM7 8C6.1 8 5.5 7.4 5.5 6.5C5.5 5.6 6.1 5 7 5C7.9 5 8.5 5.6 8.5 6.5C8.5 7.4 7.9 8 7 8ZM18.5 18.5H15.5V13.9C15.5 12.7 14.5 11.9 13.5 11.9C12.5 11.9 11.5 12.7 11.5 13.9V18.5H8.5V9.5H11.5V10.7C12.1 9.9 13.1 9.5 14.1 9.5C16.4 9.5 18.5 11.5 18.5 13.9V18.5Z"
                    fill="currentColor"
                  />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.8 2H16.2C19.4 2 22 4.6 22 7.8V16.2C22 19.4 19.4 22 16.2 22H7.8C4.6 22 2 19.4 2 16.2V7.8C2 4.6 4.6 2 7.8 2ZM16.2 20C18.3 20 20 18.3 20 16.2V7.8C20 5.7 18.3 4 16.2 4H7.8C5.7 4 4 5.7 4 7.8V16.2C4 18.3 5.7 20 7.8 20H16.2ZM12 7C9.2 7 7 9.2 7 12C7 14.8 9.2 17 12 17C14.8 17 17 14.8 17 12C17 9.2 14.8 7 12 7ZM12 15C10.3 15 9 13.7 9 12C9 10.3 10.3 9 12 9C13.7 9 15 10.3 15 12C15 13.7 13.7 15 12 15ZM17.5 6C16.9 6 16.5 6.4 16.5 7C16.5 7.6 16.9 8 17.5 8C18.1 8 18.5 7.6 18.5 7C18.5 6.4 18.1 6 17.5 6Z"
                    fill="currentColor"
                  />
                </svg>
              </a>
            </div>
          </div>

          <div className="footer-links">
            <div className="footer-link-group">
              <h3 className="footer-heading">For Job Seekers</h3>
              <ul className="footer-menu">
                <li>
                  <Link to="/jobs">Browse Jobs</Link>
                </li>
                <li>
                  <Link to="/companies">Browse Companies</Link>
                </li>
                <li>
                  <Link to="/salary-guide">Salary Guide</Link>
                </li>
                <li>
                  <Link to="/career-advice">Career Advice</Link>
                </li>
                <li>
                  <Link to="/track-application">Track Applications</Link>
                </li>
              </ul>
            </div>

            <div className="footer-link-group">
              <h3 className="footer-heading">For Employers</h3>
              <ul className="footer-menu">
                <li>
                  <Link to="/post-job">Post a Job</Link>
                </li>
                <li>
                  <Link to="/browse-resumes">Browse Resumes</Link>
                </li>
                <li>
                  <Link to="/pricing">Pricing</Link>
                </li>
                <li>
                  <Link to="/hiring-solutions">Hiring Solutions</Link>
                </li>
                <li>
                  <Link to="/employer-resources">Resources</Link>
                </li>
              </ul>
            </div>

            <div className="footer-link-group">
              <h3 className="footer-heading">JobBug</h3>
              <ul className="footer-menu">
                <li>
                  <Link to="/about">About Us</Link>
                </li>
                <li>
                  <Link to="/contact">Contact</Link>
                </li>
                <li>
                  <Link to="/blog">Blog</Link>
                </li>
                <li>
                  <Link to="/help">Help Center</Link>
                </li>
                <li>
                  <Link to="/privacy">Privacy Policy</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">
            © {new Date().getFullYear()} JobBug. All rights reserved.
          </p>
          <div className="footer-bottom-links">
            <Link to="/terms">Terms of Service</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/cookie-policy">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

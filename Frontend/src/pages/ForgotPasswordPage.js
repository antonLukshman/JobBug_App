import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { useAuth } from "../context/AuthContext";
import "../../src/styles/components/forgotPasswordPage.css";

const ForgotPasswordPage = () => {
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    try {
      setError("");
      setMessage("");
      setIsSubmitting(true);

      await resetPassword(email);
      setMessage("Check your email for further instructions");
    } catch (error) {
      setError("Failed to reset password. " + error.message);
    }

    setIsSubmitting(false);
  };

  return (
    <div className="forgot-password-page">
      <Navbar />

      <div className="forgot-container">
        <div className="forgot-form-container">
          <div className="forgot-header">
            <h1>Reset Your Password</h1>
            <p>
              Enter your email address and we'll send you a link to reset your
              password
            </p>
          </div>

          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}

          <form className="forgot-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <button
              type="submit"
              className="auth-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="button-spinner"></div>
                  Sending Email...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>

          <div className="forgot-footer">
            <p>
              <Link to="/login">Back to Login</Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ForgotPasswordPage;

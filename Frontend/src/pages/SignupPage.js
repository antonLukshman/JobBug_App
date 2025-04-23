import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { useAuth } from "../context/AuthContext";
import "../../src/styles/components/signupPage.css";

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup, loginWithGoogle, currentUser } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate required fields
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and privacy policy";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Create new user in Firebase
      const userCredential = await signup(formData.email, formData.password);

      // Here you would create a user profile in your database
      // Send basic user data to your Django API
      try {
        await fetch("/api/users/create-profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: userCredential.user.uid,
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
          }),
        });
      } catch (apiError) {
        console.error("Error creating user profile:", apiError);
        // Continue even if there's an error with the profile creation
        // as the Firebase user is already created
      }

      // Redirect to login with success message
      navigate("/login", {
        state: { message: "Account created successfully! Please log in." },
      });
    } catch (error) {
      setErrors({
        general:
          error.message || "An error occurred during signup. Please try again.",
      });
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const userCredential = await loginWithGoogle();

      // Check if this is a new user (userCredential.additionalUserInfo.isNewUser)
      // and create a profile if needed
      try {
        await fetch("/api/users/create-profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: userCredential.user.uid,
            email: userCredential.user.email,
            firstName: userCredential.user.displayName
              ? userCredential.user.displayName.split(" ")[0]
              : "",
            lastName: userCredential.user.displayName
              ? userCredential.user.displayName.split(" ").slice(1).join(" ")
              : "",
          }),
        });
      } catch (apiError) {
        console.error("Error creating user profile:", apiError);
      }

      // Redirect to home
      navigate("/");
    } catch (error) {
      setErrors({
        general:
          error.message || "Failed to sign up with Google. Please try again.",
      });
    }
  };

  return (
    <div className="signup-page">
      <Navbar />

      <div className="auth-container">
        <div className="auth-form-container">
          <div className="auth-header">
            <h1>Create Your Account</h1>
            <p>Join JobBug to find your dream job or post job listings</p>
          </div>

          {errors.general && (
            <div className="error-message general-error">{errors.general}</div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={errors.firstName ? "error" : ""}
                />
                {errors.firstName && (
                  <div className="error-message">{errors.firstName}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={errors.lastName ? "error" : ""}
                />
                {errors.lastName && (
                  <div className="error-message">{errors.lastName}</div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? "error" : ""}
              />
              {errors.email && (
                <div className="error-message">{errors.email}</div>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={errors.password ? "error" : ""}
                />
                {errors.password && (
                  <div className="error-message">{errors.password}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={errors.confirmPassword ? "error" : ""}
                />
                {errors.confirmPassword && (
                  <div className="error-message">{errors.confirmPassword}</div>
                )}
              </div>
            </div>

            <div className="form-group checkbox-group">
              <div className="checkbox-container">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className={errors.agreeToTerms ? "error" : ""}
                />
                <label htmlFor="agreeToTerms">
                  I agree to the{" "}
                  <a href="/terms" target="_blank">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" target="_blank">
                    Privacy Policy
                  </a>
                </label>
              </div>
              {errors.agreeToTerms && (
                <div className="error-message">{errors.agreeToTerms}</div>
              )}
            </div>

            <button
              type="submit"
              className="auth-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="button-spinner"></div>
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>OR</span>
          </div>

          <div className="social-login">
            <button
              className="social-button google-button"
              onClick={handleGoogleSignup}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.033s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.79-1.677-4.184-2.702-6.735-2.702-5.514 0-10 4.486-10 10s4.486 10 10 10c8.311 0 10-7.721 10-11.143 0-0.727-0.068-1.424-0.189-2.069h-9.811z"
                  fill="#FFF"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          <div className="auth-footer">
            <p>
              Already have an account? <Link to="/login">Log In</Link>
            </p>
          </div>
        </div>

        <div className="auth-image">
          <img src="/assets/images/signup.svg" alt="Sign up illustration" />
          <div className="auth-image-overlay">
            <h2>Join JobBug Today</h2>
            <p>
              Create an account to unlock all features of JobBug - the smarter
              way to find jobs and manage your career.
            </p>
            <div className="auth-features">
              <div className="auth-feature">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"
                    fill="currentColor"
                  />
                </svg>
                <span>Access thousands of job listings</span>
              </div>
              <div className="auth-feature">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"
                    fill="currentColor"
                  />
                </svg>
                <span>Post jobs and find talented professionals</span>
              </div>
              <div className="auth-feature">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"
                    fill="currentColor"
                  />
                </svg>
                <span>Track all your applications in one place</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SignupPage;

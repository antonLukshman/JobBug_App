import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import "../styles/components/applicationPage.css";

// Mock job data - would come from API in a real application
const mockJob = {
  id: 1,
  title: "Senior Frontend Developer",
  company: "TechCorp",
  location: "San Francisco, CA",
  isRemote: true,
  logo: null,
  applicationUrl: "https://forms.google.com/techcorp-application",
};

const ApplicationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    resume: null,
    coverLetter: "",
    linkedIn: "",
    portfolio: "",
    heardAbout: "",
    referredBy: "",
    agreeToTerms: false,
  });

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Simulate API call to fetch job details
  useEffect(() => {
    const fetchJob = async () => {
      try {
        setIsLoading(true);
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // For the demo, we'll just use the mock data
        setJob(mockJob);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load job details. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    // Handle different input types
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleNextStep = () => {
    setStep((prev) => prev + 1);
    window.scrollTo(0, 0);
  };

  const handlePrevStep = () => {
    setStep((prev) => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate a tracking ID (would be returned by the server in a real app)
      const trackingId = Math.random()
        .toString(36)
        .substring(2, 10)
        .toUpperCase();

      setSuccessMessage(
        `Your application has been submitted successfully! Your tracking ID is ${trackingId}`
      );
      setIsSubmitting(false);

      // In a real app, redirect to a success page or the tracking page
      setTimeout(() => {
        navigate(`/track-application?id=${trackingId}`);
      }, 3000);
    } catch (error) {
      setError("Failed to submit your application. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="application-page">
        <Navbar />
        <div className="container">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading job details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="application-page">
        <Navbar />
        <div className="container">
          <div className="error-container">
            <p>{error || "Job not found"}</p>
            <Link to="/jobs" className="btn btn-primary">
              Browse All Jobs
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="application-page">
      <Navbar />

      <div className="container">
        <div className="application-header">
          <div className="breadcrumbs">
            <Link to="/">Home</Link> &gt; <Link to="/jobs">Jobs</Link> &gt;{" "}
            <Link to={`/jobs/${id}`}>{job.title}</Link> &gt; <span>Apply</span>
          </div>

          <div className="job-summary">
            <div className="company-logo">
              {job.logo ? (
                <img src={job.logo} alt={`${job.company} logo`} />
              ) : (
                <div className="default-logo">{job.company.charAt(0)}</div>
              )}
            </div>

            <div className="job-summary-details">
              <h1 className="job-title">{job.title}</h1>
              <p className="company-name">{job.company}</p>
              <div className="job-location">
                <svg
                  className="location-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z"
                    fill="currentColor"
                  />
                </svg>
                {job.location}
                {job.isRemote && (
                  <span className="badge badge-accent">Remote</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {successMessage ? (
          <div className="success-container">
            <div className="success-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h2>Application Submitted!</h2>
            <p>{successMessage}</p>
            <p className="redirect-message">
              Redirecting to the tracking page...
            </p>
          </div>
        ) : (
          <div className="application-content">
            <div className="application-progress">
              <div
                className={`progress-step ${step >= 1 ? "active" : ""} ${
                  step > 1 ? "completed" : ""
                }`}
              >
                <div className="step-number">1</div>
                <div className="step-label">Basic Info</div>
              </div>
              <div className="progress-connector"></div>
              <div
                className={`progress-step ${step >= 2 ? "active" : ""} ${
                  step > 2 ? "completed" : ""
                }`}
              >
                <div className="step-number">2</div>
                <div className="step-label">Resume & Cover Letter</div>
              </div>
              <div className="progress-connector"></div>
              <div
                className={`progress-step ${step >= 3 ? "active" : ""} ${
                  step > 3 ? "completed" : ""
                }`}
              >
                <div className="step-number">3</div>
                <div className="step-label">Additional Info</div>
              </div>
              <div className="progress-connector"></div>
              <div className={`progress-step ${step >= 4 ? "active" : ""}`}>
                <div className="step-number">4</div>
                <div className="step-label">Review & Submit</div>
              </div>
            </div>

            <form className="application-form" onSubmit={handleSubmit}>
              {/* Step 1: Basic Information */}
              {step === 1 && (
                <div className="form-step">
                  <h2 className="form-step-title">Basic Information</h2>

                  <div className="form-group">
                    <label htmlFor="fullName">
                      Full Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">
                      Email Address <span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">
                      Phone Number <span className="required">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="form-control"
                    />
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleNextStep}
                    >
                      Next Step
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Resume & Cover Letter */}
              {step === 2 && (
                <div className="form-step">
                  <h2 className="form-step-title">Resume & Cover Letter</h2>

                  <div className="form-group">
                    <label htmlFor="resume">
                      Upload Resume <span className="required">*</span>
                    </label>
                    <div className="file-upload">
                      <input
                        type="file"
                        id="resume"
                        name="resume"
                        onChange={handleInputChange}
                        accept=".pdf,.doc,.docx"
                        required={!formData.resume}
                        className="file-input"
                      />
                      <div className="file-upload-label">
                        <svg
                          className="upload-icon"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z"
                            fill="currentColor"
                          />
                        </svg>
                        {formData.resume
                          ? formData.resume.name
                          : "Choose file (PDF, DOC, DOCX)"}
                      </div>
                    </div>
                    <p className="form-hint">Max file size: 5MB</p>
                  </div>

                  <div className="form-group">
                    <label htmlFor="coverLetter">Cover Letter</label>
                    <textarea
                      id="coverLetter"
                      name="coverLetter"
                      value={formData.coverLetter}
                      onChange={handleInputChange}
                      className="form-control"
                      rows="6"
                      placeholder="Tell us why you're interested in this position and why you're a good fit"
                    ></textarea>
                    <p className="form-hint">Optional but recommended</p>
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={handlePrevStep}
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleNextStep}
                    >
                      Next Step
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Additional Information */}
              {step === 3 && (
                <div className="form-step">
                  <h2 className="form-step-title">Additional Information</h2>

                  <div className="form-group">
                    <label htmlFor="linkedIn">LinkedIn Profile</label>
                    <input
                      type="url"
                      id="linkedIn"
                      name="linkedIn"
                      value={formData.linkedIn}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="https://linkedin.com/in/your-profile"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="portfolio">Portfolio/Website</label>
                    <input
                      type="url"
                      id="portfolio"
                      name="portfolio"
                      value={formData.portfolio}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="https://your-website.com"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="heardAbout">
                      How did you hear about this job?
                    </label>
                    <select
                      id="heardAbout"
                      name="heardAbout"
                      value={formData.heardAbout}
                      onChange={handleInputChange}
                      className="form-control"
                    >
                      <option value="">Select an option</option>
                      <option value="jobBug">JobBug</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="indeed">Indeed</option>
                      <option value="glassdoor">Glassdoor</option>
                      <option value="referral">Referral</option>
                      <option value="company_website">Company Website</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {formData.heardAbout === "referral" && (
                    <div className="form-group">
                      <label htmlFor="referredBy">Referred By</label>
                      <input
                        type="text"
                        id="referredBy"
                        name="referredBy"
                        value={formData.referredBy}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="Name of person who referred you"
                      />
                    </div>
                  )}

                  <div className="form-actions">
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={handlePrevStep}
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleNextStep}
                    >
                      Review Application
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Review & Submit */}
              {step === 4 && (
                <div className="form-step">
                  <h2 className="form-step-title">Review Your Application</h2>

                  <div className="review-section">
                    <h3 className="review-section-title">Basic Information</h3>
                    <div className="review-item">
                      <span className="review-label">Full Name:</span>
                      <span className="review-value">{formData.fullName}</span>
                    </div>
                    <div className="review-item">
                      <span className="review-label">Email:</span>
                      <span className="review-value">{formData.email}</span>
                    </div>
                    <div className="review-item">
                      <span className="review-label">Phone:</span>
                      <span className="review-value">{formData.phone}</span>
                    </div>
                  </div>

                  <div className="review-section">
                    <h3 className="review-section-title">
                      Resume & Cover Letter
                    </h3>
                    <div className="review-item">
                      <span className="review-label">Resume:</span>
                      <span className="review-value">
                        {formData.resume
                          ? formData.resume.name
                          : "Not uploaded"}
                      </span>
                    </div>
                    <div className="review-item">
                      <span className="review-label">Cover Letter:</span>
                      <span className="review-value">
                        {formData.coverLetter ? "Provided" : "Not provided"}
                      </span>
                    </div>
                  </div>

                  <div className="review-section">
                    <h3 className="review-section-title">
                      Additional Information
                    </h3>
                    <div className="review-item">
                      <span className="review-label">LinkedIn:</span>
                      <span className="review-value">
                        {formData.linkedIn || "Not provided"}
                      </span>
                    </div>
                    <div className="review-item">
                      <span className="review-label">Portfolio:</span>
                      <span className="review-value">
                        {formData.portfolio || "Not provided"}
                      </span>
                    </div>
                    <div className="review-item">
                      <span className="review-label">
                        How did you hear about us:
                      </span>
                      <span className="review-value">
                        {formData.heardAbout
                          ? formData.heardAbout === "referral"
                            ? `Referral (${
                                formData.referredBy || "Not specified"
                              })`
                            : formData.heardAbout.charAt(0).toUpperCase() +
                              formData.heardAbout.slice(1).replace("_", " ")
                          : "Not provided"}
                      </span>
                    </div>
                  </div>

                  <div className="form-group checkbox-group">
                    <input
                      type="checkbox"
                      id="agreeToTerms"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      required
                      className="checkbox-input"
                    />
                    <label htmlFor="agreeToTerms" className="checkbox-label">
                      I certify that all the information provided is accurate
                      and complete. I understand that any false information may
                      result in the rejection of my application or termination
                      of employment. <span className="required">*</span>
                    </label>
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={handlePrevStep}
                    >
                      Previous
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isSubmitting || !formData.agreeToTerms}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="button-spinner"></div>
                          Submitting...
                        </>
                      ) : (
                        "Submit Application"
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ApplicationPage;

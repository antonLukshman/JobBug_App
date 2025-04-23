import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import "../styles/components/postJobPage.css";

const PostJobPage = () => {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    jobType: "full-time",
    description: "",
    requirements: "",
    benefits: "",
    isRemote: false,
    isUrgent: false,
    contactEmail: "",
    applicationUrl: "",
    applicationDeadline: "",
    companyWebsite: "",
    companyDescription: "",
  });

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
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
    setError(null);

    try {
      // Simulate API call to post job
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate a job ID (would be returned by the server in a real app)
      const jobId = Math.floor(Math.random() * 1000) + 1;

      setSuccessMessage(`Job posted successfully! Job ID: ${jobId}`);
      setIsSubmitting(false);

      // In a real app, redirect to the job detail page
      setTimeout(() => {
        navigate(`/jobs/${jobId}`);
      }, 3000);
    } catch (err) {
      setError("Failed to post job. Please try again later.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="post-job-page">
      <Navbar />

      <div className="container">
        <div className="post-job-header">
          <h1 className="post-job-title">Post a New Job</h1>
          <p className="post-job-subtitle">
            Find the best candidates by posting your job on JobBug
          </p>
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
            <h2>Job Posted Successfully!</h2>
            <p>{successMessage}</p>
            <p className="redirect-message">
              Redirecting to the job details page...
            </p>
          </div>
        ) : (
          <div className="post-job-content">
            <div className="post-job-progress">
              <div
                className={`progress-step ${step >= 1 ? "active" : ""} ${
                  step > 1 ? "completed" : ""
                }`}
              >
                <div className="step-number">1</div>
                <div className="step-label">Job Details</div>
              </div>
              <div className="progress-connector"></div>
              <div
                className={`progress-step ${step >= 2 ? "active" : ""} ${
                  step > 2 ? "completed" : ""
                }`}
              >
                <div className="step-number">2</div>
                <div className="step-label">Description & Requirements</div>
              </div>
              <div className="progress-connector"></div>
              <div className={`progress-step ${step >= 3 ? "active" : ""}`}>
                <div className="step-number">3</div>
                <div className="step-label">Company & Contact</div>
              </div>
            </div>

            {error && (
              <div className="error-message">
                <p>{error}</p>
              </div>
            )}

            <form className="post-job-form" onSubmit={handleSubmit}>
              {/* Step 1: Job Details */}
              {step === 1 && (
                <div className="form-step">
                  <h2 className="form-step-title">Job Details</h2>

                  <div className="form-group">
                    <label htmlFor="title">
                      Job Title <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="form-control"
                      placeholder="e.g. Senior Frontend Developer"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="company">
                      Company Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      required
                      className="form-control"
                      placeholder="e.g. TechCorp"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="location">
                        Location <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        required
                        className="form-control"
                        placeholder="e.g. San Francisco, CA"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="salary">Salary Range</label>
                      <input
                        type="text"
                        id="salary"
                        name="salary"
                        value={formData.salary}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="e.g. $100K - $130K"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="jobType">
                      Job Type <span className="required">*</span>
                    </label>
                    <select
                      id="jobType"
                      name="jobType"
                      value={formData.jobType}
                      onChange={handleInputChange}
                      required
                      className="form-control"
                    >
                      <option value="full-time">Full-time</option>
                      <option value="part-time">Part-time</option>
                      <option value="contract">Contract</option>
                      <option value="internship">Internship</option>
                      <option value="temporary">Temporary</option>
                    </select>
                  </div>

                  <div className="form-row checkbox-row">
                    <div className="form-group checkbox-group">
                      <input
                        type="checkbox"
                        id="isRemote"
                        name="isRemote"
                        checked={formData.isRemote}
                        onChange={handleInputChange}
                        className="checkbox-input"
                      />
                      <label htmlFor="isRemote" className="checkbox-label">
                        Remote Job
                      </label>
                    </div>

                    <div className="form-group checkbox-group">
                      <input
                        type="checkbox"
                        id="isUrgent"
                        name="isUrgent"
                        checked={formData.isUrgent}
                        onChange={handleInputChange}
                        className="checkbox-input"
                      />
                      <label htmlFor="isUrgent" className="checkbox-label">
                        Urgent Hiring
                      </label>
                    </div>
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

              {/* Step 2: Description & Requirements */}
              {step === 2 && (
                <div className="form-step">
                  <h2 className="form-step-title">
                    Description & Requirements
                  </h2>

                  <div className="form-group">
                    <label htmlFor="description">
                      Job Description <span className="required">*</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      className="form-control"
                      rows="6"
                      placeholder="Describe the job responsibilities, role, and expectations"
                    ></textarea>
                    <p className="form-hint">
                      HTML formatting is supported for better readability
                    </p>
                  </div>

                  <div className="form-group">
                    <label htmlFor="requirements">
                      Requirements <span className="required">*</span>
                    </label>
                    <textarea
                      id="requirements"
                      name="requirements"
                      value={formData.requirements}
                      onChange={handleInputChange}
                      required
                      className="form-control"
                      rows="6"
                      placeholder="List required skills, experience, education, and qualifications"
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label htmlFor="benefits">Benefits</label>
                    <textarea
                      id="benefits"
                      name="benefits"
                      value={formData.benefits}
                      onChange={handleInputChange}
                      className="form-control"
                      rows="4"
                      placeholder="List benefits, perks, and incentives offered to employees"
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label htmlFor="applicationDeadline">
                      Application Deadline
                    </label>
                    <input
                      type="date"
                      id="applicationDeadline"
                      name="applicationDeadline"
                      value={formData.applicationDeadline}
                      onChange={handleInputChange}
                      className="form-control"
                    />
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

              {/* Step 3: Company & Contact */}
              {step === 3 && (
                <div className="form-step">
                  <h2 className="form-step-title">
                    Company & Contact Information
                  </h2>

                  <div className="form-group">
                    <label htmlFor="companyDescription">
                      Company Description
                    </label>
                    <textarea
                      id="companyDescription"
                      name="companyDescription"
                      value={formData.companyDescription}
                      onChange={handleInputChange}
                      className="form-control"
                      rows="4"
                      placeholder="Brief description of your company and its culture"
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label htmlFor="companyWebsite">Company Website</label>
                    <input
                      type="url"
                      id="companyWebsite"
                      name="companyWebsite"
                      value={formData.companyWebsite}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="e.g. https://company.com"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="contactEmail">
                      Contact Email <span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      id="contactEmail"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleInputChange}
                      required
                      className="form-control"
                      placeholder="e.g. hr@company.com"
                    />
                    <p className="form-hint">
                      This email will receive applications and inquiries about
                      the job
                    </p>
                  </div>

                  <div className="form-group">
                    <label htmlFor="applicationUrl">Application URL</label>
                    <input
                      type="url"
                      id="applicationUrl"
                      name="applicationUrl"
                      value={formData.applicationUrl}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="e.g. https://company.com/careers/apply"
                    />
                    <p className="form-hint">
                      If you want candidates to apply through your website
                      instead of JobBug
                    </p>
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
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="button-spinner"></div>
                          Posting Job...
                        </>
                      ) : (
                        "Post Job"
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

export default PostJobPage;

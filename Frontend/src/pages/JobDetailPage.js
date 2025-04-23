import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import "../styles/components/jobDetailPage.css";

// Mock job data - in a real app this would come from an API
const mockJob = {
  id: 1,
  title: "Senior Frontend Developer",
  company: "TechCorp",
  location: "San Francisco, CA",
  salary: "$120K - $150K",
  jobType: "Full-time",
  postDate: "2025-04-15",
  description: `
    <p>TechCorp is looking for a Senior Frontend Developer to join our growing team. You'll be responsible for building and maintaining user interfaces for our web applications, ensuring they are responsive, accessible, and provide an excellent user experience.</p>
    
    <p>As a Senior Frontend Developer, you will work closely with designers, product managers, and backend developers to implement new features and improve existing ones. You should have a strong understanding of modern frontend technologies and best practices.</p>
    
    <h4>Responsibilities:</h4>
    <ul>
      <li>Develop and maintain responsive web applications using React, TypeScript, and modern CSS</li>
      <li>Write clean, maintainable, and well-documented code</li>
      <li>Collaborate with designers to implement user interfaces that match design specifications</li>
      <li>Optimize application performance and ensure cross-browser compatibility</li>
      <li>Participate in code reviews and contribute to team discussions</li>
      <li>Mentor junior developers and share knowledge with the team</li>
      <li>Stay up-to-date with the latest frontend technologies and best practices</li>
    </ul>
  `,
  qualifications: `
    <h4>Required Qualifications:</h4>
    <ul>
      <li>5+ years of experience in frontend development</li>
      <li>Strong proficiency in JavaScript, including ES6+ features</li>
      <li>Experience with React and its ecosystem (Redux, React Router, etc.)</li>
      <li>Proficiency in HTML5, CSS3, and modern CSS frameworks</li>
      <li>Experience with responsive design and cross-browser compatibility</li>
      <li>Familiarity with version control systems (Git)</li>
      <li>Strong problem-solving skills and attention to detail</li>
      <li>Excellent communication and collaboration skills</li>
    </ul>
    
    <h4>Preferred Qualifications:</h4>
    <ul>
      <li>Experience with TypeScript</li>
      <li>Familiarity with testing frameworks (Jest, React Testing Library)</li>
      <li>Experience with build tools and module bundlers (Webpack, Vite)</li>
      <li>Knowledge of CI/CD pipelines</li>
      <li>Experience with server-side rendering or static site generation</li>
      <li>Contributions to open-source projects</li>
    </ul>
  `,
  benefits: `
    <h4>Benefits:</h4>
    <ul>
      <li>Competitive salary and equity package</li>
      <li>Comprehensive health, dental, and vision insurance</li>
      <li>401(k) with company match</li>
      <li>Flexible work hours and remote work options</li>
      <li>Unlimited PTO policy</li>
      <li>Professional development budget</li>
      <li>Home office stipend</li>
      <li>Team events and activities</li>
    </ul>
  `,
  logo: null,
  companyDescription:
    "TechCorp is a leading technology company specializing in innovative software solutions for businesses. We are dedicated to creating cutting-edge products that solve real-world problems.",
  companyWebsite: "https://techcorp.example.com",
  applicationUrl: "https://forms.google.com/techcorp-application",
  views: 245,
  applicants: 18,
  isRemote: true,
  isUrgent: true,
};

const JobDetailPage = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simulate API call to fetch job details
  useEffect(() => {
    // In a real app, you would fetch the job data from an API
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

  if (isLoading) {
    return (
      <div className="job-detail-page">
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
      <div className="job-detail-page">
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

  // Calculate days ago
  const getDaysAgo = () => {
    const postedDate = new Date(job.postDate);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate - postedDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else {
      return `${diffDays} days ago`;
    }
  };

  return (
    <div className="job-detail-page">
      <Navbar />

      <div className="container">
        <div className="job-detail-header">
          <div className="breadcrumbs">
            <Link to="/">Home</Link> &gt; <Link to="/jobs">Jobs</Link> &gt;{" "}
            <span>{job.title}</span>
          </div>

          <div className="job-header-content">
            <div className="company-logo">
              {job.logo ? (
                <img src={job.logo} alt={`${job.company} logo`} />
              ) : (
                <div className="default-logo">{job.company.charAt(0)}</div>
              )}
            </div>

            <div className="job-title-section">
              <h1 className="job-title">{job.title}</h1>

              <div className="company-details">
                <span className="company-name">{job.company}</span>
                <span className="location-badge">
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
                </span>
                {job.isRemote && (
                  <span className="badge badge-accent">Remote</span>
                )}
                {job.isUrgent && (
                  <span className="badge badge-primary">Urgent</span>
                )}
              </div>

              <div className="job-meta">
                <div className="meta-item">
                  <span className="meta-label">Salary:</span>
                  <span className="meta-value">{job.salary}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Job Type:</span>
                  <span className="meta-value">{job.jobType}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Posted:</span>
                  <span className="meta-value">{getDaysAgo()}</span>
                </div>
              </div>
            </div>

            <div className="job-stats-container">
              <div className="job-stat">
                <svg
                  className="stat-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z"
                    fill="currentColor"
                  />
                </svg>
                <span className="stat-value">{job.views}</span>
                <span className="stat-label">Views</span>
              </div>

              <div className="job-stat">
                <svg
                  className="stat-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z"
                    fill="currentColor"
                  />
                </svg>
                <span className="stat-value">{job.applicants}</span>
                <span className="stat-label">Applicants</span>
              </div>
            </div>
          </div>

          <div className="apply-button-container">
            <Link
              to={`/jobs/${job.id}/apply`}
              className="btn btn-primary btn-lg"
            >
              Apply Now
            </Link>
            <button className="btn btn-outline btn-lg">Save Job</button>
          </div>
        </div>

        <div className="job-detail-content">
          <div className="job-detail-main">
            <div className="job-section">
              <h2 className="section-title">Job Description</h2>
              <div
                className="section-content"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
            </div>

            <div className="job-section">
              <h2 className="section-title">Qualifications</h2>
              <div
                className="section-content"
                dangerouslySetInnerHTML={{ __html: job.qualifications }}
              />
            </div>

            <div className="job-section">
              <h2 className="section-title">Benefits</h2>
              <div
                className="section-content"
                dangerouslySetInnerHTML={{ __html: job.benefits }}
              />
            </div>

            <div className="apply-bottom">
              <h3>Interested in this job?</h3>
              <Link
                to={`/jobs/${job.id}/apply`}
                className="btn btn-primary btn-lg"
              >
                Apply Now
              </Link>
            </div>
          </div>

          <div className="job-detail-sidebar">
            <div className="company-card">
              <h3>About {job.company}</h3>
              <p>{job.companyDescription}</p>
              <a
                href={job.companyWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="company-website"
              >
                <svg
                  className="website-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM18.92 8H15.97C15.65 6.75 15.19 5.55 14.59 4.44C16.43 5.07 17.96 6.35 18.92 8ZM12 4.04C12.83 5.24 13.48 6.57 13.91 8H10.09C10.52 6.57 11.17 5.24 12 4.04ZM4.26 14C4.1 13.36 4 12.69 4 12C4 11.31 4.1 10.64 4.26 10H7.64C7.56 10.66 7.5 11.32 7.5 12C7.5 12.68 7.56 13.34 7.64 14H4.26ZM5.08 16H8.03C8.35 17.25 8.81 18.45 9.41 19.56C7.57 18.93 6.04 17.66 5.08 16ZM8.03 8H5.08C6.04 6.34 7.57 5.07 9.41 4.44C8.81 5.55 8.35 6.75 8.03 8ZM12 19.96C11.17 18.76 10.52 17.43 10.09 16H13.91C13.48 17.43 12.83 18.76 12 19.96ZM14.34 14H9.66C9.57 13.34 9.5 12.68 9.5 12C9.5 11.32 9.57 10.65 9.66 10H14.34C14.43 10.65 14.5 11.32 14.5 12C14.5 12.68 14.43 13.34 14.34 14ZM14.59 19.56C15.19 18.45 15.65 17.25 15.97 16H18.92C17.96 17.65 16.43 18.93 14.59 19.56ZM16.36 14C16.44 13.34 16.5 12.68 16.5 12C16.5 11.32 16.44 10.66 16.36 10H19.74C19.9 10.64 20 11.31 20 12C20 12.69 19.9 13.36 19.74 14H16.36Z"
                    fill="currentColor"
                  />
                </svg>
                Visit Website
              </a>
            </div>

            <div className="share-card">
              <h3>Share This Job</h3>
              <div className="share-buttons">
                <button className="share-button share-twitter">
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
                  Twitter
                </button>
                <button className="share-button share-facebook">
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
                  Facebook
                </button>
                <button className="share-button share-linkedin">
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
                  LinkedIn
                </button>
                <button className="share-button share-email">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"
                      fill="currentColor"
                    />
                  </svg>
                  Email
                </button>
              </div>
            </div>

            <div className="similar-jobs-card">
              <h3>Similar Jobs</h3>
              <div className="similar-jobs-list">
                <Link to="/jobs/2" className="similar-job-item">
                  <h4>Frontend Developer</h4>
                  <p>WebDev Inc.</p>
                  <span className="similar-job-location">New York, NY</span>
                </Link>
                <Link to="/jobs/3" className="similar-job-item">
                  <h4>React Developer</h4>
                  <p>AppTech Solutions</p>
                  <span className="similar-job-location">Remote</span>
                </Link>
                <Link to="/jobs/4" className="similar-job-item">
                  <h4>Senior UI Developer</h4>
                  <p>DesignHub</p>
                  <span className="similar-job-location">Boston, MA</span>
                </Link>
              </div>
              <Link to="/jobs" className="view-all-link">
                View All Similar Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default JobDetailPage;

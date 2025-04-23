import React from "react";
import { Link } from "react-router-dom";
import "../../styles/components/jobCard.css";

const JobCard = ({ job }) => {
  // Destructure job properties
  const {
    id,
    title,
    company,
    location,
    salary,
    jobType,
    postDate,
    description,
    logo,
    views,
    applicants,
    isRemote,
    isUrgent,
  } = job;

  // Calculate days ago
  const daysAgo = () => {
    const postedDate = new Date(postDate);
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
    <div className="job-card">
      <div className="job-card-header">
        <div className="company-logo">
          {logo ? (
            <img src={logo} alt={`${company} logo`} />
          ) : (
            <div className="default-logo">{company.charAt(0)}</div>
          )}
        </div>

        <div className="job-info">
          <h3 className="job-title">{title}</h3>
          <p className="company-name">{company}</p>
          <p className="job-location">
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
            {location}
            {isRemote && <span className="badge badge-accent">Remote</span>}
          </p>
        </div>

        {isUrgent && (
          <div className="urgent-badge">
            <span className="badge badge-primary">Urgent</span>
          </div>
        )}
      </div>

      <div className="job-card-body">
        <div className="job-description">
          <p>
            {description.length > 150
              ? `${description.substring(0, 150)}...`
              : description}
          </p>
        </div>

        <div className="job-details">
          <div className="job-detail">
            <span className="job-detail-label">Salary:</span>
            <span className="job-detail-value">{salary}</span>
          </div>
          <div className="job-detail">
            <span className="job-detail-label">Job Type:</span>
            <span className="job-detail-value">{jobType}</span>
          </div>
          <div className="job-detail">
            <span className="job-detail-label">Posted:</span>
            <span className="job-detail-value">{daysAgo()}</span>
          </div>
        </div>
      </div>

      <div className="job-card-footer">
        <div className="job-stats">
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
            <span>{views} Views</span>
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
            <span>{applicants} Applicants</span>
          </div>
        </div>

        <Link to={`/jobs/${id}`} className="btn btn-primary">
          Apply Now
        </Link>
      </div>
    </div>
  );
};

export default JobCard;

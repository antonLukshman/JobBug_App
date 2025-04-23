import React from "react";
import JobCard from "./JobCard";
import "../../styles/components/jobList.css";
const JobList = ({ jobs, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="job-list-loading">
        <div className="spinner"></div>
        <p>Loading jobs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="job-list-error">
        <p>Error loading jobs: {error}</p>
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div className="job-list-empty">
        <svg
          className="empty-icon"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19.5 3.5L18 2L16.5 3.5L15 2L13.5 3.5L12 2L10.5 3.5L9 2L7.5 3.5L6 2L4.5 3.5L3 2V22L4.5 20.5L6 22L7.5 20.5L9 22L10.5 20.5L12 22L13.5 20.5L15 22L16.5 20.5L18 22L19.5 20.5L21 22V2L19.5 3.5ZM19 19.09H5V4.91H19V19.09ZM7 15H17V17H7V15ZM7 11H17V13H7V11ZM7 7H17V9H7V7Z"
            fill="currentColor"
          />
        </svg>
        <h3>No jobs found</h3>
        <p>
          Try adjusting your search criteria or check back later for new
          opportunities.
        </p>
      </div>
    );
  }

  return (
    <div className="job-list">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
};

export default JobList;

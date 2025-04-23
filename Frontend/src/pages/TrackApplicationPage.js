import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import "../styles/components/trackApplicationPag.css";

// Mock application data - would come from API in a real application
const mockApplications = [
  {
    id: "ABC12345",
    jobTitle: "Senior Frontend Developer",
    company: "TechCorp",
    appliedDate: "2025-04-18",
    status: "applied",
    statusHistory: [
      {
        status: "applied",
        date: "2025-04-18",
        note: "Application submitted successfully",
      },
    ],
  },
  {
    id: "DEF67890",
    jobTitle: "UX/UI Designer",
    company: "DesignHub",
    appliedDate: "2025-04-15",
    status: "reviewed",
    statusHistory: [
      {
        status: "applied",
        date: "2025-04-15",
        note: "Application submitted successfully",
      },
      {
        status: "reviewed",
        date: "2025-04-17",
        note: "Your application has been reviewed by the hiring team",
      },
    ],
  },
  {
    id: "GHI24680",
    jobTitle: "Product Manager",
    company: "ProductCo",
    appliedDate: "2025-04-10",
    status: "interview",
    statusHistory: [
      {
        status: "applied",
        date: "2025-04-10",
        note: "Application submitted successfully",
      },
      {
        status: "reviewed",
        date: "2025-04-12",
        note: "Your application has been reviewed by the hiring team",
      },
      {
        status: "interview",
        date: "2025-04-16",
        note: "You have been selected for an interview. Our recruiter will contact you shortly.",
      },
    ],
  },
  {
    id: "JKL13579",
    jobTitle: "Backend Developer",
    company: "ServerTech",
    appliedDate: "2025-04-05",
    status: "rejected",
    statusHistory: [
      {
        status: "applied",
        date: "2025-04-05",
        note: "Application submitted successfully",
      },
      {
        status: "reviewed",
        date: "2025-04-07",
        note: "Your application has been reviewed by the hiring team",
      },
      {
        status: "rejected",
        date: "2025-04-12",
        note: "Thank you for your interest. We have decided to move forward with other candidates at this time.",
      },
    ],
  },
];

const TrackApplicationPage = () => {
  const [searchParams] = useSearchParams();
  const trackingId = searchParams.get("id");

  const [applications, setApplications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeApplication, setActiveApplication] = useState(null);

  // Simulate API call to fetch applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setIsLoading(true);
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // For the demo, we'll just use the mock data
        setApplications(mockApplications);

        // If tracking ID is provided in URL, select that application
        if (trackingId) {
          const application = mockApplications.find(
            (app) => app.id === trackingId
          );
          if (application) {
            setActiveApplication(application);
          }
        }

        setIsLoading(false);
      } catch (err) {
        setError("Failed to load application data. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [trackingId]);

  // Filter applications based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredApplications(applications);
    } else {
      const filtered = applications.filter(
        (application) =>
          application.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          application.jobTitle
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          application.company.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredApplications(filtered);
    }
  }, [applications, searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is already handled by the useEffect
  };

  const handleApplicationClick = (application) => {
    setActiveApplication(application);
  };

  // Format date function
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status label and color
  const getStatusDetails = (status) => {
    switch (status) {
      case "applied":
        return { label: "Applied", color: "info", icon: "check" };
      case "reviewed":
        return { label: "Reviewed", color: "accent", icon: "eye" };
      case "interview":
        return { label: "Interview", color: "primary", icon: "calendar" };
      case "offer":
        return { label: "Offer", color: "success", icon: "star" };
      case "rejected":
        return { label: "Not Selected", color: "danger", icon: "x" };
      default:
        return { label: "Unknown", color: "medium", icon: "question" };
    }
  };

  // Render status icon
  const renderStatusIcon = (status) => {
    switch (status) {
      case "check":
        return (
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
        );
      case "eye":
        return (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z"
              fill="currentColor"
            />
          </svg>
        );
      case "calendar":
        return (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 4H18V2H16V4H8V2H6V4H5C3.89 4 3.01 4.9 3.01 6L3 20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V10H19V20ZM19 8H5V6H19V8ZM12 13H17V18H12V13Z"
              fill="currentColor"
            />
          </svg>
        );
      case "star":
        return (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"
              fill="currentColor"
            />
          </svg>
        );
      case "x":
        return (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
              fill="currentColor"
            />
          </svg>
        );
      case "question":
      default:
        return (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12 7C10.9 7 10 7.9 10 9H8C8 6.79 9.79 5 12 5C14.21 5 16 6.79 16 9C16 10.5 14.5 11.5 13.5 12.5C13.15 12.85 13 13.09 13 14H11C11 12.55 11.5 11.92 12.06 11.36C13.06 10.36 14 9.7 14 9C14 7.9 13.1 7 12 7ZM11 15H13V17H11V15Z"
              fill="currentColor"
            />
          </svg>
        );
    }
  };

  return (
    <div className="track-page">
      <Navbar />

      <div className="container">
        <div className="track-header">
          <h1 className="track-title">Track Your Applications</h1>
          <p className="track-subtitle">
            Keep track of all your job applications and their current status.
          </p>
        </div>

        <div className="track-content">
          {isLoading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading applications...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <p>{error}</p>
            </div>
          ) : (
            <div className="track-layout">
              <div className="track-sidebar">
                <div className="search-container">
                  <form onSubmit={handleSearch} className="search-form">
                    <input
                      type="text"
                      placeholder="Search by job title, company, or ID"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="search-input"
                    />
                    <button type="submit" className="search-button">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"
                          fill="currentColor"
                        />
                      </svg>
                    </button>
                  </form>
                </div>

                <div className="application-list">
                  {filteredApplications.length === 0 ? (
                    <div className="no-applications">
                      <p>No applications found matching your search.</p>
                    </div>
                  ) : (
                    filteredApplications.map((application) => (
                      <div
                        key={application.id}
                        className={`application-item ${
                          activeApplication &&
                          activeApplication.id === application.id
                            ? "active"
                            : ""
                        }`}
                        onClick={() => handleApplicationClick(application)}
                      >
                        <div className="application-item-header">
                          <h3 className="application-job-title">
                            {application.jobTitle}
                          </h3>
                          <span
                            className={`application-status status-${
                              getStatusDetails(application.status).color
                            }`}
                          >
                            {getStatusDetails(application.status).label}
                          </span>
                        </div>
                        <p className="application-company">
                          {application.company}
                        </p>
                        <div className="application-meta">
                          <span className="application-id">
                            ID: {application.id}
                          </span>
                          <span className="application-date">
                            Applied: {formatDate(application.appliedDate)}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="track-main">
                {activeApplication ? (
                  <div className="application-details">
                    <div className="application-header">
                      <div className="application-header-left">
                        <h2 className="application-title">
                          {activeApplication.jobTitle}
                        </h2>
                        <p className="application-company-detail">
                          {activeApplication.company}
                        </p>
                        <p className="application-applied-date">
                          Applied on {formatDate(activeApplication.appliedDate)}
                        </p>
                      </div>
                      <div className="application-header-right">
                        <div className="application-id-detail">
                          Application ID: {activeApplication.id}
                        </div>
                        <div
                          className={`application-current-status status-${
                            getStatusDetails(activeApplication.status).color
                          }`}
                        >
                          <span className="status-icon">
                            {renderStatusIcon(
                              getStatusDetails(activeApplication.status).icon
                            )}
                          </span>
                          <span className="status-text">
                            {getStatusDetails(activeApplication.status).label}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="application-timeline">
                      <h3 className="timeline-title">Application Timeline</h3>
                      <div className="timeline">
                        {activeApplication.statusHistory.map(
                          (historyItem, index) => (
                            <div key={index} className="timeline-item">
                              <div
                                className={`timeline-icon status-${
                                  getStatusDetails(historyItem.status).color
                                }`}
                              >
                                {renderStatusIcon(
                                  getStatusDetails(historyItem.status).icon
                                )}
                              </div>
                              <div className="timeline-content">
                                <div className="timeline-header">
                                  <h4 className="timeline-status">
                                    {getStatusDetails(historyItem.status).label}
                                  </h4>
                                  <span className="timeline-date">
                                    {formatDate(historyItem.date)}
                                  </span>
                                </div>
                                <p className="timeline-note">
                                  {historyItem.note}
                                </p>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {activeApplication.status !== "rejected" && (
                      <div className="application-actions">
                        <Link
                          to={`/jobs/${activeApplication.id}`}
                          className="btn btn-outline"
                        >
                          View Job
                        </Link>
                        <button className="btn btn-primary">
                          Contact Recruiter
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="no-selection">
                    <div className="no-selection-icon">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M19 5V19H5V5H19ZM20.1 3H3.9C3.4 3 3 3.4 3 3.9V20.1C3 20.5 3.4 21 3.9 21H20.1C20.5 21 21 20.5 21 20.1V3.9C21 3.4 20.5 3 20.1 3ZM12 12.9C11.5 12.9 11.1 12.5 11.1 12C11.1 11.5 11.5 11.1 12 11.1C12.5 11.1 12.9 11.5 12.9 12C12.9 12.5 12.5 12.9 12 12.9ZM13 16H11V16.9H13V16ZM14.8 8.2L14.2 10.8C14.1 11.3 13.7 11.6 13.2 11.6H10.8C10.3 11.6 9.9 11.3 9.8 10.8L9.2 8.2C9.1 7.6 9.5 7 10.2 7H13.9C14.5 7 14.9 7.6 14.8 8.2Z"
                          fill="currentColor"
                        />
                      </svg>
                    </div>
                    <h2 className="no-selection-title">
                      Select an Application
                    </h2>
                    <p className="no-selection-text">
                      Please select an application from the list to view its
                      details and current status.
                    </p>
                    {applications.length === 0 && (
                      <div className="track-id-form">
                        <h3>Track by Application ID</h3>
                        <form className="id-form">
                          <input
                            type="text"
                            placeholder="Enter application ID"
                            className="id-input"
                          />
                          <button type="submit" className="btn btn-primary">
                            Track
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TrackApplicationPage;

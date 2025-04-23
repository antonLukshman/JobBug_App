import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import SearchBar from "../components/common/SearchBar";
import JobList from "../components/jobs/JobList";
import "../styles/components/jobListingPage.css";

// Mock data for jobs
const mockJobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp",
    location: "San Francisco, CA",
    salary: "$120K - $150K",
    jobType: "Full-time",
    postDate: "2025-04-15",
    description:
      "We are looking for an experienced Frontend Developer proficient in React, TypeScript, and modern CSS frameworks.",
    logo: null,
    views: 245,
    applicants: 18,
    isRemote: true,
    isUrgent: true,
  },
  {
    id: 2,
    title: "UX/UI Designer",
    company: "DesignHub",
    location: "New York, NY",
    salary: "$90K - $110K",
    jobType: "Full-time",
    postDate: "2025-04-17",
    description:
      "Join our creative team to design beautiful and intuitive user experiences for our clients.",
    logo: null,
    views: 187,
    applicants: 12,
    isRemote: false,
    isUrgent: false,
  },
  {
    id: 3,
    title: "DevOps Engineer",
    company: "CloudSys",
    location: "Austin, TX",
    salary: "$130K - $160K",
    jobType: "Full-time",
    postDate: "2025-04-16",
    description:
      "We need a DevOps engineer to help us build and maintain our cloud infrastructure using AWS, Kubernetes, and CI/CD pipelines.",
    logo: null,
    views: 156,
    applicants: 7,
    isRemote: true,
    isUrgent: false,
  },
  {
    id: 4,
    title: "Backend Developer",
    company: "ServerTech",
    location: "Remote",
    salary: "$100K - $130K",
    jobType: "Full-time",
    postDate: "2025-04-14",
    description:
      "Looking for a skilled backend developer with experience in Node.js, Express, and MongoDB to join our team.",
    logo: null,
    views: 132,
    applicants: 15,
    isRemote: true,
    isUrgent: false,
  },
  {
    id: 5,
    title: "Marketing Manager",
    company: "GrowthCo",
    location: "Chicago, IL",
    salary: "$80K - $100K",
    jobType: "Full-time",
    postDate: "2025-04-13",
    description:
      "We are seeking a Marketing Manager to develop and implement marketing strategies to promote our products and services.",
    logo: null,
    views: 89,
    applicants: 9,
    isRemote: false,
    isUrgent: true,
  },
  {
    id: 6,
    title: "Data Scientist",
    company: "AnalyticsPro",
    location: "Boston, MA",
    salary: "$110K - $140K",
    jobType: "Full-time",
    postDate: "2025-04-12",
    description:
      "We are looking for a Data Scientist to analyze large datasets and build predictive models to help our business make better decisions.",
    logo: null,
    views: 175,
    applicants: 21,
    isRemote: false,
    isUrgent: false,
  },
];

// Job filter options
const jobTypes = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
  "Temporary",
];
const locations = [
  "San Francisco, CA",
  "New York, NY",
  "Austin, TX",
  "Chicago, IL",
  "Boston, MA",
  "Remote",
];
const salaryRanges = ["$0 - $50K", "$50K - $100K", "$100K - $150K", "$150K+"];
const datePosted = ["Today", "Last 3 days", "Last week", "Last month"];

const JobListingPage = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [filters, setFilters] = useState({
    jobType: [],
    location: [],
    salary: [],
    datePosted: "",
    remote: false,
    urgent: false,
  });
  const [showFilters, setShowFilters] = useState(true);

  // Simulate API call to fetch jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // For the demo, we'll just use the mock data
        setJobs(mockJobs);
        setFilteredJobs(mockJobs);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load jobs. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Filter jobs based on search query and filters
  useEffect(() => {
    if (jobs.length === 0) return;

    let result = [...jobs];

    // Apply search query
    if (searchQuery.trim() !== "") {
      result = result.filter(
        (job) =>
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply location search
    if (searchLocation.trim() !== "") {
      result = result.filter((job) =>
        job.location.toLowerCase().includes(searchLocation.toLowerCase())
      );
    }

    // Apply job type filter
    if (filters.jobType.length > 0) {
      result = result.filter((job) => filters.jobType.includes(job.jobType));
    }

    // Apply location filter
    if (filters.location.length > 0) {
      result = result.filter((job) => filters.location.includes(job.location));
    }

    // Apply salary filter
    if (filters.salary.length > 0) {
      // This is a simplified version for demo purposes
      result = result.filter((job) => {
        if (!job.salary) return false;

        const amount = parseInt(job.salary.replace(/[^0-9]/g, ""));

        return filters.salary.some((range) => {
          if (range === "$0 - $50K") return amount <= 50000;
          if (range === "$50K - $100K")
            return amount > 50000 && amount <= 100000;
          if (range === "$100K - $150K")
            return amount > 100000 && amount <= 150000;
          if (range === "$150K+") return amount > 150000;
          return false;
        });
      });
    }

    // Apply date posted filter
    if (filters.datePosted) {
      const now = new Date();

      result = result.filter((job) => {
        const postedDate = new Date(job.postDate);
        const daysDifference = Math.floor(
          (now - postedDate) / (1000 * 60 * 60 * 24)
        );

        if (filters.datePosted === "Today") return daysDifference < 1;
        if (filters.datePosted === "Last 3 days") return daysDifference < 3;
        if (filters.datePosted === "Last week") return daysDifference < 7;
        if (filters.datePosted === "Last month") return daysDifference < 30;

        return true;
      });
    }

    // Apply remote filter
    if (filters.remote) {
      result = result.filter((job) => job.isRemote);
    }

    // Apply urgent filter
    if (filters.urgent) {
      result = result.filter((job) => job.isUrgent);
    }

    setFilteredJobs(result);
  }, [jobs, searchQuery, searchLocation, filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Actual filtering is handled in the useEffect
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prevFilters) => {
      if (
        filterType === "jobType" ||
        filterType === "location" ||
        filterType === "salary"
      ) {
        // Handle array-based filters (checkboxes)
        if (prevFilters[filterType].includes(value)) {
          return {
            ...prevFilters,
            [filterType]: prevFilters[filterType].filter(
              (item) => item !== value
            ),
          };
        } else {
          return {
            ...prevFilters,
            [filterType]: [...prevFilters[filterType], value],
          };
        }
      } else if (filterType === "remote" || filterType === "urgent") {
        // Handle boolean filters (toggle)
        return {
          ...prevFilters,
          [filterType]: !prevFilters[filterType],
        };
      } else {
        // Handle string filters (radio buttons or select)
        return {
          ...prevFilters,
          [filterType]: value,
        };
      }
    });
  };

  const clearFilters = () => {
    setFilters({
      jobType: [],
      location: [],
      salary: [],
      datePosted: "",
      remote: false,
      urgent: false,
    });
    setSearchQuery("");
    setSearchLocation("");
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div className="job-listing-page">
      <Navbar />

      <div className="container">
        <div className="job-search-section">
          <h1 className="job-search-title">Find Your Dream Job</h1>
          <p className="job-search-subtitle">
            Browse thousands of job listings to find your perfect match
          </p>

          <div className="search-container">
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              searchLocation={searchLocation}
              setSearchLocation={setSearchLocation}
              handleSearch={handleSearch}
            />
          </div>

          <div className="filter-toggle">
            <button className="filter-toggle-btn" onClick={toggleFilters}>
              <svg
                className="filter-icon"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.25 5.61C6.57 8.59 10 13.5 10 13.5V18.5C10 19.33 10.67 20 11.5 20H12.5C13.33 20 14 19.33 14 18.5V13.5C14 13.5 17.43 8.59 19.75 5.61C20.26 4.95 19.79 4 18.95 4H5.04C4.21 4 3.74 4.95 4.25 5.61Z"
                  fill="currentColor"
                />
              </svg>
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
            {(filters.jobType.length > 0 ||
              filters.location.length > 0 ||
              filters.salary.length > 0 ||
              filters.datePosted ||
              filters.remote ||
              filters.urgent) && (
              <button className="clear-filters-btn" onClick={clearFilters}>
                Clear Filters
              </button>
            )}
          </div>
        </div>

        <div className="job-listing-content">
          {showFilters && (
            <div className="filters-sidebar">
              <div className="filter-section">
                <h3 className="filter-title">Job Type</h3>
                <div className="filter-options">
                  {jobTypes.map((type, index) => (
                    <div className="filter-option" key={index}>
                      <input
                        type="checkbox"
                        id={`job-type-${index}`}
                        checked={filters.jobType.includes(type)}
                        onChange={() => handleFilterChange("jobType", type)}
                      />
                      <label htmlFor={`job-type-${index}`}>{type}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="filter-section">
                <h3 className="filter-title">Location</h3>
                <div className="filter-options">
                  {locations.map((location, index) => (
                    <div className="filter-option" key={index}>
                      <input
                        type="checkbox"
                        id={`location-${index}`}
                        checked={filters.location.includes(location)}
                        onChange={() =>
                          handleFilterChange("location", location)
                        }
                      />
                      <label htmlFor={`location-${index}`}>{location}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="filter-section">
                <h3 className="filter-title">Salary Range</h3>
                <div className="filter-options">
                  {salaryRanges.map((range, index) => (
                    <div className="filter-option" key={index}>
                      <input
                        type="checkbox"
                        id={`salary-${index}`}
                        checked={filters.salary.includes(range)}
                        onChange={() => handleFilterChange("salary", range)}
                      />
                      <label htmlFor={`salary-${index}`}>{range}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="filter-section">
                <h3 className="filter-title">Date Posted</h3>
                <div className="filter-options">
                  {datePosted.map((date, index) => (
                    <div className="filter-option" key={index}>
                      <input
                        type="radio"
                        id={`date-${index}`}
                        name="datePosted"
                        checked={filters.datePosted === date}
                        onChange={() => handleFilterChange("datePosted", date)}
                      />
                      <label htmlFor={`date-${index}`}>{date}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="filter-section">
                <h3 className="filter-title">Other Filters</h3>
                <div className="filter-options">
                  <div className="filter-option">
                    <input
                      type="checkbox"
                      id="remote-filter"
                      checked={filters.remote}
                      onChange={() => handleFilterChange("remote")}
                    />
                    <label htmlFor="remote-filter">Remote Jobs</label>
                  </div>
                  <div className="filter-option">
                    <input
                      type="checkbox"
                      id="urgent-filter"
                      checked={filters.urgent}
                      onChange={() => handleFilterChange("urgent")}
                    />
                    <label htmlFor="urgent-filter">Urgent Hiring</label>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="jobs-main">
            <div className="jobs-header">
              <h2 className="jobs-found">{filteredJobs.length} Jobs Found</h2>
              <div className="sort-dropdown">
                <label htmlFor="sort-select">Sort by:</label>
                <select id="sort-select" defaultValue="relevance">
                  <option value="relevance">Relevance</option>
                  <option value="date">Date (Newest)</option>
                  <option value="salary">Salary (Highest)</option>
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading jobs...</p>
              </div>
            ) : error ? (
              <div className="error-container">
                <p>{error}</p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="no-jobs-found">
                <div className="no-jobs-icon">
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
                </div>
                <h3>No jobs found</h3>
                <p>
                  Try adjusting your search criteria or clearing some filters.
                </p>
                <button className="btn btn-primary" onClick={clearFilters}>
                  Clear All Filters
                </button>
              </div>
            ) : (
              <JobList jobs={filteredJobs} />
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default JobListingPage;

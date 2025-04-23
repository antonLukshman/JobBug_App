// src/services/api.js

import { auth } from "../firebase/config";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/api";

// Helper function to get authenticated request headers
const getAuthHeaders = async () => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    return {
      Authorization: `Firebase ${token}`,
      "Content-Type": "application/json",
    };
  }
  return {
    "Content-Type": "application/json",
  };
};

// Generic API request function
export const apiRequest = async (endpoint, method = "GET", data = null) => {
  try {
    const headers = await getAuthHeaders();

    const config = {
      method,
      headers,
      credentials: "include",
    };

    if (data && (method === "POST" || method === "PUT" || method === "PATCH")) {
      config.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API request error:", error);
    throw error;
  }
};

// Job-related API functions
export const jobsApi = {
  getAllJobs: () => apiRequest("/jobs/listings/"),
  getJobById: (id) => apiRequest(`/jobs/listings/${id}/`),
  searchJobs: (params) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/jobs/listings/?${queryString}`);
  },
  postJob: (jobData) => apiRequest("/jobs/listings/", "POST", jobData),
  applyToJob: (jobId, applicationData) =>
    apiRequest("/applications/my/", "POST", {
      job_id: jobId,
      ...applicationData,
    }),
  getSavedJobs: () => apiRequest("/jobs/saved/"),
  saveJob: (jobId) => apiRequest("/jobs/saved/", "POST", { job_id: jobId }),
  unsaveJob: (jobId) =>
    apiRequest("/jobs/saved/toggle/", "POST", { job_id: jobId }),
};

// User-related API functions
export const usersApi = {
  getProfile: () => apiRequest("/users/profiles/me/"),
  updateProfile: (profileData) =>
    apiRequest("/users/profiles/update_me/", "PATCH", profileData),
  getJobPreferences: () => apiRequest("/users/job-preferences/my_preferences/"),
  updateJobPreferences: (preferencesData) =>
    apiRequest(
      "/users/job-preferences/update_preferences/",
      "PATCH",
      preferencesData
    ),
};

// Applications-related API functions
export const applicationsApi = {
  getMyApplications: () => apiRequest("/applications/my/"),
  getApplicationById: (id) => apiRequest(`/applications/my/${id}/`),
  trackApplication: (trackingId) =>
    apiRequest(`/applications/track/${trackingId}/`),
  withdrawApplication: (id) =>
    apiRequest(`/applications/my/${id}/withdraw/`, "POST"),
};

// Example usage in a component
import React, { useState, useEffect } from "react";
import { jobsApi } from "../services/api";

const JobListingPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const jobsData = await jobsApi.getAllJobs();
        setJobs(jobsData.results || jobsData);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch jobs");
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="job-listing-page">
      <h1>Job Listings</h1>
      <div className="job-list">
        {jobs.map((job) => (
          <div key={job.id} className="job-card">
            <h2>{job.title}</h2>
            <p>{job.company_name}</p>
            {/* Other job details */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobListingPage;

// Example of using search and filters
const SearchAndFilterJobs = () => {
  const [searchParams, setSearchParams] = useState({
    search: "",
    location: "",
    job_type: "",
    is_remote: "",
  });
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Filter out empty values
      const filteredParams = Object.fromEntries(
        Object.entries(searchParams).filter(([_, value]) => value !== "")
      );

      const results = await jobsApi.searchJobs(filteredParams);
      setJobs(results.results || results);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        {/* Search inputs */}
        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search Jobs"}
        </button>
      </form>

      {/* Display jobs */}
    </div>
  );
};

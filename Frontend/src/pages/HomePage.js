import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import SearchBar from "../components/common/SearchBar";
import JobList from "../components/jobs/JobList";
import "../../src/styles/components/homePage.css";

// Mock data for featured jobs
const featuredJobs = [
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
];

// Mock data for categories
const categories = [
  { id: 1, name: "Technology", count: 1243, icon: "computer" },
  { id: 2, name: "Marketing", count: 872, icon: "chart" },
  { id: 3, name: "Design", count: 639, icon: "palette" },
  { id: 4, name: "Sales", count: 525, icon: "dollar" },
  { id: 5, name: "Customer Service", count: 438, icon: "headset" },
  { id: 6, name: "Healthcare", count: 394, icon: "heart" },
];

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    // In a real app, this would navigate to the search results page
    console.log("Searching for:", { searchQuery, searchLocation });
  };

  return (
    <div className="home-page">
      <Navbar />

      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Find Your Dream Job Today</h1>
            <p className="hero-subtitle">
              Discover thousands of job opportunities with all the information
              you need.
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

            <div className="hero-stats">
              <div className="hero-stat">
                <span className="stat-number">10k+</span>
                <span className="stat-text">Jobs</span>
              </div>
              <div className="hero-stat">
                <span className="stat-number">5k+</span>
                <span className="stat-text">Companies</span>
              </div>
              <div className="hero-stat">
                <span className="stat-number">25k+</span>
                <span className="stat-text">Candidates</span>
              </div>
            </div>
          </div>

          <div className="hero-image">
            <img
              src="/assets/images/hero-image.svg"
              alt="Job hunt illustration"
            />
          </div>
        </div>
      </section>

      <section className="section featured-jobs-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Jobs</h2>
            <Link to="/jobs" className="section-link">
              View All Jobs
            </Link>
          </div>

          <JobList jobs={featuredJobs} />
        </div>
      </section>

      <section className="section categories-section">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title">Browse by Category</h2>
            <p className="section-subtitle">
              Find the job that's perfect for you. Explore different categories.
            </p>
          </div>

          <div className="categories-grid">
            {categories.map((category) => (
              <Link
                to={`/jobs?category=${category.id}`}
                className="category-card"
                key={category.id}
              >
                <div className="category-icon">
                  {getCategoryIcon(category.icon)}
                </div>
                <h3 className="category-name">{category.name}</h3>
                <span className="category-count">{category.count} jobs</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">For Employers</h2>
            <p className="cta-text">
              Looking to hire the best talent? Post your job with us and reach
              thousands of qualified candidates.
            </p>
            <Link to="/post-job" className="btn btn-accent">
              Post a Job
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

// Helper function to render category icons
const getCategoryIcon = (iconName) => {
  switch (iconName) {
    case "computer":
      return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M20 18C21.1 18 22 17.1 22 16V6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V16C2 17.1 2.9 18 4 18H0V20H24V18H20ZM4 6H20V16H4V6Z"
            fill="currentColor"
          />
        </svg>
      );
    case "chart":
      return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17Z"
            fill="currentColor"
          />
        </svg>
      );
    case "palette":
      return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z"
            fill="currentColor"
          />
          <path
            d="M6.5 13C7.32843 13 8 12.3284 8 11.5C8 10.6716 7.32843 10 6.5 10C5.67157 10 5 10.6716 5 11.5C5 12.3284 5.67157 13 6.5 13Z"
            fill="currentColor"
          />
          <path
            d="M9.5 9C10.3284 9 11 8.32843 11 7.5C11 6.67157 10.3284 6 9.5 6C8.67157 6 8 6.67157 8 7.5C8 8.32843 8.67157 9 9.5 9Z"
            fill="currentColor"
          />
          <path
            d="M14.5 9C15.3284 9 16 8.32843 16 7.5C16 6.67157 15.3284 6 14.5 6C13.6716 6 13 6.67157 13 7.5C13 8.32843 13.6716 9 14.5 9Z"
            fill="currentColor"
          />
          <path
            d="M17.5 13C18.3284 13 19 12.3284 19 11.5C19 10.6716 18.3284 10 17.5 10C16.6716 10 16 10.6716 16 11.5C16 12.3284 16.6716 13 17.5 13Z"
            fill="currentColor"
          />
        </svg>
      );
    case "dollar":
      return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M11.8 10.9C9.53 10.31 8.8 9.7 8.8 8.75C8.8 7.66 9.81 6.9 11.5 6.9C13.28 6.9 13.94 7.75 14 9H16.21C16.14 7.28 15.09 5.7 13 5.19V3H10V5.16C8.06 5.58 6.5 6.84 6.5 8.77C6.5 11.08 8.41 12.23 11.2 12.9C13.7 13.5 14.2 14.38 14.2 15.31C14.2 16 13.71 17.1 11.5 17.1C9.44 17.1 8.63 16.18 8.5 15H6.32C6.44 17.19 8.08 18.42 10 18.83V21H13V18.85C14.95 18.48 16.5 17.35 16.5 15.3C16.5 12.46 14.07 11.49 11.8 10.9Z"
            fill="currentColor"
          />
        </svg>
      );
    case "headset":
      return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 1C7.03 1 3 5.03 3 10V17C3 18.66 4.34 20 6 20H9V12H5V10C5 6.13 8.13 3 12 3C15.87 3 19 6.13 19 10V12H15V20H19V21H12V23H18C19.66 23 21 21.66 21 20V10C21 5.03 16.97 1 12 1Z"
            fill="currentColor"
          />
        </svg>
      );
    case "heart":
      return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z"
            fill="currentColor"
          />
        </svg>
      );
    default:
      return null;
  }
};

export default HomePage;

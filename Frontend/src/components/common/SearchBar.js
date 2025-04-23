import React from "react";
import "../../styles/components/searchBar.css";

const SearchBar = ({
  searchQuery,
  setSearchQuery,
  searchLocation,
  setSearchLocation,
  handleSearch,
}) => {
  return (
    <div className="search-container">
      <form className="search-bar" onSubmit={handleSearch}>
        <div className="search-field-group">
          <div className="search-icon">
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
          <input
            type="text"
            placeholder="Job title, company, or keywords"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="search-divider"></div>

        <div className="search-field-group">
          <div className="search-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="City, state, or remote"
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            className="search-input"
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Go
        </button>
      </form>
    </div>
  );
};

export default SearchBar;

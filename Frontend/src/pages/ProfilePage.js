import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { useAuth } from "../context/AuthContext";
import "../styles/components/profilePage.css";
import defaultAvatar from "../default-avatar.svg";

const ProfilePage = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Profile information state
  const [profileData, setProfileData] = useState({
    displayName: "",
    email: "",
    phone: "",
    jobTitle: "",
    company: "",
    location: "",
    website: "",
    bio: "",
    skills: [],
    education: [],
    experience: [],
  });

  // Photo upload states
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  // Load user data from Firebase when component mounts
  useEffect(() => {
    if (currentUser) {
      setProfileData((prevData) => ({
        ...prevData,
        displayName: currentUser.displayName || "",
        email: currentUser.email || "",
        phone: currentUser.phoneNumber || "",
        jobTitle: currentUser.jobTitle || "",
        company: currentUser.company || "",
        location: currentUser.location || "",
        website: currentUser.website || "",
        bio: currentUser.bio || "",
        skills: currentUser.skills || [],
        education: currentUser.education || [],
        experience: currentUser.experience || [],
      }));

      if (currentUser.photoURL) {
        setPhotoPreview(currentUser.photoURL);
      }
    } else {
      // Redirect to login if not authenticated
      navigate("/login");
    }
  }, [currentUser, navigate]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const previewURL = URL.createObjectURL(file);
      setPhotoPreview(previewURL);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddSkill = () => {
    setProfileData((prevData) => ({
      ...prevData,
      skills: [...prevData.skills, ""],
    }));
  };

  const handleSkillChange = (index, value) => {
    const updatedSkills = [...profileData.skills];
    updatedSkills[index] = value;
    setProfileData((prevData) => ({
      ...prevData,
      skills: updatedSkills,
    }));
  };

  const handleRemoveSkill = (index) => {
    const updatedSkills = profileData.skills.filter((_, i) => i !== index);
    setProfileData((prevData) => ({
      ...prevData,
      skills: updatedSkills,
    }));
  };

  const handleAddEducation = () => {
    setProfileData((prevData) => ({
      ...prevData,
      education: [
        ...prevData.education,
        {
          school: "",
          degree: "",
          field: "",
          startYear: "",
          endYear: "",
          current: false,
        },
      ],
    }));
  };

  const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...profileData.education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value,
    };
    setProfileData((prevData) => ({
      ...prevData,
      education: updatedEducation,
    }));
  };

  const handleRemoveEducation = (index) => {
    const updatedEducation = profileData.education.filter(
      (_, i) => i !== index
    );
    setProfileData((prevData) => ({
      ...prevData,
      education: updatedEducation,
    }));
  };

  const handleAddExperience = () => {
    setProfileData((prevData) => ({
      ...prevData,
      experience: [
        ...prevData.experience,
        {
          title: "",
          company: "",
          location: "",
          startDate: "",
          endDate: "",
          current: false,
          description: "",
        },
      ],
    }));
  };

  const handleExperienceChange = (index, field, value) => {
    const updatedExperience = [...profileData.experience];
    updatedExperience[index] = {
      ...updatedExperience[index],
      [field]: value,
    };
    setProfileData((prevData) => ({
      ...prevData,
      experience: updatedExperience,
    }));
  };

  const handleRemoveExperience = (index) => {
    const updatedExperience = profileData.experience.filter(
      (_, i) => i !== index
    );
    setProfileData((prevData) => ({
      ...prevData,
      experience: updatedExperience,
    }));
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // In a real application, you would upload the photo to storage
      // and get the URL to save in the user profile
      let photoURL = currentUser.photoURL;

      if (photoFile) {
        // This is where you would implement the file upload logic
        // For example, using Firebase Storage
        // const storageRef = ref(storage, `profile-photos/${currentUser.uid}`);
        // const uploadTask = await uploadBytes(storageRef, photoFile);
        // photoURL = await getDownloadURL(storageRef);

        // For this example, we'll just simulate it
        photoURL = photoPreview;
      }

      // Update user profile data
      await updateUserProfile({
        ...profileData,
        photoURL,
      });

      setSuccess("Profile updated successfully!");
      setIsLoading(false);
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update profile. " + err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <Navbar />

      <div className="container">
        <div className="profile-header">
          <h1>{isEditing ? "Edit Profile" : "My Profile"}</h1>
          <p>
            Manage your profile information to optimize your job search
            experience
          </p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="profile-content">
          <div className="profile-sidebar">
            <div className="profile-photo-container">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Profile"
                  className="profile-photo"
                />
              ) : (
                <img
                  src={defaultAvatar}
                  alt="Default Profile"
                  className="profile-photo"
                />
              )}

              {isEditing && (
                <div className="photo-upload">
                  <label htmlFor="profile-photo" className="photo-upload-label">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 21H21V18H3V21ZM9.5 10.5L13.09 14.09L14.5 12.68L18 16.17V3H9.5V10.5ZM6 18H18V16.17L13.5 11.67L11.5 13.68L8.5 10.68V6H6V18Z"
                        fill="currentColor"
                      />
                    </svg>
                    <span>Change Photo</span>
                  </label>
                  <input
                    type="file"
                    id="profile-photo"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="photo-input"
                  />
                </div>
              )}
            </div>

            <div className="profile-navigation">
              <button className="profile-nav-item active">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
                    fill="currentColor"
                  />
                </svg>
                <span>Profile Information</span>
              </button>
              <button className="profile-nav-item">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 6H10V12H8V4H20V6ZM4 8V16H20V8H4ZM20 18H4V20H20V18ZM3 2H6V4H3V7H1V4C1 2.9 1.9 2 3 2ZM3 17H1V20C1 21.1 1.9 22 3 22H6V20H3V17ZM23 4V7H21V4H18V2H21C22.1 2 23 2.9 23 4ZM21 17V20H18V22H21C22.1 22 23 21.1 23 20V17H21Z"
                    fill="currentColor"
                  />
                </svg>
                <span>Resume</span>
              </button>
              <button className="profile-nav-item">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 3H14.82C14.4 1.84 13.3 1 12 1C10.7 1 9.6 1.84 9.18 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM12 3C12.55 3 13 3.45 13 4C13 4.55 12.55 5 12 5C11.45 5 11 4.55 11 4C11 3.45 11.45 3 12 3ZM12 7C13.66 7 15 8.34 15 10C15 11.66 13.66 13 12 13C10.34 13 9 11.66 9 10C9 8.34 10.34 7 12 7ZM18 19H6V17.6C6 15.6 10 14.5 12 14.5C14 14.5 18 15.6 18 17.6V19Z"
                    fill="currentColor"
                  />
                </svg>
                <span>Applications</span>
              </button>
              <button className="profile-nav-item">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19.14 12.94C19.18 12.64 19.2 12.33 19.2 12C19.2 11.68 19.18 11.36 19.13 11.06L21.16 9.48C21.34 9.34 21.39 9.07 21.28 8.87L19.36 5.55C19.24 5.33 18.99 5.26 18.77 5.33L16.38 6.29C15.88 5.91 15.35 5.59 14.76 5.35L14.4 2.81C14.36 2.57 14.16 2.4 13.92 2.4H10.08C9.84 2.4 9.65 2.57 9.61 2.81L9.25 5.35C8.66 5.59 8.12 5.92 7.63 6.29L5.24 5.33C5.02 5.25 4.77 5.33 4.65 5.55L2.74 8.87C2.62 9.08 2.66 9.34 2.86 9.48L4.89 11.06C4.84 11.36 4.8 11.69 4.8 12C4.8 12.31 4.82 12.64 4.87 12.94L2.84 14.52C2.66 14.66 2.61 14.93 2.72 15.13L4.64 18.45C4.76 18.67 5.01 18.74 5.23 18.67L7.62 17.71C8.12 18.09 8.65 18.41 9.24 18.65L9.6 21.19C9.65 21.43 9.84 21.6 10.08 21.6H13.92C14.16 21.6 14.36 21.43 14.39 21.19L14.75 18.65C15.34 18.41 15.88 18.09 16.37 17.71L18.76 18.67C18.98 18.75 19.23 18.67 19.35 18.45L21.27 15.13C21.39 14.91 21.34 14.66 21.15 14.52L19.14 12.94ZM12 15.6C10.02 15.6 8.4 13.98 8.4 12C8.4 10.02 10.02 8.4 12 8.4C13.98 8.4 15.6 10.02 15.6 12C15.6 13.98 13.98 15.6 12 15.6Z"
                    fill="currentColor"
                  />
                </svg>
                <span>Settings</span>
              </button>
            </div>
          </div>

          <div className="profile-main">
            <div className="profile-card">
              <div className="profile-card-header">
                <h2>Profile Information</h2>
                {!isEditing ? (
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={handleEditToggle}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z"
                        fill="currentColor"
                      />
                    </svg>
                    Edit Profile
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={handleEditToggle}
                  >
                    Cancel
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit}>
                <div className="profile-form">
                  {isEditing ? (
                    <>
                      <div className="form-section">
                        <h3>Basic Information</h3>
                        <div className="form-row">
                          <div className="form-group">
                            <label htmlFor="displayName">Full Name</label>
                            <input
                              type="text"
                              id="displayName"
                              name="displayName"
                              value={profileData.displayName}
                              onChange={handleInputChange}
                              className="form-control"
                            />
                          </div>
                          <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={profileData.email}
                              readOnly
                              className="form-control disabled"
                            />
                            <p className="form-hint">Email cannot be changed</p>
                          </div>
                        </div>

                        <div className="form-row">
                          <div className="form-group">
                            <label htmlFor="phone">Phone Number</label>
                            <input
                              type="tel"
                              id="phone"
                              name="phone"
                              value={profileData.phone}
                              onChange={handleInputChange}
                              className="form-control"
                            />
                          </div>
                          <div className="form-group">
                            <label htmlFor="location">Location</label>
                            <input
                              type="text"
                              id="location"
                              name="location"
                              value={profileData.location}
                              onChange={handleInputChange}
                              className="form-control"
                              placeholder="City, State"
                            />
                          </div>
                        </div>

                        <div className="form-row">
                          <div className="form-group">
                            <label htmlFor="jobTitle">Job Title</label>
                            <input
                              type="text"
                              id="jobTitle"
                              name="jobTitle"
                              value={profileData.jobTitle}
                              onChange={handleInputChange}
                              className="form-control"
                              placeholder="e.g. Frontend Developer"
                            />
                          </div>
                          <div className="form-group">
                            <label htmlFor="company">Company</label>
                            <input
                              type="text"
                              id="company"
                              name="company"
                              value={profileData.company}
                              onChange={handleInputChange}
                              className="form-control"
                              placeholder="Current company (if employed)"
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <label htmlFor="website">
                            Personal Website/Portfolio
                          </label>
                          <input
                            type="url"
                            id="website"
                            name="website"
                            value={profileData.website}
                            onChange={handleInputChange}
                            className="form-control"
                            placeholder="https://example.com"
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="bio">Bio</label>
                          <textarea
                            id="bio"
                            name="bio"
                            value={profileData.bio}
                            onChange={handleInputChange}
                            className="form-control"
                            rows="4"
                            placeholder="Tell us about yourself"
                          ></textarea>
                        </div>
                      </div>

                      <div className="form-section">
                        <h3>Skills</h3>
                        <p className="section-hint">
                          Add skills relevant to your profession
                        </p>

                        <div className="skills-container">
                          {profileData.skills.map((skill, index) => (
                            <div key={index} className="skill-item">
                              <input
                                type="text"
                                value={skill}
                                onChange={(e) =>
                                  handleSkillChange(index, e.target.value)
                                }
                                className="form-control"
                                placeholder="e.g. JavaScript"
                              />
                              <button
                                type="button"
                                className="btn-remove"
                                onClick={() => handleRemoveSkill(index)}
                              >
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
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            className="btn btn-add"
                            onClick={handleAddSkill}
                          >
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z"
                                fill="currentColor"
                              />
                            </svg>
                            Add Skill
                          </button>
                        </div>
                      </div>

                      <div className="form-section">
                        <h3>Education</h3>

                        {profileData.education.map((edu, index) => (
                          <div key={index} className="education-item">
                            <div className="education-header">
                              <h4>Education #{index + 1}</h4>
                              <button
                                type="button"
                                className="btn-remove"
                                onClick={() => handleRemoveEducation(index)}
                              >
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
                              </button>
                            </div>

                            <div className="form-row">
                              <div className="form-group">
                                <label>School/University</label>
                                <input
                                  type="text"
                                  value={edu.school}
                                  onChange={(e) =>
                                    handleEducationChange(
                                      index,
                                      "school",
                                      e.target.value
                                    )
                                  }
                                  className="form-control"
                                  placeholder="School name"
                                />
                              </div>
                              <div className="form-group">
                                <label>Degree</label>
                                <input
                                  type="text"
                                  value={edu.degree}
                                  onChange={(e) =>
                                    handleEducationChange(
                                      index,
                                      "degree",
                                      e.target.value
                                    )
                                  }
                                  className="form-control"
                                  placeholder="e.g. Bachelor's"
                                />
                              </div>
                            </div>

                            <div className="form-group">
                              <label>Field of Study</label>
                              <input
                                type="text"
                                value={edu.field}
                                onChange={(e) =>
                                  handleEducationChange(
                                    index,
                                    "field",
                                    e.target.value
                                  )
                                }
                                className="form-control"
                                placeholder="e.g. Computer Science"
                              />
                            </div>

                            <div className="form-row">
                              <div className="form-group">
                                <label>Start Year</label>
                                <input
                                  type="text"
                                  value={edu.startYear}
                                  onChange={(e) =>
                                    handleEducationChange(
                                      index,
                                      "startYear",
                                      e.target.value
                                    )
                                  }
                                  className="form-control"
                                  placeholder="e.g. 2018"
                                />
                              </div>
                              <div className="form-group">
                                <label>End Year</label>
                                <input
                                  type="text"
                                  value={edu.endYear}
                                  onChange={(e) =>
                                    handleEducationChange(
                                      index,
                                      "endYear",
                                      e.target.value
                                    )
                                  }
                                  className="form-control"
                                  placeholder="e.g. 2022 or Present"
                                  disabled={edu.current}
                                />
                              </div>
                            </div>

                            <div className="form-group checkbox-group">
                              <input
                                type="checkbox"
                                id={`current-edu-${index}`}
                                checked={edu.current}
                                onChange={(e) =>
                                  handleEducationChange(
                                    index,
                                    "current",
                                    e.target.checked
                                  )
                                }
                                className="checkbox-input"
                              />
                              <label
                                htmlFor={`current-edu-${index}`}
                                className="checkbox-label"
                              >
                                I am currently studying here
                              </label>
                            </div>
                          </div>
                        ))}

                        <button
                          type="button"
                          className="btn btn-add"
                          onClick={handleAddEducation}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z"
                              fill="currentColor"
                            />
                          </svg>
                          Add Education
                        </button>
                      </div>

                      <div className="form-section">
                        <h3>Work Experience</h3>

                        {profileData.experience.map((exp, index) => (
                          <div key={index} className="experience-item">
                            <div className="experience-header">
                              <h4>Experience #{index + 1}</h4>
                              <button
                                type="button"
                                className="btn-remove"
                                onClick={() => handleRemoveExperience(index)}
                              >
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
                              </button>
                            </div>

                            <div className="form-row">
                              <div className="form-group">
                                <label>Job Title</label>
                                <input
                                  type="text"
                                  value={exp.title}
                                  onChange={(e) =>
                                    handleExperienceChange(
                                      index,
                                      "title",
                                      e.target.value
                                    )
                                  }
                                  className="form-control"
                                  placeholder="e.g. Frontend Developer"
                                />
                              </div>
                              <div className="form-group">
                                <label>Company</label>
                                <input
                                  type="text"
                                  value={exp.company}
                                  onChange={(e) =>
                                    handleExperienceChange(
                                      index,
                                      "company",
                                      e.target.value
                                    )
                                  }
                                  className="form-control"
                                  placeholder="Company name"
                                />
                              </div>
                            </div>

                            <div className="form-group">
                              <label>Location</label>
                              <input
                                type="text"
                                value={exp.location}
                                onChange={(e) =>
                                  handleExperienceChange(
                                    index,
                                    "location",
                                    e.target.value
                                  )
                                }
                                className="form-control"
                                placeholder="e.g. San Francisco, CA or Remote"
                              />
                            </div>

                            <div className="form-row">
                              <div className="form-group">
                                <label>Start Date</label>
                                <input
                                  type="text"
                                  value={exp.startDate}
                                  onChange={(e) =>
                                    handleExperienceChange(
                                      index,
                                      "startDate",
                                      e.target.value
                                    )
                                  }
                                  className="form-control"
                                  placeholder="e.g. June 2020"
                                />
                              </div>
                              <div className="form-group">
                                <label>End Date</label>
                                <input
                                  type="text"
                                  value={exp.endDate}
                                  onChange={(e) =>
                                    handleExperienceChange(
                                      index,
                                      "endDate",
                                      e.target.value
                                    )
                                  }
                                  className="form-control"
                                  placeholder="e.g. July 2022 or Present"
                                  disabled={exp.current}
                                />
                              </div>
                            </div>

                            <div className="form-group checkbox-group">
                              <input
                                type="checkbox"
                                id={`current-exp-${index}`}
                                checked={exp.current}
                                onChange={(e) =>
                                  handleExperienceChange(
                                    index,
                                    "current",
                                    e.target.checked
                                  )
                                }
                                className="checkbox-input"
                              />
                              <label
                                htmlFor={`current-exp-${index}`}
                                className="checkbox-label"
                              >
                                I am currently working here
                              </label>
                            </div>

                            <div className="form-group">
                              <label>Description</label>
                              <textarea
                                value={exp.description}
                                onChange={(e) =>
                                  handleExperienceChange(
                                    index,
                                    "description",
                                    e.target.value
                                  )
                                }
                                className="form-control"
                                rows="3"
                                placeholder="Describe your responsibilities and achievements"
                              ></textarea>
                            </div>
                          </div>
                        ))}

                        <button
                          type="button"
                          className="btn btn-add"
                          onClick={handleAddExperience}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z"
                              fill="currentColor"
                            />
                          </svg>
                          Add Experience
                        </button>
                      </div>

                      <div className="form-actions">
                        <button
                          type="button"
                          className="btn btn-outline"
                          onClick={handleEditToggle}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <div className="button-spinner"></div>
                              Saving...
                            </>
                          ) : (
                            "Save Changes"
                          )}
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="profile-info">
                      <div className="info-section">
                        <h3>Basic Information</h3>
                        <div className="info-grid">
                          <div className="info-item">
                            <div className="info-label">Full Name</div>
                            <div className="info-value">
                              {profileData.displayName || "Not provided"}
                            </div>
                          </div>
                          <div className="info-item">
                            <div className="info-label">Email</div>
                            <div className="info-value">
                              {profileData.email}
                            </div>
                          </div>
                          <div className="info-item">
                            <div className="info-label">Phone Number</div>
                            <div className="info-value">
                              {profileData.phone || "Not provided"}
                            </div>
                          </div>
                          <div className="info-item">
                            <div className="info-label">Location</div>
                            <div className="info-value">
                              {profileData.location || "Not provided"}
                            </div>
                          </div>
                          <div className="info-item">
                            <div className="info-label">Job Title</div>
                            <div className="info-value">
                              {profileData.jobTitle || "Not provided"}
                            </div>
                          </div>
                          <div className="info-item">
                            <div className="info-label">Company</div>
                            <div className="info-value">
                              {profileData.company || "Not provided"}
                            </div>
                          </div>
                          <div className="info-item full-width">
                            <div className="info-label">Website</div>
                            <div className="info-value">
                              {profileData.website ? (
                                <a
                                  href={profileData.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {profileData.website}
                                </a>
                              ) : (
                                "Not provided"
                              )}
                            </div>
                          </div>
                          <div className="info-item full-width">
                            <div className="info-label">Bio</div>
                            <div className="info-value bio-text">
                              {profileData.bio || "No bio provided yet."}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="info-section">
                        <h3>Skills</h3>
                        {profileData.skills && profileData.skills.length > 0 ? (
                          <div className="skills-list">
                            {profileData.skills.map((skill, index) => (
                              <span key={index} className="skill-tag">
                                {skill}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="no-data">No skills added yet.</p>
                        )}
                      </div>

                      <div className="info-section">
                        <h3>Education</h3>
                        {profileData.education &&
                        profileData.education.length > 0 ? (
                          <div className="education-list">
                            {profileData.education.map((edu, index) => (
                              <div key={index} className="education-card">
                                <div className="education-header">
                                  <h4>{edu.school}</h4>
                                  <div className="education-years">
                                    {edu.startYear} -{" "}
                                    {edu.current ? "Present" : edu.endYear}
                                  </div>
                                </div>
                                <div className="education-degree">
                                  {edu.degree}{" "}
                                  {edu.field ? `in ${edu.field}` : ""}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="no-data">
                            No education history added yet.
                          </p>
                        )}
                      </div>

                      <div className="info-section">
                        <h3>Work Experience</h3>
                        {profileData.experience &&
                        profileData.experience.length > 0 ? (
                          <div className="experience-list">
                            {profileData.experience.map((exp, index) => (
                              <div key={index} className="experience-card">
                                <div className="experience-header">
                                  <h4>{exp.title}</h4>
                                  <div className="experience-dates">
                                    {exp.startDate} -{" "}
                                    {exp.current ? "Present" : exp.endDate}
                                  </div>
                                </div>
                                <div className="experience-company">
                                  {exp.company}{" "}
                                  {exp.location ? `· ${exp.location}` : ""}
                                </div>
                                {exp.description && (
                                  <div className="experience-description">
                                    {exp.description}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="no-data">
                            No work experience added yet.
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProfilePage;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Import pages
import HomePage from "./pages/HomePage";
import JobListingPage from "./pages/JobListingPage";
import JobDetailPage from "./pages/JobDetailPage";
import ApplicationPage from "./pages/ApplicationPage";
import TrackApplicationPage from "./pages/TrackApplicationPage";
import PostJobPage from "./pages/PostJobPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import PrivateRoute from "./components/common/PrivateRoute";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/jobs" element={<JobListingPage />} />
          <Route path="/jobs/:id" element={<JobDetailPage />} />
          <Route
            path="/jobs/:id/apply"
            element={
              <PrivateRoute>
                <ApplicationPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/track-application"
            element={
              <PrivateRoute>
                <TrackApplicationPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/post-job"
            element={
              <PrivateRoute>
                <PostJobPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

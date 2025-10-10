import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import React from "react";
import Home from "./pages/Home";
import Signup from "./pages/signup";
import VerifyEmail from "./pages/verify";
import Artisansignup from "./pages/artisansignup";
import UploadIdentity from "./pages/upload";
import LoginPage from "../src/pages/LoginPage";
import LoginPageII from "../src/pages/LoginPageII";
import Dashboard from "./pages/dashboard/index";
import Layout from "./components/Layout";
import Profile from "./pages/profile";
import ErrorPageV from "../src/pages/ErrorPageV";
import ErrorPageVI from "../src/pages/ErrorPageVI";
import ErrorPageVII from "../src/pages/ErrorPageVII";
import ErrorPageVIII from "../src/pages/ErrorPageVIII";
import DashboardLayout from "./pages/admindashboard/Layout";
import Overview from "./pages/admindashboard/Overview";
import UserMgtLayout from "./pages/admindashboard/usermgt/UserMgtLayout";
import ArtisansPage from "./pages/admindashboard/usermgt/artisans/ArtisansPage";
import ClientsPage from "./pages/admindashboard/usermgt/clients/ClientsPage";
import ArtisanLayout from "./pages/admindashboard/usermgt/artisans/ArtisanLayout";
import ArtisanProfile from "./pages/admindashboard/usermgt/artisans/ArtisanProfile";
import ArtisanActivity from "./pages/admindashboard/usermgt/artisans/ArtisanActivity";
// import ClientsPage from "./pages/userMgt/clients/ClientsPage";
import ClientProfile from "./pages/admindashboard/usermgt/clients/ClientProfile";
import BookingHistory from "./pages/admindashboard/usermgt/clients/BookingHistory";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup-customer" element={<Signup />} />
        <Route path="/signup-artisan" element={<Artisansignup />} />
        <Route path="/upload" element={<UploadIdentity />} />
        <Route path="/verify" element={<VerifyEmail />} />
        <Route path="/admindashboard" element={<DashboardLayout />}>
          <Route index element={<Overview />} />

          {/* User Management (nested under dashboard) */}
          <Route path="user-mgt" element={<UserMgtLayout />}>
            {/* Lists */}
            <Route path="artisans" element={<ArtisansPage />} />
            <Route path="clients" element={<ClientsPage />} />

            {/* Artisan detail (tabs) */}
            <Route path="artisans/:artisanId" element={<ArtisanLayout />}>
              <Route index element={<Navigate to="profile" replace />} />
              <Route path="profile" element={<ArtisanProfile />} />
              <Route path="activity" element={<ArtisanActivity />} />
            </Route>
            <Route path="clients" element={<ClientsPage />} />
            <Route path="clients/:id" element={<ClientProfile />} />
            <Route path="clients/:id/history" element={<BookingHistory />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}
export default App;

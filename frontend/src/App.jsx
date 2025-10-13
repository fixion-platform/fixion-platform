import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import React from "react";
import Home from "./pages/Home";
import SignupCustomer from "./pages/signup";
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
// import LoginPageII from "./pages/LoginPageII";
// import Dashboard from "./pages/dashboard/index";
// import Layout from "./components/Layout";
// import Profile from "./pages/profile";
import JobDetailsPage from "./pages/JobDetailsPage";
import ConfirmBookingPage from "./pages/ConfirmBookingPage";
import AccountInfoPage from "./pages/AccountInfoPage";
import AccountDetailsPage from "./pages/AccountDetailsPage";
// import Sidebar2 from './components/SideBar2';
import BookingSummary from "./pages/JobBooking/Book/BookSummary/page";
import Booking from "./pages/JobBooking/Book/page";
import ServicePreferences from "./pages/searchAndLocateArtisan/page";

import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/login2" element={<LoginPageII />} />
        <Route path="/signup-customer" element={<SignupCustomer />} />
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
        {/* Wrapped in Layout */}
        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/profile"
          element={
            <Layout>
              <Profile />
            </Layout>
          }
        />

        {/* Job Details Page - wrapped in Layout */}
        <Route
          path="/jobdetail"
          element={
            <Layout>
              <JobDetailsPage />
            </Layout>
          }
        />

        <Route
          path="/confirm-booking"
          element={
            <Layout>
              <ConfirmBookingPage />
            </Layout>
          }
        />

        <Route
          path="/artisansinfo"
          element={
            <Layout>
              <AccountInfoPage />
            </Layout>
          }
        />

        <Route
          path="/artisansdetails"
          element={
            <Layout>
              <AccountDetailsPage />
            </Layout>
          }
        />
        {/* Home -> no sidebar */}
      {/* <Route path="/" element={<ErrorPageVIII />} /> */}
      <Route path="/Locateartisan" element={<ServicePreferences/>} />

      {/* Dashboard routes -> sidebar included */}
      <Route element={<DashboardLayout />}>
        <Route path="/booking" element={<Booking />} />
        <Route path="/booking-summary" element={<BookingSummary />} />
        {/*  Add more routes here, all will share Sidebar */}
        {/* <Route path="/messages" element={<Messages />} /> */}
        
      </Route>

      {/* Fallback */}
      <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </Router>
  );
}
export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import Home from './pages/Home';
import Signup from "./pages/signup";
import VerifyEmail from "./pages/verify";
import Artisansignup from "./pages/artisansignup";
import UploadIdentity from "./pages/upload";
import LoginPage from '../src/pages/LoginPage';
import LoginPageII from '../src/pages/LoginPageII';
import Dashboard from "./pages/dashboard/index";
import Layout from "./components/Layout";
import Profile from "./pages/profile";
import ErrorPageV from '../src/pages/ErrorPageV';
import ErrorPageVI from '../src/pages/ErrorPageVI';
import ErrorPageVII from '../src/pages/ErrorPageVII';
import ErrorPageVIII from '../src/pages/ErrorPageVIII;'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  )


}
export default App;

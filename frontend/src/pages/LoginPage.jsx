import React, { useState } from 'react';
import img1 from '../assets/images/758a999c511ebe7be801513d5856261262c7c097.jpg';
import img2 from '../assets/fixion_logo.svg';
import img3 from '../assets/gg_google.svg';
import img4 from '../assets/mingcute_apple-fill.svg';
import img5 from '../assets/sms.svg';
import img6 from '../assets/eye-slash.svg';
import './FixionLogin.css';

export default function FixionLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="login-container min-h-screen w-screen flex flex-col lg:flex-row m-0 p-0">
      {/* Left Side - Hero Section */}
      <div className="hero-section relative overflow-hidden flex-shrink-0">
      {/* Background image */}
      <img
        src={img1}
        alt="Artisan giving thumbs up"
        className="hero-image absolute inset-0 w-full h-full object-fill z-10"
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 z-15"
        style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0), #050150)'
        }}
      ></div>

      {/* Logo & Motto */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 text-white text-center">
        <div className="mb-4">
          <img src={img2} alt="FIXION" className="hero-logo mx-auto" />
        </div>
        <h2 className="hero-heading text-white font-semibold whitespace-nowrap">
          Find the right fix, Fast!
        </h2>
      </div>
    </div>



      {/* Right Side - Login Form */}
      <div className="form-section flex-1 bg-gray-50 flex items-center justify-center">
        <div className="w-full max-w-md px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h3 className="form-title">
              Welcome Back!
            </h3>
            <p className="text-gray-600">
              Discover talented artisans near you
            </p>
          </div>

          {/* Social Login Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <button className="social-btn flex items-center gap-2 whitespace-nowrap">
              <img src={img3} alt="G" />
              <span className="text-gray-700 font-medium whitespace-nowrap">
                Login with Google
              </span>
            </button>
            <button className="social-btn flex items-center gap-2 whitespace-nowrap">
              <img src={img4} alt="A" />
              <span className="text-gray-700 font-medium whitespace-nowrap">
                Login with Apple
              </span>
            </button>
          </div>


          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">or continue with</span>
            </div>
          </div>

          {/* Login Form */}
          <div className="space-y-4">
          {/* Email Field */}
          <div className="text-left">
            <label
              className="block text-sm font-medium mb-2 text-left"
              style={{ color: '#1E1A62' }}
            >
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field text-black"
                placeholder="Enter your email"
              />
              <div className="icon-placeholder absolute right-3 top-1/2 transform -translate-y-1/2">
                <img src={img5} alt="@" />
              </div>
            </div>
          </div>

          {/* Password Field */}
            <div className="text-left">
              <label
                className="block text-sm font-medium mb-2 text-left"
                style={{ color: '#1E1A62' }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field text-black"
                  placeholder="Enter your password"
                />
                <div
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-transparent p-0 border-none focus:outline-none"
                >
                  <img src={img6} alt="Toggle password visibility" className="w-5 h-5" />
                </div>
              </div>
            </div>

           {/* Forgot Password */}
            <div className="text-right">
              <a
                href="#"
                className="text-sm font-medium hover:opacity-80"
                style={{ color: '#1E1A62' }}
              >
                Forgot Password?
              </a>
            </div>

            {/* Login Button */}
            <button
              onClick={() => console.log('Login clicked')}
              className="login-btn"
            >
              Log In
            </button>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <span className="font-bold text-black hover:text-gray-800 cursor-pointer">
                Sign Up
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

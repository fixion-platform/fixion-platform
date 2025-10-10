import React from "react";
import logo from "../assets/images/fixion-log.svg";
import facebookLogo from "../assets/icons/logos_facebook.svg";
import instagramLogo from "../assets/icons/skill-icons_instagram.svg";
import linkedinLogo from "../assets/icons/skill-icons_linkedin.svg";
import twitterLogo from "../assets/icons/streamline-logos_x-twitter-logo-block.svg";
import Modal from "../components/Modal";
import { useState } from "react";

const Footer = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <footer className="w-full bg-[#F4F4F7] font-poppins pt-12">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-wrap justify-between items-start gap-8">
          {/* Left Column */}
          <div className="flex flex-col gap-4 max-w-[280px]">
            <img
              src={logo}
              alt="Fixion Logo"
              className="w-[80px] object-contain"
            />
            <p className="text-sm text-neutral-700 leading-relaxed text-left max-w-[300px] ">
              Fixion is a platform built to help people find local trusted
              artisans (like plumbers, electricians, caterers etc.) quickly and
              easily.
            </p>
            <div className="flex gap-4 mt-2">
              <img src={facebookLogo} alt="Facebook" className="w-5 h-5" />
              <img src={instagramLogo} alt="Instagram" className="w-5 h-5" />
              <img src={linkedinLogo} alt="LinkedIn" className="w-5 h-5" />
              <img src={twitterLogo} alt="X (Twitter)" className="w-5 h-5" />
            </div>
          </div>

          {/* Center Columns */}
          <div className="flex flex-wrap md:flex-nowrap gap-12">
            {/* Company */}
            <div>
              <h4 className="font-semibold text-zinc-900 mb-3">Company</h4>
              <ul className="text-sm text-neutral-700 flex flex-col gap-2">
                <li>About Us</li>
                <li>Contact Us</li>
                <li>Search Artisans</li>
                <li>Become an Artisan</li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold text-zinc-900 mb-3">Support</h4>
              <ul className="text-sm text-neutral-700 flex flex-col gap-2">
                <li>Help Center</li>
                <li>FAQs</li>
                <li>Terms & Condition</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
          </div>

          {/* Get Started */}
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-zinc-900">Get Started</h4>
            <button
              onClick={() => setShowModal(true)}
              className="bg-indigo-950 text-white rounded-full px-6 py-2 text-sm font-semibold w-fit"
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="bg-[#CBC8DD] text-center py-4 mt-10 text-sm text-zinc-700">
          © 2025 – Fixion. All Rights Reserved
        </div>
      </footer>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default Footer;

import React from 'react';

import logo from "../assets/fixion_for_error.svg";
import backIcon from "../assets/back_arrow.svg";
import errorIcon from "../assets/close_circle.svg";

export default function VerifyIdentity() {
  return (
    <div className="min-h-screen w-screen bg-white relative">
      {/* Header Section - Responsive */}
      <header className="w-full px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32">
        {/* Logo and Back Arrow Row */}
        <div className="flex items-center pt-[4.2rem] pb-4">
          <img
            src={backIcon}
            alt="Back"
            className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer mr-4"
          />
          <img
            src={logo}
            alt="FIXION Logo"
            className="w-auto h-auto max-w-[100px] sm:max-w-[120px] lg:max-w-[140px]"
          />
        </div>

        {/* Title and Subtitle - Responsive */}
        <div className="text-center max-w-[603px] mx-auto mt-8 sm:mt-12 md:mt-16">
          <h1 className="text-[20px] sm:text-[22px] md:text-[24px] leading-[28px] sm:leading-[30px] md:leading-[32px] font-semibold text-[#1A1A1A] mb-6 sm:mb-8 md:mb-12">
            Verify Your Identity
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] px-4">
            Please upload a clear photo of your valid National ID Card
          </p>
        </div>
      </header>

      {/* Rest of the content - Responsive */}
      <main className="flex flex-col items-center justify-center px-4 pt-8 sm:pt-12 md:pt-16 sm:px-6 md:px-8">
        {/* Upload box - Responsive */}
        <div className="mt-8 w-full max-w-[400px] h-[180px] sm:h-[200px] md:h-[220px] border-2 border-dashed rounded-[12px] border-red-400/70 flex items-center justify-center mx-auto">
          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full border-2 flex items-center justify-center">
            <img src={errorIcon} alt="Error" className="w-6 h-6 sm:w-6 sm:h-6 md:w-7 md:h-7" />
          </div>
        </div>

        {/* Error helper text - Responsive */}
        <p className="mt-2 text-[10px] sm:text-[11px] text-red-500 text-center px-4">
          The file type isn&apos;t supported. Please upload a JPG, PNG, or PDF.
        </p>

        {/* Buttons - Responsive */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full">
          <button 
            className="w-full sm:w-auto px-5 py-2 rounded-full text-white text-sm"
            style={{ backgroundColor: '#050150' }}
          >
            Cancel
          </button>
          <button
            className="w-full sm:w-auto px-5 py-2 rounded-full text-white text-sm"
            style={{ backgroundColor: '#9CA3AF' }}
            aria-disabled="true"
          >
            Upload
          </button>
        </div>
      </main>
    </div>
  );
}
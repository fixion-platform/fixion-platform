import React from 'react';

import logo from "../assets/fixion_for_error.svg";
import backIcon from "../assets/back_arrow.svg";
import errorIcon from "../assets/close_circle.svg";

export default function VerifyIdentity() {
  return (
    <div className="w-screen h-screen bg-white relative">

      {/* FIXION Logo */}
      <img
        src={logo}
        alt="FIXION Logo"
        style={{
          position: 'absolute',
          top: '67px',
          left: '32px',
          width: 'auto',
          height: 'auto',
          maxWidth: '140px',
        }}
      />

      {/* Back Arrow */}
      <img
        src={backIcon}
        alt="Back"
        style={{
          position: 'absolute',
          top: '113px',
          left: '149px',
          width: '24px',
          height: '24px',
          cursor: 'pointer',
        }}
      />

      {/* Verify Your Identity Div */}
      <div
        style={{
          position: 'absolute',
          top: '113px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '603px',
          textAlign: 'center',
        }}
      >
        <h1 style={{ fontSize: '40px', fontWeight: '600', color: '#1A1A1A' }}>
          Verify Your Identity
        </h1>
      </div>

      {/* Subtitle */}
      <p
        style={{
          position: 'absolute',
          top: '203px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '603px',
          fontSize: '16px',
          color: '#6B7280',
          textAlign: 'center',
        }}
      >
        Please upload a clear photo of your valid National ID Card
      </p>

      {/* Upload Box */}
      <div
        style={{
          position: 'absolute',
          top: '203px', // subtitle top
          left: '50%',
          transform: 'translateX(-50%)',
          width: '400px',
          height: '220px',
          marginTop: '80px', // spacing from subtitle
          border: '2px dashed rgba(239, 68, 68, 0.7)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* X Icon inside Upload Box */}
        <img
          src={errorIcon}
          alt="X Icon"
          style={{
            position: 'absolute',
            top: '105px',
            left: '181px',
            width: '28px',
            height: '28px',
          }}
        />
      </div>

      {/* Error Helper Text */}
      <p
        style={{
          position: 'absolute',
          top: '203px', // subtitle top
          left: '50%',
          transform: 'translateX(-50%)',
          width: '400px',
          marginTop: '300px', // 80px below upload box (220px + 80px)
          fontSize: '11px',
          color: 'red',
          textAlign: 'center',
        }}
      >
        The file type isn&apos;t supported. Please upload a JPG, PNG, or PDF.
      </p>

      {/* Buttons */}
      <div
        style={{
          position: 'absolute',
          top: '203px', // subtitle top
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '16px',
          marginTop: '400px', // upload box + error text + 80px spacing
        }}
      >
        <button
          style={{
            padding: '8px 20px',
            borderRadius: '9999px',
            backgroundColor: '#050150',
            color: 'white',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
        <button
          style={{
            padding: '8px 20px',
            borderRadius: '9999px',
            backgroundColor: '#9CA3AF',
            color: 'white',
            fontSize: '14px',
            cursor: 'not-allowed',
          }}
          disabled
        >
          Upload
        </button>
      </div>
    </div>
  );
}

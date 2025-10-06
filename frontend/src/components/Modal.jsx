import React from 'react';
import { useState } from 'react';
import logo from '../assets/images/fixion-log.svg';
import closeSquare from '../assets/icons/close-square.svg';
import image from '../assets/images/c712ecef6662622c4f540ce7b8a4cdb9d2a508fc.png';

const Modal = ({ isOpen, onClose }) => {
  const [selectedRole, setSelectedRole] = useState('artisan'); // default selection

    if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-50 px-4">
      <div className="bg-white rounded-xl w-full max-w-3xl p-6 relative font-poppins">
        {/* Close button */}
        <button onClick={onClose} className="absolute top-6 right-6">
          <img src={closeSquare} alt="Close" className="w-5 h-5" />
        </button>

        {/* Logo */}
        <img src={logo} alt="Fixion Logo" className="mb-6 w-[100px]" />

        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-10">
          Join as a client or artisan
        </h2>

        {/* Role Selection Cards */}
        <div className="flex justify-center gap-6 flex-wrap">
          {/* Client Card */}
          <div
            onClick={() => setSelectedRole('client')}
            className={`w-[250px] p-5 rounded-xl border transition cursor-pointer ${
              selectedRole === 'client' ? 'border-[#0A0159]' : 'border-gray-300'
            }`}
          >
            <div className="flex justify-between mb-4">
              <img src={image} alt="Client Preview" className="w-10 h-10" />
              <div
                className={`w-5 h-5 rounded-full border ${
                  selectedRole === 'client'
                    ? 'border-[#0A0159] bg-[#0A0159]'
                    : 'border-gray-400'
                }`}
              >
                {selectedRole === 'client' && (
                  <div className="w-2 h-2 bg-white rounded-full m-auto mt-[5px]"></div>
                )}
              </div>
            </div>
            <p className="font-bold text-gray-900 leading-tight">
              I’m a client, hiring <br /> for a service
            </p>
          </div>

          {/* Artisan Card */}
          <div
            onClick={() => setSelectedRole('artisan')}
            className={`w-[250px] p-5 rounded-xl border transition cursor-pointer ${
              selectedRole === 'artisan' ? 'border-[#0A0159]' : 'border-gray-300'
            }`}
          >
            <div className="flex justify-between mb-4">
              <img src={image} alt="Artisan Preview" className="w-10 h-10" />
              <div
                className={`w-5 h-5 rounded-full border ${
                  selectedRole === 'artisan'
                    ? 'border-[#0A0159] bg-[#0A0159]'
                    : 'border-gray-400'
                }`}
              >
                {selectedRole === 'artisan' && (
                  <div className="w-2 h-2 bg-white rounded-full m-auto mt-[5px]"></div>
                )}
              </div>
            </div>
            <p className="font-bold text-gray-900 leading-tight">
              I’m an artisan, <br /> looking for work
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-10">
          <button className="bg-[#0A0159] text-white px-10 py-3 rounded-2xl font-medium">
            Create Account
          </button>
        </div>

        {/* Login prompt */}
        <p className="text-center mt-6 text-sm text-gray-700">
          Already have an account? <span className="font-bold">Login</span>
        </p>
      </div>
    </div>
  );
};



export default Modal

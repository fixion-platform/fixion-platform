import React, { useState } from "react";
import { useEffect, useRef } from "react";
import checkIcon from "../assets/tick_circle.svg";
import SetPricingModal from "../components/SetPricingModal";

export default function JobAcceptedModal({ open, onClose, onSetPricing }) {
  const modalRef = useRef(null);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);

  // Close modal when pressing Escape key
  useEffect(() => {
    function handleEscapeKey(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (open) {
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-50"
        style={{
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          backgroundColor: 'rgba(255, 255, 255, 0.1)'
        }}
      />
      
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          ref={modalRef}
          className="bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 overflow-hidden transform transition-all pointer-events-auto"
          style={{ 
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)',
            filter: 'none !important', 
            backdropFilter: 'none !important' 
          }}
        >
          {/* Modal Content */}
          <div className="px-8 py-10 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
                <img
                  src={checkIcon}
                  alt="Job Accepted"
                  className="w-10 h-10"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'block';
                  }}
                />
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{ display: 'none' }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Job accepted
            </h2>

          

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
              >
                Back
              </button>
              <button
                onClick={onSetPricing}
                className="flex-1 px-4 py-3 bg-[#050150] text-white rounded-lg hover:bg-[#030112] transition-colors font-medium text-sm"
              >
                Set Pricing
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
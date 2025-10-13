import { useEffect, useRef, useState } from "react";

export default function SetPricingModal({ open, onClose, onSubmitPrice }) {
  const modalRef = useRef(null);
  const [price, setPrice] = useState("");

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

  // Prevent background scroll when modal is open
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

  // Reset price when modal opens
  useEffect(() => {
    if (open) {
      setPrice("");
    }
  }, [open]);

  // Handle price input - only allow numbers and format with commas
  const handlePriceChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    setPrice(value);
  };

  // Format price with commas for display
  const formatPrice = (value) => {
    if (!value) return "";
    return Number(value).toLocaleString();
  };

  // Handle submit
  const handleSubmit = () => {
    if (price && Number(price) > 0) {
      onSubmitPrice(Number(price));
      onClose();
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop with blur effect */}
      <div 
        className="fixed inset-0 z-50"
        style={{
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          backgroundColor: 'rgba(255, 255, 255, 0.1)'
        }}
      />
      
      {/* Modal positioned separately to avoid blur inheritance */}
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
            {/* Price Display/Input */}
            <div className="mb-8">
              <div className="relative">
                <span className="text-5xl font-bold text-gray-900">
                  ₦
                </span>
                <input
                  type="text"
                  value={formatPrice(price)}
                  onChange={handlePriceChange}
                  placeholder="0.00"
                  className="text-5xl font-bold text-gray-900 text-center w-full outline-none border-none bg-transparent"
                  style={{ 
                    caretColor: '#050150',
                    fontVariantNumeric: 'tabular-nums'
                  }}
                  autoFocus
                />
              </div>
              
              {/* Helper text */}
              <p className="text-sm text-gray-500 mt-4">
                Enter your price for this job
              </p>
            </div>

            {/* Set Pricing Button */}
            <button
              onClick={handleSubmit}
              disabled={!price || Number(price) === 0}
              className={`w-full px-6 py-3 rounded-lg font-medium text-sm transition-colors ${
                price && Number(price) > 0
                  ? 'bg-[#050150] text-white hover:bg-[#030112]'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Set Pricing
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
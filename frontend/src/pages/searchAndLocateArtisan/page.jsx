import React, { useState } from 'react';

export default function ServicePreferences() {
  const [selectedServices, setSelectedServices] = useState({
    'electrical-repairs': false,
    'plumbing': true,
    'ac-installation': false,
    'general-handyman': false,
    'painting-renovation': false,
    'home-cleaning': true,
    'pest-control': false,
    'carpentry-furniture': false,
    'house-moving': false,
    'hairdressing': false,
    'haircut': true,
    'salon-services': false,
    'laundry-ironing': false,
    'relaxing-spa': false,
    'shave-trimming': false,
    'spa-massage': false,
    'makeup-styling': false,
    'phone-repairs': false,
    'laptop-repairs': false,
    'tv-electronics': false,
    'water-purifier': false,
    'car-bike-repairs': false,
    'solar-installation': true,
    'water-installation': true,
    'others': true
  });

  const toggleService = (key) => {
    setSelectedServices(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const ServiceCheckbox = ({ id, label, checked }) => (
    <label className="flex items-center gap-2.5 p-2.5 border border-gray-300 rounded-md cursor-pointer hover:border-gray-400 transition-colors bg-white">
      <div className="relative flex items-center flex-shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={() => toggleService(id)}
          className="w-4 h-4 border-2 border-gray-400 rounded appearance-none cursor-pointer checked:bg-black checked:border-black"
        />
        {checked && (
          <svg className="absolute w-2.5 h-2.5 text-white pointer-events-none left-0.5 top-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      <span className="text-sm text-gray-800 select-none">{label}</span>
    </label>
  );

  const homeServices = [
    { id: 'electrical-repairs', label: 'Electrical Repairs' },
    { id: 'plumbing', label: 'Plumbing' },
    { id: 'ac-installation', label: 'AC Installation & Repair' },
    { id: 'general-handyman', label: 'General Handyman' },
    { id: 'painting-renovation', label: 'Painting & Renovation' },
    { id: 'home-cleaning', label: 'Home Cleaning' },
    { id: 'pest-control', label: 'Pest Control' },
    { id: 'carpentry-furniture', label: 'Carpentry & Furniture Repairs' },
    { id: 'house-moving', label: 'House Moving & Packing' }
  ];

  const personalCare = [
    { id: 'hairdressing', label: 'Hairdressing' },
    { id: 'haircut', label: 'Haircut' },
    { id: 'salon-services', label: 'Salon spa Services' },
    { id: 'laundry-ironing', label: 'Laundry & Ironing' },
    { id: 'relaxing-spa', label: 'Relaxing & Spa/SPA' },
    { id: 'shave-trimming', label: 'Shave & Shag Repairs' },
    { id: 'spa-massage', label: 'Spa & Massage' },
    { id: 'makeup-styling', label: 'Makeup & Styling' }
  ];

  const repairsMaintenance = [
    { id: 'phone-repairs', label: 'Phone Repairs' },
    { id: 'laptop-repairs', label: 'Laptop Repairs' },
    { id: 'tv-electronics', label: 'TV & Electronics Repairs' },
    { id: 'water-purifier', label: 'Water Purifier Sales & Repair' },
    { id: 'car-bike-repairs', label: 'Car Wash & Car Repairs' },
    { id: 'solar-installation', label: 'Solar Installation & Maintenance' },
    { id: 'water-installation', label: 'Water Installation & Maintenance' },
    { id: 'others', label: 'Others' }
  ];

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <button className="text-gray-600 hover:text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-lg">←</span>
            <span className="text-sm">Skip</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-3">Set Your Preferences</h1>
          <p className="text-center text-gray-600 text-sm max-w-md mx-auto">
            Let's know the services you use most often, so we can connect you to trusted officers — fast!
          </p>
        </div>

        {/* Three Column Layout */}
        <div className="flex gap-6 mb-8">
          {/* Column 1: Home Services */}
          <div className="flex-1">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Home Services</h3>
            <div className="space-y-2.5">
              {homeServices.map(service => (
                <ServiceCheckbox
                  key={service.id}
                  id={service.id}
                  label={service.label}
                  checked={selectedServices[service.id]}
                />
              ))}
            </div>
          </div>

          {/* Column 2: Personal Care */}
          <div className="flex-1">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Personal Care</h3>
            <div className="space-y-2.5">
              {personalCare.map(service => (
                <ServiceCheckbox
                  key={service.id}
                  id={service.id}
                  label={service.label}
                  checked={selectedServices[service.id]}
                />
              ))}
            </div>
          </div>

          {/* Column 3: Repairs & Maintenance */}
          <div className="flex-1">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Repairs & Maintenance</h3>
            <div className="space-y-2.5">
              {repairsMaintenance.map(service => (
                <ServiceCheckbox
                  key={service.id}
                  id={service.id}
                  label={service.label}
                  checked={selectedServices[service.id]}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="text-center space-y-3">
          <button className="bg-indigo-950 text-white px-16 py-3.5 rounded-full font-medium hover:bg-indigo-900 transition-colors text-sm">
            Next & Continue
          </button>
          <p className="text-xs text-gray-500">
            You can always update preferences to improve your match
          </p>
        </div>
      </div>
    </div>
  );
}
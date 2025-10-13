import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import referencePhoto1 from "../assets/rp1.png";
import referencePhoto2 from "../assets/rp2.png";
import referencePhoto3 from "../assets/rp3.png";
import referencePhoto4 from "../assets/rp4.png";

export default function ConfirmBookingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [jobData, setJobData] = useState(null);

  const referencePhotos = [
    referencePhoto1,
    referencePhoto2,
    referencePhoto3,
    referencePhoto4
  ];

  useEffect(() => {
    if (location.state?.jobData) {
      setJobData(location.state.jobData);
    } else {
      setJobData({
        clientName: "Richie Ryan",
        clientPhone: "+234 804 567 8901",
        clientProfile: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
        timeAgo: "10 mins ago",
        date: "Thursday 28, 2025",
        jobTitle: "Studio Wiring Project",
        location: "7 Looney Lane, Aberdeen.",
        description: "I need you to wire a small recording/production studio space. The job involves setting up audio, electrical and data cables neatly and professionally — including connecting mixers, speakers, microphones, power outlets, patch panels and network points. You must ensure clean signal flow, proper labeling, cable management (trunking/ties), and a tidy finish. Experience with studio or audiovisual installations is required.",
        rating: 3,
        price: 250000.00,
        referencePhotos: referencePhotos,
        progress: {
          enrolled: true,
          arrived: true,
          completed: false
        }
      });
    }
  }, [location.state]);

  const handleConfirmBooking = () => {
    alert('Booking confirmed!');
    navigate('/dashboard');
  };

  if (!jobData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#050150] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Go back"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Client Info Section */}
        <div className="px-6 py-6 border-b border-gray-100">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={jobData.clientProfile}
              alt={jobData.clientName}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">{jobData.clientName}</h2>
              <p className="text-gray-600">{jobData.clientPhone}</p>
              <p className="text-sm text-gray-500">{jobData.timeAgo} • {jobData.date}</p>
            </div>
            {/* Star Rating */}
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, index) => (
                <svg
                  key={index}
                  className={`w-5 h-5 ${
                    index < (jobData.rating || 0)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
        </div>

        {/* Job Information */}
        <div className="px-6 py-6 space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Job Details</h3>

          {/* Job Title & Location */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Job Title:</h3>
              <p className="text-gray-700">{jobData.jobTitle}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Location:</h3>
              <p className="text-gray-700">{jobData.location}</p>
            </div>
          </div>

          {/* Job Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h3>
            <p className="text-gray-700 leading-relaxed">{jobData.description}</p>
          </div>

          {/* Reference Photos */}
          {jobData.referencePhotos && jobData.referencePhotos.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Reference Photos</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {jobData.referencePhotos.map((photo, index) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden group">
                    <img
                      src={photo}
                      alt={`Reference photo ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform cursor-pointer"
                      onClick={() => window.open(photo, '_blank')}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Pricing</h3>
          
          {/* Price Display */}
          <div className="bg-gray-50 rounded-lg p-6 text-center mb-4">
            <p className="text-sm text-gray-600 mb-2">Total Estimate</p>
            <p className="text-4xl font-bold text-green-600">
              {jobData.price ? jobData.price.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
            </p>
          </div>

          {/* Confirm Booking Button */}
          <button
            onClick={handleConfirmBooking}
            className="w-full px-6 py-3 bg-[#050150] text-white rounded-lg hover:bg-[#030112] transition-colors font-medium"
          >
            Confirm Booking
          </button>
        </div>
      </div>

      {/* Progress Tracker Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Progress Tracker</h3>
          
          <div className="flex items-center justify-around">
            {/* Enrolled */}
            <div className="flex flex-col items-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-colors ${
                jobData.progress?.enrolled 
                  ? 'bg-green-500' 
                  : 'bg-gray-200'
              }`}>
                {jobData.progress?.enrolled && (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <p className={`text-sm font-medium ${
                jobData.progress?.enrolled ? 'text-gray-900' : 'text-gray-400'
              }`}>
                Enrolled
              </p>
            </div>

            {/* Arrived */}
            <div className="flex flex-col items-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-colors ${
                jobData.progress?.arrived 
                  ? 'bg-green-500' 
                  : 'bg-gray-200'
              }`}>
                {jobData.progress?.arrived && (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <p className={`text-sm font-medium ${
                jobData.progress?.arrived ? 'text-gray-900' : 'text-gray-400'
              }`}>
                Arrived
              </p>
            </div>

            {/* Completed */}
            <div className="flex flex-col items-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-colors ${
                jobData.progress?.completed 
                  ? 'bg-green-500' 
                  : 'bg-gray-200'
              }`}>
                {jobData.progress?.completed && (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <p className={`text-sm font-medium ${
                jobData.progress?.completed ? 'text-gray-900' : 'text-gray-400'
              }`}>
                Completed
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
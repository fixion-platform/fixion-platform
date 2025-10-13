import { useState, useEffect } from "react";
import { FaStar, FaRegStar, FaUpload, FaArrowLeft } from "react-icons/fa";
import { IoChatbubblesOutline } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";

export default function BookingSummary() {
  const navigate = useNavigate();
  const location = useLocation();

  const bookingData = location.state || {
    jobTitle: "Sample Wiring Project",
    address: "123 Main Street, Lagos",
    description: "Sample description for electrical work...",
    fileName: null,
    filePreview: null,
  };

  const [uploadProgress] = useState(100);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const generateJobId = () => {
    return `#${Math.floor(Math.random() * 100000000)
      .toString()
      .padStart(8, "0")}`;
  };

  const [jobId, setJobId] = useState(""); // Removed <string> type

  useEffect(() => {
    const storedJobId = localStorage.getItem("jobId");
    if (storedJobId) {
      setJobId(storedJobId);
    } else {
      const newJobId = generateJobId();
      localStorage.setItem("jobId", newJobId);
      setJobId(newJobId);
    }
  }, []);

  const [createdDate] = useState(
    new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  );

  const handleBack = () => {
    navigate(-1);
  };

  const handleConfirmBooking = () => {
    setBookingConfirmed(true);
  };

  const handleEditJob = () => {
    navigate("/booking", {
      state: {
        jobTitle: bookingData.jobTitle,
        address: bookingData.address,
        description: bookingData.description,
        fileName: bookingData.fileName,
      },
    });
  };

  const handleCancelJob = () => {
    if (window.confirm("Are you sure you want to cancel this job?")) {
      alert("Job cancelled successfully!");
      localStorage.removeItem("jobId");
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-[1200px] m-auto">
        {/* Header with Back Arrow */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={handleBack}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            <FaArrowLeft className="text-xl" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">Job Details</h1>
        </div>

        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-4">
          <span className="cursor-pointer hover:underline">Find Artisans</span>
          {" > "}
          <span className="cursor-pointer hover:underline">Artisan</span>
          {" > "}
          <span className="font-semibold">Job Details</span>
        </div>

        {/* Artisan Card */}
        <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="artisan"
              className="sm:w-14 w-10 h-10 sm:h-14 rounded-full object-cover"
            />
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-gray-800">
                Mark Devon
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">Electrician</p>
              <div className="flex items-center text-yellow-500 mt-1">
                <FaStar className="text-sm sm:text-base" />
                <FaStar className="text-sm sm:text-base" />
                <FaStar className="text-sm sm:text-base" />
                <FaStar className="text-sm sm:text-base" />
                <FaRegStar className="text-sm sm:text-base" />
                <span className="text-gray-600 text-sm ml-1">(4.0)</span>
              </div>
              <p className="text-green-600 text-xs sm:text-sm">
                72 Completed Jobs
              </p>
              <p className="text-gray-800 text-xs sm:text-sm">
                7 Years Experience
              </p>
            </div>
          </div>
          <div className="w-[40px] h-[40px] sm:w-[60px] sm:h-[60px] flex items-center justify-center bg-[#050150] rounded-full cursor-pointer hover:bg-[#040140] transition-colors">
            <IoChatbubblesOutline className="text-xl sm:text-3xl text-white" />
          </div>
        </div>

        {/* Job Details Section */}
        <div>
          <h3 className="font-semibold text-lg text-gray-800 mb-4">Job Details</h3>
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="space-y-3">
              <div className="py-1">
                <h4 className="text-gray-800 font-semibold text-base">
                  {bookingData.jobTitle || "Studio Wiring Project"}
                </h4>
              </div>
              <div className="py-1">
                <span className="text-gray-800 text-sm">Job ID: {jobId}</span>
              </div>
              <div className="py-1">
                <span className="text-gray-800 text-sm">Date Created: {createdDate}</span>
              </div>
              <div className="py-1">
                <span className="text-gray-800 text-sm">
                  Location: {bookingData.address || "7 Looney Lane, Aberdeen"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Job Description Section */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h3 className="font-semibold text-lg text-gray-800 mb-4">Job Description</h3>
          <div className="text-gray-700 text-sm leading-relaxed">
            {bookingData.description ? (
              <p>{bookingData.description}</p>
            ) : (
              <p className="text-gray-500 italic">No description provided</p>
            )}
          </div>
        </div>

        {/* Reference Photo Section */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h3 className="font-semibold text-lg text-gray-800 mb-4">Reference Photo (Optional)</h3>

          {bookingData.fileName ? (
            <div className="bg-gray-50 border rounded-lg p-4">
              {bookingData.filePreview && (
                <img
                  src={bookingData.filePreview}
                  alt="Reference"
                  className="w-32 h-32 object-cover rounded-md mb-3"
                />
              )}

              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FaUpload className="text-purple-600 text-xl" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800 mb-1">{bookingData.fileName}</p>
                  <p className="text-sm text-gray-500">Uploaded file</p>
                </div>
              </div>

              <div className="w-full">
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <span className="text-green-500">✓</span> Upload Successful
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border-2 border-dashed rounded-lg p-8 text-center">
              <FaUpload className="mx-auto text-3xl text-gray-400 mb-2" />
              <p className="text-gray-500">No reference photo uploaded</p>
            </div>
          )}
        </div>

        {/* Action Buttons or Progress Tracker */}
        {!bookingConfirmed ? (
          <div className="flex justify-center mt-6">
            <button
              onClick={handleConfirmBooking}
              className="bg-[#050150] text-white py-2 px-16 rounded-3xl cursor-pointer hover:bg-[#040140] transition-colors"
            >
              Confirm Booking
            </button>
          </div>
        ) : (
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="font-semibold text-lg text-gray-800 mb-6">Progress Tracker</h3>

              <div className="flex max-w-[400px] items-center justify-between mb-8">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-2">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-gray-800">Confirmed</span>
                </div>

                <div className="flex-1 h-0.5 bg-gray-300 "></div>

                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 border-2 border-gray-300 rounded-full flex items-center justify-center mb-2 bg-white"></div>
                  <span className="text-xs sm:text-sm text-gray-500">In Progress</span>
                </div>

                <div className="flex-1 h-0.5 ">
                  <div className="h-full border-t-2 border-gray-300"></div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 border-2 border-gray-300 rounded-full flex items-center justify-center mb-2 bg-white"></div>
                  <span className="text-xs sm:text-sm text-gray-500">Completed</span>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleEditJob}
                  className="bg-gray-100 border border-gray-300 text-gray-700 text-xs sm:text-sm py-2 px-8 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Edit Job
                </button>
                <button
                  onClick={handleCancelJob}
                  className="bg-[#1a1a2e] text-white text-xs sm:text-sm py-2 px-8 rounded-lg font-medium hover:bg-[#16213e] transition-colors"
                >
                  Cancel Job
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

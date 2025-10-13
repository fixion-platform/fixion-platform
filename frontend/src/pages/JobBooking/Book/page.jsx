import React, { useRef, useState, useEffect } from "react";
import { FaStar, FaRegStar, FaUpload, FaTrash } from "react-icons/fa";
import { IoChatbubblesOutline } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";

export default function Booking() {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploaded, setUploaded] = useState(false);

  const [formData, setFormData] = useState({
    jobTitle: "",
    address: "",
    description: "",
  });

  useEffect(() => {
    if (location.state) {
      const { jobTitle, address, description, fileName } = location.state;

      if (jobTitle || address || description) {
        setFormData({
          jobTitle: jobTitle || "",
          address: address || "",
          description: description || "",
        });
      }

      if (fileName) {
        setUploaded(true);
        setProgress(100);
      }
    }
  }, [location.state]);

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setUploaded(false);
      setProgress(0);

      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setUploaded(true);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setProgress(0);
    setUploaded(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/booking-summary", {
      state: {
        ...formData,
        fileName: file?.name || (location.state?.fileName || null),
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <form onSubmit={handleSubmit}>
        <div className="max-w-[1200px] m-auto">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-500 mb-4">
            <span className="cursor-pointer hover:underline">Find Artisans</span>{" > "}
            <span className="cursor-pointer hover:underline">Artisan</span>{" > "}
            <span className="font-semibold">Job Details</span>
          </div>

          {/* Artisan Card */}
          <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between mb-6">
            <div className="flex items-cente gap-4">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="artisan"
                className="sm:w-14 w-10 h-10 sm:h-14 rounded-full object-cover"
              />
              <div>
                <h2 className=" text-sm sm:text-base font-semibold text-gray-800">
                  Mark Devon
                </h2>
                <p className=" text-xs sm:text-sm text-gray-500">Electrician</p>
                <div className="flex items-center text-yellow-500 mt-1">
                  <FaStar className=" text-sm sm:text-base" />
                  <FaStar className=" text-sm sm:text-base" />
                  <FaStar className=" text-sm sm:text-base" />
                  <FaStar className=" text-sm sm:text-base" />
                  <FaRegStar className=" text-sm sm:text-base" />
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
            <div className=" w-[40px] h-[40px] sm:w-[60px] sm:h-[60px] flex items-center justify-center bg-[#050150]">
              <IoChatbubblesOutline className=" text-xl sm:text-3xl text-white" />
            </div>
          </div>

          {/* Job Details */}
          <div>
            <h3 className="font-semibold text-lg text-gray-800 mb-3">
              Job Details
            </h3>
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <div className="flex flex-col gap-3">
                <div className=" w-full">
                  <label>Job Title</label>
                  <br />
                  <input
                    required
                    type="text"
                    name="jobTitle"
                    placeholder="e.g. wiring"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    className="border w-full mt-2 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className=" w-full">
                  <label>Location</label>
                  <br />
                  <input
                    required
                    type="text"
                    name="address"
                    placeholder="e.g. 2 Land Avenue, NY"
                    value={formData.address}
                    onChange={handleChange}
                    className="border w-full mt-2 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold text-lg text-gray-800 mb-3">
              Job Description
            </h3>
            <textarea
              required
              name="description"
              rows={5}
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
            />

            {!file && !uploaded ? (
              <div className="border-2 border-dashed rounded-lg p-6 text-center text-gray-500">
                <FaUpload
                  onClick={handleChooseFile}
                  className="mx-auto text-3xl cursor-pointer text-indigo-600 mb-2"
                />
                <p className="font-medium">Upload Photo</p>
                <p className="text-sm">
                  Drag and drop your files here or{" "}
                  <span
                    className="text-green-600 cursor-pointer"
                    onClick={handleChooseFile}
                  >
                    choose file
                  </span>
                </p>
                <p className="text-xs mt-1 text-gray-400">
                  JPEG, PNG, SVG and ZIP formats, up to 20MB
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".jpeg,.png,.svg,.zip"
                  onChange={handleFileChange}
                />
              </div>
            ) : (
              <div className="bg-white border rounded-lg p-4 shadow w-full">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <FaUpload className="text-indigo-600 text-xl" />
                    <p className=" text-xs md:text-sm font-medium truncate max-w-[120px] sm:max-w-[300px] md:max-w-[400px]">
                      {file?.name || location.state?.fileName || "Previously uploaded file"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="text-gray-500 hover:text-red-600"
                  >
                    <FaTrash />
                  </button>
                </div>

                <div className="w-full">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs pt-2 text-gray-500 ">
                    {uploaded ? "Upload Successful" : "Uploading..."}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className=" flex justify-center mt-6">
            <button
              type="submit"
              className=" bg-[#050150] text-white py-2 px-16 rounded-3xl cursor-pointer"
            >
              Book
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

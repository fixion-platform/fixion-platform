import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import profile1 from "../assets/image.png";
import project1 from "../assets/image 27.png";
import project2 from "../assets/image 28.png";
import project3 from "../assets/image 29.png";

export default function AccountDetailsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showAllProjects, setShowAllProjects] = useState(false);

  const artisan = location.state?.artisan || {
    name: "Sharon Yakub",
    profession: "Electrician",
    profileImage: profile1,
    rating: 4.8,
    reviews: 124,
    isOnline: true,
    bio: "Reliable and efficient electrical solutions — done right the first time. You'll always come back for more!",
    experience: "2 years",
    languages: "English, Yoruba",
    location: "Lekki, Full House Repair",
    recentProjects: [
      {
        id: 1,
        title: "Faulty Switch Replacement",
        image: project1,
        category: "Troubleshooting"
      },
      {
        id: 2,
        title: "Full Apartment Rewiring",
        image: project2,
        category: "Wiring & Repairs"
      },
      {
        id: 3,
        title: "LED Ceiling Lighting",
        image: project3,
        category: "Lighting Installation"
      }
    ],
    reviews: [
      {
        id: 1,
        reviewer: "Anike o.",
        rating: 5,
        date: "2 weeks ago",
        comment: "Fast, professional and friendly. She fixed my apartment's wiring and even explained how to prevent future issues. Highly recommend!"
      },
      {
        id: 2,
        reviewer: "Tunde A.",
        rating: 5,
        date: "1 month ago",
        comment: "Arrived right on time, did a neat job Installing my LED lighting in my shop. Will definitely book again!"
      },
      {
        id: 3,
        reviewer: "Funke A.",
        rating: 5,
        date: "2 months ago",
        comment: "Sharon was amazing! She diagnosed and fixed a tricky electrical fault that others couldn't figure out. Very knowledgeable and friendly."
      }
    ]
  };

  const handleRequestService = () => {
    navigate('/request-service', { state: { artisan } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-semibold text-gray-900 mt-4">Profile Details</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col items-center text-center mb-6">
            {/* Profile Image with Online Status */}
            <div className="relative mb-4">
              <img
                src={artisan.profileImage}
                alt={artisan.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
              {artisan.isOnline && (
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></div>
              )}
            </div>

            {/* Name and Profession */}
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {artisan.name}
            </h2>
            <p className="text-gray-600 mb-3">{artisan.profession}</p>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, index) => (
                  <svg
                    key={index}
                    className={`w-5 h-5 ${
                      index < Math.floor(artisan.rating)
                        ? "text-yellow-400 fill-current"
                        : index < artisan.rating
                        ? "text-yellow-400 fill-current opacity-50"
                        : "text-gray-300"
                    }`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {artisan.rating} ({artisan.reviews.length} reviews)
              </span>

            </div>
          </div>

          {/* Bio Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Bio</h3>
            <p className="text-gray-700 leading-relaxed">{artisan.bio}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 border-t border-gray-100">
            <div>
              <p className="text-sm text-gray-600 mb-1">Experience</p>
              <p className="font-medium text-gray-900">{artisan.experience}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Languages</p>
              <p className="font-medium text-gray-900">{artisan.languages}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Location</p>
              <p className="font-medium text-gray-900">{artisan.location}</p>
            </div>
          </div>
        </div>

        {/* Recent Projects Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Projects</h3>
            <button
              onClick={() => setShowAllProjects(!showAllProjects)}
              className="text-sm text-[#050150] hover:text-[#030112] font-medium"
            >
              See all →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {artisan.recentProjects.map((project) => (
              <div
                key={project.id}
                className="relative rounded-lg overflow-hidden group cursor-pointer"
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                  <div>
                    <p className="text-white font-semibold text-sm">{project.title}</p>
                    <p className="text-white/80 text-xs">{project.category}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Reviews</h3>

          <div className="space-y-4">
            {artisan.reviews.map((review) => (
              <div key={review.id} className="pb-4 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-gray-600">
                      {review.reviewer.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{review.reviewer}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, index) => (
                          <svg
                            key={index}
                            className={`w-4 h-4 ${
                              index < review.rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">{review.date}</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed ml-13">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Request Service Button */}
        <button
          onClick={handleRequestService}
          className="w-full px-6 py-4 bg-[#050150] text-white rounded-lg hover:bg-[#030112] transition-colors font-semibold text-lg"
        >
          Request Service
        </button>
      </div>
    </div>
  );
}
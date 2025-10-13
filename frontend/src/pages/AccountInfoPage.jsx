import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AccountInfoPage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("Lagos");
  const [priceRange, setPriceRange] = useState("All");
  const [sortBy, setSortBy] = useState("");

  // Sample artisans data
  const artisans = [
    {
      id: 1,
      name: "Sharon Yakub",
      rating: 4.9,
      reviews: 50,
      skills: ["NECA Certified", "Lekki, Lagos", "Wiring, A.C Installation, Emergency Callout"],
      price: "₦5,000/hr",
      category: "Electrician"
    },
    {
      id: 2,
      name: "Alani Sharon",
      rating: 3.6,
      reviews: 30,
      skills: ["Lagos State Licensed", "Victoria Island, Lagos", "Furniture Making, Cabinet Installation, Repairs"],
      price: "₦7,500/hr",
      category: "Outdoor Expert"
    },
    {
      id: 3,
      name: "Chidi Ogoji",
      rating: 4.6,
      reviews: 84,
      skills: ["Interior/Exterior Specialist", "Surulere, Lagos", "Interior Painting, Wall Design, Outdoor Finishing"],
      price: "₦10,000/job",
      category: "Carpenter"
    },
    {
      id: 4,
      name: "Bimbo Ojo",
      rating: 4.8,
      reviews: 65,
      skills: ["Fashion Design Graduate", "Yaba, Lagos", "Custom Outfits, Alterations, Bridal Wear"],
      price: "₦100,000/outfit",
      category: "Fashion Designer"
    }
  ];

  const filteredArtisans = artisans;
  const totalPages = 5;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = () => {
    // Implement search logic
    console.log("Searching for:", searchQuery);
  };

  const handleClear = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedLocation("Lagos");
    setPriceRange("All");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            35 Artisans in Lagos
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Find the best verified artisans for your job listing
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#050150] focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#050150] focus:border-transparent"
            >
              <option value="All">All</option>
              <option value="Electrician">Electrician</option>
              <option value="Carpenter">Carpenter</option>
              <option value="Plumber">Plumber</option>
            </select>

            {/* Location Filter */}
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#050150] focus:border-transparent"
            >
              <option value="Lagos">Lagos</option>
              <option value="Abuja">Abuja</option>
              <option value="Port Harcourt">Port Harcourt</option>
            </select>

            {/* Price Filter */}
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#050150] focus:border-transparent"
            >
              <option value="All">Price</option>
              <option value="0-5000">₦0 - ₦5,000</option>
              <option value="5000-10000">₦5,000 - ₦10,000</option>
              <option value="10000+">₦10,000+</option>
            </select>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleSearch}
                className="px-6 py-2 bg-[#050150] text-white rounded-lg hover:bg-[#030112] transition-colors font-medium"
              >
                Search
              </button>
              <button
                onClick={handleClear}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Artisans List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-4">
          {filteredArtisans.map((artisan) => (
            <div
              key={artisan.id}
              className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/artisan/${artisan.id}`)}
            >
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Profile Image */}
                <div className="flex-shrink-0">
                  <img
                    src={artisan.profileImage}
                    alt={artisan.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Name and Rating */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {artisan.name}
                    </h3>
                    <span className="text-lg font-bold text-gray-900 self-start sm:self-auto">
                      {artisan.price}
                    </span>
                  </div>

                  {/* Stars and Reviews */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, index) => (
                        <svg
                          key={index}
                          className={`w-4 h-4 ${
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
                      {artisan.rating} • {artisan.reviews} Reviews
                    </span>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2">
                    {artisan.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center items-center gap-2 mt-8">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                currentPage === index + 1
                  ? "bg-[#050150] text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
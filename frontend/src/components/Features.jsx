import React from "react";
import hiringImg from "../assets/images/hiring-img.png";
import personnelImg from "../assets/images/personnel-img.png";
import chatImg from "../assets/images/chat-img.png";
import boltIcon from "../assets/icons/bolt-icon.svg";
import chatIcon from "../assets/icons/chat-icon.svg";
import verifiedIcon from "../assets/icons/verified-icon.svg";

const Features = () => {
  return (
    <section className="w-full bg-white py-12 px-4 md:px-10 lg:px-16 font-poppins">
      {/* Section Heading */}
      <div className="text-center mb-10">
        <h2 className="text-[24px] md:text-[30px] font-bold text-zinc-900">
          Features Section
        </h2>
        <p className="text-neutral-600 text-sm md:text-base mt-2 max-w-[600px] mx-auto font-medium">
          We’re trusted by local communities, partner hubs, and thousands of skilled workers
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1280px] mx-auto">
        {/* Card 1: Instant Hiring */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3 w-full h-full">
          <img src={hiringImg} alt="Instant Hiring" className="rounded-xl w-full h-[160px] object-cover" />
          <div className="flex items-center gap-2 mt-2">
            <div className="bg-gray-100 p-2 rounded-full">
              <img src={boltIcon} alt="Bolt Icon" className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-900">Instant Hiring</h3>
          </div>
          <p className="text-sm text-neutral-600">
            Quickly find available artisans here and hire with just a few taps
          </p>
        </div>

        {/* Card 2: Verified Personnels */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3 w-full h-full">
          <img src={personnelImg} alt="Verified Personnel" className="rounded-xl w-full h-[160px] object-cover" />
          <div className="flex items-center gap-2 mt-2">
            <div className="bg-gray-100 p-2 rounded-full">
              <img src={verifiedIcon} alt="Verified Icon" className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-900">Verified Personnels</h3>
          </div>
          <p className="text-sm text-neutral-600">
            All artisans are ID, verified and reviewed by real customers
          </p>
        </div>

        {/* Card 3: In-App Chat */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3 w-full h-full">
          <img src={chatImg} alt="In-App Chat" className="rounded-xl w-full h-[160px] object-cover" />
          <div className="flex items-center gap-2 mt-2">
            <div className="bg-gray-100 p-2 rounded-full">
              <img src={chatIcon} alt="Chat Icon" className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-900">In-App Chat</h3>
          </div>
          <p className="text-sm text-neutral-600">
            Easily discuss job details and set your preferred service time.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Features;

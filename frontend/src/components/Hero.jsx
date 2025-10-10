import React from "react";
import artisanImg from "../assets/images/hero-artisan-img.png";
import bgImg from "../assets/images/hero-bg-img.png";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="w-full bg-white font-poppins py-16 px-2 md:px-10">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8 flex flex-col md:flex-row items-center justify-between relative overflow-visible gap-8">
        {/* LEFT TEXT SECTION */}
        <div className="w-full md:w-[55%] text-left flex flex-col gap-6 z-10">
          <div className="text-indigo-900 text-[28px] sm:text-[36px] md:text-[40px] lg:text-[60px] font-bold leading-[1.2]">
            <span className="block">Find and Hire</span>
            <span className="block">Skilled Artisans</span>
            <span className="text-zinc-900 block">
              Anytime,
              <br />
              Anywhere
            </span>
          </div>

          <p className="text-neutral-600 text-[15px] sm:text-[16px] md:text-[17px] lg:text-[19px] font-medium leading-[28px] max-w-[500px]">
            Fixion connects you with <br className="block sm:hidden" /> verified
            artisan–plumbers,
            <br />
            tailors, electricians, and <br className="block sm:hidden" />
            more—right from your phone
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button className="bg-indigo-950 text-white px-6 py-3 rounded-[16px] text-[15px] font-semibold w-full sm:w-[180px]">
              Browse Artisans
            </button>
            {/* <button className="border border-indigo-950 text-indigo-950 px-6 py-3 rounded-[16px] text-[15px] font-semibold w-full sm:w-[180px]">
              Join as Artisan
            </button> */}
            <Link to="/signup-artisan">
              <button className="border border-indigo-950 text-indigo-950 px-6 py-3 rounded-[16px] text-[15px] font-semibold w-full sm:w-[180px]">
                Join as Artisan
              </button>
            </Link>
          </div>
        </div>
        <div className="relative flex justify-center items-center w-full">
          {/* Background Image (angled already in file) */}
          <img
            src={bgImg}
            alt="Background shape"
            className="
              w-[360px] 
              sm:w-[420px] 
              md:w-[500px] 
              lg:w-[600px]  
              z-0
              "
          />

          {/* Foreground Artisan Image */}
          <img
            src={artisanImg}
            alt="Artisan"
            className="absolute 
      w-[210px]   /* ~15% more than 180px */
      sm:w-[250px] /* ~15% more than 220px */
      md:w-[320px] /* ~15% more than 280px */
      lg:w-[370px] /* ~15% more than 320px */
      xl:w-[420px] /* ~15% more than 360px */
      h-auto 
      z-10 "
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;

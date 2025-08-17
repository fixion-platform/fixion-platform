import React from 'react'
import phoneImg from '../assets/icons/how-img.png';
import icon1 from '../assets/icons/icon1-img.svg';
import icon2 from '../assets/icons/icon2-img.svg';
import icon3 from '../assets/icons/icon3-img.svg';
import icon4 from '../assets/icons/ícon4-img.svg';

const How = () => {
  return (
    <section className="w-full bg-white py-16 px-4 md:px-10 font-poppins">
      <div className="max-w-[1280px] mx-auto">
        {/* Section Title */}
        <h2 className="text-center text-zinc-900 font-bold text-2xl sm:text-3xl mb-10">How it Works</h2>

        {/* Desktop/Tablet layout */}
        <div className="hidden md:flex justify-between items-center gap-10">
          {/* Left Image */}
          <div className="flex-1">
            <img src={phoneImg} alt="How it works" className="w-full max-w-[520px] mx-auto" />
          </div>

          {/* Right Steps */}
          <div className="flex-1 flex flex-col gap-6 max-w-[440px] mx-auto">
            {/* Step 1 */}
            <div className="flex gap-4">
              <img src={icon1} alt="Set up profile" className="w-10 h-10 bg-indigo-900 rounded-full p-2" />
              <div>
                <h4 className="font-semibold text-sm sm:text-base text-zinc-900 mb-1">Set Up Your Profile</h4>
                <p className="text-neutral-600 text-sm sm:text-[15px]">
                  Tell us who you are, your skills, experience, and the services you offer. This helps customers know exactly what you do.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <img src={icon2} alt="Tell us about you" className="w-10 h-10 bg-indigo-900 rounded-full p-2" />
              <div>
                <h4 className="font-semibold text-sm sm:text-base text-zinc-900 mb-1">Tell us about You</h4>
                <p className="text-neutral-600 text-sm sm:text-[15px]">
                  Upload samples of your past jobs, describe your process, and share your availability. Let your work speak for you.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <img src={icon3} alt="Tap to View" className="w-10 h-10 bg-indigo-900 rounded-full p-2" />
              <div>
                <h4 className="font-semibold text-sm sm:text-base text-zinc-900 mb-1">Tap to View</h4>
                <p className="text-neutral-600 text-sm sm:text-[15px]">
                  Browse job requests from nearby customers who are looking for your exact skillset.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-4">
              <img src={icon4} alt="Curious" className="w-10 h-10 bg-indigo-900 rounded-full p-2" />
              <div>
                <h4 className="font-semibold text-sm sm:text-base text-zinc-900 mb-1">Curious? See more</h4>
                <p className="text-neutral-600 text-sm sm:text-[15px]">
                  Check out customer profiles, project details and start a chat before taking on a job
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile layout */}
        <div className="flex flex-col md:hidden gap-8 items-center">
          <img src={phoneImg} alt="How it works" className="w-full max-w-[360px] mx-auto" />
          <div className="flex flex-col gap-6 w-full max-w-[400px]">
            {/* Repeat each step stacked for mobile */}
            {[{icon: icon1, title: 'Set Up Your Profile', desc: 'Tell us who you are, your skills, experience, and the services you offer. This helps customers know exactly what you do.'},
              {icon: icon2, title: 'Tell us about You', desc: 'Upload samples of your past jobs, describe your process, and share your availability. Let your work speak for you.'},
              {icon: icon3, title: 'Tap to View', desc: 'Browse job requests from nearby customers who are looking for your exact skillset.'},
              {icon: icon4, title: 'Curious? See more', desc: 'Check out customer profiles, project details and start a chat before taking on a job'}].map((item, i) => (
              <div className="flex gap-4" key={i}>
                <img src={item.icon} alt={item.title} className="w-10 h-10 bg-indigo-900 rounded-full p-2" />
                <div>
                  <h4 className="font-semibold text-sm text-zinc-900 mb-1">{item.title}</h4>
                  <p className="text-neutral-600 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

export default How

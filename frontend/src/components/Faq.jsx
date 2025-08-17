import React from "react";
import { useState } from "react";
import arrowUp from "../assets/icons/arrow-down.svg";
import arrowDown from "../assets/icons/arrow-up.svg";

const faqData = [
  {
    question: "What is FIXION?",
    answer: "",
  },
  {
    question: "How do I hire an artisan on FIXION?",
    answer:
      "You can quickly hire an artisan using the FIXION app by browsing available professionals in your area, selecting the one you need, and scheduling a service time that suits you.",
  },
  {
    question: "Are the artisans insured and verified?",
    answer: "",
  },
  {
    question: "Can I reschedule or cancel an appointment?",
    answer:
      "Yes, you can reschedule or cancel appointments through the app. Please review your cancellation policy for more details.",
  },
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(1); // index of the open item (second question open by default)

  const toggle = (index) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  return (
    <div>
      <section className="w-full bg-white py-16 px-4 md:px-12 font-poppins">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-zinc-900">
            Frequently Asked Questions
          </h2>
          <p className="text-center text-sm text-neutral-500 mt-2">
            Quick answers to questions you may have about FIXION
          </p>

          <div className="mt-10 divide-y divide-gray-200">
            {faqData.map((item, index) => (
              <div key={index} className="py-6">
                <button
                  onClick={() => toggle(index)}
                  className="w-full flex justify-between items-center text-left"
                >
                  <span className="text-sm md:text-base font-semibold text-zinc-900 flex itens-start">
                    {item.question}
                  </span>
                  <img
                    src={openIndex === index ? arrowDown : arrowUp}
                    alt="toggle icon"
                    className="w-4 h-4"
                  />
                </button>

                {openIndex === index && item.answer && (
                  <p className="mt-3 text-sm text-neutral-600 leading-6 text-left">
                    {item.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Faq;

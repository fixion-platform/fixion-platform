import React from "react";
import filledStar from "../assets/icons/Star 1.svg";
import emptyStar from "../assets/icons/Star 5.svg";

const reviews = [
  {
    stars: 5,
    text: "Fixion helped me find a professional painter in under 10 minutes",
    name: "Amina",
    role: "Lagos",
  },
  {
    stars: 4,
    text: "My customers can now reach me anytime. Fixion has doubled my earnings",
    name: "Chinedu",
    role: "Artisan",
  },
  {
    stars: 4,
    text: "Great app. Simple to use and very helpful",
    name: "Uche",
    role: "Abuja",
  },
];

const ReviewCard = ({ stars, text, name, role }) => {
  const totalStars = 5;

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-3 text-left w-fullmax-w-[370px]">
      <div className="flex gap-1">
        {[...Array(totalStars)].map((_, i) => (
          <img
            key={i}
            src={i < stars ? filledStar : emptyStar}
            alt={i < stars ? "filled star" : "empty star"}
            className="w-4 h-4"
          />
        ))}
      </div>

      <p className="text-sm text-zinc-800 leading-relaxed mt-2">“{text}”</p>

      <div className="mt-3">
        <h4 className="font-bold text-zinc-900">{name}</h4>
        <p className="text-sm text-neutral-500">{role}</p>
      </div>
    </div>
  );
};

const Reviews = () => {
  return (
    <div>
      <section className="w-full bg-white py-12 px-4 md:px-8 font-poppins">
        <div className="max-w-[1280px] mx-auto text-center mb-10">
          <h2 className="text-[24px] md:text-[30px] font-bold text-zinc-900">
            Review Section
          </h2>
        </div>

        <div
          className="flex flex-col gap-6 md:flex-row md:justify-between md:gap-6 lg:gap-8 items-center 
                      max-w-[1280px] mx-auto flex-wrap md:flex-nowrap"
        >
          {reviews.map((review, i) => (
            // <ReviewCard key={i} {...review} />
            <div key={i} className="w-full min-w-[300px] md:min-w-0">
              <ReviewCard {...review} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Reviews;

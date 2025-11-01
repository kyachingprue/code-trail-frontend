import React from "react";
import { FaCircle } from "react-icons/fa";

const TestimonialCard = () => {
  return (
    <div
      className="relative w-full h-[300px] flex items-center mb-20 justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://i.ibb.co.com/DDMZKmWY/book-banner.jpg')", // replace with your image
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#02254d]/80"></div>

      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-3xl px-6">
        <p className="text-sm md:text-base leading-relaxed mb-6">
          There are many variations of passages of Lorem Ipsum available, but
          the majority have suffered alteration in some form, by injected
          humour, or randomised words which don't look even slightly believable.
          Lorem Ipsum available, but the majority have suffered.
        </p>

        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="w-8 bg-gray-300"></span>
          <span className="font-semibold tracking-wide text-sm uppercase">
            Steven Hunt
          </span>
        </div>

        {/* Dots */}
        <div className="flex justify-center items-center gap-2">
          <FaCircle className="text-yellow-400 text-[8px]" />
          <FaCircle className="text-gray-400 text-[8px]" />
          <FaCircle className="text-gray-400 text-[8px]" />
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;

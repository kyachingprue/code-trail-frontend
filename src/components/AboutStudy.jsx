import React from "react";

const AboutStudy = () => {
  return (
    <section className="max-w-6xl mx-auto md:px-6 py-16 flex flex-col md:flex-row items-center gap-10">
      {/* Image */}
      <div className="md:w-1/2">
        <img
          src="https://i.ibb.co.com/WWYf8rnt/2017-02-23-05-08-47-02692060-199d-4840-9e5a-8a258e5561ac-Interior-book-hero01.jpg"
          alt="Students studying"
          className="w-full rounded-lg shadow-md"
        />
      </div>

      {/* Content */}
      <div className="md:w-1/2">
        <h2 className="text-3xl font-semibold text-white mb-4">
          About Study
        </h2>
        <p className="text-gray-400 leading-relaxed mb-6">
          There are many variations of passages of Lorem Ipsum available, but
          the majority have suffered alteration in some form, by injected humour,
          or randomised words which don't look even slightly believable. If you
          are going to use a passage of Lorem Ipsum, you need to be sure there
          isn't anything embarrassing hidden in the middle of text amr songr balga
          ami toami valo lasi ciri din akr dali.
        </p>
        <button className="px-6 py-3 bg-[#fafbfd] text-black font-semibold rounded hover:bg-[#b1b8c4] transition-all duration-200">
          LEARN NOW
        </button>
      </div>
    </section>
  );
};

export default AboutStudy;

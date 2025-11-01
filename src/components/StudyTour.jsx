// StudyTour.jsx
import React from "react";

const images = [
  { src: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200&q=80&auto=format&fit=crop", alt: "Students visiting a museum gallery", label: "Museum Visit" },
  { src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80&auto=format&fit=crop", alt: "Students on a mountain trail", label: "Mountain Hike" },
  { src: "https://i.ibb.co.com/Y7gxPRB6/otqete-160823-49a0193.jpg", alt: "Students exploring a coastal area", label: "Coastal Study" },
  { src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80&auto=format&fit=crop", alt: "Students at a historical site", label: "Historical Tour" },
  { src: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&q=80&auto=format&fit=crop", alt: "Students doing a city-walk", label: "City Walk" },
  { src: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=1200&q=80&auto=format&fit=crop", alt: "Students learning in a botanical garden", label: "Botanical Garden" },
];

export default function StudyTour() {
  return (
    <section className="max-w-6xl mx-auto md:px-4 mb-10 py-10">
      <div className="text-center mb-6">
        <h2 className="text-3xl sm:text-4xl text-white font-extrabold tracking-tight">Study Tour</h2>
        <p className="mt-2 text-sm sm:text-base text-gray-300 max-w-2xl mx-auto">
          Explore curated study trips — museums, nature, and cultural visits picked for learning and fun.
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((img, idx) => (
          <figure key={idx} className="group relative overflow-hidden rounded-2xl shadow-lg">
            <img
              src={img.src}
              alt={img.alt}
              loading="lazy"
              className="w-full h-56 sm:h-64 lg:h-56 object-cover transform transition-transform duration-300 group-hover:scale-105"
            />
            <figcaption className="absolute left-4 bottom-4 bg-black/50 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-md">
              {img.label}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PlayCircleIcon, BookOpenIcon, RocketIcon, Code2Icon } from "lucide-react";

const CourseCategories = () => {
  const { language } = useParams();
  const navigate = useNavigate();

  // 🔹 You can customize these topics for each language later
  const categories = [
    {
      id: 1,
      name: "Basics",
      description: "Start learning the core fundamentals of " + language + ".",
      icon: <BookOpenIcon size={36} />,
      color: "from-green-500 to-emerald-600",
    },
    {
      id: 2,
      name: "OOP",
      description: "Understand Object-Oriented Programming concepts in " + language + ".",
      icon: <Code2Icon size={36} />,
      color: "from-blue-500 to-indigo-600",
    },
    {
      id: 3,
      name: "Projects",
      description: "Build real-world projects using " + language + ".",
      icon: <RocketIcon size={36} />,
      color: "from-yellow-500 to-orange-600",
    },
    {
      id: 4,
      name: "Advanced",
      description: "Master advanced topics and techniques in " + language + ".",
      icon: <PlayCircleIcon size={36} />,
      color: "from-purple-500 to-pink-600",
    },
  ];

  return (
    <div className="p-6 md:p-10 bg-gray-100 min-h-screen">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-10">
        {language.toUpperCase()} <span className="text-fuchsia-600">Learning Topics</span>
      </h1>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 border-t-4"
            style={{
              borderImage: `linear-gradient(to right, ${cat.color.split(" ")[0]}, ${cat.color.split(" ")[1]}) 1`,
            }}
          >
            {/* Icon */}
            <div
              className={`w-16 h-16 mx-auto flex items-center justify-center rounded-xl bg-linear-to-r ${cat.color} text-white mb-4`}
            >
              {cat.icon}
            </div>

            {/* Title */}
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              {cat.name}
            </h2>

            {/* Description */}
            <p className="text-gray-600 text-sm mb-5 leading-relaxed">
              {cat.description}
            </p>

            {/* Button */}
            <button
              onClick={() =>
                navigate(`/dashboard/student/courses/${language}/${cat.name}`)
              }
              className={`w-full py-2.5 text-sm font-semibold text-white rounded-lg bg-linear-to-r ${cat.color} shadow-md hover:shadow-lg hover:scale-[1.03] transition-transform`}
            >
              Watch Videos
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseCategories;

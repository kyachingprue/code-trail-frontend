import React from "react";
import { Code2Icon, LaptopIcon, BookOpenIcon, StarIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const courses = [
  {
    id: 1,
    language: "javascript",
    title: "JavaScript Fundamentals",
    description: "Master the basics of modern JavaScript with hands-on projects.",
    level: "Beginner",
    progress: 65,
    icon: <Code2Icon size={28} />,
    color: "from-yellow-500 to-orange-600",
  },
  {
    id: 2,
    language: "python",
    title: "Python Fundamentals",
    description: "Build dynamic and interactive web apps using React and hooks.",
    level: "Intermediate",
    progress: 45,
    icon: <LaptopIcon size={28} />,
    color: "from-blue-500 to-indigo-600",
  },
  {
    id: 3,
    language: "java",
    title: "Java Fundamentals",
    description: "Learn Python essentials for web and data-driven development.",
    level: "Beginner",
    progress: 80,
    icon: <BookOpenIcon size={28} />,
    color: "from-green-500 to-emerald-600",
  },
  {
    id: 4,
    language: "c++",
    title: "C++ Fundamentals",
    description: "Combine MongoDB, Express, React, and Node.js to build full-stack apps.",
    level: "Advanced",
    progress: 20,
    icon: <StarIcon size={28} />,
    color: "from-purple-500 to-pink-600",
  },
];

const MyCourses = () => {
  const navigate = useNavigate();
  return (
    <div className="p-6 md:p-10 bg-gray-100 min-h-screen">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
        My <span className="text-fuchsia-600">Programming Courses</span>
      </h1>

      {/* Vertical column layout */}
      <div className="flex flex-col gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="relative bg-white rounded-2xl shadow-lg p-5 hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 border-t-4"
            style={{
              borderImage: `linear-gradient(to right, ${course.color.split(" ")[0]}, ${course.color.split(" ")[1]}) 1`,
            }}
          >
            {/* Icon Section */}
            <div
              className={`w-14 h-14 flex items-center justify-center rounded-xl bg-linear-to-r ${course.color} text-white mb-4`}
            >
              {course.icon}
            </div>

            {/* Course Title */}
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {course.title}
            </h2>

            {/* Description */}
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
              {course.description}
            </p>

            {/* Level */}
            <span className="inline-block text-xs font-medium bg-gray-200 text-gray-700 px-3 py-1 rounded-full mb-4">
              {course.level}
            </span>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
              <div
                className={`bg-linear-to-r ${course.color} h-2.5 rounded-full transition-all duration-500`}
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>

            <p className="text-xs text-gray-600 mb-3">
              Progress: <span className="font-semibold">{course.progress}%</span>
            </p>

            {/* Action Button */}
            <button
              onClick={() => navigate(`/dashboard/student/courses/${course.language}`)}
              className={`w-full py-2.5 text-sm font-semibold text-white rounded-lg bg-linear-to-r ${course.color}`}
            >
              Continue Learning
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCourses;

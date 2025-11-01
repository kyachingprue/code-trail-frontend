import React from 'react';
import { useNavigate } from 'react-router-dom';
import useRole from '../hooks/useRole';
import { TypeAnimation } from "react-type-animation";
import useAuth from '../hooks/useAuth';

const Header = () => {
  const { role } = useRole();
  const { user } = useAuth();
  const navigate = useNavigate();


  // Role-based route mapping
  const roleRoutes = {
    student: "/dashboard/student/student-dashboard",
    teacher: "/dashboard/teacher-dashboard",
    admin: "/dashboard/admin/admin-dashboard",
  };

  const route = roleRoutes[role] || "/";

  // ✅ Fixed login check handler
  const handleLoginCheck = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    navigate(route);
  };

  return (
    <div>
      <div
        className="hero min-h-screen"
        style={{
          backgroundImage:
            "url(https://i.ibb.co.com/TxhBvsmb/Pngtree-a-hacker-in-a-hoodie-15877091.jpg)",
        }}
      >
        <div className="hero-overlay"></div>
        <div className='flex flex-col md:flex-row justify-between items-center'>
          <div className="hero-content flex-1 text-neutral-content text-center">
            <div className="w-full">
              <h1 className="pb-12 md:pb-6 md:pt-12 text-3xl md:text-5xl font-bold bg-linear-to-r from-blue-500 animate-pulse via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Growing Minds, Building Futures
              </h1>
              <div className='flex px-2 items-center py-4 gap-2'>
                <p className='text-xl font-bold text-white'>Hi ! I'm </p>
                <p className="text-xl font-bold text-transparent bg-linear-to-r from-cyan-400 via-blue-500 to-indigo-600 bg-clip-text">
                  <TypeAnimation
                    sequence={[
                      "Kyachingprue Marma",
                      2000,
                      "",
                      "Web Developer",
                      2000,
                      "",
                      "Software Developer",
                      2000,
                      "",
                      "Programmer",
                      2000,
                      "",
                      "MERN-Stack Developer",
                      2500,
                      "",
                    ]}
                    speed={60}
                    deletionSpeed={40}
                    repeat={Infinity}
                    style={{
                      display: "inline-block",
                      textAlign: "left",
                      whiteSpace: "pre",
                      borderRight: "2px solid cyan", // cursor effect
                      animation: "blink 0.8s infinite", // blink animation
                    }}
                  />

                  {/* Inline CSS animation for cursor blink */}
                  <style>
                    {`
                      @keyframes blink {
                      0%, 50%, 100% { border-color: transparent; }
                      25%, 75% { border-color: cyan; }
                      }
                     `}
                  </style>
                </p>
              </div>

              <p className="mb-14 md:mb-10 text-blue-100">
                Our mission is to help every child discover their potential in a caring and inspiring environment. Together, we plant the seeds of lifelong learning.Experience digital education that combines innovation, interactivity, and inspiration. Join us to explore the world of knowledge through modern technology and creative teaching.
              </p>
              <button onClick={handleLoginCheck} className="relative px-8 mt-6 py-3 text-white font-semibold uppercase tracking-wider
            bg-linear-to-r from-fuchsia-600 to-purple-700
            rounded-md shadow-[0_0_20px_rgba(168,85,247,0.6)]
            transition-all duration-300
            hover:shadow-[0_0_40px_rgba(192,38,211,0.9)]
            hover:scale-105 before:absolute before:inset-0 before:border-2 before:border-fuchsia-400 before:rounded-md before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300">
                {user ? " Get Started" : "Enroll Now"}
              </button>
            </div>
          </div>
          <div className='flex-2'>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
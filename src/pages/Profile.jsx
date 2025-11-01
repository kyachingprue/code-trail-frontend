import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import useRole from "../hooks/useRole";
import useAxiosSecure from "../hooks/useAxiosSecure";

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const { role, isLoading: roleLoading } = useRole();
  const axiosSecure = useAxiosSecure();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get(`/profile/${user.email}`);
        setProfile(res.data.profileData || {});
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setProfile({});
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.email, axiosSecure]);

  if (authLoading || roleLoading || loading)
    return <p className="text-center text-xl mt-20">Loading profile...</p>;

  if (!profile || Object.keys(profile).length === 0)
    return <p className="text-center text-xl mt-20">No profile data found</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-22 md:pb-16 px-5 font-sans">
      <h1 className="text-2xl md:text-4xl font-extrabold mb-8 text-center border-b-4 border-b-cyan-300 pb-4">
        {role?.toUpperCase()} PROFILE
      </h1>

      <div className="flex flex-col justify-start bg-linear-to-r from-gray-900 via-gray-800 to-black p-8 rounded-3xl shadow-2xl space-y-6 transform hover:scale-105 transition-all duration-300 border border-gray-700 w-full md:max-w-3xl mx-auto">

        {/* Hero Section */}
        <div className="flex flex-col items-center text-center space-y-3">
          <img
            src={profile.image || '/default-avatar.png'}
            alt={profile.name || 'User'}
            className="w-36 h-36 object-cover rounded-full border-4 border-cyan-400 shadow-lg"
          />
          <h2 className="text-xl md:text-3xl font-bold uppercase text-white">{profile.name || 'Anonymous'}</h2>
          <p className="text-gray-400">{profile.email || 'No Email Available'}</p>

          {/* Attractive Role Text */}
          {role === "student" && (
            <p className="text-yellow-400 font-semibold animate-pulse">
              🎓 Welcome, bright mind! Keep learning and shining!
            </p>
          )}
          {role === "teacher" && (
            <p className="text-green-400 font-semibold animate-pulse">
              📚 Inspire and educate! Your students are lucky to have you!
            </p>
          )}
          {role === "admin" && (
            <p className="text-red-400 font-semibold animate-pulse">
              ⚡ Master of the system! Manage wisely and lead boldly!
            </p>
          )}
        </div>

        {/* Role Badge */}
        <div className="flex justify-center items-center space-x-2">
          <span className="px-4 py-1 rounded-full text-white font-semibold text-sm bg-red-600">
            {role?.toUpperCase() || "N/A"}
          </span>
          <span className="text-gray-400 text-xs">
            {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : ""}
          </span>
        </div>

        {/* Details Section */}
        <div className="space-y-3 text-gray-200">
          {role === "student" && (
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex-1">
                <p><span className="font-semibold text-cyan-200">Roll:</span> {profile.roll || "N/A"}</p>
                <p><span className="font-semibold text-cyan-200">Gender:</span> {profile.gender || "N/A"}</p>
                <p><span className="font-semibold text-cyan-200">Mobile:</span> {profile.mobileNumber || "N/A"}</p>
                <p><span className="font-semibold text-cyan-200">Village:</span> {profile.village || "N/A"}</p>
              </div>
              <div className="flex-1">
                <p className="text-cyan-200 text-center animate-pulse">Code is not just lines on a screen — it’s a tool to make life better.
                  Every program you write should solve a real problem.
                </p>
              </div>
            </div>
          )}

          {role === "teacher" && (
            <div className="flex items-center justify-between px-4">
              <div>
                <p><span className="font-semibold text-cyan-200">Gender:</span> {profile.gender || "N/A"}</p>
                <p>
                  <span className="font-semibold text-cyan-200">Courses:</span>{" "}
                  {profile.courses && profile.courses.length > 0
                    ? profile.courses.map((c) => c.name).join(", ")
                    : "No courses assigned"}
                </p>
              </div>
              <div>
                <p className="text-green-400 font-semibold animate-pulse">
                  🌟 Every student is a story waiting to be written—guide them wisely!
                </p>
              </div>
            </div>
          )}

          {role === "admin" && (
            <p>
              <span className="font-semibold text-red-500">Info:</span> Admin has full access to the system
            </p>
          )}
        </div>

        {/* Footer Section */}
        <div className="mt-4 border-t border-gray-700 pt-3 text-gray-400 text-sm space-y-1">
          <p>
            <span className="font-semibold">Created At:</span>{" "}
            {profile.createdAt ? new Date(profile.createdAt).toLocaleString() : "N/A"}
          </p>
          <p>
            <span className="font-semibold">Last Login:</span>{" "}
            {profile.last_login ? new Date(profile.last_login).toLocaleString() : "N/A"}
          </p>
        </div>

      </div>

    </div>
  );
};

export default Profile;

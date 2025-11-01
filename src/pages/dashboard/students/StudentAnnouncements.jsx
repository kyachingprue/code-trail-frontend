// src/pages/student/StudentAnnouncements.jsx
import React from "react";
import { Megaphone } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const StudentAnnouncements = () => {
  const { user } = useAuth(); // current logged-in student
  const axiosSecure = useAxiosSecure();

  // Fetch announcements available for this student
  const { data: announcements = [], isLoading, isError } = useQuery({
    queryKey: ["student:announcements", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/student/announcements?email=${user?.email}`);
      return res.data;
    },
    onError: (err) => {
      console.error(err);
      toast.error("Failed to fetch announcements");
    },
  });

  if (isLoading)
    return <div className="p-6 text-center text-gray-500">Loading...</div>;

  if (isError)
    return (
      <div className="p-6 text-center text-red-500">
        Failed to load announcements.
      </div>
    );

  return (
    <div className="p-0 md:p-6 bg-gray-50 rounded-md min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <Megaphone className="text-indigo-500" size={24} />
          Announcements
        </h1>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.length === 0 ? (
          <div className="text-center mt-16">
            <Megaphone size={60} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No announcements available.</p>
          </div>
        ) : (
          announcements.map((item) => (
            <div
              key={item._id}
              className="border bg-gray-100 shadow-sm hover:shadow-lg border-gray-100 rounded-xl p-4 transition"
            >
              <div className="flex justify-between items-center mb-1">
                <h2 className="font-semibold md:text-xl text-gray-800">{item.title}</h2>
              </div>
              <p className="text-sm text-gray-600 mb-1">{item.message}</p>
              <p className="text-xs text-gray-900">
                📧 Sent by: {item.sentBy} | 📅{" "}
                {new Date(item.sentAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentAnnouncements;

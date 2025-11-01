import React from "react";
import { useQuery } from "@tanstack/react-query";
import { FaSpinner } from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const StudentDashboard = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  // 🟢 Fetch current student's data
  const { data: student, isLoading, isError } = useQuery({
    queryKey: ["currentStudent", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/students/email/${user.email}`);
      return res.data;
    }
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );

  if (isError)
    return (
      <div className="text-center text-red-500 text-lg mt-10">
        Failed to load student data.
      </div>
    );

  return (
    <div className="p-6">
      {/* 🔹 Top Four Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <InfoCard label="Student Name" value={student.name} />
        <InfoCard label="Student Roll" value={`ST-${student.roll}`} />
        <InfoCard label="Country" value={student.country} />
        <InfoCard label="Division" value={student.division} />
      </div>

      {/* 🔹 Student Information Card */}
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          🧾 Student Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <InfoItem label="Full Name" value={student.name} />
          <InfoItem label="Roll Number" value={`ST-${student.roll}`} />
          <InfoItem label="Gender" value={student.gender} />
          <InfoItem label="Age" value={student.yourOld} />
          <InfoItem label="Mobile Number" value={student.mobileNumber} />
          <InfoItem label="Email" value={student.email} />
          <InfoItem label="Country" value={student.country} />
          <InfoItem label="Division" value={student.division} />
          <InfoItem label="District" value={student.district} />
          <InfoItem label="Village" value={student.village} />
          <InfoItem label="Guardian Name" value={student.guardianName} />
          <InfoItem label="Birthday" value={new Date(student.birthday).toLocaleDateString()} />
        </div>
      </div>
    </div>
  );
};

// 🔹 Small reusable components
const InfoCard = ({ label, value }) => (
  <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100 text-center">
    <h3 className="text-gray-500 text-sm font-medium">{label}</h3>
    <p className="text-lg font-semibold text-gray-800 mt-1">{value}</p>
  </div>
);

const InfoItem = ({ label, value }) => (
  <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
    <p className="text-gray-500 text-xs uppercase font-medium">{label}</p>
    <p className="text-gray-900 font-semibold mt-1">{value}</p>
  </div>
);

export default StudentDashboard;

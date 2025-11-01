import React from "react";
import { useQuery } from "@tanstack/react-query";
import { FaSpinner } from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const TeacherDashboard = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const { data: teacher, isLoading, isError } = useQuery({
    queryKey: ["currentTeacher", user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const res = await axiosSecure.get(`/teachers/email/${user.email}`);
      return res.data;
    },
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-purple-600" />
      </div>
    );

  if (isError || !teacher)
    return (
      <div className="text-center text-red-500 text-lg mt-10">
        Teacher data not found.
      </div>
    );

  return (
    <div className="p-6">
      {/* 🔹 Top Four Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <InfoCard label="Teacher Name" value={teacher?.name || "N/A"} />
        <InfoCard label="Email" value={teacher.email} />
        <InfoCard label="Country" value={teacher.country} />
        <InfoCard label="Division" value={teacher.division} />
      </div>

      {/* 🔹 Teacher Information Card */}
      <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          🧾 Teacher Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <InfoItem label="Full Name" value={teacher.name} />
          <InfoItem label="Email" value={teacher.email} />
          <InfoItem label="Gender" value={teacher.gender} />
          <InfoItem label="Age" value={teacher.yourOld} />
          <InfoItem label="Mobile Number" value={teacher.mobileNumber} />
          <InfoItem label="Country" value={teacher.country} />
          <InfoItem label="Division" value={teacher.division} />
          <InfoItem label="District" value={teacher.district} />
          <InfoItem label="Village" value={teacher.village} />
          <InfoItem label="Guardian Name" value={teacher.guardianName} />
          <InfoItem label="Birthday" value={new Date(teacher.birthday).toLocaleDateString()} />
          <InfoItem label="Role" value={teacher.role} />
          <InfoItem label="Created At" value={new Date(teacher.createdAt).toLocaleDateString()} />
          <InfoItem label="Last Login" value={new Date(teacher.last_login).toLocaleDateString()} />
        </div>
      </div>
    </div>
  );
};

// 🔹 Small reusable components
const InfoCard = ({ label, value }) => (
  <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100 text-center">
    <h3 className="text-black text-md font-medium">{label}</h3>
    <p className="text-sm text-gray-600 mt-1">{value}</p>
  </div>
);

const InfoItem = ({ label, value }) => (
  <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
    <p className="text-gray-500 text-xs uppercase font-medium">{label}</p>
    <p className="text-gray-900 font-semibold mt-1">{value}</p>
  </div>
);

export default TeacherDashboard;

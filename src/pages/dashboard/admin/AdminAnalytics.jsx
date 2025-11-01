// src/pages/admin/AdminAnalytics.jsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import toast from "react-hot-toast";

const AdminAnalytics = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  // 🎯 Fetch all analytics data
  const {
    data: analytics = {},
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      try {
        const [students, teachers, assignments, videos, requests, tasks] =
          await Promise.all([
            axiosSecure.get("/admin/students"),
            axiosSecure.get("/admin/teachers"),
            axiosSecure.get("/admin/assignments"),
            axiosSecure.get("/admin/videos"),
            axiosSecure.get("/admin/teacher-requests"),
            axiosSecure.get("/admin/quizzes-tasks"),
          ]);

        return {
          students: students.data.length,
          teachers: teachers.data.length,
          assignments: assignments.data.length,
          videos: videos.data.length,
          requests: requests.data.length,
          tasks: tasks.data.length,
        };
      } catch (err) {
        console.error(err);
        toast.error("Failed to load analytics data");
        throw err;
      }
    },
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen text-lg font-semibold text-gray-600">
        Loading analytics...
      </div>
    );

  if (isError)
    return (
      <div className="text-center text-red-500 py-10">
        Failed to load analytics data
      </div>
    );

  // 🎨 Chart data
  const chartData = [
    { name: "Students", value: analytics.students },
    { name: "Teachers", value: analytics.teachers },
    { name: "Assignments", value: analytics.assignments },
    { name: "Videos", value: analytics.videos },
    { name: "Requests", value: analytics.requests },
    { name: "Tasks", value: analytics.tasks },
  ];

  const COLORS = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#14B8A6",
  ];

  // 📈 Bar chart data (example grouping)
  const barData = [
    { name: "Students", count: analytics.students },
    { name: "Teachers", count: analytics.teachers },
    { name: "Assignments", count: analytics.assignments },
    { name: "Videos", count: analytics.videos },
    { name: "Requests", count: analytics.requests },
    { name: "Tasks", count: analytics.tasks },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* 🧑 Admin Info Header */}
      <div className="bg-white p-5 rounded-xl shadow-sm mb-6 border border-gray-100">
        <h1 className="text-3xl font-semibold text-gray-800">
          📊 Admin Dashboard Analytics
        </h1>
        <p className="text-gray-500 mt-1">
          Welcome back, <span className="font-medium">{user?.email}</span>
        </p>
      </div>

      {/* 📦 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 mb-10">
        {[
          { title: "Students", value: analytics.students, color: "bg-blue-500" },
          { title: "Teachers", value: analytics.teachers, color: "bg-green-500" },
          {
            title: "Assignments",
            value: analytics.assignments,
            color: "bg-yellow-500",
          },
          { title: "Videos", value: analytics.videos, color: "bg-red-500" },
          { title: "Requests", value: analytics.requests, color: "bg-purple-500" },
          { title: "Tasks", value: analytics.tasks, color: "bg-teal-500" },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition border border-gray-100"
          >
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 ${item.color} text-white flex items-center justify-center rounded-full text-lg font-semibold`}
              >
                {item.value}
              </div>
              <p className="mt-3 text-gray-700 font-medium">{item.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 📊 Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Overall Data Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={110}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Data Comparison
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#6366F1" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;

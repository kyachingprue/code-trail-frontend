import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const AdminDashboard = () => {
  const axiosSecure = useAxiosSecure();

  // Fetch data from server
  const { data: students = [] } = useQuery({
    queryKey: ["admin-students"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/students", { withCredentials: true });
      return res.data;
    },
  });

  const { data: teachers = [] } = useQuery({
    queryKey: ["admin-teachers"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/teachers", { withCredentials: true });
      return res.data;
    },
  });

  // Chart data
  const studentTeacherData = [
    { name: "Students", count: students.length },
    { name: "Teachers", count: teachers.length },
    { name: "Classes", count: 25 },
  ];

  const attendanceData = [
    { name: "Present", value: 1100 },
    { name: "Absent", value: 150 },
  ];

  const COLORS = ["#4F46E5", "#F59E0B"];


  return (
    <main className="flex-1 pt-10 md:p-8 bg-gray-100 min-h-screen overflow-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Welcome, Admin</h1>
        <p className="text-gray-600 mt-2">System Overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-5 hover:shadow-lg transition">
          <h3 className="text-lg font-semibold text-gray-700">
            Total Students
          </h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {students.length}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-5 hover:shadow-lg transition">
          <h3 className="text-lg font-semibold text-gray-700">
            Total Teachers
          </h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {teachers.length}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-5 hover:shadow-lg transition">
          <h3 className="text-lg font-semibold text-gray-700">Classes</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">25</p>
        </div>
      </div>

      {/* Charts */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-5">
          Reports & Analytics
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div className="bg-white rounded-lg shadow p-5">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Students & Teachers Overview
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={studentTeacherData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-lg shadow p-5">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Attendance Distribution
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={attendanceData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {attendanceData.map((entry, index) => (
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
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;

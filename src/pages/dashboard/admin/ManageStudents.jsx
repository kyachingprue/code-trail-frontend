import React from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../components/LoadingSpinner";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useNavigate } from "react-router-dom";

const ManageStudents = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  // Fetch all students data
  const {
    data: students = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/students");
      return res.data;
    },
  });


  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this student?");
    if (!confirm) return;
    try {
      const res = await axiosSecure.delete(`/students/${id}`);
      if (res.data.deletedCount > 0) {
        toast.success("Student deleted successfully");
        refetch();
      }
    } catch (err) {
      toast.error("Failed to delete student", err.message);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Manage Students</h1>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead className="bg-linear-to-r from-indigo-500 to-purple-600 text-white">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created At</th>
              <th>Last Login</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={student._id} className="hover:bg-gray-100 transition">
                <td>{index + 1}</td>
                <td className="font-medium">{student.name}</td>
                <td>{student.email}</td>
                <td>
                  <span className="px-2 py-1 rounded-md bg-green-100 text-green-700 text-sm">
                    {student.role}
                  </span>
                </td>
                <td>{student.created_at?.slice(0, 10)}</td>
                <td>{student.lasted_login?.slice(0, 10) || "N/A"}</td>
                <td className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/dashboard/admin/manage-students/update/${student._id}`)}
                    className="btn btn-xs btn-accent text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(student._id)}
                    className="btn btn-xs btn-error text-white"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageStudents;

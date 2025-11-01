import React from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../components/LoadingSpinner";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useNavigate } from "react-router-dom";

const ManageTeachers = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  // Fetch all teachers
  const {
    data: teachers = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["teachers"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/teachers");
      return res.data;
    },
  });

  const handleEdit = (id) => {
    navigate(`/dashboard/admin/manage-teachers/update/${id}`);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this teacher?"
    );
    if (!confirm) return;

    try {
      const res = await axiosSecure.delete(`/admin/teachers/${id}`);
      if (res.data.deletedCount > 0) {
        toast.success("Teacher deleted successfully");
        refetch();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete teacher");
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        Manage Teachers
      </h1>

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
            {teachers.map((teacher, index) => (
              <tr
                key={teacher._id}
                className="hover:bg-gray-100 transition"
              >
                <td>{index + 1}</td>
                <td className="font-medium">{teacher.name}</td>
                <td>{teacher.email}</td>
                <td>
                  <span className="px-2 py-1 rounded-md bg-blue-100 text-blue-700 text-sm">
                    {teacher.role}
                  </span>
                </td>
                <td>{teacher.createdAt?.slice(0, 10)}</td>
                <td>{teacher.last_login?.slice(0, 10) || "N/A"}</td>
                <td className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(teacher._id)}
                    className="btn btn-xs btn-accent text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(teacher._id)}
                    className="btn btn-xs btn-error text-white"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {teachers.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  No teachers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageTeachers;

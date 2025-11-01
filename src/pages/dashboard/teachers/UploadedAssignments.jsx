import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";

const UploadedAssignments = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const baseURL = import.meta.env.VITE_SERVER_URL || "https://code-trail-server.onrender.com";

  const [editingId, setEditingId] = useState(null);
  const { register, handleSubmit, reset } = useForm();

  // ✅ Fetch assignments
  const { data: assignments = [], isLoading, refetch } = useQuery({
    queryKey: ["teacherAssignments", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/assignments/teacher/${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  // ✅ Delete assignment
  const handleDelete = async (id) => {
    toast((t) => (
      <div>
        <p>❌ Are you sure you want to delete this assignment?</p>
        <div className="mt-2 flex gap-2">
          <button
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            onClick={async () => {
              try {
                await axiosSecure.delete(`/teacher/assignments/${id}`);
                toast.success("Assignment deleted successfully!");
                refetch();
                toast.dismiss(t.id);
              } catch (err) {
                toast.error("Failed to delete assignment.", err.message);
              }
            }}
          >
            Delete
          </button>
          <button
            className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
        </div>
      </div>
    ));
  };

  // ✅ Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const formData = new FormData();
      if (data.title) formData.append("title", data.title);
      if (data.description) formData.append("description", data.description);
      if (data.language) formData.append("language", data.language);
      return axiosSecure.put(`/assignments/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      toast.success("Assignment updated successfully!");
      queryClient.invalidateQueries(["teacherAssignments"]);
      setEditingId(null);
      reset();
    },
    onError: () => toast.error("Failed to update assignment."),
  });

  const onSubmit = (data) => {
    updateMutation.mutate({ id: editingId, data });
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-700">
        📝 My Uploaded Assignments
      </h1>

      {assignments.length === 0 ? (
        <p className="text-center text-gray-500 mt-20">
          No assignments uploaded yet. Upload one from the <b>Create Assignment</b> section.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map((assignment) => {
            const fileSrc = assignment.fileUrl
              ? assignment.fileUrl.startsWith("http")
                ? assignment.fileUrl
                : `${baseURL}${assignment.fileUrl}`
              : null;

            // If this assignment is being edited
            if (editingId === assignment._id) {
              return (
                <div key={assignment._id} className="bg-white rounded-xl shadow p-4">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    <input
                      defaultValue={assignment.title}
                      {...register("title")}
                      className="w-full border p-2 rounded"
                      placeholder="Title"
                      required
                    />
                    <textarea
                      defaultValue={assignment.description}
                      {...register("description")}
                      className="w-full border p-2 rounded"
                      placeholder="Description"
                    />
                    <input
                      defaultValue={assignment.language}
                      {...register("language")}
                      className="w-full border p-2 rounded"
                      placeholder="Language"
                      required
                    />

                    <div className="flex gap-2 mt-2">
                      <button
                        type="submit"
                        className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              );
            }

            // Normal card
            return (
              <div
                key={assignment._id}
                className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition"
              >
                {fileSrc && (
                  <div className="mb-3">
                    <a
                      href={fileSrc}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline hover:text-blue-800"
                    >
                      📎 View Assignment File
                    </a>
                  </div>
                )}

                <h3 className="text-lg font-semibold">{assignment.title}</h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {assignment.description || "No description available."}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  🌐 Language: {assignment.language}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Uploaded: {new Date(assignment.createdAt).toLocaleDateString()}
                </p>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleDelete(assignment._id)}
                    className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setEditingId(assignment._id)}
                    className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                  >
                    Update
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UploadedAssignments;

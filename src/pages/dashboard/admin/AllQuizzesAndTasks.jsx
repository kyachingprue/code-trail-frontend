import React, { useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const AllQuizzesAndTasks = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [editingTask, setEditingTask] = useState(null);

  // Fetch all tasks
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["quizzesTasks"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/quizzes-tasks");
      return res.data;
    },
  });

  // Delete
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/admin/quizzes-tasks/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Deleted successfully!");
      queryClient.invalidateQueries(["quizzesTasks"]);
    },
    onError: () => toast.error("Delete failed"),
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedTask) => {
      const { _id, ...updateData } = updatedTask; // 🟢 remove _id
      const res = await axiosSecure.put(
        `/admin/quizzes-tasks/${_id}`,
        updateData
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Updated successfully!");
      queryClient.invalidateQueries(["quizzesTasks"]);
      setEditingTask(null);
    },
    onError: () => toast.error("Update failed"),
  });

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-6 md:p-10 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6 text-indigo-600">
        All Quizzes & Tasks
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="bg-white p-5 rounded-xl shadow-md border border-gray-200"
          >
            {editingTask?._id === task._id ? (
              <div className="space-y-3">
                <input
                  type="text"
                  defaultValue={task.title}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, title: e.target.value })
                  }
                  className="border w-full px-3 py-2 rounded-lg"
                />
                <textarea
                  defaultValue={task.description}
                  onChange={(e) =>
                    setEditingTask({
                      ...editingTask,
                      description: e.target.value,
                    })
                  }
                  className="border w-full px-3 py-2 rounded-lg"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => updateMutation.mutate(editingTask)}
                    className="bg-green-600 text-white px-4 py-1 rounded-lg"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingTask(null)}
                    className="bg-gray-400 text-white px-4 py-1 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-semibold text-fuchsia-600">
                  {task.title}
                </h3>
                <p className="text-gray-700 mt-1">{task.description}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Category: {task.category}
                </p>
                <p className="text-sm text-gray-500">
                  Type: {task.type} | Due: {task.dueDate}
                </p>

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={() => setEditingTask(task)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(task._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllQuizzesAndTasks;

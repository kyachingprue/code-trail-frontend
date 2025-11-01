import React from "react";
import { useForm } from "react-hook-form";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const QuizzesAndTasks = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Mutation to upload quiz/task
  const mutation = useMutation({
    mutationFn: async (newTask) => {
      const res = await axiosSecure.post("/admin/quizzes-tasks", newTask);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Task uploaded!");
      queryClient.invalidateQueries(["quizzesTasks"]);
      reset();
    },
    onError: () => toast.error("Upload failed"),
  });

  const onSubmit = (data) => {
    mutation.mutate({
      title: data.title,
      description: data.description,
      category: data.category,
      dueDate: data.dueDate,
      type: data.type, // Quiz or Task
    });
  };

  return (
    <div className="p-6 md:p-10 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center text-fuchsia-600">
        Upload Quizzes & Tasks
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-lg space-y-4"
      >
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            {...register("title", { required: true })}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Task or Quiz title"
          />
          {errors.title && (
            <span className="text-red-500 text-sm">Title is required</span>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            {...register("description", { required: true })}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Brief description"
          />
          {errors.description && (
            <span className="text-red-500 text-sm">Description is required</span>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">Category</label>
          <select
            {...register("category", { required: true })}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">Select Category</option>
            <option value="javascript">JavaScript</option>
            <option value="react">React</option>
            <option value="python">Python</option>
            <option value="nodejs">Node.js</option>
          </select>
          {errors.category && (
            <span className="text-red-500 text-sm">Category is required</span>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">Type</label>
          <select
            {...register("type", { required: true })}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="">Select Type</option>
            <option value="quiz">Quiz</option>
            <option value="task">Task</option>
          </select>
          {errors.type && (
            <span className="text-red-500 text-sm">Type is required</span>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">Due Date</label>
          <input
            {...register("dueDate", { required: true })}
            type="date"
            className="w-full border rounded-lg px-3 py-2"
          />
          {errors.dueDate && (
            <span className="text-red-500 text-sm">Due Date is required</span>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-fuchsia-600 text-white py-2 rounded-lg hover:bg-fuchsia-700 transition"
        >
          Upload
        </button>
      </form>
      <div className="text-center mt-8">
        <button
          onClick={() => navigate("/dashboard/admin/all-quizzes-tasks")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg shadow-md transition"
        >
          View All Quizzes & Tasks
        </button>
      </div>
    </div>
  );
};

export default QuizzesAndTasks;

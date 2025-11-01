import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../components/LoadingSpinner";

const UpcomingTasks = () => {
  const axiosSecure = useAxiosSecure();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["quizzesTasks"],
    queryFn: async () => {
      const res = await axiosSecure.get("/quizzes-tasks");
      return res.data;
    },
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="p-6 md:p-10 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center text-fuchsia-600">
        Upcoming Tasks & Quizzes
      </h1>

      {tasks.length === 0 ? (
        <p className="text-center text-gray-500">No upcoming tasks or quizzes.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="bg-white rounded-2xl shadow-lg p-4 hover:shadow-2xl transition-all duration-300"
            >
              <h2 className="text-xl font-semibold mb-1">{task.title}</h2>
              <p className="text-sm text-gray-600 mb-1">{task.description}</p>
              <p className="text-xs md:text-base text-gray-700 font-semibold mb-1">
                Category: {task.category} | Type: {task.type}
              </p>
              <p className="text-xs text-gray-900">Due Date: {task.dueDate}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingTasks;

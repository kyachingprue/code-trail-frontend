// src/pages/teacher/StudentGrades.jsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const StudentGrades = () => {
  const axiosSecure = useAxiosSecure();

  const { data: submissions = [], isLoading, isError } = useQuery({
    queryKey: ["studentSubmissions"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/assignments");
      return res.data;
    },
    onError: (err) => {
      console.error(err);
      toast.error("Failed to fetch submissions");
    },
  });

  if (isLoading) return <div>Loading submissions...</div>;
  if (isError) return <div>Something went wrong.</div>;

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {submissions.length === 0 ? (
        <div className="col-span-full text-center text-gray-500">
          No submissions found
        </div>
      ) : (
        submissions.map((sub) => (
          <div
            key={sub._id}
            className="bg-white shadow-md rounded-lg p-4 border border-gray-200 hover:shadow-lg transition"
          >
            <h3 className="text-lg font-bold mb-2">{sub.studentName}</h3>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-semibold">Email:</span> {sub.studentEmail}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-semibold">Assignment ID:</span> {sub.assignmentId}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-semibold">Submission:</span>{" "}
              <a
                href={sub.submissionLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                View
              </a>
            </p>
            <p className="text-sm mb-1">
              <span className="font-semibold">Status:</span> {sub.status}
            </p>
            <p className="text-sm mb-1">
              <span className="font-semibold">Mark:</span> {sub.mark || "Not marked"}
            </p>
            <p className="text-sm mb-1">
              <span className="font-semibold">Marked By:</span> {sub.markedBy || "-"}
            </p>
            <p className="text-sm mb-1">
              <span className="font-semibold">Marked At:</span>{" "}
              {sub.markedAt ? new Date(sub.markedAt).toLocaleString() : "-"}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Comments:</span> {sub.adminComments || "-"}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default StudentGrades;

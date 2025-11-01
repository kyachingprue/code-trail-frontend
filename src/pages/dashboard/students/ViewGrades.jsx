import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import LoadingSpinner from "../../../components/LoadingSpinner";

export default function ViewGrades() {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  // 🔹 Fetch only this student's submissions
  const { data: submissions = [], isLoading, isError } = useQuery({
    queryKey: ["student:grades", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/student/assignments/${user.email}`);
      return res.data;
    },
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError)
    return <div className="text-center text-red-600">Failed to load grades.</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        📘 My Assignment Grades
      </h2>

      {submissions.length === 0 ? (
        <div className="text-center text-gray-600 mt-10">
          No submissions found yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-linear-to-r from-blue-600 to-indigo-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Submission Link</th>
                <th className="px-4 py-3 text-left">Submitted At</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Mark</th>
                <th className="px-4 py-3 text-left">Admin Comments</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((s, index) => (
                <tr
                  key={s._id}
                  className="border-t hover:bg-gray-50 transition-all"
                >
                  <td className="px-4 py-3 text-gray-700 font-medium">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={s.submissionLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline hover:text-blue-800"
                    >
                      View
                    </a>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(s.submittedAt).toLocaleString()}
                  </td>
                  <td
                    className={`px-4 py-3 font-semibold ${s.status === "approved"
                      ? "text-green-600"
                      : s.status === "rejected"
                        ? "text-red-600"
                        : s.status === "marked"
                          ? "text-blue-600"
                          : "text-gray-500"
                      }`}
                  >
                    {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {s.mark ? (
                      <span className="font-semibold text-green-700">
                        {s.mark}
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600 italic">
                    {s.adminComments || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

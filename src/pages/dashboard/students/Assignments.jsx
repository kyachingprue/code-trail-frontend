import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";

const Assignments = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const { register, handleSubmit, reset } = useForm();

  // Fetch assignments
  const { data: assignments = [], isLoading, isError } = useQuery({
    queryKey: ["assignments", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get("/assignments");
      return res.data;
    },
    enabled: !!user, // Only run when user exists
  });

  // Submit assignment mutation
  const { mutateAsync: submitAssignment, isLoading: isSubmitting } = useMutation({
    mutationFn: async (data) => {
      const res = await axiosSecure.post("/assignments/submit", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Assignment submitted successfully!");
      reset();
      setSelectedAssignment(null);
      queryClient.invalidateQueries(["assignments"]);
    },
    onError: () => toast.error("Failed to submit assignment!"),
  });

  // Submit handler
  const onSubmit = async (formData) => {
    if (!user?.email || !user?.displayName) {
      toast.error("User data is not loaded yet!");
      return;
    }
    if (!selectedAssignment || !selectedAssignment._id) {
      toast.error("Please select an assignment first.");
      return;
    }
    if (!formData.submissionLink) {
      toast.error("Please enter a submission link.");
      return;
    }

    const payload = {
      assignmentId: selectedAssignment._id.toString(),
      submissionLink: formData.submissionLink,
      studentEmail: user?.email,
      studentName: user?.displayName,
    };

    try {
      await submitAssignment(payload);
    } catch (err) {
      console.error("Failed to submit assignment:", err);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (isError)
    return (
      <p className="text-center text-red-500 mt-10">
        ❌ Failed to load assignments.
      </p>
    );

  // Add hasSubmitted flag for each assignment
  const assignmentsWithStatus = assignments.map((assignment) => {
    const hasSubmitted = assignment.submissions?.some(
      (s) => s.studentEmail === user?.email
    );
    return { ...assignment, hasSubmitted: !!hasSubmitted };
  });

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-700">
        📝 Programming Assignments
      </h1>

      {assignmentsWithStatus.length === 0 ? (
        <p className="text-center text-gray-500 mt-20">
          No assignments available yet.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignmentsWithStatus.map((assignment) => (
            <div
              key={assignment._id}
              className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition cursor-pointer"
              onClick={() => {
                if (!assignment.hasSubmitted) setSelectedAssignment(assignment);
              }}
            >
              <h3 className="text-lg font-semibold">{assignment.title}</h3>
              <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                {assignment.description}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Language: {assignment.language}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Uploaded by: {assignment.uploadedBy}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Date: {new Date(assignment.createdAt).toLocaleDateString()}
              </p>

              {!assignment.hasSubmitted ? (
                <p className="mt-2 text-green-600 font-semibold cursor-pointer">
                  Click to Submit
                </p>
              ) : (
                <p className="mt-2 text-gray-400 font-semibold">Already Submitted</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Submit Assignment Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md relative">
            <button
              onClick={() => setSelectedAssignment(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 font-bold"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4">
              Submit Assignment: {selectedAssignment.title}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Submission Link (GitHub / Drive / Live Project)
                </label>
                <input
                  {...register("submissionLink", { required: true })}
                  type="url"
                  placeholder="https://github.com/your-project"
                  className="w-full border p-2 rounded-md"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || selectedAssignment.hasSubmitted}
                className={`w-full py-2 rounded-md text-white ${selectedAssignment.hasSubmitted
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
                  } transition`}
              >
                {selectedAssignment.hasSubmitted
                  ? "Already Submitted"
                  : isSubmitting
                    ? "Submitting..."
                    : "Submit Assignment"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assignments;

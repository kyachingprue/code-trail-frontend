// src/pages/admin/ManageAssignments.jsx
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import LoadingSpinner from "../../../components/LoadingSpinner";

export default function ManageAssignments() {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [markingSubmission, setMarkingSubmission] = useState(null);
  const { register, handleSubmit, reset } = useForm();

  const { data: submissions = [], isLoading, isError } = useQuery({
    queryKey: ["admin:assignments"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/assignments");
      return res.data;
    },
  });

  const makeStatusMutation = useMutation({
    mutationFn: async ({ payload, method = "put", url }) => {
      if (method.toLowerCase() === "delete") return axiosSecure.delete(url);
      return axiosSecure.put(url, payload);
    },
    onSuccess: () => {
      toast.success("Operation successful");
      queryClient.invalidateQueries({ queryKey: ["admin:assignments"] });
    },
    onError: (err) => {
      console.error(err);
      toast.error(err?.response?.data?.message || "Operation failed");
    },
  });

  const handleApprove = (submissionId) => {
    toast.promise(
      makeStatusMutation.mutateAsync({
        url: `/admin/assignments/${submissionId}/status`,
        payload: { status: "approved", actedBy: user?.email || "admin" },
      }),
      { loading: "Approving...", success: "Approved", error: "Could not approve" }
    );
  };

  const handleReject = (submissionId) => {
    toast.promise(
      makeStatusMutation.mutateAsync({
        url: `/admin/assignments/${submissionId}/status`,
        payload: { status: "rejected", actedBy: user?.email || "admin" },
      }),
      { loading: "Rejecting...", success: "Rejected", error: "Could not reject" }
    );
  };

  const handleDelete = (submissionId) => {
    toast((t) => (
      <div className="flex flex-col items-start gap-2">
        <p className="text-sm font-medium">Are you sure you want to delete this submission?</p>
        <div className="flex gap-2 mt-1">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              toast.promise(
                makeStatusMutation.mutateAsync({ url: `/admin/assignments/${submissionId}`, method: "delete" }),
                { loading: "Deleting...", success: "Deleted", error: "Failed" }
              );
            }}
            className="px-3 py-1 rounded bg-red-600 text-white text-sm hover:bg-red-700"
          >
            Delete
          </button>
          <button onClick={() => toast.dismiss(t.id)} className="px-3 py-1 rounded border text-sm hover:bg-gray-100">
            Cancel
          </button>
        </div>
      </div>
    ), { duration: 8000, position: "top-center" });
  };

  const openMarkModal = (submission) => {
    setMarkingSubmission(submission);
    reset({ mark: submission?.mark ?? "", comments: submission?.adminComments ?? "" });
  };

  const closeMarkModal = () => {
    setMarkingSubmission(null);
    reset();
  };

  const onMarkSubmit = async (data) => {
    if (!markingSubmission) return;
    const payload = {
      status: "marked",
      mark: data.mark,
      adminComments: data.comments,
      markedBy: user?.email || "admin",
      markedAt: new Date().toISOString(),
    };
    toast.promise(makeStatusMutation.mutateAsync({
      url: `/admin/assignments/${markingSubmission._id}/status`,
      payload
    }), { loading: "Saving mark...", success: "Marked", error: "Failed to mark" }).then(closeMarkModal);
  };

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <div>Failed to load assignments</div>;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-3">Manage Assignments</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {submissions.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">No submissions yet</div>
        ) : (
          submissions.map((s) => (
            <div key={s._id} className="bg-white shadow-md rounded-lg p-4 border border-gray-200 hover:shadow-lg transition">
              <h3 className="text-lg font-bold mb-1">{s.studentName}</h3>
              <p className="text-sm text-gray-600 mb-1"><span className="font-semibold">Email:</span> {s.studentEmail}</p>
              <p className="text-sm text-gray-600 mb-1"><span className="font-semibold">Assignment ID:</span> {s.assignmentId}</p>
              <p className="text-sm mb-1">
                <span className="font-semibold">Submitted At:</span> {new Date(s.submittedAt).toLocaleString()}
              </p>
              <p className="text-sm mb-1">
                <span className="font-semibold">Status:</span>{" "}
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${s.status === "approved" ? "bg-green-100 text-green-700" : s.status === "rejected" ? "bg-red-100 text-red-700" : s.status === "marked" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-600"}`}>
                  {s.status}
                </span>
              </p>
              <p className="text-sm mb-2"><span className="font-semibold">Mark:</span> {s.mark || "Not marked"}</p>
              {s.adminComments && <p className="text-sm mb-2"><span className="font-semibold">Comments:</span> {s.adminComments}</p>}

              {/* ✅ Assignment Link */}
              <a
                href={s.submissionLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mb-2 px-3 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Open Assignment
              </a>

              <div className="flex flex-wrap gap-2 mt-2">
                <button onClick={() => handleApprove(s._id)} disabled={s.status === "approved"} className="px-3 py-1 text-xs rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50">Approve</button>
                <button onClick={() => handleReject(s._id)} disabled={s.status === "rejected"} className="px-3 py-1 text-xs rounded bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50">Reject</button>
                <button onClick={() => openMarkModal(s)} className="px-3 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700">Mark</button>
                <button onClick={() => handleDelete(s._id)} className="px-3 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700">Delete</button>
              </div>
            </div>

          ))
        )}
      </div>

      {/* Mark Modal */}
      {markingSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
            <h3 className="text-xl font-semibold mb-3">Mark Submission</h3>
            <p className="text-sm text-gray-500 mb-4">Student: {markingSubmission.studentName} | Email: {markingSubmission.studentEmail}</p>
            <form onSubmit={handleSubmit(onMarkSubmit)} className="space-y-3">
              <div>
                <label className="block text-sm font-medium">Score</label>
                <input type="number" {...register("mark", { required: true })} className="w-full border px-3 py-2 rounded-lg focus:ring focus:ring-blue-300" />
              </div>
              <div>
                <label className="block text-sm font-medium">Admin Comment (optional)</label>
                <textarea {...register("comments")} className="w-full border px-3 py-2 rounded-lg focus:ring focus:ring-blue-300" />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={closeMarkModal} className="px-4 py-2 rounded border text-gray-600 hover:bg-gray-100">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Save Mark</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

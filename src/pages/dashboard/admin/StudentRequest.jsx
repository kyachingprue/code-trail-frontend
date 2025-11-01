import React from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../components/LoadingSpinner";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const StudentRequest = () => {
  const axiosSecure = useAxiosSecure();

  // Fetch all teacher requests (admin view)
  const { data: requests = [], isLoading, refetch } = useQuery({
    queryKey: ["allTeacherRequests"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/teacher-requests");
      return res.data;
    },
  });

  // Update request status
  const handleStatusUpdate = async (id, status) => {
    try {
      const res = await axiosSecure.put(`/teacher-requests/${id}`, { status });
      if (res.data.success) {
        toast.success(`Request ${status} successfully`);
        refetch();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  const handleReject = (id) => {
    toast(
      (t) => (
        <div>
          <p>Are you sure you want to reject this request?</p>
          <div className="flex gap-2 mt-2">
            <button
              className="btn btn-xs btn-warning text-white"
              onClick={async () => {
                toast.dismiss(t.id);
                await handleStatusUpdate(id, "Rejected");
              }}
            >
              Reject
            </button>
            <button
              className="btn btn-xs btn-outline"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };

  const handleApprove = (id) => {
    toast(
      (t) => (
        <div>
          <p>Are you sure you want to approve this request?</p>
          <div className="flex gap-2 mt-2">
            <button
              className="btn btn-xs btn-success text-white"
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  const res = await axiosSecure.put(`/teacher-requests/approve/${id}`);
                  if (res.data.success) {
                    toast.success("Request approved! Student promoted to teacher");
                    refetch(); // update requests table
                  }
                } catch (err) {
                  console.error(err);
                  toast.error("Failed to approve request");
                }
              }}
            >
              Approve
            </button>
            <button
              className="btn btn-xs btn-error text-white"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };

  const handleDelete = (id) => {
    toast.custom(
      (t) => (
        <div
          className={`bg-white shadow-lg rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-2 ${t.visible ? "animate-enter" : "animate-leave"
            }`}
        >
          <p className="text-gray-800 font-medium">
            Are you sure you want to delete this request?
          </p>
          <div className="flex gap-2 mt-2 sm:mt-0">
            <button
              className="btn btn-xs btn-error text-white"
              onClick={async () => {
                try {
                  const res = await axiosSecure.delete(`/teacher-requests/${id}`);
                  if (res.data.success) {
                    toast.success("Request deleted successfully");
                    refetch();
                  }
                } catch (err) {
                  console.error(err);
                  toast.error("Failed to delete request");
                }
                toast.dismiss(t.id);
              }}
            >
              Delete
            </button>
            <button
              className="btn btn-xs btn-outline"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: Infinity } // keeps the toast until user clicks
    );
  };


  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Student Teacher Requests</h1>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead className="bg-linear-to-r from-indigo-500 to-purple-600 text-white">
            <tr>
              <th>#</th>
              <th>Student Name</th>
              <th>Email</th>
              <th>Course</th>
              <th>Status</th>
              <th>Requested At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request, index) => (
              <tr key={request._id} className="hover:bg-gray-100 transition">
                <td>{index + 1}</td>
                <td className="font-medium">{request.name}</td>
                <td>{request.email}</td>
                <td className="text-xs">{request.course}</td>
                <td>
                  <span
                    className={`px-2 py-1 rounded-md text-sm ${request.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : request.status === "Approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                      }`}
                  >
                    {request.status}
                  </span>
                </td>
                <td className="text-xs">{new Date(request.createdAt).toLocaleDateString()}</td>
                <td className="flex items-center gap-2">
                  {request.status === "Pending" && (
                    <>
                      <button
                        onClick={() => handleApprove(request._id)}
                        className="btn btn-xs btn-success text-white"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(request._id)}
                        className="btn btn-xs btn-warning text-white"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDelete(request._id)}
                    className="btn btn-xs btn-error text-white"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">
                  No requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentRequest;

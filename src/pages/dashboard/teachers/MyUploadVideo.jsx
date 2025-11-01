import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const MyUploadVideo = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [editVideo, setEditVideo] = useState(null);

  const { data: videos = [], isLoading, refetch } = useQuery({
    queryKey: ["teacherVideos", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/teacher/videos/${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const { register, handleSubmit, reset } = useForm();

  const handleDelete = async (id) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-gray-800">
            ⚠️ Are you sure you want to delete this video?
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                toast.dismiss(t.id); // close toast
              }}
              className="px-3 py-1 text-sm bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>

            <button
              onClick={async () => {
                try {
                  await axiosSecure.delete(`/teacher/videos/${id}`);
                  toast.dismiss(t.id);
                  toast.success("✅ Video deleted successfully!");
                  refetch();
                } catch (err) {
                  toast.dismiss(t.id);
                  toast.error("❌ Failed to delete video", err.message);
                }
              }}
              className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      {
        duration: 5000,
        position: "top-center",
        style: {
          background: "#fff",
          border: "1px solid #ddd",
          padding: "12px 16px",
          borderRadius: "10px",
        },
      }
    );
  };

  const onSubmitEdit = async (data) => {
    await axiosSecure.put(`/teacher/videos/${editVideo._id}`, data);
    setEditVideo(null);
    reset();
    toast.success("Update successful")
    refetch();
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-700">
        🎥 My Uploaded Videos
      </h1>

      {videos.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          <p>No videos uploaded yet.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div
              key={video._id}
              className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition"
            >
              {/* Video Preview */}
              <div className="rounded-lg overflow-hidden mb-3">
                <video
                  className="w-full h-48 object-cover"
                  controls
                  src={video.videoUrl.startsWith("http")
                    ? video.videoUrl
                    : `https://code-trail-server.onrender.com${video.videoUrl}`}
                />
              </div>

              {/* Video Info */}
              <h3 className="text-lg font-semibold">{video.title}</h3>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {video.description || "No description available."}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                📚 {video.category} | 🌐 {video.language}
              </p>

              {/* Buttons */}
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => setEditVideo(video)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(video._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🔹 Edit Modal */}
      {editVideo && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
            <h2 className="text-xl font-semibold mb-4">Edit Video</h2>
            <form onSubmit={handleSubmit(onSubmitEdit)} className="space-y-3">
              <input
                type="text"
                {...register("title")}
                defaultValue={editVideo.title}
                placeholder="Title"
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                {...register("category")}
                defaultValue={editVideo.category}
                placeholder="Category"
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                {...register("language")}
                defaultValue={editVideo.language}
                placeholder="Language"
                className="w-full border p-2 rounded"
              />
              <textarea
                {...register("description")}
                defaultValue={editVideo.description}
                placeholder="Description"
                className="w-full border p-2 rounded"
              ></textarea>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditVideo(null)}
                  className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyUploadVideo;

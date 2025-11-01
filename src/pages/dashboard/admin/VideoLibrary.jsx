import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../components/LoadingSpinner";

const VideoLibrary = () => {
  const axiosSecure = useAxiosSecure();
  const baseURL = import.meta.env.VITE_SERVER_URL || "https://code-trail-server.onrender.com";

  // Fetch all videos
  const { data: videos = [], isLoading } = useQuery({
    queryKey: ["allVideos"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/videos");
      return res.data;
    },
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="p-6 md:p-10 bg-gray-100 min-h-screen">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
        <span className="text-fuchsia-600">Video Library</span>
      </h1>

      {videos.length === 0 ? (
        <p className="text-center text-gray-500">No videos uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div
              key={video._id}
              className="bg-white rounded-2xl shadow-lg p-4 hover:shadow-2xl transition-all duration-300"
            >
              {/* Video Player */}
              {video.videoUrl.includes("youtube.com") || video.videoUrl.includes("youtu.be") ? (
                <iframe
                  width="100%"
                  height="200"
                  src={
                    video.videoUrl.includes("watch?v=")
                      ? video.videoUrl.replace("watch?v=", "embed/")
                      : video.videoUrl
                  }
                  title={video.title}
                  className="rounded-lg mb-3"
                  allowFullScreen
                />
              ) : (
                <video
                  width="100%"
                  height="200"
                  controls
                  className="rounded-lg mb-3"
                >
                  <source
                    src={video.videoUrl.startsWith("http") ? video.videoUrl : `${baseURL}${video.videoUrl}`}
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              )}

              {/* Video Info */}
              <h2 className="text-lg font-semibold mb-1">{video.title}</h2>
              <p className="text-sm text-gray-600 mb-1">{video.description}</p>
              <p className="text-xs text-gray-500 mb-1">
                <span className="font-semibold">Teacher:</span> {video.uploadedBy}
              </p>
              <p className="text-xs text-gray-400">
                <span className="font-semibold">Language:</span> {video.language} |{" "}
                <span className="font-semibold">Category:</span> {video.category}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoLibrary;

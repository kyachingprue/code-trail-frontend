import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../components/LoadingSpinner";

const VideoList = () => {
  const { language, category } = useParams();
  const axiosSecure = useAxiosSecure();
  const baseURL = import.meta.env.VITE_SERVER_URL || "https://code-trail-server.onrender.com";

  const { data: videos = [], isLoading } = useQuery({
    queryKey: ["videos", language, category],
    queryFn: async () => {
      const res = await axiosSecure.get(`/videos/${language}/${category}`);
      return res.data;
    },
  });

  const [selectedVideo, setSelectedVideo] = useState(null);

  if (isLoading) return <LoadingSpinner />;

  // Automatically select first video if none selected
  if (!selectedVideo && videos.length > 0) setSelectedVideo(videos[0]);

  return (
    <div className="p-4 md:p-6 flex flex-col lg:flex-row gap-6">
      {/* Main video player */}
      <div className="flex-1">
        {selectedVideo ? (
          <div className="bg-black rounded-xl overflow-hidden shadow-lg">
            <video
              key={selectedVideo._id} // ensures reload when video changes
              src={
                selectedVideo.videoUrl.startsWith("http")
                  ? selectedVideo.videoUrl
                  : `${baseURL}${selectedVideo.videoUrl}`
              }
              controls
              className="w-full h-[500px] md:h-[500px] lg:h-[460px] bg-black"
            />

            {/* Video info and controls */}
            <div className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center bg-white">
              <div>
                <h2 className="text-xl md:text-2xl text-black font-semibold">{selectedVideo.title}</h2>
                <p className="text-gray-600 text-sm mt-1">
                  {selectedVideo.description}
                </p>
                <p className="text-xs md:text-base font-bold text-gray-700 py-2">
                  Uploaded by: {selectedVideo.uploadedBy}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">No videos available</p>
        )}
      </div>

      {/* Sidebar video list */}
      <div className="w-full lg:w-1/3 max-h-[600px] overflow-y-auto border border-gray-400 rounded-md">
        {videos.map((video) => (
          <div
            key={video._id}
            className={`flex gap-3 p-3 rounded-lg mb-3 cursor-pointer hover:bg-gray-100 transition ${selectedVideo?._id === video._id ? "bg-gray-200" : ""
              }`}
            onClick={() => setSelectedVideo(video)}
          >
            {/* Thumbnail */}
            {video.videoUrl.includes("youtube.com") || video.videoUrl.includes("youtu.be") ? (
              <iframe
                width="120"
                height="70"
                src={
                  video.videoUrl.includes("watch?v=")
                    ? video.videoUrl.replace("watch?v=", "embed/")
                    : video.videoUrl
                }
                title={video.title}
                className="rounded-lg"
                allowFullScreen
              />
            ) : (
              <video
                className="w-28 h-16 object-cover rounded-lg"
                src={
                  video.videoUrl.startsWith("http")
                    ? video.videoUrl
                    : `${baseURL}${video.videoUrl}`
                }
              />
            )}

            {/* Video info */}
            <div className="flex-1">
              <h3 className="text-sm font-semibold">{video.title}</h3>
              <p className="text-xs text-gray-500 mt-1">
                {video.uploadedBy}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoList;

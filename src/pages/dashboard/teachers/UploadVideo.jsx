import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";
import { UploadCloudIcon, Loader2Icon, FileVideoIcon } from "lucide-react";

const UploadVideo = () => {
  const { register, handleSubmit, reset, watch } = useForm();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [preview, setPreview] = useState(null);

  const { mutateAsync: uploadVideo, isPending } = useMutation({
    mutationFn: async (data) => {
      const formData = new FormData();
      formData.append("language", data.language);
      formData.append("category", data.category);
      formData.append("title", data.title);
      formData.append("description", data.description || "");
      formData.append("uploadedBy", user?.email);
      if (data.videoFile && data.videoFile[0]) {
        formData.append("videoFile", data.videoFile[0]);
      }

      const res = await axiosSecure.post("/teacher/videos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: (res) => {
      toast.success(res.message || "Video uploaded successfully!");
      reset();
      setPreview(null);
    },
    onError: () => toast.error("Video upload failed! Please try again."),
  });

  const onSubmit = async (data) => {
    await uploadVideo(data);
  };

  // 📸 Show video preview if selected
  const selectedFile = watch("videoFile");
  React.useEffect(() => {
    if (selectedFile && selectedFile[0]) {
      const fileURL = URL.createObjectURL(selectedFile[0]);
      setPreview(fileURL);
    }
  }, [selectedFile]);

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden mt-10 border  border-gray-200">
      {/* Header */}
      <div className="bg-linear-to-r from-purple-600 to-pink-600 text-white text-center py-6">
        <h2 className="text-3xl font-bold flex justify-center items-center gap-2">
          <UploadCloudIcon size={28} />
          Upload Your Video
        </h2>
        <p className="text-sm opacity-80">Share your programming knowledge with students</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-10" encType="multipart/form-data">
        {/* Language */}
        <div>
          <label className="block font-semibold mb-2 text-gray-700">Language</label>
          <select
            {...register("language")}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 outline-none"
            required
          >
            <option value="">Select Language</option>
            <option>javascript</option>
            <option>python</option>
            <option>c++</option>
            <option>java</option>
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="block font-semibold mb-2 text-gray-700">Category</label>
          <select
            {...register("category")}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 outline-none"
            required
          >
            <option value="">Select Category</option>
            <option>Basics</option>
            <option>OOP</option>
            <option>Projects</option>
            <option>Advanced</option>
          </select>
        </div>

        {/* Title */}
        <div>
          <label className="block font-semibold mb-2 text-gray-700">Video Title</label>
          <input
            {...register("title")}
            type="text"
            placeholder="Enter video title"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 outline-none"
            required
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="block font-semibold mb-2 text-gray-700">Upload Video File</label>
          <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center hover:border-purple-500 transition">
            <input
              {...register("videoFile")}
              type="file"
              accept="video/*"
              className="file-input file-input-bordered w-full"
              required
            />
            <label
              htmlFor="video-upload"
              className="cursor-pointer flex flex-col items-center justify-center text-gray-600"
            >
              <FileVideoIcon size={40} className="text-purple-600 mb-2" />
              <span className="font-semibold">
                {selectedFile && selectedFile[0]
                  ? selectedFile[0].name
                  : "Click to upload your video file"}
              </span>
            </label>
          </div>
        </div>

        {/* Preview */}
        {preview && (
          <div className="mt-4">
            <video src={preview} controls className="rounded-lg w-full shadow-lg" />
          </div>
        )}

        {/* Description */}
        <div>
          <label className="block font-semibold mb-2 text-gray-700">Description</label>
          <textarea
            {...register("description")}
            placeholder="Write a short description about the video"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 outline-none h-24"
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3 text-white font-semibold rounded-lg bg-linear-to-r from-purple-600 to-pink-600 shadow-md hover:shadow-lg hover:scale-[1.03] transition-all flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <Loader2Icon size={20} className="animate-spin" /> Uploading...
            </>
          ) : (
            <>
              <UploadCloudIcon size={20} /> Upload Video
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default UploadVideo;

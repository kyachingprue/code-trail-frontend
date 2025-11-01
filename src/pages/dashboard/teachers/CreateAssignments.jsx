import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";
import { UploadCloudIcon, Loader2Icon } from "lucide-react";

const CreateAssignments = () => {
  const { register, handleSubmit, reset } = useForm();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const { mutateAsync: createAssignment, isPending } = useMutation({
    mutationFn: async (data) => {
      const formData = new FormData();
      formData.append("language", data.language);
      formData.append("title", data.title);
      formData.append("description", data.description || "");
      formData.append("uploadedBy", user?.email);

      const res = await axiosSecure.post("/assignments", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: (res) => {
      toast.success(res.message || "Assignment created successfully!");
      reset();
    },
    onError: () => toast.error("Failed to create assignment!"),
  });

  const onSubmit = async (data) => {
    await createAssignment(data);
  };


  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden mt-10 border border-gray-200">
      <div className="bg-purple-600 text-white text-center py-6">
        <h2 className="text-3xl font-bold flex justify-center items-center gap-2">
          <UploadCloudIcon size={28} />
          Create Programming Assignment
        </h2>
        <p className="text-sm opacity-80">
          Share a programming exercise with your students
        </p>
      </div>

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
            <option>JavaScript</option>
            <option>Python</option>
            <option>C++</option>
            <option>Java</option>
            <option>React</option>
          </select>
        </div>

        {/* Title */}
        <div>
          <label className="block font-semibold mb-2 text-gray-700">Assignment Title</label>
          <input
            {...register("title")}
            type="text"
            placeholder="Enter assignment title"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 outline-none"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-semibold mb-2 text-gray-700">Description / Problem Statement</label>
          <textarea
            {...register("description")}
            placeholder="Describe the programming assignment or provide instructions"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 outline-none h-32"
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3 text-white font-semibold rounded-lg bg-purple-600 hover:bg-purple-700 shadow-md hover:shadow-lg hover:scale-[1.03] transition-all flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <Loader2Icon size={20} className="animate-spin" /> Creating...
            </>
          ) : (
            <>
              <UploadCloudIcon size={20} /> Create Assignment
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateAssignments;

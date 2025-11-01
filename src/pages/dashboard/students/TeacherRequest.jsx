import React from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  UserPlusIcon,
  Code2Icon,
  MailIcon,
  BookOpenIcon,
  SendIcon,
} from "lucide-react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const TeacherRequest = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { register, handleSubmit, reset } = useForm();

  // POST request mutation
  const { mutateAsync: sendRequest } = useMutation({
    mutationFn: async (requestData) => {
      const res = await axiosSecure.post("/teacher-requests", requestData);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Teacher request sent successfully!");
      queryClient.invalidateQueries(["teacherRequests"]);
      reset();
    },
    onError: () => {
      toast.error("Something went wrong! Try again.");
    },
  });


  // Submit handler
  const onSubmit = async (data) => {
    const newRequest = {
      ...data,
      status: "Pending",
      created_at: new Date(),
    };
    await sendRequest(newRequest);
  };

  return (
    <div className="p-6 md:p-10 bg-gray-100 min-h-screen">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          Request a <span className="text-fuchsia-600">Programming Teacher</span>
        </h1>
        <p className="text-gray-600 mt-2 text-sm md:text-base">
          Submit your request to get a mentor for your programming course.
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-3xl mx-auto hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <UserPlusIcon className="text-fuchsia-600" size={26} />
          <h2 className="text-lg font-bold text-gray-800">Send Request</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <input
            {...register("name", { required: true })}
            type="text"
            defaultValue={user?.displayName}
            placeholder="Full Name"
            className="input input-bordered w-full"
          />
          <input
            {...register("email", { required: true })}
            type="email"
            defaultValue={user?.email}
            placeholder="Email Address"
            className="input input-bordered w-full"
          />
          <select
            {...register("course", { required: true })}
            className="select select-bordered w-full"
          >
            <option value="">Select Programming Course</option>
            <option value="Python">Python Development</option>
            <option value="JavaScript">JavaScript</option>
            <option value="React.js">React.js</option>
            <option value="MERN Stack">MERN Stack</option>
            <option value="Full Stack">Full Stack Development</option>
          </select>
          <textarea
            {...register("message")}
            placeholder="Write your message..."
            className="textarea textarea-bordered w-full"
          ></textarea>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-fuchsia-600 to-purple-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
          >
            <SendIcon size={18} />
            Send Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default TeacherRequest;

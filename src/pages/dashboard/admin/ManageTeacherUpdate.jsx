import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../components/LoadingSpinner";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ManageTeacherUpdate = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 🔹 Fetch teacher by ID
  const {
    data: teacher,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["teacher", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/admin/teachers/${id}`);
      return res.data;
    },
  });

  // 🔹 Setup form
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (teacher) reset(teacher);
  }, [teacher, reset]);

  // 🔹 Update teacher mutation
  const mutation = useMutation({
    mutationFn: async (data) => {
      const res = await axiosSecure.put(`/admin/teachers/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Teacher updated successfully!");
      queryClient.invalidateQueries(["teachers"]);
      navigate("/dashboard/admin/teachers");
    },
    onError: (err) => {
      console.error(err);
      toast.error("Failed to update teacher.");
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  if (isLoading) return <LoadingSpinner />;
  if (error)
    return (
      <p className="text-center text-red-500">Failed to load teacher data.</p>
    );

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-10">
      <h2 className="text-3xl font-bold text-center mb-6 bg-linear-to-r from-blue-500 to-green-600 bg-clip-text text-transparent">
        Update Teacher Information
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        {/* Name */}
        <div>
          <label className="block font-semibold mb-1">Name</label>
          <input
            type="text"
            {...register("name")}
            className="input input-bordered w-full"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block font-semibold mb-1">Email</label>
          <input
            type="email"
            {...register("email")}
            className="input input-bordered w-full"
            readOnly
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block font-semibold mb-1">Gender</label>
          <select
            {...register("gender")}
            className="select select-bordered w-full"
          >
            <option>Male</option>
            <option>Female</option>
          </select>
        </div>

        {/* Age */}
        <div>
          <label className="block font-semibold mb-1">Age</label>
          <input
            type="number"
            {...register("age")}
            className="input input-bordered w-full"
          />
        </div>

        {/* Mobile */}
        <div>
          <label className="block font-semibold mb-1">Mobile Number</label>
          <input
            type="text"
            {...register("mobileNumber")}
            className="input input-bordered w-full"
          />
        </div>

        {/* Country */}
        <div>
          <label className="block font-semibold mb-1">Country</label>
          <input
            type="text"
            {...register("country")}
            className="input input-bordered w-full"
          />
        </div>

        {/* Division */}
        <div>
          <label className="block font-semibold mb-1">Division</label>
          <input
            type="text"
            {...register("division")}
            className="input input-bordered w-full"
          />
        </div>

        {/* District */}
        <div>
          <label className="block font-semibold mb-1">District</label>
          <input
            type="text"
            {...register("district")}
            className="input input-bordered w-full"
          />
        </div>

        {/* Specialization */}
        <div>
          <label className="block font-semibold mb-1">Specialization</label>
          <input
            type="text"
            {...register("specialization")}
            className="input input-bordered w-full"
          />
        </div>

        {/* Experience */}
        <div>
          <label className="block font-semibold mb-1">Experience (years)</label>
          <input
            type="number"
            {...register("experience")}
            className="input input-bordered w-full"
          />
        </div>

        {/* Profile Image */}
        <div className="md:col-span-2">
          <label className="block font-semibold mb-1">Profile Image URL</label>
          <input
            type="text"
            {...register("image")}
            className="input input-bordered w-full"
          />
        </div>

        <div className="md:col-span-2 mt-6 flex justify-center">
          <button
            type="submit"
            className="btn btn-primary px-8 text-white text-lg"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Updating..." : "Update Teacher"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManageTeacherUpdate;

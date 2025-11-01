import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FaFan } from "react-icons/fa";
import { useState } from "react";
import useAuth from "../hooks/useAuth";


export default function Login() {
  const { userLogin } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // React Query Mutation using userLogin
  const mutation = useMutation({
    mutationFn: async ({ email, password }) => {
      return await userLogin(email, password);
    },
    onSuccess: () => {
      toast.success("Login successful ");
      navigate("/");
    },
    onError: (error) => {
      let message = "Invalid email or password";
      if (error.message?.includes("auth/invalid-credential")) {
        message = "Email or password is incorrect.";
      } else if (error.message?.includes("auth/user-not-found")) {
        message = "No account found with this email.";
      } else if (error.message?.includes("auth/wrong-password")) {
        message = "Incorrect password.";
      }
      setServerError(message);
      toast.error(message);
    },
  });

  const onSubmit = (data) => {
    setServerError("");
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1625] text-white px-4">
      <div className="w-full max-w-5xl bg-[#241f33] rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Side - Image */}
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80"
            alt="Desert"
            className="object-cover w-full h-full opacity-80"
          />
          <div className="absolute inset-0 bg-linear-to-b from-transparent to-[#1a1625]/70 flex flex-col justify-end p-8">
            <h1 className="text-2xl font-semibold">Capturing Moments,</h1>
            <h2 className="text-xl text-gray-300">Creating Memories</h2>
          </div>
          <div className="absolute top-4 left-4 text-2xl font-bold">AMU</div>
          <Link to="/">
            <button className="absolute top-4 right-4 bg-white/25 hover:bg-white/20 text-sm px-3 py-1 rounded-full transition">
              Back to website →
            </button>
          </Link>
        </div>

        {/* Right Side - Login Form */}
        <div className="p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-semibold mb-2">Welcome back</h2>
          <p className="text-sm text-gray-400 mb-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-indigo-400 hover:underline">
              Sign up
            </Link>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="font-medium">Email</label>
              <input
                type="email"
                placeholder="Email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email format",
                  },
                })}
                className={`w-full bg-[#2e2940] border ${errors.email ? "border-red-500" : "border-[#3a3450]"
                  } rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="font-medium">Password</label>
              <input
                type="password"
                placeholder="Password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className={`w-full bg-[#2e2940] border ${errors.password ? "border-red-500" : "border-[#3a3450]"
                  } rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Server Error */}
            {serverError && (
              <p className="text-red-500 text-sm mt-1">{serverError}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-indigo-500 hover:bg-indigo-600 transition rounded-lg py-2 font-medium "
            >
              {mutation.isPending ? <FaFan className="animate-spin mx-auto text-2xl text-white" /> : "Log in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

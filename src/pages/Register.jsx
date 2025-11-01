import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";
import { FaFan } from "react-icons/fa";
import useAxiosSecure from "../hooks/useAxiosSecure";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { createUser, userProfileUpdate } = useAuth();
  const [imagePreview, setImagePreview] = useState([]);
  const axiosSecure = useAxiosSecure();
  const imgbbApiKey = import.meta.env.VITE_IMGBB_API_KEY;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      let imageUrl = null;

      // 🔹 Upload image to ImgBB
      if (formData.image && formData.image[0]) {
        const imageFile = formData.image[0];
        const imageData = new FormData();
        imageData.append("image", imageFile);
        const res = await axios.post(
          `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
          imageData
        );
        imageUrl = res.data.data.url;
      }

      // 🔹 Create Firebase user
      const result = await createUser(formData.email, formData.password);
      const user = result.user;
      console.log("user data-->", user);

      // 🔹 Update Firebase profile
      await userProfileUpdate({
        displayName: formData.name,
        photoURL: imageUrl,
      });

      // 🔹 Save user data to MongoDB
      const saveUserData = {
        name: formData.name,
        gender: formData.gender,
        yourOld: formData.yourOld,
        mobileNumber: formData.mobileNumber,
        country: formData.country,
        division: formData.division,
        district: formData.district,
        village: formData.village,
        guardianName: formData.guardianName,
        birthday: formData.birthday,
        email: formData.email,
        image: imageUrl,
        role: "student",
        createdAt: new Date(),
        last_login: new Date(),
      };

      await axiosSecure.post("/students/register", saveUserData);
      toast.success("🎓 Registration successful!");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 2); // Only 2 files
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreview(previews);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#0a001f] via-[#130849] to-[#050016] text-white">
      <div className="backdrop-blur-xl my-4 md:my-10 bg-white/10 border border-white/20 rounded-2xl p-10 shadow-2xl w-full md:max-w-5xl mx-3">
        <h2 className="text-xl md:text-3xl font-bold text-center tracking-wide bg-linear-to-r from-white to-blue-400 bg-clip-text text-transparent">
          🎓 Student Registration
        </h2>
        <p className="text-center pb-8 text-gray-300 pt-2">Already have an account! <Link to='/login' className="text-blue-400 hover:text-blue-600 hover:underline">Login</Link></p>

        <form
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex pb-3 flex-col md:flex-row gap-5 justify-between items-center w-full">
            {/* 🔹 Name */}
            <div className="w-full">
              <label className="block mb-1 text-sm text-gray-300">Full Name</label>
              <input
                type="text"
                {...register("name", { required: "Full name is required" })}
                placeholder="Enter your full name"
                className="w-full p-3 rounded-lg bg-[#100e2c] border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 outline-none transition"
              />
              {errors.name && (
                <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* 🔹 Gender */}
            <div className="w-full">
              <label className="block mb-1 text-sm text-gray-300">Gender</label>
              <select
                {...register("gender", { required: "Gender is required" })}
                className="w-full p-3 rounded-lg bg-[#100e2c] border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 outline-none transition"
              >
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
              </select>
              {errors.gender && (
                <p className="text-red-400 text-sm mt-1">{errors.gender.message}</p>
              )}
            </div>
          </div>

          <div className="flex pb-3 flex-col md:flex-row gap-5 justify-between items-center w-full">
            {/* 🔹 Age */}
            <div className="w-full">
              <label className="block mb-1 text-sm text-gray-300">Your Age</label>
              <input
                type="number"
                {...register("yourOld", { required: "Age is required" })}
                placeholder="Enter your age"
                className="w-full p-3 rounded-lg bg-[#100e2c] border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 outline-none transition"
              />
              {errors.yourOld && (
                <p className="text-red-400 text-sm mt-1">{errors.yourOld.message}</p>
              )}
            </div>

            {/* 🔹 Mobile */}
            <div className="w-full">
              <label className="block mb-1 text-sm text-gray-300">Mobile Number</label>
              <input
                type="text"
                {...register("mobileNumber", { required: "Mobile number is required" })}
                placeholder="Enter your mobile number"
                className="w-full p-3 rounded-lg bg-[#100e2c] border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 outline-none transition"
              />
              {errors.mobileNumber && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.mobileNumber.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex pb-3 flex-col md:flex-row gap-5 justify-between items-center w-full">
            {/* 🔹 Country */}
            <div className="w-full">
              <label className="block mb-1 text-sm text-gray-300">Country</label>
              <input
                type="text"
                {...register("country")}
                placeholder="Enter country"
                className="w-full p-3 rounded-lg bg-[#100e2c] border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 outline-none transition"
              />
            </div>

            {/* 🔹 Division */}
            <div className="w-full">
              <label className="block mb-1 text-sm text-gray-300">Division</label>
              <input
                type="text"
                {...register("division")}
                placeholder="Enter division"
                className="w-full p-3 rounded-lg bg-[#100e2c] border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 outline-none transition"
              />
            </div>
          </div>

          <div className="flex pb-3 flex-col md:flex-row gap-5 justify-between items-center w-full">
            {/* 🔹 District */}
            <div className="w-full">
              <label className="block mb-1 text-sm text-gray-300">District</label>
              <input
                type="text"
                {...register("district")}
                placeholder="Enter district"
                className="w-full p-3 rounded-lg bg-[#100e2c] border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 outline-none transition"
              />
            </div>

            {/* 🔹 Village */}
            <div className="w-full">
              <label className="block mb-1 text-sm text-gray-300">Village</label>
              <input
                type="text"
                {...register("village")}
                placeholder="Enter village"
                className="w-full p-3 rounded-lg bg-[#100e2c] border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 outline-none transition"
              />
            </div>
          </div>

          <div className="flex pb-3 flex-col md:flex-row gap-5 justify-between items-center w-full">
            {/* 🔹 Guardian */}
            <div className="w-full">
              <label className="block mb-1 text-sm text-gray-300">Guardian Name</label>
              <input
                type="text"
                {...register("guardianName")}
                placeholder="Enter guardian name"
                className="w-full p-3 rounded-lg bg-[#100e2c] border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 outline-none transition"
              />
            </div>

            {/* 🔹 Birthday */}
            <div className="w-full">
              <label className="block mb-1 text-sm text-gray-300">Birthday</label>
              <input
                type="date"
                {...register("birthday")}
                className="w-full p-3 rounded-lg bg-[#100e2c] border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 outline-none transition"
              />
            </div>
          </div>

          <div className="flex pb-3 flex-col md:flex-row gap-5 justify-between items-center w-full">
            {/* 🔹 Email */}
            <div className="w-full">
              <label className="block mb-1 text-sm text-gray-300">Email Address</label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email format",
                  },
                })}
                placeholder="Enter your email"
                className="w-full p-3 rounded-lg bg-[#100e2c] border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 outline-none transition"
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* 🔹 Password */}
            <div className="w-full">
              <label className="block mb-1 text-sm text-gray-300">Password</label>
              <input
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                    message:
                      "Password must contain 1 uppercase, 1 lowercase & 1 number",
                  },
                })}
                placeholder="Enter password"
                className="w-full p-3 rounded-lg bg-[#100e2c] border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 outline-none transition"
              />
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>
          </div>

          {/* 🔹 Image Upload */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <label className="block mb-1 text-sm text-gray-300">Profile Image</label>
            <input
              type="file"
              accept="image/*"
              {...register("image")}
              multiple
              onChange={handleImageChange}
              className="w-full p-2 rounded-lg bg-[#100e2c] border border-gray-600"
            />
            <div className="flex gap-3 mt-3">
              {imagePreview.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt="Preview"
                  className="w-24 h-24 rounded-full border-2 border-blue-500 object-cover"
                />
              ))}
            </div>
          </div>

          {/* 🔹 Submit */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-5 py-3 bg-linear-to-r from-blue-600 to-purple-600 hover:from-purple-700 hover:to-blue-700 rounded-lg text-lg font-semibold tracking-wide shadow-lg transition-all duration-300"
            >
              {loading ? <FaFan className="animate-spin mx-auto text-2xl text-white" /> : "Register Now"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

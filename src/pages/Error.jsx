import { useNavigate, useRouteError } from "react-router-dom";
import { motion } from "motion/react";
import { Code2, ArrowLeftCircle } from "lucide-react";

const Error = () => {
  const navigate = useNavigate();
  const error = useRouteError();

  const handleGoBack = () => navigate(-1);

  const status = error?.status || 404;
  const message =
    status === 401
      ? "You are not authorized to access this section."
      : status === 404
        ? "The page you’re looking for doesn’t exist."
        : "Something went wrong. Please try again later.";

  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center bg-linear-to-br from-purple-900 via-indigo-800 to-purple-700 text-white p-6 overflow-hidden relative">
      {/* background glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 left-1/4 w-96 h-96 bg-purple-500 rounded-full opacity-30 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 right-1/4 w-96 h-96 bg-indigo-500 rounded-full opacity-30 blur-3xl animate-pulse"></div>
      </div>

      {/* code icon */}
      <motion.div
        initial={{ rotate: -10, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white/10 p-5 rounded-2xl shadow-xl backdrop-blur-md mb-6"
      >
        <Code2 size={60} className="text-purple-300" />
      </motion.div>

      {/* error number */}
      <motion.h1
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-8xl md:text-9xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-pink-400 to-purple-300 drop-shadow-lg"
      >
        {status}
      </motion.h1>

      {/* error title */}
      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-3xl md:text-4xl font-bold mt-3"
      >
        {status === 401 ? "Unauthorized Access" : "Page Not Found"}
      </motion.h2>

      {/* error message */}
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-purple-200 mt-3 mb-10 max-w-md mx-auto leading-relaxed"
      >
        {message}
      </motion.p>

      {/* Go Back button */}
      <motion.button
        whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255,255,255,0.4)" }}
        whileTap={{ scale: 0.95 }}
        onClick={handleGoBack}
        className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-fuchsia-600 to-purple-600 rounded-full text-white font-semibold tracking-wide hover:from-purple-700 hover:to-fuchsia-700 transition"
      >
        <ArrowLeftCircle size={22} />
        Go Back
      </motion.button>

      {/* little coding tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-10 text-sm text-purple-300 font-mono"
      >
        {"<Keep Coding />"} — Even errors are part of learning 🚀
      </motion.p>
    </div>
  );
};

export default Error;

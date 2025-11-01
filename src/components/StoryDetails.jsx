import { useParams, Link } from "react-router-dom";
import { FaRegCalendarAlt, FaEye, FaRegComment } from "react-icons/fa";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const StoryDetails = () => {
  const { id } = useParams();

  // Fetch all stories using TanStack Query
  const { data: stories = [], isLoading, isError } = useQuery({
    queryKey: ["stories"],
    queryFn: async () => {
      const res = await axios.get("/data.json");
      return res.data;
    },
  });

  // Find the story by id
  const story = stories.find((s) => s.id === parseInt(id));

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <p className="text-gray-400 text-lg animate-pulse">Loading story...</p>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="text-center mt-10 text-red-500 text-lg">
        Failed to load story. Please try again.
      </div>
    );
  }

  // Story not found
  if (!story) {
    return (
      <div className="text-center mt-10 text-lg text-gray-600">
        Story not found 😢
      </div>
    );
  }

  return (
    <div className="container mx-auto md:px-4 py-10 max-w-4xl">
      <img
        src={story.image}
        alt={story.title}
        className="w-full h-60 md:h-[420px] object-cover mt-10 rounded-xl mb-6 shadow-md"
      />

      <h1 className="text-2xl md:text-3xl font-bold text-gray-100 mb-3">
        {story.title}
      </h1>

      <div className="flex items-center text-sm text-gray-300 mb-6 gap-4">
        <span className="flex items-center gap-1">
          <FaRegCalendarAlt /> {story.date}
        </span>
        <span className="flex items-center gap-1">
          <FaEye /> {story.views}
        </span>
        <span className="flex items-center gap-1">
          <FaRegComment /> {story.comments}
        </span>
      </div>

      <div className="space-y-6 leading-relaxed">
        {story.content?.map((c, idx) =>
          idx === 2 ? (
            <blockquote
              key={idx}
              className="border-l-4 border-yellow-500 bg-gray-50 p-4 italic text-gray-600"
            >
              {c}
            </blockquote>
          ) : (
            <p key={idx} className="text-gray-300">
              {c}
            </p>
          )
        )}
      </div>

      <div className="mt-8">
        <Link
          to="/"
          className="btn btn-outline text-white btn-primary normal-case text-sm px-6"
        >
          ← Back to Stories
        </Link>
      </div>
    </div>
  );
};

export default StoryDetails;

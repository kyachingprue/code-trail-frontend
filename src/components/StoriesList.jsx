import { Link } from "react-router-dom";
import { FaRegCalendarAlt, FaEye, FaRegComment } from "react-icons/fa";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";


const StoriesList = () => {

  const { data: stories = [], isLoading, isError } = useQuery({
    queryKey: ["stories"],
    queryFn: async () => {
      const res = await axios.get("/data.json"); // make sure file is in public folder
      return res.data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <p className="text-gray-400 text-lg animate-pulse">Loading stories...</p>
      </div>
    );
  }
  if (isError) {
    return <p className="text-red-500 text-center py-5">Stories data is error</p>
  }

  return (
    <div>
      <div className="py-10 w-8/12 text-center mx-auto">
        <h2 className="text-2xl md:text-4xl pb-4 font-bold text-white">
          The Power of Never Giving Up
        </h2>
        <p className="text-gray-300 w-full md:w-6/12 mx-auto">
          After failing exams twice, he decided to study harder — today, he
          teaches others how perseverance can turn failure into success.
        </p>
      </div>

      <div className="container mx-auto md:px-4 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map((story) => (
          <div
            key={story.id}
            className="bg-white rounded-2xl border-b-4 border-gray-300 shadow-md hover:shadow-xl transition overflow-hidden"
          >
            <img
              src={story.image}
              alt={story.title}
              className="w-full h-56 object-cover"
            />
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {story.title}
              </h3>
              <div className="flex items-center text-sm text-gray-500 mb-3 gap-4">
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
              <p className="text-sm text-gray-600 mb-4">
                {Array.isArray(story.content) ? story.content[0].slice(0, 100) : story.content.slice(0, 100)}...
              </p>
              <Link
                to={`/story/${story.id}`}
                className="text-blue-600 font-semibold hover:text-blue-800 transition"
              >
                LEARN NOW →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoriesList;

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import LoadingSpinner from "../../../components/LoadingSpinner";

const AdminAnnouncements = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm();

  // Fetch announcements
  const { data: announcements = [], isLoading, isError } = useQuery({
    queryKey: ["admin:announcements"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/announcements");
      return res.data;
    },
    onError: (err) => {
      console.error(err);
      toast.error("Failed to load announcements");
    },
  });

  // Create new announcement mutation
  const createAnnouncement = useMutation({
    mutationFn: async (payload) => {
      return axiosSecure.post("/admin/announcements", payload);
    },
    onSuccess: () => {
      toast.success("Announcement sent!");
      queryClient.invalidateQueries({ queryKey: ["admin:announcements"] });
      reset();
    },
    onError: (err) => {
      console.error(err);
      toast.error("Failed to send announcement");
    },
  });

  const onSubmit = (data) => {
    const payload = {
      title: data.title,
      message: data.message,
      sentBy: user?.email || "admin",
      sentAt: new Date().toISOString(),
    };
    createAnnouncement.mutate(payload);
  };

  if (isLoading) return <LoadingSpinner></LoadingSpinner>;
  if (isError) return <div>Failed to load announcements</div>;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Admin Announcements</h2>

      {/* Add new announcement */}
      <div className="mb-6 p-4 bg-white rounded-xl shadow-md">
        <h3 className="text-xl font-semibold mb-3">Send New Announcement</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              {...register("title", { required: true })}
              className="w-full border px-3 py-2 rounded-lg focus:ring focus:ring-blue-300"
              placeholder="Announcement title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Message</label>
            <textarea
              {...register("message", { required: true })}
              className="w-full border px-3 py-2 rounded-lg focus:ring focus:ring-blue-300"
              placeholder="Announcement message"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Send
          </button>
        </form>
      </div>

      {/* Announcement cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {announcements.length === 0 ? (
          <div className="text-gray-500 italic col-span-full">
            No announcements yet
          </div>
        ) : (
          announcements
            .slice()
            .reverse()
            .map((a) => (
              <div
                key={a._id}
                className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition"
              >
                <h4 className="font-semibold text-lg">{a.title}</h4>
                <p className="text-gray-700 mt-1">{a.message}</p>
                <div className="text-xs text-gray-400 mt-2">
                  Sent by: {a.sentBy} <br />
                  {new Date(a.sentAt).toLocaleString()}
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default AdminAnnouncements;

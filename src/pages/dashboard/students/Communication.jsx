import React, { useState, useEffect } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Send, MessageSquare, PlusCircle, X } from "lucide-react";
import { toast } from "react-hot-toast";

const Communication = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [teacherEmail, setTeacherEmail] = useState("");

  const { data: teachers = [], isLoading } = useQuery({
    queryKey: ["teachersConversations", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/conversations/${user?.email}`);
      return res.data.filter((t) => t.email !== user?.email);
    },
    enabled: !!user?.email,
  });

  useEffect(() => {
    if (!selectedTeacher) return;
    axiosSecure
      .get(`/messages/${user?.email}/${selectedTeacher?.email}`)
      .then((res) => setMessages(res.data))
      .catch((err) => console.error(err));
  }, [selectedTeacher, user?.email, axiosSecure]);

  const sendMessage = useMutation({
    mutationFn: async (msg) => {
      await axiosSecure.post("/messages", msg);
    },
    onSuccess: () => {
      toast.success("Message sent!");
      setMessage("");
      queryClient.invalidateQueries(["teachersConversations", user?.email]);
      if (selectedTeacher) {
        axiosSecure
          .get(`/messages/${user?.email}/${selectedTeacher?.email}`)
          .then((res) => setMessages(res.data));
      }
    },
  });

  const handleSend = (e) => {
    e.preventDefault();
    if (!selectedTeacher) return toast.error("Select a teacher first!");
    if (!message.trim()) return;

    sendMessage.mutate({
      senderEmail: user?.email,
      receiverEmail: selectedTeacher.email,
      message,
    });
  };

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    if (!teacherEmail.trim()) return toast.error("Enter a teacher email!");

    const exists = teachers.some((t) => t.email === teacherEmail.trim());
    if (exists) return toast.error("This teacher is already added.");

    try {
      const res = await axiosSecure.post("/addTeacher", {
        studentEmail: user?.email,
        teacherEmail,
      });

      if (res.data.success) {
        toast.success("Teacher added successfully!");
        queryClient.invalidateQueries(["teachersConversations", user?.email]);
        setShowAddModal(false);
        setTeacherEmail("");
      } else {
        toast.error(res.data.message || "Failed to add teacher.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error adding teacher.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-50px)] bg-gray-50 rounded-xl overflow-hidden shadow">
      {/* Sidebar */}
      <div className="md:w-1/3 w-full bg-white border-r border-gray-200 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b bg-indigo-600 text-white">
          <span className="font-semibold text-lg">Teachers</span>
          <button
            onClick={() => setShowAddModal(true)}
            className="text-white hover:text-gray-200 flex items-center gap-1"
          >
            <PlusCircle size={18} /> Add
          </button>
        </div>

        <div className="flex-1 overflow-y-auto max-h-[calc(100vh-150px)]">
          {isLoading ? (
            <p className="text-center text-gray-400 mt-10">Loading...</p>
          ) : teachers.length === 0 ? (
            <p className="text-center text-gray-400 mt-10">No teachers yet</p>
          ) : (
            teachers.map((t) => (
              <div
                key={t._id || t.email}
                onClick={() => setSelectedTeacher(t)}
                className={`flex items-center justify-between p-3 cursor-pointer hover:bg-indigo-50 transition-colors ${selectedTeacher?.email === t.email ? "bg-indigo-100" : "bg-white"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold">
                    {t.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-medium text-gray-800 truncate">{t.name}</p>
                    <p className="text-sm text-gray-500 truncate w-36 md:w-40">
                      {t.lastMessage || "Tap to start chat"}
                    </p>
                  </div>
                </div>
                {t.lastTime && (
                  <p className="text-xs text-gray-400 hidden md:block">
                    {new Date(t.lastTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col w-full md:w-auto">
        <div className="p-4 bg-white border-b flex items-center gap-3">
          {selectedTeacher ? (
            <>
              <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold">
                {selectedTeacher.name?.charAt(0).toUpperCase()}
              </div>
              <div className="truncate">
                <h2 className="font-semibold text-gray-800 truncate">
                  {selectedTeacher.name}
                </h2>
                <p className="text-sm text-gray-500 truncate">{selectedTeacher.email}</p>
              </div>
            </>
          ) : (
            <p className="text-gray-500 flex items-center gap-2">
              <MessageSquare size={18} /> Select a teacher to start chatting
            </p>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 bg-gray-100 p-4 overflow-y-auto max-h-[calc(100vh-200px)]">
          {selectedTeacher ? (
            messages.length === 0 ? (
              <p className="text-center text-gray-400 mt-10">No messages yet</p>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`flex mb-2 ${msg.senderEmail === user.email ? "justify-end" : "justify-start"
                    }`}
                >
                  <div
                    className={`px-4 py-2 rounded-2xl max-w-xs wrap-break-word ${msg.senderEmail === user.email
                      ? "bg-indigo-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none"
                      }`}
                  >
                    <p>{msg.message}</p>
                    <p className="text-[10px] opacity-70 mt-1 text-right">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))
            )
          ) : (
            <p className="text-gray-400 text-center mt-20">
              Select a teacher to view messages
            </p>
          )}
        </div>

        {/* Message Input */}
        {selectedTeacher && (
          <form
            onSubmit={handleSend}
            className="p-3 bg-white border-t flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full"
            >
              <Send size={18} />
            </button>
          </form>
        )}
      </div>

      {/* Modal - Add Teacher */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              Add Teacher by Email
            </h2>
            <form onSubmit={handleAddTeacher} className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Enter teacher email"
                value={teacherEmail}
                onChange={(e) => setTeacherEmail(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition"
              >
                Add Teacher
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Communication;

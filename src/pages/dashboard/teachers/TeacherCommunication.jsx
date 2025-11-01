import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import { Send, MessageSquare, PlusCircle, X } from "lucide-react";
import { toast } from "react-hot-toast";

const TeacherCommunication = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [selectedPartner, setSelectedPartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [studentEmail, setStudentEmail] = useState("");

  // ✅ Fetch all conversation partners (students)
  const { data: partners = [], refetch: fetchPartners } = useQuery({
    queryKey: ["partnersConversations", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/conversations/${user?.email}`);
      return res.data.filter(p => p.email !== user?.email);
    },
    enabled: !!user?.email,
  });

  // ✅ Fetch messages for selected partner
  useEffect(() => {
    if (!selectedPartner) return;

    axiosSecure
      .get(`/messages/${user?.email}/${selectedPartner?.email}`)
      .then(res => setMessages(res.data))
      .catch(err => {
        console.error(err);
        toast.error("Failed to load messages");
      });
  }, [selectedPartner, user?.email, axiosSecure]);

  // ✅ Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (msg) => await axiosSecure.post("/messages", msg),
    onSuccess: async () => {
      toast.success("Message sent!");
      setMessage("");
      if (selectedPartner) {
        const res = await axiosSecure.get(`/messages/${user?.email}/${selectedPartner.email}`);
        setMessages(res.data);
      }
      await fetchPartners();
    },
    onError: () => toast.error("Failed to send message"),
  });

  const handleSend = (e) => {
    e.preventDefault();
    if (!selectedPartner) return toast.error("Select a student first");
    if (!message.trim()) return;

    sendMessageMutation.mutate({
      senderEmail: user?.email,
      receiverEmail: selectedPartner.email,
      message,
    });
  };

  // ✅ Add student
  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!studentEmail.trim()) return toast.error("Enter student email");

    const exists = partners.find(p => p.email === studentEmail.trim());
    if (exists) return toast.error("Student already added");

    try {
      const res = await axiosSecure.post("/addStudent", {
        teacherEmail: user?.email.trim().toLowerCase(),
        studentEmail: studentEmail.trim().toLowerCase(),
      });

      if (res.data.success) {
        toast.success("Student added successfully!");
        setStudentEmail("");
        setShowAddModal(false);
        fetchPartners();
      } else {
        toast.error(res.data.message || "Failed to add student");
      }
    } catch (err) {
      toast.error("Server error", err.message);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-50px)] bg-gray-50 rounded-xl overflow-hidden shadow">
      {/* Sidebar */}
      <div className="md:w-1/3 w-full bg-white border-r border-gray-200 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b bg-indigo-600 text-white font-semibold">
          Students
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-1">
            <PlusCircle size={18} /> Add
          </button>
        </div>
        <div className="flex-1 overflow-y-auto max-h-[calc(100vh-150px)]">
          {partners.length === 0 ? (
            <p className="text-center text-gray-400 mt-10">No students yet</p>
          ) : (
            partners.map(p => (
              <div
                key={p.email}
                onClick={() => setSelectedPartner(p)}
                className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-indigo-50 ${selectedPartner?.email === p.email ? "bg-indigo-100" : "bg-white"}`}
              >
                <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold">
                  {p.name?.charAt(0).toUpperCase() || p.email.charAt(0).toUpperCase()}
                </div>
                <div className="truncate">
                  <p className="font-medium text-gray-800 truncate">{p.name || p.email}</p>
                  <p className="text-sm text-gray-500 truncate w-36 md:w-40">{p.lastMessage || "Start chat"}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col w-full md:w-auto">
        <div className="p-4 bg-white border-b flex items-center gap-3">
          {selectedPartner ? (
            <>
              <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold">
                {selectedPartner.name?.charAt(0).toUpperCase() || selectedPartner.email.charAt(0).toUpperCase()}
              </div>
              <div className="truncate">
                <h2 className="font-semibold text-gray-800 truncate">{selectedPartner.name || selectedPartner.email}</h2>
                <p className="text-sm text-gray-500 truncate">{selectedPartner.email}</p>
              </div>
            </>
          ) : (
            <p className="text-gray-500 flex items-center gap-2">
              <MessageSquare size={18} /> Select a student to start chat
            </p>
          )}
        </div>

        <div className="flex-1 bg-gray-100 p-4 overflow-y-auto max-h-[calc(100vh-200px)]">
          {selectedPartner ? (
            messages.length === 0 ? (
              <p className="text-center text-gray-400 mt-10">No messages yet</p>
            ) : (
              messages.map(msg => (
                <div
                  key={msg._id}
                  className={`flex mb-2 ${msg.senderEmail === user.email ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`px-4 py-2 rounded-2xl max-w-xs wrap-break-word ${msg.senderEmail === user.email
                      ? "bg-indigo-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none"
                      }`}
                  >
                    <p>{msg.message}</p>
                    <p className="text-[10px] opacity-70 mt-1 text-right">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))
            )
          ) : (
            <p className="text-gray-400 text-center mt-20">Select a student to view messages</p>
          )}
        </div>

        {selectedPartner && (
          <form onSubmit={handleSend} className="p-3 bg-white border-t flex items-center gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full">
              <Send size={18} />
            </button>
          </form>
        )}
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm relative">
            <button onClick={() => setShowAddModal(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
              <X size={18} />
            </button>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">Add Student by Email</h2>
            <form onSubmit={handleAddStudent} className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Enter student email"
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition">
                Add Student
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherCommunication;

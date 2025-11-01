import React, { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import {
  HomeIcon,
  BookOpenIcon,
  ChartPieIcon,
  MenuIcon,
  XIcon,
  UsersIcon,
  BriefcaseIcon,
  SettingsIcon,
  ShieldCheckIcon,
  ClipboardCheckIcon,
  CalendarCheckIcon,
  MegaphoneIcon,
  UserRoundIcon,
  LayoutDashboardIcon,
  FileTextIcon,
  FileSpreadsheetIcon,
  GraduationCapIcon,
  FolderOpenIcon,
  MessageSquareIcon,
  BarChart3Icon,
  UserCircleIcon,
} from "lucide-react";
import useRole from "../hooks/useRole";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // ✅ Get role dynamically
  const { role, isLoading } = useRole();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // ✅ Role-based NavLinks
  const navLinksByRole = {
    student: [
      { name: "Dashboard", path: "/dashboard/student/student-dashboard", icon: <HomeIcon size={18} /> },
      { name: "My Courses", path: "/dashboard/student/my-courses", icon: <ClipboardCheckIcon size={18} /> },
      { name: "Upcoming Tasks", path: "/dashboard/student/upcoming-tasks", icon: <BookOpenIcon size={18} /> },
      { name: "Assignments", path: "/dashboard/student/assignments", icon: <ClipboardCheckIcon size={18} /> },
      { name: "View Grades", path: "/dashboard/student/view-grades", icon: <ChartPieIcon size={18} /> },
      { name: "Announcements", path: "/dashboard/student/student-announcements", icon: <MegaphoneIcon size={18} /> },
      { name: "Communication", path: "/dashboard/student/communication", icon: <MegaphoneIcon size={18} /> },
      { name: "Teacher Request", path: "/dashboard/student/teacher-request", icon: <MegaphoneIcon size={18} /> },
      { name: "Student Profile", path: "/profile", icon: <UserRoundIcon size={18} /> },
    ],
    teacher: [
      { name: "Dashboard", path: "/dashboard/teacher-dashboard", icon: <LayoutDashboardIcon size={18} /> },
      { name: "Upload Video", path: "/dashboard/teacher/upload-video", icon: <BookOpenIcon size={18} /> },
      { name: "My Uploaded Video", path: "/dashboard/teacher/my-upload-video", icon: <FileSpreadsheetIcon size={18} /> },
      { name: "Create Assignments", path: "/dashboard/teacher/create-assignments", icon: <FileTextIcon size={18} /> },
      { name: "Uploaded Assignments", path: "/dashboard/teacher/uploaded-assignments", icon: <FileTextIcon size={18} /> },
      { name: "Student Grades", path: "/dashboard/teacher/student-grades", icon: <GraduationCapIcon size={18} /> },
      { name: "Announcements", path: "/dashboard/teacher/announcements", icon: <MegaphoneIcon size={18} /> },
      { name: "Communication", path: "/dashboard/teacher/teacher-communication", icon: <MessageSquareIcon size={18} /> },
      { name: "Teacher Profile", path: "/profile", icon: <UserCircleIcon size={18} /> },
    ],
    admin: [
      { name: "Dashboard", path: "/dashboard/admin/admin-dashboard", icon: <HomeIcon size={18} /> },
      { name: "Manage Students", path: "/dashboard/admin/students", icon: <UsersIcon size={18} /> },
      { name: "Manage Teachers", path: "/dashboard/admin/teachers", icon: <BriefcaseIcon size={18} /> },
      { name: "Video Library", path: "/dashboard/admin/video-library", icon: <BookOpenIcon size={18} /> },
      { name: "Quizzes & Exams", path: "/dashboard/admin/quizzes-exams", icon: <GraduationCapIcon size={18} /> },
      { name: "Manage Assignments", path: "/dashboard/admin/manage-assignments", icon: <CalendarCheckIcon size={18} /> },
      { name: "Announcements", path: "/dashboard/admin/announcements", icon: <MegaphoneIcon size={18} /> },
      { name: "Reports & Analytics", path: "/dashboard/admin/reports", icon: <BarChart3Icon size={18} /> },
      { name: "Student Request", path: "/dashboard/admin/student-request", icon: <SettingsIcon size={18} /> },
      { name: "Admin Profile", path: "/profile", icon: <FolderOpenIcon size={18} /> },
    ],
  };

  // Theme colors per role
  const themeColors = {
    student: { sidebar: "#023e7d", text: "#E0E7FF" },
    teacher: { sidebar: "#3a5a40", text: "#E0F2FE" },
    admin: { sidebar: "#30011E", text: "#E2E8F0" },
  };

  const safeRole = role?.toLowerCase?.() || "student";
  const { sidebar, text } = themeColors[safeRole] || themeColors.student;
  const navLinks = navLinksByRole[safeRole] || navLinksByRole.student;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        style={{ backgroundColor: sidebar, color: text }}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/20">
          <Link to='/'>
            <h1 className="text-lg md:text-2xl font-semibold">CodeTrail <span className="text-sm md:text-xl text-lime-400">({role})</span></h1>
          </Link>
          <button className="lg:hidden text-white" onClick={() => setIsSidebarOpen(false)}>
            <XIcon size={22} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col mt-4 space-y-1 px-3">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-md transition-all duration-200 ${isActive ? "bg-white/20 text-white font-medium" : "hover:bg-white/10"
                }`
              }
              onClick={() => setIsSidebarOpen(false)}
            >
              {link.icon}
              <span>{link.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Mobile Toggle */}
      <button
        className="absolute top-4 left-4 z-30 p-2 bg-white shadow rounded-md lg:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <MenuIcon size={22} className="text-gray-700" />
      </button>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;

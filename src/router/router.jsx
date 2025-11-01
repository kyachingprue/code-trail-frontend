import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import StoriesList from "../components/StoriesList";
import StoryDetails from "../components/StoryDetails";
import Profile from "../pages/Profile";
import DashboardLayout from "../layout/DashboardLayout";
import StudentDashboard from "../pages/dashboard/students/StudentDashboard";
import ViewGrades from "../pages/dashboard/students/ViewGrades";
import Communication from "../pages/dashboard/students/Communication";
import TeacherDashboard from "../pages/dashboard/teachers/TeacherDashboard";
import StudentGrades from "../pages/dashboard/teachers/StudentGrades";
import TeacherAnnouncements from "../pages/dashboard/teachers/TeacherAnnouncements";
import AdminDashboard from "../pages/dashboard/admin/AdminDashboard";
import ManageTeachers from "../pages/dashboard/admin/ManageTeachers";
import AdminAnnouncements from "../pages/dashboard/admin/AdminAnnouncements";
import AdminAnalytics from "../pages/dashboard/admin/AdminAnalytics";
import ManageStudents from "../pages/dashboard/admin/ManageStudents";
import MyCourses from "../pages/dashboard/students/MyCourses";
import UpcomingTasks from "../pages/dashboard/students/UpcomingTasks";
import Assignments from "../pages/dashboard/students/Assignments";
import TeacherRequest from "../pages/dashboard/students/TeacherRequest";
import ManageStudentUpdate from "../pages/dashboard/admin/ManageStudentUpdate";
import StudentRequest from "../pages/dashboard/admin/StudentRequest";
import UploadVideo from "../pages/dashboard/teachers/UploadVideo";
import CourseCategories from "../pages/dashboard/students/CourseCategories";
import VideoList from "../pages/dashboard/students/VideoList";
import VideoLibrary from "../pages/dashboard/admin/VideoLibrary";
import QuizzesAndTasks from "../pages/dashboard/admin/QuizzesAndTasks";
import MyUploadVideo from "../pages/dashboard/teachers/MyUploadVideo";
import CreateAssignments from "../pages/dashboard/teachers/CreateAssignments";
import UploadedAssignments from "../pages/dashboard/teachers/UploadedAssignments";
import AllQuizzesAndTasks from "../pages/dashboard/admin/AllQuizzesAndTasks";
import ManageTeacherUpdate from "../pages/dashboard/admin/ManageTeacherUpdate";
import ManageAssignments from "../pages/dashboard/admin/ManageAssignments";
import TeacherCommunication from "../pages/dashboard/teachers/TeacherCommunication";
import StudentAnnouncements from "../pages/dashboard/students/StudentAnnouncements";
import PrivateRoute from "./PrivateRoute";
import TeacherRoute from "./TeacherRoute";
import Error from "../pages/Error";
import AdminRoute from "./AdminRoute";
const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout></MainLayout>,
    children: [
      {
        index: true,
        element: <Home></Home>
      },
      {
        path: "stories",
        element: <StoriesList />
      },
      {
        path: "story/:id",
        element: <StoryDetails />
      },
      {
        path: 'profile',
        element: <Profile></Profile>
      }
    ]
  },
  {
    path: '/dashboard',
    element: <PrivateRoute><DashboardLayout></DashboardLayout></PrivateRoute>,
    children: [
      // Students Dashboard
      {
        path: 'student/student-dashboard',
        element: <PrivateRoute><StudentDashboard></StudentDashboard></PrivateRoute>
      },
      {
        path: 'student/my-courses',
        element: <PrivateRoute><MyCourses></MyCourses></PrivateRoute>
      },
      {
        path: 'student/courses/:language',
        element: <PrivateRoute><CourseCategories></CourseCategories></PrivateRoute>
      },
      {
        path: 'student/courses/:language/:category',
        element: <PrivateRoute><VideoList></VideoList></PrivateRoute>
      },
      {
        path: 'student/upcoming-tasks',
        element: <PrivateRoute><UpcomingTasks></UpcomingTasks></PrivateRoute>
      },
      {
        path: 'student/assignments',
        element: <PrivateRoute><Assignments></Assignments></PrivateRoute>
      },
      {
        path: 'student/view-grades',
        element: <PrivateRoute><ViewGrades></ViewGrades></PrivateRoute>
      },
      {
        path: 'student/student-announcements',
        element: <PrivateRoute><StudentAnnouncements></StudentAnnouncements></PrivateRoute>
      },
      {
        path: 'student/teacher-request',
        element: <PrivateRoute><TeacherRequest></TeacherRequest></PrivateRoute>
      },
      {
        path: 'student/communication',
        element: <PrivateRoute><Communication></Communication></PrivateRoute>
      },
      // Teacher Dashboard
      {
        path: 'teacher-dashboard',
        element: <TeacherRoute><TeacherDashboard></TeacherDashboard></TeacherRoute>
      },
      {
        path: 'teacher/upload-video',
        element: <TeacherRoute><UploadVideo></UploadVideo></TeacherRoute>
      },
      {
        path: 'teacher/create-assignments',
        element: <TeacherRoute><CreateAssignments></CreateAssignments></TeacherRoute>
      },
      {
        path: 'teacher/uploaded-assignments',
        element: <TeacherRoute><UploadedAssignments></UploadedAssignments></TeacherRoute>
      },
      {
        path: 'teacher/my-upload-video',
        element: <TeacherRoute><MyUploadVideo></MyUploadVideo></TeacherRoute>
      },
      {
        path: 'teacher/student-grades',
        element: <TeacherRoute><StudentGrades></StudentGrades></TeacherRoute>
      },
      {
        path: 'teacher/announcements',
        element: <TeacherRoute><TeacherAnnouncements></TeacherAnnouncements></TeacherRoute>
      },
      {
        path: 'teacher/teacher-communication',
        element: <TeacherRoute> <TeacherCommunication></TeacherCommunication></TeacherRoute>
      },
      // Admin dashboard
      {
        path: 'admin/admin-dashboard',
        element: <AdminRoute><AdminDashboard></AdminDashboard></AdminRoute>
      },
      {
        path: 'admin/students',
        element: <AdminRoute><ManageStudents></ManageStudents></AdminRoute>
      },
      {
        path: "admin/manage-students/update/:id",
        element: <AdminRoute><ManageStudentUpdate></ManageStudentUpdate></AdminRoute>
      },
      {
        path: 'admin/teachers',
        element: <AdminRoute><ManageTeachers></ManageTeachers></AdminRoute>
      },
      {
        path: "admin/manage-teachers/update/:id",
        element: <AdminRoute><ManageTeacherUpdate></ManageTeacherUpdate></AdminRoute>
      },
      {
        path: 'admin/quizzes-exams',
        element: <AdminRoute><QuizzesAndTasks></QuizzesAndTasks></AdminRoute>
      },
      {
        path: "admin/all-quizzes-tasks",
        element: <AdminRoute><AllQuizzesAndTasks></AllQuizzesAndTasks></AdminRoute>
      },
      {
        path: 'admin/video-library',
        element: <AdminRoute><VideoLibrary></VideoLibrary></AdminRoute>
      },
      {
        path: 'admin/manage-assignments',
        element: <AdminRoute><ManageAssignments></ManageAssignments></AdminRoute>
      },
      {
        path: 'admin/announcements',
        element: <AdminRoute><AdminAnnouncements></AdminAnnouncements></AdminRoute>
      },
      {
        path: 'admin/reports',
        element: <AdminRoute><AdminAnalytics></AdminAnalytics></AdminRoute>
      },
      {
        path: 'admin/student-request',
        element: <AdminRoute><StudentRequest></StudentRequest></AdminRoute>
      },
    ]
  },
  {
    path: '/login',
    element: <Login></Login>
  },
  {
    path: '/register',
    element: <Register></Register>
  },
  {
    path: '*',
    element: <Error></Error>
  }
])

export default router;
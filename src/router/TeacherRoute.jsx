import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useRole from "../hooks/useRole";

const TeacherRoute = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const { role, isLoading } = useRole();
  const location = useLocation();

  if (authLoading || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }

  if (!user || role !== "teacher") {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return children;
};

export default TeacherRoute;

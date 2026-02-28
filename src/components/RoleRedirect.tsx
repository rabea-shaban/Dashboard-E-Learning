import { Navigate } from "react-router-dom";
import { useUserProfile } from "../hooks/useUserProfile";

export default function RoleRedirect() {
  const profile = useUserProfile();
  const token = localStorage.getItem("authToken");

  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!profile) return null;

  if (profile.role === "admin" || profile.role === "instructor") {
    return <Navigate to="/dashboard" replace />;
  }

  if (profile.role === "student") {
    return <Navigate to="/student" replace />;
  }

  return <Navigate to="/auth/login" replace />;
}
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import AuthLayout from "./AuthLayout";
import StudentLayout from "./StudentLayout";
import ProtectedRoute from "./ProtectedRoute";

import Home from "../pages/Home";
import Courses from "../pages/Courses";
import Students from "../pages/Students";
import Analytics from "../pages/Analytics";
import Settings from "../pages/Settings";
import AdminSettings from "../pages/AdminSettings";

import Login from "../pages/Login";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";

import StudentDashboard from "../pages/StudentDashboard";
import StudentCourses from "../pages/StudentCourses";
import CourseView from "../pages/CourseView";
import StudentCertificates from "../pages/StudentCertificates";
import StudentSchedule from "../pages/StudentSchedule";
import StudentSettings from "../pages/StudentSettings";
import BrowseCourses from "../pages/BrowseCourses";
import Checkout from "../pages/Checkout";

import { useAuth } from "../context/AuthContext";
import RoleRedirect from "./RoleRedirect";

const Router = () => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return (
    <Routes>
      <Route
        path="/auth"
        element={user ? <Navigate to="/" replace /> : <AuthLayout />}
      >
        <Route index element={<Login />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      <Route path="/" element={<RoleRedirect />} />

      {/* Admin + Instructor */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin", "instructor"]}>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="courses" element={<Courses />} />
        <Route path="students" element={<Students />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Admin Only */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* Student Dashboard */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<StudentDashboard />} />
        <Route path="browse" element={<BrowseCourses />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="courses" element={<StudentCourses />} />
        <Route path="courses/:courseId" element={<CourseView />} />
        <Route path="certificates" element={<StudentCertificates />} />
        <Route path="schedule" element={<StudentSchedule />} />
        <Route path="settings" element={<StudentSettings />} />
      </Route>

      {/* Not found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Router;

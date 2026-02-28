import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  BookOpen,
  GraduationCap,
  Calendar,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ShoppingBag,
  Award,
} from "lucide-react";
import { useUserProfile } from "../hooks/useUserProfile";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/auth.service";

const StudentSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const { user } = useAuth();
  const userName = user?.displayName || user?.email || "User";
  const profile = useUserProfile();

  const roleLabel =
    profile?.role === "admin"
      ? "Admin"
      : profile?.role === "student"
        ? "Student"
        : profile?.role === "instructor"
          ? "Instructor"
          : "User";
  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/student" },
    { icon: ShoppingBag, label: "Browse Courses", path: "/student/browse" },
    { icon: BookOpen, label: "My Courses", path: "/student/courses" },
    {
      icon: Award,
      label: "Certificates",
      path: "/student/certificates",
    },
    { icon: Calendar, label: "Schedule", path: "/student/schedule" },
    { icon: Settings, label: "Settings", path: "/student/settings" },
  ];
  const navigate = useNavigate();
  const handleLogout = async () => {
    await authService.logout();
    navigate("/auth/login");
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-purple-600 text-white shadow-lg hover:bg-purple-700 transition-all lg:hidden"
        aria-label="Toggle menu"
      >
        {isOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-purple-900 text-white transition-all duration-300 z-40 shadow-2xl ${
          isOpen ? "w-64" : "w-0 lg:w-20"
        } overflow-hidden`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-purple-700/50">
            <div className="flex items-center justify-between">
              <h1
                className={`text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent ${!isOpen && "lg:hidden"}`}
              >
                Student Portal
              </h1>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="hidden lg:block p-1.5 rounded-lg hover:bg-purple-700/50 transition-all"
                aria-label="Toggle sidebar"
              >
                <ChevronLeft
                  size={20}
                  className={`transition-transform duration-300 ${!isOpen && "rotate-180"}`}
                />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group relative ${
                    isActive
                      ? "bg-white/10 shadow-lg"
                      : "hover:bg-purple-700/50"
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
                  )}
                  <item.icon
                    className={`w-6 h-6 flex-shrink-0 transition-transform group-hover:scale-110 ${
                      isActive ? "text-white" : "text-purple-200"
                    }`}
                  />
                  <span
                    className={`font-medium transition-colors ${!isOpen && "lg:hidden"} ${
                      isActive ? "text-white" : "text-purple-100"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-purple-700/50">
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-purple-700/50 transition-colors cursor-pointer group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg ring-2 ring-purple-400/30">
                <span className="text-sm font-bold">ST</span>
              </div>
              <div className={`flex-1 ${!isOpen && "lg:hidden"}`}>
                <p className="font-semibold">{userName}</p>
                <p className="text-xs text-indigo-300">{roleLabel}</p>{" "}
              </div>
              <button
                onClick={handleLogout}
                className={`p-1.5 rounded-lg hover:bg-purple-600 transition-colors ${!isOpen && "lg:hidden"}`}
                aria-label="Logout"
              >
                <LogOut size={18} className="text-purple-300" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      <div
        className={`transition-all duration-300 ${isOpen ? "ml-64" : "ml-0 lg:ml-20"}`}
      >
        {/* Main content here */}
      </div>
    </>
  );
};

export default StudentSidebar;

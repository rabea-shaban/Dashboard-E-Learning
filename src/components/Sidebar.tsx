import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  BookOpen,
  Users,
  Settings,
  BarChart,
  ChevronLeft,
  ChevronRight,
  LogOut,
  UserPlus,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/auth.service";
import { useUserProfile } from "../hooks/useUserProfile";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
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
    { icon: Home, label: "Home", path: "/dashboard" },
    { icon: BookOpen, label: "Courses", path: "/dashboard/courses" },
    { icon: Users, label: "Students", path: "/dashboard/students" },
    { icon: BarChart, label: "Analytics", path: "/dashboard/analytics" },
    { icon: Settings, label: "Settings", path: "/dashboard/settings" },
  ];

  const adminMenuItems = [
    { icon: UserPlus, label: "Add Instructor", path: "/admin/settings" },
  ];

  const handleLogout = async () => {
    await authService.logout();
    navigate("/auth/login");
  };

  const userName = user?.displayName || user?.email || "User";
  const initials = userName.slice(0, 2).toUpperCase();

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-indigo-600 text-white lg:hidden"
      >
        {isOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-indigo-900 via-indigo-800 to-indigo-900 text-white transition-all duration-300 z-40 ${
          isOpen ? "w-64" : "w-0 lg:w-20"
        } overflow-hidden`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-indigo-700/50">
            <div className="flex items-center justify-between">
              <h1 className={`text-2xl font-bold ${!isOpen && "lg:hidden"}`}>
                E-Learning
              </h1>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="hidden lg:block"
              >
                <ChevronLeft
                  size={20}
                  className={`${!isOpen && "rotate-180"}`}
                />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-4 p-3 rounded-xl ${
                    isActive ? "bg-white/10" : "hover:bg-indigo-700/50"
                  }`}
                >
                  <item.icon className="w-6 h-6" />
                  <span className={`${!isOpen && "lg:hidden"}`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
            
            {/* Admin Only Menu */}
            {profile?.role === "admin" && (
              <>
                <div className={`border-t border-indigo-700/50 my-2 ${!isOpen && "lg:hidden"}`} />
                {adminMenuItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-4 p-3 rounded-xl ${
                        isActive ? "bg-white/10" : "hover:bg-indigo-700/50"
                      }`}
                    >
                      <item.icon className="w-6 h-6" />
                      <span className={`${!isOpen && "lg:hidden"}`}>
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </>
            )}
          </nav>

          {/* User */}
          <div className="p-4 border-t border-indigo-700/50">
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-indigo-700/50">
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
                <span className="text-sm font-bold">{initials}</span>
              </div>

              <div className={`flex-1 ${!isOpen && "lg:hidden"}`}>
                <p className="font-semibold">{userName}</p>
                <p className="text-xs text-indigo-300">{roleLabel}</p>{" "}
              </div>

              <button
                onClick={handleLogout}
                className={`${!isOpen && "lg:hidden"}`}
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      <div
        className={`transition-all duration-300 ${isOpen ? "ml-64" : "ml-0 lg:ml-20"}`}
      />
    </>
  );
};

export default Sidebar;

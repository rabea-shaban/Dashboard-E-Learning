import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  BookOpen,
  Users,
  Settings,
  BarChart,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: BookOpen, label: "Courses", path: "/courses" },
    { icon: Users, label: "Students", path: "/students" },
    { icon: BarChart, label: "Analytics", path: "/analytics" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-all lg:hidden"
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
        className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-indigo-900 via-indigo-800 to-indigo-900 text-white transition-all duration-300 z-40 shadow-2xl ${
          isOpen ? "w-64" : "w-0 lg:w-20"
        } overflow-hidden`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-indigo-700/50">
            <div className="flex items-center justify-between">
              <h1 className={`text-2xl font-bold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent ${!isOpen && "lg:hidden"}`}>
                E-Learning
              </h1>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="hidden lg:block p-1.5 rounded-lg hover:bg-indigo-700/50 transition-all"
                aria-label="Toggle sidebar"
              >
                <ChevronLeft size={20} className={`transition-transform duration-300 ${!isOpen && "rotate-180"}`} />
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
                      : "hover:bg-indigo-700/50"
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
                  )}
                  <item.icon
                    className={`w-6 h-6 flex-shrink-0 transition-transform group-hover:scale-110 ${
                      isActive ? "text-white" : "text-indigo-200"
                    }`}
                  />
                  <span
                    className={`font-medium transition-colors ${!isOpen && "lg:hidden"} ${
                      isActive ? "text-white" : "text-indigo-100"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-indigo-700/50">
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-indigo-700/50 transition-colors cursor-pointer group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center shadow-lg ring-2 ring-indigo-400/30">
                <span className="text-sm font-bold">MN</span>
              </div>
              <div className={`flex-1 ${!isOpen && "lg:hidden"}`}>
                <p className="font-semibold text-white">Muhammad Naga</p>
                <p className="text-xs text-indigo-300">Admin</p>
              </div>
              <button
                className={`p-1.5 rounded-lg hover:bg-indigo-600 transition-colors ${!isOpen && "lg:hidden"}`}
                aria-label="Logout"
              >
                <LogOut size={18} className="text-indigo-300" />
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

export default Sidebar;

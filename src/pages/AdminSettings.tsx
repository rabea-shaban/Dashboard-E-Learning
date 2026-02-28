import { useState } from "react";
import { UserPlus, Users, Mail, Lock, User } from "lucide-react";
import { authService } from "../services/auth.service";
import { userService } from "../services/user.service";
import Swal from "sweetalert2";

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("add-instructor");
  const [loading, setLoading] = useState(false);
  
  const [instructorData, setInstructorData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleAddInstructor = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (instructorData.password !== instructorData.confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Passwords don't match!",
      });
      return;
    }

    if (instructorData.password.length < 6) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Password must be at least 6 characters!",
      });
      return;
    }

    setLoading(true);
    try {
      const user = await authService.register(
        instructorData.name,
        instructorData.email,
        instructorData.password
      );

      await userService.createUserProfile(user, "instructor");

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Instructor added successfully!",
        timer: 2000,
        showConfirmButton: false,
      });

      setInstructorData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Settings</h1>
        <p className="text-gray-600">Manage instructors and system settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-4 space-y-2">
            <button
              onClick={() => setActiveTab("add-instructor")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                activeTab === "add-instructor"
                  ? "bg-purple-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <UserPlus size={20} />
              <span className="font-medium">Add Instructor</span>
            </button>
            <button
              onClick={() => setActiveTab("manage-users")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                activeTab === "manage-users"
                  ? "bg-purple-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Users size={20} />
              <span className="font-medium">Manage Users</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-lg p-8">
            {/* Add Instructor Tab */}
            {activeTab === "add-instructor" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Instructor</h2>
                
                <form onSubmit={handleAddInstructor} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User size={20} className="absolute left-3 top-3.5 text-gray-400" />
                      <input
                        type="text"
                        value={instructorData.name}
                        onChange={(e) => setInstructorData({ ...instructorData, name: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter instructor name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail size={20} className="absolute left-3 top-3.5 text-gray-400" />
                      <input
                        type="email"
                        value={instructorData.email}
                        onChange={(e) => setInstructorData({ ...instructorData, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="instructor@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock size={20} className="absolute left-3 top-3.5 text-gray-400" />
                      <input
                        type="password"
                        value={instructorData.password}
                        onChange={(e) => setInstructorData({ ...instructorData, password: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter password (min 6 characters)"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock size={20} className="absolute left-3 top-3.5 text-gray-400" />
                      <input
                        type="password"
                        value={instructorData.confirmPassword}
                        onChange={(e) => setInstructorData({ ...instructorData, confirmPassword: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Confirm password"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition font-medium disabled:opacity-50"
                  >
                    <UserPlus size={20} />
                    {loading ? "Adding..." : "Add Instructor"}
                  </button>
                </form>
              </div>
            )}

            {/* Manage Users Tab */}
            {activeTab === "manage-users" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Users</h2>
                <p className="text-gray-600">User management features coming soon...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;

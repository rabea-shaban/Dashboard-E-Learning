import { useEffect, useState } from "react";
import { BookOpen, Clock, Award, TrendingUp, Play, CheckCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { purchaseService } from "../services/purchase.service";
import { Link } from "react-router-dom";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const data = await purchaseService.getUserPurchases(user.uid);
        setPurchases(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  const totalCourses = purchases.reduce(
    (sum, p) => sum + (p.courses?.length || 0),
    0
  );
  const totalSpent = purchases.reduce((sum, p) => sum + (p.total || 0), 0);
  const completedCourses = Math.floor(totalCourses * 0.4); // Mock data
  const inProgressCourses = totalCourses - completedCourses;

  const stats = [
    {
      icon: BookOpen,
      label: "Enrolled Courses",
      value: totalCourses,
      color: "bg-blue-500",
      bgLight: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      icon: Clock,
      label: "In Progress",
      value: inProgressCourses,
      color: "bg-orange-500",
      bgLight: "bg-orange-50",
      textColor: "text-orange-600",
    },
    {
      icon: CheckCircle,
      label: "Completed",
      value: completedCourses,
      color: "bg-green-500",
      bgLight: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      icon: Award,
      label: "Certificates",
      value: completedCourses,
      color: "bg-purple-500",
      bgLight: "bg-purple-50",
      textColor: "text-purple-600",
    },
  ];

  // Get recent courses
  const recentCourses = purchases
    .flatMap((p) => p.courses || [])
    .slice(0, 3)
    .map((course: any) => ({
      ...course,
      progress: Math.floor(Math.random() * 100),
    }));

  return (
    <div className="p-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome back, {user?.displayName || "Student"}! 👋
        </h1>
        <p className="text-gray-600">Continue your learning journey</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
          >
            <div className="flex items-center gap-4">
              <div className={`${stat.bgLight} p-3 rounded-lg`}>
                <stat.icon className={stat.textColor} size={24} />
              </div>
              <div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Continue Learning */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Continue Learning</h2>
              <Link
                to="/student/courses"
                className="text-purple-600 hover:text-purple-700 font-medium text-sm"
              >
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {recentCourses.length > 0 ? (
                recentCourses.map((course: any, index: number) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 hover:border-purple-500 transition"
                  >
                    <div className="flex gap-4">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800 mb-1">
                          {course.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          by {course.instructor}
                        </p>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-purple-600 h-2 rounded-full transition-all"
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold text-purple-600">
                            {course.progress}%
                          </span>
                        </div>
                        <button className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium text-sm">
                          <Play size={16} />
                          Continue
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">No courses yet</p>
                  <Link
                    to="/student/browse"
                    className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
                  >
                    Browse Courses
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Learning Activity */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Learning Activity
            </h2>
            <div className="space-y-3">
              {[
                {
                  action: "Completed",
                  course: "Web Development Basics",
                  time: "2 hours ago",
                },
                {
                  action: "Started",
                  course: "React Advanced Patterns",
                  time: "5 hours ago",
                },
                {
                  action: "Earned Certificate",
                  course: "UI/UX Design",
                  time: "1 day ago",
                },
              ].map((activity, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">
                      <span className="font-semibold">{activity.action}</span>{" "}
                      {activity.course}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Progress Overview */}
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl shadow-lg p-6 text-white">
            <h3 className="text-lg font-bold mb-4">Your Progress</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Overall Completion</span>
                  <span className="font-bold">
                    {totalCourses > 0
                      ? Math.round((completedCourses / totalCourses) * 100)
                      : 0}
                    %
                  </span>
                </div>
                <div className="bg-white/20 rounded-full h-2">
                  <div
                    className="bg-white h-2 rounded-full"
                    style={{
                      width: `${
                        totalCourses > 0
                          ? (completedCourses / totalCourses) * 100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
              <div className="pt-4 border-t border-white/20">
                <p className="text-sm opacity-90 mb-2">Total Spent</p>
                <p className="text-2xl font-bold">${totalSpent.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Link
                to="/student/browse"
                className="block w-full bg-purple-600 text-white text-center py-3 rounded-lg hover:bg-purple-700 transition font-medium"
              >
                Browse Courses
              </Link>
              <Link
                to="/student/certificates"
                className="block w-full bg-gray-100 text-gray-800 text-center py-3 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                View Certificates
              </Link>
              <Link
                to="/student/schedule"
                className="block w-full bg-gray-100 text-gray-800 text-center py-3 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                My Schedule
              </Link>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Recent Achievements
            </h3>
            <div className="space-y-3">
              {[
                { icon: "🏆", title: "First Course", desc: "Completed first course" },
                { icon: "⭐", title: "Fast Learner", desc: "Finished in record time" },
                { icon: "🎯", title: "Dedicated", desc: "7 day streak" },
              ].map((achievement, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="text-2xl">{achievement.icon}</div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">
                      {achievement.title}
                    </p>
                    <p className="text-xs text-gray-600">{achievement.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

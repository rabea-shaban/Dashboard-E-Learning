import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  TrendingUp,
  DollarSign,
  BookOpen,
  Users,
  ShoppingCart,
  Award,
  Clock,
  Target,
} from "lucide-react";
import { purchaseService } from "../services/purchase.service";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [topCourses, setTopCourses] = useState<any[]>([]);
  const [instructorPerformance, setInstructorPerformance] = useState<any[]>([]);
  const [dailyStats, setDailyStats] = useState<any[]>([]);
  const [categoryRevenue, setCategoryRevenue] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    avgOrderValue: 0,
    totalOrders: 0,
    conversionRate: 0,
    totalStudents: 0,
    totalCourses: 0,
    avgCoursesPerStudent: 0,
    totalEnrollments: 0,
  });

  const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6"];

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const purchases = await purchaseService.getAllPurchases();
        const coursesSnapshot = await getDocs(collection(db, "courses"));
        const courses = coursesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const usersSnapshot = await getDocs(collection(db, "users"));
        const students = usersSnapshot.docs.filter(
          (doc) => doc.data().role === "student"
        );

        // Calculate comprehensive stats
        const totalRevenue = purchases.reduce(
          (sum: number, p: any) => sum + (p.total || 0),
          0
        );
        const totalOrders = purchases.length;
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        const totalStudents = students.length;
        const totalCourses = courses.length;
        const totalEnrollments = purchases.reduce(
          (sum: number, p: any) => sum + (p.courses?.length || 0),
          0
        );
        const avgCoursesPerStudent =
          totalStudents > 0 ? totalEnrollments / totalStudents : 0;

        setStats({
          totalRevenue,
          avgOrderValue,
          totalOrders,
          conversionRate: 68.5,
          totalStudents,
          totalCourses,
          avgCoursesPerStudent,
          totalEnrollments,
        });

        // Category distribution
        const categoryMap: any = {};
        purchases.forEach((purchase: any) => {
          purchase.courses?.forEach((course: any) => {
            const fullCourse = courses.find((c: any) => c.id === course.courseId);
            if (fullCourse) {
              const category = (fullCourse as any).category || "Other";
              categoryMap[category] = (categoryMap[category] || 0) + 1;
            }
          });
        });

        const categoryChartData = Object.keys(categoryMap).map((key) => ({
          name: key,
          value: categoryMap[key],
        }));
        setCategoryData(categoryChartData);

        // Category Revenue
        const categoryRevenueMap: any = {};
        purchases.forEach((purchase: any) => {
          purchase.courses?.forEach((course: any) => {
            const fullCourse = courses.find((c: any) => c.id === course.courseId);
            if (fullCourse) {
              const category = (fullCourse as any).category || "Other";
              categoryRevenueMap[category] =
                (categoryRevenueMap[category] || 0) + course.price;
            }
          });
        });

        const categoryRevenueData = Object.keys(categoryRevenueMap).map((key) => ({
          category: key,
          revenue: categoryRevenueMap[key],
        }));
        setCategoryRevenue(categoryRevenueData);

        // Revenue by month
        const monthlyRevenue: any = {};
        const monthlyOrders: any = {};
        purchases.forEach((purchase: any) => {
          const date = new Date(purchase.purchaseDate);
          const monthYear = `${date.toLocaleString("default", {
            month: "short",
          })}`;
          monthlyRevenue[monthYear] =
            (monthlyRevenue[monthYear] || 0) + (purchase.total || 0);
          monthlyOrders[monthYear] = (monthlyOrders[monthYear] || 0) + 1;
        });

        const revenueChartData = Object.keys(monthlyRevenue).map((key) => ({
          month: key,
          revenue: monthlyRevenue[key],
          orders: monthlyOrders[key],
        }));
        setRevenueData(revenueChartData);

        // Daily stats (last 7 days)
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (6 - i));
          return date.toLocaleDateString("en-US", { weekday: "short" });
        });

        const dailyData = last7Days.map((day) => ({
          day,
          sales: Math.floor(Math.random() * 10) + 5,
          revenue: Math.floor(Math.random() * 500) + 200,
        }));
        setDailyStats(dailyData);

        // Top courses by enrollment
        const courseEnrollments: any = {};
        const courseRevenue: any = {};
        purchases.forEach((purchase: any) => {
          purchase.courses?.forEach((course: any) => {
            courseEnrollments[course.courseId] =
              (courseEnrollments[course.courseId] || 0) + 1;
            courseRevenue[course.courseId] =
              (courseRevenue[course.courseId] || 0) + course.price;
          });
        });

        const topCoursesData = Object.keys(courseEnrollments)
          .map((courseId) => {
            const course = courses.find((c: any) => c.id === courseId);
            return {
              name: (course as any)?.title || "Unknown",
              enrollments: courseEnrollments[courseId],
              revenue: courseRevenue[courseId],
            };
          })
          .sort((a, b) => b.enrollments - a.enrollments)
          .slice(0, 5);

        setTopCourses(topCoursesData);

        // Instructor Performance
        const instructorMap: any = {};
        purchases.forEach((purchase: any) => {
          purchase.courses?.forEach((course: any) => {
            const fullCourse = courses.find((c: any) => c.id === course.courseId);
            if (fullCourse) {
              const instructor = (fullCourse as any).instructor || "Unknown";
              if (!instructorMap[instructor]) {
                instructorMap[instructor] = {
                  enrollments: 0,
                  revenue: 0,
                  courses: 0,
                };
              }
              instructorMap[instructor].enrollments += 1;
              instructorMap[instructor].revenue += course.price;
            }
          });
        });

        // Count courses per instructor
        courses.forEach((course: any) => {
          const instructor = course.instructor || "Unknown";
          if (instructorMap[instructor]) {
            instructorMap[instructor].courses =
              (instructorMap[instructor].courses || 0) + 1;
          }
        });

        const instructorData = Object.keys(instructorMap).map((key) => ({
          instructor: key,
          enrollments: instructorMap[key].enrollments,
          revenue: instructorMap[key].revenue,
          courses: instructorMap[key].courses,
          avgEnrollment: Math.round(
            instructorMap[key].enrollments / instructorMap[key].courses
          ),
        }));
        setInstructorPerformance(instructorData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Analytics Dashboard
        </h1>
        <p className="text-gray-600">
          Comprehensive insights and performance metrics
        </p>
      </div>

      {/* Key Metrics - Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <DollarSign size={32} />
            <TrendingUp size={24} />
          </div>
          <h3 className="text-sm font-medium opacity-90 mb-1">Total Revenue</h3>
          <p className="text-3xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <ShoppingCart size={32} />
            <TrendingUp size={24} />
          </div>
          <h3 className="text-sm font-medium opacity-90 mb-1">Total Orders</h3>
          <p className="text-3xl font-bold">{stats.totalOrders}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Users size={32} />
            <TrendingUp size={24} />
          </div>
          <h3 className="text-sm font-medium opacity-90 mb-1">Total Students</h3>
          <p className="text-3xl font-bold">{stats.totalStudents}</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <BookOpen size={32} />
            <TrendingUp size={24} />
          </div>
          <h3 className="text-sm font-medium opacity-90 mb-1">Total Courses</h3>
          <p className="text-3xl font-bold">{stats.totalCourses}</p>
        </div>
      </div>

      {/* Key Metrics - Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="text-blue-500" size={24} />
            <h3 className="text-sm font-medium text-gray-600">Avg Order Value</h3>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            ${stats.avgOrderValue.toFixed(2)}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center gap-3 mb-2">
            <Target className="text-green-500" size={24} />
            <h3 className="text-sm font-medium text-gray-600">Conversion Rate</h3>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {stats.conversionRate}%
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
          <div className="flex items-center gap-3 mb-2">
            <Award className="text-purple-500" size={24} />
            <h3 className="text-sm font-medium text-gray-600">Total Enrollments</h3>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {stats.totalEnrollments}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="text-orange-500" size={24} />
            <h3 className="text-sm font-medium text-gray-600">Avg Courses/Student</h3>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {stats.avgCoursesPerStudent.toFixed(1)}
          </p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue & Orders Trend */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Revenue & Orders Trend
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="revenue"
                stackId="1"
                stroke="#6366f1"
                fill="#6366f1"
              />
              <Area
                type="monotone"
                dataKey="orders"
                stackId="2"
                stroke="#10b981"
                fill="#10b981"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Daily Performance */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Last 7 Days Performance
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#8b5cf6"
                strokeWidth={3}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#ec4899"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Category Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Enrollment by Category
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${((percent || 0) * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Category Revenue */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Revenue by Category
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#f59e0b" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top Courses */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Top 5 Courses by Enrollment
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topCourses} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip />
              <Legend />
              <Bar dataKey="enrollments" fill="#8b5cf6" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Instructor Performance */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Instructor Performance
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={instructorPerformance}>
              <PolarGrid />
              <PolarAngleAxis dataKey="instructor" />
              <PolarRadiusAxis />
              <Radar
                name="Enrollments"
                dataKey="enrollments"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.6}
              />
              <Radar
                name="Courses"
                dataKey="courses"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.6}
              />
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Instructor Table */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Instructor Statistics
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Instructor
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Courses
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Enrollments
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Avg Enrollment
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {instructorPerformance.map((instructor, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">
                    {instructor.instructor}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {instructor.courses}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {instructor.enrollments}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {instructor.avgEnrollment}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-green-600">
                    ${instructor.revenue.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

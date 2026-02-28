import { useEffect, useState } from "react";
import { BookOpen, Users, DollarSign, TrendingUp } from "lucide-react";
import { courseService } from "../services/course.service";
import { purchaseService } from "../services/purchase.service";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";

const Home = () => {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    totalEnrollments: 0,
  });
  const [recentPurchases, setRecentPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get courses
        const coursesSnapshot = await getDocs(collection(db, "courses"));
        const totalCourses = coursesSnapshot.size;

        // Get students
        const usersSnapshot = await getDocs(collection(db, "users"));
        const students = usersSnapshot.docs.filter(
          (doc) => doc.data().role === "student"
        );
        const totalStudents = students.length;

        // Get purchases
        const purchases = await purchaseService.getAllPurchases();
        const totalRevenue = purchases.reduce(
          (sum: number, p: any) => sum + (p.total || 0),
          0
        );
        const totalEnrollments = purchases.reduce(
          (sum: number, p: any) => sum + (p.courses?.length || 0),
          0
        );

        setStats({
          totalCourses,
          totalStudents,
          totalRevenue,
          totalEnrollments,
        });

        // Get recent purchases
        const sortedPurchases = purchases
          .sort(
            (a: any, b: any) =>
              new Date(b.purchaseDate).getTime() -
              new Date(a.purchaseDate).getTime()
          )
          .slice(0, 5);
        setRecentPurchases(sortedPurchases);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  const statsCards = [
    {
      title: "Total Courses",
      value: stats.totalCourses,
      icon: BookOpen,
      color: "bg-blue-500",
      bgLight: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Total Students",
      value: stats.totalStudents,
      icon: Users,
      color: "bg-green-500",
      bgLight: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "bg-yellow-500",
      bgLight: "bg-yellow-50",
      textColor: "text-yellow-600",
    },
    {
      title: "Total Enrollments",
      value: stats.totalEnrollments,
      icon: TrendingUp,
      color: "bg-purple-500",
      bgLight: "bg-purple-50",
      textColor: "text-purple-600",
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bgLight} p-3 rounded-lg`}>
                <stat.icon className={stat.textColor} size={24} />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">
              {stat.title}
            </h3>
            <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Purchases */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Recent Purchases
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Courses
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentPurchases.map((purchase) => (
                <tr key={purchase.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {new Date(purchase.purchaseDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">
                      {purchase.courses?.map((course: any, idx: number) => (
                        <div key={idx} className="text-gray-700">
                          {course.title}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-800">
                    ${purchase.total?.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      {purchase.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {recentPurchases.length === 0 && (
          <div className="text-center py-8 text-gray-600">
            No purchases yet
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

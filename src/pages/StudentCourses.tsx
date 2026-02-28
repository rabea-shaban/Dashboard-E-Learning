import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { purchaseService } from "../services/purchase.service";
import { useNavigate } from "react-router-dom";
import { Play } from "lucide-react";

const StudentCourses = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchases = async () => {
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
    fetchPurchases();
  }, [user]);

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">My Courses</h1>
      <p className="text-gray-600 mb-6">
        Click on a course to continue learning
      </p>

      {purchases.length === 0 ? (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-8 text-center">
          <p className="text-gray-600 text-lg">
            You haven't purchased any courses yet.
          </p>
          <button
            onClick={() => navigate("/student/browse")}
            className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
          >
            Browse Courses
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {purchases.map((purchase) => (
            <div key={purchase.id}>
              {purchase.courses.map((course: any, idx: number) => {
                // Get courseId - try different properties
                const courseId =
                  course.id || course.courseId || `course_${idx}`;
                console.log("Course object:", course);
                console.log("Using courseId:", courseId);

                return (
                  <button
                    key={idx}
                    onClick={() => navigate(`/student/courses/${courseId}`)}
                    className="w-full text-left bg-white rounded-xl shadow-lg overflow-hidden mb-4 hover:shadow-xl transition group"
                  >
                    {/* Image */}
                    <div className="relative overflow-hidden h-48">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                      />
                      {course.videos && course.videos.length > 0 && (
                        <div className="absolute top-3 right-3 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                          <Play size={14} />
                          {course.videos.length}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="font-bold text-gray-800 mb-2 line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-1">
                        by {course.instructor}
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        {course.duration}
                      </p>

                      {/* Video Count Badge */}
                      {course.videos && course.videos.length > 0 && (
                        <div className="mb-3 p-2 bg-purple-50 rounded-lg">
                          <p className="text-sm font-semibold text-purple-700">
                            📺 {course.videos.length} video
                            {course.videos.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                      )}

                      <p className="text-purple-600 font-semibold">
                        ${course.price}
                      </p>
                      <p className="text-xs text-gray-500 mt-3">
                        Purchased:{" "}
                        {new Date(purchase.purchaseDate).toLocaleDateString()}
                      </p>

                      {/* Call to Action */}
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm font-semibold text-purple-600 group-hover:text-purple-700">
                          Continue Learning →
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentCourses;

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { purchaseService } from "../services/purchase.service";
import { Play, X } from "lucide-react";
import type { Video } from "../types/types";

const StudentCourses = () => {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

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
      <h1 className="text-3xl font-bold text-gray-800 mb-4">My Courses</h1>

      {purchases.length === 0 ? (
        <p className="text-gray-600">You haven't purchased any courses yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {purchases.map((purchase) => (
            <div key={purchase.id}>
              {purchase.courses.map((course: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl shadow-lg overflow-hidden mb-4 hover:shadow-xl transition cursor-pointer"
                  onClick={() => setSelectedCourse(course)}
                >
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="font-bold text-gray-800 mb-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-1">
                      by {course.instructor}
                    </p>
                    <p className="text-sm text-gray-500 mb-2">
                      {course.duration}
                    </p>

                    {/* Video Count */}
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
                    <p className="text-xs text-gray-500 mt-2">
                      Purchased:{" "}
                      {new Date(purchase.purchaseDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Course Detail Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedCourse.title}
              </h2>
              <button
                onClick={() => {
                  setSelectedCourse(null);
                  setSelectedVideo(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              {/* Course Info */}
              <div className="mb-8">
                <img
                  src={selectedCourse.image}
                  alt={selectedCourse.title}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
                <p className="text-gray-700 mb-2 text-lg">
                  {selectedCourse.description}
                </p>
                <div className="flex gap-4 text-sm text-gray-600">
                  <span>👨‍🏫 Instructor: {selectedCourse.instructor}</span>
                  <span>⏱️ Duration: {selectedCourse.duration}</span>
                </div>
              </div>

              {/* Videos Section */}
              {selectedCourse.videos && selectedCourse.videos.length > 0 ? (
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Course Videos ({selectedCourse.videos.length})
                  </h3>

                  {selectedVideo ? (
                    <div className="mb-6">
                      <div className="bg-black rounded-lg p-4 mb-4">
                        <video
                          width="100%"
                          height="400"
                          controls
                          autoPlay
                          className="rounded-lg"
                        >
                          <source src={selectedVideo.url} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                      <div className="mb-4">
                        <h4 className="text-lg font-semibold text-gray-800">
                          {selectedVideo.title}
                        </h4>
                        <p className="text-gray-600">
                          Duration: {selectedVideo.duration}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedVideo(null)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                      >
                        Back to Playlist
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedCourse.videos.map((video: Video) => (
                        <div
                          key={video.id}
                          className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-lg transition cursor-pointer"
                          onClick={() => setSelectedVideo(video)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="bg-purple-600 text-white p-3 rounded-lg shrink-0">
                              <Play size={20} />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-800">
                                {video.title}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1">
                                ⏱️ {video.duration}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-600">
                  No videos available for this course yet.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentCourses;

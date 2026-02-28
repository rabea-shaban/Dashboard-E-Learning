import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { purchaseService } from "../services/purchase.service";
import {
  ArrowLeft,
  Play,
  CheckCircle2,
  Clock,
  User,
  BookOpen,
} from "lucide-react";
import type { Course, Video } from "../types/types";

const CourseView = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState<Course | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [watchedVideos, setWatchedVideos] = useState<string[]>([]);

  useEffect(() => {
    const initialize = async () => {
      if (!user || !courseId) return;

      try {
        // Fetch user purchases to find the course
        const purchases = await purchaseService.getUserPurchases(user.uid);
        let foundCourse: Course | null = null;

        console.log("Looking for courseId:", courseId);
        console.log("Total purchases:", purchases.length);

        for (const purchase of purchases) {
          if (!("courses" in purchase)) continue;

          const courses = (purchase as any).courses as any[];
          console.log(
            "Checking purchase ",
            purchase.id,
            "with",
            courses?.length,
            "courses",
          );
          const courseInPurchase = courses.find((c: any) => {
            console.log(
              "Comparing courseId:",
              courseId,
              "with course:",
              c.id,
              c.courseId,
            );
            return c.id === courseId || c.courseId === courseId;
          });
          if (courseInPurchase) {
            foundCourse = courseInPurchase;
            setHasAccess(true);
            console.log("Found course!", courseInPurchase.title);
            break;
          }
        }

        if (!foundCourse) {
          setHasAccess(false);
          setLoading(false);
          return;
        }

        setCourse(foundCourse);
        if (foundCourse.videos && foundCourse.videos.length > 0) {
          setSelectedVideo(foundCourse.videos[0]);
        }

        // Load watched videos from localStorage
        const saved = localStorage.getItem(`course_watched_${courseId}`);
        if (saved) {
          setWatchedVideos(JSON.parse(saved));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [user, courseId]);

  const handleVideoWatched = (videoId: string) => {
    if (!watchedVideos.includes(videoId)) {
      const updatedWatched = [...watchedVideos, videoId];
      setWatchedVideos(updatedWatched);
      localStorage.setItem(
        `course_watched_${courseId}`,
        JSON.stringify(updatedWatched),
      );
    }
  };

  const progressPercentage = course?.videos
    ? Math.round((watchedVideos.length / course.videos.length) * 100)
    : 0;

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center text-gray-600">Loading course...</div>
      </div>
    );
  }

  if (!hasAccess || !course) {
    return (
      <div className="p-8">
        <button
          onClick={() => navigate("/student/courses")}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold mb-6"
        >
          <ArrowLeft size={20} />
          Back to My Courses
        </button>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-semibold">Access Denied</p>
          <p className="text-gray-600 mt-2">
            You don't have access to this course.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="p-6">
          <button
            onClick={() => navigate("/student/courses")}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold mb-4"
          >
            <ArrowLeft size={20} />
            Back to My Courses
          </button>
          <h1 className="text-3xl font-bold text-gray-800">{course.title}</h1>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Video & Description */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            {selectedVideo ? (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
                <div className="bg-black aspect-video flex items-center justify-center">
                  <video
                    key={selectedVideo.id}
                    width="100%"
                    height="100%"
                    controls
                    autoPlay
                    className="w-full h-full"
                    onEnded={() => handleVideoWatched(selectedVideo.id)}
                  >
                    <source src={selectedVideo.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>

                {/* Video Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        {selectedVideo.title}
                      </h2>
                      <div className="flex items-center gap-4 mt-3 text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock size={18} />
                          {selectedVideo.duration}
                        </span>
                        {watchedVideos.includes(selectedVideo.id) && (
                          <span className="flex items-center gap-1 text-green-600 font-semibold">
                            <CheckCircle2 size={18} />
                            Completed
                          </span>
                        )}
                      </div>
                    </div>
                    {watchedVideos.includes(selectedVideo.id) && (
                      <div className="bg-green-100 p-3 rounded-lg">
                        <CheckCircle2 size={24} className="text-green-600" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <p className="text-gray-600">No videos available</p>
              </div>
            )}

            {/* Course Description */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                About This Course
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {course.description}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <User size={20} className="text-purple-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Instructor</p>
                  <p className="font-semibold text-gray-800">
                    {course.instructor}
                  </p>
                </div>
                <div className="text-center">
                  <Clock size={20} className="text-purple-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-semibold text-gray-800">
                    {course.duration}
                  </p>
                </div>
                <div className="text-center">
                  <Play size={20} className="text-purple-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Videos</p>
                  <p className="font-semibold text-gray-800">
                    {course.videos?.length || 0}
                  </p>
                </div>
                <div className="text-center">
                  <BookOpen
                    size={20}
                    className="text-purple-600 mx-auto mb-2"
                  />
                  <p className="text-sm text-gray-600">Category</p>
                  <p className="font-semibold text-gray-800">
                    {course.category}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Videos Playlist & Progress */}
          <div className="lg:col-span-1">
            {/* Progress */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Your Progress
              </h3>
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-purple-600">
                  {progressPercentage}%
                </div>
                <p className="text-gray-600 text-sm mt-2">
                  {watchedVideos.length} of {course.videos?.length || 0} videos
                  completed
                </p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-linear-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            {/* Videos Playlist */}
            {course.videos && course.videos.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Course Content ({course.videos.length})
                </h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {course.videos.map((video: Video, idx: number) => (
                    <button
                      key={video.id}
                      onClick={() => setSelectedVideo(video)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition ${
                        selectedVideo?.id === video.id
                          ? "border-purple-600 bg-purple-50"
                          : "border-gray-200 hover:border-purple-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                            watchedVideos.includes(video.id)
                              ? "bg-green-600 text-white"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {watchedVideos.includes(video.id) ? (
                            <CheckCircle2 size={16} />
                          ) : (
                            idx + 1
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 text-sm line-clamp-2">
                            {video.title}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            {video.duration}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseView;

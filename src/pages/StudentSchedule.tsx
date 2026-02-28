import { useEffect, useState } from "react";
import { Calendar, Clock, BookOpen, Video, CheckCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { purchaseService } from "../services/purchase.service";

interface ScheduleItem {
  id: string;
  courseId: string;
  courseName: string;
  lessonTitle: string;
  instructor: string;
  date: string;
  time: string;
  duration: string;
  type: "live" | "recorded";
  status: "upcoming" | "completed" | "in-progress";
  image: string;
}

const StudentSchedule = () => {
  const { user } = useAuth();
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "upcoming" | "completed">("all");

  useEffect(() => {
    const fetchSchedule = async () => {
      if (!user) return;
      try {
        const purchases = await purchaseService.getUserPurchases(user.uid);
        
        // Generate schedule items from purchased courses
        const items: ScheduleItem[] = purchases.flatMap((purchase: any, idx: number) =>
          purchase.courses?.map((course: any, lessonIdx: number) => ({
            id: `${purchase.id}-${course.courseId}-${lessonIdx}`,
            courseId: course.courseId,
            courseName: course.title,
            lessonTitle: `Lesson ${lessonIdx + 1}: Introduction`,
            instructor: course.instructor,
            date: new Date(Date.now() + idx * 86400000).toISOString().split('T')[0],
            time: `${10 + (lessonIdx % 8)}:00 AM`,
            duration: "1h 30m",
            type: lessonIdx % 2 === 0 ? "live" : "recorded",
            status: idx === 0 ? "upcoming" : idx === 1 ? "in-progress" : "completed",
            image: course.image,
          })) || []
        );
        
        setSchedule(items);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, [user]);

  const filteredSchedule = schedule.filter(item => 
    filter === "all" ? true : item.status === filter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming": return "bg-blue-100 text-blue-700";
      case "in-progress": return "bg-green-100 text-green-700";
      case "completed": return "bg-gray-100 text-gray-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Schedule</h1>
        <p className="text-gray-600">Manage your learning schedule</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center gap-3">
            <Calendar size={32} />
            <div>
              <p className="text-sm opacity-90">Total Classes</p>
              <p className="text-3xl font-bold">{schedule.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center gap-3">
            <CheckCircle size={32} />
            <div>
              <p className="text-sm opacity-90">Completed</p>
              <p className="text-3xl font-bold">
                {schedule.filter(s => s.status === "completed").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center gap-3">
            <Clock size={32} />
            <div>
              <p className="text-sm opacity-90">Upcoming</p>
              <p className="text-3xl font-bold">
                {schedule.filter(s => s.status === "upcoming").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center gap-3">
            <Video size={32} />
            <div>
              <p className="text-sm opacity-90">Live Sessions</p>
              <p className="text-3xl font-bold">
                {schedule.filter(s => s.type === "live").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
        <div className="flex gap-3">
          <button
            onClick={() => setFilter("all")}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              filter === "all"
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("upcoming")}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              filter === "upcoming"
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              filter === "completed"
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Schedule List */}
      {filteredSchedule.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Calendar size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            No Classes Scheduled
          </h3>
          <p className="text-gray-600 mb-6">
            Enroll in courses to see your schedule
          </p>
          <a
            href="/student/browse"
            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
          >
            Browse Courses
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSchedule.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition"
            >
              <div className="flex items-start gap-6">
                {/* Course Image */}
                <img
                  src={item.image}
                  alt={item.courseName}
                  className="w-32 h-32 rounded-lg object-cover"
                />

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">
                        {item.lessonTitle}
                      </h3>
                      <p className="text-gray-600 flex items-center gap-2">
                        <BookOpen size={16} />
                        {item.courseName}
                      </p>
                    </div>
                    <span
                      className={`px-4 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {item.status.replace("-", " ").toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-center gap-6 text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={18} />
                      <span>{new Date(item.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={18} />
                      <span>{item.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Video size={18} />
                      <span>{item.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.type === "live"
                            ? "bg-red-100 text-red-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {item.type === "live" ? "🔴 Live" : "📹 Recorded"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      Instructor: <span className="font-semibold">{item.instructor}</span>
                    </p>
                    <button
                      className={`px-6 py-2 rounded-lg font-medium transition ${
                        item.status === "completed"
                          ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          : "bg-purple-600 text-white hover:bg-purple-700"
                      }`}
                    >
                      {item.status === "completed" ? "Review" : "Join Class"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentSchedule;

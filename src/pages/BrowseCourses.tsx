import { ShoppingCart, Search } from "lucide-react";
import { courseService } from "../services/course.service";
import { purchaseService } from "../services/purchase.service";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import { addToCart } from "../store/cartSlice";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import type { Course } from "../types/types";

const BrowseCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Courses");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();

  const categories = ["All Courses", "Development", "Design", "Data Science", "Business"];

  const handleBuy = async (course: Course) => {
    if (!user) return;

    const alreadyPurchased = await purchaseService.hasPurchasedCourse(user.uid, course.id);
    
    if (alreadyPurchased) {
      Swal.fire({
        icon: "info",
        title: "Already Purchased",
        text: "You already own this course!",
        confirmButtonColor: "#9333ea",
      });
      return;
    }

    dispatch(addToCart(course));
    navigate("/student/checkout");
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All Courses" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    const unsubscribe = courseService.subscribe(setCourses);
    return unsubscribe;
  }, []);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Browse Courses</h1>
        <p className="text-gray-600">Discover and enroll in new courses</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
              selectedCategory === category
                ? "bg-purple-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition group"
          >
            <div className="relative">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
              />
              <span className="absolute top-3 right-3 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {course.category}
              </span>
            </div>

            <div className="p-5">
              <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 h-12">
                {course.title}
              </h3>
              <p className="text-sm text-gray-600 mb-3">by {course.instructor}</p>
              <p className="text-sm text-gray-500 mb-3">{course.duration}</p>

              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <span className="text-2xl font-bold text-purple-600">
                  ${course.price}
                </span>
                <button 
                  onClick={() => handleBuy(course)}
                  className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
                >
                  <ShoppingCart size={18} />
                  Buy
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrowseCourses;

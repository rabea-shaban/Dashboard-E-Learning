import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { purchaseService } from "../services/purchase.service";

const StudentCourses = () => {
  const { user } = useAuth();
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
      <h1 className="text-3xl font-bold text-gray-800 mb-4">My Courses</h1>
      
      {purchases.length === 0 ? (
        <p className="text-gray-600">You haven't purchased any courses yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {purchases.map((purchase) => (
            <div key={purchase.id}>
              {purchase.courses.map((course: any, idx: number) => (
                <div key={idx} className="bg-white rounded-xl shadow-lg overflow-hidden mb-4">
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="font-bold text-gray-800 mb-2">{course.title}</h3>
                    <p className="text-sm text-gray-600 mb-1">by {course.instructor}</p>
                    <p className="text-sm text-gray-500 mb-2">{course.duration}</p>
                    <p className="text-purple-600 font-semibold">${course.price}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Purchased: {new Date(purchase.purchaseDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentCourses;

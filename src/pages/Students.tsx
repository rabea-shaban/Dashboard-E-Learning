import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import { purchaseService } from "../services/purchase.service";
import { BookOpen, User } from "lucide-react";

interface StudentData {
  id: string;
  name: string;
  email: string;
  role: string;
  purchases: any[];
}

const Students = () => {
  const [students, setStudents] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // Get all users
        const usersSnapshot = await getDocs(collection(db, "users"));
        const allUsers = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Filter only students
        const studentUsers = allUsers.filter((user: any) => user.role === "student");

        // Get all purchases
        const allPurchases = await purchaseService.getAllPurchases();

        // Map students with their purchases
        const studentsWithPurchases = studentUsers.map((student: any) => ({
          id: student.id,
          name: student.name || "N/A",
          email: student.email || "N/A",
          role: student.role,
          purchases: allPurchases.filter((p: any) => p.userId === student.id),
        }));

        setStudents(studentsWithPurchases);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

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
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Students</h1>
        <p className="text-gray-600">View all students and their enrolled courses</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Student</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Enrolled Courses</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Total Spent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {students.map((student) => {
                const totalCourses = student.purchases.reduce(
                  (sum, p) => sum + (p.courses?.length || 0),
                  0
                );
                const totalSpent = student.purchases.reduce(
                  (sum, p) => sum + (p.total || 0),
                  0
                );

                return (
                  <tr key={student.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <User size={20} className="text-indigo-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">{student.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{student.email}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <BookOpen size={18} className="text-indigo-600" />
                        <span className="font-semibold text-gray-800">{totalCourses}</span>
                        <span className="text-gray-600">courses</span>
                      </div>
                      {student.purchases.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {student.purchases.map((purchase: any) =>
                            purchase.courses?.map((course: any, idx: number) => (
                              <div key={idx} className="text-sm text-gray-600">
                                • {course.title}
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-lg font-bold text-green-600">
                        ${totalSpent.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {students.length === 0 && (
        <div className="text-center py-12 text-gray-600">
          No students found
        </div>
      )}
    </div>
  );
};

export default Students;

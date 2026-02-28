import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import type { Course } from "../types/types";

export const purchaseService = {
  async createPurchase(userId: string, courses: Course[]) {
    // Ensure courses have explicit courseId field for reliable lookup
    const coursesWithCourseId = courses.map((course) => ({
      ...course,
      courseId: course.id, // Explicitly store the ID as courseId for backup
    }));

    const purchase = {
      userId,
      courses: coursesWithCourseId,
      courseIds: courses.map((c) => c.id), // Also store just the IDs for quick lookups
      total: courses.reduce((sum, c) => sum + c.price, 0),
      purchaseDate: new Date().toISOString(),
      status: "completed",
    };

    const docRef = await addDoc(collection(db, "purchases"), purchase);
    console.log("Purchase created with ID:", docRef.id);
    console.log(
      "Courses saved:",
      coursesWithCourseId.map((c) => `${c.title} (${c.id})`),
    );
    return docRef.id;
  },

  async getUserPurchases(userId: string) {
    const q = query(collection(db, "purchases"), where("userId", "==", userId));
    const snapshot = await getDocs(q);
    const purchases = snapshot.docs.map((doc) => {
      const data = { id: doc.id, ...doc.data() };
      console.log("Retrieved purchase with courses:", data);
      if (data.courses && Array.isArray(data.courses)) {
        console.log("Courses array:", data.courses);
        data.courses.forEach((course: any, idx: number) => {
          console.log(`Course ${idx}:`, course);
          console.log(`  - Has 'id'?`, "id" in course, course.id);
          console.log(`  - Keys:`, Object.keys(course));
        });
      }
      return data;
    });
    return purchases;
  },

  async getAllPurchases() {
    const snapshot = await getDocs(collection(db, "purchases"));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  async getCourseEnrollmentCount(courseId: string) {
    const purchases = await this.getAllPurchases();
    let count = 0;
    purchases.forEach((purchase: any) => {
      if (
        purchase.courses?.some(
          (c: any) => c.id === courseId || c.courseId === courseId,
        )
      ) {
        count++;
      }
    });
    return count;
  },

  async hasPurchasedCourse(userId: string, courseId: string) {
    const purchases = await this.getUserPurchases(userId);
    const hasPurchase = purchases.some((purchase: any) => {
      // Check if courseId is in courseIds array (fastest lookup)
      if (purchase.courseIds?.includes(courseId)) {
        return true;
      }
      // Fallback: check courses array with multiple possible id fields
      return purchase.courses?.some(
        (c: any) => c.id === courseId || c.courseId === courseId,
      );
    });
    console.log("hasPurchasedCourse(", courseId, ") =", hasPurchase);
    return hasPurchase;
  },
};

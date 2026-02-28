import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import type { Course } from "../types/types";

export const purchaseService = {
  async createPurchase(userId: string, courses: Course[]) {
    console.log("Creating purchase for user:", userId);
    console.log("Courses to save:", courses);
    const purchase = {
      userId,
      courses: courses,
      total: courses.reduce((sum, c) => sum + c.price, 0),
      purchaseDate: new Date().toISOString(),
      status: "completed",
    };
    console.log("Purchase object:", purchase);

    const docRef = await addDoc(collection(db, "purchases"), purchase);
    console.log("Purchase created with ID:", docRef.id);
    return docRef.id;
  },

  async getUserPurchases(userId: string) {
    const q = query(collection(db, "purchases"), where("userId", "==", userId));
    const snapshot = await getDocs(q);
    const purchases = snapshot.docs.map((doc) => {
      const data = { id: doc.id, ...doc.data() };
      console.log("Retrieved purchase:", data);
      return data;
    });
    console.log("All purchases for user:", purchases);
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
    return purchases.some((purchase: any) =>
      purchase.courses.some(
        (c: any) => c.id === courseId || c.courseId === courseId,
      ),
    );
  },
};

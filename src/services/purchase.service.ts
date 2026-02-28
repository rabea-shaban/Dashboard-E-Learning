import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import type { Course } from "../types/types";

/**
 * Firestore Purchase Shape (without document ID)
 */
type FirestorePurchase = {
  userId: string;
  courses?: any[];
  courseIds?: string[];
  total: number;
  purchaseDate: string;
  status: string;
};

/**
 * Purchase Record with Firestore doc ID
 */
export type PurchaseRecord = FirestorePurchase & {
  id: string;
};

export const purchaseService = {
  async createPurchase(userId: string, courses: Course[]) {
    const coursesWithCourseId = courses.map((course) => ({
      ...course,
      courseId: course.id, // Backup ID
    }));

    const purchase: FirestorePurchase = {
      userId,
      courses: coursesWithCourseId,
      courseIds: courses.map((c) => c.id),
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

  async getUserPurchases(userId: string): Promise<PurchaseRecord[]> {
    const q = query(collection(db, "purchases"), where("userId", "==", userId));
    const snapshot = await getDocs(q);

    const purchases: PurchaseRecord[] = snapshot.docs.map((doc) => {
      const data = doc.data() as FirestorePurchase;

      return {
        id: doc.id,
        ...data,
      };
    });

    return purchases;
  },

  async getAllPurchases(): Promise<PurchaseRecord[]> {
    const snapshot = await getDocs(collection(db, "purchases"));

    return snapshot.docs.map((doc) => {
      const data = doc.data() as FirestorePurchase;

      return {
        id: doc.id,
        ...data,
      };
    });
  },

  async getCourseEnrollmentCount(courseId: string) {
    const purchases = await this.getAllPurchases();
    let count = 0;

    purchases.forEach((purchase) => {
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

    const hasPurchase = purchases.some((purchase) => {
      if (purchase.courseIds?.includes(courseId)) {
        return true;
      }

      return purchase.courses?.some(
        (c: any) => c.id === courseId || c.courseId === courseId,
      );
    });

    console.log("hasPurchasedCourse(", courseId, ") =", hasPurchase);

    return hasPurchase;
  },
};

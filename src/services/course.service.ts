import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../../config/firebase";

const COURSES_COLLECTION = "courses";

export const courseService = {
  subscribe(callback: (data: any[]) => void) {
    const q = query(
      collection(db, COURSES_COLLECTION),
      orderBy("createdAt", "desc"),
    );

    return onSnapshot(q, (snapshot) => {
      const courses = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      callback(courses);
    });
  },

  create(data: any) {
    return addDoc(collection(db, COURSES_COLLECTION), {
      ...data,
      createdAt: new Date(),
    });
  },

  update(id: string, data: any) {
    return updateDoc(doc(db, COURSES_COLLECTION, id), data);
  },

  delete(id: string) {
    return deleteDoc(doc(db, COURSES_COLLECTION, id));
  },
};

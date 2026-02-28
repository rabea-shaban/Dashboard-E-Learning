import { setDoc, doc } from "firebase/firestore";
import { db } from "../../config/firebase";

export const userService = {
  async createUserProfile(user: any, role: string) {
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      role: role, // 👈 dynamic role
      createdAt: new Date(),
    });
  },
};

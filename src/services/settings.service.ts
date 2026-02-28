import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase";

export interface UserSettings {
  profile: {
    displayName: string;
    email: string;
    phone: string;
    bio: string;
    language: string;
    timezone: string;
    photoURL?: string;
  };
  notifications: {
    emailNotifications: boolean;
    courseUpdates: boolean;
    newMessages: boolean;
    assignments: boolean;
    promotions: boolean;
  };
}

class SettingsService {
  async getUserSettings(userId: string): Promise<UserSettings | null> {
    try {
      const docRef = doc(db, "userSettings", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data() as UserSettings;
      }
      return null;
    } catch (error) {
      console.error("Error getting user settings:", error);
      throw error;
    }
  }

  async updateProfile(userId: string, profile: UserSettings["profile"]) {
    try {
      const docRef = doc(db, "userSettings", userId);
      await setDoc(docRef, { profile }, { merge: true });
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  }

  async updateNotifications(
    userId: string,
    notifications: UserSettings["notifications"],
  ) {
    try {
      const docRef = doc(db, "userSettings", userId);
      await setDoc(docRef, { notifications }, { merge: true });
    } catch (error) {
      console.error("Error updating notifications:", error);
      throw error;
    }
  }

  async initializeSettings(userId: string, email: string, displayName: string) {
    try {
      const docRef = doc(db, "userSettings", userId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        const defaultSettings: UserSettings = {
          profile: {
            displayName,
            email,
            phone: "",
            bio: "",
            language: "en",
            timezone: "UTC",
          },
          notifications: {
            emailNotifications: true,
            courseUpdates: true,
            newMessages: true,
            assignments: true,
            promotions: false,
          },
        };
        await setDoc(docRef, defaultSettings);
      }
    } catch (error) {
      console.error("Error initializing settings:", error);
      throw error;
    }
  }
}

export const settingsService = new SettingsService();

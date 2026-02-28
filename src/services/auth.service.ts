import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../config/firebase";

export const authService = {
  async register(name: string, email: string, password: string) {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    await updateProfile(userCredential.user, {
      displayName: name,
    });

    const token = await userCredential.user.getIdToken();
    localStorage.setItem('authToken', token);

    return userCredential.user;
  },
  
  async login(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();
    localStorage.setItem('authToken', token);
    return userCredential;
  },
  
  async logout() {
    localStorage.removeItem('authToken');
    return signOut(auth);
  },
  
  getToken() {
    return localStorage.getItem('authToken');
  },
};

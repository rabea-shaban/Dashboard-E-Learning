import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

const addUser = async () => {
  try {
    await addDoc(collection(db, "users"), {
      name: "Rabea",
      age: 23,
    });
    console.log("User added");
  } catch (err) {
    console.error(err);
  }
};

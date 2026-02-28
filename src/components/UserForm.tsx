import { useForm } from "react-hook-form";
import { db } from "../../config/firebase";
import { collection, addDoc } from "firebase/firestore";
import type { UserFormData } from "../types/types";

export default function UserForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>();

  const onSubmit = async (data: UserFormData) => {
    try {
      await addDoc(collection(db, "users"), data);
      alert("User added successfully ✅");
      reset();
    } catch (error) {
      console.error(error);
      alert("Error adding user ❌");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ maxWidth: 400, margin: "auto" }}
    >
      <h2>Add User</h2>

      <input
        placeholder="Name"
        {...register("name", { required: "Name is required" })}
      />
      {errors.name && <p>{errors.name.message}</p>}

      <input
        placeholder="Email"
        type="email"
        {...register("email", { required: "Email is required" })}
      />
      {errors.email && <p>{errors.email.message}</p>}

      <input
        placeholder="Age"
        type="number"
        {...register("age", {
          required: "Age is required",
          valueAsNumber: true,
        })}
      />
      {errors.age && <p>{errors.age.message}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Submit"}
      </button>
    </form>
  );
}

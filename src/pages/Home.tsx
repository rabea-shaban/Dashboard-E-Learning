import { useForm } from "react-hook-form";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

const Home = () => {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    await addDoc(collection(db, "users"), data);
    reset();
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Dashboard</h1>
      <p className="text-gray-600">Welcome to E-Learning Platform</p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("name")} placeholder="Name" />
        <input {...register("email")} placeholder="Email" />
        <button>Add</button>
      </form>
    </div>
  );
};

export default Home;

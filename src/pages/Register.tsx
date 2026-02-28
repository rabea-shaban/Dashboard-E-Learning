import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { authService } from "../services/auth.service";
import { userService } from "../services/user.service";
import { toast } from "react-toastify";

type FormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const password = watch("password");

  const onSubmit = async (data: FormData) => {
    try {
      const user = await authService.register(
        data.name,
        data.email,
        data.password,
      );

      await userService.createUserProfile(user, "student");
      toast.success("Account created successfully");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-center mb-6">
            Create Account
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <input
              {...register("name", { required: "Name required" })}
              placeholder="Full name"
              className="w-full p-3 border rounded"
            />
            {errors.name && (
              <p className="text-red-500">{errors.name.message}</p>
            )}

            {/* Email */}
            <input
              {...register("email", { required: "Email required" })}
              placeholder="Email"
              className="w-full p-3 border rounded"
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}

            {/* Password */}
            <input
              {...register("password", {
                required: "Password required",
                minLength: { value: 6, message: "Min 6 characters" },
              })}
              type="password"
              placeholder="Password"
              className="w-full p-3 border rounded"
            />
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}

            {/* Confirm Password */}
            <input
              {...register("confirmPassword", {
                validate: (value) =>
                  value === password || "Passwords not match",
              })}
              type="password"
              placeholder="Confirm password"
              className="w-full p-3 border rounded"
            />
            {errors.confirmPassword && (
              <p className="text-red-500">{errors.confirmPassword.message}</p>
            )}

            {/* Submit */}
            <button
              disabled={isSubmitting}
              className="w-full bg-indigo-600 text-white p-3 rounded"
            >
              {isSubmitting ? "Creating..." : "Create Account"}
            </button>
          </form>

          <p className="mt-4 text-center">
            Already have account?{" "}
            <a href="/auth/login" className="text-indigo-600">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

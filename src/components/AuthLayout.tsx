import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 p-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </main>
  );
};

export default AuthLayout;

import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import AuthLayout from "./AuthLayout";
import Home from "../pages/Home";
import Courses from "../pages/Courses";
import Students from "../pages/Students";
import Analytics from "../pages/Analytics";
import Settings from "../pages/Settings";
import Login from "../pages/Login";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";

const Router = () => {
  return (
    <Routes>
      <Route path="/auth" element={<AuthLayout />}>
        <Route index element={<Login />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="courses" element={<Courses />} />
        <Route path="students" element={<Students />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Router;

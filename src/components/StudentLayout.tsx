import { Outlet } from "react-router-dom";
import StudentSidebar from "./StudentSidebar";

const StudentLayout = () => {
  return (
    <div className="flex">
      <StudentSidebar />
      <main className="flex-1 min-h-screen bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export default StudentLayout;

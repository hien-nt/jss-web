// import { Outlet } from "react-router-dom";
import { ProtectedRoute } from "../hoc/ProtectedRoute";
// import MenuList from "../components/MenuList";
// import Sidebar from "../components/Sidebar";
import MenuBar from "../hoc/SideBar";

const ProtectedLayout = () => {
  return (
    <ProtectedRoute>
        <MenuBar />
          {/* <Outlet /> */}
    </ProtectedRoute>
  );
};

export default ProtectedLayout;

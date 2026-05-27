import Sidebar from "./Sidebar/Sidebar";
import Topbar from "./Topbar/Topbar";
import { Outlet } from "react-router-dom";
import "./Layout.css";

export default function Layout() {
  return (
    <div className="app-layout-container">
      <Sidebar />
      <div className="main-content-container">
        <Topbar />
        <div className="page-container">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

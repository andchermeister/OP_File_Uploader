import Sidebar from "./Sidebar/Sidebar";
import Topbar from "./Topbar/Topbar";
import { Outlet } from "react-router-dom";
import "./Layout.css";

interface LayoutProps {
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  onSignout: () => void;
}

export default function Layout({ user, onSignout }: LayoutProps) {
  return (
    <div className="app-layout-container">
      <Sidebar />
      <div className="main-content-container">
        <Topbar user={user} onSignout={onSignout} />
        <div className="page-container">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

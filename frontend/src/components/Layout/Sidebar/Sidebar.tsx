import "./Sidebar.css";
import { SidebarData } from "./SidebarData";
import AddIcon from "@mui/icons-material/Add";
import StratosLogo from "../../../assets/stratos-logo-small.png";

export default function Sidebar() {
  return (
    <div className="sidebar-container">
      <div className="sidebar-logo-container">
        <img
          src={StratosLogo}
          alt="Stratos logo"
          className="sidebar-logo-img"
        />
        <span className="sidebar-logo-text">Stratos</span>
      </div>
      <button className="sidebar-button">
        <span className="sidebar-button-icon">
          <AddIcon />
        </span>
        <span className="sidebar-button-text">New</span>
      </button>
      <ul className="sidebar-list">
        {SidebarData.map((val) => {
          return (
            <li
              key={val.link}
              className={`sidebar-row ${window.location.pathname === val.link ? "active" : ""}`}
              onClick={() => {
                window.location.pathname = val.link;
              }}
            >
              <div className="sidebar-icon">{val.icon}</div>{" "}
              <div className="sidebar-title">{val.title}</div>{" "}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

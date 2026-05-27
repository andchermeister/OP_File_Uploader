import "./Sidebar.css";
import { SidebarData } from "./SidebarData";
import AddIcon from "@mui/icons-material/Add";
import StratosLogo from "../../../assets/stratos-logo-small.png";

export default function Sidebar() {
  return (
    <div className="sidebar-container">
      <div className="sidebar-logo-container">
        <img src={StratosLogo} alt="Stratos logo" id="sidebar-logo-img" />
        <span id="sidebar-logo-text">Stratos</span>
      </div>
      <button className="sidebar-button">
        <span id="sidebar-button-icon">
          <AddIcon />
        </span>
        <span id="sidebar-button-text">New</span>
      </button>
      <ul className="sidebar-list">
        {SidebarData.map((val, key) => {
          return (
            <li
              key={key}
              className="sidebar-row"
              id={window.location.pathname == val.link ? "active" : ""}
              onClick={() => {
                window.location.pathname = val.link;
              }}
            >
              <div id="sidebar-icon">{val.icon}</div>{" "}
              <div id="sidebar-title">{val.title}</div>{" "}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

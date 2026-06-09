import "./Sidebar.css";
import { SidebarData } from "./SidebarData";
import AddIcon from "@mui/icons-material/Add";
import StratosLogo from "../../../assets/stratos-logo-small.png";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdown, setIsDropdown] = useState(false);
  const dropDownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropDownRef.current &&
        !dropDownRef.current.contains(event.target as Node)
      ) {
        setIsDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
      <div className="drop-down-wrapper" ref={dropDownRef}>
        <button
          className="sidebar-button"
          onClick={() => setIsDropdown(!isDropdown)}
        >
          <span className="sidebar-button-icon">
            <AddIcon />
          </span>
          <span className="sidebar-button-text">New</span>
        </button>

        <div className={`drop-down ${isDropdown ? "open" : ""}`}>
          <div
            className="drop-down-item"
            onClick={() => setIsDropdown(!isDropdown)}
          >
            New folder
          </div>
          <div
            className="drop-down-item"
            onClick={() => setIsDropdown(!isDropdown)}
          >
            Add file
          </div>
        </div>
      </div>

      <ul className="sidebar-list">
        {SidebarData.map((val) => {
          return (
            <li
              key={val.link}
              className={`sidebar-row ${location.pathname === val.link ? "active" : ""}`}
              onClick={() => {
                navigate(val.link);
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

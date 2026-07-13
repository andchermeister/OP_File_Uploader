import "./Sidebar.css";
import { SidebarData } from "./SidebarData";
import FolderModal from "./FolderModal";
import AddIcon from "@mui/icons-material/Add";
import StratosLogo from "../../../assets/stratos-logo-small.png";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdown, setIsDropdown] = useState(false);
  const dropDownRef = useRef<HTMLDivElement>(null);
  const [isModal, setIsModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleCreateFolderSubmit = async (name: string) => {
    try {
      const response = await fetch("http://localhost:3000/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
        credentials: "include",
      });

      if (response.ok) {
        console.log("Folder commited to database successfully!");
        setIsModal(false);
        window.dispatchEvent(new Event("folderCreated"));
      }
    } catch (error) {
      console.error("Failed to create the folder:", error);
    }
  };

  const handleAddFileClick = () => {
    setIsDropdown(!isDropdown);
    if (fileInputRef.current) {
      fileInputRef.current?.click();
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    const data = new FormData();
    data.append("file", file);

    try {
      const response = await fetch("http://localhost:3000/files/upload", {
        method: "POST",
        body: data,
        credentials: "include",
      });

      if (response.ok) {
        console.log("File uploaded succesfully");
      } else {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          console.error("File upload failed", errorData);
        } else {
          const errorText = await response.text();
          console.error("File upload failed", errorText);
        }
      }
    } catch (error) {
      console.log("An error occured during file upload", error);
    } finally {
      if (e.target) {
        e.target.value = "";
      }
    }
  };

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
            onClick={() => {
              setIsDropdown(!isDropdown);
              setIsModal(true);
            }}
          >
            New folder
          </div>
          <div className="drop-down-item" onClick={handleAddFileClick}>
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

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />

      {isModal && (
        <FolderModal
          onClose={() => setIsModal(false)}
          onSubmit={handleCreateFolderSubmit}
        />
      )}
    </div>
  );
}

import { useState, useEffect } from "react";
import "../MainWindow.css";
import "./Folders.css";
import { useNavigate } from "react-router-dom";
import FolderIcon from "@mui/icons-material/Folder";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import DeleteIcon from "@mui/icons-material/Delete";

interface Folder {
  id: number;
  name: string;
}

export default function Folders() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setVisible] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [folderId, setFolderId] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await fetch("http://localhost:3000/folders", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch folders");
        }

        const data = await response.json();
        console.log("Fetched data:", data);

        if (Array.isArray(data)) {
          setFolders(data);
        } else {
          setFolders(data.folders || data.data || []);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchFolders();

    window.addEventListener("folderCreated", fetchFolders);
    return () => window.removeEventListener("folderCreated", fetchFolders);
  }, []);

  const handleFolderClick = (id: number, name: string) => {
    setFolderId(id);
    setFolderName(name);
    setVisible(!isVisible);
  };

  const handleFolderDblClick = (id: number) => {
    navigate(`/folders/${id}`);
  };

  const handleFolderDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this folder?",
    );
    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/folders/${folderId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete the folder");
      }

      window.location.reload();
    } catch (err: unknown) {
      console.error(err);
      alert("Could not delete the folder. Please try again");
    }
  };

  return (
    <div className="main-window-container">
      <h1>Folders page</h1>

      {isLoading && <p>Loading folders...</p>}
      {error && <p className="error-message">{error}</p>}

      <div
        className={
          isVisible
            ? "contextual-action-toolbar is-visible"
            : "contextual-action-toolbar is-hidden"
        }
      >
        <div className="toolbar-tools">
          <button className="tool-btn" onClick={() => setVisible(!isVisible)}>
            <CloseIcon />
          </button>
          <span className="selection-count">{folderName} selected</span>
          <button className="tool-btn">
            <DownloadIcon />
          </button>
          <button className="tool-btn">
            <DriveFileRenameOutlineIcon />
          </button>
          <button className="tool-btn" onClick={() => handleFolderDelete()}>
            <DeleteIcon />
          </button>
        </div>
      </div>

      <ul className="folders-list">
        {Array.isArray(folders) &&
          folders.map((folder) => (
            <li
              key={folder.id}
              className="folder-item"
              onClick={() => handleFolderClick(folder.id, folder.name)}
              onDoubleClick={() => handleFolderDblClick(folder.id)}
            >
              <FolderIcon className="folder-icon" sx={{ fontSize: 120 }} />
              <span className="folder-name">{folder.name}</span>
            </li>
          ))}
      </ul>
    </div>
  );
}

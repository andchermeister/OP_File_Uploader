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
  const [isRenaming, setIsRenaming] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

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

  const handleFolderRename = async (
    folderId: number,
    newFolderName: string,
  ) => {
    const trimmed = newFolderName.trim();
    if (!trimmed) {
      setIsRenaming(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/folders/${folderId}`,
        {
          credentials: "include",
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: trimmed }),
        },
      );

      if (!response.ok) {
        console.error("Failed to rename the folder: ", response.statusText);
        return;
      }

      setFolderName(trimmed);
      setIsRenaming(false);
      window.dispatchEvent(new Event("folderCreated"));
    } catch (error: unknown) {
      alert("Could not rename the folder");
      console.error("Could not rename the folder:", error);
    }
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
          {isRenaming ? (
            <input
              className="rename-input"
              autoFocus
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleFolderRename(folderId, newFolderName);
                } else if (e.key === "Escape") {
                  setIsRenaming(false);
                }
              }}
              onBlur={() => handleFolderRename(folderId, newFolderName)}
            />
          ) : (
            <span className="selection-count">{folderName} selected</span>
          )}

          <button className="tool-btn">
            <DownloadIcon />
          </button>
          <button
            className="tool-btn"
            onClick={() => {
              setNewFolderName(folderName);
              setIsRenaming(true);
            }}
          >
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

import { useState, useEffect } from "react";
import "../../MainWindow.css";
import "./Files.css";
import "../contextualToolbar.css";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import DeleteIcon from "@mui/icons-material/Delete";

interface File {
  id: number;
  name: string;
}

export default function Files() {
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setVisible] = useState(false);
  const [fileName, setFileName] = useState("");
  const [newFileName, setNewFileName] = useState("");
  const [fileId, setFileId] = useState(0);
  const [isRenaming, setIsRenaming] = useState(false);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch("http://localhost:3000/files", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch files");
        }

        const payload = await response.json();
        console.log("Fetched data:", payload);

        if (payload && Array.isArray(payload.data)) {
          setFiles(payload.data);
        } else {
          setFiles([]);
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

    fetchFiles();

    window.addEventListener("fileChanged", fetchFiles);
    return () => window.removeEventListener("fileChanged", fetchFiles);
  }, []);

  const handleFileClick = (id: number, name: string) => {
    setFileId(id);
    setFileName(name);
    setVisible(!isVisible);
  };

  const handleFileRename = async (fileId: number, newFileName: string) => {
    const trimmed = newFileName.trim();
    if (!trimmed) {
      setIsRenaming(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/files/${fileId}`, {
        credentials: "include",
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });

      if (!response.ok) {
        console.error("Failed to rename the file:", response.statusText);
        return;
      }

      setFileName(trimmed);
      setIsRenaming(false);
      window.dispatchEvent(new Event("fileChanged"));
    } catch (error: unknown) {
      alert("Could not rename the file");
      console.error("Could not rename the file", error);
    }
  };

  const handleFileDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this file?",
    );
    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/files/${fileId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete the file");
      }

      window.dispatchEvent(new Event("fileChanged"));
    } catch (err: unknown) {
      console.error(err);
      alert("Could not delete the folder. Please try again.");
    }
  };

  return (
    <div className="main-window-container">
      <h1>Files page</h1>

      {isLoading && <p>Loading files...</p>}
      {error && <p>{error}</p>}

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
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleFileRename(fileId, newFileName);
                } else if (e.key === "Escape") {
                  setIsRenaming(false);
                }
              }}
              onBlur={() => handleFileRename(fileId, newFileName)}
            />
          ) : (
            <span className="selection-count">{fileName} selected</span>
          )}

          <button className="tool-btn">
            <DownloadIcon />
          </button>
          <button
            className="tool-btn"
            onClick={() => {
              setNewFileName(fileName);
              setIsRenaming(true);
            }}
          >
            <DriveFileRenameOutlineIcon />
          </button>
          <button className="tool-btn" onClick={() => handleFileDelete()}>
            <DeleteIcon />
          </button>
        </div>
      </div>

      <ul className="files-list">
        {Array.isArray(files) &&
          files.map((file) => (
            <li
              key={file.id}
              className="file-item"
              onClick={() => handleFileClick(file.id, file.name)}
            >
              <InsertDriveFileIcon className="file-icon" />
              <span className="file-name">{file.name}</span>
            </li>
          ))}
      </ul>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../MainWindow.css";
import "../Files/Files.css";
import "./Folder.css";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import ClearIcon from "@mui/icons-material/Clear";

interface File {
  id: number;
  name: string;
}

export default function Folder() {
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [folderName, setFolderName] = useState("");
  const { folderId } = useParams<{ folderId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFolderFiles = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/folders/${folderId}`,
          {
            credentials: "include",
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data from folder");
        }

        const data = await response.json();
        const filesData = data.data.files;
        console.log("Fetched files from folder:", data);
        setFolderName(data.data.name);
        if (Array.isArray(filesData)) {
          setFiles(filesData);
        } else {
          setFiles([]);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occured");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchFolderFiles();
  }, [folderId]);

  if (isLoading) {
    return <p>Loading folder content...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const handleDeleteFolder = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this folder",
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

      navigate("/folders");
    } catch (err: unknown) {
      console.error(err);
      alert("Could not delete the folder. Please try again");
    }
  };

  return (
    <div className="main-window-container">
      <h1>Folder page</h1>
      <div className="folder-page-header">
        <span>Stratos homepage</span>
        <KeyboardArrowRightIcon className="breadcrump-separator" />
        <span className="folder-name">{folderName}</span>
        <button onClick={() => handleDeleteFolder()}>
          <ClearIcon />
        </button>
      </div>
      <ul className="files-list">
        {Array.isArray(files) &&
          files.map((file) => {
            return (
              <li key={file.id} className="file-item">
                <InsertDriveFileIcon className="file-icon" />
                <span className="file-name">{file.name}</span>
              </li>
            );
          })}
      </ul>
    </div>
  );
}

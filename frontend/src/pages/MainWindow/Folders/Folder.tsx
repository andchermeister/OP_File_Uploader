import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../MainWindow.css";
import "../Files/Files.css";
import "./Folder.css";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

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

    window.addEventListener("fileInFolderCreated", fetchFolderFiles);
    return () =>
      window.removeEventListener("fileInFolderCreated", fetchFolderFiles);
  }, [folderId]);

  if (isLoading) {
    return <p>Loading folder content...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="main-window-container">
      <h1 className="folder-name">{folderName}</h1>
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

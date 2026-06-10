import { useState, useEffect } from "react";
import "../MainWindow.css";
import "./Files.css";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

interface File {
  id: number;
  name: string;
}

export default function Files() {
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch("http://localhost:3000/files", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch files");
        }

        const data = await response.json();
        console.log("Fetched data:", data);

        if (Array.isArray(data)) {
          setFiles(data);
        } else {
          setFiles(data.folders || data.data || []);
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

    window.addEventListener("fileUploaded", fetchFiles);
    return () => window.removeEventListener("fileUploaded", fetchFiles);
  }, []);

  return (
    <div className="main-window-container">
      <h1>Files page</h1>

      {isLoading && <p>Loading files...</p>}
      {error && <p className="error-message">{error}</p>}

      <ul className="files-list">
        {Array.isArray(files) &&
          files.map((file) => (
            <li key={file.id} className="file-item">
              <InsertDriveFileIcon className="file-icon" />
              <span className="file-name">{file.name}</span>
            </li>
          ))}
      </ul>
    </div>
  );
}

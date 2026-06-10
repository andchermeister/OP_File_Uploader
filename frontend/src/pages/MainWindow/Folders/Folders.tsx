import { useState, useEffect } from "react";
import "../MainWindow.css";
import "./Folders.css";

interface Folder {
  id: number;
  name: string;
}

export default function Folders() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  }, []);

  return (
    <div className="main-window-container">
      <h1>Folders page</h1>

      {isLoading && <p>Loading folders...</p>}
      {error && <p className="error-message">{error}</p>}

      <ul className="folders-list">
        {Array.isArray(folders) &&
          folders.map((folder) => (
            <li key={folder.id} className="folder-item">
              {folder.name}
            </li>
          ))}
      </ul>
    </div>
  );
}

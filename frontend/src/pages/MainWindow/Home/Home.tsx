import "../MainWindow.css";
import "./Home.css";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import FolderIcon from "@mui/icons-material/Folder";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState } from "react";

interface HomeProps {
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
}

interface Folder {
  id: string;
  name: string;
}

interface File {
  id: string;
  name: string;
  created_at: string;
  location: string;
}

const MOCK_FOLDERS: Folder[] = [
  { id: "1", name: "Display folder 1" },
  { id: "2", name: "Display folder 2" },
];

const MOCK_FILES: File[] = [
  {
    id: "1",
    name: "Display file 1",
    created_at: "2025",
    location: "Display folder 1",
  },
  {
    id: "2",
    name: "Display file 2",
    created_at: "2026",
    location: "Display folder 1",
  },
];

export default function Home({ user }: HomeProps) {
  const [isActiveFolders, setIsActiveFolders] = useState(false);
  const [isActiveFiles, setIsActiveFiles] = useState(false);

  const handleFoldersClick = () => {
    setIsActiveFolders((prev) => !prev);
  };

  const handleFilesClick = () => {
    setIsActiveFiles((prev) => !prev);
  };

  return (
    <div className="main-window-container">
      <h1 className="main-header">Welcome to Stratos, {user?.name}</h1>
      <div className="homepage-dropdowns">
        <button onClick={handleFoldersClick} className="folder-dropdown-btn">
          <div className="dropdown-arrow-icon">
            {isActiveFolders ? (
              <KeyboardArrowDownIcon />
            ) : (
              <KeyboardArrowRightIcon />
            )}
          </div>
          <span className="dropdown-text">Suggested folders</span>
        </button>
        {isActiveFolders && (
          <div className="folder-display">
            {MOCK_FOLDERS.map((folder) => (
              <div key={folder.id} className="folder-card">
                <div className="folder-icon">
                  <FolderIcon />
                </div>
                <span className="folder-name">{folder.name}</span>
                <div className="folder-more-icon">
                  <MoreVertIcon />
                </div>
              </div>
            ))}
          </div>
        )}
        <button onClick={handleFilesClick} className="file-dropdown-btn">
          <div className="dropdown-arrow-icon">
            {isActiveFiles ? (
              <KeyboardArrowDownIcon />
            ) : (
              <KeyboardArrowRightIcon />
            )}
          </div>
          <span className="dropdown-text">Suggested files</span>
        </button>
        {isActiveFiles && (
          <div className="file-display">
            <div className="file-date-location">
              <span className="file-date-location__name">Name</span>
              <span className="file-date-location__date">Date</span>
              <span className="file-date-location__location">Location</span>
              <span className="file-date-location__separator"></span>
            </div>
            {MOCK_FILES.map((file) => (
              <div key={file.id} className="file-card">
                <span className="file-name">{file.name}</span>
                <span className="file-date">{file.created_at}</span>
                <span className="file-location">{file.location}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { useState } from "react";

interface FolderModalProps {
  onClose: () => void;
  onSubmit: (folderName: string) => void;
}

export default function FolderModal({ onClose, onSubmit }: FolderModalProps) {
  const [folderName, setFolderName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderName.trim()) return;
    onSubmit(folderName);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <form
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <h3 className="modal-title">New folder</h3>

        <input
          type="text"
          className="modal-input"
          placeholder="Folder name"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          autoFocus
        />

        <div className="modal-actions">
          <button type="button" onClick={onClose} className="modal-cancel-btn">
            Cancel
          </button>

          <button
            type="submit"
            disabled={!folderName.trim()}
            className="modal-submit-btn"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}

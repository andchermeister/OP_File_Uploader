import SearchBar from "./Searchbar/Searchbar";
import "./Topbar.css";

interface LayoutProps {
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  onSignout: () => void;
}

export default function Topbar({ user, onSignout }: LayoutProps) {
  const handleSignOutClick = async () => {
    try {
      const response = await fetch("http://localhost:3000/auth/signout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (response.ok) {
        onSignout();
      }
    } catch (err) {
      console.log("Signout network failure:", err);
    }
  };
  return (
    <div className="topbar-container">
      <SearchBar />
      <h1>{user?.name}</h1>
      <button id="topbar-signout-button" onClick={handleSignOutClick}>
        Sign out
      </button>
    </div>
  );
}

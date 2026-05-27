import SearchBar from "./Searchbar/Searchbar";
import { Link } from "react-router-dom";
import "./Topbar.css";

export default function Topbar() {
  return (
    <div className="topbar-container">
      <SearchBar />
      <Link to="/">
        <button id="topbar-signout-button">Sign out</button>
      </Link>
    </div>
  );
}

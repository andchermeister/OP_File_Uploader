import SearchIcon from "@mui/icons-material/Search";
import "./Searchbar.css";

export default function SearchBar() {
  return (
    <div className="searchbar-input-container">
      <span id="searchbar-input-icon">
        <SearchIcon />
      </span>
      <input
        type="text"
        placeholder="Get answers from Stratus"
        id="searchbar-input-text"
      />
    </div>
  );
}

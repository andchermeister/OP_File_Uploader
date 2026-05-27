import "../../App.css";
import "./Landing.css";
import HeaderStratosLogo from "../../assets/stratos-logo-small.png";
import MainStratosLogo from "../../assets/stratos-logo-large.png";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="landing-page-container">
      <div className="landing-page-body">
        <div className="landing-page-hero">
          <img
            src={HeaderStratosLogo}
            alt="Small Stratos logo"
            id="landing-hero-logo-img"
          />
          <h3 id="landing-hero-text">Stratos Drive</h3>
        </div>
        <h1 id="landing-page-header">Store and share files online</h1>
        <Link to="/signin" id="landing-link">
          <button id="landing-page-sign-in-btn">Sign in</button>
        </Link>
      </div>
      <div className="landing-page-logo">
        <img
          src={MainStratosLogo}
          alt="Large Stratos logo"
          id="landing-main-logo-img"
        />
      </div>
    </div>
  );
}

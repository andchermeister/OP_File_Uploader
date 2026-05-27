import { Link } from "react-router-dom";
import "./Auth.css";

export default function Signup() {
  return (
    <div className="auth-container">
      <div className="auth-header-container">
        <h2 className="auth-header-text">Sign up</h2>
      </div>
      <form className="auth-form">
        <div>
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="auth-input"
            required
          />
        </div>
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="auth-input"
            required
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="auth-input"
            required
          />
        </div>
        <Link to="/home">
          <button type="submit" className="auth-btn">
            Sign up
          </button>
        </Link>
      </form>
    </div>
  );
}

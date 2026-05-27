import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Auth.css";

export default function Signin() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        alert("Logged in successfully!");
      } else {
        setError(data.message || "Authentication failed");
      }
    } catch (err) {
      console.error("Login connection error:", err);
      setError("Cannot connect to the server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header-container">
        <h2 className="auth-header-text">Sign in</h2>
        <span>
          or{" "}
          <Link to="/signup" id="auth-link">
            create an account
          </Link>
        </span>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
      <form onSubmit={handleSubmit} className="auth-form">
        <div>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username or email"
            className="auth-input"
            required
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="auth-input"
            required
          />
        </div>
        <Link to="/home">
          <button type="submit" disabled={loading} className="auth-btn">
            {loading ? "Logging in..." : "Sign in"}
          </button>
        </Link>
      </form>
    </div>
  );
}

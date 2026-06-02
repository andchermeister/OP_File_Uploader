import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Account created successfully! Please sign in");
        navigate("/signin");
      } else {
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.log("Signup connection error:", err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="auth-container">
      <div className="auth-header-container">
        <h2 className="auth-header-text">Sign up</h2>
        <span>
          Already have an account?{" "}
          <Link to="/signin" id="auth-link">
            Sign in
          </Link>
        </span>
        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      </div>
      <form onSubmit={handleSubmit} className="auth-form">
        <div>
          <input
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="auth-input"
            required
          />
        </div>
        <div>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="auth-input"
            required
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="auth-input"
            required
          />
        </div>
        <button type="submit" className="auth-btn">
          {loading ? "Creating account..." : "Sign up"}
        </button>
      </form>
    </div>
  );
}

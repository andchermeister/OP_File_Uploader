import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Landing from "./pages/Landing/Landing";
import Layout from "./components/Layout/Layout";
import Signin from "./pages/Auth/Signin";
import Signup from "./pages/Auth/Signup";
import Home from "./pages/MainWindow/Home/Home";
import Files from "./pages/MainWindow/Files/Files";
import Folders from "./pages/MainWindow/Folders/Folders";

interface User {
  id: string;
  name: string;
  email: string;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("http://localhost:3000/auth/me", {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user || data);
        }
      } catch (err) {
        console.error("Failed to check session:", err);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div className="app-layout-container">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/signin"
            element={
              !user ? <Signin setUser={setUser} /> : <Navigate to="/home" />
            }
          />
          <Route path="/signup" element={<Signup />} />
          <Route
            element={
              user ? (
                <Layout user={user} onSignout={() => setUser(null)} />
              ) : (
                <Navigate to="/signin" />
              )
            }
          >
            <Route
              path="/home"
              element={user ? <Home user={user} /> : <Navigate to="/signin" />}
            />
            <Route path="/files" element={<Files />} />
            <Route path="/folders" element={<Folders />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

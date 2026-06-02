import { useEffect, useState } from "react";
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/auth/me", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading Stratos Cloud...</div>;
  return (
    <div className="app-layout-container">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/signin"
            element={!user ? <Signin /> : <Navigate to="/home" />}
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

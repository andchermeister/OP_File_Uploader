import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Landing from "./pages/Landing/Landing";
import Layout from "./components/Layout/Layout";
import Signin from "./pages/Auth/Signin";
import Signup from "./pages/Auth/Signup";
import Home from "./pages/Home/Home";

export default function App() {
  return (
    <div className="app-layout-container">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

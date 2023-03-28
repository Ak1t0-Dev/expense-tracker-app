import React from "react";
import "./App.css";
import { HomePage } from "./pages/HomePage/HomePage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login/Login";
import { Register } from "./pages/Register/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/check" element={<Check />} />
        <Route path="/diagnosis" element={<Diagnosis />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;

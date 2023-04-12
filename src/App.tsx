import "./App.css";
import { HomePage } from "./pages/HomePage/HomePage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login/Login";
import { Register } from "./pages/Register/Register";
import { Main } from "./pages/Main/Main";
import { Friends } from "./pages/Friends/Friends";
import { Expense } from "./pages/Expense/Expense";
import { History } from "./pages/History/History";
import { Acccount } from "./pages/Account/Acccount";
import { Groups } from "./pages/Groups/Groups";
import { useEffect, useState } from "react";
import AuthContext from "./contexts/AuthContext";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check local storage for a user session or token
    const isLoggedIn = !!localStorage.getItem("expense-tracker");
    setIsLoggedIn(isLoggedIn);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("expense-tracker");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, handleLogout }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/main" element={<Main />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/history" element={<History />} />
          <Route path="/expense" element={<Expense />} />
          <Route path="/account" element={<Acccount />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;

import "./App.css";
import { HomePage } from "./pages/HomePage/HomePage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login/Login";
import { Register } from "./pages/Register/Register";
import { FriendsList } from "./pages/FriendsList/FriendsList";
import { Expense } from "./pages/Expense/Expense";
import { History } from "./pages/History/History";
import { Acccount } from "./pages/Account/Acccount";
import { GroupsList } from "./pages/GroupsList/GroupsList";
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
          <Route path="/friends" element={<FriendsList />} />
          <Route path="/groups" element={<GroupsList />} />
          <Route path="/history" element={<History />} />
          <Route path="/expense" element={<Expense />} />
          <Route path="/account" element={<Acccount />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;

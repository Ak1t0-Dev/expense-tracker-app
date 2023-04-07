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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/main" element={<Main />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/history" element={<History />} />
        <Route path="/expense" element={<Expense />} />
        <Route path="/account" element={<Acccount />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

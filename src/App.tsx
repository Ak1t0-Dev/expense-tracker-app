import "./App.css";
import { HomePage } from "./pages/HomePage/HomePage";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login/Login";
import { Register } from "./pages/Register/Register";
import { MyFriendsList } from "./pages/MyFriendsList/MyFriendsList";
import { Expense } from "./pages/Expense/Expense";
import { History } from "./pages/History/History";
import { Acccount } from "./pages/Account/Acccount";
import { MyGroupsList } from "./pages/MyGroupsList/MyGroupsList";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";

function App() {
  const isLoginned = useSelector(
    (state: RootState) => state.userStatus.isLoginned
  );

  const userLoginState = (component: JSX.Element) => {
    return isLoginned ? component : <Navigate to="/" />;
  };

  const userLogoutState = (component: JSX.Element) => {
    return isLoginned ? <Navigate to="/expense" /> : component;
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* before login */}
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={userLogoutState(<Login />)} />
        <Route path="/expense" element={userLoginState(<Expense />)} />
        <Route path="/friends" element={userLoginState(<MyFriendsList />)} />
        <Route path="/groups" element={userLoginState(<MyGroupsList />)} />
        <Route path="/history" element={userLoginState(<History />)} />
        <Route path="/account" element={userLoginState(<Acccount />)} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

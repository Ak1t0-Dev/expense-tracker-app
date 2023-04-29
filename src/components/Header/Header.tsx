import { AiOutlineUser } from "react-icons/ai";
import { GrGroup } from "react-icons/gr";
import { AiOutlineHistory } from "react-icons/ai";
import { VscAccount } from "react-icons/vsc";
import { RiLogoutBoxRLine } from "react-icons/ri";

import "./Header.css";
import { Button } from "../Button/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/user/userSlice";

export const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };
  return (
    <header className="header pt-5 pb-3">
      <ul className="header-list">
        <li className="header-button">
          <Button
            name="Add an expense"
            textColor="text-amber-50"
            bgColor="bg-amber-800"
            hoverColor="hover:bg-amber-700"
            focusColor="focus:bg-amber-800"
            onClick={() => navigate("/expense")}
          />
        </li>
        <li className="header-item" onClick={() => navigate("/friends")}>
          <AiOutlineUser />
          Friends
        </li>
        <li className="header-item" onClick={() => navigate("/groups")}>
          <GrGroup />
          Groups
        </li>
        <li className="header-item" onClick={() => navigate("/history")}>
          <AiOutlineHistory />
          History
        </li>
        <li className="header-item" onClick={() => navigate("/account")}>
          <VscAccount />
          Account
        </li>
        <li className="header-item" onClick={handleLogout}>
          <RiLogoutBoxRLine />
          Logout
        </li>
      </ul>
    </header>
  );
};

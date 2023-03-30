import React from "react";
import { AiOutlineUser } from "react-icons/ai";
import { GrGroup } from "react-icons/gr";
import { AiOutlineHistory } from "react-icons/ai";
import { VscAccount } from "react-icons/vsc";
import "./Header.css";
import { Button } from "../Button/Button";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();
  return (
    <header className="header py-5">
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
        <li className="header-item">
          <AiOutlineUser />
          Friends
        </li>
        <li className="header-item">
          <GrGroup />
          Groups
        </li>
        <li className="header-item">
          <AiOutlineHistory />
          History
        </li>
        <li className="header-item">
          <VscAccount />
          Account
        </li>
      </ul>
    </header>
  );
};

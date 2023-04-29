import { FC } from "react";
import { MainContainerProps } from "../../types/types";
import "./MainContainer.css";

export const MainContainer: FC<MainContainerProps> = ({ children }) => {
  return (
    <div id="main-container" className="rounded-lg shadow-lg shadow-amber-900">
      {children}
    </div>
  );
};

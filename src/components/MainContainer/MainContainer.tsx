import { FC, ReactNode } from "react";
import "./MainContainer.css";

interface Props {
  children: ReactNode;
}
export const MainContainer: FC<Props> = ({ children }) => {
  return (
    <div id="main-container" className="rounded-lg shadow-lg shadow-amber-900">
      {children}
    </div>
  );
};

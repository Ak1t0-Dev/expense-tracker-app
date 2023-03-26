import React from "react";
import { Button } from "../../components/Button/Button";
import { MainContainer } from "../../components/MainContainer/MainContainer";
import { GiReceiveMoney } from "react-icons/gi";
import "./HomePage.css";

export const HomePage = () => {
  return (
    <>
      <MainContainer>
        <h1>
          <GiReceiveMoney style={{ display: "inline" }} />
          SES
        </h1>
        <h2>SMART EXPENSE SAVER</h2>
        <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8">
            <div>
              <Button
                name="LOGIN"
                textColor="text-amber-50"
                bgColor="bg-amber-800"
                hoverColor="hover:bg-amber-700"
                focusColor="focus:bg-amber-800"
              />
              <Button
                name="REGISTER"
                textColor="text-yellow-50"
                bgColor="bg-yellow-800"
                hoverColor="hover:bg-yellow-700"
                focusColor="focus:bg-yellow-800"
              />
            </div>
          </div>
        </div>
      </MainContainer>
    </>
  );
};

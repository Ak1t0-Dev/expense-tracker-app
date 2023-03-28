import React from "react";

interface Style {
  name: string;
  textColor: string;
  bgColor: string;
  hoverColor: string;
  focusColor: string;
  onClick?: () => void;
}

export const Button = (props: Style) => {
  return (
    <button
      type="submit"
      className={`${props.textColor} ${props.bgColor} ${props.hoverColor} ${props.focusColor} group relative flex w-full justify-center rounded-md py-2 px-3 text-md font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 drop-shadow-dark my-6`}
      onClick={props.onClick}
    >
      {props.name}
    </button>
  );
};

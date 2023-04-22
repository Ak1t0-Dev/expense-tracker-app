import { ButtonProps } from "../../types/types";

export const Button = (props: ButtonProps) => {
  const bgStyle = {
    bgColor: props.disabled ? "bg-gray-700" : props.bgColor,
    hoverColor: props.disabled ? "hover:bg-gray-700" : props.hoverColor,
    focusColor: props.disabled ? "focus:bg-gray-700" : props.focusColor,
    cursor: props.disabled ? "not-allowed" : "pointer",
  };

  return (
    <button
      type="submit"
      className={`${props.textColor} ${bgStyle.bgColor} group relative flex w-full justify-center rounded-md py-2 px-3 text-md font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 drop-shadow-dark my-6`}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.name}
    </button>
  );
};

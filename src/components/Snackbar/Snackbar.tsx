import React from "react";

interface SnackbarProps {
  type: "success" | "error" | "info";
  message: string;
}

export const Snackbar = ({ type, message }: SnackbarProps) => {
  const getStyle = () => {
    switch (type) {
      case "success":
        return {
          borderColor: "border-green-600",
          textColor: "text-green-600",
        };
      case "error":
        return {
          borderColor: "border-red-600",
          textColor: "text-red-600",
        };
      case "info":
        return {
          borderColor: "border-blue-600",
          textColor: "text-blue-600",
        };
      default:
        return {
          borderColor: "",
          textColor: "",
        };
    }
  };

  const style = getStyle();

  return (
    <div
      role="alert"
      className={`mx-2 sm:mx-auto max-w-sm border ${style.borderColor} flex flex-row items-center justify-between bg-gray-50 shadow-lg p-3 text-sm leading-none font-medium rounded-xl whitespace-no-wrap`}
    >
      <div className={`inline-flex items-center ${style.textColor}`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
        {message}
      </div>
    </div>
  );
};

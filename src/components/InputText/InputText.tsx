import React from "react";

interface Style {
  title: string;
  id: string;
  name: string;
  type: string;
  autoComplete: string;
  placeholder: string;
}

export const InputText = (props: Style) => {
  return (
    <div>
      <label htmlFor={props.id}>{props.title}</label>
      <input
        id={props.id}
        name={props.name}
        type={props.type}
        autoComplete={props.autoComplete}
        required
        className="relative block w-full rounded-md border-0 px-2.5 py-1.5 mb-4 text-black font-semibold ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-1 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6"
        placeholder={props.placeholder}
      />
    </div>
  );
};

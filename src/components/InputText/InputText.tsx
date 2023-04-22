import { InputTextProps } from "../../types/types";

export const InputText = (props: InputTextProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange(e.target.value);
  };

  return (
    <div>
      <label htmlFor={props.id}>{props.title}</label>
      <input
        id={props.id}
        name={props.name}
        value={props.value}
        type={props.type}
        autoComplete={props.autoComplete}
        required
        className="relative block w-full rounded-md border-0 px-2.5 py-1.5 text-black font-semibold ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-1 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6"
        placeholder={props.placeholder}
        onChange={handleInputChange}
      />
      <span className="text-red-600 inline-block h-4">{props.error}</span>
    </div>
  );
};

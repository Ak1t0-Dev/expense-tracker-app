import { RxCross1 } from "react-icons/rx";

interface SelectedTagProps {
  item: string;
  index: number;
  handleRemoveItem: () => void;
}

export const SelectedTag = ({
  item,
  index,
  handleRemoveItem,
}: SelectedTagProps) => {
  return (
    <span
      className="inline-block flex-none px-2 py-1 border border-gray-400 rounded-xl"
      key={index}
    >
      {item}
      <RxCross1 className="ml-1 inline text-xs" onClick={handleRemoveItem} />
    </span>
  );
};

interface SeacrhProps {
  onClick: () => void;
}

export const SearchButton = ({ onClick }: SeacrhProps) => {
  return (
    <button
      type="submit"
      className="flex flex-row items-center w-32 px-2.5 py-1.5 text-sm text-white bg-green-600 rounded-lg border border-green-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
      onClick={onClick}
    >
      <svg
        aria-hidden="true"
        className="w-4 h-4 mr-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        ></path>
      </svg>
      <span className="font-semibold">Search</span>
    </button>
  );
};

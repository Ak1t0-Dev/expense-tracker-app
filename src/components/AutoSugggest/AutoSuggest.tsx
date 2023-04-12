import { useState } from "react";
import Autosuggest from "react-autosuggest";
import { RxCross1 } from "react-icons/rx";
import { Friends } from "../../pages/Expense/Expense";

interface AutoSuggestProps {
  friends: Friends[]; // modify: importing from expense
  handleGetFriends: (value: string) => string;
  handleDeleteFriends: (value: string) => void;
  addedFriends: string[];
}

export const AutoSuggest = ({
  friends,
  addedFriends,
  handleGetFriends,
  handleDeleteFriends,
}: AutoSuggestProps) => {
  const [suggestionItem, setsuggestionItem] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const getSuggestions = (value: string): string[] => {
    // change Friends[] to string[]
    const changeTypeFriends = friends.map((friend) => friend.email);

    return changeTypeFriends.filter((friend) => {
      const lowerCasedFriend = friend.toLowerCase();
      return lowerCasedFriend.startsWith(value.trim().toLowerCase());
    });
  };

  const renderSuggestion = (suggestion: string) => {
    return <span>{suggestion}</span>;
  };

  return (
    <div>
      <h3>Choose your expense-sharing partners:</h3>
      <Autosuggest // ■ 古いため、エラー
        suggestions={suggestions}
        alwaysRenderSuggestions
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        onSuggestionsFetchRequested={({ value }) => {
          setsuggestionItem(value);
          setSuggestions(getSuggestions(value));
        }}
        getSuggestionValue={handleGetFriends}
        renderSuggestion={renderSuggestion}
        inputProps={{
          placeholder: "Enter a email address",
          value: suggestionItem,
          onChange: (_, { newValue }) => {
            setsuggestionItem(newValue);
          },
        }}
        highlightFirstSuggestion={true}
      />
      {/* <div className="h-28 px-2 flex row flex-start flex-wrap items-start overflow-auto gap-1"> */}
      <div className="h-12 px-2 flex row flex-start flex-wrap items-start overflow-auto gap-1">
        {addedFriends.map((friend, index) => {
          return (
            <span
              className="inline-block flex-none px-2 py-1 border border-gray-400 rounded-xl"
              key={index}
              onClick={() => handleDeleteFriends(friend)}
            >
              {friend}
              <RxCross1 className="ml-1 inline text-xs" />
            </span>
          );
        })}
      </div>
    </div>
  );
};

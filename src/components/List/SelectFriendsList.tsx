import { ObjectId } from "mongoose";
import { Friends } from "../../types/types";

export interface selectFriendsListProps {
  filteredFriends: Friends[];
  selectedFriends: Friends[];
  handleCheckedChange: (
    _id: ObjectId,
    email: string,
    name: string,
    checked: boolean
  ) => void;
}

export const SelectFriendsList = ({
  filteredFriends,
  selectedFriends,
  handleCheckedChange,
}: selectFriendsListProps) => {
  return (
    <ul className="flex flex-col p-6 border-gray-200 rounded-b overflow-auto h-80">
      {filteredFriends.map((friend, index) => (
        <li key={index}>
          <input
            className="hidden peer"
            type="checkbox"
            name="friends"
            value={friend.email}
            id={index.toString()}
            checked={
              selectedFriends.find(
                (selectedFriend) => selectedFriend.email === friend.email
              )
                ? true
                : false
            }
            onChange={(event) =>
              handleCheckedChange(
                friend._id,
                friend.email,
                friend.name,
                event.target.checked
              )
            }
          />
          <label
            className="mb-2 font-medium bg-yellow-200 border-2 border-black px-4 py-2 flex flex-row justify-between cursor-pointer peer-checked:bg-blue-600"
            htmlFor={index.toString()}
            key={index}
          >
            <span className="inline-block">{friend.name}</span>
            <span className="inline-block">{friend.email}</span>
          </label>
        </li>
      ))}
    </ul>
  );
};

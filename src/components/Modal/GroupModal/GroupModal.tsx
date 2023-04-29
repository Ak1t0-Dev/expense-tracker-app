import { useEffect, useState } from "react";
import { InputText } from "../../InputText/InputText";
import { fetchedFriendsData, validateLength } from "../../../utils/utils";
// import { AutoSuggest } from "../../AutoSugggest/AutoSuggest";
import { Button } from "../../Button/Button";
import { Snackbar } from "../../Snackbar/Snackbar";
import {
  CATCHED_ERROR,
  REGISTER_ERROR,
  REGISTER_SUCCESSFUL,
} from "../../../constants/message";
import { STATUS } from "../../../constants/constants";
import { ExpenseGroup, Friends, GroupModalProps } from "../../../types/types";
import { SelectFriendsList } from "../../List/SelectFriendsList";
import { SelectedTag } from "../../Tag/SelectedTag";
import { ObjectId } from "mongoose";

export const GroupModal = ({
  onClose,
  userEmail,
  fetchedGroupsData,
}: GroupModalProps) => {
  const [groupName, setGroupName] = useState("");
  const [groupNameError, setGroupNameError] = useState("");
  const [friends, setFriends] = useState<Friends[]>([]);
  const [filteredFriends, setFilteredFriends] = useState<Friends[]>(friends);
  const [checkedFriends, setCheckedFriends] = useState<Friends[]>([]);

  const [status, setStatus] = useState<STATUS>(STATUS.EMPTY);
  const [message, setMessage] = useState("");

  // to disable a button
  const isDisabled = groupName.trim() === "" || checkedFriends.length === 0;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    let isValid = true;
    event.preventDefault();
    // validations
    isValid = validateLength({
      target: groupName,
      fieldName: "Group name",
      min: 1,
      max: 30,
      fieldError: setGroupNameError,
    });

    if (isValid) {
      const isGroupRegistered = await createGroup();
      if (isGroupRegistered) {
        setTimeout(() => {
          handleInputReset();
          onClose();
          fetchedGroupsData(userEmail);
        }, 1000);
      }
    }
  };

  const handleCheckedChange = (
    _id: ObjectId,
    email: string,
    name: string,
    isChecked: boolean
  ): void => {
    if (isChecked) {
      const addFriend: Friends = { _id: _id, email: email, name: name };
      const updateFriends = [...checkedFriends, addFriend];
      setCheckedFriends(updateFriends);
    } else {
      removeSelectedFriend(email);
    }
  };

  const handleInputReset = () => {
    setFilteredFriends([]);
    setGroupName("");
  };

  // ----------------------------------------------------------------
  // create a group and members and save an expense to a collection
  // ----------------------------------------------------------------
  const createGroup = async (): Promise<boolean> => {
    const group: ExpenseGroup = {
      group_name: groupName,
      email: userEmail,
      members: checkedFriends,
    };

    try {
      console.log(group);
      const response = await fetch("http://localhost:3001/api/register/group", {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(group),
      });

      if (response.ok) {
        setMessage(REGISTER_SUCCESSFUL);
        setStatus(STATUS.SUCCESS);
        return true;
      } else {
        setMessage(REGISTER_ERROR);
        setStatus(STATUS.ERROR);
        return false;
      }
    } catch (err) {
      setMessage(CATCHED_ERROR);
      setStatus(STATUS.ERROR);
      console.error(err);
      return false;
    }
  };

  useEffect(() => {
    fetchedFriendsData({ email: userEmail, setFriends, setMessage, setStatus });
  }, [userEmail]);

  if (!userEmail) {
    return null;
  }

  const handleRemoveFriends = (email: string) => {
    removeSelectedFriend(email);
  };

  const removeSelectedFriend = (email: string) => {
    const updatedFriends = checkedFriends.filter(
      (friend) => friend.email !== email
    );
    setCheckedFriends(updatedFriends);
  };

  const handleGroupNameChange: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    setGroupName(e.target.value);
  };

  return (
    <div
      id="small-modal"
      className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] md:h-full flex items-center justify-center"
    >
      <div className="relative w-full h-full max-w-md md:h-auto">
        <form onSubmit={handleSubmit} className="p-4">
          <div className="relative bg-white rounded-lg shadow border-2 border-black">
            <div className="flex items-center justify-between pt-5 px-5 rounded-t">
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="small-modal"
                onClick={onClose}
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div className="p-6 space-y-6">
              <InputText
                id="group"
                title="Group name:"
                name="group"
                value={groupName}
                onChange={handleGroupNameChange}
                type="text"
                autoComplete="off"
                placeholder="Enter a group name"
                error={groupNameError}
              />
              <SelectFriendsList
                filteredFriends={friends}
                selectedFriends={checkedFriends}
                handleCheckedChange={handleCheckedChange}
              />
              <div className="h-12 px-2 flex row flex-start flex-wrap items-start overflow-auto gap-1">
                {checkedFriends.map((friend, index) => {
                  return (
                    <SelectedTag
                      item={friend.name}
                      index={index}
                      handleRemoveItem={() => handleRemoveFriends(friend.email)}
                    />
                  );
                })}
              </div>
            </div>
            <div className="flex items-center p-6 space-x-2">
              <Button
                name="SAVE"
                textColor="text-amber-50"
                bgColor="bg-amber-800"
                hoverColor="hover:bg-amber-700"
                focusColor="focus:bg-amber-800"
                disabled={isDisabled}
              />
            </div>
          </div>
        </form>
      </div>
      {status !== "" && <Snackbar type={status} message={message} />}
    </div>
  );
};

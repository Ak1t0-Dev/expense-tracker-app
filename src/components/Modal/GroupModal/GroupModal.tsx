import { useEffect, useState } from "react";
import { InputText } from "../../InputText/InputText";
import { validateLength } from "../../../utils/utils";
// import { AutoSuggest } from "../../AutoSugggest/AutoSuggest";
import { Button } from "../../Button/Button";
import { Snackbar } from "../../Snackbar/Snackbar";
import {
  CATCHED_ERROR,
  REGISTER_ERROR,
  REGISTER_SUCCESSFUL,
  RETRIEVED_ERROR,
} from "../../../constants/message";
import { STATUS } from "../../../constants/constants";
import { ExpenseGroup, Friends, GroupModalProps } from "../../../types/types";

export const GroupModal = ({
  onClose,
  userEmail,
  fetchedGroupsData,
}: GroupModalProps) => {
  const [groupName, setGroupName] = useState("");
  const [groupNameError, setGroupNameError] = useState("");
  const [friends, setFriends] = useState<Friends[]>([]);
  const [addedFriends, setAddedFriends] = useState<string[]>([]);
  const [status, setStatus] = useState<STATUS>(STATUS.EMPTY);
  const [message, setMessage] = useState("");

  // to disable a button
  const isDisabled = groupName.trim() === "" || addedFriends.length === 0;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    let isValid = true;
    event.preventDefault();
    // validations
    isValid = validateLength({
      target: groupName,
      fieldName: "User name",
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

  const handleInputReset = () => {
    setAddedFriends([]);
    setGroupName("");
  };

  // for AutoSuggest
  const handleGetFriends = (value: string) => {
    setAddedFriends([...addedFriends, value]);
    return value;
  };
  // for AutoSuggest
  const handleDeleteFriends = (value: string) => {
    const index = addedFriends.indexOf(value);
    if (index > -1) {
      const newAddedFriends = [...addedFriends];
      newAddedFriends.splice(index, 1);
      setAddedFriends(newAddedFriends);
    }
  };

  // ----------------------------------------------------------------
  // create a group and members and save an expense to a collection
  // ----------------------------------------------------------------
  const createGroup = async (): Promise<boolean> => {
    const group: ExpenseGroup = {
      group_name: groupName,
      email: userEmail,
      members: addedFriends,
    };

    try {
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

  const fetchFriendsData = async (email: string) => {
    try {
      const response = await fetch("http://localhost:3001/api/get/friends", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }),
      });
      if (response.ok) {
        const data = await response.json();
        setFriends(data);
        return true;
      } else {
        setMessage(RETRIEVED_ERROR);
        setStatus(STATUS.ERROR);
        return false;
      }
    } catch (error) {
      console.log(error);
      setMessage(CATCHED_ERROR);
      setStatus(STATUS.ERROR);
      return false;
    }
  };

  useEffect(() => {
    fetchFriendsData(userEmail);
  }, [userEmail]);

  if (!userEmail) {
    return null;
  }

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
                onChange={setGroupName}
                type="text"
                autoComplete="off"
                placeholder="Enter a group name"
                error={groupNameError}
              />
              {/* <AutoSuggest
                friends={friends}
                addedFriends={addedFriends}
                handleGetFriends={handleGetFriends}
                handleDeleteFriends={handleDeleteFriends}
              /> */}
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

import { useEffect, useState } from "react";
import { InputText } from "../../InputText/InputText";
import { isStringExist, validateLength } from "../../../utils/utils";
import { AutoSuggest } from "../../AutoSugggest/AutoSuggest";
import { Friends } from "../../../pages/Expense/Expense";
import { Button } from "../../Button/Button";
import { Snackbar } from "../../Snackbar/Snackbar";
import {
  CATCHED_ERROR,
  EMPTY,
  GROUP_NAME_LENGTH,
  REGISTER_ERROR,
  REGISTER_SUCCESSFUL,
} from "../../../constants/message";
import { STATUS } from "../../../constants/constants";

interface ModalProps {
  onClose: () => void;
  userEmail: string;
}

interface Group {
  group_name: string;
  email: string;
  members: string[];
}

export const GroupModal = ({ onClose, userEmail }: ModalProps) => {
  const [groupName, setGroupName] = useState("");
  const [groupNameError, setGroupNameError] = useState("");
  const [friends, setFriends] = useState<Friends[]>([]);
  const [addedFriends, setAddedFriends] = useState<string[]>([]);
  const [status, setStatus] = useState<STATUS>(STATUS.EMPTY);
  const [message, setMessage] = useState("");
  // to disable a button
  const min = 1;
  const max = 50;
  const isDisabled = groupName.trim() === "" || addedFriends.length === 0;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    let isValid = true;
    event.preventDefault();
    // validations
    const isGroupNameValid = isStringExist(groupName);

    if (!isGroupNameValid) {
      setGroupNameError(GROUP_NAME_LENGTH);
      isValid = false;
    } else {
      setGroupNameError(EMPTY);
    }

    if (isValid) {
      const isGroupRegistered = await createGroup();
      if (isGroupRegistered) {
        handleInputReset();
      }
    }
  };

  const handleInputReset = () => {
    setAddedFriends([]);
    setGroupName("");
  };

  const handleGroupChange = (value: string) => {
    setGroupName(value);

    if (!validateLength(value, min, max)) {
      setGroupNameError(GROUP_NAME_LENGTH);
    } else {
      setGroupNameError(EMPTY);
    }
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
    const group: Group = {
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

  useEffect(() => {
    const postUser = {
      email: userEmail,
    };
    fetch("http://localhost:3001/api/friends", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postUser),
    })
      .then((response) => response.json())
      .then((data) => {
        setFriends(data);
      });
  }, [userEmail]);

  if (!userEmail) {
    return null; // if userEmail is null or undefined, don't render the modal
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
                onChange={handleGroupChange}
                type="text"
                autoComplete="off"
                placeholder="Enter a group name"
                error={groupNameError}
              />
              <AutoSuggest
                friends={friends}
                addedFriends={addedFriends}
                handleGetFriends={handleGetFriends}
                handleDeleteFriends={handleDeleteFriends}
              />
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
      {status !== "" ? <Snackbar type={status} message={message} /> : null}
    </div>
  );
};
